import type { MetadataRoute } from 'next';

import { ACTIVE_LOCALES } from '@/i18n/routing';
import { INDEXABLE_PATHS, absoluteUrl, alternateLanguages } from '@/lib/seo';

/**
 * sitemap.xml
 *
 * /privacy는 확정 전까지 noindex라 제외했습니다.
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return ACTIVE_LOCALES.flatMap((locale) =>
    INDEXABLE_PATHS.map((path) => ({
      url: absoluteUrl(locale, path),
      lastModified: now,
      changeFrequency: path === '' ? ('weekly' as const) : ('monthly' as const),
      priority: path === '' ? 1 : 0.7,
      alternates: { languages: alternateLanguages(path) },
    })),
  );
}
