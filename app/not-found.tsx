import type { Metadata } from 'next';

import './globals.css';

/**
 * 404 — 루트
 *
 * App Router에서 「어느 라우트에도 맞지 않는 주소」는 언제나 루트 not-found로 옵니다.
 * app/[locale]/not-found.tsx는 그 세그먼트 안에서 notFound()를 던졌을 때만 걸리므로,
 * 없는 주소를 처리하려면 여기가 있어야 합니다.
 *
 * 이 파일은 로케일 컨텍스트 밖에서 렌더링됩니다.
 * next-intl 메시지를 쓸 수 없어 국·영문을 함께 적었습니다 —
 * 어느 쪽에서 들어왔는지 알 수 없는 자리라 오히려 그게 맞습니다.
 *
 * 루트 레이아웃이 따로 없는 구조라 html·body를 직접 그립니다.
 */

export const metadata: Metadata = {
  title: '페이지를 찾을 수 없습니다 | INFOPATH',
  robots: { index: false, follow: false },
};

export default function RootNotFound() {
  return (
    <html lang="ko">
      <body className="bg-bg text-fg antialiased">
        <main className="mx-auto flex min-h-screen max-w-hero flex-col justify-center px-gutter md:px-gutter-md lg:px-gutter-lg">
          <p className="label-mono text-green-600">404</p>

          <h1 className="mt-6 max-w-[20ch] text-[clamp(1.875rem,3.6vw,2.625rem)] font-medium leading-[1.35] tracking-[-0.02em] text-navy-900">
            페이지를 찾을 수 없습니다
          </h1>
          <p className="mt-5 max-w-prose text-body-lg leading-relaxed text-navy-700/70">
            주소가 변경되었거나 삭제된 페이지입니다.
          </p>
          <p className="mt-2 max-w-prose text-caption text-navy-700/60">
            This page may have moved or no longer exists.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-lg bg-navy-700 px-7 py-4 text-body font-semibold text-white transition-colors hover:bg-navy-600"
            >
              홈으로
            </a>
            <a
              href="/infolink"
              className="text-body font-semibold text-navy-700/70 underline-offset-4 transition-colors hover:text-navy-700 hover:underline"
            >
              INFOLINK
            </a>
            <a
              href="/contact"
              className="text-body font-semibold text-navy-700/70 underline-offset-4 transition-colors hover:text-navy-700 hover:underline"
            >
              문의
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
