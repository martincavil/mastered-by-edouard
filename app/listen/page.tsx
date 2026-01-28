"use client";

import { useState, useEffect } from "react";
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

const GRID_SIZE = 14; // Total d'images : 3 + 4 + 4 + 3

export default function ListenPage() {
  const t = useTranslations();
  // Filtrer les artistes qui ont une image valide
  const artists: Artist[] = artistsData.filter(
    (artist) => artist.picture && artist.picture.trim() !== "",
  );

  // Initialiser la grille avec des artistes aléatoires uniques
  const [imageGrid, setImageGrid] = useState<Artist[]>([]);
  const [fadingIndex, setFadingIndex] = useState<number | null>(null);

  useEffect(() => {
    // Initialiser la grille au montage avec des artistes uniques
    const shuffled = [...artists].sort(() => 1 - Math.random());
    const initialGrid = shuffled.slice(0, GRID_SIZE);
    setImageGrid(initialGrid);
  }, [artists]);

  useEffect(() => {
    if (imageGrid.length === 0) return;

    // Pour chaque image, créer une fonction récursive avec un délai aléatoire
    const timeouts: NodeJS.Timeout[] = [];

    const scheduleImageChange = (index: number, isFirstCall = false) => {
      // Pour le premier appel, ajouter un délai initial aléatoire pour étaler les changements
      const initialDelay = isFirstCall ? Math.random() * 5000 : 0;
      const randomDelay = Math.random() * 4000 + 3000; // Entre 3000ms et 7000ms
      const totalDelay = initialDelay + randomDelay;

      const timeout = setTimeout(() => {
        // Choisir un artiste aléatoire qui n'est pas déjà affiché
        setImageGrid((prevGrid) => {
          const currentIds = prevGrid.map((a) => a.id);
          const availableArtists = artists.filter(
            (a) => !currentIds.includes(a.id),
          );

          if (availableArtists.length > 0) {
            const randomArtist =
              availableArtists[
                Math.floor(Math.random() * availableArtists.length)
              ];

            // Étape 1: Fade out (500ms)
            setFadingIndex(index);

            // Étape 2: Changer l'image après le fade out
            setTimeout(() => {
              setImageGrid((grid) => {
                const newGrid = [...grid];
                newGrid[index] = randomArtist;
                return newGrid;
              });

              // Étape 3: Fade in (500ms) - petit délai pour laisser le DOM se mettre à jour
              setTimeout(() => {
                setFadingIndex(null);
              }, 50);
            }, 500);
          }

          return prevGrid;
        });

        // Reprogrammer le prochain changement avec un nouveau délai aléatoire
        scheduleImageChange(index, false);
      }, totalDelay);

      timeouts.push(timeout);
    };

    // Démarrer le cycle pour chaque image avec un délai initial
    imageGrid.forEach((_, index) => {
      scheduleImageChange(index, true);
    });

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [artists, imageGrid.length]);

  // Strapi fetch temporairement commenté
  // useEffect(() => {
  //   async function fetchArtists() {
  //     try {
  //       const data = await getArtists();
  //       setArtists(data);
  //     } catch (error) {
  //       console.error("Failed to fetch artists:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //
  //   fetchArtists();
  // }, []);

  const platforms = [
    {
      name: "apple music",
      url: "https://music.apple.com/fr/playlist/mastered-by-edouard/pl.u-MDAWkl3FG5bqDJ",
    },
    {
      name: "spotify",
      url: "https://open.spotify.com/playlist/7fXjq8tKmUNAsN6D0VRgnb?si=TUP7CUAYR8KBLichWnUTZA",
    },
    {
      name: "deezer",
      url: "https://www.deezer.com/fr/playlist/8826952102?deferredFl=1&host=44690471",
    },
    {
      name: "tidal",
      url: "https://tidal.com/playlist/f14880a7-d8db-402f-8326-e8cb338e285d",
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
            <div className="flex flex-wrap items-center gap-2 md:gap-3 xl:gap-4 mb-3 md:mb-3 xl:mb-5 2xl:mb-10">
              {platforms.map((platform) => (
                <Link
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="!py-1.5 !px-4 !border border-white rounded-full text-white hover:text-red transition-all duration-300">
                    <div className="flex items-center gap-2 xl:gap-4">
                      <span className="text-xl md:text-lg lg:text-2xl xl:text-3xl font-extralight">
                        {platform.name}
                      </span>
                      <ArrowUpRight
                        size={24}
                        className="xl:w-8 xl:h-8"
                        strokeWidth={2}
                      />
                    </div>
                  </Button>
                </Link>
              ))}
            </div>
            {/* Content */}
            <div className="grid md:grid-cols-2 md:gap-6 xl:gap-16 2xl:gap-16 flex-1">
              <div className="space-y-6 xl:space-y-4">
                <h2 className="text-3xl md:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-white">
                  {t.listen.subTitle}
                </h2>
                {/* Artists names from JSON */}
                <p className="text-lg md:text-xl xl:text-2xl font-light font-poppins uppercase !leading-6 text-red text-justify max-h-[200px] md:max-h-[250px] xl:max-h-[300px] 2xl:max-h-[350px] overflow-hidden">
                  {artists.map((artist, index) => (
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
                      {index < artists.length - 1 ? ", " : "..."}
                    </span>
                  ))}
                </p>
                <div className="flex justify-center w-full mt-6 xl:mt-8 2xl:mt-10">
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
              {/* Artists pictures - Grille avec animation de fondu */}
              <div className="hidden md:flex flex-col w-full">
                {/* Ligne 1 : 3 images à gauche */}
                <div className="flex justify-start">
                  {imageGrid.slice(0, 3).map((artist, index) => {
                    const rotations = [-8, -6, -4, -2, 0, 2, 4, 6, 8];
                    const rotation = rotations[index % rotations.length];
                    const isFading = fadingIndex === index;

                    return (
                      <div
                        key={`row1-${index}`}
                        className="relative w-[120px] h-[120px] 2xl:w-[140px] 2xl:h-[140px]"
                        style={{
                          transform: `rotate(${rotation}deg)`,
                        }}
                      >
                        {artist.link ? (
                          <Link
                            href={artist.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block group"
                          >
                            <Image
                              src={artist.picture}
                              alt={artist.name}
                              width={140}
                              height={140}
                              className={`w-[120px] h-[120px] 2xl:w-[140px] 2xl:h-[140px] object-cover rounded-[10px] transition-all duration-500 group-hover:scale-110 ${
                                isFading ? "opacity-0" : "opacity-100"
                              }`}
                            />
                          </Link>
                        ) : (
                          <Image
                            src={artist.picture}
                            alt={artist.name}
                            width={140}
                            height={140}
                            className={`w-[120px] h-[120px] 2xl:w-[140px] 2xl:h-[140px] object-cover rounded-[10px] transition-opacity duration-500 ${
                              isFading ? "opacity-0" : "opacity-100"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Ligne 2 : 4 images sur toute la largeur */}
                <div className="flex gap-y-4">
                  {imageGrid.slice(3, 7).map((artist, index) => {
                    const rotations = [-8, -6, -4, -2, 0, 2, 4, 6, 8];
                    const rotation = rotations[(index + 3) % rotations.length];
                    const isFading = fadingIndex === index + 3;

                    return (
                      <div
                        key={`row2-${index}`}
                        className="relative w-[120px] h-[120px] 2xl:w-[140px]"
                        style={{
                          transform: `rotate(${rotation}deg)`,
                        }}
                      >
                        {artist.link ? (
                          <Link
                            href={artist.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block group"
                          >
                            <Image
                              src={artist.picture}
                              alt={artist.name}
                              width={140}
                              height={140}
                              className={`w-[120px] h-[120px] 2xl:w-[140px] object-cover rounded-[10px] transition-all duration-500 group-hover:scale-110 ${
                                isFading ? "opacity-0" : "opacity-100"
                              }`}
                            />
                          </Link>
                        ) : (
                          <Image
                            src={artist.picture}
                            alt={artist.name}
                            width={140}
                            height={140}
                            className={`w-[120px] h-[120px] 2xl:w-[140px] object-cover rounded-[10px] transition-opacity duration-500 ${
                              isFading ? "opacity-0" : "opacity-100"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Ligne 3 : 4 images sur toute la largeur */}
                <div className="flex gap-y-4">
                  {imageGrid.slice(7, 11).map((artist, index) => {
                    const rotations = [-8, -6, -4, -2, 0, 2, 4, 6, 8];
                    const rotation = rotations[(index + 7) % rotations.length];
                    const isFading = fadingIndex === index + 7;

                    return (
                      <div
                        key={`row3-${index}`}
                        className="relative w-[120px] h-[120px] 2xl:w-[140px]"
                        style={{
                          transform: `rotate(${rotation}deg)`,
                        }}
                      >
                        {artist.link ? (
                          <Link
                            href={artist.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block group"
                          >
                            <Image
                              src={artist.picture}
                              alt={artist.name}
                              width={140}
                              height={140}
                              className={`w-[120px] h-[120px] 2xl:w-[140px] object-cover rounded-[10px] transition-all duration-500 group-hover:scale-110 ${
                                isFading ? "opacity-0" : "opacity-100"
                              }`}
                            />
                          </Link>
                        ) : (
                          <Image
                            src={artist.picture}
                            alt={artist.name}
                            width={140}
                            height={140}
                            className={`w-[120px] h-[120px] 2xl:w-[140px] object-cover rounded-[10px] transition-opacity duration-500 ${
                              isFading ? "opacity-0" : "opacity-100"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Ligne 4 : 3 images à droite */}
                <div className="flex gap-y-4 justify-end">
                  {imageGrid.slice(11, 14).map((artist, index) => {
                    const rotations = [-8, -6, -4, -2, 0, 2, 4, 6, 8];
                    const rotation = rotations[(index + 11) % rotations.length];
                    const isFading = fadingIndex === index + 11;

                    return (
                      <div
                        key={`row4-${index}`}
                        className="relative w-[120px] h-[120px] 2xl:w-[140px]"
                        style={{
                          transform: `rotate(${rotation}deg)`,
                        }}
                      >
                        {artist.link ? (
                          <Link
                            href={artist.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block group"
                          >
                            <Image
                              src={artist.picture}
                              alt={artist.name}
                              width={140}
                              height={140}
                              className={`w-[120px] h-[120px] 2xl:w-[140px] object-cover rounded-[10px] transition-all duration-500 group-hover:scale-110 ${
                                isFading ? "opacity-0" : "opacity-100"
                              }`}
                            />
                          </Link>
                        ) : (
                          <Image
                            src={artist.picture}
                            alt={artist.name}
                            width={140}
                            height={140}
                            className={`w-[120px] h-[120px] 2xl:w-[140px] object-cover rounded-[10px] transition-opacity duration-500 ${
                              isFading ? "opacity-0" : "opacity-100"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <Footer color="white" />
          </div>
        </main>
      </PageTransition>
    </>
  );
}
