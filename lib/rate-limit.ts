/**
 * 아주 단순한 슬라이딩 윈도우 rate limit.
 *
 * ⚠️ 한계를 알고 쓰십시오.
 *   프로세스 메모리에만 기록하므로 서버리스에서 인스턴스가 여러 개면
 *   각 인스턴스가 따로 셉니다. 콜드 스타트 때도 초기화됩니다.
 *   즉 "정확한 차단"이 아니라 "같은 인스턴스로 들어온 연속 폭주를 막는" 수준입니다.
 *
 *   문의량이 늘어 정확한 제한이 필요해지면 Upstash Redis 같은 외부 저장소로
 *   옮겨야 합니다. 지금 단계에서는 의존성을 늘리지 않는 편이 낫다고 판단했습니다.
 */

type Hit = { count: number; resetAt: number };

const WINDOW_MS = 10 * 60 * 1000; // 10분
const MAX_HITS = 5; // 같은 IP에서 10분에 5건
/** 메모리가 무한히 늘지 않도록 상한을 둡니다 */
const MAX_KEYS = 5000;

const hits = new Map<string, Hit>();

function sweep(now: number) {
  for (const [key, hit] of hits) {
    if (hit.resetAt <= now) hits.delete(key);
  }
  // 그래도 넘치면 가장 오래된 것부터 버립니다.
  if (hits.size > MAX_KEYS) {
    const excess = hits.size - MAX_KEYS;
    let i = 0;
    for (const key of hits.keys()) {
      hits.delete(key);
      if (++i >= excess) break;
    }
  }
}

export type RateLimitResult = { ok: true } | { ok: false; retryAfterSec: number };

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const hit = hits.get(key);

  if (!hit || hit.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }

  if (hit.count >= MAX_HITS) {
    return { ok: false, retryAfterSec: Math.ceil((hit.resetAt - now) / 1000) };
  }

  hit.count += 1;
  return { ok: true };
}

/**
 * 요청자 IP를 추정합니다.
 * Vercel은 x-forwarded-for를 붙여줍니다. 첫 번째 값이 원 클라이언트입니다.
 */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}
