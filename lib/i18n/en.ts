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
      headline1: "simple.",
      headline2: "fast.",
      headline3: "secure.",
      successHeadline1: "your files",
      successHeadline2: "are now in good hands.",
      termsAndConditions:
        "you accept the terms and conditions of the studio when sending files.",
      successMessage: "audio files sent successfully.",
      sendProductionSheet: "send production sheet",
      backToHome: "back to home",
      namingTooltipTitle: "folder organization",
      namingTooltipHints: [
        ". your files will be organized in a folder named: artist_name-timestamp",
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
        step4Content2: "However, stem mastering can be discussed in certain cases.",
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
        "Hi-resolution digital master file (for digital streaming platforms and video clip).  All masters are Apple Digital Masters certified. > up to 192kHz/24-bit.",
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
      requiredNote: "fields marked with * are required.",
      successMessage: "message sent successfully.",
      backToHome: "go back to homepage",
      validation: {
        nameRequired: "name is required",
        familyNameRequired: "family name is required",
        emailRequired: "email is required",
        emailInvalid: "please enter a valid email address",
        phoneRequired: "phone number is required",
        messageRequired: "message is required",
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
    ratesPayments: {
      quotationTitle: "quotation and price confirmation : ",
      quotationContent:
        "all prices for our mastering services are quoted or/and confirmed before the beginning of the mastering process. These quotes are based on the client's specific requirements and the scope of the project at the time of agreement.",
      adjustmentsTitle: "price adjustments : ",
      adjustmentsContent:
        "prices are subject to adjustment in response to the evolution of the studio and inflation. However, once a project has been quoted and agreed upon, the quoted price remains fixed and will not be affected by subsequent studio price changes or inflation.",
      paymentTitle: "payment terms and methods : ",
      paymentContent:
        "payments for our services are to be settled within 30 days after the invoice is delivered. The invoice will be issued on the day of the final delivery of masters. ",
      paymentContent2:
        "invoices can be payed using the following methods : Bank transfer (SEPA & SWIFT), Wise Transfer or online Credit Card payment. ",
    },
    revisionsVersions: {
      includedTitle: "included revisions : ",
      includedContent:
        "my approach to mastering revisions is as follows: since the artist’s satisfaction matters more than instant results, I don’t charge for revisions. As a rule, the rate includes as many revisions as needed — and in 99% of cases, it only takes one or two versions!",
      newMixTitle: "sending of a new mix : ",
      newMixContent:
        "if a client decides to send a new mix after the initial mastering process has started, it will incur additional charges. These charges cover the time and resources needed to adjust the mastering process according to the new mix.",
      additionalTitle: "additional versions : ",
      additionalContent:
        "before starting the mastering process, it will always be confirmed whether alternative versions are needed (instrumental, PBO, radio edit, a cappella, etc.). These alternate versions will be billed according to the studio’s pricing in effect at the time the masters are delivered. ",
      masterRequestsTitle: "additional master requests : ",
      masterRequestsContent:
        "any requests for an additional alternative master after the final delivery will be charged separately. ",
    },
    dataFiles: {
      transferTitle: "file transfer protocol : ",
      transferContent:
        "at the studio, we strongly believe in a single, unified interface designed to make everyone’s life easier — all in a secure and reliable way. That is why all file transfers, including sending and receiving, are exclusively conducted through Dropbox. ",
      retentionTitle: "data retention period : ",
      retentionContent:
        "sessions and related files will be archived for a period of 2 years from the date of the final delivery. After this period, only the master file will be retained. The duration of retention for master files is undetermined.",
      securityTitle: "security and confidentiality : ",
      securityContent:
        "mastered by Edouard guarantees the confidentiality and security of all client files. We do not share or distribute any client data without explicit consent.",
      finalNote:
        "reliability regarding confidentiality is also a core value in any mastering studio. In keeping with this principle, every project handled in the studio — even without a signed NDA — will never be leaked or shared with anyone other than the person directly involved in the mastering process.",
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
    website: {
      creditsDesign:
        "logo, web design & illustrations : valentinegrasphisme and edouard carbonne ",
      webHosting: "web hosting : Vercel",
      creditsDevelopmentAuthor: "development by Martin Cavil",
      creditsPhotographyAuthor: "photography by Théo Burette",
    },
    masteredByEdouard: {
      companyName:
        "Mastered by Edouard is a Limited Liability Corporation (LLC).",
      startCapital: "Share capital : 700 euros]",
      siretNumber: "SIRET : 948 971 569 00017",
      vatNumber: "VAT number : FR27948971569",
      rcsNumber: "RCS number : Nanterre B 948 971 569",
      companyManager: "Company manager : Edouard Carbonne",
      contactTitle: "Contact",
    },
    thanks: {
      description1:
        "Mastered by Edouard would be nothing without the incredible friends, engineers and artists I met all the way here.",
      description2:
        "A special thanks to the following humans who really brought me here : Pierre Ottway, Jowee Omicil, Jordan Kouby, Grégory Germain, Frédéric Perrin, Eric Perez-Björkman, Fabio Morgado, Antoine Castaldi, Fred Vectol, Alexis Cayrouse, Elliott Bastide, Joachim Mike, Nathan Cocherie, Théo Burette, Valentine Gras, my family, and all the others who got involved one way or another to this journey. ",
      thankYou: "Thank you!",
    },
  },
  faq: {
    title: "FAQ.",
    illustrationTitle1: "most of your questions",
    illustrationTitle2: "in one place.",
    questions: {
      question1: "1. what is Mastering ?",
      answer1:
        "It is the final step in the music production process. The primary goals of audio mastering are to ensure that the music sounds cohesive, balanced, and consistent across different playback systems and to enhance its overall sonic characteristics.",
      question2: "2. what is Apple Digital Masters ? ",
      answer2:
        "Apple Digital Masters (ADM) is a program introduced by Apple which is designed to ensure that music distributed on Apple Music meets a high-quality audio standard. The studio is certified ADM, you simply have to give the following informations to the distributor :",
      answer2Credits: {
        engineerName: "Engineer's name",
        engineerValue: "Edouard Carbonne",
        studioName: "Studio name",
        studioValue: "Mastered by Edouard",
        email: "Email",
        emailValue: "contact@masteredbyedouard.com",
      },
      question3: "3. why human mastering in the A.I era ? ",
      answer3:
        "We live in an amazing era where A.I can achieve for sure great results ! But the purpose of the mastering engineer is not only to provide tools, but also a human ear and experience ! It allows direct communication, feedback, and collaboration, ensuring that the artist's intentions and expectations are met. It’s all about human connection and trust!",
      question4: "4. do you provide CD/Vinyl mastering ?",
      answer4:
        "The studio offers professional CD and vinyl mastering options, ensuring your music sounds good on every format. CD and/or vinyl mastering will be made or request !",
      question5: "5. turnaround  time ?",
      answer5:
        "Turnaround times naturally vary depending on the type of project. For a single, the standard delivery time is around two to three business days. An express delivery (within 24 hours) is available at an additional cost. For larger projects (EPs or LPs), delivery times will be communicated once the full scope of the project has been defined.",
      question6: "6. mastered by Edouard : logo, identity ",
      answer6:
        "Being passionate about design and user experience, I put a lot of care into shaping the studio’s creative and visual identity. That’s why I strive to maintain a consistent image across all platforms — website, social media, and email. And as for the logo — yes, it does have a meaning! Here it is:",
    },
  },
};
