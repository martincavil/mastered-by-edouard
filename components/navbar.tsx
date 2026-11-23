"use client";

import Image from "next/image";
import { LanguageSwitcher } from "@/components/language-switcher";
import Link from "next/link";
import { useTranslations } from "@/lib/i18n/useTranslations";

export function Navbar() {
  const t = useTranslations();

  return (
    <nav className="flex justify-between pt-3.5 px-2 md:px-6 pb-3.5 sticky top-0 z-40">
      {/* Logo */}
      <Link href="/">
        <Image
          src="https://www.dropbox.com/scl/fi/mzniqk11bcx0w0ozl25wh/logo_Mastered-by-Edouard_v3.webp?rlkey=2td8sgwoonneic113dsn3h1f1&st=b7uz5q2i&dl=1"
          alt="MasteredByEdouard"
          width={211}
          height={63}
          className="h-full md:w-[211px] w-[180px]"
        />
      </Link>
      <div className="flex items-center gap-3 md:gap-5">
        {/* DDP player shortcut */}
          <Link
            href="/send-files?tab=ddp-reader"
            className="rounded-full bg-black text-white text-xs md:text-sm font-medium px-3 py-1 hover:bg-red transition-colors duration-300 whitespace-nowrap"
          >
            {t.ddpPlayer.navButton}
          </Link>
        {/* Language Switcher */}
        <LanguageSwitcher />
      </div>
    </nav>
  );
}
