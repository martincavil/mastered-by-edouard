"use client";

import Image from "next/image";
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
      variant: "default" as const,
    },
    {
      href: "/send-files/",
      label: t.nav.sendFiles,
      variant: "accent" as const,
    },
    {
      href: "/studio/",
      label: t.nav.studio,
      variant: "default" as const,
    },
    {
      href: "/contact/",
      label: t.nav.contact,
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
              height: "55%",
              background:
                "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.5) 70%, transparent 100%)",
            }}
          />
          <div className="space-y-10 md:space-y-13 relative z-10 w-full">
            <div className="px-4 md:px-8">
              <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-white text-shadow-lg">
                {t.home.title}
              </h1>
              <h2 className="text-[30px]/9 md:text-7xl/11 lg:text-6xl/9 text-white text-shadow-lg font-extralight">
                {t.home.subtitle}
              </h2>
            </div>
            {/* Navigation homepage */}
            <div className="grid grid-cols-2 md:flex gap-[10px] mx-[10px] pb-[10px] md:pb-0">
              {navigations.map((nav) => (
                <NavigationCard
                  key={nav.label}
                  href={nav.href}
                  label={nav.label}
                  variant={nav.variant}
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
