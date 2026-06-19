import { Translations } from "./types";

export const en: Translations = {
  common: {
    title: "mastered by edouard - professional mastering studio",
    description:
      "Professional audio mastering services in France and worldwide",
  },
  nav: {
    home: "home",
    listen: "listen.",
    sendFiles: "send files.",
    studio: "studio.",
    contact: "contact.",
  },
  home: {
    title: "Edouard Carbonne,",
    subtitle: "worldwide mastering engineer.",
  },
  listen: {
    title: "listen.",
    subTitle: "they trust me.",
    fullDiscography: "view full discography",
  },
  sendFiles: {
    title: "send files.",
    audioFilesTitle: "audio files",
    productionSheetTitle: "production sheet",
    prepareFilesTitle: "prepare your files",
    audioFiles: {
      draganddrop: "simply drop the file(s) below :",
      clickordrag: "upload file(s) *",
      uploadingFiles: "uploaded file(s)",
      uploadInProgress: "upload in progress",
      projectNamePlaceholder: "project name*",
      messagePlaceholder: "message",
      headline1: "simple.",
      headline2: "fast.",
      headline3: "secure.",
      successHeadline1: "your files",
      successHeadline2: "are now in good hands.",
      termsAndConditions: {
        text: "you accept the",
        link: "terms and conditions",
        suffix: "of the studio when sending files.",
      },
      successMessage: "audio files sent successfully.",
      sendProductionSheet: "send production sheet",
      backToHome: "back to home",
      namingTooltipTitle: "folder organization",
      namingTooltipHints: [
        ". your files will be organized in a folder named: date_name_project-name",
        ". all your audio files will be stored in this folder",
        ". this ensures easy tracking and organization",
      ],
    },
    productionSheet: {
      headline1: "all infos,",
      headline2: "one place.",
      headlineSuccess1: "your files",
      headlineSuccess2: "are now in good hands.",
      step1Title: "informations.",
      step2Title: "track list.",
      step3Title: "credits.",
      name: "name*",
      artist: "artist / group*",
      mail: "mail*",
      projectTitle: "project title*",
      streaming: "streaming",
      dolbyAtmos: "dolby atmos",
      vinyl: "vinyl",
      cd: "cd",
      alternativeVersions: "alternative version(s)",
      cdUpc: "cd UPC code",
      vinylUpc: "vinyl UPC code",
      uploadCover: "upload cover",
      uploadCoverHint: ".jpeg or .png - min 500x500px",
      uploadCoverTooltipTitle: "cover details",
      uploadCoverTooltipHints: [
        ". you can send the cover in .jpeg or .png",
        ". make sure the resolution is at least 500x500",
      ],
      uploadOtherFiles: "upload other files",
      uploadOtherFilesHint: "PDF, DOC, DOCX, TXT, XLS, XLSX only",
      uploadOtherFilesTooltipTitle: "other files",
      uploadOtherFilesTooltipHints: [
        ". you can attach any other documents, label copy, references...",
      ],
      trackTitle: "track title",
      isrcCode: "ISRC code",
      addTrack: "add track",
      composer: "composer",
      arranger: "arranger",
      genre: "genre",
      label: "label",
      recordingEngineer: "recording engineer / studio",
      mixingEngineer: "mixing engineer",
      otherCredits: "other credits",
      allInfoChecked: "all informations are checked",
      back: "back",
      nextTrackList: "track list",
      nextCredits: "credits",
      sendDocument: "send document",
      successMessage: "documents sent successfully.",
      backToHome: "back to home",
      termsAndConditions: {
        beforeLink: "by sending this production sheet, you accept our",
        linkText: "terms and conditions",
        afterLink: ".",
      },
      errorCoverFormat: "Only JPEG and PNG formats are allowed for cover",
      errorCoverSize: "Cover image must be at least 500x500 pixels",
      errorOtherFilesFormat:
        "Only document files are allowed (PDF, DOC, DOCX, TXT, XLS, XLSX)",
      errorNameRequired: "name is required",
      errorArtistRequired: "artist/Group is required",
      errorEmailRequired: "email is required",
      errorEmailInvalid: "invalid email format",
      errorProjectTitleRequired: "project title is required",
      errorFormatRequired: "at least one format must be selected",
      errorTracksRequired: "at least one track is required",
      errorTracksTitleRequired: "all tracks must have a title",
      errorCheckboxRequired: "please confirm all information are checked",
      mobileDisclaimer:
        "For an optimal experience, please fill out the production sheet on a computer. Thank you for your understanding!",
    },
    prepareFiles: {
      headline1: "mastering",
      headline2: "starts with a good mix.",
      uploadFiles: "upload files",
      step1Title: "the mix.",
      step1Content: {
        step1Content1:
          "make sure the audio is clean : no clicks, noise, audio artifacts. Also make sure the audio is not cutting too abruptly.",
        step1Content2:
          " true Peak (TP) level doesn’t really matter in the digital world, whether it’s at -0.1 or -6, as long as the sound doesn’t have audible distortions.",
        step1Content3:
          "the mix is THE MIX : keep all your mix bus processing (limiters & clippers included). You can also export an additional version without them ",
      },
      step2Title: "the bounce.",
      step2Content: {
        step2Content1:
          "you can export in 32-bit floating point or 24-bit, it's excellent. Avoid exporting at 16-bit, especially if your peak levels are quite low.",
        step2Content2:
          "this is very simple... sample rate must remain the same as during mixing.",
        step2Content3: "Files must be exported in .WAV or .AIF format.",
      },
      step3Title: "the naming.",
      step3Content: {
        step3Content1:
          "please, name properly your files before sending them! You can follow the following naming scheme :",
        step3Content2: "Artist_Title(MIX)_mix 1; Artist_Title(PBO)_mix 1...",
      },
      step4Title: "stem mastering?",
      step4Content: {
        step4Content1:
          "stem mastering is often a sign of a mix not fully finalized : this is why the studio doesn’t necessarily favor this approach. My vision : let’s take time together to listen to the mix and improve it to its best! My job as a mastering engineer starts at the mixing stage, helping you keep to good direction.",
        step4Content2:
          "However, stem mastering can be discussed in certain cases.",
      },
    },
  },
  studio: {
    title: "studio.",
    engineerTitle: "engineer",
    friendsTitle: "friends",
    servicesTitle: "services",
    gearTitle: "gear",
    edouard: {
      title: "meet your engineer.",
      description1:
        "Hey. I’m Edouard, a french mastering engineer based in Paris. For me, mastering is not just a technical step, it’s about trust and connection. I like things to be clear, organised, and efficient, so artists can feel confident that the final step of their production will be smooth and precise.",
      description2:
        "What truly drives me is the human side : the conversations, the cultural exchange, and the shared passion for sound. Over the past years, I’ve had the chance to master more than a thousand songs for artists from every corner of the world, and even reach diamond record certification along the way. ",
      fullDiscography: "view full discography",
    },
    friends: {
      title1: "music has to be shared.",
      description1:
        "It’s about people, stories, and cultures connecting. I feel lucky to already work with artists and engineers from so many different places: Japan, Belgium, South Africa, Argentina, and beyond.",
      description2:
        "Every project is a dialogue, a mix of identities that creates something unique. That’s what music really is to me: a language we all speak differently, that brings us together.",
      title2: "connection and trust.",
      description3:
        "Here are some of the following partnership grown years after years:",
    },
    services: {
      title1: "digital mastering",
      description1:
        "Hi-resolution digital master file (for digital streaming platforms and video clip). All masters are Apple Digital Masters certified.",
      description1_2: "> up to 192kHz/24-bit.",
      title2: "vinyl mastering",
      description2:
        "24-bit WAV masters per side of vinyl with a cue sheet PDF. Vinyl-specific processing applied if requested by the pressing plant",
      title3: "cd mastering",
      description3:
        "DDP files, including CD text, ISRC, UPC codes to be used by the CD mastering plant.",
      title4: "dolby atmos",
      description4:
        "Redefine the listening experience with our expert Dolby Atmos mastering. Optimized for compatible streaming platforms. ",
    },
  },
  contact: {
    title: "contact.",
    description: "Contact us for your mastering projects.",
    ctaTitle1: "let's discuss",
    ctaTitle2: "your project.",
    form: {
      sections: {
        yourInfo: "your info",
        projectInfo: "project info",
      },
      placeholders: {
        name: "name*",
        familyName: "family name*",
        email: "mail*",
        phone: "phone number*",
        artistName: "artist name",
        projectName: "project name",
        type: "indie or label?",
        numberOfSongs: "number of songs",
        message: "message*",
      },
      options: {
        indie: "indie",
        label: "label",
      },
      send: "send",
      sending: "sending...",
      allInfoChecked: "all information is checked",
      requiredNote: "fields marked with * are required.",
      successMessage: "message sent successfully.",
      backToHome: "go back to homepage",
      termsAndConditions: {
        text: "you accept the",
        link: "terms and conditions",
        suffix: "of the studio when sending files.",
      },
      validation: {
        nameRequired: "name is required",
        familyNameRequired: "family name is required",
        emailRequired: "email is required",
        emailInvalid: "please enter a valid email address",
        phoneRequired: "phone number is required",
        messageRequired: "message is required",
        termsRequired: "you must accept the terms and conditions",
        captchaRequired: "please complete the captcha before sending",
        allInfoCheckedRequired:
          "please confirm that all information is checked",
        submitError: "an error occurred. Please try again.",
        submitSuccess: "your message has been sent successfully!",
      },
    },
  },
  footer: {
    legalnotice: "legal Notices",
    terms: "terms and Conditions",
    faq: "FAQ",
  },
  notFound: {
    oops: "Oops...",
    error: "error try again",
    backHome: "back home",
  },
  termsAndConditions: {
    title: "terms and conditions.",
    illustrationTitle1: "for a healthy.",
    illustrationTitle2: "relationship.",
    tabs: {
      ratesPayments: "rates & payments",
      revisionsVersions: "revisions & versions",
      dataFiles: "data & files",
    },
  },
  legalNotice: {
    title: "legal notice.",
    illustrationTitle1: "for the most",
    illustrationTitle2: "curious.",
    tabs: {
      website: "website",
      masteredbyedouard: "masteredbyedouard",
      thanks: "thanks",
    },
  },
  faq: {
    title: "FAQ.",
    illustrationTitle1: "most of your questions",
    illustrationTitle2: "in one place.",
  },
  landscapeWarning: {
    message: "Please rotate your device to portrait mode",
  },
};
