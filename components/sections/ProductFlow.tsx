import { useTranslations } from 'next-intl';

import SectionLabel from '@/components/ui/SectionLabel';
import Container from '@/components/layout/Container';
import Reveal from '@/components/motion/Reveal';

/**
 * INFOLINK — 8단계 전 공정
 *
 * 8칸을 한 줄에 밀어넣으면 좁은 화면에서 반드시 넘칩니다.
 * 가로 스크롤을 만드는 대신 2 → 4 → 8칸으로 흘려보냅니다.
 * 진행 화살표는 실제로 한 줄로 늘어서는 xl에서만 보입니다.
 *
 * 이 섹션의 요점은 단계의 개수가 아니라 '건너뛸 수 없다'는 제약입니다.
 * 그래서 다이어그램 다음에 「진행이 막히는 예」를 두고, 그 아래 한 줄로 못박습니다.
 *
 * 모듈 11개는 목록이 아니라 8단계와의 매핑으로 보여줍니다.
 * 목록으로 두면 「모듈이 많다」가 되고, 매핑으로 두면 「8단계를 덮는다」가 됩니다.
 */

type Step = { id: string; no: string; name: string; sub: string };
type Module = { id: string; names: string; stages: string };

export default function ProductFlow() {
  const t = useTranslations('product.flow');
  const steps = t.raw('steps') as Step[];
  const gates = t.raw('gates') as string[];
  const modules = t.raw('modules') as Module[];

  return (
    <section id="process" className="scroll-mt-[136px] lg:scroll-mt-[144px] overflow-x-clip border-t border-line bg-white py-20 lg:py-[120px]">
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

        {/*
          단계 위의 선이 01부터 08까지 차례로 그려집니다.
          사이트의 다른 순차 등장은 전부 걷어냈지만 여기만 남깁니다 —
          이 섹션에서 '순서'는 장식이 아니라 설명해야 할 내용 자체입니다.
        */}
        <Reveal as="ol" className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4 xl:mt-16 xl:grid-cols-8 xl:gap-x-2">
          {steps.map((step, i) => (
            <li key={step.id} className="relative min-w-0">
              <div className="relative border-t-2 border-navy-700/10 pt-4">
                <span
                  aria-hidden="true"
                  className="draw-rule absolute inset-x-0 -top-0.5 h-0.5 bg-green-500/50"
                  style={{ '--draw-delay': `${i * 90}ms` } as React.CSSProperties}
                />
                <span
                  aria-hidden="true"
                  className="font-mono text-[12px] font-semibold tracking-[0.1em] text-green-600"
                >
                  {step.no}
                </span>
                <p className="mt-2 text-body font-medium leading-snug tracking-[-0.01em] text-navy-900">
                  {step.name}
                </p>
                <p className="mt-1 text-caption leading-relaxed text-navy-700/60">{step.sub}</p>
              </div>

              {/* 한 줄로 늘어서는 폭에서만 진행 방향을 표시합니다 */}
              {i < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-1 top-[26px] hidden text-caption leading-none text-navy-700/25 xl:block"
                >
                  →
                </span>
              )}
            </li>
          ))}
        </Reveal>

        {/* 진행이 막히는 예 — 추상적인 '통제'를 구체적인 세 문장으로 바꿉니다 */}
        <Reveal>
          <div className="mt-16 border-t border-line pt-10">
            <h3 className="text-[12px] font-medium uppercase tracking-[0.14em] text-navy-700/55">
              {t('gateHeading')}
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {gates.map((gate) => (
                <li
                  key={gate}
                  className="flex gap-3 text-caption leading-relaxed text-navy-900/85"
                >
                  <span
                    aria-hidden="true"
                    className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-green-500"
                  />
                  <span className="min-w-0">{gate}</span>
                </li>
              ))}
            </ul>

          </div>
        </Reveal>
        {/* thesis / thesisSub는 이 섹션 바로 다음 이미지 밴드로 옮겼습니다.
            본문 안의 한 줄로 두면 다른 문장에 묻히지만, 사진 위에 얹으면 결론으로 읽힙니다. */}

        {/* 모듈 11개 — 8단계와 나란히 두어 커버리지로 읽히게 합니다 */}
        <Reveal>
          <div className="mt-16 border-t border-line pt-10">
            <h3 className="text-h4 font-medium tracking-[-0.01em] text-navy-900">
              {t('modulesHeading')}
            </h3>
            <p className="mt-3 text-caption text-navy-700/70">{t('modulesLead')}</p>

            <dl className="mt-8 border-t border-line">
              {modules.map((m) => (
                <div
                  key={m.id}
                  className="grid items-baseline gap-x-8 gap-y-1 border-b border-line py-4 sm:grid-cols-[minmax(0,1fr)_11rem]"
                >
                  <dt className="min-w-0 text-body leading-relaxed text-navy-900">{m.names}</dt>
                  <dd className="text-caption text-navy-700/60 sm:text-right">{m.stages}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-5 max-w-prose text-caption leading-relaxed text-fg-subtle">
              {t('modulesNote')}
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
