'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

/**
 * 이미지 확대 보기
 *
 * 아키텍처 도면은 글자가 조밀해 축소하면 읽히지 않습니다.
 * 새 탭으로 보내면 페이지를 벗어나므로, 같은 자리에서 크게 봅니다.
 *
 * 접근성
 *  - ESC로 닫기, 배경 클릭으로 닫기
 *  - 열릴 때 닫기 버튼으로 포커스를 옮기고, 닫으면 원래 있던 곳으로 되돌립니다
 *  - 열려 있는 동안 뒤 페이지 스크롤을 막습니다
 */

export default function ImageLightbox({
  src,
  alt,
  title,
  onClose,
}: {
  src: string;
  alt: string;
  title: string;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<Element | null>(null);
  const t = useTranslations('architecture');

  useEffect(() => {
    returnFocusRef.current = document.activeElement;
    closeRef.current?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      if (returnFocusRef.current instanceof HTMLElement) returnFocusRef.current.focus();
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[100] flex flex-col bg-navy-950/90 p-4 lg:p-8"
      onClick={onClose}
    >
      <div className="mb-3 flex shrink-0 items-center justify-between gap-4">
        <p className="text-caption font-medium text-white/80">{title}</p>
        <div className="flex items-center gap-4">
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-caption font-medium text-white/60 underline-offset-4 hover:text-white hover:underline"
          >
            {t('openOriginal')}
          </a>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded px-3 py-1.5 text-caption font-semibold text-white/80 ring-1 ring-white/25 transition hover:bg-white/10 hover:text-white"
          >
            {t('close')}
          </button>
        </div>
      </div>

      {/* 도면은 원본 비율대로 최대한 크게. 클릭이 배경으로 새지 않게 막습니다. */}
      <div
        className="relative min-h-0 flex-1 overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt={alt}
          width={1536}
          height={1024}
          sizes="100vw"
          className="mx-auto h-auto w-full max-w-[1800px] rounded bg-white"
        />
      </div>
    </div>
  );
}
