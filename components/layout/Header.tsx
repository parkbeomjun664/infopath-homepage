'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import Container from '@/components/layout/Container';
import { Link, usePathname } from '@/i18n/navigation';
import { ACTIVE_LOCALES, LOCALE_LABELS, type ActiveLocale } from '@/i18n/routing';
import { ASSETS, ASSET_DIMENSIONS, NAV } from '@/content/site';

/**
 * 상단 헤더
 *
 * 최상단에서는 배경 투명. 60px 이상 스크롤하면 흰 배경 + 헤어라인 + 옅은 그림자로 바뀝니다.
 * 높이는 모바일 64px 고정, 데스크톱 88 → 68px.
 *
 * 좌우 여백은 Container가 정합니다 — 로고 좌측 끝이 본문 제목 좌측 끝과 같은 좌표에 옵니다.
 *
 * lg 미만에서는 메뉴와 언어 전환을 모두 햄버거 안으로 넣고
 * 바에는 로고 · CTA · 햄버거만 남깁니다.
 */

const SCROLL_THRESHOLD = 60;

export default function Header({ locale }: { locale: ActiveLocale }) {
  const t = useTranslations();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > SCROLL_THRESHOLD);
        frame = 0;
      });
    };

    onScroll(); // 새로고침으로 중간 위치에서 시작한 경우 대비
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  // 라우트가 바뀌면 메뉴를 닫습니다.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const compact = scrolled || menuOpen;

  /** KO / EN — 활성은 굵게, 비활성은 흐리게. 사이에 얇은 구분선을 둡니다. */
  const localeSwitch = (variant: 'bar' | 'menu') => (
    <nav
      aria-label={t('nav.language')}
      className={variant === 'bar' ? 'flex items-center' : 'flex items-center'}
    >
      {ACTIVE_LOCALES.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && (
            <span aria-hidden="true" className="h-3 w-px shrink-0 bg-navy-700/20" />
          )}
          <Link
            href={pathname}
            locale={l}
            aria-current={l === locale ? 'true' : undefined}
            className={[
              'px-2 text-caption tracking-[0.05em] transition-opacity duration-200',
              l === locale
                ? 'font-semibold text-navy-700 opacity-100'
                : 'font-normal text-navy-700 opacity-40 hover:opacity-70',
            ].join(' ')}
          >
            {LOCALE_LABELS[l].short}
          </Link>
        </span>
      ))}
    </nav>
  );

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-out',
        compact
          ? 'border-b border-line bg-white shadow-[0_1px_16px_rgba(0,48,96,0.06)]'
          : 'border-b border-transparent bg-transparent shadow-none',
      ].join(' ')}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:rounded focus:bg-navy-700 focus:px-4 focus:py-2 focus:text-caption focus:text-white"
      >
        {t('nav.skipToContent')}
      </a>

      <Container
        className={[
          'flex items-center transition-all duration-300 ease-out',
          compact ? 'h-16 lg:h-[68px]' : 'h-16 lg:h-[88px]',
        ].join(' ')}
      >
        {/* 로고 — 모바일 40px / 데스크톱 48px */}
        <Link href="/" className="flex shrink-0 items-center" aria-label={t('meta.siteName')}>
          <Image
            src={ASSETS.logo}
            alt={t('meta.siteName')}
            width={ASSET_DIMENSIONS.logo.width}
            height={ASSET_DIMENSIONS.logo.height}
            priority
            className="h-10 w-auto lg:h-12"
          />
        </Link>

        {/* 메뉴 — lg부터. 좌우 그룹 사이 여백은 flex-1이 자동으로 채웁니다. */}
        <nav
          className="ml-16 hidden flex-1 items-center gap-10 lg:flex"
          aria-label={t('nav.menu')}
        >
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="group relative py-1 text-[17px] font-medium tracking-[-0.01em] text-navy-700/80 transition-colors duration-200 hover:text-navy-700"
            >
              {t(`nav.${item.key}`)}
              <span
                aria-hidden="true"
                className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 rounded-full bg-green-500 transition-transform duration-200 ease-out group-hover:scale-x-100"
              />
            </Link>
          ))}
        </nav>

        {/* lg 미만에서는 메뉴가 없으므로 여기서 남은 공간을 밀어냅니다 */}
        <div className="flex-1 lg:hidden" />

        <div className="flex shrink-0 items-center">
          {/* 언어 전환 — lg부터. 그 아래는 햄버거 메뉴 안에 있습니다. */}
          <div className="hidden lg:flex lg:items-center">{localeSwitch('bar')}</div>

          {/* CTA — 언어 전환과 32px 간격, 컨테이너 우측 경계에 정확히 맞습니다 */}
          <Link
            href="/contact"
            className="inline-flex h-11 items-center rounded-lg bg-navy-700 px-6 text-[16px] font-semibold tracking-[-0.01em] text-white shadow-[0_2px_12px_rgba(0,48,96,0.12)] transition-all duration-250 ease-out hover:-translate-y-0.5 hover:bg-navy-600 hover:shadow-[0_6px_18px_rgba(0,48,96,0.16)] lg:ml-8"
          >
            {t('common.inquire')}
          </Link>

          {/* 햄버거 — lg 미만 */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="-mr-2 ml-2 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded text-navy-700 lg:hidden"
          >
            <span className="sr-only">{menuOpen ? t('nav.close') : t('nav.menu')}</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              {menuOpen ? (
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" />
              )}
            </svg>
          </button>
        </div>
      </Container>

      {/* 접이식 메뉴 — lg 미만 */}
      <div id="mobile-menu" hidden={!menuOpen} className="border-t border-line bg-white lg:hidden">
        <Container as="nav" className="flex flex-col py-2" aria-label={t('nav.menu')}>
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="border-b border-line py-3.5 text-[17px] font-medium tracking-[-0.01em] text-navy-700"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}

          <div className="flex items-center gap-3 py-4">
            <span className="text-caption text-navy-700/60">{t('nav.language')}</span>
            {localeSwitch('menu')}
          </div>
        </Container>
      </div>
    </header>
  );
}
