'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import SectionLabel from '@/components/ui/SectionLabel';
import Container from '@/components/layout/Container';
import Reveal from '@/components/motion/Reveal';
import Button from '@/components/ui/Button';
import Disclosure from '@/components/ui/Disclosure';
import ImageLightbox from './ImageLightbox';
import { ARCHITECTURE_VIEWS, type ArchitectureViewId } from '@/content/site';

/**
 * 아키텍처 섹션
 *
 * 회사 제공 다이어그램 3종을 탭으로 전환합니다.
 * 원본이 1536×1024로 조밀해서 모바일에서는 축소하면 읽히지 않습니다.
 * 그래서 좁은 화면에서는 가로 스크롤로 원래 밀도를 유지하고,
 * 어느 화면에서든 원본을 새 탭으로 열 수 있게 했습니다.
 *
 * 이미지에만 기대면 검색엔진과 스크린리더가 아무것도 읽지 못하므로,
 * 다이어그램의 내용을 계층 목록으로도 함께 싣습니다.
 */

type Layer = { id: string; name: string; body: string };
type Value = { id: string; name: string; body: string };

/**
 * detail=false (메인)  도면 · 캡션 · 현재 구현 주석 + /solution 링크까지만.
 *                      계층 6개와 결과 5개까지 펼치면 회사 소개가 제품 사양서가 됩니다.
 * detail=true (/solution) 전체.
 */
export default function Architecture({ detail = false }: { detail?: boolean }) {
  const t = useTranslations('architecture');
  const [active, setActive] = useState<ArchitectureViewId>('solution');
  const [zoomed, setZoomed] = useState(false);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const view = ARCHITECTURE_VIEWS.find((v) => v.id === active) ?? ARCHITECTURE_VIEWS[0]!;
  const layers = t.raw('layers') as Layer[];
  const values = t.raw('values') as Value[];

  // 탭 목록에서는 좌우 방향키로 이동할 수 있어야 합니다.
  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const dir = e.key === 'ArrowRight' ? 1 : -1;
    const next = ARCHITECTURE_VIEWS[(index + dir + ARCHITECTURE_VIEWS.length) % ARCHITECTURE_VIEWS.length]!;
    setActive(next.id);
    tabRefs.current[next.id]?.focus();
  };

  return (
    <section id={detail ? 'architecture' : undefined} className="scroll-mt-[136px] border-t border-line bg-white py-24 lg:scroll-mt-[144px] lg:py-32">
      <Container>
        <Reveal>
          <SectionLabel tone="green">{t('label')}</SectionLabel>

          <h2 className="mt-6 max-w-[36rem] text-[clamp(1.875rem,3.6vw,2.625rem)] font-medium leading-[1.35] tracking-[-0.02em] text-navy-900">
            {t('heading')}
          </h2>
          <p className="mt-5 max-w-[42rem] text-body-lg text-navy-700/70">{t('lead')}</p>
          {/*
            도면은 회사가 지향하는 전체 구조이고, 현재 구현은 그보다 좁습니다.
            그 차이를 도면 아래가 아니라 도면 앞에 둡니다 — 도입 검토에서
            "쓰신다면서요"라는 질문을 나중에 받는 것보다 먼저 밝히는 편이 낫습니다.
          */}
          <p className="mt-4 max-w-prose border-l-2 border-line pl-4 text-caption leading-relaxed text-fg-subtle">
            {t('note')}
          </p>
        </Reveal>

        {/* ── 탭 ──
               공개 도면이 하나뿐이면 탭은 의미가 없으므로 그리지 않습니다.
               도면이 다시 늘어나면 자동으로 탭이 나타납니다. */}
        <div
          role="tablist"
          aria-label={t('heading')}
          hidden={ARCHITECTURE_VIEWS.length < 2}
          className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-2 border-b border-line"
        >
          {ARCHITECTURE_VIEWS.map((v, i) => {
            const selected = v.id === active;
            return (
              <button
                key={v.id}
                ref={(el) => {
                  tabRefs.current[v.id] = el;
                }}
                role="tab"
                id={`arch-tab-${v.id}`}
                aria-selected={selected}
                aria-controls={`arch-panel-${v.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(v.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={[
                  '-mb-px border-b-2 pb-3 pt-1 text-caption font-semibold transition-colors',
                  selected
                    ? 'border-navy-700 text-navy-700'
                    : 'border-transparent text-navy-700/55 hover:text-navy-700/70',
                ].join(' ')}
              >
                {t(`views.${v.id}.tab`)}
              </button>
            );
          })}
        </div>

        {/* ── 다이어그램 ── */}
        <Reveal
          as="div"
          role="tabpanel"
          id={`arch-panel-${active}`}
          aria-labelledby={`arch-tab-${active}`}
          className="mt-8"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <div>
              <h3 className="text-h4 font-medium text-navy-900">{t(`views.${active}.title`)}</h3>
              <p className="mt-1 text-caption text-navy-700/70">{t(`views.${active}.caption`)}</p>
            </div>
            <button
              type="button"
              onClick={() => setZoomed(true)}
              className="group inline-flex items-center gap-1.5 text-caption font-semibold text-azure-600 underline-offset-4 hover:underline"
            >
              {t('zoom')}
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                ⤢
              </span>
            </button>
          </div>

          {/* 좁은 화면에서는 축소 대신 가로 스크롤 — 원본 밀도를 유지합니다.
              도면 글자가 조밀해 클릭하면 확대 보기가 열립니다. */}
          <div className="mt-5 overflow-x-auto border border-line bg-white">
            <button
              type="button"
              onClick={() => setZoomed(true)}
              aria-label={`${t(`views.${active}.title`)} — ${t('zoom')}`}
              className="block w-full min-w-[880px] cursor-zoom-in text-left"
            >
              <span className="group relative block">
                <Image
                  key={active}
                  src={view.src}
                  alt={t(`views.${active}.alt`)}
                  width={view.width}
                  height={view.height}
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  className="h-auto w-full"
                />
                {/* hover 힌트 — 클릭하면 커진다는 것을 알려줍니다 */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 flex items-center justify-center bg-navy-900/0 opacity-0 transition duration-200 group-hover:bg-navy-900/10 group-hover:opacity-100"
                >
                  <span className="inline-flex items-center gap-2 rounded-full bg-navy-900/85 px-4 py-2 text-caption font-semibold text-white">
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M7 5v4M5 7h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    {t('zoomHint')}
                  </span>
                </span>
              </span>
            </button>
          </div>
          <p className="mt-3 text-caption text-fg-subtle lg:hidden">{t('scrollHint')}</p>
        </Reveal>

        {zoomed && (
          <ImageLightbox
            src={view.src}
            alt={t(`views.${active}.alt`)}
            title={t(`views.${active}.title`)}
            onClose={() => setZoomed(false)}
          />
        )}

        {detail && (
          <>
        {/* ── 계층 구성 (이미지 대체 텍스트 겸 본문) ──
             6개 계층의 설명이 전부 펼쳐져 있으면 메인 페이지에서 가장 긴 글의 벽이 됩니다.
             계층 이름만 먼저 보이게 하고 설명은 각 행을 눌렀을 때 열립니다.
             내용은 DOM에 그대로 있으므로 검색엔진과 스크린리더는 접힌 상태에서도 읽습니다. */}
        <Reveal>
          <h3 className="mt-20 text-h4 font-medium text-navy-900">{t('layersHeading')}</h3>
        </Reveal>
        <div className="mt-6 border-t border-line">
          {layers.map((layer) => (
            <Disclosure
                key={layer.id}
                className="border-b border-line"
                summaryClassName="flex items-center justify-between gap-6 py-5 text-body font-medium text-navy-900 transition-colors hover:text-navy-700"
                summary={
                  <>
                    {layer.name}
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-caption text-navy-700/45 transition-transform duration-300 group-open:rotate-180"
                    >
                      ▾
                    </span>
                  </>
                }
              >
                <p className="max-w-prose pb-5 text-caption leading-relaxed text-navy-700/70">
                  {layer.body}
                </p>
              </Disclosure>
          ))}
        </div>

        {/* ── 가치 ── */}
        <Reveal>
          <h3 className="mt-20 text-h4 font-medium text-navy-900">{t('valuesHeading')}</h3>
        </Reveal>
        <ul className="mt-6 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v) => (
            <li key={v.id} className="border-t-2 border-green-500/50 pt-4">
              <p className="text-body font-medium text-navy-900">{v.name}</p>
              <p className="mt-1.5 text-caption text-navy-700/70">{v.body}</p>
            </li>
          ))}
        </ul>
          </>
        )}

        {/* 메인에서는 여기서 끊고 상세는 /solution이 받습니다 */}
        {!detail && (
          <Reveal>
            <div className="mt-10">
              <Button href="/infolink#tech" variant="link">
                {t('more')}
              </Button>
            </div>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
