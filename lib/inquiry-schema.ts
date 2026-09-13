import { z } from 'zod';

/**
 * 문의 검증 스키마 — 클라이언트·서버 공용
 *
 * ⚠️ 이 파일에는 서버 전용 의존성을 절대 넣지 마십시오.
 *   폼 컴포넌트(클라이언트)가 import하므로, 여기에 resend 같은 SDK를 두면
 *   서버 전용 패키지가 브라우저 번들로 딸려 들어갑니다.
 *   실제로 그렇게 되어 있어 빌드가 깨졌습니다 — 메일 발송은 lib/inquiry.ts에 있습니다.
 */

export const INQUIRY_TYPES = [
  'consult', // 도입 상담
  'quote', // 견적 문의
  'demo', // 데모 요청
  'partnership', // 협력 제안
  'etc', // 기타
] as const;

export type InquiryType = (typeof INQUIRY_TYPES)[number];

// 실무상 충분한 수준의 형식 검사. 최종 유효성은 회신 시점에 확인됩니다.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// 국내 번호 기준. 하이픈·공백·국가번호를 허용합니다.
const PHONE_RE = /^[0-9+\-\s()]{7,20}$/;

export const inquirySchema = z.object({
  name: z.string().trim().min(1, 'required').max(50, 'tooLong'),
  company: z.string().trim().min(1, 'required').max(100, 'tooLong'),
  position: z.string().trim().max(50, 'tooLong').optional().or(z.literal('')),
  phone: z.string().trim().min(1, 'required').max(20, 'tooLong').regex(PHONE_RE, 'phone'),
  email: z.string().trim().min(1, 'required').max(254, 'tooLong').regex(EMAIL_RE, 'email'),
  inquiryType: z.enum(INQUIRY_TYPES, { message: 'required' }),
  // min을 두 번 겁니다 — 비어 있으면 '필수', 짧으면 '10자 이상'으로 구분해 안내합니다.
  message: z.string().trim().min(1, 'required').min(10, 'tooShort').max(5000, 'tooLong'),
  // 개인정보 수집·이용 동의는 법적 필수입니다 (개인정보보호법 제15조).
  consent: z.literal(true, { message: 'consent' }),
  /** 봇 차단용 허니팟. 사람이 채우면 안 되는 숨김 필드입니다. */
  website: z.string().max(0).optional().or(z.literal('')),
  locale: z.enum(['ko', 'en']).optional(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
/** 필드명 → 오류 코드. 화면 문구는 messages에서 코드로 찾습니다. */
export type InquiryFieldError = Partial<Record<keyof InquiryInput, string>>;

/** zod 오류를 필드별 코드 하나씩으로 정리합니다. */
export function toFieldErrors(error: z.ZodError): InquiryFieldError {
  const out: InquiryFieldError = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === 'string' && !(key in out)) {
      out[key as keyof InquiryInput] = issue.message;
    }
  }
  return out;
}

/**
 * 파싱 전 문자열 필드를 정규화합니다.
 *
 * 값이 아예 없으면 zod의 타입 검사가 먼저 걸려서
 * "Invalid input: expected string, received undefined" 같은 기본 영문 문구가 나옵니다.
 * 빈 문자열로 맞춰두면 min(1, 'required')이 걸려 우리 오류 코드가 나옵니다.
 */
function normalize(raw: unknown): unknown {
  if (raw === null || typeof raw !== 'object') return raw;
  const o = raw as Record<string, unknown>;
  const s = (v: unknown) => (typeof v === 'string' ? v : v == null ? '' : String(v));

  return {
    ...o,
    name: s(o.name),
    company: s(o.company),
    position: s(o.position),
    phone: s(o.phone),
    email: s(o.email),
    message: s(o.message),
    website: s(o.website),
  };
}

/** 클라이언트와 서버가 같은 경로로 검증하도록 이 함수를 씁니다. */
export function parseInquiry(raw: unknown) {
  return inquirySchema.safeParse(normalize(raw));
}
