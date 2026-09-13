'use client';

import { useCallback, useEffect, useRef, useState, type TouchEvent } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import Button from '@/components/ui/Button';
import Container from '@/components/layout/Container';
import { HERO_SLIDES, HERO_SLIDE_INTERVAL_MS, HERO_VARIANT, PRODUCT_SHOT } from '@/content/site';

/**
 * 히어로 슬라이더 (3장)
 *
 * 전환은 이동이 아니라 페이드입니다 — 슬라이드가 옆으로 밀리면
 * 우측 이미지 패널이 화면 밖으로 나갔다 들어오면서 레이아웃이 흔들립니다.
 *
 * 자동 전환 규칙
 *  - 8초 간격, 800ms 페이드 (간격은 site.ts, 페이드는 globals.css의 .hero-slide)
 *  - 일시정지는 도트 위에서만. 아래 hover 주석 참고.
 *  - 수동 조작 후에는 15초 쉬었다 다시 돕니다.
 *  - prefers-reduced-motion이어도 슬라이드는 계속 넘어갑니다. 페이드만 사라집니다.
 *
 * ※ 위 세 줄은 전부 "자동으로 안 넘어간다"를 고치면서 바꾼 것입니다.
 *   원래는 (1) 우측 이미지 패널에 hover 일시정지가 걸려 있었고,
 *          (2) 도트를 한 번 누르면 자동 전환이 영구히 꺼졌고,
 *          (3) 운영체제에서 애니메이션을 끄면 첫 장에 고정됐습니다.
 *   (1)은 화면 우측 42%가 통째로 정지 구역이라 커서를 올려두기만 해도 멈췄고,
 *   (3)은 Windows의 「애니메이션 표시」를 끈 사용자에게는 슬라이드가 아예 없는 것과 같았습니다.
 *   모션 설정은 움직임을 줄이라는 뜻이지 내용을 얼려두라는 뜻이 아니므로,
 *   전환은 유지하고 페이드만 없앱니다(전역 CSS가 transition을 0으로 만듭니다).
 */

/** 수동 조작 후 자동 전환을 다시 켜기까지 */
const RESUME_AFTER_MS = 15000;

type Copy = { headline: string; highlight: string; sub: string; alt: string };

/** 제목을 줄 단위로 나누고, 강조 어구가 있는 줄을 앞·강조·뒤로 쪼갭니다. */
function splitHeadline(headline: string, highlight: string) {
  return headline.split('\n').map((line) => {
    const at = highlight ? line.indexOf(highlight) : -1;
    if (at === -1) return { before: line, highlight: '', after: '' };
    return { before: line.slice(0, at), highlight, after: line.slice(at + highlight.length) };
  });
}

export default function HeroSlider() {
  const t = useTranslations();

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  // 수동 조작 후 잠시 꺼졌다가 RESUME_AFTER_MS 뒤에 다시 켜집니다.
  const [autoplay, setAutoplay] = useState(true);
  const touchStartX = useRef<number | null>(null);

  /**
   * 제품 화면이 들어오면 첫 슬라이드의 사진을 그것으로 바꿉니다.
   *
   * 첫 슬라이드가 회사의 주 주장을 싣는 자리라, 그 옆에 스톡 사진 대신
   * 실제 화면이 있는 것이 신뢰 요소로는 가장 강합니다.
   * 화면 캡처는 잘리면 글자가 사라지므로 cover가 아니라 contain으로 담습니다.
   */
  const productShot = !PRODUCT_SHOT.pending && PRODUCT_SHOT.src ? PRODUCT_SHOT.src : null;

  const slides = HERO_SLIDES.map((s) => {
    const base = s.useVariantCopy ? `hero.variants.${HERO_VARIANT}` : `hero.slides.${s.id}`;
    const isProduct = s.id === 'primary' && productShot !== null;
    return {
      id: s.id,
      image: isProduct ? productShot! : s.image,
      isProduct,
      copy: {
        headline: t(`${base}.headline`),
        highlight: t(`${base}.highlight`),
        sub: t(`${base}.sub`),
        alt: isProduct ? t('hero.productShotAlt') : t(`hero.slides.${s.id}.alt`),
      } satisfies Copy,
    };
  });

  const count = slides.length;

  const resumeTimer = useRef<number | null>(null);

  const goTo = useCallback(
    (index: number) => {
      setActive(((index % count) + count) % count);

      // 직접 고른 화면을 바로 넘겨버리면 안 되지만, 영구히 멈추면
      // "자동으로 안 넘어간다"가 됩니다. 잠시 쉬었다 다시 돕니다.
      setAutoplay(false);
      if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
      resumeTimer.current = window.setTimeout(() => setAutoplay(true), RESUME_AFTER_MS);
    },
    [count],
  );

  useEffect(() => () => {
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
  }, []);

  useEffect(() => {
    if (!autoplay || paused) return;

    const timer = window.setTimeout(() => {
      setActive((i) => (i + 1) % count);
    }, HERO_SLIDE_INTERVAL_MS);

    return () => window.clearTimeout(timer);
  }, [active, autoplay, paused, count]);

  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: TouchEvent) => {
    const start = touchStartX.current;
    const end = e.changedTouches[0]?.clientX;
    touchStartX.current = null;
    if (start == null || end == null) return;
    const dx = end - start;
    if (Math.abs(dx) < 50) return; // 탭을 스와이프로 오인하지 않도록
    goTo(active + (dx < 0 ? 1 : -1));
  };

  /**
   * hover 일시정지는 도트에만 겁니다.
   *
   * 전에는 우측 이미지 패널에도 걸려 있었는데, 그 패널이 화면 폭의 42%를
   * 헤더 아래부터 히어로 바닥까지 차지합니다. 커서를 오른쪽에 놓아두기만 해도
   * 슬라이드가 무한정 멈췄습니다.
   * 멈춤은 사용자가 "지금 이 장을 더 보고 싶다"고 의사를 표시하는 곳,
   * 즉 컨트롤(도트) 위에서만 일어나야 합니다.
   */
  const hover = {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
  };

  const current = slides[active]!;
  const lines = splitHeadline(current.copy.headline, current.copy.highlight);
  const autoRunning = autoplay && !paused;

  return (
    <>
      {/* ── 우측 이미지 패널 ──────────────────────────────────
             헤더 아래부터 히어로 바닥까지 세로를 가득 채웁니다.
             높이를 %로 잡고 중앙에 두면 위아래에 흰 띠가 남아
             좌측 텍스트(위에서 시작)와 무게가 맞지 않습니다.
             top은 데스크톱 헤더 높이(88px)만큼만 띄웁니다. */}
      <div className="absolute bottom-0 right-0 top-[88px] hidden w-[42%] lg:block">
        <div className="relative h-full w-full overflow-hidden">
          {slides.map((s, i) => (
            <div
              key={s.id}
              className="hero-slide absolute inset-0"
              data-active={i === active}
              aria-hidden={i !== active}
            >
              <Image
                src={s.image}
                alt={i === active ? s.copy.alt : ''}
                fill
                priority={i === 0}
                sizes="42vw"
                className={`hero-slide-img object-center ${
                  s.isProduct ? 'object-contain p-6' : 'object-cover'
                }`}
              />
            </div>
          ))}

          {/*
            제품 화면이 아직 없다는 것을 개발 중에만 눈에 보이게 표시합니다.
            공개 화면에는 나가지 않습니다 — 방문자에게 "여기 비었음"을 알릴 이유가 없습니다.
          */}
          {productShot === null && process.env.NODE_ENV !== 'production' && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-8 flex items-center justify-center rounded-lg border-2 border-dashed border-navy-700/40 bg-white/70 text-center text-caption font-medium text-navy-700"
            >
              제품 화면 자리
              <br />
              content/site.ts · PRODUCT_SHOT
            </div>
          )}

          {/* 좌측 가장자리 100px — 흰색에서 투명으로 */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-[100px]"
            style={{
              background: 'linear-gradient(to right, #FAFBFC 0%, rgba(250,251,252,0) 100%)',
            }}
          />
        </div>
      </div>

      {/* ── 카피 ── */}
      <Container
        // 모바일 상단은 헤더(64px) + 48px = 112px. 하단은 아래 이미지가 여백 역할을 하므로 64px.
        // 스와이프는 여기서 받되, hover 일시정지는 걸지 않습니다 (위 hover 주석 참고).
        className="relative pb-16 pt-28 lg:py-44"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="lg:w-[56%] lg:pr-10">
          {/* key로 슬라이드마다 다시 마운트해 CSS 진입 시퀀스를 재생시킵니다 */}
          <div key={current.id}>
            <p className="hero-seq hero-seq-label text-caption font-medium italic tracking-wide text-navy-700/60">
              {t('hero.sloganEn')}
            </p>

            <h1 className="mt-6 text-[clamp(2rem,3.8vw,3rem)] font-medium leading-[1.35] tracking-[-0.02em] text-navy-900">
              {lines.map((line, i) => (
                <span key={i} className="block">
                  <span className={`hero-seq ${i === 0 ? 'hero-seq-line1' : 'hero-seq-line2'}`}>
                    {line.before}
                  </span>
                  {line.highlight && (
                    <>
                      <span className="hero-seq hero-seq-highlight hero-seq-underline">
                        {line.highlight}
                      </span>
                      <span className={`hero-seq ${i === 0 ? 'hero-seq-line1' : 'hero-seq-line2'}`}>
                        {line.after}
                      </span>
                    </>
                  )}
                </span>
              ))}
            </h1>

            <p className="hero-seq hero-seq-sub mt-7 max-w-[34rem] text-body-lg font-normal leading-relaxed text-navy-700/70">
              {current.copy.sub}
            </p>
          </div>

          {/*
            회사 소개 한 줄(companyLine)을 여기 두었다가 걷어냈습니다.
            ① 「중소·중견」이 방문 기업을 규모로 규정해, 읽는 쪽이 자기를 그렇게
               불린다고 느끼는 순간 설득이 아니라 분류가 됩니다.
            ② 바로 위 헤드라인·서브카피와 말하는 바가 겹쳐 초점이 흩어졌습니다.
            히어로는 카피 → 설명 → CTA 세 단계로 둡니다.
            「무엇을 하는 회사인가」는 아래 WHY INFOPATH와 검색 설명이 담당합니다.
          */}
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
            <span className="hero-seq hero-seq-btn1">
              <Button href="/contact" variant="primary" size="lg">
                {t('hero.ctaPrimary')}
              </Button>
            </span>
            <span className="hero-seq hero-seq-btn2">
              <Button href="/infolink" variant="link" size="lg">
                {t('hero.ctaSecondary')}
              </Button>
            </span>
          </div>

          {/* ── 도트 인디케이터 (좌하단) ── */}
          <div className="mt-14 flex items-center gap-3" aria-label={t('hero.slideNav')} {...hover}>
            {slides.map((s, i) => {
              const isActive = i === active;
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-current={isActive ? 'true' : undefined}
                  aria-label={`${i + 1} / ${count}`}
                  onClick={() => goTo(i)}
                  className="group py-2"
                >
                  <span
                    className={[
                      'relative block h-[3px] overflow-hidden rounded-full bg-navy-700/15 transition-all duration-300',
                      isActive ? 'w-14' : 'w-6 group-hover:bg-navy-700/30',
                    ].join(' ')}
                  >
                    {isActive && (
                      <span
                        // 진행 바 — 자동 전환이 돌 때만 채워집니다.
                        // key에 상태를 넣어 재생/정지 전환 때 애니메이션을 다시 시작합니다.
                        key={`${s.id}-${String(autoRunning)}`}
                        className="absolute inset-0 origin-left rounded-full bg-green-500"
                        style={
                          autoRunning
                            ? { animation: `hero-dot-progress ${HERO_SLIDE_INTERVAL_MS}ms linear both` }
                            : { transform: 'scaleX(1)' }
                        }
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/*
            ── 스택 모드 (lg 미만) ──
            높이를 고정 px로 두면 좁은 화면에서 과하게 커 보입니다.
            화면 폭에 따라 같이 줄어들도록 16/10 비율로 잡았습니다.

            SVG 계층 다이어그램은 데스크톱 좌우 분할에서만 씁니다.
            좁은 폭에서는 글자가 14px 아래로 떨어져 읽히지 않습니다.
          */}
          {/* ── 스택 모드 (lg 미만) — 세 슬라이드 모두 같은 16:10 상자 ── */}
          <div className="relative mt-8 aspect-[16/10] w-full overflow-hidden rounded bg-white lg:hidden">
            {slides.map((s, i) => (
              <div
                key={s.id}
                className="hero-slide absolute inset-0"
                data-active={i === active}
                aria-hidden="true"
              >
                <Image
                  src={s.image}
                  alt=""
                  fill
                  sizes="(max-width: 1023px) calc(100vw - 40px), 42vw"
                  className="hero-slide-img object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
