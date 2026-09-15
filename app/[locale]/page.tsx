import { setRequestLocale } from 'next-intl/server';

import Hero from '@/components/sections/Hero';
import StatsBand from '@/components/sections/StatsBand';
import Approach from '@/components/sections/Approach';
import BuildProcess from '@/components/sections/BuildProcess';
import ProductTeaser from '@/components/sections/ProductTeaser';
import Faq from '@/components/sections/Faq';
import ClientLogos from '@/components/sections/ClientLogos';
import CtaBanner from '@/components/sections/CtaBanner';
import { ACTIVE_LOCALES, DEFAULT_LOCALE, isActiveLocale } from '@/i18n/routing';
import { SECTIONS } from '@/content/site';

/**
 * 메인 — INFOPATH 회사 홈페이지
 *
 * 이 페이지의 주어는 회사입니다. 제품 설명은 여기 있지 않습니다.
 *   ❌ "INFOLINK을 소개합니다"
 *   ✅ "INFOPATH는 스마트팩토리를 구축합니다. INFOLINK이 있어서 빠릅니다."
 *
 * 전에는 9개 블록 중 5개가 INFOLINK 설명이라 제품 카탈로그로 읽혔습니다.
 * 8단계 흐름 · 데이터 경로 · 아키텍처 · 기술 사양은 전부 /infolink로 옮기고,
 * 여기에는 그 페이지로 들어가는 문 하나(ProductTeaser)만 남겼습니다.
 *
 *   Hero        무엇을 하는 회사인가 (슬라이드 3장, 자동 전환)
 *   StatsBand   이미 무엇을 가지고 있는가 — 스크롤 전에 "백지에서 시작하지 않는다"를 증명
 *   Approach    도입의 벽 3개와 그 답
 *   Product     그래서 빠른 이유 = INFOLINK → /infolink
 *   FAQ · CTA
 *
 * ※ BuildProcess(구축 방식)는 BUILD_STEPS가 비어 있는 동안 공개 화면에 나가지 않습니다.
 *   회사가 파는 것은 구축이므로 그 과정이 가장 큰 공백입니다.
 *   실제 절차를 확인해 content/site.ts의 BUILD_STEPS를 채우면 켜집니다.
 *
 * 헤더·푸터는 app/[locale]/layout.tsx가 담당합니다.
 */

type PageProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return ACTIVE_LOCALES.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(isActiveLocale(locale) ? locale : DEFAULT_LOCALE);

  return (
    <main id="main">
      {SECTIONS.hero && <Hero />}
      <StatsBand />
      {SECTIONS.approach && <Approach />}
      <BuildProcess />
      {SECTIONS.productTeaser && <ProductTeaser />}
      {SECTIONS.faq && <Faq />}
      <ClientLogos />
      {SECTIONS.cta && <CtaBanner />}
    </main>
  );
}
