'use client';

import { useLanguage } from '@/lib/i18n/LanguageProvider';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setLocale('fr')}
        className={`px-3 py-1 rounded transition-colors ${
          locale === 'fr'
            ? 'bg-red text-white'
            : 'bg-white text-black border border-black/20'
        }`}
      >
        FR
      </button>
      <button
        onClick={() => setLocale('en')}
        className={`px-3 py-1 rounded transition-colors ${
          locale === 'en'
            ? 'bg-red text-white'
            : 'bg-white text-black border border-black/20'
        }`}
      >
        EN
      </button>
    </div>
  );
}
