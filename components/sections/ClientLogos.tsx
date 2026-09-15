import Image from 'next/image';
import { useTranslations } from 'next-intl';

import Container from '@/components/layout/Container';
import Reveal from '@/components/motion/Reveal';
import { CLIENT_LOGOS, SECTIONS, STRIP_IMAGES } from '@/content/site';

/**
 * 가로로 흐르는 띠
 *
 * 두 가지를 싣습니다. 지금은 사진, 나중에는 고객사 로고입니다.
 *   로고 모드  CLIENT_LOGOS가 차고 SECTIONS.clients가 켜지면 자동으로 전환됩니다
 *   사진 모드  그전까지 STRIP_IMAGES를 흘립니다
 *
 * 움직이는 방식
 *   같은 목록을 두 벌 이어 붙이고 정확히 절반만큼 밉니다.
 *   한 바퀴가 끝나는 순간의 화면이 시작할 때와 같아 이음매가 보이지 않습니다.
 *   JS가 없어 탭을 벗어나면 브라우저가 알아서 멈춥니다.
 *   (CSS는 app/globals.css의 .marquee)
 *
 * ⚠ 로고는 상표입니다. 회사명을 글로 적는 것과 로고를 거는 것은 다릅니다.
 *   고객사별 서면 사용 동의 없이 올리면 실제 분쟁 사유가 됩니다.
 *
 * ⚠ 사진 모드의 제목은 「고객사」라고 말하지 않습니다.
 *   스톡 사진이라 우리가 지은 현장이 아니고, 사실은 업종 문구가 담습니다.
 */

/** 항목이 늘면 띠도 길어집니다. 체감 속도를 맞추려면 시간도 함께 늘려야 합니다. */
const SECONDS_PER_ITEM = 6;

export default function ClientLogos() {
  const t = useTranslations('clients');

  const logoMode = SECTIONS.clients && CLIENT_LOGOS.length > 0;
  const items = logoMode ? CLIENT_LOGOS.length : STRIP_IMAGES.length;

  if (items === 0) return null;

  const duration = `${Math.max(28, items * SECONDS_PER_ITEM)}s`;

  return (
    <section className="overflow-x-clip border-t border-line bg-white py-14 lg:py-16">
      <Container>
        <Reveal>
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
            <h2 className="text-h4 font-medium tracking-[-0.01em] text-navy-900">
              {logoMode ? t('logoHeading') : t('heading')}
            </h2>
            <p className="text-caption text-navy-700/65">
              {logoMode ? t('logoLead') : t('lead')}
            </p>
          </div>
        </Reveal>
      </Container>

      {/* 컨테이너 밖에 둡니다 — 안에 가두면 띠가 중간에서 잘려 멈춘 것처럼 보입니다 */}
      <div className="marquee-viewport mt-9 overflow-hidden">
        <ul className="marquee" style={{ ['--marquee-duration' as string]: duration }}>
          {/* 두 벌째는 이음매를 메우기 위한 복제본이라 읽어주지 않습니다 */}
          {[0, 1].map((copy) => (
            <li key={copy} aria-hidden={copy === 1} className="flex shrink-0">
              {logoMode
                ? CLIENT_LOGOS.map((logo) => (
                    <span key={logo.id} className="mx-8 flex shrink-0 items-center lg:mx-10">
                      <Image
                        src={logo.src}
                        alt={copy === 0 ? logo.name : ''}
                        width={logo.width}
                        height={logo.height}
                        sizes="200px"
                        /* 회색으로 눕혔다가 커서를 올리면 원래 색으로 — 로고끼리 색이 싸우지 않습니다 */
                        className="h-8 w-auto opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 lg:h-9"
                      />
                    </span>
                  ))
                : STRIP_IMAGES.map((img) => (
                    <span
                      key={img.id}
                      className="mx-3 shrink-0 overflow-hidden rounded-lg lg:mx-4"
                    >
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
