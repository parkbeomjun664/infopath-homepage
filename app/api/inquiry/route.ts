import { NextResponse } from 'next/server';
import { sendInquiry } from '@/lib/inquiry';
import { checkRateLimit, clientKey } from '@/lib/rate-limit';

/**
 * 문의 접수 엔드포인트
 *
 * 이 파일은 HTTP 경계만 담당합니다 — 검증과 발송은 lib/inquiry.ts,
 * 폭주 차단은 lib/rate-limit.ts에 있습니다.
 * 정적 export를 쓰지 않는 이유가 바로 이 라우트입니다.
 */

// 요청마다 실행되어야 하므로 정적 최적화를 끕니다.
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  // 검증보다 먼저 막습니다. 폭주 요청에 파싱 비용을 쓰지 않기 위함입니다.
  const limit = checkRateLimit(clientKey(request));
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, reason: 'rateLimit', retryAfterSec: limit.retryAfterSec },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, reason: 'validation', errors: {} }, { status: 400 });
  }

  const result = await sendInquiry(body);

  if (result.ok) return NextResponse.json(result, { status: 200 });

  // 사용자가 고칠 수 있는 문제
  if (result.reason === 'validation') {
    return NextResponse.json(result, { status: 400 });
  }

  // rateLimit은 위에서 이미 처리했지만, 타입상 남아 있어 함께 좁혀둡니다.
  if (result.reason === 'rateLimit') {
    return NextResponse.json(result, { status: 429 });
  }

  // config·transport는 서버 문제입니다.
  // 상세 사유는 로그에만 남기고 응답에는 노출하지 않습니다.
  console.error(`[inquiry] ${result.reason}: ${result.detail}`);
  return NextResponse.json({ ok: false, reason: result.reason }, { status: 500 });
}
