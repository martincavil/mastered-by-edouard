"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function GearSubject() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Array of images - à adapter selon tes images réelles
  const images = [
    "https://www.dropbox.com/scl/fi/sjaumbxdnxdafx11poetr/gear-1.jpg?rlkey=4p854nu7cqx5un5azkm1q2j5v&st=spxmuat5&dl=1",
    "https://www.dropbox.com/scl/fi/rln1ujibt3wlzpdxep19i/gear-2.jpg?rlkey=aqrbj3dul11zlunxxt9jkotqj&st=zg6k8o76&dl=1",
    "https://www.dropbox.com/scl/fi/s8bm4eulq5k62ve4e84y5/gear-3.jpg?rlkey=of8tcxos22nya48t3igs3uxhi&st=op83y5n9&dl=1",
    "https://www.dropbox.com/scl/fi/egx642fdc5efdth7gdwal/gear-4.jpg?rlkey=ohmg198ufr1xzgpvi8p8jt2x5&st=anc9zspw&dl=1",
    "https://www.dropbox.com/scl/fi/kb8xar99b2a8saff0hmzh/gear-5.jpg?rlkey=29fkfvl3wd6gy70ko8n2yeo35&st=25vgtmud&dl=1",
    "https://www.dropbox.com/scl/fi/ppqsb4u5775tuadudjkg6/gear-6.jpg?rlkey=3u1jg5tcxwwzumwujmx4ed5t2&st=3pk1vo2w&dl=1",
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
      <div className="text-white order-1 md:order-0">
        <p className="uppercase leading-9 font-extralight text-2xl md:text-3xl xl:text-[40px]">
          <span className="text-red font-bold">MONITORING</span> ATC SCM50a SL,
          TRINNOV NOVA, SPL DMC, Ollo audio S4x, APPLE AIRPODS MAX, GIK
          acoustics <span className="text-red font-bold">HARDWARE</span> SPL PQ
          MASTERING, NEVE MASTER BUSS PROCESSOR, DANGEROUS BAX EQ, SPL Gemini
          <span className="text-red font-bold"> CONVERTER</span> Grimm UC1,
          Lavry Savitr <span className="text-red font-bold">SOFTWARE</span> AVID
          Protools, iZotope, Fabfilter, TOKYO DAWN LAB, SOFTUBE...
        </p>
      </div>
      <div className="relative w-full flex justify-center order-0 md:order-1 mb-5 md:mb-0 md:sticky md:top-0 md:self-start md:h-fit md:max-h-full">
        <div className="relative group h-full">
          {/* Image */}
          <Image
            src={images[currentIndex]}
            alt={`Studio gear ${currentIndex + 1}`}
            width={584}
            height={651}
            className="md:w-full md:h-[350px] md:max-h-[350px] xl:h-[400px] xl:max-h-[400px] 2xl:w-[584px] 2xl:h-auto 2xl:max-h-[651px] rounded-[10px] object-cover transition-opacity duration-500"
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
          <div className="flex absolute bottom-6 left-1/2 -translate-x-1/2 gap-2">
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
