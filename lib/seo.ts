import { ACTIVE_LOCALES, DEFAULT_LOCALE, type ActiveLocale } from '@/i18n/routing';
import { cleanEnv } from '@/lib/env';

/**
 * SEO 공통 값
 *
 * 사이트 URL은 환경변수에서 읽습니다. 배포 환경마다 달라지고,
 * 코드에 박아두면 프리뷰 배포의 canonical이 운영 주소를 가리키게 됩니다.
 */

export const SITE_URL = cleanEnv(
  process.env.NEXT_PUBLIC_SITE_URL,
  'https://infopath.co.kr',
).replace(/\/$/, '');

/**
 * 검색엔진 색인 모드는 lib/indexing.ts 에서 결정합니다.
 * 여기서 다시 내보내는 것은 SEO 관련 값을 한 곳에서 가져오게 하기 위한 편의입니다.
 * 판단 로직을 이 파일에 복사하지 마십시오 — 기준이 둘로 갈라집니다.
 */
export { INDEXING_MODE, ALLOW_CRAWLING, ALLOW_INDEXING, type IndexingMode } from '@/lib/indexing';

/** 검색엔진에 노출할 경로. /privacy는 법무 검토 전이라 제외합니다. */
export const INDEXABLE_PATHS = ['', '/infolink', '/about', '/contact'] as const;

/** 로케일 접두사 규칙은 as-needed — 기본 로케일(ko)은 접두사가 없습니다. */
export function localizedPath(locale: ActiveLocale, path: string): string {
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  return `${prefix}${path}` || '/';
}

export function absoluteUrl(locale: ActiveLocale, path: string): string {
  return `${SITE_URL}${localizedPath(locale, path)}`;
}

/** hreflang 대체 링크 — 같은 페이지의 다른 언어판을 검색엔진에 알려줍니다. */
export function alternateLanguages(path: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const locale of ACTIVE_LOCALES) {
    out[locale] = absoluteUrl(locale, path);
  }
  return out;
}
