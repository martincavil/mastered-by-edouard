"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { PageTransition } from "@/components/page-transition";
import { Footer } from "@/components/footer";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function FaqPage() {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const t = useTranslations();

  const questions = [
    {
      question: t.faq.questions.question1,
      answer: t.faq.questions.answer1,
    },
    {
      question: t.faq.questions.question2,
      answer: t.faq.questions.answer2,
    },
    {
      question: t.faq.questions.question3,
      answer: t.faq.questions.answer3,
    },
    {
      question: t.faq.questions.question4,
      answer: t.faq.questions.answer4,
    },
    {
      question: t.faq.questions.question5,
      answer: t.faq.questions.answer5,
    },
    {
      question: t.faq.questions.question6,
      answer: t.faq.questions.answer6,
    },
  ];
  // Todo Ajouter bullet list dans la réponse 2 et l'image dans la réponse 6

  return (
    <>
      <PageTransition>
        <main className="h-full flex flex-col bg-black pb-8 md:pb-0 pt-8 md:pt-4 xl:pt-6 2xl:pt-8 px-8 overflow-hidden">
          <div className="flex-1 flex flex-col overflow-y-auto xl:overflow-y-visible">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 md:mb-3 xl:mb-5 2xl:mb-10">
              <h1 className="text-4xl md:text-5xl xl:text-6xl 2xl:text-[80px] font-bold text-white">
                {t.faq.title}
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
            {/* Content */}
            <div className="flex-1 grid md:grid-cols-2 md:gap-12 gap-8 min-h-0">
              <div className="space-y-4 overflow-y-auto h-full">
                {questions.map((question, index) => (
                  <div key={index}>
                    <button
                      onClick={() =>
                        setExpandedQuestion(
                          expandedQuestion === index ? null : index
                        )
                      }
                      className={`
              } w-full text-left flex justify-between items-center hover:text-white transition-colors duration-300 mb-2`}
                    >
                      <span
                        className={`${
                          expandedQuestion === index && "text-white"
                        } text-red hover:text-white text-4xl font-bold`}
                      >
                        {question.question}
                      </span>
                      <ChevronDown
                        className={`text-white transform transition-transform duration-300 ${
                          expandedQuestion === index ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        expandedQuestion === index
                          ? "max-h-96 opacity-100 translate-y-0"
                          : "max-h-0 opacity-0 -translate-y-2"
                      }`}
                    >
                      <div className="2xl:text-lg text-white font-poppins">
                        {question.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Right Column - Illustration */}
              <div className="hidden md:flex flex-col items-center md:items-end justify-start space-y-4 2xl:space-y-20">
                <h3 className="text-5xl xl:text-[100px] font-bold text-white leading-[0.8]">
                  {t.faq.illustrationTitle}
                </h3>
                <Image
                  src="https://www.dropbox.com/scl/fi/fxmjaxacm25am4jhl7bg8/FAQ.webp?rlkey=50jmw69ih4x61xmibewjrvxgc&st=lg4wpkik&dl=1"
                  alt="FAQ Illustration"
                  width={271}
                  height={271}
                  className="object-cover w-48 h-48 2xl:w-[271px] 2xl:h-[271px]"
                />
              </div>
            </div>

            <Footer color="white" />
          </div>
        </main>
      </PageTransition>
    </>
  );
}
