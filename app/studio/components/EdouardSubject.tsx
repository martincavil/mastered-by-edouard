import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/button";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { ArrowUpRight } from "@/components/icons/ArrowUpRight";

export function EdouardSubject() {
  const t = useTranslations();

  return (
    <>
      <div className="text-white order-1 md:order-0">
        <h2 className="text-center md:text-left text-7xl md:text-5xl xl:text-6xl 2xl:text-[100px] !leading-[0.8] font-bold mb-6 xl:mb-3 2xl:mb-4">
          {(() => {
            const words = t.studio.edouard.title.split(" ");
            const firstTwoWords = words.slice(0, 2).join(" ");
            const remainingWords = words.slice(2).join(" ");
            return (
              <>
                {firstTwoWords}
                <br />
                <span className="text-red">{remainingWords}</span>
              </>
            );
          })()}
        </h2>
        <div className="space-y-4 2xl:space-y-8">
          <p className="font-poppins">{t.studio.edouard.description1}</p>
          <p className="font-poppins">{t.studio.edouard.description2}</p>
          <div className="flex flex-col gap-4 md:gap-0 lg:flex-row lg:items-center justify-end pt-2 2xl:pt-4">
            {/* <Link
              href="https://credits.muso.ai/profile/83085fe9-a37a-493e-b0ac-1a62bf76590f"
              target="_blank"
              rel="noopener noreferrer"
              className="order-2 md:order-1"
            >
              <Button className="!py-1.5 !px-4 !border border-white rounded-full text-white hover:text-red transition-all duration-300">
                <div className="flex items-center gap-2 xl:gap-4">
                  <span className="text-xl font-normal">
                    {t.studio.edouard.fullDiscography}
                  </span>
                  <ArrowUpRight
                    size={24}
                    className="lg:w-5 lg:h-5"
                    strokeWidth={1.5}
                  />
                </div>
              </Button>
            </Link> */}
            <div className="order-1 md:order-2">
              <Image
                src="https://www.dropbox.com/scl/fi/03lgwozq7qis2g33xw8dr/edouard-signature.webp?rlkey=wj49avq2pcr32v9na2awx5gag&st=a02agqrd&dl=1"
                alt="Signature Edouard"
                width={241}
                height={81}
                className="h-auto w-[241px] xl:w-48 2xl:w-[241px]"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-full flex justify-center order-0 md:order-1 mb-5 md:mb-0">
        <Image
          src="https://www.dropbox.com/scl/fi/fzai5bqsviinr8vqpsdrd/studio-edouard.webp?rlkey=cz8rnatvwo2l1lsvcn3qvlb0d&st=9ocuexs9&dl=1"
          alt="Edouard"
          width={537}
          height={537}
          className="object-cover rounded-full w-[225px] h-[225px] md:w-[320px] md:h-[320px] xl:w-[400px] xl:h-[400px] xl:max-w-[420px] xl:max-h-[420px] 2xl:w-[537px] 2xl:h-[537px]"
        />
      </div>
    </>
  );
}
