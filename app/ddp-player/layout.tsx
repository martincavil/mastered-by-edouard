import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "lecteur DDP en ligne",
  description:
    "Lecteur DDP gratuit en ligne : écoutez votre master CD, vérifiez CD-Text, ISRC, codes PQ et somme MD5. Tout se passe dans votre navigateur, aucun fichier n'est envoyé.",
  alternates: { canonical: "/ddp-player" },
  openGraph: {
    title: "Lecteur DDP en ligne | mastered by edouard",
    description:
      "Écoutez et vérifiez votre master DDP dans le navigateur : pistes, CD-Text, ISRC, PQ, MD5. 100 % local.",
    url: "https://masteredbyedouard.com/ddp-player",
  },
};

export default function DdpPlayerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
