import Image from 'next/image';
import { useTranslations } from 'next-intl';

import Container from '@/components/layout/Container';
import Reveal from '@/components/motion/Reveal';
import { CLIENT_LOGOS, SECTIONS } from '@/content/site';

/**
 * 고객사 로고 띠
 *
 * 가로로 끊기지 않고 흐릅니다. 대기업 사이트가 공통으로 쓰는 신뢰 장치이고,
 * 실적을 글로 열 줄 적는 것보다 로고 한 줄이 먼저 읽힙니다.
 *
 * 움직이는 방식
 *   같은 목록을 두 벌 이어 붙이고 정확히 절반만큼 밉니다.
 *   한 바퀴가 끝나는 순간의 화면이 시작할 때와 같아 이음매가 보이지 않습니다.
 *   JS가 필요 없고, 탭을 벗어나면 브라우저가 알아서 멈춥니다.
 *   (CSS는 app/globals.css의 .marquee)
 *
 * ⚠ 로고는 상표입니다. 회사명을 글로 적는 것과 로고를 게재하는 것은 다릅니다.
 *   고객사별 서면 사용 동의 없이 올리면 실제 분쟁 사유가 됩니다.
 *
 * TODO(고객사 로고): content/site.ts의 CLIENT_LOGOS를 채우고 SECTIONS.clients를 true로.
 *   둘 다 해야 노출됩니다 — 실수로 빈 띠가 나가지 않게 이중으로 막았습니다.
 */

/** 로고가 늘어나면 띠도 길어집니다. 체감 속도를 유지하려면 시간도 함께 늘려야 합니다. */
const SECONDS_PER_LOGO = 5;

export default function ClientLogos() {
  const t = useTranslations('clients');
  const logos = CLIENT_LOGOS;
  const empty = logos.length === 0;

  // 플래그가 꺼져 있거나 로고가 없으면 공개 화면에는 아무것도 그리지 않습니다.
  if ((!SECTIONS.clients || empty) && process.env.NODE_ENV === 'production') return null;

  const duration = `${Math.max(24, logos.length * SECONDS_PER_LOGO)}s`;

  return (
    <section className="overflow-x-clip border-t border-line bg-white py-14 lg:py-16">
      <Container>
        <Reveal>
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
            <h2 className="text-h4 font-medium tracking-[-0.01em] text-navy-900">{t('heading')}</h2>
            <p className="text-caption text-navy-700/60">{t('lead')}</p>
          </div>
        </Reveal>
      </Container>

      {empty ? (
        // 개발 전용 자리표시 — 로고가 들어왔을 때 어떻게 흐르는지 확인용입니다.
        <Container>
          <div className="marquee-viewport mt-9 overflow-hidden">
            <ul className="marquee" style={{ ['--marquee-duration' as string]: '30s' }}>
              {[0, 1].map((copy) => (
                <li key={copy} aria-hidden={copy === 1} className="flex shrink-0">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <span
                      key={n}
                      className="mx-7 flex h-12 w-[150px] shrink-0 items-center justify-center border border-dashed border-navy-700/30 bg-navy-50 text-[12px] text-navy-700/55"
                    >
                      로고 {String(n).padStart(2, '0')}
                    </span>
                  ))}
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-6 text-[13px] leading-relaxed text-fg-subtle">
            개발 화면에서만 보입니다. public/images/clients/ 에 로고를 넣고 content/site.ts의
            CLIENT_LOGOS를 채운 뒤 SECTIONS.clients를 true로 바꾸면 실제 로고가 흐릅니다.
            <br />
            게재 전 고객사별 서면 사용 동의를 확인하십시오.
          </p>
        </Container>
      ) : (
        /* 컨테이너 밖으로 빼서 화면 끝까지 흐르게 합니다 — 안에 가두면 띠가 중간에 잘려 보입니다 */
        <div className="marquee-viewport mt-9 overflow-hidden">
          <ul className="marquee" style={{ ['--marquee-duration' as string]: duration }}>
            {/* 두 벌째는 이음매를 메우기 위한 복제본이라 읽어주지 않습니다 */}
            {[0, 1].map((copy) => (
              <li key={copy} aria-hidden={copy === 1} className="flex shrink-0">
                {logos.map((logo) => (
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
                ))}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
