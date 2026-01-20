import { useTranslations } from "@/lib/i18n/useTranslations";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface Service {
  title: string;
  description: string;
  logo?: string;
}

export function ServicesSubject() {
  const [expandedService, setExpandedService] = useState<number | null>(null);
  const t = useTranslations();
  const services: Service[] = [
    {
      title: t.studio.services.title1,
      description: t.studio.services.description1,
      logo: "https://www.dropbox.com/scl/fi/74lzu7bxk5xcirokpbqk6/adm.webp?rlkey=v52dklfrntt9zme4u3m3yclj7&st=e1xvcw0v&dl=1",
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
      logo: "https://www.dropbox.com/scl/fi/vaglz4cz0507pgnjlbghi/dolby.webp?rlkey=wpz3hcqkllvyb9c48fd5xwh7v&st=h1nj5xfg&dl=1",
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
              className="w-full text-left flex justify-between items-center hover:text-white transition-colors duration-300 mb-2"
            >
              <span
                className={`${
                  expandedService === index && "text-white"
                } text-red hover:text-white text-4xl lg:text-7xl 2xl:text-[90px] font-bold`}
              >
                {service.title}
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
              <div className="2xl:text-lg text-white font-poppins">
                {service.description}
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
      <div className="hidden md:flex relative w-full h-full min-h-0 justify-center items-start overflow-hidden">
        <Image
          src="https://www.dropbox.com/scl/fi/ei7d0lyb69266wxl8ipxi/studio-services.webp?rlkey=8w779w3baq9dcedexwa44dthb&st=hhztqil6&dl=1"
          alt="Studio MasteredByEdouard"
          width={584}
          height={651}
          className="md:w-full md:h-[400px] 2xl:w-[584px] 2xl:h-[651px] object-cover rounded-[10px]"
        />
      </div>
    </>
  );
}
