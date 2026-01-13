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
        <main className="h-full flex flex-col justify-between bg-black pt-8 px-8">
          <div className="flex-1">
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
            <div className="flex items-center space-x-4 mb-3 md:mb-5">
              {platforms.map((platform) => (
                <Link
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="!py-1.5 !px-4 !border border-white rounded-full text-white hover:text-red transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <span className="text-3xl font-light">
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
                    artists.map((artist) =>
                      artist.link ? (
                        <Link href={artist.link} key={artist.id}>
                          <span className="text-2xl font-light font-poppins uppercase text-red hover:text-white transition-colors duration-300 cursor-pointer">
                            {artist.name}
                            {artists.indexOf(artist) < artists.length - 1 &&
                              ","}
                          </span>
                        </Link>
                      ) : (
                        <span
                          key={artist.id}
                          className="text-2xl font-light font-poppins uppercase text-red cursor-default"
                        >
                          {artist.name}
                          {artists.indexOf(artist) < artists.length - 1 && ","}
                        </span>
                      )
                    )
                  ) : (
                    <p className="text-white/60">No artists found.</p>
                  )}
                </div>
              </div>
              {/* Artists pictures */}
              <div className="artists-scroll-container">
                <div className="artists-scroll-wrapper">
                  {!loading &&
                    // Duplicate artists array 4 times for infinite scroll
                    [...artists, ...artists, ...artists, ...artists].map(
                      (artist, index) => {
                        const imageUrl =
                          typeof artist.picture === "string"
                            ? artist.picture
                            : artist.picture?.url;

                        return (
                          <div
                            key={`${artist.id}-${index}`}
                            className="-rotate-12 artist-image-item relative rounded-lg group"
                          >
                            {imageUrl && (
                              <Image
                                src={getStrapiImageUrl(imageUrl)}
                                alt={artist.name}
                                width={140}
                                height={140}
                                className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
                              />
                            )}
                          </div>
                        );
                      }
                    )}
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
