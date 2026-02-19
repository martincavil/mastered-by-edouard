"use client";

import { CircleCheckBig } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Translations } from "@/lib/i18n/types";
import { ArrowUpRight } from "@/components/icons/ArrowUpRight";

interface SuccessViewProps {
  t: Translations;
}

export function SuccessView({ t }: SuccessViewProps) {
  return (
    <div className="flex flex-col h-full">
      {/* White success container */}
      <div className="bg-white max-h-[350px] 2xl:max-h-full rounded-[10px] pt-8 px-8 flex flex-col items-center relative flex-1">
        <CircleCheckBig
          size={64}
          className="text-white bg-red rounded-full p-3"
          strokeWidth={2}
        />
        <p className="text-black text-center md:text-2xl 2xl:text-3xl mt-3">
          {t.sendFiles.productionSheet.successMessage}
        </p>
        <div className="mt-auto w-full flex justify-center">
          <Image
            src="https://www.dropbox.com/scl/fi/ngor9nsc5rl7gvd3ew5xp/files-sent.webp?rlkey=ghnns7vsh8743o0juqqb2iiz7&st=56wa1fv5&dl=1"
            alt="Success illustration"
            width={271}
            height={271}
            className="object-cover w-full"
          />
        </div>
      </div>
      <Link
        href="/"
        className="bg-black text-white font-bold text-base 2xl:text-lg px-6 xl:px-8 py-2.5 xl:py-3 rounded-[10px] hover:bg-black/90 transition-colors duration-300 flex items-center justify-center gap-2 mt-3"
      >
        {t.sendFiles.productionSheet.backToHome}
        <ArrowUpRight size={20} />
      </Link>
    </div>
  );
}
