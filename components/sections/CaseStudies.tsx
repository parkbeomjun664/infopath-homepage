import { useTranslations } from 'next-intl';

import SectionLabel from '@/components/ui/SectionLabel';
import Container from '@/components/layout/Container';
import Reveal from '@/components/motion/Reveal';
import { CASE_STUDIES, SECTIONS } from '@/content/site';

/**
 * 적용 사례 (/infolink)
 *
 * 도입 검토에서 가장 강한 신뢰 요소지만, 없는 사례를 지어내면 가장 크게 잃습니다.
 * 그래서 「사례 없음」 상태를 빈 카드로 보여주지 않고 섹션 자체를 그리지 않습니다.
 * 회사 소개에 "적용 사례" 제목만 있고 내용이 비어 있으면
 * 방문자는 실적이 없다는 것보다 더 나쁜 인상을 받습니다.
 *
 * TODO(적용 사례): 실제 구축 건이 생기면
 *   ① content/site.ts의 CASE_STUDIES 배열에 항목을 추가
 *   ② SECTIONS.cases를 true로
 *   두 가지를 모두 해야 노출됩니다 — 실수로 빈 섹션이 나가지 않게 이중으로 막았습니다.
 *
 * 카드에 넣을 것
 *   client   고객사명. 공개 동의를 못 받았으면 업종으로 대체 (예: '자동차 부품 제조')
 *   period   구축 기간
 *   scope    8단계 중 어디까지 적용했는지
 *   problem  무엇이 막혀 있었는지 — 이게 카드에서 가장 먼저 읽혀야 합니다
 *   result   무엇이 가능해졌는지. 측정하지 않은 수치는 쓰지 않습니다
 */

export default function CaseStudies() {
  const t = useTranslations('cases');
  const cases = CASE_STUDIES;
  const empty = cases.length === 0;

  // 플래그가 꺼져 있거나 사례가 없으면 공개 화면에는 아무것도 그리지 않습니다.
  if (!SECTIONS.cases || empty) {
    if (process.env.NODE_ENV === 'production') return null;
  }

  return (
    <section className="overflow-x-clip border-t border-line bg-bg py-20 lg:py-[120px]">
      <Container>
        <Reveal>
          <SectionLabel tone="green">{t('label')}</SectionLabel>
          <h2 className="mt-6 max-w-[24ch] text-[clamp(1.875rem,3.6vw,2.625rem)] font-medium leading-[1.35] tracking-[-0.02em] text-navy-900">
            {t('heading')}
          </h2>
          <p className="mt-5 max-w-[46rem] text-body-lg leading-relaxed text-navy-700/70">
            {t('lead')}
          </p>
        </Reveal>

        {empty ? (
          // 개발 전용 자리표시 — 카드가 실제로 어떻게 보일지와 무엇을 채워야 하는지
          <div className="mt-14 grid gap-px border border-dashed border-navy-700/30 bg-line sm:grid-cols-2">
            {[1, 2].map((n) => (
              <div key={n} className="bg-navy-50 px-6 py-8 lg:px-8">
                <p className="text-body font-medium text-navy-900">적용 사례 {n} 자리</p>
                <ul className="mt-4 flex flex-col gap-1.5 text-caption text-navy-700/70">
                  <li>client — 고객사명 또는 업종</li>
                  <li>period — 구축 기간</li>
                  <li>scope — 적용 범위 (8단계 중)</li>
                  <li>problem — 무엇이 막혀 있었나</li>
                  <li>result — 무엇이 가능해졌나</li>
                </ul>
                <p className="mt-5 text-[13px] leading-relaxed text-fg-subtle">
                  content/site.ts · CASE_STUDIES 에 추가하고 SECTIONS.cases를 true로
                </p>
              </div>
            ))}
          </div>
        ) : (
          <ul className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:mt-16">
            {cases.map((c) => (
              <Reveal
                as="li"
                key={c.id}
                className="block min-w-0 bg-white"
              >
                <div className="flex h-full flex-col px-6 py-8 lg:px-8">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <p className="text-h4 font-medium tracking-[-0.01em] text-navy-900">
                      {c.client}
                    </p>
                    <p className="font-mono text-[12px] text-navy-700/55">{c.period}</p>
                  </div>

                  <p className="mt-2 text-caption text-navy-700/60">{c.scope}</p>

                  {/* 문제가 먼저 — 읽는 사람이 자기 상황과 맞춰볼 수 있어야 합니다 */}
                  <div className="mt-6 border-t border-line pt-5">
                    <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-navy-700/55">
                      {t('problemLabel')}
                    </p>
                    <p className="mt-2 text-caption leading-relaxed text-navy-700/70">
                      {c.problem}
                    </p>
                  </div>

                  <div className="mt-auto border-t-2 border-green-500/50 pt-5">
                    <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-green-600">
                      {t('resultLabel')}
                    </p>
                    <p className="mt-2 text-caption leading-relaxed text-navy-900/85">{c.result}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}
