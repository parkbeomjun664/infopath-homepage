import { useTranslations } from 'next-intl';

import SectionLabel from '@/components/ui/SectionLabel';
import Container from '@/components/layout/Container';
import Reveal from '@/components/motion/Reveal';

/**
 * 도입의 벽과 그 답 — 한 섹션
 *
 * 한 카드에 문제와 답을 위아래로 붙여 3:3으로 맞춥니다.
 *
 * ── 가로 정렬 ──────────────────────────────────────────────
 * 제목 줄 수가 카드마다 달라서(1줄 / 2줄 / 2줄) 구분선과 답이 서로 다른 높이에서
 * 시작했습니다. 세 열을 나란히 놓았는데 눈이 훑을 기준선이 없으니 어수선해집니다.
 *
 * 그래서 카드 안쪽을 부모 격자에 얹습니다(subgrid).
 *   행1 머리 + 문제   ← 세 카드 중 가장 긴 것에 높이를 맞춤
 *   행2 전환 표시     ← 세 카드가 같은 높이에서 시작
 *   행3 답
 * 카드마다 안쪽 여백이 같으므로 셋 다 같은 만큼 밀려 서로 정확히 맞습니다.
 * subgrid를 모르는 브라우저에서는 지금처럼 위에서부터 쌓입니다 — 깨지지 않습니다.
 *
 * ── 위계 ───────────────────────────────────────────────────
 *  1. 답이 문제보다 큽니다. 결론이 근거보다 작으면 문제만 눈에 남습니다.
 *  2. 카드마다 「INFOPATH」 라벨을 반복하지 않습니다. 세 번이면 소음입니다.
 *  3. 회색 섹션 위 흰 카드 — 경계가 저절로 생깁니다.
 *
 * 경고색은 쓰지 않습니다. 겁주는 게 아니라 알아준다는 톤이어야 합니다.
 * 제목의 주어는 제품이 아니라 회사입니다 — 이 사이트가 파는 것은 구축이기 때문입니다.
 */

type Item = {
  id: string;
  no: string;
  wall: string;
  problem: string;
  problemBody: string;
  answer: string;
  answerBody: string;
};

export default function Approach() {
  const t = useTranslations('approach');
  const items = t.raw('items') as Item[];

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

        <ul className="mt-14 grid gap-6 lg:mt-16 lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr] lg:gap-x-8 lg:gap-y-7">
          {items.map((item) => (
            <Reveal
              as="li"
              key={item.id}
              className="card-lift min-w-0 rounded-lg bg-white p-7 lg:row-span-3 lg:grid lg:grid-rows-subgrid lg:p-8"
            >
              {/* ── 행 1 · 머리와 문제 ── */}
              <div className="min-w-0">
                <div className="flex items-baseline gap-3">
                  <span
                    aria-hidden="true"
                    className="font-mono text-[1.5rem] font-semibold leading-none tracking-[-0.02em] text-green-600/35"
                  >
                    {item.no}
                  </span>
                  <span className="text-caption font-medium text-navy-700/60">{item.wall}</span>
                </div>

                <p className="mt-5 text-body-lg font-medium leading-snug tracking-[-0.01em] text-navy-900/80">
                  {item.problem}
                </p>
                <p className="mt-3 text-caption leading-relaxed text-navy-700/60">
                  {item.problemBody}
                </p>
              </div>

              {/*
                ── 행 2 · 전환 ──
                화살표와 선을 한 줄에 나란히 둡니다.
                전에는 선 위에 화살표를 음수 여백으로 겹쳐 놓아, 떠 있는 글자처럼 보였습니다.
                선 색을 연한 초록으로 맞춰 화살표와 한 덩어리로 읽히게 했습니다.
              */}
              <div className="mt-7 flex items-center gap-3 lg:mt-0">
                <span
                  aria-hidden="true"
                  className="text-[13px] font-semibold leading-none text-green-600"
                >
                  ↓
                </span>
                <span aria-hidden="true" className="draw-rule h-px flex-1 bg-green-500/40" />
              </div>

              {/* ── 행 3 · 답 (이 카드의 결론) ── */}
              <div className="mt-6 min-w-0 lg:mt-0">
                <p className="text-h4 font-medium leading-snug tracking-[-0.015em] text-navy-900">
                  {item.answer}
                </p>
                <p className="mt-3 text-caption leading-relaxed text-navy-700/70">
                  {item.answerBody}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
