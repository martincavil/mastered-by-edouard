import { Metadata } from "next";
import { Locale } from "@/lib/i18n";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com";

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
      locale: locale === "fr" ? "fr_FR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
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
  const pages = [
    { path: "", priority: 1.0, changeFrequency: "monthly" as const },
    { path: "/studio", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/listen", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/send-files", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/faq", priority: 0.6, changeFrequency: "monthly" as const },
    {
      path: "/legal-notice",
      priority: 0.3,
      changeFrequency: "yearly" as const,
    },
    {
      path: "/terms-and-conditions",
      priority: 0.3,
      changeFrequency: "yearly" as const,
    },
  ];
  const locales: Locale[] = ["fr", "en"];

  const routes = locales.flatMap((locale) =>
    pages.map((page) => ({
      url: `${BASE_URL}/${locale}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    }))
  );

  return routes;
}
