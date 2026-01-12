import { Metadata } from 'next';
import { Locale } from '@/lib/i18n';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com';

interface SEOConfig {
  title: string;
  description: string;
  locale: Locale;
  path: string;
  image?: string;
  noIndex?: boolean;
}

export function generateMetadata({
  title,
  description,
  locale,
  path,
  image,
  noIndex = false,
}: SEOConfig): Metadata {
  const url = `${BASE_URL}/${locale}${path}`;
  const ogImage = image || `${BASE_URL}/og-default.jpg`;

  return {
    title,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: url,
      languages: {
        en: `${BASE_URL}/en${path}`,
        fr: `${BASE_URL}/fr${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: title,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
    },
  };
}

export function generateSitemap() {
  const pages = ['', '/listen', '/send-files', '/studio', '/contact'];
  const locales: Locale[] = ['fr', 'en'];

  const routes = locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${BASE_URL}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: page === '' ? 1.0 : 0.8,
    }))
  );

  return routes;
}
