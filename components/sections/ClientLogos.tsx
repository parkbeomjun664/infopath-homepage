import Image from 'next/image';
import { useTranslations } from 'next-intl';

import Container from '@/components/layout/Container';
import Reveal from '@/components/motion/Reveal';
import SectionLabel from '@/components/ui/SectionLabel';
import { Link } from '@/i18n/navigation';
import { CLIENT_LOGOS, SECTIONS, STRIP_IMAGES } from '@/content/site';

/**
 * 가로로 흐르는 띠 — 고객사 로고 또는 사진
 *
 *   로고 모드  CLIENT_LOGOS가 차고 SECTIONS.clients가 켜지면 전환됩니다
 *   사진 모드  그전까지 STRIP_IMAGES를 흘립니다
 *
 * 움직이는 방식
 *   같은 목록을 짝수 벌 이어 붙이고 정확히 절반만큼 밉니다.
 *   한 바퀴가 끝나는 순간의 화면이 시작할 때와 같아 이음매가 보이지 않습니다.
 *   JS가 없어 탭을 벗어나면 브라우저가 알아서 멈춥니다.
 *   (CSS는 app/globals.css의 .marquee)
 */

/** 항목이 늘면 띠도 길어집니다. 체감 속도를 맞추려면 시간도 함께 늘려야 합니다. */
const SECONDS_PER_ITEM = 6;

/**
 * 목록을 몇 벌 이어 붙일지.
 *
 * 항목이 적으면 한 벌이 화면보다 짧아 띠 중간에 빈 구간이 생기고,
 * 로고 하나가 양 끝 페이드에 걸린 채 오래 머물러 잘려 보입니다.
 * 벌 수를 늘리면 띠가 촘촘해져 그 구간이 사라집니다.
 * 밀어내는 양이 -50%라서 벌 수는 반드시 짝수여야 이음매가 맞습니다.
 */
function copiesFor(count: number) {
  if (count <= 4) return 6;
  if (count <= 8) return 4;
  return 2;
}

export default function ClientLogos() {
  const t = useTranslations('clients');

  const logoMode = SECTIONS.clients && CLIENT_LOGOS.length > 0;
  const count = logoMode ? CLIENT_LOGOS.length : STRIP_IMAGES.length;

  if (count === 0) return null;

  const copies = copiesFor(count);
  const duration = `${Math.max(28, count * SECONDS_PER_ITEM * (copies / 2))}s`;

  return (
    <section className="overflow-x-clip border-t border-line bg-white py-16 lg:py-20">
      <Container>
        {/*
          제목 줄 — 왼쪽에 제목, 오른쪽에 다음 행동.
          대기업 사이트의 로고 띠가 공통으로 쓰는 배치입니다. 로고만 흘려보내면
          「그래서 뭘 봐야 하나」로 끝나는데, 링크가 하나 있으면 실적으로 이어집니다.
        */}
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
            <div className="min-w-0">
              <SectionLabel tone="green">{t('label')}</SectionLabel>
              <h2 className="mt-4 text-h3 font-medium tracking-[-0.015em] text-navy-900">
                {logoMode ? t('logoHeading') : t('heading')}
              </h2>
              <p className="mt-3 max-w-[42rem] text-body leading-relaxed text-navy-700/70">
                {logoMode ? t('logoLead') : t('lead')}
              </p>
            </div>

            <Link
              href="/about"
              className="group inline-flex shrink-0 items-center gap-2 border-b border-navy-700/25 pb-1.5 text-caption font-medium text-navy-900 transition-colors hover:border-azure-600 hover:text-azure-600"
            >
              {t('more')}
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </Container>

      {/* 컨테이너 밖에 둡니다 — 안에 가두면 띠가 중간에서 잘려 멈춘 것처럼 보입니다 */}
      <div className="marquee-viewport mt-11 overflow-hidden">
        <ul className="marquee" style={{ ['--marquee-duration' as string]: duration }}>
          {/* 첫 벌만 읽어줍니다. 나머지는 이음매를 메우기 위한 복제본입니다 */}
          {Array.from({ length: copies }, (_, copy) => (
            <li key={copy} aria-hidden={copy > 0} className="flex shrink-0">
              {logoMode
                ? CLIENT_LOGOS.map((logo) => (
                    <span
                      key={logo.id}
                      className="mx-7 flex h-10 shrink-0 items-center lg:mx-9 lg:h-11"
                    >
                      <Image
                        src={logo.src}
                        alt={copy === 0 ? logo.name : ''}
                        width={logo.width}
                        height={logo.height}
                        sizes="240px"
                        /* 원래 색 그대로 둡니다. 로고는 색이 곧 식별 정보라
                           회색으로 눕히면 어느 회사인지 한 박자 늦게 읽힙니다.
                           높이만 맞추고 가로는 비율대로 둡니다 — 억지로 같은 폭에
                           넣으면 가로로 긴 로고가 찌그러집니다. */
                        className="h-full w-auto max-w-none"
                      />
                    </span>
                  ))
                : STRIP_IMAGES.map((img) => (
                    <span key={img.id} className="mx-3 shrink-0 overflow-hidden rounded-lg lg:mx-4">
                      <Image
                        src={img.src}
                        alt={copy === 0 ? img.alt : ''}
                        width={480}
                        height={300}
                        sizes="(max-width: 640px) 240px, 320px"
                        className="h-[150px] w-[240px] object-cover lg:h-[188px] lg:w-[300px]"
                      />
                    </span>
                  ))}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
