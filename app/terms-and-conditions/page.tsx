"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { PageTransition } from "@/components/page-transition";
import { Footer } from "@/components/footer";
import "../navigation-link.css";

type TabKey = "ratesPayments" | "revisionsVersions" | "dataFiles";

export default function TermsAndConditionsPage() {
  const t = useTranslations();
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

  return (
    <PageTransition>
      <main className="h-full flex flex-col bg-black pb-8 md:pb-0 pt-8 md:pt-4 xl:pt-6 2xl:pt-8 px-8 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-y-auto md:overflow-y-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 md:mb-3 xl:mb-5 2xl:mb-10">
          <h1 className="text-4xl md:text-5xl xl:text-6xl 2xl:text-[80px] font-bold text-white">
            {t.termsAndConditions.title}
          </h1>
          {/* Close button */}
          <Link
            href="/"
            className="text-white hover:text-red transition-all hover:rotate-90 duration-300"
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

        {/* Tabs - Desktop */}
        <div className="hidden md:flex flex-wrap items-center gap-2 md:gap-3 xl:gap-4 md:mb-3 xl:mb-5 2xl:mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-1.5 px-4 border rounded-full text-xl md:text-lg xl:text-xl 2xl:text-3xl font-light relative overflow-hidden ${
                activeTab === tab.key
                  ? "bg-white text-black border-white"
                  : "navigation-link bg-transparent text-white border-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tabs - Mobile only */}
        <div className="md:hidden mb-8 relative">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`w-full bg-white text-black py-3 px-4 rounded-full flex items-center justify-between${
              isMobileMenuOpen ? " rounded-b-none rounded-t-[20px]" : ""
            }`}
          >
            <div />
            <span className="text-3xl font-light flex items-center justify-between">
              {tabs.find((t) => t.key === activeTab)?.label}
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
              {tabs
                .filter((tab) => tab.key !== activeTab)
                .map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-black text-white py-3 px-4 rounded-full text-3xl font-light flex items-center justify-center"
                  >
                    {tab.label}
                  </button>
                ))}
            </div>
          )}
        </div>

        {/* Content Grid */}
        <div className="flex-1 grid md:grid-cols-2 md:gap-12 gap-8 min-h-0">
          {/* Left Column - Content */}
          <div className="text-white space-y-6 font-light text-base 2xl:text-lg">
            {activeTab === "ratesPayments" && (
              <>
                <div>
                  <p className="font-poppins">
                    <span className="font-bold">
                      {t.termsAndConditions.ratesPayments.quotationTitle}
                    </span>
                    {t.termsAndConditions.ratesPayments.quotationContent}
                  </p>
                </div>
                <div>
                  <p className="font-poppins mb-2">
                    <span className="font-bold">
                      {t.termsAndConditions.ratesPayments.adjustmentsTitle}
                    </span>
                    {t.termsAndConditions.ratesPayments.adjustmentsContent}
                  </p>
                </div>
                <div>
                  <p className="font-poppins mb-2">
                    <span className="font-bold">
                      {t.termsAndConditions.ratesPayments.paymentTitle}
                    </span>
                    {t.termsAndConditions.ratesPayments.paymentContent}
                  </p>
                </div>
                <div>
                  <p className="font-poppins">
                    {t.termsAndConditions.ratesPayments.paymentContent2}
                  </p>
                </div>
              </>
            )}

            {activeTab === "revisionsVersions" && (
              <>
                <div>
                  <p className="font-poppins">
                    <span className="font-bold">
                      {t.termsAndConditions.revisionsVersions.includedTitle}
                    </span>
                    {t.termsAndConditions.revisionsVersions.includedContent}
                  </p>
                </div>
                <div>
                  <p className="font-poppins mb-2">
                    <span className="font-bold">
                      {t.termsAndConditions.revisionsVersions.newMixTitle}
                    </span>
                    {t.termsAndConditions.revisionsVersions.newMixContent}
                  </p>
                </div>
                <div>
                  <p className="font-poppins mb-2">
                    <span className="font-bold">
                      {
                        t.termsAndConditions.revisionsVersions
                          .masterRequestsTitle
                      }
                    </span>
                    {t.termsAndConditions.revisionsVersions.additionalContent}
                  </p>
                </div>
                <div>
                  <p className="font-poppins mb-2">
                    <span className="font-bold">
                      {
                        t.termsAndConditions.revisionsVersions
                          .masterRequestsTitle
                      }
                    </span>
                    {
                      t.termsAndConditions.revisionsVersions
                        .masterRequestsContent
                    }
                  </p>
                </div>
              </>
            )}

            {activeTab === "dataFiles" && (
              <>
                <div>
                  <p className="font-poppins">
                    <span className="font-bold">
                      {t.termsAndConditions.dataFiles.transferTitle}
                    </span>
                    {t.termsAndConditions.dataFiles.transferContent}
                  </p>
                </div>
                <div>
                  <p className="font-poppins mb-2">
                    <span className="font-bold">
                      {t.termsAndConditions.dataFiles.retentionTitle}
                    </span>
                    {t.termsAndConditions.dataFiles.retentionContent}
                  </p>
                </div>
                <div>
                  <p className="font-poppins mb-2">
                    <span className="font-bold">
                      {t.termsAndConditions.dataFiles.securityTitle}
                    </span>
                    {t.termsAndConditions.dataFiles.securityContent}
                  </p>
                </div>
                <div>
                  <p className="font-poppins">
                    {t.termsAndConditions.dataFiles.finalNote}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Right Column - Illustration */}
          <div className="hidden md:flex flex-col items-center md:items-end justify-start space-y-4 2xl:space-y-20">
            <h3 className="text-5xl xl:text-[100px] font-bold text-white leading-[0.8]">
              {t.termsAndConditions.illustrationTitle}
            </h3>
            <Image
              src="https://www.dropbox.com/scl/fi/8u7xc79fmf1l4li94uydk/terms-and-conditions.webp?rlkey=pwg98ym8pxhqa5hspb7ev199c&st=8xuqvejr&dl=1"
              alt="Edouard holding Terms & Conditions book"
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
  );
}
