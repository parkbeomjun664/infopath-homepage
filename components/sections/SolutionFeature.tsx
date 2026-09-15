import Image from 'next/image';
import { useTranslations } from 'next-intl';

import Button from '@/components/ui/Button';
import SectionLabel from '@/components/ui/SectionLabel';
import Container from '@/components/layout/Container';
import Reveal from '@/components/motion/Reveal';
import FlowDiagram from './FlowDiagram';
import { ASSETS } from '@/content/site';

/**
 * 기록에서 관리까지 — 한 섹션 2열
 *
 * 전에는 좌우 교차 블록 두 개가 각각 섹션 높이를 통째로 차지했습니다.
 * 본문이 세 줄뿐인데 화면 두 개를 쓰니 스크롤만 길어지고, 두 내용이
 * 사실은 한 흐름(현장 기록 → 관리 화면)인데 따로 읽혔습니다.
 *
 * 도입부 다이어그램이 전체 경로를 먼저 보여주고,
 * 아래 두 칸이 그 경로의 앞뒤를 나란히 맡습니다. 나란히 두면 관계가 보입니다.
 */

type BlockProps = {
  id: 'collect' | 'monitor';
  href: string;
  src: string;
  /** 어두운 화면 사진은 잘리면 지표가 사라지므로 contain으로 담습니다 */
  dark?: boolean;
};

function Block({ id, href, src, dark = false }: BlockProps) {
  const t = useTranslations(`solutionFeature.${id}`);

  return (
    <Reveal className="min-w-0">
      <div className="flex h-full flex-col">
        <div
          className={[
            'relative w-full max-w-full overflow-hidden rounded-lg',
            'aspect-[16/10]',
            dark ? 'bg-navy-900' : 'bg-white',
          ].join(' ')}
        >
          <Image
            src={src}
            alt={t('imageAlt')}
            fill
            sizes="(max-width: 1023px) calc(100vw - 40px), 46vw"
            className={dark ? 'object-contain p-3' : 'object-cover'}
          />
        </div>

        <SectionLabel tone="green" className="mt-7">
          {t('label')}
        </SectionLabel>
        <h3 className="mt-4 text-h3 font-medium leading-snug tracking-[-0.02em] text-navy-900">
          {t('title')}
        </h3>
        <p className="mt-4 text-caption leading-relaxed text-navy-700/70">{t('body')}</p>

        <div className="mt-5">
          <Button href={href} variant="link">
            {t('link')}
          </Button>
        </div>
      </div>
    </Reveal>
  );
}

export default function SolutionFeature() {
  const t = useTranslations('solutionFeature');

  return (
    // overflow-x-clip — 안쪽 요소가 새어나가도 페이지 가로 스크롤로 번지지 않게 하는 마지막 방어선
    <section id="how" className="scroll-mt-[136px] overflow-x-clip border-t border-line bg-white py-20 lg:scroll-mt-[144px] lg:py-[120px]">
      <Container>
        <Reveal>
          <SectionLabel tone="green">{t('label')}</SectionLabel>
          <h2 className="mt-6 max-w-[24ch] text-[clamp(1.875rem,3.6vw,2.625rem)] font-medium leading-[1.35] tracking-[-0.02em] text-navy-900">
            {t('heading')}
          </h2>
          <p className="mt-5 max-w-[46rem] text-body-lg leading-relaxed text-navy-700/70">
            {t('lead')}
          </p>
        </Reveal>

        {/* 전체 경로를 먼저 — 아래 두 칸이 이 경로의 앞뒤라는 것이 보여야 합니다 */}
        <Reveal className="mt-14 min-w-0 lg:mt-16">
          <FlowDiagram />
        </Reveal>

        <div className="mt-14 grid gap-12 lg:mt-16 lg:grid-cols-2 lg:gap-16">
          {/* 앵커로 보냅니다. 둘 다 /solution 최상단으로 가면 기대한 내용을 다시 찾아야 합니다 */}
          <Block id="collect" href="/infolink#process" src={ASSETS.factoryLine} />
          <Block id="monitor" href="/infolink#features" src={ASSETS.dashboard} dark />
        </div>
      </Container>
    </section>
  );
}
