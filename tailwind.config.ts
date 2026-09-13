import type { Config } from 'tailwindcss';

/**
 * INFOPATH 디자인 토큰
 *
 * 팔레트 근거 — 임의 선정이 아니라 실제 브랜드 자산에서 추출한 값입니다.
 *   navy  #003060  : INFOPATH 로고 워드마크 / 인피니티 마크 좌측
 *   green #48A830  : INFOPATH 로고 인피니티 마크 우측 (AI·노드 심볼)
 *   azure #1878C0  : INFOLINK 배경 이미지 하이라이트 / 로고 하단 언더라인
 *
 * 색상은 tailwind 스케일과 CSS 변수 두 겹으로 둡니다.
 *   - brand-*  : 고정 팔레트 (직접 참조용)
 *   - bg/fg/cta 등 시맨틱 토큰 : globals.css의 CSS 변수를 참조 → 다크모드·CTA 변형 대응
 */

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── 고정 브랜드 팔레트 ──────────────────────────────
        navy: {
          50: '#EAF0F7',
          100: '#D0DFEE',
          200: '#A3BFDC',
          300: '#6E97C2',
          400: '#3E6EA3',
          500: '#1A4E85',
          600: '#0B3A6A',
          700: '#003060', // 로고 코어
          800: '#002348',
          900: '#001830', // INFOLINK 배경 심층부
          950: '#000C1A',
        },
        green: {
          50: '#EFF8EC',
          100: '#D9EFD2',
          200: '#B4DEA6',
          300: '#8BCC77',
          400: '#66B84F',
          500: '#48A830', // 로고 코어
          600: '#3A8C26',
          700: '#2E6E1E',
          800: '#245517',
          900: '#1B3F12',
        },
        azure: {
          50: '#EAF4FC',
          100: '#CDE6F8',
          200: '#9BCCF1',
          300: '#62ADE6',
          400: '#2E90D6',
          500: '#1878C0', // 배경 하이라이트 코어
          600: '#1260A0',
          700: '#0E4C80',
          800: '#0B3B63',
          900: '#082A47',
        },
        // 중립색: 순수 회색이 아니라 네이비 쪽으로 색상을 기울인 쿨그레이
        steel: {
          50: '#F6F8FA',
          100: '#ECF0F4',
          200: '#DDE3EA',
          300: '#C3CCD7',
          400: '#97A4B3',
          500: '#6B7A8C',
          600: '#4E5C6D',
          700: '#3A4655',
          800: '#29323E',
          900: '#1A212B',
          950: '#10151C',
        },
        // 상태색 — CTA/브랜드색과 분리 (대시보드형 콘텐츠에서 충돌 방지)
        state: {
          ok: '#2E9E5B',
          warn: '#C98A16',
          error: '#C4443A',
        },

        // ── 시맨틱 토큰 (CSS 변수 참조) ──────────────────────
        bg: 'rgb(var(--c-bg) / <alpha-value>)',
        surface: 'rgb(var(--c-surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--c-surface-2) / <alpha-value>)',
        line: 'rgb(var(--c-line) / <alpha-value>)',
        'line-strong': 'rgb(var(--c-line-strong) / <alpha-value>)',
        fg: 'rgb(var(--c-fg) / <alpha-value>)',
        'fg-muted': 'rgb(var(--c-fg-muted) / <alpha-value>)',
        'fg-subtle': 'rgb(var(--c-fg-subtle) / <alpha-value>)',
        'fg-invert': 'rgb(var(--c-fg-invert) / <alpha-value>)',
        brand: 'rgb(var(--c-brand) / <alpha-value>)',
        'brand-ink': 'rgb(var(--c-brand-ink) / <alpha-value>)',

        // CTA — content/site.ts의 ctaVariant 플래그로 전환 (green | azure | amber)
        cta: 'rgb(var(--c-cta) / <alpha-value>)',
        'cta-hover': 'rgb(var(--c-cta-hover) / <alpha-value>)',
        'cta-fg': 'rgb(var(--c-cta-fg) / <alpha-value>)',
        'cta-soft': 'rgb(var(--c-cta-soft) / <alpha-value>)',
      },

      fontFamily: {
        sans: [
          'var(--font-pretendard)',
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          '"Malgun Gothic"',
          'sans-serif',
        ],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },

      fontSize: {
        // 본문 기준 17px. 한글은 같은 픽셀에서 라틴 문자보다 작아 보여 한 단계씩 올렸습니다.
        'label': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.12em' }], // 12px 모노라벨
        'caption': ['0.9375rem', { lineHeight: '1.6' }],                        // 15px
        'body': ['1.0625rem', { lineHeight: '1.75' }],                               // 17px
        'body-lg': ['1.1875rem', { lineHeight: '1.7' }],                         // 19px
        'h4': ['1.375rem', { lineHeight: '1.45', letterSpacing: '-0.01em' }],     // 22px
        'h3': ['1.625rem', { lineHeight: '1.35', letterSpacing: '-0.015em' }],     // 26px
        'h2': ['2rem', { lineHeight: '1.28', letterSpacing: '-0.022em' }],       // 32px
        'h1': ['2.75rem', { lineHeight: '1.18', letterSpacing: '-0.03em' }],     // 44px
        'display': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.035em' }],// 60px
      },

      maxWidth: {
        container: '1280px',
        hero: '1200px',
        prose: '68ch',
      },

      spacing: {
        // 좌우 여백 3단계. 모든 섹션 컨테이너가 같은 값을 써야 세로줄이 맞습니다.
        gutter: '1.25rem', // 모바일 20px
        'gutter-md': '2.5rem', // 태블릿 40px
        'gutter-lg': '4rem', // 데스크톱 64px
        section: '5rem',
        'section-lg': '7.5rem',
      },

      borderRadius: {
        // 과한 둥근 모서리 배제 — 제조 IT 톤에 맞춘 낮은 반경
        DEFAULT: '2px',
        card: '3px',
        pill: '999px',
      },

      boxShadow: {
        card: '0 1px 2px rgb(0 24 48 / 0.05), 0 10px 30px -20px rgb(0 24 48 / 0.35)',
        'card-hover': '0 1px 2px rgb(0 24 48 / 0.06), 0 18px 40px -22px rgb(0 24 48 / 0.45)',
      },

      transitionDuration: {
        DEFAULT: '200ms',
        250: '250ms',
      },

      keyframes: {
        'rise-in': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        // 히어로 진입 — 20px 페이드업. 자식 요소에 animation-delay로 순차 재생합니다.
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'rise-in': 'rise-in 400ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-up': 'fade-up 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
};

export default config;
