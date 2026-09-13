import type { ComponentProps, ReactNode } from 'react';
import { Link } from '@/i18n/navigation';

/**
 * 버튼 / 링크
 *
 * primary   로고 네이비 솔리드 — 페이지당 하나의 주 행동에만
 * cta       content/site.ts의 CTA_VARIANT 색상 — S8 배너 등 강조 구간용
 * outline   네이비 아웃라인
 * link      화살표가 붙는 텍스트 링크 — 보조 행동
 *
 * 서버 컴포넌트에서 그대로 쓸 수 있도록 훅을 쓰지 않습니다.
 */

type Variant = 'primary' | 'cta' | 'outline' | 'link' | 'inverse';
type Size = 'md' | 'lg';

const BASE =
  'inline-flex items-center justify-center gap-2 font-semibold ' +
  'transition-all duration-250 ease-out ' +
  'disabled:pointer-events-none disabled:opacity-55 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-700 ' +
  'focus-visible:ring-offset-2 focus-visible:ring-offset-bg';

/**
 * 솔리드 버튼은 hover에서 색이 살짝 밝아지고 2px 떠오릅니다.
 * 그림자는 떠오른 느낌을 만들 최소한으로만 씁니다 — 흰 배경에서 과한 그림자는 지저분해집니다.
 */
const VARIANT: Record<Variant, string> = {
  primary:
    'rounded-lg bg-navy-700 text-white shadow-[0_2px_12px_rgba(0,48,96,0.12)] ' +
    'hover:-translate-y-0.5 hover:bg-navy-600 hover:shadow-[0_6px_18px_rgba(0,48,96,0.16)] ' +
    'active:translate-y-0 active:bg-navy-800',
  cta:
    'rounded-lg bg-cta text-cta-fg shadow-[0_2px_12px_rgba(0,48,96,0.12)] ' +
    'hover:-translate-y-0.5 hover:bg-cta-hover hover:shadow-[0_6px_18px_rgba(0,48,96,0.16)] ' +
    'active:translate-y-0',
  outline: 'rounded-lg border border-navy-700/25 text-navy-700 hover:border-navy-700/50 hover:bg-navy-50',
  // 어두운 배경(CTA 배너) 위 — 흰 솔리드
  inverse:
    'rounded-lg bg-white text-navy-800 shadow-[0_2px_12px_rgba(0,0,0,0.18)] ' +
    'hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_6px_18px_rgba(0,0,0,0.24)] ' +
    'active:translate-y-0 focus-visible:ring-white',
  // 텍스트 링크는 패딩을 최소화해 주 버튼과 시각적으로 경쟁하지 않게 합니다.
  link: 'text-navy-700/70 hover:text-navy-700',
};

const SIZE: Record<Size, string> = {
  md: 'px-5 py-2.5 text-caption',
  lg: 'px-7 py-4 text-body',
};

// link 변형은 배경이 없으므로 좌우 패딩을 주지 않습니다.
const LINK_SIZE: Record<Size, string> = {
  md: 'py-2.5 text-caption',
  lg: 'py-4 text-body',
};

type BaseProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

type LinkProps = BaseProps & { href: string } & Omit<
    ComponentProps<typeof Link>,
    'href' | 'className' | 'children'
  >;

type ButtonProps = BaseProps & { href?: undefined } & Omit<
    ComponentProps<'button'>,
    'className' | 'children'
  >;

function classes({ variant = 'primary', size = 'md', className = '' }: BaseProps) {
  return [BASE, VARIANT[variant], variant === 'link' ? LINK_SIZE[size] : SIZE[size], className]
    .filter(Boolean)
    .join(' ');
}

export default function Button(props: LinkProps | ButtonProps) {
  const { children, variant = 'primary', size = 'md', className, ...rest } = props;
  const cls = classes({ children, variant, size, className });

  const content = (
    <>
      {children}
      {variant === 'link' && (
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
          →
        </span>
      )}
    </>
  );

  if ('href' in rest && rest.href !== undefined) {
    const { href, ...linkRest } = rest as Omit<LinkProps, keyof BaseProps>;
    return (
      <Link href={href} className={`group ${cls}`} {...linkRest}>
        {content}
      </Link>
    );
  }

  const buttonRest = rest as Omit<ButtonProps, keyof BaseProps | 'href'>;
  return (
    <button className={`group ${cls}`} {...buttonRest}>
      {content}
    </button>
  );
}
