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
    audioFilesTitle: string;
    productionSheetTitle: string;
    prepareFilesTitle: string;
    audioFiles: {
      headline1: string;
      headline2: string;
      headline3: string;
    };
    productionSheet: {
      headline1: string;
      headline2: string;
    };
    prepareFiles: {
      headline1: string;
      headline2: string;
    };
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
    ctaTitle: string;
    form: {
      sections: {
        yourInfo: string;
        projectInfo: string;
      };
      placeholders: {
        name: string;
        familyName: string;
        email: string;
        phone: string;
        artistName: string;
        projectName: string;
        type: string;
        numberOfSongs: string;
        message: string;
      };
      options: {
        indie: string;
        label: string;
      };
      send: string;
      sending: string;
      requiredNote: string;
      successMessage: string;
      backToHome: string;
      validation: {
        nameRequired: string;
        familyNameRequired: string;
        emailRequired: string;
        emailInvalid: string;
        phoneRequired: string;
        messageRequired: string;
        submitError: string;
        submitSuccess: string;
      };
    };
  };
  footer: {
    legalnotice: string;
    terms: string;
    faq: string;
  };
  notFound: {
    oops: string;
    error: string;
    backHome: string;
  };
  termsAndConditions: {
    title: string;
    illustrationTitle: string;
    tabs: {
      ratesPayments: string;
      revisionsVersions: string;
      dataFiles: string;
    };
    ratesPayments: {
      quotationTitle: string;
      quotationContent: string;
      adjustmentsTitle: string;
      adjustmentsContent: string;
      paymentTitle: string;
      paymentContent: string;
      paymentContent2: string;
    };
    revisionsVersions: {
      includedTitle: string;
      includedContent: string;
      newMixTitle: string;
      newMixContent: string;
      additionalTitle: string;
      additionalContent: string;
      masterRequestsTitle: string;
      masterRequestsContent: string;
    };
    dataFiles: {
      transferTitle: string;
      transferContent: string;
      retentionTitle: string;
      retentionContent: string;
      securityTitle: string;
      securityContent: string;
      finalNote: string;
    };
  };
  legalNotice: {
    title: string;
    illustrationTitle: string;
    tabs: {
      website: string;
      masteredbyedouard: string;
      thanks: string;
    };
    website: {
      creditsDesign: string;
      webHosting: string;
      creditsDevelopmentAuthor: string;
      creditsPhotographyAuthor: string;
    };
    masteredByEdouard: {
      companyName: string;
      startCapital: string;
      siretNumber: string;
      vatNumber: string;
      rcsNumber: string;
      companyManager: string;
      contactTitle: string;
    };
    thanks: {
      description1: string;
      description2: string;
      thankYou: string;
    };
  };
  faq: {
    title: string;
    illustrationTitle: string;
    questions: {
      question1: string;
      answer1: string;
      question2: string;
      answer2: string;
      answer2Credits: {
        engineerName: string;
        engineerValue: string;
        studioName: string;
        studioValue: string;
        email: string;
        emailValue: string;
      };
      question3: string;
      answer3: string;
      question4: string;
      answer4: string;
      question5: string;
      answer5: string;
      question6: string;
      answer6: string;
    };
  };
};
