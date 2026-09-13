import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import PageShell from '@/components/layout/PageShell';
import ContactForm from '@/components/forms/ContactForm';
import Reveal from '@/components/motion/Reveal';
import { ACTIVE_LOCALES, DEFAULT_LOCALE, isActiveLocale } from '@/i18n/routing';
import { COMPANY } from '@/content/site';

type PageProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return ACTIVE_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isActiveLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: 'contact' });
  return {
    title: t('heading'),
    description: t('lead'),
    openGraph: { title: t('heading'), description: t('lead') },
  };
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(isActiveLocale(locale) ? locale : DEFAULT_LOCALE);

  const t = await getTranslations('contact');

  return (
    <PageShell label={t('label')} heading={t('heading')} lead={t('lead')}>
      {/*
        폼 앞에 회신 기준과 전화 문의를 둡니다.
        제조 담당자는 메일보다 전화를 먼저 걸고, 언제 답이 오는지 모르면 보내고 나서 불안합니다.
        대표전화는 COMPANY.tel이 확보되면 자동으로 나타납니다 — 값을 지어내지 않습니다.
      */}
      <Reveal className="mt-10">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-line pt-6 text-caption">
          <p className="text-navy-700/70">{t('responseNote')}</p>
          {!COMPANY.tel.pending && (
            <a
              href={`tel:${COMPANY.tel.value.replace(/[^0-9+]/g, '')}`}
              className="font-medium text-azure-600 underline-offset-4 hover:underline"
            >
              {t('phoneLabel')} {COMPANY.tel.value}
            </a>
          )}
        </div>
      </Reveal>

      <Reveal className="mt-12">
        <ContactForm />
      </Reveal>

      {/*
        전에는 여기서 form.errorBody("잠시 후 다시 시도해주세요...")를 무조건 그렸습니다.
        아무것도 보내지 않은 사람에게 전송 실패 문구가 먼저 보였고,
        실제 실패했을 때는 폼 안의 에러 상자와 같은 문장이 두 번 나왔습니다.

        전송 실패 안내는 ContactForm이 status.kind === 'error'일 때만 그립니다.
        여기 남는 것은 「폼 말고 다른 방법」이라는 중립적인 안내여야 합니다.
      */}
      <Reveal className="mt-12">
        <p className="text-caption text-navy-700/70">
          {t('altContact')}{' '}
          <a
            href={`mailto:${COMPANY.email}`}
            className="font-medium text-azure-600 underline-offset-4 hover:underline"
          >
            {COMPANY.email}
          </a>
        </p>
      </Reveal>
    </PageShell>
  );
}
