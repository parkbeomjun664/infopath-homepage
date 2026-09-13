import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import PageShell from '@/components/layout/PageShell';
import SectionNav from '@/components/layout/SectionNav';
import Reveal from '@/components/motion/Reveal';
import ImageBand from '@/components/sections/ImageBand';
import ProductWhy from '@/components/sections/ProductWhy';
import SolutionFeature from '@/components/sections/SolutionFeature';
import ProductFlow from '@/components/sections/ProductFlow';
import ProductFeatures from '@/components/sections/ProductFeatures';
import ProductTech from '@/components/sections/ProductTech';
import Architecture from '@/components/sections/Architecture';
import CaseStudies from '@/components/sections/CaseStudies';
import CtaBanner from '@/components/sections/CtaBanner';
import { ACTIVE_LOCALES, DEFAULT_LOCALE, isActiveLocale } from '@/i18n/routing';
import { ASSETS, ASSET_DIMENSIONS } from '@/content/site';

/**
 * /solution — INFOLINK MES 제품 소개
 *
 * 순서가 곧 설득 논리입니다.
 *   Why(무엇을 해결하나) → Flow(어떻게 흐르나) → Features(무슨 기능인가) → Tech(무엇으로 만들었나)
 * 기능을 앞에 두면 읽는 사람이 자기 문제와 연결하지 못한 채 목록만 훑고 나갑니다.
 *
 * 이미지 밴드 두 개는 장식이 아니라 호흡입니다.
 * 글만 이어지면 읽는 사람이 문서로 인식하고 훑기를 포기합니다.
 * 두 번째 밴드에는 이 페이지의 결론 문장을 얹어, 본문 안에 묻혀 있던 핵심을 밖으로 꺼냅니다.
 *
 * 확장 로드맵 섹션은 두지 않습니다. "예정"이라고 써도 "그럼 언제요"를 부르고,
 * 그 질문에 답할 수 없으면 그 자리에서 신뢰가 깎입니다.
 */

type PageProps = { params: Promise<{ locale: string }> };

type Value = { id: string; name: string; body: string };

export function generateStaticParams() {
  return ACTIVE_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isActiveLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: 'product.hero' });
  return { title: t('heading').replace(/\n/g, ' '), description: t('lead') };
}

export default async function SolutionPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(isActiveLocale(locale) ? locale : DEFAULT_LOCALE);

  const t = await getTranslations('product.hero');
  const tf = await getTranslations('product.flow');
  const values = t.raw('values') as Value[];
  const tn = await getTranslations('product.nav');
  const navItems = tn.raw('items') as { id: string; label: string }[];

  return (
    <>
      <PageShell label={t('label')} heading={t('heading')} lead={t('lead')}>
        {/* 핵심 가치 둘 — 이 페이지 전체가 결국 이 두 문장의 근거입니다 */}
        <ul className="mt-12 grid gap-x-10 gap-y-8 border-t border-line pt-8 sm:grid-cols-2 lg:mt-14">
          {values.map((v, i) => (
            <Reveal as="li" key={v.id} className="min-w-0">
              <p className="text-h4 font-medium tracking-[-0.01em] text-navy-900">{v.name}</p>
              <p className="mt-3 text-caption leading-relaxed text-navy-700/70">{v.body}</p>
            </Reveal>
          ))}
        </ul>
      </PageShell>

      <ImageBand
        src={ASSETS.aiLayers}
        alt={t('imageAlt')}
        width={ASSET_DIMENSIONS.aiLayers.width}
        height={ASSET_DIMENSIONS.aiLayers.height}
        priority
      />

      {/* 구간 이동 바 — 섹션 6개가 한 페이지에 이어지므로 현재 위치가 보여야 합니다 */}
      <SectionNav items={navItems} ariaLabel={tn('label')} />

      <ProductWhy />
      <ProductFlow />

      {/* 흐름 설명이 끝난 자리에서 결론을 한 번 크게 못박고 기능 목록으로 넘어갑니다 */}
      <ImageBand
        bleed
        src={ASSETS.factoryLine}
        alt={tf('bandAlt')}
        width={ASSET_DIMENSIONS.factoryLine.width}
        height={ASSET_DIMENSIONS.factoryLine.height}
        caption={tf('thesis')}
        captionSub={tf('thesisSub')}
      />

      {/* 메인에서 옮겨온 「기록에서 관리까지」 — 회사 홈페이지가 아니라 제품 페이지의 내용입니다 */}
      <SolutionFeature />
      <ProductFeatures />
      <ProductTech />
      {/* 메인에서 넘어온 구조 상세 — 계층 6개와 결과 5개는 이 페이지가 받습니다 */}
      <Architecture detail />
      {/* 적용 사례 — 실제 사례가 들어오기 전까지 공개 화면에는 나가지 않습니다 */}
      <CaseStudies />
      <CtaBanner />
    </>
  );
}
