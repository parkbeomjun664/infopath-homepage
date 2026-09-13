import { useTranslations } from 'next-intl';

import Container from '@/components/layout/Container';
import Reveal from '@/components/motion/Reveal';
import CountUp from '@/components/ui/CountUp';

/**
 * 숫자 띠 — 히어로 직후
 *
 * 히어로가 "백지에서 시작하지 않는다"고 주장하는데, 그 증거가 한참 아래에 있었습니다.
 * 스크롤하기 전에 증명이 끝나도록 첫 화면 바로 아래로 올렸습니다.
 *
 * ── 무엇의 숫자인지 먼저 ────────────────────────────────────
 * 전에는 「자체 MES 플랫폼 INFOLINK 기준」이 오른쪽 끝에 붙어 있었습니다.
 * 숫자가 올라가는 동안 눈은 거기 묶이는데, 그 숫자가 무엇인지 알려면
 * 시선을 오른쪽 끝까지 옮겨야 했습니다. 순서가 거꾸로였습니다.
 *
 * 이제 한 줄이 먼저 나오고 그다음에 숫자가 올라갑니다.
 * 단위 라벨도 키우고 진하게 바꿨습니다 —
 * 숫자만 크고 라벨이 흐리면 숫자가 라벨을 이깁니다.
 *
 * 값은 코드·DB로 확인된 세 개만 씁니다.
 */

type Item = { id: string; value: string; name: string };

export default function StatsBand() {
  const t = useTranslations('statsBand');
  const items = t.raw('items') as Item[];

  return (
    <section className="border-y border-line bg-white">
      <Container>
        <div className="py-10 lg:py-14">
          {/* 무엇의 숫자인지 — 숫자보다 먼저 읽혀야 합니다 */}
          <Reveal>
            <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
              <span className="text-body font-medium text-navy-900">{t('caption')}</span>
              <span className="text-caption text-navy-700/60">{t('captionSub')}</span>
            </p>
          </Reveal>

          <Reveal>
            <ul className="mt-7 grid grid-cols-3 gap-x-6 border-t border-line pt-7 lg:gap-x-12">
              {items.map((item) => (
                <li key={item.id} className="min-w-0">
                  <CountUp
                    value={item.value}
                    className="block text-[clamp(1.75rem,3.2vw,2.5rem)] font-medium leading-none tracking-[-0.03em] text-navy-900"
                  />
                  <span className="mt-3 block text-body font-medium leading-snug text-navy-700/75">
                    {item.name}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
