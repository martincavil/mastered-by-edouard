import Link from 'next/link';
import { Locale, getTranslations } from '@/lib/i18n';

export default async function ListenPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const t = getTranslations(lang);

  return (
    <main className="h-screen flex flex-col items-center justify-center bg-white">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-black font-platform">{t.listen.title}</h1>
        <p className="text-lg text-black/70">
          {t.listen.description}
        </p>

        <div className="pt-8">
          <Link
            href={`/${lang}`}
            className="text-black/60 hover:text-red transition-colors"
          >
            ← {t.nav.home}
          </Link>
        </div>
      </div>
    </main>
  );
}
