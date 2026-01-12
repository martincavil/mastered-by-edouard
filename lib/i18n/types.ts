export type Locale = 'en' | 'fr';

export const locales: Locale[] = ['en', 'fr'];
export const defaultLocale: Locale = 'fr';

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
};
