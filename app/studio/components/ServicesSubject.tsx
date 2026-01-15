import { useTranslations } from "@/lib/i18n/useTranslations";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export function ServicesSubject() {
  const [expandedService, setExpandedService] = useState<number | null>(null);
  const t = useTranslations();
  const services = [
    {
      title: t.studio.services.title1,
      description: t.studio.services.description1,
    },
    {
      title: t.studio.services.title2,
      description: t.studio.services.description2,
    },
    {
      title: t.studio.services.title3,
      description: t.studio.services.description3,
    },
    {
      title: t.studio.services.title4,
      description: t.studio.services.description4,
    },
  ];

  return (
    <>
      <div className="space-y-4 overflow-y-auto h-full">
        {services.map((service, index) => (
          <div key={index}>
            <button
              onClick={() =>
                setExpandedService(expandedService === index ? null : index)
              }
              className={`
              } w-full text-left flex justify-between items-center hover:text-white transition-colors duration-300 mb-2`}
            >
              <span
                className={`${
                  expandedService === index && "text-white"
                } text-red hover:text-white text-4xl md:text-7xl 2xl:text-[90px] font-bold`}
              >
                {service.title}
              </span>
              <ChevronDown
                className={`text-white transform transition-transform duration-300 ${
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
              <div className="2xl:text-lg text-white font-poppins pb-2">
                {service.description}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="hidden md:flex relative w-full h-full min-h-0 justify-center overflow-hidden">
        <div className="relative h-full" style={{ aspectRatio: '584/651', maxWidth: '100%' }}>
          <Image
            src="https://www.dropbox.com/scl/fi/ei7d0lyb69266wxl8ipxi/studio-services.webp?rlkey=8w779w3baq9dcedexwa44dthb&st=hhztqil6&dl=1"
            alt="Studio MasteredByEdouard"
            width={584}
            height={651}
            className="w-full h-full object-cover rounded-[10px]"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 584px"
          />
        </div>
      </div>
    </>
  );
}
