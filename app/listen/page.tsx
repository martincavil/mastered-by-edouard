"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { PageTransition } from "@/components/page-transition";
import { Footer } from "@/components/footer";
import { Button } from "@/components/button";
import { MoveUpRight } from "lucide-react";
import "./artists-scroll.css";
import "../navigation-link.css";

export default function ListenPage() {
  const t = useTranslations();

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
                      <span className="text-xl md:text-lg xl:text-xl 2xl:text-3xl font-light">
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
            </div>
            <Footer color="white" />
          </div>
        </main>
      </PageTransition>
    </>
  );
}
