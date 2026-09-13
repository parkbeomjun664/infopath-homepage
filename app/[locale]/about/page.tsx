import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import Image from 'next/image';

import PageShell from '@/components/layout/PageShell';
import CtaBanner from '@/components/sections/CtaBanner';
import CeoProfile from '@/components/sections/CeoProfile';
import Reveal from '@/components/motion/Reveal';
import { ACTIVE_LOCALES, DEFAULT_LOCALE, isActiveLocale } from '@/i18n/routing';
import { ASSETS, ASSET_DIMENSIONS, COMPANY, SECTIONS } from '@/content/site';

/**
 * /about — 골격
 * 회사 소개 본문·연혁·조직은 확인 후 채웁니다 (기획서 09-Q2).
 */

type PageProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return ACTIVE_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isActiveLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: 'about' });
  return { title: t('heading').replace('\n', ' '), description: t('lead') };
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(isActiveLocale(locale) ? locale : DEFAULT_LOCALE);

  const t = await getTranslations('about');
  const tf = await getTranslations('footer');

  // 미확보 항목은 공개 화면에서 감추고 개발 중에만 표시합니다 (푸터와 같은 규칙).
  const showPending = process.env.NODE_ENV !== 'production';

  return (
    <>
      <PageShell label={t('label')} heading={t('heading')} lead={t('lead')}>
        <Reveal className="mt-12">
          <div className="overflow-hidden rounded-lg">
            <Image
              src={ASSETS.heroRobot}
              alt={t('imageAlt')}
              width={ASSET_DIMENSIONS.heroRobot.width}
              height={ASSET_DIMENSIONS.heroRobot.height}
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
              className="aspect-[21/9] w-full object-cover sm:aspect-[3/1]"
            />
          </div>
        </Reveal>

        {/* 회사 개요 — 회사소개서(2025.04)·사업자등록증에서 확인된 값만 싣습니다 */}
        <Reveal className="mt-20">
          <div className="border-t border-line pt-10">
            <h2 className="text-h3 font-medium tracking-[-0.02em] text-navy-900">
              {t('profile.heading')}
            </h2>

            <dl className="mt-6 grid gap-px overflow-hidden rounded border border-line bg-line sm:grid-cols-2">
              {[
                { k: t('profile.foundedLabel'), v: t('profile.foundedValue') },
                { k: t('profile.headcountLabel'), v: t('profile.headcountValue') },
                { k: t('profile.fieldLabel'), v: t('profile.fieldValue') },
                { k: t('profile.industriesLabel'), v: t('profile.industriesValue') },
              ].map((row) => (
                <div key={row.k} className="bg-white px-5 py-4">
                  <dt className="label-mono text-fg-subtle">{row.k}</dt>
                  <dd className="mt-1.5 text-caption font-medium text-navy-900">{row.v}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-5 max-w-prose text-[13px] leading-relaxed text-fg-subtle">
              {t('profile.note')}
            </p>
          </div>
        </Reveal>

        {/* 대표자 소개 — CEO_PROFILE.pending 동안은 공개 화면에 나가지 않습니다 */}
        {SECTIONS.ceo && <CeoProfile />}

        <Reveal className="mt-20">
          <div className="border-t border-line pt-10">
            <h2 className="text-h3 font-medium tracking-[-0.02em] text-navy-900">
              {t('bizHeading')}
            </h2>

            {/* 라벨은 푸터와 같은 메시지를 씁니다 — 하드코딩하면 영문 페이지에 한글이 남습니다 */}
            <dl className="mt-6 grid gap-px overflow-hidden rounded border border-line bg-line sm:grid-cols-2">
              {[
                { k: tf('company'), v: `${COMPANY.nameKo} (${COMPANY.nameEn})`, pending: false },
                { k: t('platformLabel'), v: COMPANY.platform, pending: false },
                { k: t('domainLabel'), v: COMPANY.domain, pending: false },
                { k: tf('email'), v: COMPANY.email, pending: false },
                /* TODO(사업자 정보): content/site.ts의 COMPANY에 값을 넣고 pending을 false로.
                   미확보 항목은 공개 화면에 그리지 않습니다 — 「대표자 —」는 정보가 아니라
                   미완성 신호일 뿐입니다. */
                { k: tf('ceo'), v: COMPANY.ceo.value, pending: COMPANY.ceo.pending },
                { k: tf('bizNo'), v: COMPANY.bizNo.value, pending: COMPANY.bizNo.pending },
                { k: tf('address'), v: COMPANY.address.value, pending: COMPANY.address.pending },
                { k: tf('tel'), v: COMPANY.tel.value, pending: COMPANY.tel.pending },
              ]
                .filter((row) => !row.pending || showPending)
                .map((row) => (
                  <div key={row.k} className="bg-white px-5 py-4">
                    <dt className="label-mono text-fg-subtle">{row.k}</dt>
                    <dd
                      className={`mt-1.5 text-caption font-medium ${
                        row.pending ? 'text-navy-700/45' : 'text-navy-900'
                      }`}
                    >
                      {row.pending ? '—' : row.v}
                    </dd>
                  </div>
                ))}
            </dl>

            <p className="mt-5 max-w-prose text-[13px] leading-relaxed text-fg-subtle">
              {t('bizNote')}
            </p>
          </div>
        </Reveal>
      </PageShell>
      <CtaBanner />
    </>
  );
}
