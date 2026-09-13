import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  /**
   * 정적 자산·API·메타데이터 라우트를 제외한 모든 경로에 로케일 처리를 적용합니다.
   *
   * opengraph-image는 확장자가 없어 `.*\..*` 규칙에 걸리지 않습니다.
   * 빼주지 않으면 미들웨어가 로케일 경로로 넘겨버려 404가 납니다.
   * (sitemap.xml · robots.txt는 점이 있어 이미 제외됩니다)
   *
   * 패턴 앞에 `.*`를 붙인 이유: 라우트별 OG 카드는
   * /ko/infolink/opengraph-image 처럼 중첩 경로에 생깁니다.
   * 경로 맨 앞에서만 거르면 그게 미들웨어로 새어 들어가
   * 로케일 리다이렉트를 타고 카드가 깨집니다.
   */
  matcher: ['/((?!api|_next|_vercel|.*opengraph-image|.*twitter-image|icon|apple-icon|.*\\..*).*)'],
};
