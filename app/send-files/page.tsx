"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { PageTransition } from "@/components/page-transition";
import { Footer } from "@/components/footer";
import { LanguageSwitcher } from "@/components/language-switcher";
import "../navigation-link.css";
import { AudioFiles } from "./components/AudioFiles";
import { ProductionSheet } from "./components/ProductionSheet";
import { PrepareFiles } from "./components/PrepareFiles";
import { DdpReader } from "./components/DdpReader";
import { FilesSent } from "./components/FilesSent";
import { SocialLinks } from "../contact/components/SocialLinks";

// Composant pour l'animation des points
function AnimatedDots() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === "...") return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return <span>{dots}</span>;
}

type SubjectKey = "audio-files" | "production-sheet" | "ddp-reader";

interface SelectedFile {
  file: File;
  id: string;
  progress?: number;
  uploading?: boolean;
  error?: string;
}

function SendFilesContent() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const [selectedSubject, setSelectedSubject] =
    useState<SubjectKey>("audio-files");
  // "how to prepare your files" screen, opened from the audio files form
  const [showPrepare, setShowPrepare] = useState(false);
  // "files sent." screen after a successful upload
  const [sent, setSent] = useState<null | "audio" | "label">(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State partagé pour les fichiers audio
  const [audioFiles, setAudioFiles] = useState<SelectedFile[]>([]);
  const [audioFormData, setAudioFormData] = useState({
    name: "",
    email: "",
    projectName: "",
    message: "",
    acceptTerms: false,
  });
  const [isAudioUploading, setIsAudioUploading] = useState(false);
  const [isProductionUploading, setIsProductionUploading] = useState(false);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "prepare-files") {
      setSelectedSubject("audio-files");
      setShowPrepare(true);
    } else if (
      tab === "production-sheet" ||
      tab === "audio-files" ||
      tab === "ddp-reader"
    ) {
      setSelectedSubject(tab);
      setShowPrepare(false);
    }
  }, [searchParams]);

  const subjects: { key: SubjectKey; name: string }[] = [
    { key: "audio-files", name: t.sendFiles.audioFilesTitle },
    { key: "production-sheet", name: t.sendFiles.productionSheetTitle },
    { key: "ddp-reader", name: t.sendFiles.ddpReaderTitle },
  ];

  const selectSubject = (key: SubjectKey) => {
    setSelectedSubject(key);
    setShowPrepare(false);
  };

  return (
    <>
      <PageTransition>
        <main className="h-full flex flex-col bg-red pb-8 md:pb-0 pt-8 md:pt-4 xl:pt-6 2xl:pt-8 mdshort:pt-3 md:px-8 px-5 overflow-hidden">
          <div className="flex-1 flex flex-col overflow-y-auto md:overflow-y-hidden md:pr-0 px-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 md:mb-3 xl:mb-5 2xl:mb-10 mdshort:mb-2">
              <h1 className="text-4xl md:text-5xl xl:text-6xl 2xl:text-[80px] mdshort:text-5xl font-bold text-red-dark">
                {isAudioUploading || isProductionUploading ? (
                  <>
                    {t.sendFiles.audioFiles.uploadInProgress}
                    <AnimatedDots />
                  </>
                ) : sent ? (
                  t.sendFiles.filesSentTitle
                ) : (
                  t.sendFiles.title
                )}
              </h1>
              {/* Language switcher (no site header on this page) + close button */}
              <div className="flex items-center gap-4 md:gap-8 flex-shrink-0">
              <LanguageSwitcher />
              <div className="overflow-hidden flex-shrink-0">
                <Link
                  href="/"
                  className="text-black hover:text-white transition-all hover:rotate-90 duration-300 block"
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
            </div>
            {/* After a successful upload: social links instead of the tabs */}
            {sent && (
              <SocialLinks
                variant="dark"
                className="flex gap-3 xl:gap-4 mb-4 md:mb-3 xl:mb-5 2xl:mb-10 mdshort:mb-3"
              />
            )}

            {/* Subject buttons - Desktop */}
            {!sent && !isAudioUploading && !isProductionUploading && (
              <div className="hidden md:flex flex-wrap items-center gap-2 md:gap-3 xl:gap-4 md:mb-3 xl:mb-5 2xl:mb-10 mdshort:mb-3">
                {subjects.map((subject) => (
                  <button
                    key={subject.key}
                    onClick={() => selectSubject(subject.key)}
                    className={`py-1.5 px-4 border rounded-full text-xl md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl mdshort:text-xl mdshort:py-1 font-extralight relative overflow-hidden ${
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
            )}

            {/* Subject menu - Mobile only */}
            {!sent && !isAudioUploading && !isProductionUploading && (
              <div className="md:hidden mb-8 relative">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={`w-full bg-white text-black py-2 px-3 rounded-full flex items-center justify-between${
                    isMobileMenuOpen ? " rounded-b-none rounded-t-[20px]" : ""
                  }`}
                >
                  <div />
                  <span className="text-xl font-extralight flex items-center justify-between">
                    {subjects.find((s) => s.key === selectedSubject)?.name}
                  </span>
                  <svg
                    width="20"
                    height="20"
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
                            selectSubject(subject.key);
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full bg-black text-white py-2 px-3 rounded-full text-xl font-extralight flex items-center justify-center"
                        >
                          {subject.name}
                        </button>
                      ))}
                  </div>
                )}
              </div>
            )}
            {/* Content: one full-width card per screen */}
            <div className="flex-1 min-h-0">
              {sent ? (
                <FilesSent kind={sent} />
              ) : (
                <>
                  {selectedSubject === "audio-files" && (
                    <div className="h-full animate-fade-in">
                      {showPrepare ? (
                        <PrepareFiles onBack={() => setShowPrepare(false)} />
                      ) : (
                        <AudioFiles
                          selectedFiles={audioFiles}
                          setSelectedFiles={setAudioFiles}
                          formData={audioFormData}
                          setFormData={setAudioFormData}
                          isUploading={isAudioUploading}
                          setIsUploading={setIsAudioUploading}
                          onShowPrepare={() => setShowPrepare(true)}
                          onSuccess={() => setSent("audio")}
                        />
                      )}
                    </div>
                  )}

                  {selectedSubject === "production-sheet" && (
                    <div className="h-full animate-fade-in">
                      <ProductionSheet
                        isUploading={isProductionUploading}
                        setIsUploading={setIsProductionUploading}
                        onSuccess={() => setSent("label")}
                      />
                    </div>
                  )}

                  {selectedSubject === "ddp-reader" && (
                    <div className="h-full animate-fade-in">
                      <DdpReader />
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="mt-auto">
              <Footer color="white" hoverColor="black" />
            </div>
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
