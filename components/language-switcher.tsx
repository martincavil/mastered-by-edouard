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
        className={`px-3 py-1 rounded transition-colors ${
          currentLocale === 'fr'
            ? 'bg-red text-white'
            : 'bg-white text-black border border-black/20'
        }`}
      >
        FR
      </button>
      <button
        onClick={() => switchLanguage('en')}
        className={`px-3 py-1 rounded transition-colors ${
          currentLocale === 'en'
            ? 'bg-red text-white'
            : 'bg-white text-black border border-black/20'
        }`}
      >
        EN
      </button>
    </div>
  );
}
