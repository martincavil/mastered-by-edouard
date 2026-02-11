"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Constants
const GEAR_IMAGES = [
  "https://www.dropbox.com/scl/fi/sjaumbxdnxdafx11poetr/gear-1.jpg?rlkey=4p854nu7cqx5un5azkm1q2j5v&st=spxmuat5&dl=1",
  "https://www.dropbox.com/scl/fi/rln1ujibt3wlzpdxep19i/gear-2.jpg?rlkey=aqrbj3dul11zlunxxt9jkotqj&st=zg6k8o76&dl=1",
  "https://www.dropbox.com/scl/fi/s8bm4eulq5k62ve4e84y5/gear-3.jpg?rlkey=of8tcxos22nya48t3igs3uxhi&st=op83y5n9&dl=1",
  "https://www.dropbox.com/scl/fi/egx642fdc5efdth7gdwal/gear-4.jpg?rlkey=ohmg198ufr1xzgpvi8p8jt2x5&st=anc9zspw&dl=1",
  "https://www.dropbox.com/scl/fi/kb8xar99b2a8saff0hmzh/gear-5.jpg?rlkey=29fkfvl3wd6gy70ko8n2yeo35&st=25vgtmud&dl=1",
  "https://www.dropbox.com/scl/fi/ppqsb4u5775tuadudjkg6/gear-6.jpg?rlkey=3u1jg5tcxwwzumwujmx4ed5t2&st=3pk1vo2w&dl=1",
];

const GEAR_EQUIPMENT = {
  monitoring:
    "ATC SCM50a SL, TRINNOV NOVA, SPL DMC, Ollo audio S4x, APPLE AIRPODS MAX, GIK acoustics",
  hardware:
    "SPL PQ MASTERING, NEVE MASTER BUSS PROCESSOR, DANGEROUS BAX EQ, SPL Gemini",
  converter: "Grimm UC1, Lavry Savitr",
  software: "AVID Protools, iZotope, Fabfilter, TOKYO DAWN LAB, SOFTUBE...",
};

// Custom hook for carousel logic
function useCarousel(itemsCount: number, autoScrollInterval = 4000) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % itemsCount);
    }, autoScrollInterval);

    return () => clearInterval(interval);
  }, [itemsCount, autoScrollInterval]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + itemsCount) % itemsCount);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % itemsCount);
  };

  return { currentIndex, setCurrentIndex, goToPrevious, goToNext };
}

// Carousel Navigation Buttons
interface CarouselNavButtonProps {
  direction: "prev" | "next";
  onClick: () => void;
}

function CarouselNavButton({ direction, onClick }: CarouselNavButtonProps) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  const label = direction === "prev" ? "Image précédente" : "Image suivante";
  const position = direction === "prev" ? "left-4" : "right-4";

  return (
    <button
      onClick={onClick}
      className={`absolute ${position} top-1/2 -translate-y-1/2 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100`}
      aria-label={label}
    >
      <Icon size={32} strokeWidth={1.5} />
    </button>
  );
}

// Carousel Indicators
interface CarouselIndicatorsProps {
  count: number;
  currentIndex: number;
  onSelect: (index: number) => void;
}

function CarouselIndicators({
  count,
  currentIndex,
  onSelect,
}: CarouselIndicatorsProps) {
  return (
    <div className="flex absolute bottom-6 left-1/2 -translate-x-1/2 gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            index === currentIndex
              ? "bg-white w-8"
              : "bg-white/50 hover:bg-white/75"
          }`}
          aria-label={`Aller à l'image ${index + 1}`}
        />
      ))}
    </div>
  );
}

// Gear Text Content Component
export function GearTextContent() {
  return (
    <p className="uppercase leading-9 font-extralight text-2xl md:text-3xl xl:text-[40px]">
      <span className="text-red font-bold">MONITORING</span>{" "}
      {GEAR_EQUIPMENT.monitoring}{" "}
      <span className="text-red font-bold">HARDWARE</span>{" "}
      {GEAR_EQUIPMENT.hardware}
      <span className="text-red font-bold"> CONVERTER</span>{" "}
      {GEAR_EQUIPMENT.converter}{" "}
      <span className="text-red font-bold">SOFTWARE</span>{" "}
      {GEAR_EQUIPMENT.software}
    </p>
  );
}

// Gear Image Carousel Component
export function GearImage() {
  const { currentIndex, setCurrentIndex, goToPrevious, goToNext } = useCarousel(
    GEAR_IMAGES.length,
  );

  return (
    <div className="relative group h-full flex">
      <Image
        src={GEAR_IMAGES[currentIndex]}
        alt={`Studio gear ${currentIndex + 1}`}
        width={584}
        height={651}
        className="w-full h-full rounded-[10px] object-cover transition-opacity duration-500 md:w-[330px] md:h-[368px] xl:w-[424px] xl:h-[472px] 2xl:w-[584px] 2xl:h-[651px]"
        priority={currentIndex === 0}
      />
      <CarouselNavButton direction="prev" onClick={goToPrevious} />
      <CarouselNavButton direction="next" onClick={goToNext} />
      <CarouselIndicators
        count={GEAR_IMAGES.length}
        currentIndex={currentIndex}
        onSelect={setCurrentIndex}
      />
    </div>
  );
}
