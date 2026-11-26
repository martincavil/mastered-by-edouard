/**
 * /listen content. The name drop comes from Sanity (artists);
 * the selected work is hard-coded here, covers in /public/images/listen/covers.
 */

export interface ListenArtist {
  name: string;
  /** Photo shown on hover, e.g. "/images/listen/artists/koko.webp" */
  photo?: string;
  /** Qobuz artist page */
  qobuz?: string;
}

export interface SelectedWork {
  artist: string;
  title: string;
  /** e.g. "/images/listen/covers/maureen-queen.webp" */
  cover?: string;
  /** What Edouard did, one line each, e.g. ["stereo mastering", "digital - CD"] */
  services: string[];
}

// Selected work, in Edouard's order (even = left column, odd = right column)
export const selectedWorks: SelectedWork[] = [
  {
    artist: "XIXI",
    title: "Blue Border",
    cover: "/images/listen/covers/xixi-blue-border.webp",
    services: ["album mastering", "streaming - vinyl"],
  },
  {
    artist: "C-ROM",
    title: "Je pars et reviens",
    cover: "/images/listen/covers/c-rom-je-pars-et-reviens.webp",
    services: ["single mastering", "streaming"],
  },
  {
    artist: "Joe La Panic",
    title: "Tendresse",
    cover: "/images/listen/covers/joe-la-panic-tendresse.webp",
    services: ["EP mastering", "streaming"],
  },
  {
    artist: "Antes & Madzes",
    title: "Merci de rien 2",
    cover: "/images/listen/covers/antes-madzes-merci-de-rien-2.webp",
    services: ["EP mastering", "streaming - CD - vinyl"],
  },
  {
    artist: "Fallon",
    title: "Winter Princess",
    cover: "/images/listen/covers/fallon-winter-princess.webp",
    services: ["EP mastering", "streaming"],
  },
  {
    artist: "Maureen",
    title: "QUEEN",
    cover: "/images/listen/covers/maureen-queen.webp",
    services: ["album mastering", "streaming - CD"],
  },
  {
    artist: "Lakna",
    title: "Kiwi avec la peau",
    cover: "/images/listen/covers/lakna-kiwi-avec-la-peau.webp",
    services: ["album mastering", "vinyl"],
  },
  {
    artist: "Trinix, Aya Nakamura, Corneille",
    title: "Avec classe",
    cover: "/images/listen/covers/trinix-aya-nakamura-corneille-avec-classe.webp",
    services: ["single mastering", "streaming"],
  },
  {
    artist: "KOKO, Nayra",
    title: "Fais-le",
    cover: "/images/listen/covers/koko-nayla-fais-le.webp",
    services: ["single mastering", "streaming"],
  },
  {
    artist: "William",
    title: "Logo+Scar",
    cover: "/images/listen/covers/william-logo-scar.webp",
    services: ["single mastering", "streaming"],
  },
  {
    artist: "Jowee Omicil",
    title: "sMiLes",
    cover: "/images/listen/covers/jowee-omicil-smiles.webp",
    services: ["album mastering", "streaming - vinyl"],
  },
  {
    artist: "poissonchat, lushe, stanislas",
    title: "TU DEVIENS QUOI EN CE MOMENT ?",
    cover: "/images/listen/covers/poissonchat-lushe-stanislas-tu-deviens-quoi.webp",
    services: ["single mastering", "streaming"],
  },
  {
    artist: "Malter",
    title: "petit-moi",
    cover: "/images/listen/covers/malter-petit-moi.webp",
    services: ["EP mastering", "vinyl"],
  },
  {
    artist: "Yambow, Implicit",
    title: "Just in case",
    cover: "/images/listen/covers/yambow-implicit-just-in-case.webp",
    services: ["EP mastering", "streaming"],
  },
];
