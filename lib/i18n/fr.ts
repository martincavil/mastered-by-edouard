import { Translations } from "./types";

export const fr: Translations = {
  common: {
    title: "mastered by edouard - studio de mastering professionnel",
    description:
      "Services de mastering audio professionnels en France et dans le monde",
  },
  nav: {
    home: "accueil",
    listen: "écouter.",
    sendFiles: "envoyer.",
    studio: "studio.",
    contact: "contact.",
  },
  home: {
    title: "Edouard Carbonne,",
    subtitle: "ingénieur de mastering international.",
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
      clickordrag: "uploader des fichiers *",
      uploadingFiles: "fichiers uploadés",
      uploadInProgress: "envoi en cours",
      projectNamePlaceholder: "nom du projet*",
      messagePlaceholder: "message",
      headline1: "simple.",
      headline2: "rapide.",
      headline3: "sécurisé.",
      successHeadline1: "vos fichiers",
      successHeadline2: "sont entre de bonnes mains.",
      termsAndConditions: {
        text: "vous acceptez les",
        link: "conditions générales",
        suffix: "du studio lors de l'envoi de fichiers.",
      },
      successMessage: "fichiers envoyés avec succès.",
      sendProductionSheet: "envoyer la fiche de production",
      backToHome: "retour à l'accueil",
      namingTooltipTitle: "organisation des dossiers",
      namingTooltipHints: [
        ". vos fichiers seront organisés dans un dossier nommé : date_nom_nom-du-projet",
        ". tous vos fichiers audio seront stockés dans ce dossier",
        ". cela garantit un suivi et une organisation faciles",
      ],
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
      uploadCoverTooltipTitle: "détails de la pochette",
      uploadCoverTooltipHints: [
        ". vous pouvez envoyer la pochette en .jpeg ou .png",
        ". assurez-vous que la résolution soit d'au moins 500x500",
      ],
      uploadOtherFiles: "télécharger d'autres fichiers",
      uploadOtherFilesHint: "PDF, DOC, DOCX, TXT, XLS, XLSX uniquement",
      uploadOtherFilesTooltipTitle: "autres fichiers",
      uploadOtherFilesTooltipHints: [
        ". vous pouvez joindre tout autre document, label copy, références...",
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
      termsAndConditions: {
        beforeLink: "en envoyant cette fiche de production, vous acceptez nos",
        linkText: "conditions générales",
        afterLink: ".",
      },
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
      mobileDisclaimer:
        "Pour une expérience optimale, veuillez remplir la fiche de production sur un ordinateur. Merci de votre compréhension !",
    },
    prepareFiles: {
      headline1: "le mastering",
      headline2: "commence par un bon mix.",
      uploadFiles: "envoyer des fichiers",
      step1Title: "le mix.",
      step1Content: {
        step1Content1:
          "assurez vous que le mix soit propre : aucun clic, bruit de fond ou artefact. Soignez l'entrée et la sortie de la piste ; évitez les coupures trop brutales.",
        step1Content2:
          " le niveau de True Peak (TP) n'a pas d'importance dans le monde numérique, qu'il soit à -0,1 ou -6, tant que le son ne contient pas de distortion audible.",
        step1Content3:
          "le mix est LE MIX : merci de conserver tous vos traitements sur le bus master (clipper/limiteur compris).",
      },
      step2Title: "l'export.",
      step2Content: {
        step2Content1:
          "exportez en 32-bit flottant ou 24-bits. Évitez d'exporter en 16-bit, surtout si vos niveaux de crête sont assez bas.",
        step2Content2:
          "c'est très simple... la fréquence d'échantillonnage (sample rate) doit rester la même que celle utilisée pendant le mixage.",
        step2Content3:
          "Les fichiers doivent être exportés au format .WAV ou .AIF.",
      },
      step3Title: "la nomenclature.",
      step3Content: {
        step3Content1:
          "merci de nommer correctement vos fichiers avant de les envoyer ! Vous pouvez suivre le schéma de nommage suivant :",
        step3Content2: "Artiste_Titre(MIX)_mix 1; Artiste_Titre(PBO)_mix 1...",
      },
      step4Title: "stem mastering?",
      step4Content: {
        step4Content1:
          "le stem mastering est souvent le signe d'un mixage qui n'est pas totalement finalisé : c'est pourquoi le studio ne privilégie pas nécessairement cette approche. Ma vision des choses : prenons le temps d'écouter le mix ensemble et de l'améliorer au maximum ! Mon travail d'ingénieur de mastering commence dès l'étape du mixage, en vous aidant à garder la bonne direction.",
        step4Content2:
          "cependant, le stem mastering peut se discuter dans certains cas.",
      },
    },
  },
  studio: {
    title: "studio.",
    engineerTitle: "edouard",
    friendsTitle: "amis",
    servicesTitle: "services",
    gearTitle: "matériel",
    edouard: {
      title: "rencontrez votre ingénieur mastering.",
      description1:
        "Salut. Je suis Edouard, ingénieur de mastering basé à Paris. Pour moi, le mastering ne se résume pas à une simple étape technique ; c'est avant tout une histoire de confiance et de lien humain. J'aime que les choses soient claires, organisées et fiables, afin que les artistes puissent aborder cette ultime étape de leur production avec sérénité et précision.",
      description2:
        "Ce qui me motive vraiment, c'est l'aspect humain : les conversations, les échanges culturels et la passion partagée pour le son. Au cours des dernières années, j'ai eu la chance de masteriser plus d'un millier de chansons pour des artistes du monde entier, atteignant même la certification de disque de diamant.",
      fullDiscography: "voir toute la discographie",
    },
    friends: {
      title1: "la musique doit être partagée",
      description1:
        "Pour moi, tout est question de connexions, d’histoires, de cultures et de rencontres. Je me sens chanceux de collaborer avec des artistes et des ingénieurs venant des quatre coins du monde.",
      description2:
        "Chaque projet est un dialogue, un croisement d'identités qui donne naissance à quelque chose d'unique. C'est ça l'essence de la musique : un langage que nous parlons tous différemment, mais qui finit par tous nous rassembler.",
      title2: "collaboration et confiance.",
      description3:
        "Voici quelques-uns des partenariats qui se sont construits au fil des années :",
    },
    services: {
      title1: "mastering digital",
      description1:
        "fichier master haute résolution (pour les plateformes de streaming et les clips vidéo). Tous les masters sont certifiés Apple Digital Masters.",
      description1_2: "> jusqu'à 192 kHz / 24 bits.",
      title2: "mastering vinyle",
      description2:
        "adaptation des masters pour le pressage vinyle. Fichiers audio .WAV / 24 bits, fournis avec une Cue sheet PDF. Application des traitements spécifiques au vinyle si l'usine de pressage le demande.",
      title3: "mastering CD",
      description3:
        "fichier DDP pour pressage CD : incluant les métadonnées, CD text, ISRC, UPC...",
      title4: "dolby Atmos",
      description4:
        "réinventez l'expérience d'écoute grâce à notre expertise en mastering Dolby Atmos. Un son immersif, optimisé pour toutes les plateformes de streaming compatibles.",
    },
  },
  contact: {
    title: "contact.",
    description: "Contactez-nous pour vos projets de mastering.",
    ctaTitle1: "discutons de",
    ctaTitle2: "votre projet.",
    form: {
      sections: {
        yourInfo: "coordonnées",
        projectInfo: "projet",
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
        indie: "indépendant",
        label: "label",
      },
      send: "envoyer",
      sending: "envoi en cours...",
      allInfoChecked: "toutes les informations sont vérifiées",
      requiredNote: "les champs marqués d'un * sont obligatoires.",
      successMessage: "message envoyé avec succès.",
      backToHome: "retour à l'accueil",
      termsAndConditions: {
        text: "vous acceptez les",
        link: "conditions générales",
        suffix: "du studio lors de l'envoi de fichiers.",
      },
      validation: {
        nameRequired: "Le prénom est obligatoire",
        familyNameRequired: "Le nom est obligatoire",
        emailRequired: "L'email est obligatoire",
        emailInvalid: "Veuillez entrer une adresse email valide",
        phoneRequired: "Le numéro de téléphone est obligatoire",
        messageRequired: "Le message est obligatoire",
        termsRequired: "Vous devez accepter les conditions générales",
        captchaRequired: "Veuillez valider le captcha avant d'envoyer",
        allInfoCheckedRequired:
          "veuillez confirmer que toutes les informations sont vérifiées",
        submitError: "Une erreur s'est produite. Veuillez réessayer.",
        submitSuccess: "Votre message a été envoyé avec succès !",
      },
    },
  },
  footer: {
    legalnotice: "mentions Légales",
    terms: "CGV",
    faq: "FAQ",
  },
  notFound: {
    oops: "Oops...",
    error: "erreur, réessayez",
    backHome: "retour à l'accueil",
  },
  termsAndConditions: {
    title: "conditions générales.",
    illustrationTitle1: "les bases d'une",
    illustrationTitle2: "relation saine.",
    tabs: {
      ratesPayments: "tarifs & paiements",
      revisionsVersions: "révisions & versions",
      dataFiles: "gestion des données",
    },
  },
  legalNotice: {
    title: "mentions légales.",
    illustrationTitle1: "pour les plus",
    illustrationTitle2: "curieux.",
    tabs: {
      website: "site web",
      masteredbyedouard: "masteredbyedouard",
      thanks: "merci",
    },
  },
  faq: {
    title: "FAQ.",
    illustrationTitle1: "la réponse à presque",
    illustrationTitle2: "toutes vos questions.",
  },
  landscapeWarning: {
    message: "Veuillez tourner votre appareil en mode portrait",
  },
};
