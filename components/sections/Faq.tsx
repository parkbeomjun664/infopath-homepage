import { useTranslations } from 'next-intl';

import SectionLabel from '@/components/ui/SectionLabel';
import Container from '@/components/layout/Container';
import Reveal from '@/components/motion/Reveal';
import Disclosure from '@/components/ui/Disclosure';
import { Link } from '@/i18n/navigation';

/**
 * 자주 묻는 질문
 *
 * LG CNS가 솔루션마다 FAQ를 붙이는 구조를 참고했습니다.
 * 실적 자료 없이 만들 수 있으면서, "도입 장벽 낮추기"라는 우리 포지셔닝과 맞습니다.
 *
 * JS 없이도 여닫히도록 <details>를 씁니다 — 아코디언을 직접 구현하면
 * 키보드 조작과 스크린리더 대응을 다시 만들어야 하고, 브라우저가 이미 다 해줍니다.
 * 높이가 툭 끊기는 부분만 Disclosure가 부드럽게 잇습니다.
 * 첫 항목만 열어두어 이 영역이 펼쳐진다는 것을 알립니다.
 *
 * 검색엔진이 Q&A로 인식하도록 FAQPage 구조화 데이터를 함께 내보냅니다.
 */

type Item = { id: string; q: string; a: string };

export default function Faq() {
  const t = useTranslations('faq');
  const items = t.raw('items') as Item[];

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <section className="overflow-x-clip border-t border-line bg-white py-16 lg:py-[96px]">
      <script
        type="application/ld+json"
        // 자체 메시지 파일에서만 온 값이라 사용자 입력이 섞이지 않습니다.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      {/*
        제목과 목록을 좌우로 나눕니다.
        한 단으로 쌓으면 목록 폭이 52rem에 묶여 넓은 화면에서 오른쪽 40%가 빈 채로 남고,
        질문을 펼칠 때마다 제목이 화면 밖으로 밀려 무엇에 대한 FAQ인지 사라집니다.
        제목은 왼쪽에 세워 두고 오른쪽만 늘어나게 했습니다.
      */}
      <Container className="grid items-start gap-10 lg:grid-cols-[minmax(0,32%)_minmax(0,1fr)] lg:gap-16">
        <Reveal className="lg:sticky lg:top-[140px]">
          <SectionLabel tone="green">{t('label')}</SectionLabel>
          <h2 className="mt-6 text-[clamp(1.875rem,3.6vw,2.625rem)] font-medium leading-[1.35] tracking-[-0.02em] text-navy-900">
            {t('heading')}
          </h2>
          <p className="mt-5 text-body-lg leading-relaxed text-navy-700/70">{t('lead')}</p>

          <p className="mt-8 text-caption text-navy-700/70">
            {t('ctaText')}{' '}
            <Link
              href="/contact"
              className="font-medium text-azure-600 underline-offset-4 hover:underline"
            >
              {t('ctaLink')} →
            </Link>
          </p>
        </Reveal>

        <div className="min-w-0 border-t border-line lg:mt-2">
          {items.map((item, i) => (
            <Reveal key={item.id}>
              <Disclosure
                defaultOpen={i === 0}
                className="border-b border-line"
                summaryClassName="flex items-start gap-4 py-5"
                summary={
                  <>
                    <span className="flex-1 text-body font-medium leading-snug text-navy-900">
                      {item.q}
                    </span>
                    {/* + 에서 − 로. 회전이 아니라 세로획만 지워 상태 변화가 분명합니다 */}
                    <span
                      aria-hidden="true"
                      className="relative mt-1.5 h-4 w-4 shrink-0 text-navy-700/60 transition-colors group-hover:text-navy-700"
                    >
                      <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current" />
                      <span className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-current transition-transform duration-300 ease-out group-open:scale-y-0" />
                    </span>
                  </>
                }
              >
                <p className="max-w-prose pb-6 pr-8 text-caption leading-relaxed text-navy-700/70">
                  {item.a}
                </p>
              </Disclosure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
