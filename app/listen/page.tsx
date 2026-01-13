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

export default function ListenPage() {
  const t = useTranslations();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArtists() {
      try {
        const data = await getArtists();
        console.log("🎨 Artists data:", data);
        data.forEach((artist) => {
          console.log(`Artist: ${artist.name}, Picture:`, artist.picture);
        });
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
        <main className="h-full flex flex-col bg-black pt-8 px-8 overflow-hidden">
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 md:mb-5">
              <h1 className="text-4xl md:text-[80px] font-bold text-white">
                {t.listen.title}
              </h1>
              {/* Close button */}
              <Link
                href="/"
                className="text-white hover:text-red transition-all hover:rotate-90 duration-300"
                aria-label="Retour à l'accueil"
              >
                <svg
                  width="58"
                  height="58"
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
            <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-3 md:mb-5">
              {platforms.map((platform) => (
                <Link
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="!py-1.5 !px-4 !border border-white rounded-full text-white hover:text-red transition-all duration-300">
                    <div className="flex  items-center gap-4">
                      <span className="text-xl md:text-3xl font-light">
                        {platform.name}
                      </span>
                      <MoveUpRight size={32} strokeWidth={2} />
                    </div>
                  </Button>
                </Link>
              ))}
            </div>
            {/* Content */}
            <div className="grid md:grid-cols-2 md:gap-16">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-6xl font-bold text-white">
                  {t.listen.subTitle}
                </h2>
                {/* Artists names via Strapi */}
                <div className="flex flex-wrap gap-2">
                  {loading ? (
                    <p className="text-white/60">Loading artists...</p>
                  ) : artists.length > 0 ? (
                    artists.map((artist, index) =>
                      artist.link ? (
                        <Link href={artist.link} key={artist.id}>
                          <span className="text-xl md:text-2xl font-light font-poppins uppercase text-red hover:text-white transition-colors duration-300 cursor-pointer">
                            {artist.name}
                            {index < artists.length - 1 && ","}
                          </span>
                        </Link>
                      ) : (
                        <span
                          key={artist.id}
                          className="text-xl md:text-2xl font-light font-poppins uppercase text-red cursor-default"
                        >
                          {artist.name}
                          {index < artists.length - 1 && ","}
                        </span>
                      )
                    )
                  ) : (
                    <p className="text-white/60">No artists found.</p>
                  )}
                  <div className="flex justify-center w-full">
                    <Link href="https://credits.muso.ai/profile/83085fe9-a37a-493e-b0ac-1a62bf76590f">
                      <Button
                        bgColor="white"
                        textColor="black"
                        className="rounded-full md:mt-10 py-3 md:px-10 text-xl font-normal"
                      >
                        {t.listen.fullDiscography}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              {/* Artists pictures */}
              <div className="artists-scroll-container hidden md:flex">
                <div className="artists-scroll-wrapper">
                  {!loading &&
                    (() => {
                      // Create rows with 2-4 images each
                      const rowSizes = [2, 3, 4, 2, 4, 3];
                      const rows: Artist[][] = [];
                      let currentIndex = 0;

                      // Duplicate artists 4 times for smooth infinite loop
                      const duplicatedArtists = [
                        ...artists,
                        ...artists,
                        ...artists,
                        ...artists,
                      ];

                      // Create multiple sets of rows for infinite effect
                      for (let set = 0; set < 3; set++) {
                        rowSizes.forEach((size) => {
                          const row = duplicatedArtists.slice(
                            currentIndex % duplicatedArtists.length,
                            (currentIndex % duplicatedArtists.length) + size
                          );
                          if (row.length > 0) {
                            rows.push(row);
                          }
                          currentIndex += size;
                        });
                      }

                      return rows.map((row, rowIndex) => (
                        <div key={rowIndex} className="artist-row">
                          {row.map((artist, imageIndex) => {
                            const imageUrl =
                              typeof artist.picture === "string"
                                ? artist.picture
                                : artist.picture?.url;

                            const rotations = [-8, -6, -4, -2, 0, 2, 4, 6, 8];
                            const rotation =
                              rotations[
                                (rowIndex + imageIndex) % rotations.length
                              ];

                            return (
                              <div
                                key={`${artist.id}-${rowIndex}-${imageIndex}`}
                                className="artist-image-item rounded-lg group"
                                style={{
                                  transform: `rotate(${rotation}deg)`,
                                }}
                              >
                                {imageUrl && (
                                  <Image
                                    src={getStrapiImageUrl(imageUrl)}
                                    alt={artist.name}
                                    width={140}
                                    height={140}
                                    className="object-cover rounded-lg transition-all duration-300 group-hover:scale-110"
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ));
                    })()}
                </div>
              </div>
            </div>
          </div>
          <Footer color="white" />
        </main>
      </PageTransition>
    </>
  );
}
