"use client";
import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { useTranslations } from "@/lib/i18n/useTranslations";

export function LandscapeWarning() {
  const [showWarning, setShowWarning] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    const checkOrientation = () => {
      const isMobile = window.innerWidth < 950;
      const isLandscape = window.innerHeight < window.innerWidth;
      setShowWarning(isMobile && isLandscape);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 bg-black opacity-90 z-[9999] flex flex-col items-center justify-center text-white">
      <RotateCcw size={64} className="mb-4" />
      <p className="text-xl text-center px-8">{t.landscapeWarning.message}</p>
    </div>
  );
}
