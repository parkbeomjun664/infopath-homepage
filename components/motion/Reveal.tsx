'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';
import { observeOnce, prefersReducedMotion } from '@/lib/motion';

/**
 * 뷰포트 진입 시 한 번만 재생되는 등장 애니메이션.
 *
 * 실제 전환은 globals.css의 [data-reveal] 규칙이 담당하고,
 * 여기서는 진입 감지와 will-change 수명 관리만 합니다.
 *
 * delay는 더 이상 화면에 반영하지 않습니다.
 * 카드 6장에 100ms씩 지연을 주면 마지막 카드가 반 초 뒤에 나타나 물결처럼 보였고,
 * 그게 「효과가 너무 많다」는 인상의 절반이었습니다.
 * 호출부를 한꺼번에 고치지 않아도 되도록 prop 자체는 남겨 두되 무시합니다.
 */

type Props = {
  children: ReactNode;
  /** @deprecated 순차 등장을 없앴습니다. 값을 넘겨도 무시됩니다. */
  delay?: number;
  className?: string;
  as?: ElementType;
  /** role, id, aria-* 등 래핑되는 요소에 그대로 전달할 속성 */
  [key: string]: unknown;
};

export default function Reveal({ children, delay: _delay, className, as, ...rest }: Props) {
  const Tag = (as ?? 'div') as ElementType;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      el.dataset.revealed = 'true';
      return;
    }

    const clearWillChange = () => {
      el.style.willChange = '';
    };

    const stop = observeOnce(el, () => {
      // 전환 직전에만 켭니다.
      el.style.willChange = 'opacity, transform';
      el.dataset.revealed = 'true';
      el.addEventListener('transitionend', clearWillChange, { once: true });
      // transitionend가 오지 않는 경우(탭 전환 등)를 대비한 안전장치
      window.setTimeout(clearWillChange, 700);
    });

    return () => {
      stop();
      el.removeEventListener('transitionend', clearWillChange);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
}
