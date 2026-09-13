import type { ElementType, ReactNode } from 'react';

/**
 * 페이지 공통 컨테이너
 *
 * 헤더·히어로·섹션·푸터가 모두 이것을 씁니다.
 * 컨테이너 폭과 좌우 여백을 여기 한 곳에서만 정하므로,
 * 헤더 로고의 좌측 끝과 본문 제목의 좌측 끝이 항상 같은 좌표에 옵니다.
 *
 * 값은 tailwind.config.ts의 토큰에서 옵니다 — 이 파일에도 숫자를 적지 않습니다.
 *   max-w-hero      1200px
 *   px-gutter       20px  (모바일)
 *   px-gutter-md    40px  (태블릿, md~)
 *   px-gutter-lg    64px  (데스크톱, lg~)
 */

export default function Container({
  children,
  className = '',
  as,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  [key: string]: unknown;
}) {
  const Tag = (as ?? 'div') as ElementType;

  return (
    <Tag
      className={`mx-auto w-full max-w-hero px-gutter md:px-gutter-md lg:px-gutter-lg ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
