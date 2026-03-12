import type { Metadata } from "next";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import "./globals.css";
import { LayoutWrapper } from "@/components/layout-wrapper";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  title: "MasteredByEdouard - Professional Mastering Studio",
  description: "Professional audio mastering services in France",
  openGraph: {
    title: "MasteredByEdouard - Professional Mastering Studio",
    description: "Professional audio mastering services in France",
    url: "https://masteredbyedouard.com",
    siteName: "MasteredByEdouard",
    images: [
      {
        url: "https://www.dropbox.com/scl/fi/couz90yyav4jieidg5csd/edouard-mixing.jpeg?rlkey=mey4ia3x5kefkemlxvr165lil&st=2s09hwwm&dl=1",
        width: 1200,
        height: 630,
        alt: "Edouard Carbonne - Mastering Engineer",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MasteredByEdouard - Professional Mastering Studio",
    description: "Professional audio mastering services in France",
    images: [
      "https://www.dropbox.com/scl/fi/couz90yyav4jieidg5csd/edouard-mixing.jpeg?rlkey=mey4ia3x5kefkemlxvr165lil&st=2s09hwwm&dl=1",
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="fr" className="h-dvh overflow-hidden overflow-x-hidden">
      <body className="antialiased h-dvh overflow-hidden overflow-x-hidden flex flex-col [&:not([data-not-found])]:px-[10px] [&:not([data-not-found])]:pb-[10px]">
        {gaId && <GoogleAnalytics gaId={gaId} />}
        <LanguageProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </LanguageProvider>
      </body>
    </html>
  );
}
