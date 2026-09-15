import { useTranslations } from 'next-intl';

import SectionLabel from '@/components/ui/SectionLabel';
import Container from '@/components/layout/Container';
import Reveal from '@/components/motion/Reveal';

/**
 * INFOLINK — 현장에서 실제로 막히는 세 가지
 *
 * 이 섹션의 순서는 원칙입니다: 「왜 필요한가」가 먼저, 「무슨 기능」은 그 다음.
 *
 * ── 누구의 말인지 ──────────────────────────────────────────
 * 전에는 문제 문장이 카드에서 가장 큰 글씨(h3)였습니다.
 * 여기는 제품 페이지라, 제일 먼저 눈에 들어오는 큰 문장이 제품에 대한 서술로 읽힙니다.
 * 「불량이 접수됐는데 원인을 찾을 수 없습니다」가 INFOLINK의 한계처럼 보였습니다.
 *
 * 두 가지로 바로잡습니다.
 *  1. 출처를 문장보다 먼저 놓습니다. 「현장」 배지를 제목 위에 두어
 *     읽기 시작하는 순간 누구의 말인지 정해집니다.
 *  2. 크기를 뒤집습니다. 문제는 낮추고 답을 카드에서 가장 큰 글씨로 올립니다.
 *     읽는 순서는 문제 → 답 그대로지만, 눈이 먼저 닿는 곳은 답입니다.
 *
 * 문제 쪽에 경고색을 쓰지 않습니다. 겁을 주는 섹션이 아니라
 * 현장 사정을 안다는 것을 보이는 섹션입니다.
 */

type Item = { id: string; no: string; title: string; problem: string; answer: string };

export default function ProductWhy() {
  const t = useTranslations('product.why');
  const items = t.raw('items') as Item[];

  return (
    <section
      id="why"
      className="scroll-mt-[136px] overflow-x-clip border-t border-line bg-bg py-20 lg:scroll-mt-[144px] lg:py-[120px]"
    >
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
          가로 3열입니다. 전에는 전폭 카드를 세로로 쌓았는데, 글은 prose 폭에 묶여 있어
          카드 오른쪽 절반이 빈 채로 세 번 반복됐습니다. 이 섹션만 1544px를 썼습니다.
          메인의 같은 구조(문제 → 답)와 배치도 맞춰, 두 페이지를 오갈 때 같은 것으로 읽히게 합니다.
          카드 높이는 답 문장 길이가 정하므로 items-stretch로 아래를 맞춥니다.
        */}
        {/*
          카드 안쪽을 부모 격자에 얹습니다(subgrid) — 메인 Approach와 같은 방식입니다.
          단순히 mt-auto로 답을 아래에 붙이면 카드 높이만 같아지고, 문제 글 길이에 따라
          초록 구분선이 카드마다 다른 높이에 그어집니다. 굵은 가로선 셋이 어긋나면
          그 자체가 흐트러져 보입니다. subgrid는 세 행(머리 · 문제 · 답)을 카드 사이에서
          맞추므로 선이 한 줄에 놓입니다.
          subgrid를 모르는 브라우저에서는 위에서부터 쌓입니다 — 깨지지 않습니다.
        */}
        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr] lg:gap-7">
          {items.map((item) => (
            <Reveal
              as="li"
              key={item.id}
              className="card-lift min-w-0 rounded-lg bg-white p-7 lg:row-span-3 lg:grid lg:grid-rows-subgrid lg:p-8"
            >
              {/* ── 현장 : 누구의 말인지 먼저 밝힙니다 ── */}
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="font-mono text-caption font-semibold tracking-[0.1em] text-navy-700/35"
                >
                  {item.no}
                </span>
                <span className="rounded-pill bg-navy-50 px-2.5 py-1 text-[12px] font-medium text-navy-700/70">
                  {t('problemLabel')}
                </span>
              </div>

              <div className="mt-4 lg:mt-0 lg:pt-4">
                <h3 className="min-w-0 text-body font-medium leading-snug tracking-[-0.01em] text-navy-900/70">
                  {item.title}
                </h3>
                <p className="mt-3 text-caption leading-relaxed text-navy-700/55">{item.problem}</p>
              </div>

              {/* ── INFOLINK : 이 카드의 결론 ── */}
              <div className="relative mt-8 pt-6 lg:mt-0">
                <span
                  aria-hidden="true"
                  className="draw-rule absolute inset-x-0 top-0 h-0.5 bg-green-500/50"
                />
                <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-green-600">
                  {t('answerLabel')}
                </p>
                <p className="mt-3 text-body font-medium leading-relaxed tracking-[-0.01em] text-navy-900">
                  {item.answer}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
