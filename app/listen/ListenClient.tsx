"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { PageTransition } from "@/components/page-transition";
import { Footer } from "@/components/footer";
import { Button } from "@/components/button";
import { ArrowUpRight } from "@/components/icons/ArrowUpRight";
import { selectedWorks, type ListenArtist, type SelectedWork } from "./data";
import "../navigation-link.css";
import "./listen.css";

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

/** Repeats a list so a looping column is always taller than its frame */
function fill<T>(items: T[], min: number): T[] {
  if (items.length === 0) return items;
  const out: T[] = [];
  while (out.length < min) out.push(...items);
  return out;
}

/** One cover: grey + blur on hover with the project info on top */
function WorkCard({ work }: { work: SelectedWork }) {
  const className =
    "group relative block aspect-square rounded-[10px] overflow-hidden bg-[#2a2a2a] outline-none";
  const content = (
    <>
      {work.cover && (
        <Image
          src={work.cover}
          alt={`${work.artist} - ${work.title}`}
          fill
          sizes="(min-width: 1024px) 20vw, 40vw"
          // Covers move in and out of view constantly: load them all upfront
          loading="eager"
          className="object-cover transition duration-500 group-hover:blur-[6px] group-hover:scale-105 group-focus:blur-[6px] group-focus:scale-105"
        />
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3 text-center text-white bg-black/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus:opacity-100">
        <p className="text-base xl:text-xl mdshort:text-lg font-bold leading-tight">
          {work.artist} - {work.title}
        </p>
        <span className="block w-3/5 border-t border-white" />
        <div className="text-sm xl:text-base mdshort:text-sm font-light leading-tight">
          {work.services.map((s) => (
            <p key={s}>{s}</p>
          ))}
        </div>
      </div>
    </>
  );
  return (
    <div tabIndex={0} className={className}>
      {content}
    </div>
  );
}

/** Link to the full credits on muso.ai */
function DiscographyButton({ label }: { label: string }) {
  return (
    <Link
      href="https://credits.muso.ai/profile/83085fe9-a37a-493e-b0ac-1a62bf76590f"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="block rounded-full whitespace-nowrap py-1.5 px-6 md:px-10 text-base md:text-lg xl:text-xl font-normal bg-white text-black shadow-lg transition-transform duration-300 hover:scale-105">
        {label}
      </span>
    </Link>
  );
}

export function ListenClient({ artists }: { artists: ListenArtist[] }) {
  const t = useTranslations();
  // Artist photo that follows the cursor over the names
  const [preview, setPreview] = useState<{ src: string; x: number; y: number } | null>(null);

  // Two offset columns: even projects on the left, odd ones on the right
  const colA = fill(selectedWorks.filter((_, i) => i % 2 === 0), 4);
  const colB = fill(selectedWorks.filter((_, i) => i % 2 === 1), 4);
  const row = fill(selectedWorks, 6);

  return (
    <PageTransition>
      <main className="h-full flex flex-col bg-black pb-8 md:pb-0 pt-8 md:pt-4 xl:pt-6 2xl:pt-8 mdshort:pt-4 md:px-8 px-5 overflow-hidden">
        <div className="flex-1 min-h-0 flex flex-col overflow-y-auto lg:overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 xl:mb-5 2xl:mb-10 mdshort:mb-4 shrink-0">
            <h1 className="text-4xl md:text-5xl xl:text-6xl 2xl:text-[80px] mdshort:text-6xl font-bold text-white">
              {t.listen.title}
            </h1>
            <div className="overflow-hidden flex-shrink-0">
              <Link
                href="/"
                className="text-white hover:text-red transition-all hover:rotate-90 duration-300 block"
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
          </div>

          {/* Content: names on the left, selected work on the right */}
          <div className="flex-1 lg:min-h-0 grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,6fr)_minmax(0,4fr)] gap-6 xl:gap-10">
            <div className="flex flex-col gap-6 xl:gap-8 mdshort:gap-5 lg:min-h-0">
              {/* Streaming platforms */}
              <div className="flex flex-wrap items-center gap-2 md:gap-3 xl:gap-4 shrink-0">
                {platforms.map((platform) => (
                  <Link
                    key={platform.name}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <Button className="!py-1.5 !px-4 !border border-white rounded-full text-white hover:text-red transition-all duration-300">
                      <div className="flex md:hidden items-center justify-center">
                        <Image
                          src={platform.icon}
                          alt={platform.name}
                          width={20}
                          height={20}
                          className="w-5 h-5 transition-all duration-300 group-hover:brightness-0"
                        />
                      </div>
                      <div className="hidden md:flex items-center gap-2 xl:gap-4">
                        <span className="text-xl md:text-lg lg:text-2xl xl:text-3xl font-extralight">
                          {platform.name}
                        </span>
                        <ArrowUpRight size={24} className="lg:w-5 lg:h-5" strokeWidth={1.5} />
                      </div>
                    </Button>
                  </Link>
                ))}
              </div>

              {/* Name dropping: photo on hover, link to the Qobuz artist page */}
              <p
                className="text-4xl md:text-5xl lg:text-[length:calc(min(3.4vw,6.9vh,calc(4vw_+_6vh_-_57px))*var(--names-scale))] font-poppins font-normal uppercase text-red !leading-[1.15]"
                // Sized for 20 names: shrink when there are more so the page never scrolls
                style={{ ["--names-scale" as string]: Math.min(1, Math.sqrt(20 / Math.max(artists.length, 1)) * 1.0) }}
              >
                {artists.map((artist, index) => {
                  const name = (
                    <span
                      // Keep single words like "C-ROM" from breaking on the hyphen
                      className={`transition-colors duration-300 hover:text-white ${artist.name.includes(" ") ? "" : "whitespace-nowrap"}`}
                      onMouseMove={(e) =>
                        artist.photo && setPreview({ src: artist.photo, x: e.clientX, y: e.clientY })
                      }
                      onMouseLeave={() => setPreview(null)}
                    >
                      {artist.name}
                    </span>
                  );
                  return (
                    <span key={artist.name}>
                      {artist.qobuz ? (
                        <Link href={artist.qobuz} target="_blank" rel="noopener noreferrer">
                          {name}
                        </Link>
                      ) : (
                        name
                      )}
                      {index < artists.length - 1 ? ", " : "..."}
                    </span>
                  );
                })}
              </p>

            </div>

            {/* Selected work: vertical slider on desktop */}
            <section className="relative hidden lg:flex flex-col min-h-0 border border-white rounded-[10px] p-4 xl:p-5 gap-3">
              <h2 className="text-5xl xl:text-6xl 2xl:text-7xl mdshort:text-5xl font-light text-white leading-none shrink-0">
                {t.listen.selectedWork}
              </h2>
              <div className="listen-works listen-fade-y flex-1 min-h-0 overflow-hidden grid grid-cols-2 gap-4">
                {[colA, colB].map((col, c) => (
                  <div
                    key={c}
                    className={`listen-col ${c === 1 ? "listen-col-down" : ""}`}
                    style={{ ["--listen-duration" as string]: `${col.length * 7}s` }}
                  >
                    {[...col, ...col].map((work, i) => (
                      <div key={i} className="pb-4">
                        <WorkCard work={work} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="absolute bottom-4 xl:bottom-6 mdshort:bottom-4 left-1/2 -translate-x-1/2 z-10">
                <DiscographyButton label={t.listen.fullDiscography} />
              </div>
            </section>

            {/* Selected work: horizontal strip under the names on mobile */}
            <section className="lg:hidden flex flex-col gap-3">
              <h2 className="text-4xl font-light text-white leading-none">{t.listen.selectedWork}</h2>
              <div className="listen-works listen-fade-x overflow-hidden">
                <div
                  className="listen-row flex w-max"
                  style={{ ["--listen-duration" as string]: `${row.length * 5}s` }}
                >
                  {[...row, ...row].map((work, i) => (
                    <div key={i} className="w-40 pr-3 shrink-0">
                      <WorkCard work={work} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center w-full pt-2">
                <DiscographyButton label={t.listen.fullDiscography} />
              </div>
            </section>
          </div>

          <div className="mt-auto pt-4 shrink-0">
            <Footer color="white" />
          </div>
        </div>
      </main>

      {preview && (
        <div
          className="fixed z-50 pointer-events-none w-28 h-28 xl:w-[134px] xl:h-[134px] -translate-y-1/2 rounded-[25px] overflow-hidden shadow-2xl"
          style={{ left: preview.x + 24, top: preview.y }}
        >
          {/* The photos come with white rounded corners baked in: zoom slightly to crop them out */}
          <Image src={preview.src} alt="" fill sizes="134px" className="object-cover scale-[1.12]" />
        </div>
      )}
    </PageTransition>
  );
}
