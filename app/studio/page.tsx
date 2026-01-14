"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { PageTransition } from "@/components/page-transition";
import { Footer } from "@/components/footer";
import { Button } from "@/components/button";
import { MoveUpRight } from "lucide-react";
import "../navigation-link.css";

type SubjectKey = "edouard" | "friends" | "services" | "gear";

export default function StudioPage() {
  const t = useTranslations();
  const [selectedSubject, setSelectedSubject] = useState<SubjectKey>("edouard");
  const [expandedService, setExpandedService] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const subjects: { key: SubjectKey; name: string }[] = [
    {
      key: "edouard",
      name: "edouard",
    },
    {
      key: "friends",
      name: t.studio.friends,
    },
    {
      key: "services",
      name: t.studio.services,
    },
    {
      key: "gear",
      name: t.studio.gear,
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
                {t.studio.title}
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
            {/* Subject buttons - Desktop */}
            <div className="hidden md:flex flex-wrap items-center gap-2 md:gap-3 xl:gap-4 mb-3 md:mb-3 xl:mb-5 2xl:mb-10">
              {subjects.map((subject) => (
                <button
                  key={subject.key}
                  onClick={() => setSelectedSubject(subject.key)}
                  className={`py-1.5 px-4 border rounded-full text-xl md:text-lg xl:text-xl 2xl:text-3xl font-light relative overflow-hidden ${
                    selectedSubject === subject.key
                      ? "bg-white text-black border-white"
                      : "navigation-link bg-transparent text-white border-white"
                  }`}
                >
                  {selectedSubject !== subject.key && (
                    <div className="nav-bg-hover" aria-hidden="true" />
                  )}
                  <span className="relative z-[2]">{subject.name}</span>
                </button>
              ))}
            </div>

            {/* Subject menu - Mobile only */}
            <div className="md:hidden mb-3 relative">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`w-full bg-white text-black py-3 px-4 rounded-full flex items-center justify-between${
                  isMobileMenuOpen ? " rounded-b-none rounded-t-[20px]" : ""
                }`}
              >
                <div />
                <span className="text-3xl font-light flex items-center justify-between">
                  {subjects.find((s) => s.key === selectedSubject)?.name}
                </span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`transition-transform duration-300 ${
                    isMobileMenuOpen ? "rotate-180" : ""
                  }`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {isMobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-white rounded-b-[20px] p-[10px] z-50 space-y-2">
                  {subjects
                    .filter((subject) => subject.key !== selectedSubject)
                    .map((subject) => (
                      <button
                        key={subject.key}
                        onClick={() => {
                          setSelectedSubject(subject.key);
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full bg-black text-white py-3 px-4 rounded-full text-3xl font-light flex items-center justify-center"
                      >
                        {subject.name}
                      </button>
                    ))}
                </div>
              )}
            </div>
            {/* Content */}
            <div className="grid md:grid-cols-2 md:gap-6 xl:gap-10 2xl:gap-16 flex-1">
              {selectedSubject === "edouard" && (
                <>
                  <div className="text-white order-1 md:order-0">
                    <h2 className="text-center md:text-left text-7xl md:text-5xl xl:text-6xl 2xl:text-[100px] !leading-[0.8] font-bold mb-6 xl:mb-3 2xl:mb-4">
                      {(() => {
                        const words = t.studio.edouard.title.split(" ");
                        const firstTwoWords = words.slice(0, 2).join(" ");
                        const remainingWords = words.slice(2).join(" ");
                        return (
                          <>
                            {firstTwoWords}
                            <br />
                            <span className="text-red">{remainingWords}</span>
                          </>
                        );
                      })()}
                    </h2>
                    <div className="space-y-4 2xl:space-y-8">
                      <p className="font-poppins">
                        {t.studio.edouard.description1}
                      </p>
                      <p className="font-poppins">
                        {t.studio.edouard.description2}
                      </p>
                      <div className="flex flex-col gap-4 md:gap-0 lg:flex-row lg:items-center justify-between pt-2 2xl:pt-4">
                        <Link
                          href="https://credits.muso.ai/profile/83085fe9-a37a-493e-b0ac-1a62bf76590f"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="order-2 md:order-1"
                        >
                          <Button className="!py-1.5 !px-4 !border border-white rounded-full text-white hover:text-red transition-all duration-300">
                            <div className="flex items-center gap-2 xl:gap-4">
                              <span className="text-xl font-normal">
                                {t.studio.edouard.fullDiscography}
                              </span>
                              <MoveUpRight
                                size={24}
                                className="xl:w-8 xl:h-8"
                                strokeWidth={2}
                              />
                            </div>
                          </Button>
                        </Link>
                        <div className="order-1 md:order-2">
                          <Image
                            src="https://www.dropbox.com/scl/fi/03lgwozq7qis2g33xw8dr/edouard-signature.webp?rlkey=wj49avq2pcr32v9na2awx5gag&st=a02agqrd&dl=1"
                            alt="Signature Edouard"
                            width={241}
                            height={81}
                            className="h-auto w-[241px] xl:w-48 2xl:w-[241px]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative w-full flex justify-center order-0 md:order-1 mb-5 md:mb-0">
                    <Image
                      src="https://www.dropbox.com/scl/fi/fzai5bqsviinr8vqpsdrd/studio-edouard.webp?rlkey=cz8rnatvwo2l1lsvcn3qvlb0d&st=9ocuexs9&dl=1"
                      alt="Edouard"
                      width={537}
                      height={537}
                      className="object-cover rounded-full w-[225px] h-[225px] md:w-[320px] md:h-[320px] xl:w-[420px] xl:h-[420px] 2xl:w-[537px] 2xl:h-[537px]"
                    />
                  </div>
                </>
              )}

              {selectedSubject === "friends" && (
                <>
                  <div className="text-white">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                      Friends
                    </h2>
                    <p className="text-lg md:text-xl">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                  </div>
                  <div className="relative w-full h-[400px] flex items-center justify-center">
                    {/* Map SVG will go here */}
                    <div className="text-white text-center">
                      <p>World Map SVG</p>
                      <p className="text-sm">Replace with your SVG vector</p>
                    </div>
                  </div>
                </>
              )}

              {selectedSubject === "services" && (
                <>
                  <div className="text-white space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                      Services
                    </h2>
                    {[
                      {
                        title: "Mastering",
                        description:
                          "Professional audio mastering services for your tracks.",
                      },
                      {
                        title: "Mixing",
                        description:
                          "High-quality mixing to bring your music to life.",
                      },
                      {
                        title: "Production",
                        description:
                          "Full music production from concept to completion.",
                      },
                      {
                        title: "Consultation",
                        description:
                          "Expert advice on audio production and engineering.",
                      },
                    ].map((service, index) => (
                      <div key={index} className="border-b border-white/20">
                        <button
                          onClick={() =>
                            setExpandedService(
                              expandedService === index ? null : index
                            )
                          }
                          className="w-full text-left py-4 flex justify-between items-center hover:text-red transition-colors"
                        >
                          <span className="text-xl md:text-2xl font-medium">
                            {service.title}
                          </span>
                          <span className="text-2xl">
                            {expandedService === index ? "−" : "+"}
                          </span>
                        </button>
                        {expandedService === index && (
                          <div className="pb-4 text-lg opacity-80">
                            {service.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="relative w-full h-[400px]">
                    {/* <Image
                      src="https://via.placeholder.com/600x800"
                      alt="Services"
                      fill
                      className="object-cover rounded-lg"
                    /> */}
                  </div>
                </>
              )}

              {selectedSubject === "gear" && (
                <>
                  <div className="text-white">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                      Gear
                    </h2>
                    <p className="text-lg md:text-xl">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                  </div>
                  <div className="relative w-full h-[400px]">
                    {/* <Image
                      src="https://via.placeholder.com/600x800"
                      alt="Gear"
                      fill
                      className="object-cover rounded-lg"
                    /> */}
                  </div>
                </>
              )}
            </div>
            <Footer color="white" />
          </div>
        </main>
      </PageTransition>
    </>
  );
}
