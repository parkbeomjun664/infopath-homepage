import type { MetadataRoute } from 'next';

import { ALLOW_INDEXING, SITE_URL } from '@/lib/seo';

/**
 * robots.txt
 *
 * 색인이 허용되지 않은 동안에는 전체를 차단합니다.
 * 검토용 배포가 검색 결과에 잡히면 초안 상태의 방침과 빈 사업자 정보가 그대로 노출됩니다.
 *
 * 정식 오픈: 환경변수 NEXT_PUBLIC_ALLOW_INDEXING=true 후 재배포
 */

export default function robots(): MetadataRoute.Robots {
  if (!ALLOW_INDEXING) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /api는 기계용 엔드포인트라 색인 대상이 아닙니다
        disallow: ['/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
