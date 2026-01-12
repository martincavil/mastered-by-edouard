'use client';

import Link from 'next/link';
import { useTranslations } from '@/lib/i18n/useTranslations';
import { PageTransition } from '@/components/page-transition';
import { LanguageSwitcher } from '@/components/language-switcher';

export default function HomePage() {
  const t = useTranslations();

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>
      <PageTransition>
        <main className="h-screen flex flex-col items-center justify-center bg-white">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black font-platform">
              {t.home.title}
            </h1>
            <p className="text-xl md:text-2xl text-black/70">
              {t.home.subtitle}
            </p>

            <nav className="flex flex-wrap gap-4 justify-center mt-12">
              <Link
                href="/listen"
                className="px-6 py-3 bg-red text-white rounded-lg hover:bg-red-dark transition-colors"
              >
                {t.nav.listen}
              </Link>
              <Link
                href="/send-files"
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-black/80 transition-colors"
              >
                {t.nav.sendFiles}
              </Link>
              <Link
                href="/studio"
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-black/80 transition-colors"
              >
                {t.nav.studio}
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 bg-red text-white rounded-lg hover:bg-red-dark transition-colors"
              >
                {t.nav.contact}
              </Link>
            </nav>
          </div>
        </main>
      </PageTransition>
    </>
  );
}
