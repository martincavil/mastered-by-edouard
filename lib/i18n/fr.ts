import { Translations } from "./types";

export const fr: Translations = {
  common: {
    title: "mastered by edouard - studio de mastering professionnel",
    description: "Services de mastering audio professionnels en France et dans le monde",
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
      namingTooltipTitle: "organisation des dossiers",
      namingTooltipHints: [
        ". vos fichiers seront organisés dans un dossier nommé : nom_artiste-timestamp",
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
    },
    prepareFiles: {
      headline1: "le mastering",
      headline2: "commence par un bon mix.",
      uploadFiles: "envoyer des fichiers",
      step1Title: "le mix.",
      step1Content: {
        step1Content1:
          "veillez à la propreté du signal : aucun clic, bruit de fond ou artefact. Soignez l'entrée et la sortie de la piste ; évitez les coupures trop brutales (ou cut trop secs).",
        step1Content2:
          " le niveau de True Peak (TP) n'a pas vraiment d'importance dans le monde numérique, qu'il soit à -0,1 ou -6, tant que le son ne sature pas ! Évitez simplement les crêtes et les distorsions.",
        step1Content3:
          "le mix, c'est LE MIX : merci de conserver tous vos traitements sur le bus de mixage (y compris les limiteurs et les clippers).",
      },
      step2Title: "l'export.",
      step2Content: {
        step2Content1:
          "si vous ne pouvez pas exporter en 32-bit float, le 24-bit reste excellent. Essayez d'éviter d'exporter en 16-bit, surtout si vos niveaux de crête sont assez bas.",
        step2Content2:
          "c'est très simple... la fréquence d'échantillonnage (sample rate) doit rester la même que celle utilisée pendant le mixage.",
        step2Content3: "Les fichiers doivent être exportés au format .WAV ou .AIF.",
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
        step4Content2: "cependant, le stem mastering peut être utilisé dans certains cas particuliers.",
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
      title: "rencontrez votre ingénieur du son.",
      description1:
        "Salut. Je suis Edouard, ingénieur de mastering basé à Paris. Pour moi, le mastering ne se résume pas à une simple étape technique ; c'est avant tout une histoire de confiance et de lien humain. J'aime que les choses soient claires, organisées et fiables, afin que les artistes puissent aborder cette ultime étape de leur production avec sérénité et précision.",
      description2:
        "Ce qui me motive vraiment, c'est l'aspect humain : les conversations, les échanges culturels et la passion partagée pour le son. Au cours des dernières années, j'ai eu la chance de masteriser plus d'un millier de chansons pour des artistes du monde entier, atteignant même la certification de disque de diamant.",
      fullDiscography: "voir toute la discographie",
    },
    friends: {
      title1: "la musique doit être partagée",
      description1:
        "Pour moi, tout est question de connexions, d’histoires et de rencontres culturelles. Je me sens chanceux de collaborer avec des artistes et des ingénieurs venant d'horizons aussi variés que le Japon, la Belgique, l’Afrique du Sud, l’Argentine et bien d’autres pays encore.",
      description2:
        "Chaque projet est un dialogue, un croisement d'identités qui donne naissance à quelque chose d'unique. Pour moi, c'est ça l'essence de la musique : un langage que nous parlons tous avec nos propres accents, mais qui finit toujours par nous rassembler.",
      title2: "collaboration et confiance.",
      description3:
        "C’est une aventure humaine, mais c'est aussi une histoire de collaboration et de travail d'équipe ! Voici quelques-uns des partenariats qui se sont construits au fil des années :",
    },
    services: {
      title1: "mastering digital",
      description1:
        "fichier master haute résolution (pour les plateformes de streaming et les clips vidéo). Tous les masters sont certifiés Apple Digital Masters. Masters jusqu'à 192 kHz / 24 bits.",
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
    error: "erreur, réessayez",
    backHome: "retour à l'accueil",
  },
  termsAndConditions: {
    title: "conditions générales.",
    illustrationTitle1: "pour une relation",
    illustrationTitle2: "des plus saines.",
    tabs: {
      ratesPayments: "tarifs & paiements",
      revisionsVersions: "révisions & versions",
      dataFiles: "gestion des données",
    },
    ratesPayments: {
      quotationTitle: "devis et tarifs : ",
      quotationContent:
        "Tous les prix sont communiqués sur demande et confirmés avant le début de tout service. LA confirmation peut s'effectuer sur devis : le devis est alors valable 30 jours à compter de sa date d'émission.",
      adjustmentsTitle: "ajustements de prix : ",
      adjustmentsContent:
        "Si l'étendue du travail change significativement par rapport au devis initial (ex. : nombre de morceaux, durée, services additionnels), un devis révisé sera fourni et devra être approuvé avant de continuer.",
      paymentTitle: "conditions et méthodes de paiement : ",
      paymentContent:
        "Le paiement est dû à la fin du service de mastering, à la validation des fichiers finaux.",
      paymentContent2:
        "Les factures peuvent être réglées par les moyens suivants : transfert de banque (SEPA & SWIFT), Wise Transfer ou paiement par CB en ligne.",
    },
    revisionsVersions: {
      includedTitle: "révisions : ",
      includedContent:
        "Voici mon approche concernant les révisions : parce que la satisfaction de l'artiste prime sur l'immédiateté du résultat, je ne facture pas les retouches. En règle générale, le tarif inclut autant de modifications que nécessaire — et dans 99 % des cas, une ou deux versions suffisent !",
      newMixTitle: "envoi d'un nouveau mix : ",
      newMixContent:
        "Si un nouveau mix est fourni après le début du processus de mastering, il sera traité comme un nouveau projet et facturé en conséquence, sauf accord préalable.",
      additionalTitle: "versions supplémentaires : ",
      additionalContent:
        "Les versions alternatives (instrumentale, TV mix, radio edit, etc.) peuvent être masterisées si elles sont demandées. Elles feront l'objet d'un surcoût.",
      masterRequestsTitle: "masters supplémentaires : ",
      masterRequestsContent:
        "Toute demande de masters supplémentaires après la fin du projet (ex. : mastering vinyle après livraison du master numérique) fera l'objet d'un devis séparé.",
    },
    dataFiles: {
      transferTitle: "transfert de fichiers : ",
      transferContent:
        "u studio, nous croyons fermement à l'importance d'une interface unique pour simplifier la vie de chacun, le tout de manière fiable et sécurisée. C'est pourquoi tous les transferts de fichiers (envois comme réceptions) passent exclusivement par Dropbox.	",
      retentionTitle: "conservation des données : ",
      retentionContent:
        "Les sessions et les fichiers associés seront archivés pour une période de 2 ans à compter de la date de livraison finale. Passé ce délai, seul le fichier master sera conservé. La durée de conservation des masters est, quant à elle, indéterminée.",
      securityTitle: "sécurité et confidentialité : ",
      securityContent:
        "Mastered by Edouard garantit la confidentialité et la sécurité de tous les fichiers clients. Nous ne partageons ni ne diffusons aucune donnée sans votre consentement explicite.",
      finalNote:
        "La confidentialité est une valeur fondamentale pour tout studio de mastering digne de ce nom. Fidèle à ce principe, aucun projet traité au studio — même en l'absence de NDA signé — ne sera jamais divulgué ou partagé avec qui que ce soit, en dehors des personnes directement impliquées dans le processus.",
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
    website: {
      creditsDesign:
        "Logo, web design & illustrations : valentinegrasphisme et edouard carbonne",
      webHosting: "hébergement web : Vercel",
      creditsDevelopmentAuthor: "développement web par Martin Cavil",
      creditsPhotographyAuthor: "Photos par Théo Burette",
    },
    masteredByEdouard: {
      companyName:
        "Mastered by Edouard est une société à responsabilité limité (SARL).",
      startCapital: "Capital social : 700 euros]",
      siretNumber: "Numéro SIRET : 948 971 569 00017",
      vatNumber: "Numéro de TVA : FR27948971569",
      rcsNumber: "Numéro RCS : Nanterre B 948 971 569",
      companyManager: "Dirigeant : Edouard Carbonne",
      contactTitle: "Contact",
    },
    thanks: {
      description1:
        "Mastered by Edouard ne serait rien sans les amis, ingénieurs et artistes incroyables que j'ai rencontrés tout au long de ce parcours.",
      description2:
        "Des remerciements tout particulier aux personnes suivantes qui m'ont permis d'en arriver là aujourd'hui : Pierre Ottway, Jowee Omicil, Jordan Kouby, Grégory Germain, Frédéric Perrin, Eric Perez-Björkman, Fabio Morgado, Antoine Castaldi, Fred Vectol, Alexis Cayrouse, Elliott Bastide, Joachim Mike, Nathan Cocherie, Théo Burette, Valentine Gras, ma famille, et toutes les autres personnes qui se sont impliqués d'une manière ou d'une autre dans ce projet. ",
      thankYou: "Merci !",
    },
  },
  faq: {
    title: "FAQ.",
    illustrationTitle1: "la réponse à presque",
    illustrationTitle2: "toutes vos questions.",
    questions: {
      question1: "1. qu'est-ce que le mastering ?",
      answer1:
        "C'est l'étape finale du processus de production musicale. Les principaux objectifs du mastering sont de garantir un son cohérent, équilibré et homogène sur tous les systèmes d'écoute, tout en optimisant ses caractéristiques sonores globales.",
      question2: "2. Qu'est-ce que l'Apple Digital Masters ?",
      answer2:
        "Apple Digital Masters (ADM) est une programme introduit par Apple qui a pour but de garatnir la qualité des fichiers musicaux accessibles sur Apple Music. Le studio est certifié ADM, il vous suffit simplement de transmettre les coordonnées suivantes au distributeur lors de l'upload :",
      answer2Credits: {
        engineerName: "Nom de l'ingénieur",
        engineerValue: "Edouard Carbonne",
        studioName: "Nom du studio",
        studioValue: "Mastered by Edouard",
        email: "Email",
        emailValue: "contact@masteredbyedouard.com",
      },
      question3: "3. pourquoi le mastering à l'ère de l'I.A ? ",
      answer3:
        "« Nous vivons une époque incroyable où l'IA permet, c'est certain, d'obtenir des résultats impressionnants ! Mais le rôle de l'ingénieur de mastering ne se limite pas à fournir des outils : il apporte une oreille humaine et son expérience ! Travailler avec un ingénieur permet une communication directe, des échanges constructifs et une vraie collaboration, garantissant ainsi le respect total de la vision et des attentes de l'artiste. Au final, tout est une question de lien humain et de confiance !",
      question4: "4. le studio propose-t-il de mastering CD / vinyle ?",
      answer4:
        "la réponse est simple : oui !",
      question5: "5. quels sont les délais de livraison ?",
      answer5:
        "Les délais varient naturellement selon la nature du projet. Pour un single, le délai de livraison standard est d'environ un à trois jours ouvrés. Pour les projets plus conséquents (EPs ou Albums), les délais vous seront communiqués une fois l'ampleur du projet définie.",
      question6: "6. mastered by Edouard : logo, identité ",
      answer6:
        "Passionné par le design et l'expérience utilisateur, j'apporte un soin tout particulier à l'identité visuelle et créative du studio. C'est pourquoi je veille à maintenir une image cohérente sur tous les supports : site web, réseaux sociaux et emails. Quant au logo… oui, il a bien une signification ! La voici :",
    },
  },
};
