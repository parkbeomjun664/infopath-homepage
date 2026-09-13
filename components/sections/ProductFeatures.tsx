import { useTranslations } from 'next-intl';
import {
  Route,
  Boxes,
  ShieldCheck,
  Factory,
  Split,
  Search,
  LayoutGrid,
  type LucideIcon,
} from 'lucide-react';

import SectionLabel from '@/components/ui/SectionLabel';
import Container from '@/components/layout/Container';
import Reveal from '@/components/motion/Reveal';
import Disclosure from '@/components/ui/Disclosure';

/**
 * INFOLINK — 핵심 기능 6가지
 *
 * 카드마다 summary(무엇을 해결하는가) → points(기능) → evidence(근거) 순입니다.
 * 기능 목록이 먼저 읽히면 「왜 필요한가가 먼저」라는 원칙이 카드 단위에서 무너집니다.
 * evidence를 넣은 이유는, 기능 목록은 누구나 쓸 수 있고 근거는 실제로 만든 쪽만 쓸 수 있어서입니다.
 *
 * AI 카드(tone: 'muted')만 다르게 그립니다.
 * 내용의 절반이 「하지 않는 것」인데 다른 카드와 같은 모양이면 기능 자랑으로 읽힙니다.
 * 회색 바탕 + callout으로 성격을 형태에 드러냅니다.
 */

type Item = {
  id: string;
  icon: string;
  tone: 'default' | 'muted';
  title: string;
  summary: string;
  points: string[];
  evidence: string;
  callout?: string;
};

const ICONS: Record<string, LucideIcon> = {
  route: Route,
  boxes: Boxes,
  shield: ShieldCheck,
  factory: Factory,
  split: Split,
  search: Search,
  grid: LayoutGrid,
};

export default function ProductFeatures() {
  const t = useTranslations('product.features');
  const items = t.raw('items') as Item[];

  return (
    <section id="features" className="scroll-mt-[136px] lg:scroll-mt-[144px] overflow-x-clip border-t border-line bg-bg py-20 lg:py-[120px]">
      <Container>
        <Reveal>
          <SectionLabel tone="green">{t('label')}</SectionLabel>
          <h2 className="mt-6 max-w-[24ch] text-[clamp(1.875rem,3.6vw,2.625rem)] font-medium leading-[1.35] tracking-[-0.02em] text-navy-900">
            {t('heading')}
          </h2>
          <p className="mt-5 max-w-[42rem] text-body-lg leading-relaxed text-navy-700/70">
            {t('lead')}
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {items.map((item) => {
            const Icon = ICONS[item.icon] ?? LayoutGrid;
            const muted = item.tone === 'muted';

            return (
              <Reveal
                as="li"
                key={item.id}
                className={`card-lift block min-w-0 ${muted ? 'bg-navy-50' : 'bg-white'}`}
              >
                <div className="flex h-full flex-col px-6 py-8 lg:px-8">
                  <Icon
                    className={`h-6 w-6 ${muted ? 'text-navy-700/60' : 'text-navy-700'}`}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />

                  <h3 className="mt-5 text-h4 font-medium leading-snug tracking-[-0.01em] text-navy-900">
                    {item.title}
                  </h3>

                  {/* 접힌 상태에서 유일하게 보이는 본문 — 무엇을 해결하는가 */}
                  <p className="mt-3 text-body leading-relaxed text-navy-900/85">{item.summary}</p>

                  {/* AI 카드의 제약 문장은 접지 않습니다 — 그 카드에서 가장 먼저 읽혀야 합니다 */}
                  {item.callout && (
                    <p className="mt-5 border-l-2 border-navy-700/25 pl-4 text-caption font-medium leading-relaxed text-navy-900">
                      {item.callout}
                    </p>
                  )}

                  {/*
                    기능 목록과 근거를 한 패널에 넣고 클릭 뒤로 넘깁니다.
                    토글이 카드마다 둘이면 그것도 소음입니다.
                  */}
                  <Disclosure
                    className="mt-auto pt-7"
                    summaryClassName="inline-flex items-center gap-1.5 border-t border-line pt-5 text-caption font-medium text-navy-700/70 transition-colors hover:text-navy-700"
                    summary={
                      <>
                        {t('detailLabel')}
                        <span
                          aria-hidden="true"
                          className="text-[10px] transition-transform duration-300 group-open:rotate-180"
                        >
                          ▾
                        </span>
                      </>
                    }
                  >
                    <ul className="mt-5 flex flex-col gap-2">
                      {item.points.map((point) => (
                        <li
                          key={point}
                          className="flex gap-2.5 text-caption leading-relaxed text-navy-700/70"
                        >
                          <span
                            aria-hidden="true"
                            className={`mt-[7px] h-1 w-1 shrink-0 rounded-full ${
                              muted ? 'bg-navy-700/30' : 'bg-green-500'
                            }`}
                          />
                          <span className="min-w-0">{point}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 border-t border-line pt-4">
                      <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-navy-700/55">
                        {t('evidenceLabel')}
                      </p>
                      <p className="mt-2 text-caption leading-relaxed text-fg-subtle">
                        {item.evidence}
                      </p>
                    </div>
                  </Disclosure>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
