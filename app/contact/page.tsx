'use client';

import Link from 'next/link';
import { useTranslations } from '@/lib/i18n/useTranslations';
import { PageTransition } from '@/components/page-transition';
import { LanguageSwitcher } from '@/components/language-switcher';

export default function ContactPage() {
  const t = useTranslations();

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>
      <PageTransition>
        <main className="h-screen flex flex-col items-center justify-center bg-white">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-black font-platform">{t.contact.title}</h1>
            <p className="text-lg text-black/70">
              {t.contact.description}
            </p>

            <div className="pt-8">
              <Link
                href="/"
                className="text-black/60 hover:text-red transition-colors"
              >
                ← {t.nav.home}
              </Link>
            </div>
          </div>
        </main>
      </PageTransition>
    </>
  );
}
