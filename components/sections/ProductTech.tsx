import { useTranslations } from 'next-intl';

import SectionLabel from '@/components/ui/SectionLabel';
import Container from '@/components/layout/Container';
import Reveal from '@/components/motion/Reveal';

/**
 * INFOLINK — 기술 구성
 *
 * 여기 적힌 것은 전부 현재 구현입니다.
 * 아키텍처 도면의 목표(To-Be) 항목 — 시계열 DB, 분석계, 컨테이너 배포 — 은 뺐습니다.
 * 도입 검토에서 "쓰신다면서요"에 "아직입니다"로 답하는 순간
 * 나머지 설명의 신뢰도까지 같이 떨어집니다.
 *
 * 그리고 단출함을 감추지 않습니다. 감추면 약점이 되고, 이유를 붙이면 선택이 됩니다.
 * DB 하나 · 빌드 과정 없음 = 도입과 운영이 가볍다는 뜻이고, 그게 Start Small의 실체입니다.
 */

type Row = { id: string; name: string; value: string };
type Strength = { id: string; title: string; body: string };

export default function ProductTech() {
  const t = useTranslations('product.tech');
  const rows = t.raw('rows') as Row[];
  const strengths = t.raw('strengths') as Strength[];

  return (
    <section id="tech" className="scroll-mt-[136px] lg:scroll-mt-[144px] overflow-x-clip border-t border-line bg-white py-16 lg:py-[96px]">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-20">
          <Reveal className="min-w-0">
            <SectionLabel tone="green">{t('label')}</SectionLabel>
            <h2 className="mt-6 text-[clamp(1.875rem,3.6vw,2.625rem)] font-medium leading-[1.35] tracking-[-0.02em] text-navy-900">
              {t('heading')}
            </h2>
            <p className="mt-5 text-body-lg leading-relaxed text-navy-700/70">{t('lead')}</p>
          </Reveal>

          <div className="min-w-0">
            <dl className="border-t border-line">
              {rows.map((row) => (
                <div
                  key={row.id}
                  className="grid items-baseline gap-x-8 gap-y-1 border-b border-line py-4 sm:grid-cols-[9rem_minmax(0,1fr)]"
                >
                  <dt className="text-caption font-medium uppercase tracking-[0.1em] text-navy-700/60">
                    {row.name}
                  </dt>
                  <dd className="min-w-0 text-body leading-relaxed text-navy-900">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* 강점 — 표만 두면 "단출하네"로 끝납니다. 왜 이렇게 만들었는지가 따라와야 합니다 */}
        <Reveal>
          <div className="mt-16 border-t border-line pt-10">
            <h3 className="text-[12px] font-medium uppercase tracking-[0.14em] text-navy-700/55">
              {t('strengthsHeading')}
            </h3>

            <ul className="mt-8 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
              {strengths.map((s) => (
                <li key={s.id} className="min-w-0">
                  <div className="border-t-2 border-green-500/50 pt-5">
                    <p className="text-body font-medium leading-snug tracking-[-0.01em] text-navy-900">
                      {s.title}
                    </p>
                    <p className="mt-3 text-caption leading-relaxed text-navy-700/70">{s.body}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* 이 섹션의 결론. 세로선이 그려지며 시선을 문장 앞에 세웁니다 */}
            <div className="relative mt-10 max-w-[46rem] pl-5">
              <span
                aria-hidden="true"
                className="draw-rule-y absolute inset-y-0 left-0 w-0.5 bg-green-500/50"
              />
              <p className="text-body-lg font-medium leading-snug tracking-[-0.01em] text-navy-900">
                {t('slogan')}
              </p>
            </div>
          </div>
        </Reveal>

        {/* 권한 — 전산 담당자가 반드시 확인하는 항목이라 별도로 세웁니다 */}
        <Reveal>
          <div className="mt-16 border-t border-line pt-10">
            <h3 className="text-h4 font-medium tracking-[-0.01em] text-navy-900">
              {t('accessHeading')}
            </h3>
            <p className="mt-4 max-w-prose text-caption leading-relaxed text-navy-700/70">
              {t('access')}
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
