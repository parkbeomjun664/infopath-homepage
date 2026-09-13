import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ACTIVE_LOCALES, isActiveLocale } from '@/i18n/routing';
import { COMPANY, CTA_VARIANT } from '@/content/site';
import { ALLOW_INDEXING, SITE_URL, absoluteUrl, alternateLanguages } from '@/lib/seo';
import { pretendard } from '@/lib/fonts';
import '../globals.css';

/**
 * 이 파일이 곧 루트 레이아웃입니다(app/layout.tsx는 두지 않습니다).
 * next-intl의 App Router 표준 구성으로, <html>이 로케일 세그먼트 안에 있어야
 * lang 속성을 로케일별로 정확히 내보낼 수 있습니다.
 */

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return ACTIVE_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Omit<LayoutProps, 'children'>): Promise<Metadata> {
  const { locale } = await params;
  if (!isActiveLocale(locale)) return {};

  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t('titleDefault'),
      template: t('titleTemplate'),
    },
    description: t('description'),
    applicationName: t('siteName'),
    /*
      아이콘은 app/icon.png · app/apple-icon.png · app/favicon.ico 파일 규칙이 담당합니다.
      여기서 icons를 지정하면 그 규칙을 덮어써 파일들이 링크로 나가지 않습니다.
      원본 로고(460×378 워드마크 포함)는 32px에서 글자가 뭉개져 파비콘으로 쓰지 않습니다 —
      심볼만 잘라 흰 배경 정사각으로 만든 것이 위 파일들입니다.
    */
    alternates: {
      canonical: absoluteUrl(locale, ''),
      languages: alternateLanguages(''),
    },
    openGraph: {
      type: 'website',
      siteName: t('siteName'),
      title: t('titleDefault'),
      description: t('description'),
      url: absoluteUrl(locale, ''),
      locale: locale === 'ko' ? 'ko_KR' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('titleDefault'),
      description: t('description'),
    },
    // 검토용 배포에서는 메타 태그로도 색인을 막습니다 (robots.txt와 이중 방어).
    robots: ALLOW_INDEXING
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!isActiveLocale(locale)) {
    notFound();
  }

  // 정적 렌더링을 위해 요청 로케일을 고정합니다.
  setRequestLocale(locale);

  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: 'meta' });

  /**
   * Organization 구조화 데이터.
   * 검색 결과에 회사 정보가 정리되어 노출되도록 돕습니다.
   * 사업자 정보가 미확보라 확인된 값만 넣습니다 — 지어내면 오히려 신뢰를 잃습니다.
   */
  const organizationLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: COMPANY.nameEn,
    alternateName: COMPANY.nameKo,
    url: SITE_URL,
    logo: `${SITE_URL}/images/infopath-logo.png`,
    description: t('description'),
    email: COMPANY.email,
    slogan: 'Start Small, Run Smart',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: COMPANY.email,
        availableLanguage: ['ko', 'en'],
      },
    ],
    foundingDate: COMPANY.foundingDate,
    // TODO(사업자 정보): 대표전화·주소 확보되면 telephone · address 추가
  };

  return (
    <html
      lang={locale}
      // CTA 색상 변형 — content/site.ts의 CTA_VARIANT가 CSS 변수 세트를 결정합니다.
      data-cta={CTA_VARIANT}
      className={pretendard.variable}
      suppressHydrationWarning
    >
      <body>
        {/*
          진입 애니메이션은 JS가 data-revealed를 세워야 보입니다.
          스크립트가 꺼져 있으면 콘텐츠가 영영 숨겨지므로 최종 상태로 고정합니다.
        */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          // 자체 생성한 객체만 직렬화합니다 — 사용자 입력이 섞이지 않습니다.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
        />

        <NextIntlClientProvider messages={messages}>
          {/* 헤더·푸터는 전 페이지 공통이라 레이아웃에 둡니다 */}
          <Header locale={locale} />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
