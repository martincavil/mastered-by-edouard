export type Locale = "en" | "fr";

export const locales: Locale[] = ["en", "fr"];
export const defaultLocale: Locale = "fr";

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
    subTitle: string;
    fullDiscography: string;
  };
  sendFiles: {
    title: string;
    description: string;
  };
  studio: {
    engineerTitle: string;
    friendsTitle: string;
    servicesTitle: string;
    gearTitle: string;
    title: string;
    edouard: {
      title: string;
      description1: string;
      description2: string;
      fullDiscography: string;
    };
    friends: {
      title1: string;
      description1: string;
      description2: string;
      title2: string;
      description3: string;
    };
    services: {
      title1: string;
      description1: string;
      title2: string;
      description2: string;
      title3: string;
      description3: string;
      title4: string;
      description4: string;
    };
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
