import type { StudioPage } from "./queries";

// Backup of the studio page content, used whenever Sanity has no
// "studioPage" document yet (or can't be reached), so the page never
// shows blank/missing content if the CMS is ever discontinued.
export const studioFallback: StudioPage = {
  tabs: {
    edouardLabel: { fr: "edouard", en: "edouard" },
    friendsLabel: { fr: "amis", en: "friends" },
    servicesLabel: { fr: "services", en: "services" },
    gearLabel: { fr: "matériel", en: "gear" },
  },
  edouard: {
    title: {
      fr: "rencontrez votre ingénieur mastering.",
      en: "meet your engineer.",
    },
    description1: {
      fr: "Salut. Je suis Edouard, ingénieur de mastering basé à Paris. Pour moi, le mastering ne se résume pas à une simple étape technique ; c'est avant tout une histoire de confiance et de lien humain. J'aime que les choses soient claires, organisées et fiables, afin que les artistes puissent aborder cette ultime étape de leur production avec sérénité et précision.",
      en: "Hey. I'm Edouard, a french mastering engineer based in Paris. For me, mastering is not just a technical step, it's about trust and connection. I like things to be clear, organised, and efficient, so artists can feel confident that the final step of their production will be smooth and precise.",
    },
    description2: {
      fr: "Ce qui me motive vraiment, c'est l'aspect humain : les conversations, les échanges culturels et la passion partagée pour le son. Au cours des dernières années, j'ai eu la chance de masteriser plus d'un millier de chansons pour des artistes du monde entier, atteignant même la certification de disque de diamant.",
      en: "What truly drives me is the human side : the conversations, the cultural exchange, and the shared passion for sound. Over the past years, I've had the chance to master more than a thousand songs for artists from every corner of the world, and even reach diamond record certification along the way. ",
    },
    fullDiscography: {
      fr: "voir toute la discographie",
      en: "view full discography",
    },
    portraitImage:
      "https://www.dropbox.com/scl/fi/fzai5bqsviinr8vqpsdrd/studio-edouard.webp?rlkey=cz8rnatvwo2l1lsvcn3qvlb0d&st=9ocuexs9&dl=1",
    signatureImage:
      "https://www.dropbox.com/scl/fi/03lgwozq7qis2g33xw8dr/edouard-signature.webp?rlkey=wj49avq2pcr32v9na2awx5gag&st=a02agqrd&dl=1",
  },
  friends: {
    title1: {
      fr: "la musique doit être partagée",
      en: "music has to be shared.",
    },
    description1: {
      fr: "Pour moi, tout est question de connexions, d'histoires, de cultures et de rencontres. Je me sens chanceux de collaborer avec des artistes et des ingénieurs venant des quatre coins du monde.",
      en: "It's about people, stories, and cultures connecting. I feel lucky to already work with artists and engineers from so many different places: Japan, Belgium, South Africa, Argentina, and beyond.",
    },
    description2: {
      fr: "Chaque projet est un dialogue, un croisement d'identités qui donne naissance à quelque chose d'unique. C'est ça l'essence de la musique : un langage que nous parlons tous différemment, mais qui finit par tous nous rassembler.",
      en: "Every project is a dialogue, a mix of identities that creates something unique. That's what music really is to me: a language we all speak differently, that brings us together.",
    },
    title2: {
      fr: "collaboration et confiance.",
      en: "connection and trust.",
    },
    description3: {
      fr: "Voici quelques-uns des partenariats qui se sont construits au fil des années :",
      en: "Here are some of the following partnership grown years after years:",
    },
    labelsRow1Image:
      "https://www.dropbox.com/scl/fi/s6s3p9arc8k0846cab6lu/labels-row-1.webp?rlkey=nl2rtyjhuw3shpsiornj3vw0g&st=bqwmb8fb&dl=1",
    labelsRow2Image:
      "https://www.dropbox.com/scl/fi/bxzpk22lz8v3wcbdk0rjz/labels-row-2.webp?rlkey=s9igyt1ir99jvgru9syhj2e73&st=ectkktz4&dl=1",
  },
  services: [
    {
      title: { fr: "mastering digital", en: "digital mastering" },
      description: {
        fr: "fichier master haute résolution (pour les plateformes de streaming et les clips vidéo). Tous les masters sont certifiés Apple Digital Masters.",
        en: "Hi-resolution digital master file (for digital streaming platforms and video clip). All masters are Apple Digital Masters certified.",
      },
      description2: {
        fr: "> jusqu'à 192 kHz / 24 bits.",
        en: "> up to 192kHz/24-bit.",
      },
      logo: "https://www.dropbox.com/scl/fi/74lzu7bxk5xcirokpbqk6/adm.webp?rlkey=v52dklfrntt9zme4u3m3yclj7&st=e1xvcw0v&dl=1",
    },
    {
      title: { fr: "mastering vinyle", en: "vinyl mastering" },
      description: {
        fr: "adaptation des masters pour le pressage vinyle. Fichiers audio .WAV / 24 bits, fournis avec une Cue sheet PDF. Application des traitements spécifiques au vinyle si l'usine de pressage le demande.",
        en: "24-bit WAV masters per side of vinyl with a cue sheet PDF. Vinyl-specific processing applied if requested by the pressing plant",
      },
    },
    {
      title: { fr: "mastering CD", en: "cd mastering" },
      description: {
        fr: "fichier DDP pour pressage CD : incluant les métadonnées, CD text, ISRC, UPC...",
        en: "DDP files, including CD text, ISRC, UPC codes to be used by the CD mastering plant.",
      },
    },
    {
      title: { fr: "dolby Atmos", en: "dolby atmos" },
      description: {
        fr: "réinventez l'expérience d'écoute grâce à notre expertise en mastering Dolby Atmos. Un son immersif, optimisé pour toutes les plateformes de streaming compatibles.",
        en: "Redefine the listening experience with our expert Dolby Atmos mastering. Optimized for compatible streaming platforms. ",
      },
      logo: "https://www.dropbox.com/scl/fi/vaglz4cz0507pgnjlbghi/dolby.webp?rlkey=wpz3hcqkllvyb9c48fd5xwh7v&st=h1nj5xfg&dl=1",
    },
  ],
  servicesImage:
    "https://www.dropbox.com/scl/fi/40tprumg74yj867w8n0jp/services.jpg?rlkey=g8xedvw29i9zmyfz5urc6r0xf&st=fzz76cb6&dl=1",
  gear: {
    monitoring: {
      fr: "ATC SCM50a SL, TRINNOV NOVA, SPL DMC, Ollo audio S4x, APPLE AIRPODS MAX, GIK acoustics",
      en: "ATC SCM50a SL, TRINNOV NOVA, SPL DMC, Ollo audio S4x, APPLE AIRPODS MAX, GIK acoustics",
    },
    hardware: {
      fr: "SPL PQ MASTERING, NEVE MASTER BUSS PROCESSOR, DANGEROUS BAX EQ, SPL Gemini",
      en: "SPL PQ MASTERING, NEVE MASTER BUSS PROCESSOR, DANGEROUS BAX EQ, SPL Gemini",
    },
    converter: {
      fr: "Grimm UC1, Lavry Savitr",
      en: "Grimm UC1, Lavry Savitr",
    },
    software: {
      fr: "AVID Protools, iZotope, Fabfilter, TOKYO DAWN LAB, SOFTUBE...",
      en: "AVID Protools, iZotope, Fabfilter, TOKYO DAWN LAB, SOFTUBE...",
    },
    images: [
      "https://www.dropbox.com/scl/fi/sjaumbxdnxdafx11poetr/gear-1.jpg?rlkey=4p854nu7cqx5un5azkm1q2j5v&st=spxmuat5&dl=1",
      "https://www.dropbox.com/scl/fi/rln1ujibt3wlzpdxep19i/gear-2.jpg?rlkey=aqrbj3dul11zlunxxt9jkotqj&st=zg6k8o76&dl=1",
      "https://www.dropbox.com/scl/fi/s8bm4eulq5k62ve4e84y5/gear-3.jpg?rlkey=of8tcxos22nya48t3igs3uxhi&st=op83y5n9&dl=1",
      "https://www.dropbox.com/scl/fi/egx642fdc5efdth7gdwal/gear-4.jpg?rlkey=ohmg198ufr1xzgpvi8p8jt2x5&st=anc9zspw&dl=1",
      "https://www.dropbox.com/scl/fi/kb8xar99b2a8saff0hmzh/gear-5.jpg?rlkey=29fkfvl3wd6gy70ko8n2yeo35&st=25vgtmud&dl=1",
      "https://www.dropbox.com/scl/fi/ppqsb4u5775tuadudjkg6/gear-6.jpg?rlkey=3u1jg5tcxwwzumwujmx4ed5t2&st=3pk1vo2w&dl=1",
    ],
  },
};
