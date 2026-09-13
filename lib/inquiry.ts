import 'server-only';
import { Resend } from 'resend';

import { parseInquiry, type InquiryInput, type InquiryType } from './inquiry-schema';
import { cleanEnv } from './env';

/**
 * 문의 메일 발송 — 서버 전용
 *
 * 검증 스키마는 lib/inquiry-schema.ts에 따로 두었습니다.
 * 폼 컴포넌트(클라이언트)가 스키마만 가져다 쓰고, 이 파일은 건드리지 않게 하기 위함입니다.
 * 한 파일에 두었더니 Resend SDK가 브라우저 번들로 딸려 들어가 빌드가 깨졌습니다.
 *
 * 'server-only' import는 그 실수가 다시 나면 빌드 단계에서 바로 잡아줍니다.
 */

export type InquiryResult =
  | { ok: true; id: string | null }
  | { ok: false; reason: 'validation'; errors: Record<string, string> }
  | { ok: false; reason: 'rateLimit'; retryAfterSec: number }
  | { ok: false; reason: 'config' | 'transport'; detail: string };

/* ── 메일 본문 ─────────────────────────────────────────────── */

/** HTML 메일 본문에 사용자 입력을 넣기 전 이스케이프 — 마크업 주입 방지 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const TYPE_LABEL: Record<InquiryType, string> = {
  consult: '도입 상담',
  quote: '견적 문의',
  demo: '데모 요청',
  partnership: '협력 제안',
  etc: '기타',
};

function buildEmail(input: InquiryInput) {
  const rows: Array<[string, string]> = [
    ['문의 유형', TYPE_LABEL[input.inquiryType]],
    ['회사명', input.company],
    ['성명', input.name],
    ['직책', input.position || '-'],
    ['연락처', input.phone],
    ['이메일', input.email],
    ['언어', input.locale || 'ko'],
    ['접수 시각', new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })],
  ];

  const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Malgun Gothic',sans-serif;color:#10151C;max-width:640px">
  <p style="font-size:11px;letter-spacing:.12em;color:#48A830;margin:0 0 6px;font-weight:600">INFOPATH · 도입 문의</p>
  <h2 style="font-size:20px;margin:0 0 20px;color:#003060">${escapeHtml(input.company)} — ${escapeHtml(input.name)}</h2>
  <table style="border-collapse:collapse;width:100%;font-size:14px">
    ${rows
      .map(
        ([k, v]) => `<tr>
      <th style="text-align:left;padding:9px 14px;background:#F6F8FA;border:1px solid #DDE3EA;width:110px;font-weight:600;color:#4E5C6D">${escapeHtml(k)}</th>
      <td style="padding:9px 14px;border:1px solid #DDE3EA">${escapeHtml(v)}</td>
    </tr>`,
      )
      .join('')}
  </table>
  <p style="font-size:11px;letter-spacing:.12em;color:#6B7A8C;margin:24px 0 8px;font-weight:600">문의 내용</p>
  <div style="white-space:pre-wrap;border-left:3px solid #003060;padding:12px 16px;background:#F6F8FA;font-size:14px;line-height:1.7">${escapeHtml(input.message)}</div>
  <p style="font-size:12px;color:#6B7A8C;margin-top:24px">회신은 ${escapeHtml(input.email)} 로 보내시면 됩니다.</p>
</div>`.trim();

  const text = [
    ...rows.map(([k, v]) => `${k}: ${v}`),
    '',
    '문의 내용',
    '─────────',
    input.message,
  ].join('\n');

  return { html, text };
}

/* ── 발송 ──────────────────────────────────────────────────── */

const DEFAULT_TO = 'gepark@infopath.co.kr';
/**
 * Resend는 발신 도메인 인증(SPF/DKIM)을 요구합니다.
 * 인증 전에는 Resend 테스트 발신 주소만 동작하며 계정 소유자에게만 발송됩니다.
 * docs/deploy.md 4장 참고.
 */
const FALLBACK_FROM = 'INFOPATH 문의 <onboarding@resend.dev>';

export async function sendInquiry(raw: unknown): Promise<InquiryResult> {
  const parsed = parseInquiry(raw);

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === 'string' && !(key in errors)) errors[key] = issue.message;
    }
    // 허니팟이 걸린 경우는 봇입니다. 성공으로 응답하되 발송하지 않습니다.
    // 실패를 알려주면 봇이 우회를 학습합니다.
    if (errors.website) return { ok: true, id: null };
    return { ok: false, reason: 'validation', errors };
  }

  const input = parsed.data;

  // BOM·공백이 섞이면 인증이 조용히 실패합니다. lib/env.ts 주석 참고.
  const apiKey = cleanEnv(process.env.RESEND_API_KEY);
  if (!apiKey) {
    return {
      ok: false,
      reason: 'config',
      detail: 'RESEND_API_KEY가 설정되지 않았습니다. 환경변수를 확인하십시오.',
    };
  }

  const { html, text } = buildEmail(input);

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: cleanEnv(process.env.INQUIRY_FROM, FALLBACK_FROM),
      to: [cleanEnv(process.env.INQUIRY_TO, DEFAULT_TO)],
      subject: `[INFOPATH 문의] ${TYPE_LABEL[input.inquiryType]} · ${input.company} · ${input.name}`,
      // 담당자가 메일에서 바로 회신하면 문의자에게 가도록
      replyTo: input.email,
      html,
      text,
    });

    if (error) return { ok: false, reason: 'transport', detail: error.message };
    return { ok: true, id: data?.id ?? null };
  } catch (e) {
    return {
      ok: false,
      reason: 'transport',
      detail: e instanceof Error ? e.message : '알 수 없는 오류',
    };
  }
}
