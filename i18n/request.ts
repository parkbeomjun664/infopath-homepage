import type { AbstractIntlMessages } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { messages } from '@/content/messages';
import { DEFAULT_LOCALE, isActiveLocale } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = requested && isActiveLocale(requested) ? requested : DEFAULT_LOCALE;

  return {
    locale,
    /**
     * next-intl v3의 AbstractIntlMessages 타입은 배열을 허용하지 않습니다.
     * 런타임은 배열을 정상 처리하며(t.raw()로 읽습니다), 타입 정의만 좁은 상태입니다.
     * 메시지 구조 자체는 content/messages/ko.ts ↔ en.ts 간 Messages 타입으로
     * 이미 강제되므로, 여기서의 단언은 키 누락을 숨기지 않습니다.
     */
    messages: messages[locale] as unknown as AbstractIntlMessages,
    timeZone: 'Asia/Seoul',
  };
});
