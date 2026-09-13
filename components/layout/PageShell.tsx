import type { ReactNode } from 'react';

import SectionLabel from '@/components/ui/SectionLabel';
import Container from '@/components/layout/Container';
import Reveal from '@/components/motion/Reveal';

/**
 * 서브 페이지 공통 골격
 *
 * 헤더가 fixed라 본문이 그 아래로 들어가지 않도록 상단 여백을 둡니다
 * (헤더 높이 88px + 여백).
 */

export default function PageShell({
  label,
  heading,
  lead,
  children,
}: {
  label: string;
  heading: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    // 상단 여백은 헤더 높이에 맞춥니다 — 모바일 64px, 데스크톱 88px
    <main id="main" className="pb-24 pt-32 lg:pb-32 lg:pt-[200px]">
      <Container>
        <Reveal>
          <SectionLabel tone="green" size="md">
            {label}
          </SectionLabel>
          <h1 className="mt-6 max-w-[24ch] whitespace-pre-line text-[clamp(1.875rem,3.4vw,2.75rem)] font-medium leading-[1.35] tracking-[-0.02em] text-navy-900">
            {heading}
          </h1>
          {lead && (
            <p className="mt-6 max-w-prose text-body-lg leading-relaxed text-navy-700/70">{lead}</p>
          )}
        </Reveal>

        {children}
      </Container>
    </main>
  );
}
