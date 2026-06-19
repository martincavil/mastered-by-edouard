"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { PageTransition } from "@/components/page-transition";
import { Footer } from "@/components/footer";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { FaqQuestion } from "@/lib/sanity/queries";

export function FaqClient({ questions }: { questions: FaqQuestion[] }) {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(
    null,
  );
  const t = useTranslations();
  const { locale } = useLanguage();

  return (
    <>
      <PageTransition>
        <main className="h-full flex flex-col bg-black pb-8 md:pb-0 pt-8 md:pt-4 xl:pt-6 2xl:pt-8 md:px-8 px-5 overflow-hidden">
          <div className="flex-1 flex flex-col overflow-y-auto md:overflow-y-hidden md:pr-0 px-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 md:mb-3 xl:mb-5 2xl:mb-10">
              <h1 className="text-4xl md:text-5xl xl:text-6xl 2xl:text-[80px] font-bold text-white">
                {t.faq.title}
              </h1>
              {/* Close button */}
              <div className="overflow-hidden flex-shrink-0">
                <Link
                  href="/"
                  className="text-white transition-all hover:rotate-90 duration-300 block"
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
            {/* Content */}
            <div className="flex-1 grid md:grid-cols-2 2xl:gap-12 gap-6 min-h-0">
              <div className="space-y-4 overflow-y-auto h-full md:pr-6">
                {questions.map((question, index) => (
                  <div key={index}>
                    <button
                      onClick={() =>
                        setExpandedQuestion(
                          expandedQuestion === index ? null : index,
                        )
                      }
                      className={`
              } w-full text-left flex justify-between items-start hover:text-white transition-colors duration-300 mb-2`}
                    >
                      <span className="text-white text-2xl md:text-4xl font-bold">
                        {question.question[locale]}
                      </span>
                      <ChevronDown
                        className={`text-white transform transition-transform duration-300 w-9 h-9 flex-shrink-0 ${
                          expandedQuestion === index ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        expandedQuestion === index
                          ? "max-h-[600px] opacity-100 translate-y-0"
                          : "max-h-0 opacity-0 -translate-y-2"
                      }`}
                    >
                      <div className="2xl:text-lg text-white font-poppins">
                        {question.answer[locale]}
                      </div>
                      {question.credits && (
                        <ul className="mt-2 text-white font-poppins font-bold">
                          <li>
                            <span>{question.credits.engineerName[locale]}</span>{" "}
                            : {question.credits.engineerValue[locale]}
                          </li>
                          <li>
                            <span>{question.credits.studioName[locale]}</span>{" "}
                            : {question.credits.studioValue[locale]}
                          </li>
                          <li>
                            <span>{question.credits.email[locale]}</span> :{" "}
                            {question.credits.emailValue[locale]}
                          </li>
                        </ul>
                      )}
                      {question.image && (
                        <div className="mt-4 bg-white rounded-[10px] py-8 px-10 w-full flex items-center justify-center">
                          <Image
                            src={question.image}
                            alt="FAQ Illustration"
                            width={500}
                            height={300}
                            className="w-full h-auto object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {/* Right Column - Illustration */}
              <div className="hidden md:flex flex-col items-center md:items-end relative">
                <div className="flex flex-col self-start">
                  <div className="text-5xl lg:text-7xl xl:text-[90px] 2xl:text-[100px] font-bold text-white !leading-[0.8]">
                    {t.faq.illustrationTitle1}
                    <br />
                    {t.faq.illustrationTitle2}
                  </div>
                  <Image
                    src="https://www.dropbox.com/scl/fi/fxmjaxacm25am4jhl7bg8/FAQ.webp?rlkey=50jmw69ih4x61xmibewjrvxgc&st=lg4wpkik&dl=1"
                    alt="FAQ Illustration"
                    width={271}
                    height={271}
                    className="absolute bottom-0 right-0 object-cover w-48 h-48 xl:w-56 xl:h-56 2xl:w-[271px] 2xl:h-[271px]"
                  />
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
