'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

/**
 * 히어로 하단 스크롤 유도 표시.
 * 얇은 세로선 + 화살표가 2초 주기로 6px 오르내리다가, 스크롤이 시작되면 사라집니다.
 */

const HIDE_AFTER_PX = 40;

export default function HeroScrollCue() {
  const t = useTranslations('hero');
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        setHidden(window.scrollY > HIDE_AFTER_PX);
        frame = 0;
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={[
        // lg 미만은 스택 모드라 이미지 위에 겹칩니다. 데스크톱 좌우 분할에서만 노출합니다.
        // 이미지가 우측 42%를 세로로 가득 채우므로, 좌측 텍스트 영역(58%)의 가운데에 둡니다.
        'pointer-events-none absolute bottom-10 left-[29%] hidden -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-500 ease-out lg:flex',
        hidden ? 'opacity-0' : 'opacity-100',
      ].join(' ')}
    >
      <span className="sr-only">{t('scrollHint')}</span>
      <span className="h-12 w-px bg-gradient-to-b from-transparent to-navy-700/25" />
      <span
        className="text-navy-700/55"
        style={{ animation: 'hero-cue-bob 2s ease-in-out infinite' }}
      >
        <svg width="14" height="9" viewBox="0 0 14 9" fill="none">
          <path
            d="M1 1L7 7L13 1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
}
