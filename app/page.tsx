"use client";

import "./navigation-link.css";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { PageTransition } from "@/components/page-transition";
import { Footer } from "@/components/footer";
import { NavigationCard } from "@/components/navigation-card";

export default function HomePage() {
  const t = useTranslations();

  const navigations = [
    { href: "/listen/", label: t.nav.listen, variant: "default" as const },
    {
      href: "/send-files/",
      label: t.nav.sendFiles,
      variant: "accent" as const,
    },
    { href: "/studio/", label: t.nav.studio, variant: "default" as const },
    { href: "/contact/", label: t.nav.contact, variant: "default" as const },
  ];

  return (
    <>
      <PageTransition>
        <main
          className="h-full flex flex-col justify-end relative"
          style={{
            backgroundImage: 'url("/images/homepage-cover.webp")',
            backgroundSize: "cover",
            backgroundPosition: "bottom",
          }}
        >
          {/* Overlay dégradé noir en bas */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 bottom-0 w-full z-0"
            style={{
              height: "40%",
              background:
                "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.5) 70%, transparent 100%)",
            }}
          />
          <div className="space-y-13 relative z-10 w-full">
            <div className="px-8">
              <h1 className="text-5xl md:text-8xl font-medium tracking-tight text-white">
                {t.home.title}
              </h1>
              <h2 className="text-4xl md:text-7xl text-white font-light">
                {t.home.subtitle}
              </h2>
            </div>
            {/* Navigation homepage */}
            <div className="flex gap-[10px] justify-between mt-12 mx-[10px]">
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
          <div className="relative z-10 w-full">
            <Footer color="white" />
          </div>
        </main>
      </PageTransition>
    </>
  );
}
