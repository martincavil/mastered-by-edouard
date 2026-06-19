"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { PageTransition } from "@/components/page-transition";
import { Footer } from "@/components/footer";
import type { TermsAndConditions } from "@/lib/sanity/queries";
import "../navigation-link.css";

type TabKey = "ratesPayments" | "revisionsVersions" | "dataFiles";

export function TermsAndConditionsClient({
  terms,
}: {
  terms: TermsAndConditions | null;
}) {
  const t = useTranslations();
  const { locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabKey>("ratesPayments");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "ratesPayments", label: t.termsAndConditions.tabs.ratesPayments },
    {
      key: "revisionsVersions",
      label: t.termsAndConditions.tabs.revisionsVersions,
    },
    { key: "dataFiles", label: t.termsAndConditions.tabs.dataFiles },
  ];

  if (!terms) return null;

  return (
    <PageTransition>
      <main className="h-full flex flex-col bg-black pb-8 md:pb-0 pt-8 md:pt-4 xl:pt-6 2xl:pt-8 md:px-8 px-5 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-y-auto md:overflow-y-hidden md:pr-0 px-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 md:mb-3 xl:mb-5 2xl:mb-10">
            <h1 className="text-4xl md:text-5xl xl:text-6xl 2xl:text-[80px] font-bold text-white">
              {t.termsAndConditions.title}
            </h1>
            {/* Close button */}
            <div className="overflow-hidden flex-shrink-0">
              <Link
                href="/"
                className="text-white hover:text-red transition-all hover:rotate-90 duration-300 block"
                aria-label="Back to home"
              >
                <svg
                  className="w-10 h-10 md:w-12 md:h-12"
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

          {/* Tabs - Desktop */}
          <div className="hidden md:flex flex-wrap items-center gap-2 md:gap-3 xl:gap-4 md:mb-3 xl:mb-5 2xl:mb-10">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-1.5 px-4 border rounded-full text-xl md:text-lg lg:text-2xl xl:text-3xl font-extralight relative overflow-hidden ${
                  activeTab === tab.key
                    ? "bg-white text-black border-white"
                    : "navigation-link bg-transparent text-white border-white"
                }`}
              >
                {activeTab !== tab.key && (
                  <div className="nav-bg-hover" aria-hidden="true" />
                )}
                <span className="relative z-[2]">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tabs - Mobile only */}
          <div className="md:hidden mb-8 relative">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`w-full bg-white text-black py-2 px-3 rounded-full flex items-center justify-between${
                isMobileMenuOpen ? " rounded-b-none rounded-t-[20px]" : ""
              }`}
            >
              <div />
              <span className="text-xl font-extralight flex items-center justify-between">
                {tabs.find((t) => t.key === activeTab)?.label}
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
                {tabs
                  .filter((tab) => tab.key !== activeTab)
                  .map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => {
                        setActiveTab(tab.key);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full bg-black text-white py-2 px-3 rounded-full text-xl font-extralight flex items-center justify-center"
                    >
                      {tab.label}
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Content Grid */}
          <div className="flex-1 grid md:grid-cols-2 2xl:gap-12 gap-6 min-h-0 overflow-y-auto">
            {/* Left Column - Content */}
            <div className="text-white space-y-6 font-extralight text-base 2xl:text-lg">
              {activeTab === "ratesPayments" && (
                <>
                  <div>
                    <p className="font-poppins">
                      <span className="font-bold">
                        {terms.ratesPayments.quotationTitle[locale]}
                      </span>
                      {terms.ratesPayments.quotationContent[locale]}
                    </p>
                  </div>
                  <div>
                    <p className="font-poppins mb-2">
                      <span className="font-bold">
                        {terms.ratesPayments.adjustmentsTitle[locale]}
                      </span>
                      {terms.ratesPayments.adjustmentsContent[locale]}
                    </p>
                  </div>
                  <div>
                    <p className="font-poppins mb-2">
                      <span className="font-bold">
                        {terms.ratesPayments.paymentTitle[locale]}
                      </span>
                      {terms.ratesPayments.paymentContent[locale]}
                    </p>
                  </div>
                  <div>
                    <p className="font-poppins">
                      {terms.ratesPayments.paymentContent2[locale]}
                    </p>
                  </div>
                </>
              )}

              {activeTab === "revisionsVersions" && (
                <>
                  <div>
                    <p className="font-poppins">
                      <span className="font-bold">
                        {terms.revisionsVersions.includedTitle[locale]}
                      </span>
                      {terms.revisionsVersions.includedContent[locale]}
                    </p>
                  </div>
                  <div>
                    <p className="font-poppins mb-2">
                      <span className="font-bold">
                        {terms.revisionsVersions.newMixTitle[locale]}
                      </span>
                      {terms.revisionsVersions.newMixContent[locale]}
                    </p>
                  </div>
                  <div>
                    <p className="font-poppins mb-2">
                      <span className="font-bold">
                        {terms.revisionsVersions.additionalTitle[locale]}
                      </span>
                      {terms.revisionsVersions.additionalContent[locale]}
                    </p>
                  </div>
                  <div>
                    <p className="font-poppins mb-2">
                      <span className="font-bold">
                        {terms.revisionsVersions.masterRequestsTitle[locale]}
                      </span>
                      {terms.revisionsVersions.masterRequestsContent[locale]}
                    </p>
                  </div>
                </>
              )}

              {activeTab === "dataFiles" && (
                <>
                  <div>
                    <p className="font-poppins">
                      <span className="font-bold">
                        {terms.dataFiles.transferTitle[locale]}
                      </span>
                      {terms.dataFiles.transferContent[locale]}
                    </p>
                  </div>
                  <div>
                    <p className="font-poppins mb-2">
                      <span className="font-bold">
                        {terms.dataFiles.retentionTitle[locale]}
                      </span>
                      {terms.dataFiles.retentionContent[locale]}
                    </p>
                  </div>
                  <div>
                    <p className="font-poppins mb-2">
                      <span className="font-bold">
                        {terms.dataFiles.securityTitle[locale]}
                      </span>
                      {terms.dataFiles.securityContent[locale]}
                    </p>
                  </div>
                  <div>
                    <p className="font-poppins">
                      {terms.dataFiles.finalNote[locale]}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Right Column - Illustration */}
            <div className="hidden md:flex flex-col items-center md:items-end relative">
              <div className="flex flex-col self-start">
                <div className="text-5xl lg:text-7xl xl:text-[90px] 2xl:text-[100px] font-bold text-white !leading-[0.8]">
                  <p>{t.termsAndConditions.illustrationTitle1}</p>
                  <p>{t.termsAndConditions.illustrationTitle2}</p>
                </div>
                <Image
                  src="https://www.dropbox.com/scl/fi/8u7xc79fmf1l4li94uydk/terms-and-conditions.webp?rlkey=pwg98ym8pxhqa5hspb7ev199c&st=8xuqvejr&dl=1"
                  alt="Edouard holding Terms & Conditions book"
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
  );
}
