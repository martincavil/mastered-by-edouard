"use client";

import Image from "next/image";
import { LanguageSwitcher } from "@/components/language-switcher";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="flex justify-between pt-3.5 px-2 md:px-6 mb-2">
      {/* Logo */}
      <Link href="/">
        <Image
          src="https://www.dropbox.com/scl/fi/mzniqk11bcx0w0ozl25wh/logo_Mastered-by-Edouard_v3.webp?rlkey=2td8sgwoonneic113dsn3h1f1&st=b7uz5q2i&dl=1"
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
