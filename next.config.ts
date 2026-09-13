import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // output은 기본값을 씁니다 (Vercel이 알아서 처리).
  // 정적 export(`output: 'export'`)는 쓰지 않습니다 — app/api/inquiry가
  // 서버 런타임을 필요로 하고, next/image 최적화도 함께 비활성화되기 때문입니다.

  poweredByHeader: false,

  /**
   * resend를 번들에 넣지 않고 런타임에 require 합니다.
   * 번들링하면 React 이메일 템플릿용 선택적 의존성(@react-email/render)까지
   * 따라 들어가려다 "Module not found" 경고가 납니다.
   * 우리는 html/text 문자열로 보내므로 그 패키지가 필요 없습니다.
   */
  serverExternalPackages: ['resend'],

  images: {
    // Vercel의 이미지 최적화를 사용합니다. 로컬 자산만 쓰므로 원격 도메인 허용은 없습니다.
    formats: ['image/avif', 'image/webp'],

    /**
     * 기본값의 최대 폭(3840)을 뺐습니다.
     *
     * sizes="100vw"인 배경 사진(CTA 배너 · 이미지 밴드)은 1920 화면에 DPR 2면
     * 3840 변형을 고릅니다. factory-line.jpg 기준 644KB인데,
     * 그 사진은 남색 0.82로 덮여 형태만 보이는 배경입니다.
     *
     * 2048에서 끊으면 같은 자리에서 277KB로 내려갑니다.
     * 우리 사진 중 3840이 필요한 것은 없습니다 —
     * 아키텍처 도면조차 원본이 1536×1024라 더 키워도 얻는 게 없습니다.
     */
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  },

  /**
   * /solution → /infolink
   *
   * 라우트 이름을 실제 대상(제품명)에 맞췄습니다.
   * 이전 주소로 들어오는 링크·북마크가 죽지 않도록 영구 이동으로 넘깁니다.
   * 로케일 접두사 규칙이 as-needed라 /en/solution도 함께 잡습니다.
   */
  async redirects() {
    return [
      { source: '/solution', destination: '/infolink', permanent: true },
      { source: '/solution/:path*', destination: '/infolink/:path*', permanent: true },
      { source: '/en/solution', destination: '/en/infolink', permanent: true },
      { source: '/en/solution/:path*', destination: '/en/infolink/:path*', permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          /**
           * 이 사이트는 카메라 · 마이크 · 위치를 쓰지 않습니다.
           * 명시적으로 꺼두면 스크립트가 주입되더라도 그 기능은 요청조차 못 합니다.
           */
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
      {
        // 폰트는 해시가 붙은 불변 자산이므로 장기 캐시
        source: '/fonts/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
