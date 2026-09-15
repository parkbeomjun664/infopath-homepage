import { useTranslations } from 'next-intl';

import SectionLabel from '@/components/ui/SectionLabel';
import Container from '@/components/layout/Container';
import Reveal from '@/components/motion/Reveal';
import { BUILD_STEPS, SECTIONS, type BuildStepOwner } from '@/content/site';

/**
 * 구축 방식 (메인)
 *
 * 이 회사가 파는 것은 제품이 아니라 「구축」입니다.
 * 그런데 그 과정이 사이트에 없으면, 읽는 사람은 무엇을 사는지 끝까지 모릅니다.
 *
 * 이 섹션의 값어치는 단계 목록이 아니라 「누가 하는가」입니다.
 * 도입 검토자의 진짜 불안은 "얼마나 걸리나"보다 "우리가 뭘 해야 하나"입니다.
 * 기준정보(품목·BOM·검사기준)는 고객사 데이터라 대신 만들어줄 수 없고,
 * 그걸 「함께」로 정직하게 밝히면 착수 후의 갈등을 미리 막습니다.
 *
 * 실제 절차를 확인하기 전까지는 공개 화면에 아무것도 그리지 않습니다.
 * 추측으로 쓰면 그 문장이 곧 회사의 약속이 됩니다.
 *
 * TODO(구축 방식): content/site.ts의 BUILD_STEPS를 채우고 SECTIONS.buildProcess를 true로.
 *   두 가지를 모두 해야 노출됩니다 — 실수로 빈 섹션이 나가지 않게 이중으로 막았습니다.
 */

const OWNER_TONE: Record<BuildStepOwner, string> = {
  infopath: 'bg-navy-50 text-navy-700/70',
  // 「함께」가 이 섹션에서 가장 중요한 표시라 초록으로 눈에 띄게 합니다
  together: 'bg-green-50 text-green-700',
  client: 'bg-navy-50 text-navy-700/70',
};

export default function BuildProcess() {
  const t = useTranslations('buildProcess');
  const steps = BUILD_STEPS;
  const empty = steps.length === 0;

  if ((!SECTIONS.buildProcess || empty) && process.env.NODE_ENV === 'production') return null;

  return (
    <section className="overflow-x-clip border-t border-line bg-white py-16 lg:py-[96px]">
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
          // 개발 전용 자리표시 — 무엇을 채워야 하는지
          <div className="mt-14 rounded-lg border-2 border-dashed border-navy-700/30 bg-navy-50 p-7">
            <p className="text-body font-medium text-navy-900">구축 방식 자리</p>
            <ul className="mt-4 flex flex-col gap-1.5 text-caption text-navy-700/70">
              <li>content/site.ts · BUILD_STEPS 에 단계를 넣고 SECTIONS.buildProcess를 true로</li>
              <li>no · title · body · owner (infopath / together / client)</li>
              <li>확인용 초안 5단계는 site.ts 주석에 적어 두었습니다</li>
            </ul>
            <p className="mt-5 text-[13px] leading-relaxed text-fg-subtle">
              ⚠ 각 단계의 소요 기간은 확인 전까지 쓰지 마십시오. 적는 순간 약속이 됩니다.
            </p>
          </div>
        ) : (
          <ol className="mt-14 border-t border-line lg:mt-16">
            {steps.map((step) => (
              <Reveal as="li" key={step.id} className="block min-w-0">
                <div className="grid items-baseline gap-x-8 gap-y-3 border-b border-line py-7 lg:grid-cols-[4rem_minmax(0,1fr)_8rem] lg:py-8">
                  <span
                    aria-hidden="true"
                    className="font-mono text-body font-semibold tracking-[0.06em] text-green-600/50"
                  >
                    {step.no}
                  </span>

                  <div className="min-w-0">
                    <p className="text-h4 font-medium leading-snug tracking-[-0.015em] text-navy-900">
                      {step.title}
                    </p>
                    <p className="mt-2 max-w-prose text-caption leading-relaxed text-navy-700/70">
                      {step.body}
                    </p>
                  </div>

                  {/* 누가 하는 일인지 — 이 열이 이 섹션의 값어치입니다 */}
                  <span
                    className={`justify-self-start rounded-pill px-3 py-1 text-caption font-medium lg:justify-self-end ${OWNER_TONE[step.owner]}`}
                  >
                    {t(`owner.${step.owner}`)}
                  </span>
                </div>
              </Reveal>
            ))}
          </ol>
        )}

        <Reveal>
          <p className="mt-8 max-w-prose text-caption leading-relaxed text-fg-subtle">
            {t('note')}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
