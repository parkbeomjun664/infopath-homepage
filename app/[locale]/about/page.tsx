import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import Image from 'next/image';

import Container from '@/components/layout/Container';
import CtaBanner from '@/components/sections/CtaBanner';
import CeoProfile from '@/components/sections/CeoProfile';
import Reveal from '@/components/motion/Reveal';
import SectionLabel from '@/components/ui/SectionLabel';
import CountUp from '@/components/ui/CountUp';
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

type Stat = { id: string; value: string; name: string };
type Record = { id: string; field: string; title: string; body: string };

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

  const profileRows = [
    { k: t('profile.foundedLabel'), v: t('profile.foundedValue') },
    { k: t('profile.headcountLabel'), v: t('profile.headcountValue') },
    { k: t('profile.fieldLabel'), v: t('profile.fieldValue') },
    { k: t('profile.industriesLabel'), v: t('profile.industriesValue') },
  ];

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

        {/* ── 숫자 띠 ───────────────────────────────
            메인 히어로 직후의 StatsBand와 같은 장치입니다.
            페이지 안에서 규모가 가장 먼저 읽혀야 그다음 글이 근거를 갖습니다. */}
        <section className="mt-16 border-y border-line bg-white lg:mt-20">
          <Container>
            <div className="py-10 lg:py-14">
              <Reveal>
                <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  <span className="text-body font-medium text-navy-900">{t('stats.caption')}</span>
                  <span className="text-caption text-navy-700/60">{t('stats.captionSub')}</span>
                </p>
              </Reveal>

              <Reveal>
                <ul className="mt-7 grid grid-cols-3 gap-x-6 border-t border-line pt-7 lg:gap-x-12">
                  {stats.map((s) => (
                    <li key={s.id} className="min-w-0">
                      <CountUp
                        value={s.value}
                        className="block text-[clamp(1.75rem,3.2vw,2.5rem)] font-medium leading-none tracking-[-0.03em] text-navy-900"
                      />
                      <span className="mt-3 block text-body font-medium leading-snug text-navy-700/75">
                        {s.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* ── 회사 소개 + 개요 ───────────────────────
            문장은 왼쪽, 사실은 오른쪽. 한 덩어리로 쌓으면 둘 다 흘려 읽힙니다. */}
        <section className="bg-bg py-16 lg:py-[96px]">
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

              <Reveal>
                <dl className="border-t border-line-strong">
                  {profileRows.map((row) => (
                    <div
                      key={row.k}
                      className="grid gap-1 border-b border-line py-5 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-6"
                    >
                      <dt className="label-mono pt-0.5 text-fg-subtle">{row.k}</dt>
                      <dd className="text-body font-medium text-navy-900">{row.v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-5 text-[13px] leading-relaxed text-fg-subtle">
                  {t('profile.note')}
                </p>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* ── 수행 실적 ─────────────────────────────
            흰 배경으로 바꿔 카드가 뜨게 합니다. 이 페이지에서 가장 강한 신뢰 요소입니다. */}
        <section className="border-y border-line bg-white py-16 lg:py-[96px]">
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

            <Reveal className="mt-6">
              <p className="text-[13px] leading-relaxed text-fg-subtle">{t('record.note')}</p>
            </Reveal>
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
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h2 className="text-h4 font-medium tracking-[-0.01em] text-navy-900">
                  {t('bizHeading')}
                </h2>
                <p className="text-[13px] text-fg-subtle">{t('bizNote')}</p>
              </div>

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
