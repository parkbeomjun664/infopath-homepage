import { useTranslations } from 'next-intl';

import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';
import SectionLabel from '@/components/ui/SectionLabel';

/**
 * 404
 *
 * 메시지(notFound)는 처음부터 있었는데 페이지가 없어 쓰이지 않고 있었습니다.
 * 없는 주소로 들어온 사람에게 브라우저 기본 화면을 보여주면 사이트가 죽은 것처럼 보입니다.
 *
 * 여기서 할 일은 사과가 아니라 길 안내입니다.
 * 그래서 홈으로 가는 주 버튼과 INFOLINK·문의로 가는 보조 링크를 함께 둡니다.
 *
 * 헤더·푸터는 app/[locale]/layout.tsx가 그대로 감싸므로 여기서는 본문만 그립니다.
 */

export default function NotFound() {
  const t = useTranslations('notFound');
  const tc = useTranslations('common');
  const tn = useTranslations('nav');

  return (
    <main id="main" className="flex min-h-[60vh] items-center py-28 lg:py-40">
      <Container>
        <SectionLabel tone="green">404</SectionLabel>

        <h1 className="mt-6 max-w-[20ch] text-[clamp(1.875rem,3.6vw,2.625rem)] font-medium leading-[1.35] tracking-[-0.02em] text-navy-900">
          {t('heading')}
        </h1>
        <p className="mt-5 max-w-prose text-body-lg leading-relaxed text-navy-700/70">
          {t('body')}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Button href="/" variant="primary" size="lg">
            {tc('goHome')}
          </Button>
          <Button href="/infolink" variant="link" size="lg">
            {tn('infolink')}
          </Button>
          <Button href="/contact" variant="link" size="lg">
            {tn('contact')}
          </Button>
        </div>
      </Container>
    </main>
  );
}
