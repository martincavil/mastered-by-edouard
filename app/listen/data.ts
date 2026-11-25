/**
 * /listen content, hard-coded.
 * Images live in /public/images/listen/artists and /public/images/listen/covers.
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

// For now: the 20 artists ticked "featured" in Sanity (photo + Qobuz link).
// TODO: replace with the final list
export const artists: ListenArtist[] = [
  { name: "CECILIA PASCAL", photo: "https://www.dropbox.com/scl/fi/u4a9410dfh2e7xdkz0ugx/cecilia-pascal.webp?rlkey=dx96syhvx0gtb5w7a823oqwrh&st=ccs33191&dl=1", qobuz: "https://www.qobuz.com/fr-fr/interpreter/cecilia-pascal/1023181" },
  { name: "ANNA KOVA", photo: "https://www.dropbox.com/scl/fi/mif851gzl3s7kl2v5n0i4/anna-kova.webp?rlkey=rgoywvtnjxl87yy7tiz5zq54h&st=g6kjwv4h&dl=1", qobuz: "https://www.qobuz.com/fr-fr/interpreter/anna-kova/2194372" },
  { name: "AYA NAKAMURA", photo: "https://www.dropbox.com/scl/fi/p2ksz2zy8sanp2yjjtu4y/aya-nakamura.webp?rlkey=7h3rxwfq5p05ccm6mzgijzn8b&st=1r9w3lqy&dl=1", qobuz: "https://www.qobuz.com/fr-fr/interpreter/aya-nakamura/2434631" },
  { name: "BRASS", photo: "https://www.dropbox.com/scl/fi/53tfd9ug9ktubr5miitei/brass.webp?rlkey=zbxrzuss18mw5y8mousseeahu&st=pmg0totd&dl=1", qobuz: "https://www.qobuz.com/fr-fr/interpreter/brass/125761" },
  { name: "CALEMA", photo: "https://www.dropbox.com/scl/fi/ie3gxvh2ve050tscsx51h/calema.webp?rlkey=xqxdypld6ozjbyg7yrggybelx&st=9gkn4u02&dl=1", qobuz: "https://www.qobuz.com/fr-fr/interpreter/calema/698033" },
  { name: "C-ROM", photo: "https://www.dropbox.com/scl/fi/ac2nnutqu7isjnkvq2349/c-rom.webp?rlkey=4qvqx9buzpy0d79yh0xun6aeo&st=ae5ow28t&dl=1", qobuz: "https://www.qobuz.com/fr-fr/interpreter/c-rom/1431366" },
  { name: "DE FLEUR", photo: "https://www.dropbox.com/scl/fi/0fh06pav3k83vz0wtv34u/de-fleur.webp?rlkey=8r1djykec06ctkiavsjftdwsj&st=lnd3y7dm&dl=1", qobuz: "https://www.qobuz.com/fr-fr/interpreter/de-fleur/17372250" },
  { name: "FALLON", photo: undefined, qobuz: "https://www.qobuz.com/fr-fr/interpreter/fallon/1170727" },
  { name: "FYURA", photo: "https://www.dropbox.com/scl/fi/zhlqzfbd0j4beoky01o9t/fyura.png?rlkey=mzlu2eybyteggrr9vynkc5dfr&st=cxoo5sdn&dl=1", qobuz: "https://www.qobuz.com/fr-fr/interpreter/fyura/26119811" },
  { name: "HANNA", photo: "https://www.dropbox.com/scl/fi/c3u2y3vqk3cboe7y51n7d/hanna.webp?rlkey=4lg3d3rsl8ris1aun2uk63q0s&st=j4d2x907&dl=1", qobuz: "https://www.qobuz.com/fr-fr/interpreter/hanna/25571" },
  { name: "JOE LA PANIC", photo: "https://www.dropbox.com/scl/fi/5sopw5ufejjjlihfnynxj/joe-la-panic.webp?rlkey=18eu09ie8sojlcyciggr50j3l&st=xgevz1xq&dl=1", qobuz: "https://www.qobuz.com/fr-fr/interpreter/joe-la-panic/13141049" },
  { name: "JOWEE OMICIL", photo: "https://www.dropbox.com/scl/fi/6bq8v40vkqlo0jcm9dvkx/jowee-omicil.webp?rlkey=3ypz8dr5yvipx7fcn0f4i6oqp&st=f14jmgtr&dl=1", qobuz: "https://www.qobuz.com/fr-fr/interpreter/jowee-omicil/975868" },
  { name: "LADY O", photo: "https://www.dropbox.com/scl/fi/3r38by6hyakbjnzh3na9c/lady-o.png?rlkey=x7f948rfc2sr5tgd5gm0r098s&st=d9xly7ne&dl=1", qobuz: "https://www.qobuz.com/fr-fr/interpreter/lady-o-1/2706824" },
  { name: "LÉ WILL & DEUSPI", photo: "https://www.dropbox.com/scl/fi/2gbyau65apywjdgtpbezd/le-will-deuspi.webp?rlkey=adtg80fyfyc132pg4eu3966m4&st=mfr6p4lm&dl=1", qobuz: "https://www.qobuz.com/fr-fr/interpreter/le-will--deuspi/9484927" },
  { name: "MAUREEN", photo: "https://www.dropbox.com/scl/fi/blgqwsk86utsavh2e2s3x/maureen.webp?rlkey=ytjpvooqj099z65o8w41z5y2w&st=t3ipzqsd&dl=1", qobuz: "https://www.qobuz.com/fr-fr/interpreter/maureen/729592" },
  { name: "MOEUN", photo: "https://www.dropbox.com/scl/fi/pajven7t1ijw3zad2rq70/moeun.png?rlkey=ap0ozll9fhqqy1ml5v7bzof58&st=378oqi7i&dl=1", qobuz: "https://www.qobuz.com/fr-fr/interpreter/moeun-10003258420/3258420" },
  { name: "N'KEN", photo: "https://www.dropbox.com/scl/fi/xf4tgos84rx2tkb6ye49k/nken.webp?rlkey=vl8li09zod22r24x85peh2o89&st=okopt0he&dl=1", qobuz: "https://www.qobuz.com/fr-fr/interpreter/n-ken/1235752" },
  { name: "RUNG HYANG", photo: "https://www.dropbox.com/scl/fi/anyo7cqh6eykgkmn5ijkc/rung-hyang.webp?rlkey=srqe7hduizjxqfynohyzypg9i&st=20gxe7jx&dl=1", qobuz: "https://www.qobuz.com/fr-fr/interpreter/runghyang-10003404421/3404421" },
  { name: "STANISLAS", photo: "https://www.dropbox.com/scl/fi/kzx1jfzq90xot6fnf3jhi/stanislas.webp?rlkey=xgr5s1td6cx2pkt5ldbcvh8o5&st=m74mlj24&dl=1", qobuz: "https://www.qobuz.com/fr-fr/interpreter/stanislas/35268" },
  { name: "XIXI", photo: "https://www.dropbox.com/scl/fi/4ukatt8x0lsdyqzlnmk6m/xixi.webp?rlkey=vqwfbsd55we41kxl44xtjhtj4&st=j8zn0nfs&dl=1", qobuz: "https://www.qobuz.com/fr-fr/interpreter/xixi-10003683326/3683326" },
];

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
    artist: "KOKO, Nayla",
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
];
