"use client";

import Image from "next/image";
import "./navigation-link.css";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { PageTransition } from "@/components/page-transition";
import { Footer } from "@/components/footer";
import { NavigationCard } from "@/components/navigation-card";

export default function HomePage() {
  const t = useTranslations();

  const navigations = [
    {
      href: "/listen/",
      label: t.nav.listen,
      order: 1,
      variant: "default" as const,
    },
    {
      href: "/send-files/",
      label: t.nav.sendFiles,
      order: 2,
      variant: "accent" as const,
    },
    {
      href: "/studio/",
      label: t.nav.studio,
      order: 3,
      variant: "default" as const,
    },
    {
      href: "/contact/",
      label: t.nav.contact,
      order: 4,
      variant: "default" as const,
    },
  ];

  return (
    <>
      <PageTransition>
        <main className="h-full flex flex-col justify-end relative">
          <Image
            src="https://www.dropbox.com/scl/fi/idxk92xsl4vwhymcz8uj8/homepage-cover.webp?rlkey=655enr16z3tymf6ucfqiygmed&st=tdig6bil&dl=1"
            alt="Homepage background"
            fill
            priority
            quality={90}
            sizes="100vw"
            style={{
              objectFit: "cover",
              objectPosition: "bottom",
              zIndex: 0,
            }}
          />
          {/* Overlay dégradé noir en bas */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 bottom-0 w-full z-[1]"
            style={{
              height: "40%",
              background:
                "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.5) 70%, transparent 100%)",
            }}
          />
          <div className="space-y-10 md:space-y-13 relative z-10 w-full">
            <div className="px-4 md:px-8">
              <h1 className="text-6xl md:text-8xl font-medium tracking-tight text-white">
                {t.home.title}
              </h1>
              <h2 className="text-[45px]/9 md:text-7xl/9  text-white font-light">
                {t.home.subtitle}
              </h2>
            </div>
            {/* Navigation homepage */}
            <div className="grid grid-cols-3 md:flex gap-[10px] mx-[10px] pb-[10px] md:pb-0">
              {navigations
                .sort((a, b) => a.order - b.order)
                .map((nav) => (
                  <NavigationCard
                    key={nav.label}
                    href={nav.href}
                    label={nav.label}
                    variant={nav.variant}
                    className={
                      nav.order === 2
                        ? "col-span-3 order-4 md:order-2"
                        : nav.order === 1
                        ? "order-1 md:order-1"
                        : nav.order === 3
                        ? "order-2 md:order-3"
                        : "order-3 md:order-4"
                    }
                  />
                ))}
            </div>
          </div>
          <div className="relative z-10 w-full hidden md:block">
            <Footer color="white" />
          </div>
        </main>
      </PageTransition>
    </>
  );
}
