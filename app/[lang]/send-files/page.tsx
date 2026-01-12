import Link from 'next/link';
import { Locale, getTranslations } from '@/lib/i18n';

export default async function SendFilesPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const t = getTranslations(lang);

  return (
    <main className="h-screen flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold">{t.sendFiles.title}</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          {t.sendFiles.description}
        </p>

        <div className="pt-8">
          <Link
            href={`/${lang}`}
            className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            ← {t.nav.home}
          </Link>
        </div>
      </div>
    </main>
  );
}
