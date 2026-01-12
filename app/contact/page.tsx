'use client';

import Link from 'next/link';
import { useTranslations } from '@/lib/i18n/useTranslations';
import { PageTransition } from '@/components/page-transition';
import { Footer } from '@/components/footer';

export default function ContactPage() {
  const t = useTranslations();

  return (
    <>
      <PageTransition>
        <main className="h-full flex flex-col justify-between bg-white">
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-black">
                {t.contact.title}
              </h1>
              <p className="text-lg text-black/70">{t.contact.description}</p>

              <div className="pt-8">
                <Link
                  href="/"
                  className="text-black/60 hover:text-red transition-colors"
                >
                  ← {t.nav.home}
                </Link>
              </div>
            </div>
          </div>
          <Footer color="black" />
        </main>
      </PageTransition>
    </>
  );
}
