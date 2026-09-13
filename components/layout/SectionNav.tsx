'use client';

import { useEffect, useRef, useState } from 'react';

import Container from '@/components/layout/Container';

/**
 * 페이지 안 구간 이동 바
 *
 * /infolink는 섹션 6개가 한 페이지에 세로로 이어집니다.
 * 읽는 사람이 지금 어디쯤인지, 뭐가 얼마나 남았는지 알 수 없으면 중간에서 나갑니다.
 * 앵커는 이미 각 섹션에 붙어 있었고, 없던 것은 그걸 보여주는 UI였습니다.
 *
 * 동작
 *  - 헤더 바로 아래에 붙어 따라옵니다. 헤더는 스크롤하면 88 → 68px로 줄어들므로
 *    이 바의 top도 같이 따라가야 겹치거나 뜨지 않습니다.
 *  - 지금 보고 있는 구간을 표시합니다(스크롤 스파이).
 *    화면 위쪽 25% 지점을 지나는 섹션을 '현재'로 봅니다 —
 *    가장 많이 보이는 섹션을 고르면 긴 섹션이 계속 이겨서 표시가 늦게 바뀝니다.
 *  - 좁은 화면에서는 가로로 밀어서 봅니다. 6개를 줄여 넣으면 글자가 읽히지 않습니다.
 *
 * 이동 자체는 그냥 앵커 링크입니다. JS가 죽어도 동작하고,
 * 각 섹션의 scroll-margin이 헤더 높이만큼 잡혀 있어 제목이 가리지 않습니다.
 */

type Item = { id: string; label: string };

export default function SectionNav({ items, ariaLabel }: { items: Item[]; ariaLabel: string }) {
  const [active, setActive] = useState<string>(items[0]?.id ?? '');
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const sections = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // 화면 위쪽 띠를 지나는 섹션들 중 가장 위에 있는 것이 '현재'입니다.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-25% 0px -70% 0px', threshold: 0 },
    );

    for (const el of sections) observer.observe(el);
    return () => observer.disconnect();
  }, [items]);

  // 좁은 화면에서 현재 항목이 가로 스크롤 밖에 있으면 끌어옵니다.
  useEffect(() => {
    const list = listRef.current;
    const el = list?.querySelector<HTMLElement>(`[data-nav-id="${active}"]`);
    if (!list || !el) return;
    const left = el.offsetLeft - list.clientWidth / 2 + el.clientWidth / 2;
    list.scrollTo({ left: Math.max(left, 0), behavior: 'smooth' });
  }, [active]);

  return (
    <nav
      aria-label={ariaLabel}
      className="sticky top-16 z-40 border-b border-line bg-white/95 backdrop-blur lg:top-[68px]"
    >
      <Container>
        <ul
          ref={listRef}
          className="-mx-1 flex gap-1 overflow-x-auto scroll-smooth py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => {
            const current = item.id === active;
            return (
              <li key={item.id} className="shrink-0">
                <a
                  href={`#${item.id}`}
                  data-nav-id={item.id}
                  aria-current={current ? 'true' : undefined}
                  className={[
                    'block whitespace-nowrap rounded px-3 py-2.5 text-caption font-medium transition-colors',
                    current
                      ? 'text-navy-900'
                      : 'text-navy-700/55 hover:text-navy-700',
                  ].join(' ')}
                >
                  {item.label}
                  {/* 현재 구간 표시 — 밑줄로만. 배경을 칠하면 바가 무거워집니다 */}
                  <span
                    aria-hidden="true"
                    className={[
                      'mt-1.5 block h-0.5 rounded-full transition-colors',
                      current ? 'bg-green-500' : 'bg-transparent',
                    ].join(' ')}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </Container>
    </nav>
  );
}
