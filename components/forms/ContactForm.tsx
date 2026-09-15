'use client';

import { useId, useState, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

import Button from '@/components/ui/Button';
import { Link } from '@/i18n/navigation';
import { COMPANY } from '@/content/site';
import { INQUIRY_TYPES, parseInquiry, toFieldErrors, type InquiryFieldError } from '@/lib/inquiry-schema';

/**
 * 도입 문의 폼
 *
 * 검증 스키마(lib/inquiry-schema.ts)를 서버와 공유합니다. 규칙이 갈라지지 않게 하려는 것으로,
 * 클라이언트 검증은 빠른 피드백용이고 실제 신뢰 경계는 서버입니다.
 *
 * ⚠️ 메일 발송이 있는 lib/inquiry.ts는 여기서 import하지 마십시오.
 *   Resend SDK가 브라우저 번들로 딸려 들어가 빌드가 깨집니다.
 *
 * 스팸 차단
 *   - 허니팟 `website` 필드 (사람 눈에 보이지 않음)
 *   - 서버 rate limit (lib/rate-limit.ts)
 */

type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success' }
  | { kind: 'error'; reason: 'transport' | 'config' | 'rateLimit' };

const FIELD =
  'w-full rounded-lg border bg-white px-4 py-3 text-body text-navy-900 transition-colors ' +
  'placeholder:text-navy-700/45 focus:outline-none focus:ring-2 focus:ring-navy-700/25';

export default function ContactForm() {
  const t = useTranslations('contact.form');
  const locale = useLocale();
  const formId = useId();

  const [errors, setErrors] = useState<InquiryFieldError>({});
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  /** 지금 커서가 놓인 칸. 그 칸의 힌트만 보입니다. */
  const [focused, setFocused] = useState<string | null>(null);

  /* 칸마다 붙는 한 줄 힌트. 빈 값이면 그리지 않습니다. */
  const hints = t.raw('hints') as Record<string, string>;

  const errText = (code?: string) => (code ? t(`validation.${code}`) : '');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === 'submitting') return;

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get('name') ?? ''),
      company: String(fd.get('company') ?? ''),
      position: String(fd.get('position') ?? ''),
      phone: String(fd.get('phone') ?? ''),
      email: String(fd.get('email') ?? ''),
      inquiryType: String(fd.get('inquiryType') ?? ''),
      message: String(fd.get('message') ?? ''),
      consent: fd.get('consent') === 'on',
      website: String(fd.get('website') ?? ''),
      locale: locale === 'en' ? 'en' : 'ko',
    };

    const parsed = parseInquiry(payload);
    if (!parsed.success) {
      const fieldErrors = toFieldErrors(parsed.error);
      setErrors(fieldErrors);
      setStatus({ kind: 'idle' });
      // 첫 오류 필드로 포커스를 옮겨 어디를 고쳐야 하는지 바로 보이게 합니다.
      const first = Object.keys(fieldErrors)[0];
      if (first) document.getElementById(`${formId}-${first}`)?.focus();
      return;
    }

    setErrors({});
    setStatus({ kind: 'submitting' });

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();

      if (res.ok && json.ok) {
        setStatus({ kind: 'success' });
        return;
      }
      if (res.status === 400 && json.errors) {
        setErrors(json.errors as InquiryFieldError);
        setStatus({ kind: 'idle' });
        return;
      }
      setStatus({
        kind: 'error',
        reason: json.reason === 'rateLimit' ? 'rateLimit' : 'transport',
      });
    } catch {
      setStatus({ kind: 'error', reason: 'transport' });
    }
  }

  /* ── 완료 ── */
  if (status.kind === 'success') {
    return (
      <div
        role="status"
        className="rounded-lg border border-green-500/40 bg-green-50 p-8 lg:p-10"
      >
        <CheckCircle2 className="h-8 w-8 text-green-600" aria-hidden="true" />
        <h2 className="mt-4 text-h4 font-medium text-navy-900">{t('successTitle')}</h2>
        <p className="mt-2 text-body text-navy-700/70">{t('successBody')}</p>
        {/* 언제 회신이 오는지까지 말해야 완료 화면이 됩니다. 접수 확인만으로는 기다리는 쪽이 불안합니다 */}
        <p className="mt-1 text-caption text-navy-700/60">{t('successNote')}</p>
        <button
          type="button"
          onClick={() => setStatus({ kind: 'idle' })}
          className="mt-6 text-caption font-semibold text-azure-600 underline-offset-4 hover:underline"
        >
          {t('successAgain')}
        </button>
      </div>
    );
  }

  const submitting = status.kind === 'submitting';

  const field = (
    name: keyof InquiryFieldError,
    label: string,
    required: boolean,
    input: React.ReactNode,
  ) => (
    <div>
      <label
        htmlFor={`${formId}-${name}`}
        className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-caption font-medium text-navy-900"
      >
        {label}
        <span
          className={
            required ? 'text-[12px] font-semibold text-green-600' : 'text-[12px] text-navy-700/55'
          }
        >
          {required ? t('required') : t('optional')}
        </span>

        {/*
          힌트는 라벨 줄 오른쪽 끝에 둡니다. 칸 아래에 넣으면 커서를 옮길 때마다
          아래 내용이 밀려 폼 전체가 들썩입니다.
          숨길 때 display를 끄지 않고 opacity만 내리는 이유 — 화면 낭독기는
          display:none을 읽지 않습니다. 눈에는 안 보여도 낭독은 되어야 합니다.
        */}
        {hints[name] && (
          <span
            id={`${formId}-${name}-hint`}
            className={`ml-auto text-[12px] font-normal text-navy-700/60 transition-opacity duration-200 ${
              focused === name ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {hints[name]}
          </span>
        )}
      </label>
      {input}
      {errors[name] && (
        <p id={`${formId}-${name}-error`} className="mt-1.5 text-caption text-state-error">
          {errText(errors[name])}
        </p>
      )}
    </div>
  );

  const inputProps = (name: keyof InquiryFieldError) => {
    const describedBy = [
      errors[name] ? `${formId}-${name}-error` : null,
      hints[name] ? `${formId}-${name}-hint` : null,
    ].filter(Boolean);

    return {
      id: `${formId}-${name}`,
      name,
      onFocus: () => setFocused(name),
      onBlur: () => setFocused((cur) => (cur === name ? null : cur)),
      'aria-invalid': errors[name] ? (true as const) : undefined,
      'aria-describedby': describedBy.length ? describedBy.join(' ') : undefined,
      className: `${FIELD} ${errors[name] ? 'border-state-error' : 'border-line'}`,
    };
  };

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-[46rem]">
      {/* 허니팟 — 사람에게는 보이지 않고 스크린리더도 건너뜁니다 */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${formId}-website`}>Website</label>
        <input id={`${formId}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {field('name', t('name'), true, <input type="text" autoComplete="name" {...inputProps('name')} />)}
        {field(
          'company',
          t('company'),
          true,
          <input type="text" autoComplete="organization" {...inputProps('company')} />,
        )}
        {field(
          'position',
          t('position'),
          false,
          <input type="text" autoComplete="organization-title" {...inputProps('position')} />,
        )}
        {field(
          'phone',
          t('phone'),
          true,
          <input
            type="tel"
            autoComplete="tel"
            placeholder={t('phonePlaceholder')}
            {...inputProps('phone')}
          />,
        )}
        {field(
          'email',
          t('email'),
          true,
          <input type="email" autoComplete="email" {...inputProps('email')} />,
        )}
        {field(
          'inquiryType',
          t('inquiryType'),
          true,
          <select defaultValue="" {...inputProps('inquiryType')}>
            <option value="" disabled>
              {t('selectPlaceholder')}
            </option>
            {INQUIRY_TYPES.map((type) => (
              <option key={type} value={type}>
                {t(`types.${type}`)}
              </option>
            ))}
          </select>,
        )}
      </div>

      <div className="mt-6">
        {field(
          'message',
          t('message'),
          true,
          <textarea rows={7} placeholder={t('messagePlaceholder')} {...inputProps('message')} />,
        )}
      </div>

      {/* 개인정보 수집·이용 동의 — 법적 필수 */}
      <div className="mt-8 rounded-lg border border-line bg-white p-5">
        <label htmlFor={`${formId}-consent`} className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            id={`${formId}-consent`}
            name="consent"
            aria-invalid={errors.consent ? true : undefined}
            className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded border-line accent-navy-700"
          />
          <span className="text-caption font-medium text-navy-900">
            {t('consent')}
            <span className="ml-2 text-[12px] font-semibold text-green-600">{t('required')}</span>
          </span>
        </label>
        <p className="mt-3 pl-[30px] text-caption leading-relaxed text-navy-700/70">
          {t('consentDetail')}
        </p>
        <Link
          href="/privacy"
          className="mt-2 inline-block pl-[30px] text-caption font-medium text-azure-600 underline-offset-4 hover:underline"
        >
          {t('consentLink')} →
        </Link>
        {errors.consent && (
          <p className="mt-2 pl-[30px] text-caption text-state-error">{errText(errors.consent)}</p>
        )}
      </div>

      {status.kind === 'error' && (
        <div
          role="alert"
          className="mt-6 flex gap-3 rounded-lg border border-state-error/40 bg-red-50 p-5"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-state-error" aria-hidden="true" />
          <div>
            <p className="text-caption font-semibold text-navy-900">
              {status.reason === 'rateLimit' ? t('rateLimitTitle') : t('errorTitle')}
            </p>
            <p className="mt-1 text-caption leading-relaxed text-navy-700/70">
              {status.reason === 'rateLimit' ? t('rateLimitBody') : t('errorBody')}
            </p>
            {status.reason !== 'rateLimit' && (
              <a
                href={`mailto:${COMPANY.email}`}
                className="mt-2 inline-block text-caption font-medium text-azure-600 underline-offset-4 hover:underline"
              >
                {COMPANY.email}
              </a>
            )}
          </div>
        </div>
      )}

      <div className="mt-8">
        <Button type="submit" variant="primary" size="lg" disabled={submitting}>
          {submitting ? t('submitting') : t('submit')}
        </Button>
      </div>
    </form>
  );
}
