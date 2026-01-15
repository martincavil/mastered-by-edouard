import { useTranslations } from "@/lib/i18n/useTranslations";
import Image from "next/image";

export function FriendsSubject() {
  const t = useTranslations();

  const labels = [
    { src: "", alt: "Label 1" },
    { src: "", alt: "Label 2" },
    { src: "", alt: "Label 3" },
    { src: "", alt: "Label 4" },
    { src: "", alt: "Label 5" },
    { src: "", alt: "Label 6" },
    { src: "", alt: "Label 7" },
    { src: "", alt: "Label 8" },
    { src: "", alt: "Label 9" },
  ];

  return (
    <>
      <div className="text-white">
        <h2 className="text-center md:text-left text-4xl 2xl:text-[40px] !leading-[0.8] font-bold mb-6 md:mb-2">
          {t.studio.friends.title1}
        </h2>
        <div className="space-y-4 2xl:space-y-8 mb-8 md:mb-4">
          <p className="font-poppins">{t.studio.friends.description1}</p>
          <p className="font-poppins">{t.studio.friends.description2}</p>
        </div>
        <h2 className="text-center md:text-left text-4xl 2xl:text-[40px] !leading-[0.8] font-bold mb-6 md:mb-2">
          {t.studio.friends.title2}
        </h2>
        <div className="space-y-4 2xl:space-y-8">
          <p className="font-poppins">{t.studio.friends.description3}</p>
          {/* Logos Labels */}
          {/* Todo : mapping les images des labels quand j'ai les photos */}
          <div className="flex items-center gap-3">
            {labels.map((label, index) => (
              <Image
                key={index}
                src={label.src}
                alt={label.alt}
                width={120}
                height={80}
                className="object-cover w-full"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="relative w-full h-[400px] flex items-center justify-center">
        {/* Map SVG will go here */}
        <Image
          src="/svg/active-map.svg"
          alt="World Map"
          width={683}
          height={339}
          className="object-cover w-full max-h-[339px]"
        />
      </div>
    </>
  );
}
