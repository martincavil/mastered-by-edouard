"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { PageTransition } from "@/components/page-transition";
import { Footer } from "@/components/footer";
import "../navigation-link.css";
import { AudioFiles } from "./components/AudioFiles";
import { ProductionSheet } from "./components/ProductionSheet";
import { PrepareFiles } from "./components/PrepareFiles";

type SubjectKey = "audio-files" | "production-sheet" | "prepare-files";

function SendFilesContent() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const [selectedSubject, setSelectedSubject] =
    useState<SubjectKey>("audio-files");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (
      tab === "production-sheet" ||
      tab === "prepare-files" ||
      tab === "audio-files"
    ) {
      setSelectedSubject(tab);
    }
  }, [searchParams]);

  const subjects: { key: SubjectKey; name: string }[] = [
    {
      key: "audio-files",
      name: t.sendFiles.audioFilesTitle,
    },
    {
      key: "production-sheet",
      name: t.sendFiles.productionSheetTitle,
    },
    {
      key: "prepare-files",
      name: t.sendFiles.prepareFilesTitle,
    },
  ];

  return (
    <>
      <PageTransition>
        <main className="h-full flex flex-col bg-red pb-8 md:pb-0 pt-8 md:pt-4 xl:pt-6 2xl:pt-8 px-8 overflow-hidden">
          <div className="flex-1 flex flex-col overflow-y-auto md:overflow-y-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 md:mb-3 xl:mb-5 2xl:mb-10">
              <h1 className="text-4xl md:text-5xl xl:text-6xl 2xl:text-[80px] font-bold text-red-dark">
                {t.sendFiles.title}
              </h1>
              {/* Close button */}
              <Link
                href="/"
                className="text-black hover:text-white transition-all hover:rotate-90 duration-300"
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
            <div className="hidden md:flex flex-wrap items-center gap-2 md:gap-3 xl:gap-4 md:mb-3 xl:mb-5 2xl:mb-10">
              {subjects.map((subject) => (
                <button
                  key={subject.key}
                  onClick={() => setSelectedSubject(subject.key)}
                  className={`py-1.5 px-4 border rounded-full text-xl md:text-lg xl:text-xl 2xl:text-3xl font-extralight relative overflow-hidden ${
                    selectedSubject === subject.key
                      ? "bg-black text-white border-black"
                      : "navigation-link bg-transparent text-black border-black"
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
            <div className="md:hidden mb-8 relative">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`w-full bg-white text-black py-3 px-4 rounded-full flex items-center justify-between${
                  isMobileMenuOpen ? " rounded-b-none rounded-t-[20px]" : ""
                }`}
              >
                <div />
                <span className="text-3xl font-extralight flex items-center justify-between">
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
                        className="w-full bg-black text-white py-3 px-4 rounded-full text-3xl font-extralight flex items-center justify-center"
                      >
                        {subject.name}
                      </button>
                    ))}
                </div>
              )}
            </div>
            {/* Content */}
            <div className="flex-1 grid md:grid-cols-2 md:gap-6 xl:gap-10 2xl:gap-16 min-h-0">
              <div
                key={selectedSubject}
                className="md:col-span-2 grid md:grid-cols-2 md:gap-6 xl:gap-10 2xl:gap-16 animate-fade-in min-h-0"
              >
                {selectedSubject === "audio-files" && <AudioFiles />}
                {selectedSubject === "production-sheet" && <ProductionSheet />}
                {selectedSubject === "prepare-files" && <PrepareFiles />}
              </div>
            </div>
            <Footer color="white" hoverColor="black" />
          </div>
        </main>
      </PageTransition>
    </>
  );
}

export default function SendFilesPage() {
  return (
    <Suspense fallback={<div className="h-full w-full bg-red" />}>
      <SendFilesContent />
    </Suspense>
  );
}
