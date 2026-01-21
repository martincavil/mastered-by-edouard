import { useTranslations } from "@/lib/i18n/useTranslations";
import Image from "next/image";

export function AudioFiles() {
  const t = useTranslations();

  return (
    <div className="grid md:grid-cols-2 md:gap-6 xl:gap-10 2xl:gap-16 gap-8 flex-1 min-h-0">
      {/* Todo : Add Form */}
      <div></div>
      {/* Right Column - Illustration */}
      <div className="hidden md:flex flex-col items-center md:items-end justify-start space-y-4 2xl:space-y-20">
        <h3 className="text-5xl xl:text-[100px] font-bold text-white leading-[0.8]">
          {t.sendFiles.audioFiles.headline}
        </h3>
        <Image
          src="https://www.dropbox.com/scl/fi/iwj6fuky5hk2my2qa0pa7/send-files.webp?rlkey=ucreqy7vx1p7mhahrv6hatzgc&st=3u0iinfy&dl=1"
          alt="Edouard SendFiles Illustration"
          width={271}
          height={271}
          className="object-cover w-48 h-48 2xl:w-[271px] 2xl:h-[271px]"
        />
      </div>
    </div>
  );
}
