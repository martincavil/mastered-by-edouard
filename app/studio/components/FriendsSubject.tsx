import { useTranslations } from "@/lib/i18n/useTranslations";
import Image from "next/image";

export function FriendsSubject() {
  const t = useTranslations();

  // Todo: Replace with real data when available

  // const labels = [
  // {
  //   src: "https://www.dropbox.com/scl/fi/jpol26vbtk5mo4ogky7rp/wagram-music.png?rlkey=97dpk9m57napxici5lsihlhd1&st=wbner05q&dl=1",
  //   alt: "Wagram",
  // },
  // {
  //   src: "https://www.dropbox.com/scl/fi/t6g7wvvrazeb532yw89dn/believe-music.png?rlkey=cr3i5bnifua1rhti61rwcvhln&st=w7s9q95d&dl=1",
  //   alt: "Believe",
  // },
  // {
  //   src: "https://www.dropbox.com/scl/fi/jpol26vbtk5mo4ogky7rp/wagram-music.png?rlkey=97dpk9m57napxici5lsihlhd1&st=txva4zmc&dl=1",
  //   alt: "Warner",
  // },
  // {
  //   src: "https://www.dropbox.com/scl/fi/gee5tlq7ofk3hkn2pzw5z/era-music-group.svg?rlkey=79jse4113kcmpsjjhyoex8tjf&st=jln9pmqv&dl=1",
  //   alt: "Era Music Group",
  // },
  // {
  //   src: "https://www.dropbox.com/scl/fi/26g1u9mitl8i5f4uueu1e/sony-music.jpg?rlkey=ii6yiayapmvq5pepv1ft0z2uh&st=yu8jjoza&dl=1",
  //   alt: "Sony Music",
  // },
  // {
  //   src: "https://www.dropbox.com/scl/fi/4zau8ll95blxltst7147h/3IS-education.png?rlkey=sj89whomv0xde27l97f2tbj1g&st=kj0s4sv6&dl=1",
  //   alt: "3IS Studio",
  // },
  // {
  //   src: "https://www.dropbox.com/scl/fi/cy7f0anp46z9jppiupt6h/fader-crafters.svg?rlkey=aatsdzgwiistetmz0a9ufjl78&st=m2r6yy6b&dl=1",
  //   alt: "Fader",
  // },
  // {
  //   src: "https://www.dropbox.com/scl/fi/ywxa5wukps5lctfhogee7/universal-music.svg?rlkey=0tw8mudr4ye0x88sxg0lt4agm&st=upydstt6&dl=1",
  //   alt: "Universal Music Group",
  // },
  // {
  //   src: "https://www.dropbox.com/scl/fi/hisog418x9whynfizxjnx/because-music.svg?rlkey=u9muni5xmfy17goz1vr1gq7xs&st=g095yzm2&dl=1",
  //   alt: "Because Music",
  // },
  // ];

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
          <div className="flex flex-wrap items-center gap-3">
            {/* {labels.map((label, index) => (
              <Image
                key={index}
                src={label.src}
                alt={label.alt}
                width={120}
                height={80}
                className="object-cover w-[120px] h-full text-white"
              />
            ))} */}
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
