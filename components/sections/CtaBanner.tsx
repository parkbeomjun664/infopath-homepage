import Image from 'next/image';
import { useTranslations } from 'next-intl';

import Button from '@/components/ui/Button';
import Container from '@/components/layout/Container';
import Reveal from '@/components/motion/Reveal';
import { ASSETS, COMPANY } from '@/content/site';

/**
 * S8 — CTA 배너
 *
 * 생산 라인 사진을 풀폭 배경으로 깔고 남색을 0.82로 덮습니다.
 * 사진이 그대로 보이면 글자가 읽히지 않고, 완전히 덮으면 사진을 쓸 이유가 없습니다.
 * 0.82는 라인의 형태만 남기고 텍스트 대비를 확보하는 지점입니다.
 *
 * 선택지를 늘리지 않고 버튼 하나로 수렴시킵니다.
 */

export default function CtaBanner() {
  const t = useTranslations('cta');

  return (
    <section className="relative overflow-hidden">
      <Image
        src={ASSETS.factoryLine}
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* 남색 오버레이 — 흰 텍스트 대비 확보 */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0, 24, 48, 0.82)' }}
      />

      <Container className="relative py-[140px] text-center">
        <Reveal>
          <h2 className="mx-auto max-w-[28ch] text-[clamp(1.875rem,3.6vw,2.625rem)] font-medium leading-[1.4] tracking-[-0.02em] text-white">
            {t('heading')}
          </h2>
          <p className="mx-auto mt-6 max-w-[46ch] text-body-lg leading-relaxed text-white/70">
            {t('body')}
          </p>
        </Reveal>

        {/*
          전화는 두 번째 선택지입니다.
          제조 담당자는 메일보다 통화를 먼저 걸지만, 번호를 지어낼 수는 없습니다.
          COMPANY.tel이 확보되면(pending: false) 자동으로 나타납니다 — 그전까지는
          버튼 하나로 수렴시킵니다. 눌러도 아무 일 없는 버튼이 더 나쁩니다.
        */}
        <Reveal className="mt-11 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
          <Button href="/contact" variant="inverse" size="lg">
            {t('button')}
          </Button>

          {!COMPANY.tel.pending && (
            <a
              href={`tel:${COMPANY.tel.value.replace(/[^0-9+]/g, '')}`}
              className="inline-flex items-center gap-2 text-body font-semibold text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              {t('phoneButton')} {COMPANY.tel.value}
            </a>
          )}
        </Reveal>
      </Container>
    </section>
  );
}
