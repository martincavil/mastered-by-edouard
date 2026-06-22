"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { StudioPage } from "@/lib/sanity/queries";

type Locale = "fr" | "en";

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
  const position =
    direction === "prev" ? "left-2 md:left-4" : "right-2 md:right-4";

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
    <div className="flex absolute bottom-4 md:bottom-12 left-1/2 -translate-x-1/2 gap-2">
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
interface GearTextContentProps {
  gear: StudioPage["gear"];
  locale: Locale;
}

export function GearTextContent({ gear, locale }: GearTextContentProps) {
  return (
    <p className="uppercase leading-9 font-extralight text-2xl md:text-3xl xl:text-[40px]">
      <span className="text-red font-bold">MONITORING</span>{" "}
      {gear.monitoring[locale]}{" "}
      <span className="text-red font-bold">HARDWARE</span>{" "}
      {gear.hardware[locale]}
      <span className="text-red font-bold"> CONVERTER</span>{" "}
      {gear.converter[locale]}{" "}
      <span className="text-red font-bold">SOFTWARE</span>{" "}
      {gear.software[locale]}
    </p>
  );
}

// Gear Image Carousel Component
export function GearImage({ images }: { images: string[] }) {
  const { currentIndex, setCurrentIndex, goToPrevious, goToNext } = useCarousel(
    images.length,
  );

  return (
    <div className="relative group">
      <Image
        src={images[currentIndex]}
        alt={`Studio gear ${currentIndex + 1}`}
        width={584}
        height={651}
        className="w-full h-full rounded-[10px] object-cover transition-opacity duration-500 md:w-[330px] md:h-[368px] xl:w-[410px] xl:h-[456px] 2xl:w-[563px] 2xl:h-[628px] 3xl:w-[584px] 3xl:h-[651px]"
        priority={currentIndex === 0}
      />
      <CarouselNavButton direction="prev" onClick={goToPrevious} />
      <CarouselNavButton direction="next" onClick={goToNext} />
      <CarouselIndicators
        count={images.length}
        currentIndex={currentIndex}
        onSelect={setCurrentIndex}
      />
    </div>
  );
}
