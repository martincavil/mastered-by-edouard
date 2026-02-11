"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      className="flex items-center gap-0 md:gap-2 text-xl md:text-2xl"
      style={{ fontFamily: "platform, sans-serif" }}
    >
      <span
        onClick={() => setLocale("fr")}
        className={
          `cursor-pointer transition-colors ` +
          (locale === "fr"
            ? "font-medium text-black"
            : "font-extralight text-black/50 hover:text-black")
        }
        style={{ userSelect: "none" }}
      >
        FR
      </span>
      <span className="mx-1 text-black" style={{ userSelect: "none" }}>
        |
      </span>
      <span
        onClick={() => setLocale("en")}
        className={
          `cursor-pointer transition-colors ` +
          (locale === "en"
            ? "font-medium text-black"
            : "font-extralight text-black/50 hover:text-black")
        }
        style={{ userSelect: "none" }}
      >
        EN
      </span>
    </div>
  );
}
