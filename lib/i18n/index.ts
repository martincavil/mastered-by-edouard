import { Locale, Translations, locales, defaultLocale } from './types';
import { fr } from './fr';
import { en } from './en';

const translations: Record<Locale, Translations> = {
  fr,
  en,
};

export function getTranslations(locale: Locale): Translations {
  return translations[locale] || translations[defaultLocale];
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export { locales, defaultLocale, type Locale, type Translations };
