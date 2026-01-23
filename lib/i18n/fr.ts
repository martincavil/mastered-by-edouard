import { Translations } from "./types";

export const fr: Translations = {
  common: {
    title: "MasteredByEdouard - Studio de Mastering Professionnel",
    description: "Services de mastering audio professionnels en France",
  },
  nav: {
    home: "Accueil",
    listen: "écouter.",
    sendFiles: "envoyer.",
    studio: "studio.",
    contact: "contact.",
  },
  home: {
    title: "Edouard Carbonne,",
    subtitle: "ingénieur de mastering mondial.",
  },
  listen: {
    title: "écouter.",
    subTitle: "ils me font confiance.",
    fullDiscography: "voir toute la discographie",
  },
  sendFiles: {
    title: "envoyer des fichiers.",
    audioFilesTitle: "fichiers audio",
    productionSheetTitle: "fiche de production",
    prepareFilesTitle: "préparer vos fichiers",
    audioFiles: {
      draganddrop: "glissez ou déposez vos fichiers ici",
      clickordrag: "uploadez ton ou tes fichiers *",
      uploadingFiles: "fichiers uploadés",
      headline1: "simple.",
      headline2: "rapide.",
      headline3: "sécurisé.",
      successHeadline1: "vos fichiers",
      successHeadline2: "sont entre de bonnes mains.",
      termsAndConditions:
        "en envoyant vos fichiers, vous acceptez nos conditions générales.",
      successMessage: "fichiers envoyés avec succès.",
      sendProductionSheet: "envoyer la fiche de production",
      backToHome: "retour à l'accueil",
    },
    productionSheet: {
      headline1: "toutes les infos,",
      headline2: "un seul endroit.",
      headlineSuccess1: "vos fichiers",
      headlineSuccess2: "sont entre de bonnes mains.",
      step1Title: "informations.",
      step2Title: "liste des titres.",
      step3Title: "crédits.",
      name: "nom*",
      artist: "artiste / groupe*",
      mail: "mail*",
      projectTitle: "titre du projet*",
      streaming: "streaming",
      dolbyAtmos: "dolby atmos",
      vinyl: "vinyle",
      cd: "cd",
      alternativeVersions: "version(s) alternative(s)",
      cdUpc: "code UPC cd",
      vinylUpc: "code UPC vinyle",
      uploadCover: "télécharger la pochette",
      uploadCoverHint: ".jpeg ou .png - min 500x500px",
      uploadCoverTooltipTitle: "cover details",
      uploadCoverTooltipHints: [
        ". vous pouvez envoyer la pochette en .jpeg ou .png",
        ". assurez-vous que la résolution soit d'au moins 500x500",
      ],
      uploadOtherFiles: "télécharger d'autres fichiers",
      uploadOtherFilesHint: "PDF, DOC, DOCX, TXT, XLS, XLSX uniquement",
      uploadOtherFilesTooltipTitle: "other files",
      uploadOtherFilesTooltipHints: [
        ". vous pouvez joindre tout autre document, copie de label, références...",
      ],
      trackTitle: "titre du morceau",
      isrcCode: "code ISRC",
      addTrack: "ajouter un morceau",
      composer: "compositeur",
      arranger: "arrangeur",
      genre: "genre",
      label: "label",
      recordingEngineer: "ingénieur d'enregistrement / studio",
      mixingEngineer: "ingénieur de mixage",
      otherCredits: "autres crédits",
      allInfoChecked: "toutes les informations sont vérifiées",
      back: "retour",
      nextTrackList: "liste des titres",
      nextCredits: "crédits",
      sendDocument: "envoyer le document",
      successMessage: "documents envoyés avec succès.",
      backToHome: "retour à l'accueil",
      termsAndConditions:
        "en envoyant cette fiche de production, vous acceptez nos conditions générales.",
      errorCoverFormat:
        "Seuls les formats JPEG et PNG sont autorisés pour la pochette",
      errorCoverSize: "La pochette doit faire au minimum 500x500 pixels",
      errorOtherFilesFormat:
        "Seuls les documents sont autorisés (PDF, DOC, DOCX, TXT, XLS, XLSX)",
      errorNameRequired: "Le nom est requis",
      errorArtistRequired: "L'artiste/groupe est requis",
      errorEmailRequired: "L'email est requis",
      errorEmailInvalid: "Format d'email invalide",
      errorProjectTitleRequired: "Le titre du projet est requis",
      errorFormatRequired: "Au moins un format doit être sélectionné",
      errorTracksRequired: "Au moins un morceau est requis",
      errorTracksTitleRequired: "Tous les morceaux doivent avoir un titre",
      errorCheckboxRequired:
        "Veuillez confirmer que toutes les informations sont vérifiées",
    },
    prepareFiles: {
      headline1: "le mastering",
      headline2: "commence par un bon mix.",
      uploadFiles: "envoyer des fichiers",
      step1Title: "the mix.",
      step1Content: {
        step1Content1:
          "make sure the audio is clean : no clicks, noise, or other audio artifacts. pay attention to the beginning and end of the track; avoid cutting the audio too abruptly.",
        step1Content2:
          " true Peak (TP) level doesn’t really matter in the digital world, whether it’s at -0.1 or -6, as long as the sound doesn’t clip! just avoid peaks and distortions.",
        step1Content3:
          "The mix is THE MIX : please  keep all your mix bus processing  (including limiters and clippers).",
      },
      step2Title: "the bounce.",
      step2Content: {
        step2Content1:
          "If you can’t export at 32-bit floating point, then 24-bit is still excellent. Try to avoid exporting at 16-bit, especially if your peak levels are quite low.",
        step2Content2:
          "This is very simple... sample rate must remain the same as during mixing.",
        step2Content3: "Files must be exported in .WAV or .AIF format.",
      },
      step3Title: "the naming.",
      step3Content: {
        step3Content1:
          "Please, name properly your files before sending them! You can follow the following naming scheme :",
        step3Content2: "Artist_Title(VERSION)_Mix 1",
      },
      step4Title: "stem mastering?",
      step4Content: {
        step4Content1:
          "stem mastering is often a sign of a mix not fully finalized : This is why the studio doesn’t necessarily favor this approach. My approach : Let’s take time together to listen to the mix and improve it to its best! My job as a mastering engineer starts at the mixing stage, helping you keep to good direction.",
        step4Content2: "However, stem mastering can be used in certain cases.",
      },
    },
  },
  studio: {
    title: "studio.",
    engineerTitle: "ingénieur",
    friendsTitle: "amis",
    servicesTitle: "services",
    gearTitle: "matériel",
    edouard: {
      title: "rencontrez votre ingénieur du son.",
      description1:
        "Salut. Je suis Edouard, un ingénieur de mastering français basé à Paris. Pour moi, le mastering n'est pas seulement une étape technique, c'est une question de confiance et de connexion. J'aime que les choses soient claires, organisées et efficaces, afin que les artistes puissent se sentir en confiance quant à la dernière étape de leur production.",
      description2:
        "Ce qui me motive vraiment, c'est l'aspect humain : les conversations, les échanges culturels et la passion partagée pour le son. Au cours des dernières années, j'ai eu la chance de masteriser plus d'un millier de chansons pour des artistes du monde entier, atteignant même la certification de disque de diamant en cours de route.",
      fullDiscography: "voir toute la discographie",
    },
    friends: {
      title1: "amis",
      description1:
        "Au fil des ans, j'ai eu le privilège de collaborer avec une gamme diversifiée d'artistes et de professionnels de l'industrie musicale. Ces amitiés ont enrichi mon parcours en tant qu'ingénieur de mastering et ont été une source d'inspiration et de croissance.",
      description2:
        "Des ingénieurs aux musiciens et producteurs, chaque connexion a contribué à ma compréhension de la musique et du son. Je valorise profondément ces relations et j'ai hâte de continuer à nouer de nouvelles amitiés à l'avenir.",
      title2: "la musique doit être partagée.",
      description3:
        "Il s'agit de personnes, d'histoires et de cultures qui se connectent. Je me sens chanceux de travailler déjà avec des artistes et des ingénieurs de tant d'endroits différents — Japon, Belgique, Afrique du Sud, Argentine, et au-delà.",
    },
    services: {
      title1: "services",
      description1:
        "Services de mastering audio professionnels pour vos morceaux.",
      title2: "mastering de stems",
      description2:
        "Le mastering de stems implique le traitement séparé de plusieurs groupes de pistes audio (stems) avant leur combinaison finale. Cela permet un contrôle plus précis sur l'équilibre et la dynamique globale du mixage final.",
      title3: "mastering analogique",
      description3:
        "Le mastering analogique utilise des équipements matériels traditionnels pour traiter l'audio, offrant une chaleur et une profondeur uniques qui peuvent être difficiles à reproduire avec des outils numériques.",
      title4: "mastering numérique",
      description4:
        "Le mastering numérique utilise des logiciels et des plugins avancés pour affiner et optimiser les pistes audio, garantissant une clarté et une précision maximales dans le produit final.",
    },
  },
  contact: {
    title: "contact.",
    description: "Contactez-nous pour vos projets de mastering.",
    ctaTitle: "discutons de votre projet.",
    form: {
      sections: {
        yourInfo: "vos informations",
        projectInfo: "informations projet",
      },
      placeholders: {
        name: "prénom*",
        familyName: "nom*",
        email: "email*",
        phone: "numéro de téléphone*",
        artistName: "nom d'artiste",
        projectName: "nom du projet",
        type: "indépendant ou label?",
        numberOfSongs: "nombre de morceaux",
        message: "message*",
      },
      options: {
        indie: "Indépendant",
        label: "Label",
      },
      send: "envoyer",
      sending: "envoi en cours...",
      requiredNote: "les champs marqués d'un * sont obligatoires.",
      successMessage: "message envoyé avec succès.",
      backToHome: "retour à l'accueil",
      validation: {
        nameRequired: "Le prénom est obligatoire",
        familyNameRequired: "Le nom est obligatoire",
        emailRequired: "L'email est obligatoire",
        emailInvalid: "Veuillez entrer une adresse email valide",
        phoneRequired: "Le numéro de téléphone est obligatoire",
        messageRequired: "Le message est obligatoire",
        submitError: "Une erreur s'est produite. Veuillez réessayer.",
        submitSuccess: "Votre message a été envoyé avec succès !",
      },
    },
  },
  footer: {
    legalnotice: "Mentions Légales",
    terms: "CGV",
    faq: "FAQ",
  },
  notFound: {
    oops: "Oops...",
    error: "erreur réessayez",
    backHome: "Retour Accueil",
  },
  termsAndConditions: {
    title: "conditions générales.",
    illustrationTitle: "pour une relation saine.",
    tabs: {
      ratesPayments: "tarifs & paiements",
      revisionsVersions: "révisions & versions",
      dataFiles: "données & fichiers",
    },
    ratesPayments: {
      quotationTitle: "devis et confirmation du prix",
      quotationContent:
        "Tous les prix sont communiqués sur demande et confirmés par devis avant le début de tout service. Le devis est valable 30 jours à compter de sa date d'émission.",
      adjustmentsTitle: "ajustements de prix",
      adjustmentsContent:
        "Si l'étendue du travail change significativement par rapport au devis initial (ex. : nombre de morceaux, durée, services additionnels), un devis révisé sera fourni et devra être approuvé avant de continuer.",
      paymentTitle: "conditions et méthodes de paiement",
      paymentContent:
        "Le paiement est dû à la fin du service de mastering, avant la livraison des fichiers finaux. Les méthodes de paiement acceptées incluent :",
      paymentContent2:
        "Invoices can be payed using the following methods : Bank transfer (SEPA & SWIFT), Wise Transfer or online Credit Card payment. ",
    },
    revisionsVersions: {
      includedTitle: "révisions incluses",
      includedContent:
        "Chaque projet de mastering comprend jusqu'à 2 séries de révisions sans frais supplémentaires. Les révisions doivent être demandées dans les 7 jours suivant la réception du master initial.",
      newMixTitle: "envoi d'un nouveau mix",
      newMixContent:
        "Si un nouveau mix est fourni après le début du processus de mastering, il sera traité comme un nouveau projet et facturé en conséquence, sauf accord préalable.",
      additionalTitle: "versions supplémentaires",
      additionalContent:
        "Les versions alternatives (instrumental, mix TV, edit radio, etc.) peuvent être masterisées à tarif réduit si elles sont demandées en même temps que la version principale.",
      masterRequestsTitle: "demandes de masters supplémentaires",
      masterRequestsContent:
        "Toute demande de masters supplémentaires après la fin du projet (ex. : master vinyle après livraison du master numérique) fera l'objet d'un devis séparé.",
    },
    dataFiles: {
      transferTitle: "protocole de transfert de fichiers",
      transferContent:
        "Les fichiers doivent être envoyés via des services de transfert sécurisés tels que WeTransfer, Dropbox, Google Drive ou toute plateforme professionnelle de transfert audio. Tous les fichiers doivent être en format haute résolution (24-bit minimum, 44,1 kHz ou supérieur).",
      retentionTitle: "période de conservation des données",
      retentionContent:
        "Tous les fichiers du projet (mixs originaux et masters) sont stockés en toute sécurité pendant 12 mois après la fin du projet. Après cette période, les fichiers peuvent être supprimés sauf si l'archivage est demandé.",
      securityTitle: "sécurité et confidentialité",
      securityContent:
        "Tous les fichiers clients sont traités avec une stricte confidentialité. Votre musique ne sera jamais partagée, distribuée ou utilisée sans votre autorisation explicite.",
      finalNote:
        "En faisant appel à nos services de mastering, vous confirmez avoir lu et accepté ces conditions générales. Si vous avez des questions ou des préoccupations, n'hésitez pas à nous contacter.",
    },
  },
  legalNotice: {
    title: "legal notice.",
    illustrationTitle: "for the most curious.",
    tabs: {
      website: "website",
      masteredbyedouard: "masteredbyedouard",
      thanks: "thanks",
    },
    website: {
      creditsDesign:
        "Logo, web design & illustrations : edouard carbonne and valentinegrasphisme",
      webHosting: "Web hosting : Vercel",
      creditsDevelopmentAuthor: "Development by Martin Cavil",
      creditsPhotographyAuthor: "Photography by Théo Burette",
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
        "Mastered by Edouard would be nothing without the incredible friends, engineers, artists I met all the way here.",
      description2:
        "A special thanks to the following humans who really brought me here : Pierre Ottway, Jowee Omicil, Jordan Kouby, Grégory Germain, Frédéric Perrin, Eric Perez-Björkman, Fabio Morgado, Antoine Castaldi, Fred Vectol, Alexis Cayrouse, Elliott Bastide, Joachim Mike, Nathan Cocherie, Théo Burette, Valentine Gras, my family, and all the others who got involved one way or another to this journey. ",
      thankYou: "Thank you!",
    },
  },
  faq: {
    title: "faq.",
    illustrationTitle: "most of your questions in one place.",
    questions: {
      question1: "1. What is Mastering ?",
      answer1:
        "It is the final step in the music production process. The primary goals of audio mastering are to ensure that the music sounds cohesive, balanced, and consistent across different playback systems and to enhance its overall sonic characteristics.",
      question2: "2. what is Apple Digital Masters ? ",
      answer2:
        "Apple Digital Masters (ADM) is a program introduced by Apple which is designed to ensure that music distributed on Apple Music meets a high-quality audio standard. The studio is certified ADM, you simply have to give the following informations to the distributor :",
      answer2Credits: {
        engineerName: "Nom de l'ingénieur",
        engineerValue: "Edouard Carbonne",
        studioName: "Nom du studio",
        studioValue: "Mastered by Edouard",
        email: "Email",
        emailValue: "contact@masteredbyedouard.com",
      },
      question3: "3. why human mastering in the A.I era ? ",
      answer3:
        "We live in an amazing era where A.I can achieve for sure great results ! But the purpose of the mastering engineer is not only to provide tools, but also a human ear and experience ! It allows direct communication, feedback, and collaboration, ensuring that the artist's intentions and expectations are met. It’s all about human connection and trust!",
      question4: "4. do you provide CD and Vinyl mastering ?",
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
