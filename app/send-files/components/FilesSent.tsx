"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { ArrowUpRight } from "@/components/icons/ArrowUpRight";

interface FilesSentProps {
  kind: "audio" | "label";
}

/** Success screen shown after an upload (mockup "files sent.") */
export function FilesSent({ kind }: FilesSentProps) {
  const t = useTranslations();
  const [before, highlight, after] = t.sendFiles.sent[kind];

  return (
    <div className="bg-white rounded-[10px] h-full min-h-0 p-6 md:p-10 mdshort:p-6 grid md:grid-cols-2 items-center gap-6 md:gap-10 overflow-y-auto animate-fade-in">
      <div className="flex justify-center">
        <Image
          src="/images/files-sent.webp"
          alt=""
          width={507}
          height={485}
          priority
          className="object-contain w-56 md:w-80 xl:w-[400px] 2xl:w-[460px] mdshort:w-[300px] h-auto"
        />
      </div>
      <div className="flex flex-col items-start gap-6 xl:gap-8">
        <p className="text-5xl lg:text-7xl xl:text-[90px] 2xl:text-[100px] mdshort:text-7xl font-bold text-black !leading-[0.85]">
          {before}
          <span className="text-red">{highlight}</span>
          {after}
        </p>
        <Link
          href="/"
          className="bg-red-dark text-white font-bold text-lg xl:text-2xl px-12 py-2.5 xl:py-3 rounded-[10px] hover:bg-black transition-colors duration-300 flex items-center gap-2"
        >
          {t.sendFiles.sent.backHome}
          <ArrowUpRight size={22} />
        </Link>
      </div>
    </div>
  );
}
