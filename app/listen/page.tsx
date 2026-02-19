"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { PageTransition } from "@/components/page-transition";
import { Footer } from "@/components/footer";
import { Button } from "@/components/button";
import { ArrowUpRight } from "@/components/icons/ArrowUpRight";

// Strapi temporairement commenté
// import { getArtists, getStrapiImageUrl } from "@/lib/strapi/api";
// import { Artist } from "@/lib/strapi/types";
import artistsData from "@/data/artists.json";
import "../navigation-link.css";

interface Artist {
  id: number;
  name: string;
  picture: string;
  link: string;
}

export default function ListenPage() {
  const t = useTranslations();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Tous les artistes du JSON pour la liste des noms
  const allArtists: Artist[] = useMemo(() => artistsData, []);

  // Liste des artistes à afficher en images (avec leurs noms exacts du JSON)
  const artistsToDisplay = [
    "ANNA KOVA",
    "AYA NAKAMURA",
    "BRASS",
    "C-ROM",
    "CALEMA",
    "CAMILLE ENO",
    "CECILIA PASCAL",
    "DE FLEUR",
    "FULL GREEN",
    "FYURA",
    "HANNA",
    "JOE LA PANIC",
    "JOWEE OMICIL",
    "LADY O",
    "LÉ WILL & DEUSPI",
    "LÉONIE BARBOT",
    "MALTER",
    "MAUREEN",
    "MOEUN",
    "NAMANA",
    "NIICAP",
    "NUBE",
    "RUNG HYANG",
    "RYU JUNIOR",
    "SANTOS",
    "STANISLAS",
    "TIMOTHÉE PATH",
  ];

  // Filtrer les artistes qui ont une image valide et qui sont dans la liste
  const gridArtists: Artist[] = useMemo(
    () =>
      artistsData.filter(
        (artist) =>
          artistsToDisplay.includes(artist.name) &&
          artist.picture &&
          artist.picture.trim() !== "",
      ),
    [],
  );

  // Générer une grille en forme de losange (3-4-5-6-5-4-3)
  const artistPositions = useMemo(() => {
    const positions: {
      x: number;
      y: number;
      artist: Artist;
      size: number;
      row: number;
      col: number;
    }[] = [];

    // Tailles disponibles en pixels
    const sizes = [90];

    // Pattern de la grille (nombre d'images par ligne)
    const rowPattern = [3, 4, 5, 4, 3];
    const totalRows = rowPattern.length;

    let artistIndex = 0;

    rowPattern.forEach((itemsInRow, rowIndex) => {
      const yPosition = 10 + (rowIndex / (totalRows - 1)) * 85; // Répartir de 10% à 95%

      for (let col = 0; col < itemsInRow; col++) {
        if (artistIndex >= gridArtists.length) break;

        // Centrer chaque ligne
        const rowWidth = (itemsInRow - 1) * 16; // Espacement entre images
        const startX = 50 - rowWidth / 2;
        const xPosition = startX + col * 16;

        const size = sizes[sizes.length - 1];

        positions.push({
          x: xPosition,
          y: yPosition,
          artist: gridArtists[artistIndex],
          size,
          row: rowIndex,
          col,
        });

        artistIndex++;
      }
    });

    return positions;
  }, [gridArtists]);

  // Calculer la distance en pixels entre deux positions
  const calculatePixelDistance = (index1: number, index2: number) => {
    const pos1 = artistPositions[index1];
    const pos2 = artistPositions[index2];

    // Estimer les pixels basés sur une largeur de container de ~700px
    const containerSize = 700;
    const pixelX1 = (pos1.x / 100) * containerSize;
    const pixelY1 = (pos1.y / 100) * containerSize;
    const pixelX2 = (pos2.x / 100) * containerSize;
    const pixelY2 = (pos2.y / 100) * containerSize;

    return Math.sqrt(
      Math.pow(pixelX1 - pixelX2, 2) + Math.pow(pixelY1 - pixelY2, 2),
    );
  };

  // Calculer le scale et l'offset basé sur la distance en pixels
  const getTransformForDistance = (index: number, hoveredIdx: number) => {
    if (index === hoveredIdx) {
      return { scale: 1.45, offsetX: 0, offsetY: 0 }; // L'image hover grossit modérément
    }

    const distance = calculatePixelDistance(index, hoveredIdx);
    const proximityRadius = 160;

    if (distance > proximityRadius) {
      return { scale: 1, offsetX: 0, offsetY: 0 };
    }

    // Les images adjacentes rétrécissent (augmenté pour toucher l'image hover)
    const scale = 0.72;

    // Calculer le vecteur pour pousser l'image adjacente vers l'extérieur
    const pos1 = artistPositions[index];
    const pos2 = artistPositions[hoveredIdx];
    const containerSize = 700;

    const dx = ((pos1.x - pos2.x) / 100) * containerSize; // Inversé : de hover vers adjacente
    const dy = ((pos1.y - pos2.y) / 100) * containerSize;
    const currentDistance = Math.sqrt(dx * dx + dy * dy);

    // L'image hover grossit, donc elle "pousse" les adjacentes
    const baseSize = 90;
    const hoverExpansion = ((1.45 - 1) * baseSize) / 2; // Expansion du rayon : ~20.25px

    // Pousser l'image adjacente vers l'extérieur, mais moins que l'expansion complète
    // pour qu'elles touchent les autres images adjacentes sans se superposer
    const pushDistance = hoverExpansion * 0.5; // ~10px pour éviter le chevauchement

    const offsetX = (dx / currentDistance) * pushDistance;
    const offsetY = (dy / currentDistance) * pushDistance;

    return { scale, offsetX, offsetY };
  };

  const platforms = [
    {
      name: "apple music",
      url: "https://music.apple.com/fr/playlist/mastered-by-edouard/pl.u-MDAWkl3FG5bqDJ",
      icon: "/images/platforms/apple-music.svg",
    },
    {
      name: "spotify",
      url: "https://open.spotify.com/playlist/7fXjq8tKmUNAsN6D0VRgnb?si=TUP7CUAYR8KBLichWnUTZA",
      icon: "/images/platforms/spotify.svg",
    },
    {
      name: "deezer",
      url: "https://www.deezer.com/fr/playlist/8826952102?deferredFl=1&host=44690471",
      icon: "/images/platforms/deezer.svg",
    },
    {
      name: "tidal",
      url: "https://tidal.com/playlist/f14880a7-d8db-402f-8326-e8cb338e285d",
      icon: "/images/platforms/tidal.svg",
    },
  ];

  return (
    <>
      <PageTransition>
        <main className="h-full flex flex-col bg-black pb-8 md:pb-0 pt-8 md:pt-4 xl:pt-6 2xl:pt-8 px-8 overflow-hidden">
          <div className="flex-1 flex flex-col overflow-y-auto xl:overflow-y-visible">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 md:mb-3 xl:mb-5 2xl:mb-10">
              <h1 className="text-4xl md:text-5xl xl:text-6xl 2xl:text-[80px] font-bold text-white">
                {t.listen.title}
              </h1>
              {/* Close button */}
              <Link
                href="/"
                className="text-white hover:text-red transition-all hover:rotate-90 duration-300"
                aria-label="Retour à l'accueil"
              >
                <svg
                  className="w-10 h-10 md:w-12 md:h-12 xl:w-14 xl:h-14 2xl:w-[58px] 2xl:h-[58px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </Link>
            </div>
            {/* Streaming platforms links */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3 xl:gap-4 mb-5 md:mb-3 xl:mb-5 2xl:mb-10">
              {platforms.map((platform) => (
                <Link
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Button className="!py-1.5 !px-4 !border border-white rounded-full text-white hover:text-red transition-all duration-300">
                    {/* Mobile: Icon only */}
                    <div className="flex md:hidden items-center justify-center">
                      <Image
                        src={platform.icon}
                        alt={platform.name}
                        width={20}
                        height={20}
                        className="w-5 h-5 transition-all duration-300 group-hover:brightness-0"
                      />
                    </div>
                    {/* Desktop: Text + Arrow */}
                    <div className="hidden md:flex items-center gap-2 xl:gap-4">
                      <span className="text-xl md:text-lg lg:text-2xl xl:text-3xl font-extralight">
                        {platform.name}
                      </span>
                      <ArrowUpRight
                        size={24}
                        className="lg:w-5 lg:h-5"
                        strokeWidth={1.5}
                      />
                    </div>
                  </Button>
                </Link>
              ))}
            </div>
            {/* Content */}
            <div className="grid xl:grid-cols-2 gap-4">
              <div className="space-y-2 xl:space-y-4">
                <h2 className="text-3xl md:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-white">
                  {t.listen.subTitle}
                </h2>
                {/* Artists names from JSON */}
                <p className="text-lg md:text-xl 2xl:text-2xl font-light font-poppins uppercase !leading-7 text-red text-justify md:max-h-[250px] xl:max-h-[300px] 2xl:max-h-[350px] md:overflow-hidden">
                  {allArtists.map((artist, index) => (
                    <span key={artist.id}>
                      {artist.link ? (
                        <Link
                          href={artist.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors duration-300 hover:text-white cursor-pointer"
                        >
                          {artist.name}
                        </Link>
                      ) : (
                        <span className="cursor-default">{artist.name}</span>
                      )}
                      {index < allArtists.length - 1 ? ", " : "..."}
                    </span>
                  ))}
                </p>
                <div className="flex justify-center w-full mt-8 2xl:mt-10">
                  <Link
                    href="https://credits.muso.ai/profile/83085fe9-a37a-493e-b0ac-1a62bf76590f"
                    target="_blank"
                  >
                    <Button
                      bgColor="white"
                      textColor="black"
                      className="rounded-full !py-1.5 px-6 md:py-3 md:px-10 text-base md:text-lg xl:text-xl font-normal bg-white !text-black hover:bg-white/90"
                    >
                      {t.listen.fullDiscography}
                    </Button>
                  </Link>
                </div>
              </div>
              {/* Artists pictures - Constellation organique avec effet hover de proximité */}
              <div className="hidden xl:flex w-full justify-center relative">
                <div className="hidden md:block w-full relative h-[280px] lg:h-[320px] xl:h-[360px] 2xl:h-[400px]">
                  {artistPositions.map((position, index) => {
                    let scale = 1;
                    let offsetX = 0;
                    let offsetY = 0;
                    let zIndex = 1;

                    // Calculer le scale et l'offset basé sur la distance si une image est en hover
                    if (hoveredIndex !== null) {
                      const transform = getTransformForDistance(
                        index,
                        hoveredIndex,
                      );
                      scale = transform.scale;
                      offsetX = transform.offsetX;
                      offsetY = transform.offsetY;

                      if (index === hoveredIndex) {
                        zIndex = 20;
                      } else if (scale !== 1) {
                        zIndex = 5; // Images adjacentes
                      }
                    }

                    return (
                      <Link
                        key={position.artist.id}
                        href={position.artist.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute cursor-pointer"
                        style={{
                          left: `${position.x}%`,
                          top: `${position.y}%`,
                          width: `${position.size}px`,
                          height: `${position.size}px`,
                          transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(${scale})`,
                          zIndex: zIndex,
                          transition:
                            "transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        }}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        <Image
                          src={position.artist.picture}
                          alt={position.artist.name}
                          width={position.size}
                          height={position.size}
                          className="w-full h-full object-cover rounded-full shadow-lg hover:shadow-2xl"
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="mt-auto">
              <Footer color="white" />
            </div>
          </div>
        </main>
      </PageTransition>
    </>
  );
}
