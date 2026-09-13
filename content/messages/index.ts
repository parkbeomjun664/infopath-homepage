import type { ActiveLocale } from '@/i18n/routing';
import ko from './ko';
import en from './en';

export type { Messages } from './ko';

/** 활성 로케일별 메시지 번들. 로케일 추가 시 여기에만 등록하면 됩니다. */
export const messages: Record<ActiveLocale, typeof ko> = {
  ko,
  en,
};
