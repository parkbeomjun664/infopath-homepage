import type { ReactNode } from 'react';

/**
 * 섹션 상단 영문 라벨
 * 모노 대문자 + 자간 확장. tone으로 색, size로 크기를 고릅니다.
 */

type Tone = 'green' | 'navy' | 'muted';
type Size = 'sm' | 'md';

const TONE: Record<Tone, string> = {
  green: 'text-green-600',
  navy: 'text-navy-700',
  muted: 'text-fg-subtle',
};

const RULE: Record<Tone, string> = {
  green: 'bg-green-500/40',
  navy: 'bg-navy-700/25',
  muted: 'bg-line',
};

const SIZE: Record<Size, string> = {
  sm: 'text-label font-semibold uppercase tracking-[0.12em]', // 12px
  md: 'text-caption font-semibold uppercase leading-none tracking-[0.14em]', // 히어로용
};

export default function SectionLabel({
  children,
  tone = 'green',
  size = 'sm',
  withRule = false,
  className = '',
}: {
  children: ReactNode;
  tone?: Tone;
  size?: Size;
  /** 라벨 오른쪽으로 얇은 헤어라인을 늘립니다 (카드 없이 구역을 구분할 때) */
  withRule?: boolean;
  className?: string;
}) {
  return (
    <p className={`flex items-center gap-3 ${className}`}>
      <span className={`${SIZE[size]} ${TONE[tone]}`}>{children}</span>
      {withRule && <span aria-hidden="true" className={`h-px flex-1 ${RULE[tone]}`} />}
    </p>
  );
}
