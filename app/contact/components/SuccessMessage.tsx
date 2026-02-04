import Image from "next/image";
import Link from "next/link";
import { CircleCheckBig } from "lucide-react";
import { ArrowUpRight } from "@/components/icons/ArrowUpRight";
import { Translations } from "@/lib/i18n/types";

interface SuccessMessageProps {
  t: Translations;
}

export function SuccessMessage({ t }: SuccessMessageProps) {
  return (
    <div className="flex flex-col h-full">
      {/* White success container */}
      <div className="bg-white rounded-[10px] pt-8 px-8 flex flex-col items-center relative flex-1">
        <CircleCheckBig
          size={64}
          className="text-white bg-red rounded-full p-3"
          strokeWidth={2}
        />
        <p className="text-black text-center md:text-2xl 2xl:text-3xl mt-3">
          {t.contact.form.successMessage}
        </p>
        <div className="mt-auto w-full flex justify-center">
          <Image
            src="https://www.dropbox.com/scl/fi/k3q1w44zwfdlpglo9w3gc/sucess-message-contact.webp?rlkey=204sf2iuubp7ndii001ihsoaa&st=boi6c088&dl=1"
            alt="Success illustration"
            width={271}
            height={271}
            className="object-cover w-full"
          />
        </div>
      </div>
      <Link
        href="/"
        className="bg-red text-black font-bold text-base 2xl:text-lg px-6 xl:px-8 py-2.5 xl:py-3 rounded-[10px] hover:bg-red/90 transition-colors duration-300 flex items-center justify-center gap-2 mt-3"
      >
        {t.contact.form.backToHome}
        <ArrowUpRight size={20} />
      </Link>
    </div>
  );
}
