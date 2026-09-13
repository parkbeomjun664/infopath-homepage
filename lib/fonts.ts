import localFont from 'next/font/local';

/**
 * Pretendard 가변폰트 — 로컬 self-host
 *
 * CDN이 아니라 로컬로 두는 이유:
 *  - 사내 서버(Node) 운영 환경에서 외부 CDN 의존을 없애기 위함
 *  - 폰트 로딩이 외부 네트워크 상태에 좌우되지 않음
 *
 * weight '45 920'은 Pretendard Variable의 실제 가변 축 범위입니다.
 * (일반적인 100~900이 아니므로 이 값을 임의로 바꾸면 렌더링이 어긋납니다.)
 */
export const pretendard = localFont({
  src: '../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  style: 'normal',
  variable: '--font-pretendard',
  preload: true,
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont',
    'system-ui',
    'Roboto',
    'Malgun Gothic',
    'sans-serif',
  ],
});
