import type { Metadata } from "next";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import "./globals.css";
import { LayoutWrapper } from "@/components/layout-wrapper";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  title: "MasteredByEdouard - Professional Mastering Studio",
  description: "Professional audio mastering services in France",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="fr" className="h-screen overflow-hidden">
      <body className="antialiased h-screen overflow-hidden flex flex-col [&:not([data-not-found])]:px-[10px] [&:not([data-not-found])]:pb-[10px]">
        {gaId && <GoogleAnalytics gaId={gaId} />}
        <LanguageProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </LanguageProvider>
      </body>
    </html>
  );
}
