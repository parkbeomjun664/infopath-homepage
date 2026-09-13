import Image from 'next/image';
import { useTranslations } from 'next-intl';

import SectionLabel from '@/components/ui/SectionLabel';
import Reveal from '@/components/motion/Reveal';
import { CEO_PROFILE } from '@/content/site';

/**
 * 대표자 소개 (/about)
 *
 * 실적도 인증도 없는 회사에서 「누가 만들었는가」는 가장 값싼 신뢰 요소가 아니라
 * 가장 강한 것 중 하나입니다. 특히 「왜 이걸 만들었는지」가 있으면
 * 제품 설명이 못 하는 일을 합니다 — 현장을 알고 시작했다는 증거가 되기 때문입니다.
 *
 * 다만 이름·경력을 지어내면 그 순간 반대가 됩니다.
 * CEO_PROFILE.pending이 true인 동안에는 공개 화면에 아무것도 그리지 않고,
 * 개발 환경에서만 무엇을 채워야 하는지 표시합니다.
 *
 * TODO(대표자): content/site.ts의 CEO_PROFILE에 값을 넣고 pending을 false로.
 *   messages의 about.ceo.* 는 라벨만 담고 있고, 사람 정보는 site.ts에만 둡니다.
 */

export default function CeoProfile() {
  const t = useTranslations('about.ceo');
  const pending = CEO_PROFILE.pending;

  if (pending && process.env.NODE_ENV === 'production') return null;

  return (
    <Reveal className="mt-20">
      <div className="border-t border-line pt-10">
        <SectionLabel tone="green">{t('label')}</SectionLabel>

        {pending ? (
          // 개발 전용 — 무엇이 비어 있는지 눈으로 확인하는 자리
          <div className="mt-6 rounded-lg border-2 border-dashed border-navy-700/30 bg-navy-50 p-6">
            <p className="text-body font-medium text-navy-900">대표자 소개 자리</p>
            <ul className="mt-3 flex flex-col gap-1 text-caption text-navy-700/70">
              <li>content/site.ts · CEO_PROFILE</li>
              <li>name · role · career · why · photo(선택)</li>
              <li>값을 넣고 pending을 false로 바꾸면 공개 화면에 나타납니다</li>
            </ul>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 sm:grid-cols-[minmax(0,180px)_minmax(0,1fr)] sm:gap-10">
            {CEO_PROFILE.photo && (
              <div className="relative aspect-[4/5] w-full max-w-[180px] overflow-hidden rounded-lg bg-surface">
                <Image
                  src={CEO_PROFILE.photo}
                  alt={`${CEO_PROFILE.name} ${CEO_PROFILE.role}`}
                  fill
                  sizes="180px"
                  className="object-cover"
                />
              </div>
            )}

            <div className="min-w-0">
              <p className="text-h3 font-medium tracking-[-0.02em] text-navy-900">
                {CEO_PROFILE.name}
                <span className="ml-3 text-body font-normal text-navy-700/60">
                  {CEO_PROFILE.role}
                </span>
              </p>

              <p className="mt-4 text-body leading-relaxed text-navy-700/70">
                {CEO_PROFILE.career}
              </p>

              {/* 「왜 만들었는가」 — 이 문단이 회사 소개에서 가장 오래 남습니다 */}
              <div className="mt-7 border-l-2 border-green-500/50 pl-5">
                <p className="text-[12px] font-medium uppercase tracking-[0.14em] text-green-600">
                  {t('whyLabel')}
                </p>
                <p className="mt-3 max-w-prose text-body leading-relaxed text-navy-900">
                  {CEO_PROFILE.why}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Reveal>
  );
}
