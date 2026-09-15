import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import Image from 'next/image';

import Container from '@/components/layout/Container';
import CtaBanner from '@/components/sections/CtaBanner';
import CeoProfile from '@/components/sections/CeoProfile';
import Reveal from '@/components/motion/Reveal';
import SectionLabel from '@/components/ui/SectionLabel';
import { ACTIVE_LOCALES, DEFAULT_LOCALE, isActiveLocale } from '@/i18n/routing';
import { ASSETS, ASSET_DIMENSIONS, COMPANY, SECTIONS } from '@/content/site';

/**
 * /about — 회사 소개
 *
 * 구성이 아니라 위계를 먼저 잡았습니다.
 *   전에는 회사 개요 · 수행 실적 · 사업자 정보가 모두 같은 회색 테두리 격자였습니다.
 *   법적 고지인 사업자 정보가 실적과 같은 비중으로 읽히면, 읽는 사람은
 *   무엇이 중요한지 알 수 없습니다.
 *
 * 그래서 메인이 쓰는 장치를 그대로 가져왔습니다.
 *   숫자 띠로 먼저 규모를 보여주고, 실적은 배경을 바꿔 띄우고,
 *   사업자 정보는 테두리를 걷어내 가장 조용하게 둡니다.
 *
 * TODO(시행일 · 대표자): CEO_PROFILE이 채워지면 LEADERSHIP 구역이 자동으로 나타납니다.
 */

type PageProps = { params: Promise<{ locale: string }> };

type Stat = { id: string; value: string; unit: string; name: string };
type Record = { id: string; field: string; title: string; body: string };
type History = { id: string; period: string; title: string; body: string };

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

  const stats = t.raw('stats.items') as Stat[];
  const services = t.raw('story.services') as string[];
  const history = t.raw('history.items') as History[];
  const records = t.raw('record.items') as Record[];

  // 미확보 항목은 공개 화면에서 감추고 개발 중에만 표시합니다 (푸터와 같은 규칙).
  const showPending = process.env.NODE_ENV !== 'production';

  const bizRows = [
    { k: tf('company'), v: `${COMPANY.nameKo} (${COMPANY.nameEn})`, pending: false },
    { k: tf('ceo'), v: COMPANY.ceo.value, pending: COMPANY.ceo.pending },
    { k: tf('bizNo'), v: COMPANY.bizNo.value, pending: COMPANY.bizNo.pending },
    { k: tf('address'), v: COMPANY.address.value, pending: COMPANY.address.pending },
    { k: tf('tel'), v: COMPANY.tel.value, pending: COMPANY.tel.pending },
    { k: tf('email'), v: COMPANY.email, pending: false },
    { k: t('platformLabel'), v: COMPANY.platform, pending: false },
    { k: t('domainLabel'), v: COMPANY.domain, pending: false },
  ].filter((row) => !row.pending || showPending);


  return (
    <>
      {/* 상단 여백은 헤더 높이에 맞춥니다 — 모바일 64px, 데스크톱 88px */}
      <main id="main" className="pt-32 lg:pt-[168px]">
        {/* ── 도입부 ───────────────────────────────── */}
        <Container>
          <Reveal>
            <SectionLabel tone="green" size="md">
              {t('label')}
            </SectionLabel>
            <h1 className="mt-6 max-w-[24ch] whitespace-pre-line text-[clamp(1.875rem,3.4vw,2.75rem)] font-medium leading-[1.35] tracking-[-0.02em] text-navy-900">
              {t('heading')}
            </h1>
            <p className="mt-6 max-w-prose text-body-lg leading-relaxed text-navy-700/70">
              {t('lead')}
            </p>
          </Reveal>

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
        </Container>

        {/* ── 회사 개요 숫자 ─────────────────────────
            국내 대기업 회사소개 페이지가 쓰는 표기를 따랐습니다.
              · 라벨이 숫자 위에 옵니다 — 무엇의 숫자인지 먼저 읽힙니다
              · 숫자와 단위를 크기로 나눕니다 (2022 년) — 숫자가 도드라집니다
              · 세로 구분선으로 항목을 끊습니다 — 넓은 화면에서 셋이 흩어지지 않습니다
              · 항목마다 근거 한 줄을 답니다 — 「10명」만 있으면 되묻게 됩니다
            숫자가 올라가는 연출은 넣지 않았습니다. 회사 개요는 성과 자랑이 아니라
            사실 고지라서, 움직이면 오히려 가벼워 보입니다. */}
        <section className="mt-16 border-y border-line bg-white lg:mt-20">
          <Container>
            <div className="py-12 lg:py-16">
              <Reveal>
                <div className="flex items-center gap-5">
                  <h2 className="shrink-0 text-h4 font-medium tracking-[-0.01em] text-navy-900">
                    {t('stats.caption')}
                  </h2>
                  <span aria-hidden="true" className="h-px flex-1 bg-line" />
                </div>
              </Reveal>

              <Reveal>
                <dl className="mt-10 grid gap-y-10 sm:grid-cols-3 sm:gap-y-0">
                  {stats.map((s, i) => (
                    <div
                      key={s.id}
                      className={
                        i === 0
                          ? 'min-w-0 sm:pr-8'
                          : 'min-w-0 sm:border-l sm:border-line sm:pl-8 sm:pr-8'
                      }
                    >
                      <dt className="label-mono text-fg-subtle">{s.name}</dt>
                      <dd className="mt-3 flex items-baseline gap-1.5">
                        <span className="text-[clamp(2.25rem,4.2vw,3.25rem)] font-medium leading-none tracking-[-0.04em] text-navy-900 [font-variant-numeric:tabular-nums]">
                          {s.value}
                        </span>
                        {s.unit && (
                          <span className="text-h4 font-normal leading-none text-navy-700/55">
                            {s.unit}
                          </span>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* ── 회사 소개 + 개요 ───────────────────────
            문장은 왼쪽, 사실은 오른쪽. 한 덩어리로 쌓으면 둘 다 흘려 읽힙니다. */}
        <section className="bg-bg py-20 lg:py-[120px]">
          <Container>
            <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,42%)_minmax(0,1fr)] lg:gap-16">
              <Reveal>
                <SectionLabel tone="green">{t('story.label')}</SectionLabel>
                <h2 className="mt-5 text-h2 font-medium tracking-[-0.022em] text-navy-900">
                  {t('story.heading')}
                </h2>
                <p className="mt-5 whitespace-pre-line text-body leading-relaxed text-navy-700/75">
                  {t('story.body')}
                </p>
              </Reveal>

              {/* 사업분야 — 공급에서 운영까지가 실제 진행 순서라 번호를 붙입니다 */}
              <Reveal>
                <p className="label-mono text-fg-subtle">{t('story.servicesLabel')}</p>
                <ol className="mt-5 border-t border-line-strong">
                  {services.map((s, i) => (
                    <li key={s} className="flex items-baseline gap-5 border-b border-line py-4">
                      <span className="font-mono text-[12px] leading-none text-green-600">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-body font-medium text-navy-900">{s}</span>
                    </li>
                  ))}
                </ol>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* ── 연혁 ─────────────────────────────────
            가로로 눕힌 연혁입니다. 세로로 세우면 네 항목이 화면 두 개를 먹는데,
            여기서 읽혀야 하는 건 각 항목의 상세가 아니라 「어디서 시작해 어디로 왔는가」라는
            방향 하나입니다. 가로로 두면 그 흐름이 한눈에 들어옵니다.
            좁은 화면에서는 세로로 쌓이고, 그때는 왼쪽 세로선이 축이 됩니다. */}
        <section className="border-t border-line bg-white py-20 lg:py-[120px]">
          <Container>
            <Reveal>
              <SectionLabel tone="green">{t('history.label')}</SectionLabel>
              <h2 className="mt-5 max-w-[24ch] text-h2 font-medium tracking-[-0.022em] text-navy-900">
                {t('history.heading')}
              </h2>
              <p className="mt-5 max-w-[46rem] text-body-lg leading-relaxed text-navy-700/70">
                {t('history.lead')}
              </p>
            </Reveal>

            <Reveal>
              <ol className="mt-14 grid gap-y-10 border-l border-line pl-7 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-x-7 lg:border-l-0 lg:pl-0">
                {history.map((h, i) => {
                  const isNow = h.period === '';
                  return (
                    <li key={h.id} className="relative min-w-0">
                      {/* 좁은 화면 — 왼쪽 세로선 위의 점 */}
                      <span
                        aria-hidden="true"
                        className={`absolute -left-[34px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-white lg:hidden ${
                          isNow ? 'bg-green-500' : 'bg-navy-700/25'
                        }`}
                      />

                      {/* 넓은 화면 — 항목 위를 가로지르는 선과 점 */}
                      <span
                        aria-hidden="true"
                        className={`hidden h-px w-full lg:block ${
                          isNow ? 'bg-green-500/50' : 'bg-line-strong'
                        }`}
                      />
                      <span
                        aria-hidden="true"
                        className={`absolute -top-[4px] left-0 hidden h-2.5 w-2.5 rounded-full lg:block ${
                          isNow ? 'bg-green-500' : 'bg-navy-700/25'
                        }`}
                      />

                      <div className="lg:pt-6">
                        <p
                          className={`font-mono text-[12px] font-semibold tracking-[0.1em] ${
                            isNow ? 'text-green-600' : 'text-navy-700/45'
                          }`}
                        >
                          {isNow ? t('history.nowLabel') : h.period}
                        </p>
                        <h3 className="mt-3 text-body font-medium leading-snug tracking-[-0.01em] text-navy-900">
                          {h.title}
                        </h3>
                        <p className="mt-2.5 text-caption leading-relaxed text-navy-700/65">
                          {h.body}
                        </p>
                      </div>

                      {/* 진행 방향 — 한 줄로 늘어서는 폭에서만 */}
                      {i < history.length - 1 && (
                        <span
                          aria-hidden="true"
                          className="absolute -right-4 top-[18px] hidden text-caption leading-none text-navy-700/25 lg:block"
                        >
                          →
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </Reveal>
          </Container>
        </section>

        {/* ── 수행 실적 ─────────────────────────────
            연혁이 흐름이라면 여기는 내역입니다. 배경을 바꿔 구역을 나눕니다. */}
        <section className="border-y border-line bg-white py-20 lg:py-[120px]">
          <Container>
            <Reveal>
              <SectionLabel tone="green">TRACK RECORD</SectionLabel>
              <h2 className="mt-5 text-h2 font-medium tracking-[-0.022em] text-navy-900">
                {t('record.heading')}
              </h2>
              <p className="mt-5 max-w-[46rem] text-body-lg leading-relaxed text-navy-700/70">
                {t('record.lead')}
              </p>
            </Reveal>

            <ul className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
              {records.map((r, i) => (
                <Reveal as="li" key={r.id} className="block min-w-0 bg-white">
                  <div className="flex h-full flex-col px-6 py-7">
                    <div className="flex items-baseline justify-between gap-4">
                      {/* 업종을 배지로 올립니다 — 이 목록에서 가장 먼저 찾는 정보입니다 */}
                      <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-[12px] font-medium leading-none text-green-600">
                        {r.field}
                      </span>
                      <span className="font-mono text-[12px] text-navy-700/35">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <p className="mt-4 text-h4 font-medium tracking-[-0.01em] text-navy-900">
                      {r.title}
                    </p>
                    <p className="mt-2.5 text-caption leading-relaxed text-navy-700/70">{r.body}</p>
                  </div>
                </Reveal>
              ))}
            </ul>

          </Container>
        </section>

        {/* 대표자 소개 — CEO_PROFILE.pending 동안은 공개 화면에 나가지 않습니다 */}
        {SECTIONS.ceo && <CeoProfile />}

        {/* ── 사업자 정보 ───────────────────────────
            법적 표기 의무 항목입니다. 읽으러 오는 사람이 따로 있으므로 빼지 않되,
            테두리를 걷어내고 글자를 줄여 실적보다 조용하게 둡니다. */}
        <section className="bg-bg py-14 lg:py-16">
          <Container>
            <Reveal>
              <h2 className="text-h4 font-medium tracking-[-0.01em] text-navy-900">
                {t('bizHeading')}
              </h2>

              <dl className="mt-6 grid gap-x-10 gap-y-0 sm:grid-cols-2">
                {bizRows.map((row) => (
                  <div
                    key={row.k}
                    className="flex flex-wrap items-baseline gap-x-5 gap-y-0.5 border-b border-line py-3"
                  >
                    <dt className="label-mono min-w-[92px] text-fg-subtle">{row.k}</dt>
                    <dd
                      className={`text-caption ${
                        row.pending ? 'text-navy-700/40' : 'font-medium text-navy-900'
                      }`}
                    >
                      {row.pending ? '—' : row.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </Container>
        </section>
      </main>

      <CtaBanner />
    </>
  );
}
