"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { MobileMenu } from "@/components/mobile-menu";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isNotFoundPage, setIsNotFoundPage] = useState(false);
  const pathname = usePathname();

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

  // Pages with black background should have red mobile menu
  const redMenuPages = ["/listen", "/studio", "/contact", "/terms-and-conditions", "/legal-notice", "/faq"];
  const isRedMenuPage = redMenuPages.some(page => pathname?.startsWith(page));

  if (isNotFoundPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <div className="flex-1 rounded-[10px] overflow-hidden">{children}</div>
      <MobileMenu color="white" variant={isRedMenuPage ? "red" : "default"} />
    </>
  );
}
