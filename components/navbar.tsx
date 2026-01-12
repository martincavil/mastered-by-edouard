"use client";

import Image from "next/image";
import { LanguageSwitcher } from "@/components/language-switcher";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="flex justify-between pt-3.5 px-6 mb-6">
      {/* Logo */}
      <Link href="/">
        <Image
          src="/images/logo_Mastered-by-Edouard_v3.webp"
          alt="Logo Mastered by Edouard"
          width={211}
          height={63}
          className="h-full"
        />
      </Link>
      {/* Language Switcher */}
      <LanguageSwitcher />
    </nav>
  );
}
