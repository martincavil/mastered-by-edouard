import Image from "next/image";
import type { StudioPage } from "@/lib/sanity/queries";

type Locale = "fr" | "en";

interface EdouardTextContentProps {
  content: StudioPage["edouard"];
  locale: Locale;
}

export function EdouardTextContent({ content, locale }: EdouardTextContentProps) {
  const words = content.title[locale].split(" ");
  const firstTwoWords = words.slice(0, 2).join(" ");
  const remainingWords = words.slice(2).join(" ");

  return (
    <>
      <h2 className="text-center md:text-left text-7xl md:text-5xl xl:text-6xl 2xl:text-[100px] !leading-[0.8] font-bold mb-6 xl:mb-3 2xl:mb-4">
        {firstTwoWords}
        <br />
        <span className="text-red">{remainingWords}</span>
      </h2>
      <div className="space-y-4 2xl:space-y-8">
        <p className="font-poppins">{content.description1[locale]}</p>
        <p className="font-poppins">{content.description2[locale]}</p>
        <div className="flex flex-col gap-4 md:gap-0 lg:flex-row lg:items-center justify-end pt-2 2xl:pt-4">
          <div className="order-1 md:order-2">
            <Image
              src={content.signatureImage}
              alt="Signature Edouard"
              width={241}
              height={81}
              className="h-auto w-full max-w-[241px] xl:w-48 2xl:w-[241px]"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export function EdouardImage({ src }: { src: string }) {
  return (
    <Image
      src={src}
      alt="Edouard"
      width={537}
      height={537}
      className="object-cover rounded-full w-[225px] h-[225px] md:w-[320px] md:h-[320px] xl:w-[400px] xl:h-[400px] xl:max-w-[420px] xl:max-h-[420px] 2xl:w-[537px] 2xl:h-[537px]"
    />
  );
}
