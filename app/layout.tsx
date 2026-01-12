import type { Metadata } from 'next';
import { LanguageProvider } from '@/lib/i18n/LanguageProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'MasteredByEdouard - Professional Mastering Studio',
  description: 'Professional audio mastering services in France',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
