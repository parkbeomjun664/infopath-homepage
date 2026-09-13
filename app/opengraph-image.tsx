import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from '@/lib/og';

/**
 * 기본 OG 카드.
 * 라우트별 카드가 없는 페이지(개인정보처리방침 등)와 404가 이걸 씁니다.
 */

export const alt = 'INFOPATH — Smart Factory MES';
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOgCard({
    eyebrow: 'SMART FACTORY MES',
    title: 'INFOPATH',
    subtitle: 'We build it on a platform that already runs',
  });
}
