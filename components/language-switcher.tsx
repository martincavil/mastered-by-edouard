'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Locale } from '@/lib/i18n';

export function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  const switchLanguage = (newLocale: Locale) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');

    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    router.push(newPath);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => switchLanguage('fr')}
        className={`px-3 py-1 rounded ${
          currentLocale === 'fr'
            ? 'bg-neutral-900 text-white'
            : 'bg-neutral-100 text-neutral-900'
        }`}
      >
        FR
      </button>
      <button
        onClick={() => switchLanguage('en')}
        className={`px-3 py-1 rounded ${
          currentLocale === 'en'
            ? 'bg-neutral-900 text-white'
            : 'bg-neutral-100 text-neutral-900'
        }`}
      >
        EN
      </button>
    </div>
  );
}
