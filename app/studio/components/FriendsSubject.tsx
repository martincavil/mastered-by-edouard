import Image from "next/image";
import type { StudioPage } from "@/lib/sanity/queries";

type Locale = "fr" | "en";

interface FriendsTextContentProps {
  content: StudioPage["friends"];
  locale: Locale;
}

export function FriendsTextContent({ content, locale }: FriendsTextContentProps) {
  return (
    <>
      <h2 className="text-center md:text-left text-4xl 2xl:text-[40px] !leading-[0.8] font-bold mb-6 md:mb-2">
        {content.title1[locale]}
      </h2>
      <div className="space-y-4 2xl:space-y-8 mb-8 md:mb-4">
        <p className="font-poppins">{content.description1[locale]}</p>
        <p className="font-poppins">{content.description2[locale]}</p>
      </div>
      <h2 className="text-center md:text-left text-4xl 2xl:text-[40px] !leading-[0.8] font-bold mb-6 md:mb-2">
        {content.title2[locale]}
      </h2>
      <div className="space-y-3 2xl:space-y-5">
        <p className="font-poppins">{content.description3[locale]}</p>
        {/* Logos Labels */}
        <div className="flex flex-col items-center space-y-1.5">
          <Image
            src={content.labelsRow1Image}
            alt="labels row 1"
            width={646}
            height={56}
            className="object-cover w-full 2xl:max-w-[646px] max-h-14"
          />
          <Image
            src={content.labelsRow2Image}
            alt="labels row 2"
            width={342}
            height={56}
            className="object-cover max-w-[290px] md:max-w-[320px] 2xl:max-w-[342px] md:max-h-14"
          />
        </div>
      </div>
    </>
  );
}

export function FriendsImage() {
  return (
    <Image
      src="/svg/active-map.svg"
      alt="World Map"
      width={683}
      height={339}
      className="object-cover w-full max-w-full"
    />
  );
}
