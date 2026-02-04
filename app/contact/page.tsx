"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { PageTransition } from "@/components/page-transition";
import { Footer } from "@/components/footer";
import { LoadingSpinner } from "@/components/loading-spinner";
import { SocialLinks } from "./components/SocialLinks";
import { ContactForm } from "./components/ContactForm";
import { SuccessMessage } from "./components/SuccessMessage";

export default function ContactPage() {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  return (
    <PageTransition>
      <main className="h-full flex flex-col bg-black pb-8 md:pb-0 pt-8 md:pt-4 xl:pt-6 2xl:pt-8 px-8 overflow-hidden">
        <div className="flex-1 flex flex-col overflow-y-auto md:overflow-y-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 md:mb-3 xl:mb-5 2xl:mb-10">
            <h1 className="text-4xl md:text-5xl xl:text-6xl 2xl:text-[80px] font-bold text-white">
              {t.contact.title}
            </h1>
            {/* Close button */}
            <Link
              href="/"
              className="text-white hover:text-red transition-all hover:rotate-90 duration-300"
              aria-label="Back to home"
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

          {/* Social Links */}
          <SocialLinks />

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 md:gap-6 xl:gap-10 2xl:gap-16 gap-8 flex-1 min-h-0">
            {/* Left Column - Contact Form or Success Message */}
            <div className="overflow-y-auto md:overflow-y-visible">
              {submitSuccess ? (
                <SuccessMessage t={t} />
              ) : (
                <ContactForm
                  t={t}
                  onSuccess={() => setSubmitSuccess(true)}
                  onSubmitting={setIsSubmitting}
                />
              )}
            </div>

            {/* Right Column - Illustration */}
            <div className="hidden md:flex flex-col items-center md:items-end justify-start space-y-4 2xl:space-y-20">
              <div className="text-5xl lg:text-7xl xl:text-[90px] 2xl:text-[100px] font-bold text-white !leading-[0.8]">
                <p>{t.contact.ctaTitle1}</p>
                <p>{t.contact.ctaTitle2}</p>
              </div>
              <Image
                src="https://www.dropbox.com/scl/fi/vcphub2lii62wkgckszn6/contact.webp?rlkey=iff7tnt6qg1gixxxm6rbgtt37&st=0jd4agpq&dl=1"
                alt="Edouard Contact Illustration"
                width={271}
                height={271}
                className="object-cover w-52 h-52 xl:w-60 xl:h-60 2xl:w-[271px] 2xl:h-[271px]"
              />
            </div>
          </div>

          <Footer color="white" hoverColor="red" />
        </div>
      </main>
      {isSubmitting && <LoadingSpinner />}
    </PageTransition>
  );
}
