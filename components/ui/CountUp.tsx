'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { observeOnce, prefersReducedMotion } from '@/lib/motion';

/**
 * 숫자가 0에서 목표값까지 올라갑니다.
 *
 * 사이트에서 이 효과를 쓰는 곳은 히어로 바로 아래 숫자 띠 하나뿐입니다.
 * 그 띠의 목적이 「회사가 이미 이만큼 가지고 있다」를 스크롤 전에 증명하는 것이라,
 * 눈이 숫자에 머무는 것 자체가 그 섹션이 할 일입니다. 장식이 아니라 기능입니다.
 *
 * 값은 '8단계' · '128종'처럼 단위가 붙어 옵니다.
 * 앞의 숫자만 세고 뒤는 그대로 둡니다 — 단위까지 흔들면 글자가 떨려 읽기 어렵습니다.
 *
 * 접근성
 *  - 세는 동안에도 최종값을 aria-label로 먼저 알립니다. 스크린리더가 중간값을 읽지 않습니다.
 *  - prefers-reduced-motion이면 처음부터 최종값을 그립니다.
 */

const DURATION_MS = 1100;

/** 끝에서 부드럽게 멈춥니다. 등속으로 세면 기계 카운터처럼 보입니다. */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * 서버 렌더링 중에는 useLayoutEffect가 경고를 냅니다.
 * 서버에서는 아무것도 하지 않고 브라우저에서만 레이아웃 직전에 실행합니다.
 */
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export default function CountUp({ value, className }: { value: string; className?: string }) {
  const match = /^(\d+)(.*)$/.exec(value);
  const target = match ? Number(match[1]) : null;
  const suffix = match ? match[2] : '';

  const ref = useRef<HTMLSpanElement>(null);

  /**
   * 서버에서는 최종값을 그립니다.
   *
   * 전에는 0으로 시작해서, JS가 꺼진 환경이나 HTML만 읽는 도구에는
   * 「0단계 · 0개 · 0종」으로 보였습니다. 회사가 가진 것을 증명하는 자리인데
   * 정반대를 말하고 있었던 셈입니다.
   *
   * 브라우저에서는 화면에 그리기 직전(useLayoutEffect)에 0으로 되돌린 뒤 셉니다.
   * useEffect로 하면 최종값이 한 프레임 보였다가 0으로 튀어 깜빡입니다.
   */
  const [shown, setShown] = useState<number | null>(target);

  useIsomorphicLayoutEffect(() => {
    if (target === null || prefersReducedMotion()) return;
    setShown(0);
  }, [target]);

  useEffect(() => {
    const el = ref.current;
    if (!el || target === null) return;

    if (prefersReducedMotion()) {
      setShown(target);
      return;
    }

    let raf = 0;
    const stop = observeOnce(
      el,
      () => {
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / DURATION_MS, 1);
          setShown(Math.round(easeOut(p) * target));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      /**
       * 등장 애니메이션(Reveal)과 달리 미리 시작하면 안 됩니다.
       *
       * Reveal은 화면에 닿기 전(뷰포트 아래 20%)부터 시작해야
       * 눈에 들어올 즈음 전환이 끝나 있어 자연스럽습니다.
       * 숫자는 정반대입니다 — 세는 과정 자체가 보여야 하는데,
       * 미리 시작하면 히어로를 보고 있는 사이에 아래에서 다 세어버리고
       * 스크롤해 내려왔을 때는 이미 멈춘 숫자만 남습니다.
       *
       * 그래서 숫자의 80%가 실제로 화면에 들어왔을 때 시작합니다.
       */
      { threshold: 0.8, rootMargin: '0px' },
    );

    return () => {
      stop();
      cancelAnimationFrame(raf);
    };
  }, [target]);

  // 숫자로 시작하지 않는 값은 그대로 둡니다.
  if (target === null) return <span className={className}>{value}</span>;

  return (
    <span ref={ref} className={className} aria-label={value}>
      <span aria-hidden="true">
        {shown}
        {suffix}
      </span>
    </span>
  );
}
