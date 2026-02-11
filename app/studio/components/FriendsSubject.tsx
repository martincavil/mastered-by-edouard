import { useTranslations } from "@/lib/i18n/useTranslations";
import Image from "next/image";

export function FriendsSubject() {
  const t = useTranslations();

  return (
    <>
      <div className="text-white order-1 md:order-0">
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
        <div className="space-y-3 2xl:space-y-5">
          <p className="font-poppins">{t.studio.friends.description3}</p>
          {/* Logos Labels */}
          <div className="flex flex-col items-center space-y-1.5">
            <Image
              src="https://www.dropbox.com/scl/fi/s6s3p9arc8k0846cab6lu/labels-row-1.webp?rlkey=nl2rtyjhuw3shpsiornj3vw0g&st=bqwmb8fb&dl=1"
              alt="labels row 1"
              width={646}
              height={56}
              className="object-cover w-full 2xl:max-w-[646px] max-h-14"
            />
            <Image
              src="https://www.dropbox.com/scl/fi/bxzpk22lz8v3wcbdk0rjz/labels-row-2.webp?rlkey=s9igyt1ir99jvgru9syhj2e73&st=ectkktz4&dl=1"
              alt="labels row 2"
              width={342}
              height={56}
              className="object-cover max-w-[320px] 2xl:max-w-[342px] max-h-14"
            />
          </div>
        </div>
      </div>
      <div className="relative w-full flex justify-center order-0 md:order-1 mb-5 md:mb-0">
        {/* Map SVG will go here */}
        <Image
          src="/svg/active-map.svg"
          alt="World Map"
          width={683}
          height={339}
          className="object-cover w-full max-h-[300px] xl:max-h-[339px]"
        />
      </div>
    </>
  );
}

// Export text content separately
export function FriendsTextContent() {
  const t = useTranslations();

  return (
    <>
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
      <div className="space-y-3 2xl:space-y-5">
        <p className="font-poppins">{t.studio.friends.description3}</p>
        {/* Logos Labels */}
        <div className="flex flex-col items-center space-y-1.5">
          <Image
            src="https://www.dropbox.com/scl/fi/s6s3p9arc8k0846cab6lu/labels-row-1.webp?rlkey=nl2rtyjhuw3shpsiornj3vw0g&st=bqwmb8fb&dl=1"
            alt="labels row 1"
            width={646}
            height={56}
            className="object-cover w-full 2xl:max-w-[646px] max-h-14"
          />
          <Image
            src="https://www.dropbox.com/scl/fi/bxzpk22lz8v3wcbdk0rjz/labels-row-2.webp?rlkey=s9igyt1ir99jvgru9syhj2e73&st=ectkktz4&dl=1"
            alt="labels row 2"
            width={342}
            height={56}
            className="object-cover max-w-[320px] 2xl:max-w-[342px] max-h-14"
          />
        </div>
      </div>
    </>
  );
}

// Export image separately
export function FriendsImage() {
  return (
    <Image
      src="/svg/active-map.svg"
      alt="World Map"
      width={683}
      height={339}
      className="object-cover w-full"
    />
  );
}
