import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from '@/lib/og';
import { ACTIVE_LOCALES } from '@/i18n/routing';

/**
 * 문의 페이지 OG 카드.
 * 문구는 라틴 문자만 — 이유는 lib/og.tsx 주석 참고.
 */

export const alt = 'Contact INFOPATH';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** 로케일별로 미리 생성합니다. 문구는 같지만 경로가 다릅니다. */
export function generateStaticParams() {
  return ACTIVE_LOCALES.map((locale) => ({ locale }));
}

export default async function Image() {
  return renderOgCard({
    eyebrow: 'CONTACT',
    title: 'Get in touch',
    subtitle: 'Tell us where your floor is stuck',
  });
}
