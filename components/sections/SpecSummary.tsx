import { useTranslations } from 'next-intl';

import SectionLabel from '@/components/ui/SectionLabel';
import Container from '@/components/layout/Container';
import Reveal from '@/components/motion/Reveal';
import Button from '@/components/ui/Button';

/**
 * 기술 구성 — 메인용 축약
 *
 * 전산 담당자가 도입 검토에서 반드시 확인하는 항목이라 없애지 않습니다.
 * 다만 7행 표를 메인에 통째로 두면 회사 소개가 아니라 제품 사양서가 됩니다.
 * 첫 화면에서 판단에 필요한 네 줄만 남기고 나머지는 /solution#tech가 받습니다.
 */

export default function SpecSummary() {
  const t = useTranslations('spec');
  const summary = t.raw('summary') as string[];

  return (
    <section className="overflow-x-clip border-t border-line bg-bg py-16 lg:py-20">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:items-center lg:gap-16">
          <Reveal className="min-w-0">
            <SectionLabel tone="green">{t('label')}</SectionLabel>
            <h2 className="mt-5 text-h3 font-medium tracking-[-0.02em] text-navy-900">
              {t('heading')}
            </h2>
          </Reveal>

          <Reveal className="min-w-0">
            <ul className="grid gap-x-10 gap-y-3 sm:grid-cols-2">
              {summary.map((line) => (
                <li key={line} className="flex gap-2.5 text-body leading-relaxed text-navy-900">
                  <span
                    aria-hidden="true"
                    className="mt-[11px] h-1 w-1 shrink-0 rounded-full bg-green-500"
                  />
                  <span className="min-w-0">{line}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <Button href="/infolink#tech" variant="link">
                {t('more')}
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
