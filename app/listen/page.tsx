"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { PageTransition } from "@/components/page-transition";
import { Footer } from "@/components/footer";
import { Button } from "@/components/button";
import { MoveUpRight } from "lucide-react";
import { getArtists, getStrapiImageUrl } from "@/lib/strapi/api";
import { Artist } from "@/lib/strapi/types";
import "./artists-scroll.css";
import "../navigation-link.css";

export default function ListenPage() {
  const t = useTranslations();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredArtistId, setHoveredArtistId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchArtists() {
      try {
        const data = await getArtists();
        setArtists(data);
      } catch (error) {
        console.error("Failed to fetch artists:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchArtists();
  }, []);

  const platforms = [
    {
      name: "apple music",
      url: "https://www.apple.com/apple-music/",
    },
    {
      name: "spotify",
      url: "https://www.spotify.com",
    },
    {
      name: "deezer",
      url: "https://www.deezer.com",
    },
    {
      name: "tidal",
      url: "https://www.tidal.com",
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
                      <span className="text-xl md:text-lg xl:text-xl 2xl:text-3xl font-extralight">
                        {platform.name}
                      </span>
                      <MoveUpRight
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
            <div className="grid md:grid-cols-2 md:gap-6 xl:gap-10 2xl:gap-16 flex-1">
              <div className="space-y-6 xl:space-y-4">
                <h2 className="text-3xl md:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-white">
                  {t.listen.subTitle}
                </h2>
                {/* Artists names via Strapi */}
                <div className="flex flex-wrap gap-2 max-h-[200px] md:max-h-[250px] xl:max-h-[300px] 2xl:max-h-[350px] overflow-hidden">
                  {loading ? (
                    <p className="text-white/60">Loading artists...</p>
                  ) : artists.length > 0 ? (
                    artists.map((artist, index) =>
                      artist.link ? (
                        <Link
                          href={artist.link}
                          key={artist.id}
                          target="_blank"
                        >
                          <span
                            className={`text-lg md:text-xl xl:text-2xl font-extralight font-poppins uppercase transition-colors duration-300 cursor-pointer ${
                              hoveredArtistId === artist.id
                                ? "text-white"
                                : "text-red hover:text-white"
                            }`}
                            onMouseEnter={() => setHoveredArtistId(artist.id)}
                            onMouseLeave={() => setHoveredArtistId(null)}
                          >
                            {artist.name}
                            {index < artists.length - 1 ? "," : "..."}
                          </span>
                        </Link>
                      ) : (
                        <span
                          key={artist.id}
                          className={`text-lg md:text-xl xl:text-2xl font-extralight font-poppins uppercase cursor-default ${
                            hoveredArtistId === artist.id
                              ? "text-white"
                              : "text-red"
                          }`}
                          onMouseEnter={() => setHoveredArtistId(artist.id)}
                          onMouseLeave={() => setHoveredArtistId(null)}
                        >
                          {artist.name}
                          {index < artists.length - 1 ? "," : "..."}
                        </span>
                      ),
                    )
                  ) : (
                    <p className="text-white/60">No artists found.</p>
                  )}
                </div>
                <div className="flex justify-center w-full mt-6 xl:mt-8 2xl:mt-10">
                  <Link href="https://credits.muso.ai/profile/83085fe9-a37a-493e-b0ac-1a62bf76590f">
                    <Button
                      bgColor="white"
                      textColor="black"
                      className="rounded-full py-2 px-6 md:py-3 md:px-10 text-base md:text-lg xl:text-xl font-normal bg-white !text-black"
                    >
                      {t.listen.fullDiscography}
                    </Button>
                  </Link>
                </div>
              </div>
              {/* Artists pictures */}
              <div className="artists-scroll-container hidden md:flex">
                {!loading &&
                  artists.length > 0 &&
                  (() => {
                    // Create rows with 3-4 images each
                    const rowSizes = [3, 4, 3, 4];
                    const rows: Artist[][] = [];
                    let currentIndex = 0;

                    // Duplicate artists many times for smooth infinite loop
                    const duplicatedArtists = [
                      ...artists,
                      ...artists,
                      ...artists,
                      ...artists,
                      ...artists,
                      ...artists,
                    ];

                    // Create multiple sets of rows for infinite effect
                    for (let set = 0; set < 6; set++) {
                      rowSizes.forEach((size) => {
                        const row = duplicatedArtists.slice(
                          currentIndex % duplicatedArtists.length,
                          (currentIndex % duplicatedArtists.length) + size,
                        );
                        if (row.length > 0) {
                          rows.push(row);
                        }
                        currentIndex += size;
                      });
                    }

                    const renderRows = (keyPrefix: string) =>
                      rows.map((row, rowIndex) => (
                        <div
                          key={`${keyPrefix}-${rowIndex}`}
                          className="artist-row"
                        >
                          {row.map((artist, imageIndex) => {
                            const imageUrl = artist.picture;
                            const rotations = [-8, -6, -4, -2, 0, 2, 4, 6, 8];
                            const rotation =
                              rotations[
                                (rowIndex + imageIndex) % rotations.length
                              ];

                            const imageContent = (
                              <>
                                {imageUrl && (
                                  <Image
                                    src={getStrapiImageUrl(imageUrl)}
                                    alt={artist.name}
                                    width={140}
                                    height={140}
                                    className="object-cover rounded-[10px] transition-all duration-300 group-hover:scale-110"
                                  />
                                )}
                              </>
                            );

                            return (
                              <div
                                key={`${artist.id}-${rowIndex}-${imageIndex}`}
                                className="artist-image-item rounded-[10px] group"
                                style={{
                                  transform: `rotate(${rotation}deg)`,
                                }}
                                onMouseEnter={() =>
                                  setHoveredArtistId(artist.id)
                                }
                                onMouseLeave={() => setHoveredArtistId(null)}
                              >
                                {artist.link ? (
                                  <Link
                                    href={artist.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {imageContent}
                                  </Link>
                                ) : (
                                  imageContent
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ));

                    return (
                      <>
                        <div className="artists-scroll-wrapper">
                          {renderRows("set1")}
                        </div>
                        <div className="artists-scroll-wrapper">
                          {renderRows("set2")}
                        </div>
                      </>
                    );
                  })()}
              </div>
            </div>
            <Footer color="white" />
          </div>
        </main>
      </PageTransition>
    </>
  );
}
