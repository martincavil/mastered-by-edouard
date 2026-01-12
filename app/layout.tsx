import type { Metadata } from "next";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import "./globals.css";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "MasteredByEdouard - Professional Mastering Studio",
  description: "Professional audio mastering services in France",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-screen overflow-hidden">
      <body className="antialiased h-screen overflow-hidden px-[10px] pb-[10px] flex flex-col">
        <LanguageProvider>
          <Navbar />
          <div className="flex-1 rounded-[10px] overflow-hidden">
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
