"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function GearSubject() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Array of images - à adapter selon tes images réelles
  const images = [
    "https://www.dropbox.com/scl/fi/670gcts6fwz7x1sog0ugt/studio-gear-photos-1.webp?rlkey=k402wtxulryrm6kqu88tltkxa&st=gu5fiuw5&dl=1",
    "https://www.dropbox.com/scl/fi/zm0szr8qg08bpznwrsdzj/studio-gear-photos-2.webp?rlkey=hulgrq40i2ea5mmiq7f4zxghd&st=tbevomam&dl=1",
    "https://www.dropbox.com/scl/fi/y80ord2cchqlvza5daefc/studio-gear-photos-3.webp?rlkey=dugpbmn2r1tqeqmv6qk8lm12b&st=nuqy3cdx&dl=1",
    "https://www.dropbox.com/scl/fi/vwvr9mk0q5zcjgxrr2bug/studio-gear-photos-4.webp?rlkey=hcxngfiazvnf2mdilkjcv9r5y&st=1cy4i3ze&dl=1",
  ];

  // Auto-scroll every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <>
      <div className="text-white overflow-y-auto md:overflow-y-visible">
        <p className="uppercase leading-9 font-light text-2xl md:text-[40px]">
          <span className="text-red font-bold">MONITORING</span> ATC SCM50a SL,
          TRINNOV NOVA, SPL DMC, Ollo audio S4x, APPLE AIRPODS MAX, GIK
          acoustics <span className="text-red font-bold">HARDWARE</span> SPL PQ
          MASTERING, NEVE MASTER BUSS PROCESSOR, DANGEROUS BAX EQ, SPL Gemini
          <span className="text-red font-bold">CONVERTER</span> Grimm UC1, Lavry
          Savitr <span className="text-red font-bold">SOFTWARE</span> AVID
          Protools, iZotope, Fabfilter, TOKYO DAWN LAB, SOFTUBE...
        </p>
      </div>
      <div className="hidden md:flex relative w-full h-full min-h-0 justify-center overflow-hidden">
        <div className="relative group h-full">
          {/* Image */}
          <Image
            src={images[currentIndex]}
            alt={`Studio gear ${currentIndex + 1}`}
            width={584}
            height={651}
            className="md:w-full md:h-[400px] 2xl:w-[584px] 2xl:h-[651px] rounded-[10px] object-cover transition-opacity duration-500"
            priority={currentIndex === 0}
          />
          {/* Navigation arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Image précédente"
          >
            <ChevronLeft size={32} strokeWidth={1.5} />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Image suivante"
          >
            <ChevronRight size={32} strokeWidth={1.5} />
          </button>

          {/* Indicators dots */}
          <div className="flex absolute bottom-4 left-1/2 -translate-x-1/2 gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-white w-8"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Aller à l'image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
