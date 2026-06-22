import { ChevronDown } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import type { StudioService } from "@/lib/sanity/queries";

type Locale = "fr" | "en";

interface ServicesTextContentProps {
  services: StudioService[];
  locale: Locale;
}

export function ServicesTextContent({ services, locale }: ServicesTextContentProps) {
  const [expandedService, setExpandedService] = useState<number | null>(null);

  return (
    <div className="text-white space-y-4 overflow-y-auto pr-3">
      {services.map((service, index) => (
        <div key={index}>
          <button
            onClick={() =>
              setExpandedService(expandedService === index ? null : index)
            }
            className="w-full text-left flex justify-between items-center hover:text-white transition-colors duration-300 mb-2"
          >
            <span
              className={`${
                expandedService === index && "text-white"
              } text-red hover:text-white text-4xl lg:text-6xl 2xl:text-[80px] font-bold`}
            >
              {service.title[locale]}
            </span>
            <ChevronDown
              className={`text-white transform transition-transform duration-300 flex-shrink-0 w-9 h-9 ${
                expandedService === index ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              expandedService === index
                ? "max-h-96 opacity-100 translate-y-0"
                : "max-h-0 opacity-0 -translate-y-2"
            }`}
          >
            <div className="2xl:text-lg text-white font-poppins space-y-2">
              <p>{service.description[locale]}</p>
              {service.description2 && <p>{service.description2[locale]}</p>}
            </div>
            {service.logo && (
              <div className="flex justify-end mt-4">
                <Image
                  src={service.logo}
                  alt="Service logo"
                  width={130}
                  height={48}
                  className="w-[130px] h-[48px] object-contain"
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ServicesImage({ src }: { src: string }) {
  return (
    <Image
      src={src}
      alt="Studio MasteredByEdouard"
      width={584}
      height={651}
      className="w-full h-full rounded-[10px] object-cover transition-opacity duration-500 md:w-[330px] md:h-[368px] xl:w-[410px] xl:h-[456px] 2xl:w-[563px] 2xl:h-[628px] 3xl:w-[584px] 3xl:h-[651px]"
    />
  );
}
