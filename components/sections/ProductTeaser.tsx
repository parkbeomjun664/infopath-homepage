import Image from 'next/image';
import { useTranslations } from 'next-intl';

import SectionLabel from '@/components/ui/SectionLabel';
import Container from '@/components/layout/Container';
import Reveal from '@/components/motion/Reveal';
import Button from '@/components/ui/Button';
import { ASSETS } from '@/content/site';

/**
 * 메인 — INFOLINK로 들어가는 문
 *
 * 여기는 제품 설명 자리가 아닙니다. 인포패스 홈페이지에서 INFOLINK가 차지할 몫은
 * 「회사가 이런 걸 가지고 있고, 자세한 건 저쪽에 있습니다」 한 블록입니다.
 *
 * 전에는 메인 9개 블록 중 5개가 INFOLINK 설명이었습니다.
 * 8단계 흐름 · 데이터 경로 · 아키텍처 · 기술 사양은 전부 /infolink로 옮겼습니다.
 * 회사 홈페이지에 제품 카탈로그가 들어 있으면 무엇을 파는 회사인지 흐려집니다.
 *
 * kicker는 푸터에 이미 쓰고 있는 표기 그대로입니다 —
 * 회사와 제품의 관계를 사이트 전체에서 같은 한 문장으로 말해야 각인됩니다.
 */

export default function ProductTeaser() {
  const t = useTranslations('product.teaser');

  return (
    <section className="overflow-x-clip border-t border-line bg-bg py-16 lg:py-[96px]">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,46%)] lg:gap-16">
          <Reveal className="min-w-0">
            <SectionLabel tone="green">{t('label')}</SectionLabel>
            <h2 className="mt-6 text-[clamp(1.875rem,3.6vw,2.625rem)] font-medium leading-[1.35] tracking-[-0.02em] text-navy-900">
              {t('heading')}
            </h2>
            {/* 회사가 주어인 한 줄 — 이게 없으면 INFOLINK가 어디서 왔는지 알 수 없습니다 */}
            <p className="mt-5 text-body-lg font-medium text-navy-900">{t('kicker')}</p>
            <p className="mt-4 max-w-[42rem] text-body leading-relaxed text-navy-700/70">
              {t('lead')}
            </p>
            <div className="mt-8">
              <Button href="/infolink" variant="primary" size="lg">
                {t('cta')}
              </Button>
            </div>
          </Reveal>

          {/* 사진 한 장 — 「제품이 실제로 있다」를 문장보다 빠르게 말합니다 */}
          <Reveal className="min-w-0">
            {/*
              object-cover입니다. 원본이 2947×2121(약 1.39:1)이라 16/10 박스에
              contain으로 넣으면 좌우에 네이비 여백이 남아 액자가 어긋나 보였습니다.
              스톡 사진이라 잘려도 잃는 정보가 없습니다.
              ⚠ 실제 제품 화면 캡처로 교체할 때는 contain으로 되돌려야 합니다 — UI는 잘리면 안 됩니다.
            */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-navy-900">
              <Image
                src={ASSETS.dashboard}
                alt={t('imageAlt')}
                fill
                sizes="(max-width: 1023px) calc(100vw - 40px), 46vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
