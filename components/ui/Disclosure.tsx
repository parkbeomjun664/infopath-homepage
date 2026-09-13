'use client';

import { useRef, type ReactNode } from 'react';

import { EASE } from '@/lib/motion';
import { prefersReducedMotion } from '@/lib/motion';

/**
 * 접었다 펴지는 블록 — 부드러운 높이 전환
 *
 * <details>/<summary>를 그대로 씁니다. 아코디언을 직접 만들면 키보드 조작·포커스·
 * 스크린리더 대응을 다시 구현해야 하고, 브라우저가 이미 전부 해줍니다.
 * 다만 <details>는 열고 닫을 때 높이가 툭 끊깁니다. 그 부분만 가져옵니다.
 *
 * 동작
 *  - 열 때  : open을 먼저 켜서 높이를 잰 뒤 0 → 실제 높이로 애니메이션
 *  - 닫을 때: 실제 높이 → 0으로 애니메이션한 다음 open을 끕니다
 *            (먼저 끄면 내용이 사라져 애니메이션할 대상이 없습니다)
 *  - JS가 없으면 기본 동작 그대로 여닫힙니다. 내용은 언제나 DOM에 있습니다.
 *  - prefers-reduced-motion이면 애니메이션을 건너뛰고 브라우저에 맡깁니다.
 *
 * 높이를 CSS transition으로 못 하는 이유: 닫힌 <details>의 내용은 렌더 트리에서
 * 빠져 있어 전환할 시작값이 없습니다. 그래서 Web Animations API로 직접 잽니다.
 */

const DURATION_MS = 300;

type Props = {
  summary: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  /** <details>에 붙는 클래스. group-open: 유틸리티를 쓰려면 group이 이미 붙어 있습니다 */
  className?: string;
  summaryClassName?: string;
  panelClassName?: string;
};

export default function Disclosure({
  summary,
  children,
  defaultOpen = false,
  className = '',
  summaryClassName = '',
  panelClassName = '',
}: Props) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<Animation | null>(null);

  const cleanup = () => {
    if (panelRef.current) panelRef.current.style.height = '';
    animRef.current = null;
  };

  const onSummaryClick = (e: React.MouseEvent<HTMLElement>) => {
    const details = detailsRef.current;
    const panel = panelRef.current;
    if (!details || !panel) return;

    // 모션을 줄이라고 설정한 사용자에게는 브라우저 기본 동작을 그대로 둡니다.
    if (prefersReducedMotion() || typeof panel.animate !== 'function') return;

    e.preventDefault();
    animRef.current?.cancel();

    const opening = !details.open;
    if (opening) details.open = true; // 높이를 재려면 먼저 열려 있어야 합니다

    const height = panel.scrollHeight;
    const frames = opening
      ? { height: ['0px', `${height}px`], opacity: [0, 1] }
      : { height: [`${height}px`, '0px'], opacity: [1, 0] };

    const anim = panel.animate(frames, { duration: DURATION_MS, easing: EASE });
    animRef.current = anim;

    anim.onfinish = () => {
      if (!opening) details.open = false;
      cleanup();
    };
    anim.oncancel = cleanup;
  };

  return (
    <details ref={detailsRef} open={defaultOpen} className={`group ${className}`}>
      <summary
        onClick={onSummaryClick}
        className={`cursor-pointer list-none [&::-webkit-details-marker]:hidden ${summaryClassName}`}
      >
        {summary}
      </summary>

      {/* 애니메이션 중 내용이 밖으로 삐져나오지 않도록 잘라냅니다 */}
      <div ref={panelRef} className={`overflow-hidden ${panelClassName}`}>
        {children}
      </div>
    </details>
  );
}
