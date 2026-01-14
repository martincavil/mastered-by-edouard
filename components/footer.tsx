"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n/useTranslations";

interface FooterProps {
  color?: "white" | "black";
}

export function Footer({ color = "white" }: FooterProps) {
  const t = useTranslations();

  const textColor = color === "white" ? "text-white" : "text-black";

  return (
    <footer className="hidden md:flex justify-between items-center px-8 pb-6 pt-6 2xl:pt-[45px] text-sm">
      {/* Social Medias */}
      <div className="flex items-center gap-8">
        <Link
          href="https://www.instagram.com/masteredbyedouard/"
          target="_blank"
          rel="noopener noreferrer"
          className={`${textColor} hover:text-red transition-colors font-poppins`}
        >
          Instagram
        </Link>
        <Link
          href="https://credits.muso.ai/profile/83085fe9-a37a-493e-b0ac-1a62bf76590f"
          target="_blank"
          rel="noopener noreferrer"
          className={`${textColor} hover:text-red transition-colors font-poppins`}
        >
          Muso.AI
        </Link>
      </div>
      {/* Policies links */}
      <div className="flex items-center gap-8 font-poppins">
        <p className={textColor}>
          Mastered by Edouard 2025 © |{" "}
          <Link
            href="/legal-notices/"
            className="hover:text-red transition-colors"
          >
            {t.footer.legalnotices}
          </Link>{" "}
          |{" "}
          <Link
            href="/general-terms-and-conditions/"
            className="hover:text-red transition-colors"
          >
            {t.footer.terms}
          </Link>
        </p>
      </div>
      {/* Faq link */}
      <Link
        href="/qa/"
        className={`${textColor} hover:text-red text-2xl font-bold transition-colors`}
      >
        {t.footer.qanda}
      </Link>
    </footer>
  );
}
