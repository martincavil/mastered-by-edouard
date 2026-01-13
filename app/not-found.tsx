"use client";

import { useEffect } from "react";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { PageTransition } from "@/components/page-transition";
import { Button } from "@/components/button";
import Image from "next/image";

export default function NotFound() {
  const t = useTranslations();

  useEffect(() => {
    document.body.setAttribute("data-not-found", "true");
    return () => {
      document.body.removeAttribute("data-not-found");
    };
  }, []);

  return (
    <PageTransition>
      <main className="h-full bg-white relative overflow-hidden flex items-center justify-center">
        {/* Background 404 pattern */}
        <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none select-none overflow-hidden">
          {[...Array(3)].map((_, lineIndex) => (
            <div
              key={lineIndex}
              className="flex text-red font-bold"
              style={{ fontSize: "380px", lineHeight: "0.8" }}
            >
              {[...Array(30)].map((_, i) => {
                const digit = i % 2 === 0 ? "4" : "0";
                return <span key={i}>{digit}</span>;
              })}
            </div>
          ))}
        </div>

        {/* Center content */}
        <div className="relative z-10 bg-black rounded-3xl py-20 flex flex-col items-center gap-6 w-[560px] max-w-90">
          {/* Logo */}
          <div className="flex items-center justify-center mb-16">
            <Image
              src="https://www.dropbox.com/scl/fi/sz7o4qp32cux52wbgat7x/logo_Mastered-by-Edouard_v3_blanc.webp?rlkey=i863vwo2uhgmok7xyst93gb6e&st=nrjoxgw9&dl=1"
              alt="Mastered by Edouard"
              width={211}
              height={63}
            />
          </div>

          <div className="space-y-8 mb-12">
            <h2 className="text-white text-7xl font-bold">{t.notFound.oops}</h2>

            <p className="text-white text-3xl text-center text-platform">
              {t.notFound.error}
            </p>
          </div>
          {/* Back home button */}
          <Button
            href="/"
            variant="custom"
            bgColor="#ffffff"
            hoverBgColor="#e20600"
            textColor="#000000"
            hoverTextColor="#ffffff"
            borderColor="#ffffff"
            className="rounded-full text-xl"
          >
            {t.notFound.backHome}.
          </Button>
        </div>
      </main>
    </PageTransition>
  );
}
