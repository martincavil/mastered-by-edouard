import type { Metadata } from 'next';
import { PageTransition } from '@/components/page-transition';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Locale, getTranslations, locales } from '@/lib/i18n';
import { generateMetadata as generateSEO } from '@/lib/seo';
import '../globals.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = getTranslations(lang);

  return generateSEO({
    title: t.common.title,
    description: t.common.description,
    locale: lang,
    path: '',
  });
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  return (
    <html lang={lang}>
      <body className="antialiased">
        <div className="fixed top-4 right-4 z-50">
          <LanguageSwitcher currentLocale={lang} />
        </div>
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
