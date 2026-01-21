"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "@/lib/i18n/useTranslations";

interface MobileMenuProps {
  color?: "white" | "black";
}

export function MobileMenu({ color = "white" }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();

  const menuTextColor = "text-white";
  const bgColor = "bg-[#161616]";

  return (
    <div className="md:hidden">
      {/* Chevron Button on white bar */}
      <div className="bg-white rounded-b-[10px]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-center items-center text-black hover:text-red transition-colors"
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transform transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      </div>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed inset-x-0 bottom-0 ${bgColor} z-50 px-5 pb-5 py-7 shadow-2xl rounded-t-[10px]`}
          >
            {/* Close button - Chevron down */}
            <div className="flex justify-center mb-4">
              <button
                onClick={() => setIsOpen(false)}
                className={`${menuTextColor} hover:text-red transition-colors`}
                aria-label="Fermer le menu"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>

            {/* Menu Content */}
            <nav>
              <div className="flex flex-col items-center gap-4">
                <Link
                  href="https://www.instagram.com/masteredbyedouard/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${menuTextColor} hover:text-red transition-colors text-lg`}
                  onClick={() => setIsOpen(false)}
                >
                  Instagram
                </Link>
                <Link
                  href="https://credits.muso.ai/profile/83085fe9-a37a-493e-b0ac-1a62bf76590f"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${menuTextColor} hover:text-red transition-colors text-lg`}
                  onClick={() => setIsOpen(false)}
                >
                  Muso.AI
                </Link>
                <Link
                  href="/faq/"
                  className={`${menuTextColor} hover:text-red transition-colors text-2xl font-bold`}
                  onClick={() => setIsOpen(false)}
                >
                  {t.footer.faq}
                </Link>
              </div>
              <div className="h-[0.5px] w-full bg-white mt-10 mb-4" />
              <div className="flex justify-between items-end">
                {/* Copyright */}
                <p className={`${menuTextColor} text-sm`}>
                  Mastered by Edouard 2026 ©
                </p>
                <div className="flex flex-col justify-end space-y-2 text-right">
                  <Link
                    href="/general-terms-and-conditions/"
                    className={`${menuTextColor} hover:text-red transition-colors text-sm underline`}
                    onClick={() => setIsOpen(false)}
                  >
                    {t.footer.terms}
                  </Link>
                  <Link
                    href="/legal-notice/"
                    className={`${menuTextColor} hover:text-red transition-colors text-sm underline`}
                    onClick={() => setIsOpen(false)}
                  >
                    {t.footer.legalnotice}
                  </Link>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
