/**
 * 환경변수 값 정리
 *
 * BOM(U+FEFF)과 앞뒤 공백을 걷어냅니다.
 *
 * 왜 필요한가 — 실제로 겪은 문제입니다.
 *   Vercel에 값을 넣을 때 UTF-8 BOM(EF BB BF)이 앞에 섞여 들어갔고,
 *   `new URL(SITE_URL)`이 던지면서 layout의 generateMetadata가 실패해
 *   전 페이지 프리렌더가 깨졌습니다. 오류 메시지는 프로덕션 빌드에서 가려져
 *   원인을 찾는 데 시간이 걸렸습니다.
 *
 *   값을 넣는 경로가 여러 개(대시보드·CLI·파일 붙여넣기)라 한 곳에서 막는 편이
 *   확실합니다. API 키에 BOM이 붙으면 인증이 조용히 실패하므로 특히 중요합니다.
 */
export function cleanEnv(value: string | undefined, fallback = ''): string {
  return (value ?? '').replace(/^﻿/, '').trim() || fallback;
}
