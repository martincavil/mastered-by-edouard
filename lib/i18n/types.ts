export type Locale = 'en' | 'fr';

export const locales: Locale[] = ['en', 'fr'];
export const defaultLocale: Locale = 'fr';

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export type Translations = {
  common: {
    title: string;
    description: string;
  };
  nav: {
    home: string;
    listen: string;
    sendFiles: string;
    studio: string;
    contact: string;
  };
  home: {
    title: string;
    subtitle: string;
  };
  listen: {
    title: string;
    description: string;
  };
  sendFiles: {
    title: string;
    description: string;
  };
  studio: {
    title: string;
    description: string;
  };
  contact: {
    title: string;
    description: string;
  };
  footer: {
    legalnotices: string;
    terms: string;
    qanda: string;
  };
  notFound: {
    oops: string;
    error: string;
    backHome: string;
  };
};
