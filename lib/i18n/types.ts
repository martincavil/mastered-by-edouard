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
    ddpReaderTitle: string;
    filesSentTitle: string;
    sent: {
      audio: [string, string, string];
      label: [string, string, string];
      backHome: string;
    };
    audioFiles: {
      draganddrop: string;
      clickordrag: string;
      uploadingFiles: string;
      uploadInProgress: string;
      projectNamePlaceholder: string;
      messagePlaceholder: string;
      headline1: string;
      headline2: string;
      headline3: string;
      successHeadline1: string;
      successHeadline2: string;
      termsAndConditions: {
        text: string;
        link: string;
        suffix: string;
      };
      successMessage: string;
      sendProductionSheet: string;
      backToHome: string;
      namingTooltipTitle: string;
      namingTooltipHints: string[];
      namePlaceholder: string;
      emailPlaceholder: string;
      sendButton: string;
      browse: string;
      howToPrepare: string;
      acceptedFormats: string;
      errorNoFiles: string;
      errorName: string;
      errorEmail: string;
      errorEmailInvalid: string;
      errorProjectName: string;
      errorFileType: string;
    };
    productionSheet: {
      headline1: string;
      headline2: string;
      headlineSuccess1: string;
      headlineSuccess2: string;
      step1Title: string;
      step2Title: string;
      step3Title: string;
      name: string;
      artist: string;
      mail: string;
      projectTitle: string;
      streaming: string;
      dolbyAtmos: string;
      vinyl: string;
      cd: string;
      alternativeVersions: string;
      cdUpc: string;
      vinylUpc: string;
      uploadCover: string;
      uploadCoverHint: string;
      uploadCoverTooltipTitle: string;
      uploadCoverTooltipHints: string[];
      uploadOtherFiles: string;
      uploadOtherFilesHint: string;
      uploadOtherFilesTooltipTitle: string;
      uploadOtherFilesTooltipHints: string[];
      trackTitle: string;
      isrcCode: string;
      addTrack: string;
      composer: string;
      arranger: string;
      genre: string;
      label: string;
      recordingEngineer: string;
      mixingEngineer: string;
      otherCredits: string;
      allInfoChecked: string;
      back: string;
      nextTrackList: string;
      nextCredits: string;
      sendDocument: string;
      successMessage: string;
      backToHome: string;
      termsAndConditions: {
        beforeLink: string;
        linkText: string;
        afterLink: string;
      };
      errorCoverFormat: string;
      errorCoverSize: string;
      errorOtherFilesFormat: string;
      errorNameRequired: string;
      errorArtistRequired: string;
      errorEmailRequired: string;
      errorEmailInvalid: string;
      errorProjectTitleRequired: string;
      errorFormatRequired: string;
      errorTracksRequired: string;
      errorTracksTitleRequired: string;
      errorCheckboxRequired: string;
      mobileDisclaimer: string;
    };
    prepareFiles: {
      headline1: string;
      headline2: string;
      back: string;
      cards: { title: string; bullets: string[] }[];
      exportFormats: string[];
      namingChips: string[];
      stemsLabels: string[];
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
      description1_2: string;
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
    ctaTitle1: string;
    ctaTitle2: string;
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
      allInfoChecked: string;
      requiredNote: string;
      successMessage: string;
      backToHome: string;
      termsAndConditions: {
        text: string;
        link: string;
        suffix: string;
      };
      validation: {
        allInfoCheckedRequired: string;
        nameRequired: string;
        familyNameRequired: string;
        emailRequired: string;
        emailInvalid: string;
        phoneRequired: string;
        messageRequired: string;
        termsRequired: string;
        captchaRequired: string;
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
    illustrationTitle1: string;
    illustrationTitle2: string;
    tabs: {
      ratesPayments: string;
      revisionsVersions: string;
      dataFiles: string;
    };
  };
  legalNotice: {
    title: string;
    illustrationTitle1: string;
    illustrationTitle2: string;
    tabs: {
      website: string;
      masteredbyedouard: string;
      thanks: string;
    };
  };
  faq: {
    title: string;
    illustrationTitle1: string;
    illustrationTitle2: string;
  };
  ddpPlayer: {
    reader: {
      intro: string;
      dropTitle: string;
      chooseFolder: string;
      chooseZip: string;
      privacy: string;
      localBadge: string;
      headline: string[];
      steps: { number: string; title: string; subtitle: string; text: string }[];
      nowPlaying: string;
      trackOf: string;
      tracksCount: string;
      cdAudioStereo: string;
      volume: string;
      detailsTitle: string;
      masterInfo: string;
      audioFormat: string;
      audioFormatValue: string;
      channels: string;
      stereo: string;
      upc: string;
      notProvided: string;
      md5Verified: string;
      md5Failed: string;
      md5Checking: string;
      md5FilesOk: string;
      md5Reference: string;
      md5Details: string;
      advanced: string;
    };
    title: string;
    intro: string;
    localNotice: string;
    dropTitle: string;
    dropHint: string;
    chooseZip: string;
    chooseFolder: string;
    folderUnsupported: string;
    maxSize: string;
    reading: string;
    unzipping: string;
    loadAnother: string;
    album: string;
    artist: string;
    upc: string;
    tracks: string;
    totalTime: string;
    noCdText: string;
    untitled: string;
    table: {
      number: string;
      title: string;
      isrc: string;
      pause: string;
      start: string;
      end: string;
      duration: string;
    };
    play: string;
    pause: string;
    stop: string;
    previous: string;
    next: string;
    seek: string;
    byteOrder: string;
    byteOrderLittle: string;
    byteOrderBig: string;
    byteOrderUncertain: string;
    pqEvents: string;
    pqTrack: string;
    pqIndex: string;
    pqTime: string;
    pqControl: string;
    leadOut: string;
    md5Title: string;
    md5Start: string;
    md5Running: string;
    md5Ok: string;
    md5Ko: string;
    md5Missing: string;
    md5NoFile: string;
    md5Computed: string;
    md5Cancel: string;
    exportTitle: string;
    exportCsv: string;
    exportPdf: string;
    errors: {
      tooLarge: string;
      empty: string;
      badZip: string;
      encrypted: string;
      missingDdpid: string;
      missingDdpms: string;
      invalidDdpid: string;
      invalidDdpms: string;
      missingPq: string;
      invalidPq: string;
      missingAudio: string;
      notAudio: string;
      generic: string;
      playback: string;
    };
    faqTitle: string;
    faq: { question: string; answer: string }[];
    trademark: string;
  };
  landscapeWarning: {
    message: string;
  };
};
