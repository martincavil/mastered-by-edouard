"use client";

import { useTranslations } from "@/lib/i18n/useTranslations";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ArrowUpRight } from "@/components/icons/ArrowUpRight";

export function PrepareFiles() {
  const t = useTranslations();
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      title: t.sendFiles.prepareFiles.step1Title,
      content1: t.sendFiles.prepareFiles.step1Content.step1Content1,
      content2: t.sendFiles.prepareFiles.step1Content.step1Content2,
      content3: t.sendFiles.prepareFiles.step1Content.step1Content3,
    },
    {
      title: t.sendFiles.prepareFiles.step2Title,
      content1: t.sendFiles.prepareFiles.step2Content.step2Content1,
      content2: t.sendFiles.prepareFiles.step2Content.step2Content2,
      content3: t.sendFiles.prepareFiles.step2Content.step2Content3,
    },
    {
      title: t.sendFiles.prepareFiles.step3Title,
      content1: t.sendFiles.prepareFiles.step3Content.step3Content1,
      content2: t.sendFiles.prepareFiles.step3Content.step3Content2,
      image:
        "https://www.dropbox.com/scl/fi/l2wwct3hb9rz8esupxef7/send-files-the-naming.png?rlkey=xi9sbt216hea3k4xw2hwjqoit&st=aq1fn09s&dl=1",
    },
    {
      title: t.sendFiles.prepareFiles.step4Title,
      content1: t.sendFiles.prepareFiles.step4Content.step4Content1,
      content2: t.sendFiles.prepareFiles.step4Content.step4Content2,
    },
  ];

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(4, prev + 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <>
      <div className="flex flex-col space-y-3">
        {/* White container with carousel */}
        <div className="relative bg-white overflow-hidden p-5 rounded-[10px] h-[350px] max-h-[350px] 2xl:h-full 2xl:max-h-[700px] flex flex-col">
          {/* Content */}
          <div
            key={currentStep}
            className="flex-1 flex flex-col space-y-4 animate-slide-in overflow-y-auto"
          >
            <h2 className="text-3xl 2xl:text-6xl font-bold text-black">
              {steps[currentStep - 1].title}
            </h2>

            {/* Steps 1 and 2: List */}
            {(currentStep === 1 || currentStep === 2) && (
              <ul className="md:pl-32 font-poppins md:pr-16 space-y-5 list-disc list-inside leading-[1] 2xl:text-xl">
                <li>{steps[currentStep - 1].content1}</li>
                {steps[currentStep - 1].content2 && (
                  <li>{steps[currentStep - 1].content2}</li>
                )}
                {steps[currentStep - 1].content3 && (
                  <li>{steps[currentStep - 1].content3}</li>
                )}
              </ul>
            )}

            {/* Steps 3 and 4: Simple text */}
            {(currentStep === 3 || currentStep === 4) && (
              <div className="md:pl-32 font-poppins md:pr-16 space-y-5 leading-[1] 2xl:text-xl">
                <p>{steps[currentStep - 1].content1}</p>
                {steps[currentStep - 1].content2 && (
                  <p>{steps[currentStep - 1].content2}</p>
                )}
              </div>
            )}

            {steps[currentStep - 1].image && (
              <div className="flex items-end justify-end mt-5 2xl:mt-8">
                <Image
                  src={steps[currentStep - 1].image!}
                  alt={`Step ${currentStep} Illustration`}
                  width={350}
                  height={160}
                  className="object-cover"
                />
              </div>
            )}
          </div>

          {/* Step indicator */}
          <div className="font-poppins absolute -left-2 -bottom-3 translate-y-[10%] leading-none">
            <span className="text-[50px] text-black font-extrabold leading-none block">
              <span className="text-7xl lg:text-[200px] 2xl:text-[250px] leading-none">
                {currentStep}
              </span>
              <span className="leading-none">/4</span>
            </span>
          </div>

          <div className="flex items-end justify-end">
            {/* Dots navigation */}
            <div className="flex items-center justify-center gap-0">
              <button onClick={prevStep} disabled={currentStep === 1}>
                <ChevronLeft
                  size={36}
                  className={currentStep === 1 ? "text-white" : "text-black"}
                />
              </button>
              <div className="flex items-center justify-center gap-2">
                {steps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToStep(index + 1)}
                    className={`w-5 h-5 rounded-full transition-all border border-black ${
                      currentStep === index + 1 ? "bg-black" : "bg-transparent"
                    }`}
                  />
                ))}
              </div>
              <button onClick={nextStep} disabled={currentStep === 4}>
                <ChevronRight
                  size={36}
                  className={currentStep === 4 ? "text-white" : "text-black"}
                />
              </button>
            </div>
          </div>
        </div>
        {/* Upload files button */}
        <Link
          href="?tab=audio-files"
          className="bg-red-dark text-white font-bold text-base 2xl:text-lg px-6 xl:px-8 py-2.5 xl:py-3 rounded-[10px] hover:bg-red-dark/90 transition-colors duration-300 flex items-center justify-center gap-2"
        >
          {t.sendFiles.prepareFiles.uploadFiles}
          <ArrowUpRight size={20} />
        </Link>
      </div>

      {/* Right Column - Illustration */}
      <div className="hidden md:flex flex-col items-center md:items-end justify-between space-y-4 2xl:space-y-20">
        <div className="flex flex-col self-start">
          <span className="text-5xl lg:text-7xl xl:text-[90px] 2xl:text-[100px] font-bold text-white !leading-[0.8]">
            {t.sendFiles.prepareFiles.headline1}
          </span>
          <span className="text-5xl lg:text-7xl xl:text-[90px] 2xl:text-[100px] font-bold text-black !leading-[0.8]">
            {t.sendFiles.prepareFiles.headline2}
          </span>
        </div>
        <Image
          src="https://www.dropbox.com/scl/fi/iwj6fuky5hk2my2qa0pa7/send-files.webp?rlkey=ucreqy7vx1p7mhahrv6hatzgc&st=3u0iinfy&dl=1"
          alt="Edouard SendFiles Illustration"
          width={271}
          height={271}
          className="object-cover w-48 h-48 xl:w-56 xl:h-56 2xl:w-[271px] 2xl:h-[271px]"
        />
      </div>
    </>
  );
}
