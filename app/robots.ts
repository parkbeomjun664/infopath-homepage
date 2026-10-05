import type { MetadataRoute } from 'next';

import { INDEXING_MODE, SITE_URL } from '@/lib/seo';

/**
 * robots.txt
 *
 * 모드별 동작은 lib/indexing.ts 의 주석을 보십시오. 요점만 적으면,
 * **hidden 에서도 크롤링을 허용합니다.**
 *
 * 색인에서 빼려면 크롤러가 페이지를 가져가 noindex 를 읽어야 합니다.
 * 여기서 Disallow 로 막으면 그걸 못 읽어서, 이미 등록된 주소가
 * 색인에 그대로 남습니다. 빼는 중에는 열어두는 것이 맞습니다.
 *
 * sitemap 도 hidden 에서 유지합니다 — 크롤러가 빨리 다시 와서
 * noindex 를 읽고 가는 편이 색인 소멸이 빠릅니다.
 */

export default function robots(): MetadataRoute.Robots {
  /**
   * 완전 차단. 검색 결과에서 다 빠진 것을 확인한 뒤에만 쓰십시오.
   * sitemap 도 함께 내립니다 — 크롤링을 거부하면서 수집 목록을 주는 것은 모순입니다.
   */
  if (INDEXING_MODE === 'blocked') {
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
