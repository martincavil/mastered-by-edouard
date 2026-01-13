"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { MobileMenu } from "@/components/mobile-menu";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isNotFoundPage, setIsNotFoundPage] = useState(false);

  useEffect(() => {
    // Check if body has data-not-found attribute
    const observer = new MutationObserver(() => {
      setIsNotFoundPage(document.body.hasAttribute("data-not-found"));
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-not-found"],
    });

    // Initial check
    setIsNotFoundPage(document.body.hasAttribute("data-not-found"));

    return () => observer.disconnect();
  }, []);

  if (isNotFoundPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <div className="flex-1 rounded-[10px] overflow-hidden">{children}</div>
      <MobileMenu color="white" />
    </>
  );
}
