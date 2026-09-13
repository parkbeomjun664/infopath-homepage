import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';

import Container from '@/components/layout/Container';
import { Link } from '@/i18n/navigation';
import { ACTIVE_LOCALES, LOCALE_LABELS, type ActiveLocale } from '@/i18n/routing';
import { ASSETS, ASSET_DIMENSIONS, COMPANY, NAV } from '@/content/site';

/**
 * 푸터
 *
 * 페이지 바닥에 닿은 사람은 「다 읽었다」거나 「찾던 게 없다」 둘 중 하나입니다.
 * 어느 쪽이든 다음 행선지를 줘야 합니다. 그래서 푸터는 2차 내비게이션입니다.
 *
 * 열 구성
 *   브랜드     회사와 제품의 관계를 한 줄로 다시 못박습니다
 *   SITEMAP    페이지 목록
 *   INFOLINK   제품 페이지 안의 구간으로 바로 — 링크는 /infolink의 구간 이동 바와
 *              같은 메시지(product.nav.items)를 씁니다. 한쪽만 고치면 어긋나므로.
 *   CONTACT    연락처와 사업자 정보
 *
 * 개인정보처리방침은 하단 줄에만 둡니다.
 * 전에는 SITEMAP 목록과 하단에 두 번 나왔습니다 — 법적 링크의 자리는 하단입니다.
 *
 * 사업자 정보는 전자상거래법상 표기 의무 항목입니다.
 * 미확보 항목은 값을 지어내지 않습니다. 다만 방문자에게 「대표자 —」를 보여주는 것은
 * 정보가 아니라 미완성 신호일 뿐이므로, 공개 화면에서는 그 줄 자체를 그리지 않고
 * 개발 환경에서만 무엇이 비어 있는지 표시합니다.
 *
 * TODO(사업자 정보): content/site.ts의 COMPANY에 값을 넣고 pending을 false로 바꾸면
 *   여기와 /about에 자동으로 나타납니다.
 *     - 대표자명 ceo · 사업자등록번호 bizNo · 본사 주소 address · 대표전화 tel
 */

type NavItem = { id: string; label: string };

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale() as ActiveLocale;
  const year = new Date().getFullYear();

  const sections = t.raw('product.nav.items') as NavItem[];

  const showPending = process.env.NODE_ENV !== 'production';
  const PLACEHOLDER = '—';
  const bizRows = [
    { label: t('footer.company'), value: `${COMPANY.nameKo} (${COMPANY.nameEn})`, pending: false },
    { label: t('footer.ceo'), value: COMPANY.ceo.value, pending: COMPANY.ceo.pending },
    { label: t('footer.bizNo'), value: COMPANY.bizNo.value, pending: COMPANY.bizNo.pending },
    { label: t('footer.address'), value: COMPANY.address.value, pending: COMPANY.address.pending },
    { label: t('footer.tel'), value: COMPANY.tel.value, pending: COMPANY.tel.pending },
  ];
  const pendingCount = bizRows.filter((r) => r.pending).length;

  const columnHeading = 'label-mono text-fg-subtle';
  const columnLink =
    'text-caption text-navy-700/70 transition-colors hover:text-navy-700';

  return (
    <footer className="border-t border-line bg-white">
      <Container className="py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-10">
          {/* ── 브랜드 ── */}
          <div className="min-w-0">
            <Image
              src={ASSETS.logo}
              alt={COMPANY.nameEn}
              width={ASSET_DIMENSIONS.logo.width}
              height={ASSET_DIMENSIONS.logo.height}
              className="h-11 w-auto"
            />
            <p className="mt-5 text-caption italic text-navy-700/60">{t('footer.tagline')}</p>
            <p className="mt-2 max-w-[34ch] text-caption text-navy-700/70">
              {t('footer.platformNote')}
            </p>

            {/* 바닥까지 내려온 사람이 언어를 바꾸려고 맨 위로 돌아가지 않도록 */}
            <div className="mt-6 flex items-center gap-2">
              {ACTIVE_LOCALES.map((code, i) => (
                <span key={code} className="flex items-center gap-2">
                  {i > 0 && (
                    <span aria-hidden="true" className="h-3 w-px shrink-0 bg-navy-700/20" />
                  )}
                  <Link
                    href="/"
                    locale={code}
                    aria-current={code === locale ? 'true' : undefined}
                    className={
                      code === locale
                        ? 'text-caption font-semibold text-navy-700'
                        : 'text-caption text-navy-700/45 transition-colors hover:text-navy-700'
                    }
                  >
                    {LOCALE_LABELS[code].short}
                  </Link>
                </span>
              ))}
            </div>
          </div>

          {/* ── 사이트맵 ── */}
          <nav aria-label={t('nav.menu')} className="min-w-0">
            <p className={columnHeading}>SITEMAP</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li>
                <Link href="/" className={columnLink}>
                  {t('nav.home')}
                </Link>
              </li>
              {NAV.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} className={columnLink}>
                    {t(`nav.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── 제품 페이지 구간 ── */}
          <nav aria-label={t('product.nav.label')} className="min-w-0">
            <p className={columnHeading}>INFOLINK</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {sections.map((s) => (
                <li key={s.id}>
                  <Link href={`/infolink#${s.id}`} className={columnLink}>
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── 연락처 · 사업자 정보 ── */}
          <div className="min-w-0">
            <p className={columnHeading}>CONTACT</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              <li className="flex gap-2 text-caption">
                <span className="shrink-0 text-navy-700/60">{t('footer.email')}</span>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="font-medium text-azure-600 underline-offset-4 hover:underline"
                >
                  {COMPANY.email}
                </a>
              </li>

              {bizRows
                .filter((row) => !row.pending || showPending)
                .map((row) => (
                  <li key={row.label} className="flex gap-2 text-caption">
                    <span className="shrink-0 text-navy-700/60">{row.label}</span>
                    <span className={row.pending ? 'text-navy-700/45' : 'text-navy-700/70'}>
                      {row.pending ? PLACEHOLDER : row.value}
                    </span>
                  </li>
                ))}
            </ul>

            {/* 미확보 항목 안내 — 개발 환경 체크용이며 공개 화면에는 나가지 않습니다 */}
            {showPending && pendingCount > 0 && (
              <p className="mt-4 max-w-[32ch] text-[12px] leading-relaxed text-fg-subtle">
                {t('footer.pendingNote')}
              </p>
            )}
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <p className="text-caption text-navy-700/60">
            {t('footer.copyright', { year: String(year) })}
          </p>
          <Link
            href="/privacy"
            className="text-caption font-medium text-navy-700/70 underline-offset-4 transition-colors hover:text-navy-700 hover:underline"
          >
            {t('nav.privacy')}
          </Link>
        </div>
      </Container>
    </footer>
  );
}
