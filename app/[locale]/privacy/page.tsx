import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import PageShell from '@/components/layout/PageShell';
import Reveal from '@/components/motion/Reveal';
import { ACTIVE_LOCALES, DEFAULT_LOCALE, isActiveLocale } from '@/i18n/routing';
import { COMPANY, PRIVACY_OFFICER } from '@/content/site';

/**
 * /privacy — 개인정보처리방침
 *
 * ⚠️ 표준 양식 기반 초안입니다. 법무 검토 후 확정본으로 교체해야 합니다.
 * 문의 폼이 개인정보를 수집하므로 오픈 전 필수 항목입니다 (개인정보보호법 제30조).
 *
 * 대표자명 · 사업자등록번호 · 주소 · 대표전화 · 개인정보 보호책임자는 반영을 마쳤습니다.
 * TODO(시행일): 법무 검토로 확정본이 나오면 시행일을 넣고 draft 표시를 내립니다.
 */

type PageProps = { params: Promise<{ locale: string }> };

type Section = { id: string; title: string; body: string };

export function generateStaticParams() {
  return ACTIVE_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isActiveLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: 'privacy' });
  return {
    title: t('heading'),
    description: t('lead'),
    // 확정 전까지는 색인에서 제외합니다.
    robots: { index: false, follow: true },
  };
}

/** 문단 안 줄바꿈을 살립니다. */
function Body({ text }: { text: string }) {
  return (
    <div className="mt-3 space-y-1.5">
      {text.split('\n').map((line, i) =>
        line === '' ? (
          <div key={i} className="h-2" />
        ) : (
          <p key={i} className="text-caption leading-relaxed text-navy-700/70">
            {line}
          </p>
        ),
      )}
    </div>
  );
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(isActiveLocale(locale) ? locale : DEFAULT_LOCALE);

  const t = await getTranslations('privacy');
  const sections = t.raw('sections') as Section[];

  const PLACEHOLDER = '—';

  return (
    <PageShell label={t('label')} heading={t('heading')} lead={t('lead')}>
      {/*
        좌측 고정 목차 + 우측 본문.
        전에는 10개 조항이 max-w-prose 한 줄로 쌓여 있어, 넓은 화면에서 오른쪽이
        절반 가까이 비고 세로로만 끝없이 길었습니다. 방침은 처음부터 끝까지 읽는
        글이 아니라 「내 정보를 얼마나 갖고 있나」 같은 한 조항을 찾으러 오는 글이라,
        목차를 옆에 세워 두면 길이 자체가 문제가 되지 않습니다.
        본문 줄 길이는 그대로 둡니다 — 법률 문장은 한 줄이 길어지면 더 안 읽힙니다.
      */}
      <div className="mt-12 grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16">
        <div className="lg:sticky lg:top-[136px] lg:self-start">
          <Reveal>
            <div className="border-l-2 border-state-warn bg-white py-5 pl-5 pr-4">
              <p className="label-mono mb-2 text-state-warn">DRAFT</p>
              <p className="text-caption font-medium text-navy-900">{t('draftTitle')}</p>
              <p className="mt-1.5 text-caption leading-relaxed text-navy-700/70">
                {t('draftBody')}
              </p>
            </div>
          </Reveal>

          <Reveal className="mt-6">
            <p className="text-caption text-navy-700/60">
              {t('effectiveLabel')} · {t('effectivePending')}
            </p>
          </Reveal>

          {/* 목차 — 조항 제목이 이미 「1. 수집하는 …」 형태라 번호를 따로 붙이지 않습니다 */}
          <Reveal className="mt-8">
            <nav aria-label={t('tocLabel')} className="border-t border-line pt-4">
              <ul className="flex flex-col">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="block py-1.5 text-caption leading-snug text-navy-700/70 transition-colors hover:text-azure-600"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>
        </div>

        <div className="min-w-0">
      <div className="max-w-prose border-t border-line">
        {sections.map((s, i) => (
          <Reveal key={s.id}>
            <section id={s.id} className="scroll-mt-[120px] border-b border-line py-7">
              <h2 className="text-body font-medium text-navy-900">{s.title}</h2>
              <Body text={s.body} />

              {/* 보호책임자 항목에는 연락처와 회사 정보 자리표시자를 함께 둡니다 */}
              {s.id === 'manager' && (
                <dl className="mt-5 grid gap-px overflow-hidden rounded border border-line bg-line sm:grid-cols-2">
                  <div className="bg-white px-4 py-3">
                    <dt className="label-mono text-fg-subtle">개인정보 보호책임자</dt>
                    <dd className="mt-1.5 text-caption font-medium text-navy-900">
                      {PRIVACY_OFFICER.name} ({PRIVACY_OFFICER.role})
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-3">
                    <dt className="label-mono text-fg-subtle">상호</dt>
                    <dd className="mt-1.5 text-caption font-medium text-navy-900">
                      {COMPANY.nameKo} ({COMPANY.nameEn})
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-3">
                    <dt className="label-mono text-fg-subtle">대표전화</dt>
                    {/* 회색은 미확보 표시 전용입니다 — 값이 있으면 본문 색으로 그립니다 */}
                    <dd
                      className={`mt-1.5 text-caption font-medium ${
                        PRIVACY_OFFICER.tel.pending ? 'text-navy-700/55' : 'text-navy-900'
                      }`}
                    >
                      {PRIVACY_OFFICER.tel.pending ? (
                        PLACEHOLDER
                      ) : (
                        <a
                          href={`tel:${PRIVACY_OFFICER.tel.value.replace(/[^0-9+]/g, '')}`}
                          className="text-azure-600 underline-offset-4 hover:underline"
                        >
                          {PRIVACY_OFFICER.tel.value}
                        </a>
                      )}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-3">
                    <dt className="label-mono text-fg-subtle">이메일</dt>
                    <dd className="mt-1.5 text-caption font-medium">
                      <a
                        href={`mailto:${PRIVACY_OFFICER.email}`}
                        className="text-azure-600 underline-offset-4 hover:underline"
                      >
                        {PRIVACY_OFFICER.email}
                      </a>
                    </dd>
                  </div>
                </dl>
              )}
            </section>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-12">
        <div className="max-w-prose rounded border border-line bg-white p-6">
          <h2 className="text-body font-medium text-navy-900">{t('remedyTitle')}</h2>
          <Body text={t('remedyBody')} />
        </div>
      </Reveal>
        </div>
      </div>
    </PageShell>
  );
}
