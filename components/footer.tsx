"use client";

import Link from "next/link";
import { useTranslations } from "@/lib/i18n/useTranslations";

interface FooterProps {
  color?: "white" | "black";
  hoverColor?: "red" | "white" | "black";
}

export function Footer({ color = "white", hoverColor = "red" }: FooterProps) {
  const t = useTranslations();

  const textColor = color === "white" ? "text-white" : "text-black";
  const hoverColorClass =
    hoverColor === "red"
      ? "hover:text-red"
      : hoverColor === "black"
        ? "hover:text-black"
        : "hover:text-white";

  return (
    <footer className="hidden md:flex justify-between items-center px-8 py-3 2xl:py-5 text-sm">
      {/* Social Medias */}
      <div className="flex items-center gap-8">
        <Link
          href="https://www.instagram.com/masteredbyedouard/"
          target="_blank"
          rel="noopener noreferrer"
          className={`${textColor} ${hoverColorClass} transition-colors font-poppins`}
        >
          Instagram
        </Link>
        <Link
          href="https://credits.muso.ai/profile/83085fe9-a37a-493e-b0ac-1a62bf76590f"
          target="_blank"
          rel="noopener noreferrer"
          className={`${textColor} ${hoverColorClass} transition-colors font-poppins`}
        >
          Muso.AI
        </Link>
      </div>
      {/* Policies links */}
      <div className="flex items-center gap-8 font-poppins">
        <p className={textColor}>
          Mastered by Edouard 2026 © |{" "}
          <Link
            href="/legal-notice/"
            className={`${hoverColorClass} transition-colors`}
          >
            {t.footer.legalnotice}
          </Link>{" "}
          |{" "}
          <Link
            href="/terms-and-conditions/"
            className={`${hoverColorClass} transition-colors`}
          >
            {t.footer.terms}
          </Link>
        </p>
      </div>
      {/* Faq link */}
      <Link
        href="/faq/"
        className={`${textColor} ${hoverColorClass} text-2xl font-bold transition-colors`}
      >
        {t.footer.faq}
      </Link>
    </footer>
  );
}
