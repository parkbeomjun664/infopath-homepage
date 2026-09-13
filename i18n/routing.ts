import { defineRouting } from 'next-intl/routing';

/**
 * 로케일 정의
 *
 * ALL_LOCALES  : 타입 차원에서 예약된 전체 목록. 'zh'는 타입에만 존재하고 라우팅에는 아직 포함하지 않습니다.
 * ACTIVE_LOCALES : 실제 라우팅되는 로케일. 중국어 추가 시 여기에 'zh'만 넣으면 됩니다.
 */
export const ALL_LOCALES = ['ko', 'en', 'zh'] as const;
export type Locale = (typeof ALL_LOCALES)[number];

export const ACTIVE_LOCALES = ['ko', 'en'] as const satisfies readonly Locale[];
export type ActiveLocale = (typeof ACTIVE_LOCALES)[number];

export const DEFAULT_LOCALE: ActiveLocale = 'ko';

/** 언어 전환 UI에 노출할 표기 */
export const LOCALE_LABELS: Record<Locale, { short: string; full: string }> = {
  ko: { short: 'KO', full: '한국어' },
  en: { short: 'EN', full: 'English' },
  zh: { short: 'ZH', full: '中文' },
};

export function isActiveLocale(value: string): value is ActiveLocale {
  return (ACTIVE_LOCALES as readonly string[]).includes(value);
}

export const routing = defineRouting({
  locales: ACTIVE_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  // 국문이 주 시장이므로 기본 로케일은 접두사 없이 (/, /solution),
  // 영문만 /en 접두사를 붙입니다.
  localePrefix: 'as-needed',
});
