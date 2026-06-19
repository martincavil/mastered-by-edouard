import { sanityClient } from "./client";

export type LocaleString = { fr: string; en: string };
export type LocaleText = { fr: string; en: string };

export type Artist = {
  _id: string;
  name: string;
  picture?: string;
  link?: string;
  order: number;
  featured: boolean;
};

export type TermsAndConditions = {
  ratesPayments: {
    quotationTitle: LocaleString;
    quotationContent: LocaleText;
    adjustmentsTitle: LocaleString;
    adjustmentsContent: LocaleText;
    paymentTitle: LocaleString;
    paymentContent: LocaleText;
    paymentContent2: LocaleText;
  };
  revisionsVersions: {
    includedTitle: LocaleString;
    includedContent: LocaleText;
    newMixTitle: LocaleString;
    newMixContent: LocaleText;
    additionalTitle: LocaleString;
    additionalContent: LocaleText;
    masterRequestsTitle: LocaleString;
    masterRequestsContent: LocaleText;
  };
  dataFiles: {
    transferTitle: LocaleString;
    transferContent: LocaleText;
    retentionTitle: LocaleString;
    retentionContent: LocaleText;
    securityTitle: LocaleString;
    securityContent: LocaleText;
    finalNote: LocaleText;
  };
};

export type LegalNotice = {
  website: {
    creditsDesign: LocaleString;
    webHosting: LocaleString;
    creditsDevelopmentAuthor: LocaleString;
    creditsPhotographyAuthor: LocaleString;
  };
  masteredByEdouard: {
    companyName: LocaleString;
    startCapital: LocaleString;
    siretNumber: LocaleString;
    vatNumber: LocaleString;
    rcsNumber: LocaleString;
    companyManager: LocaleString;
    contactTitle: LocaleString;
  };
  thanks: {
    description1: LocaleText;
    description2: LocaleText;
    thankYou: LocaleString;
  };
};

export type FaqQuestion = {
  question: LocaleString;
  answer: LocaleText;
  credits?: {
    engineerName: LocaleString;
    engineerValue: LocaleString;
    studioName: LocaleString;
    studioValue: LocaleString;
    email: LocaleString;
    emailValue: LocaleString;
  };
  image?: string;
};

export type Faq = {
  questions: FaqQuestion[];
};

export async function getArtists(): Promise<Artist[]> {
  return sanityClient.fetch(
    `*[_type == "artist"] | order(order asc) {
      _id, name, picture, link, order, featured
    }`,
  );
}

export async function getTermsAndConditions(): Promise<TermsAndConditions | null> {
  return sanityClient.fetch(
    `*[_type == "termsAndConditions"][0] {
      ratesPayments, revisionsVersions, dataFiles
    }`,
  );
}

export async function getLegalNotice(): Promise<LegalNotice | null> {
  return sanityClient.fetch(
    `*[_type == "legalNotice"][0] {
      website, masteredByEdouard, thanks
    }`,
  );
}

export async function getFaq(): Promise<Faq | null> {
  return sanityClient.fetch(
    `*[_type == "faq"][0] {
      questions
    }`,
  );
}
