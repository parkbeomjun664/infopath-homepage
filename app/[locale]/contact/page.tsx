import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import PageShell from '@/components/layout/PageShell';
import ContactForm from '@/components/forms/ContactForm';
import Reveal from '@/components/motion/Reveal';
import { ACTIVE_LOCALES, DEFAULT_LOCALE, isActiveLocale } from '@/i18n/routing';
import { COMPANY } from '@/content/site';

/**
 * /contact — 도입 문의
 *
 * 전에는 폼만 덩그러니 있었고 넓은 화면에서 오른쪽 40%가 비었습니다.
 * 빈 자리를 장식으로 채우지 않고, 문의를 멈추게 하는 이유들을 옆에 놓았습니다.
 *
 *   「뭘 써야 할지 모르겠다」  → 무엇을 적어주시면 되는지
 *   「보내고 나면 어떻게 되나」 → 접수 · 검토 · 회신
 *   「폼 말고 그냥 전화하고 싶다」 → 전화 · 이메일을 위에
 *
 * 제조 담당자는 메일보다 전화를 먼저 겁니다. 그래서 연락 수단을 폼보다 앞에 둡니다.
 */

type PageProps = { params: Promise<{ locale: string }> };

type Step = { id: string; title: string; body: string };

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

  const guideItems = t.raw('guide.items') as string[];
  const steps = t.raw('flow.steps') as Step[];

  return (
    <PageShell label={t('label')} heading={t('heading')} lead={t('lead')}>
      {/*
        폼이 왼쪽입니다. 이 페이지에 온 사람은 읽으러 온 게 아니라 쓰러 왔고,
        입력란이 오른쪽으로 밀리면 시선과 손이 매번 건너가야 합니다.
        안내는 곁다리이므로 옆으로 보냅니다.

        DOM 순서는 안내가 먼저입니다 — 좁은 화면에서는 무엇을 적으면 되는지
        먼저 읽고 폼으로 내려가는 편이 자연스럽습니다.
        넓은 화면에서만 격자 위치로 좌우를 바꿉니다.
      */}
      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_296px] lg:gap-14">
        {/* ── 폼을 채우기 전에 읽을 것들 ───────────────── */}
        <div className="flex flex-col gap-9 lg:col-start-2 lg:row-start-1">
          <Reveal>
            <p className="label-mono text-fg-subtle">{t('channelHeading')}</p>
            <div className="mt-4 flex flex-col gap-2">
              {/* 대표전화는 COMPANY.tel이 확보되면 나타납니다 — 값을 지어내지 않습니다 */}
              {!COMPANY.tel.pending && (
                <a
                  href={`tel:${COMPANY.tel.value.replace(/[^0-9+]/g, '')}`}
                  className="text-h4 font-medium tracking-[-0.01em] text-navy-900 underline-offset-4 hover:text-azure-600 hover:underline"
                >
                  {COMPANY.tel.value}
                </a>
              )}
              <a
                href={`mailto:${COMPANY.email}`}
                className="text-caption font-medium text-azure-600 underline-offset-4 hover:underline"
              >
                {COMPANY.email}
              </a>
            </div>
            <p className="mt-4 text-caption leading-relaxed text-navy-700/65">
              {t('responseNote')}
            </p>
          </Reveal>

          <Reveal>
            <div className="border-t border-line pt-7">
              <h2 className="text-body font-medium text-navy-900">{t('guide.heading')}</h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {guideItems.map((item) => (
                  <li key={item} className="grid grid-cols-[auto_1fr] gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-[9px] h-1 w-1 rounded-full bg-green-500"
                    />
                    <span className="text-caption leading-relaxed text-navy-700/75">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-caption leading-relaxed text-navy-700/60">
                {t('guide.note')}
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="border-t border-line pt-7">
              <h2 className="text-body font-medium text-navy-900">{t('flow.heading')}</h2>
              <ol className="mt-4 flex flex-col gap-4">
                {steps.map((s, i) => (
                  <li key={s.id} className="grid grid-cols-[auto_1fr] gap-3.5">
                    <span className="mt-0.5 font-mono text-[12px] leading-none text-green-600">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="text-caption font-medium text-navy-900">{s.title}</p>
                      <p className="mt-1 text-caption leading-relaxed text-navy-700/65">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>

        {/* ── 폼 ───────────────────────────────────── */}
        <Reveal className="min-w-0 lg:col-start-1 lg:row-start-1">
          <ContactForm />
        </Reveal>
      </div>
    </PageShell>
  );
}
