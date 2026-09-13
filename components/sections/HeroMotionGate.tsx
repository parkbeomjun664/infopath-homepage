'use client';

import { useEffect } from 'react';

/**
 * 히어로 진입 시퀀스의 시작 신호만 담당합니다.
 *
 * 폰트가 늦게 도착하면 글자 모양이 바뀌는 도중에 애니메이션이 재생돼
 * 글자가 흔들려 보입니다(FOUT). document.fonts.ready를 기다린 뒤
 * <html data-hero-ready="true">를 붙이면 CSS가 그때부터 재생합니다.
 *
 * 타이밍·이징은 전부 globals.css의 .hero-seq-* 규칙에 있습니다.
 * 여기서 하는 일은 속성 하나 세우는 것뿐입니다.
 */

// 폰트 로딩이 지나치게 느리거나 실패해도 콘텐츠는 보여야 합니다.
const FALLBACK_MS = 1500;

export default function HeroMotionGate() {
  useEffect(() => {
    const root = document.documentElement;

    if (root.dataset.heroReady === 'true') return;

    const start = () => {
      root.dataset.heroReady = 'true';
    };

    const timer = window.setTimeout(start, FALLBACK_MS);

    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (fonts?.ready) {
      fonts.ready.then(() => {
        window.clearTimeout(timer);
        start();
      });
    } else {
      window.clearTimeout(timer);
      start();
    }

    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
