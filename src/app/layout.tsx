import type { Metadata, Viewport } from 'next';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Frühchen Schweiz — Gemeinsam stark',
    template: '%s | Frühchen Schweiz',
  },
  description:
    'Die digitale Begleitung für Familien mit Frühgeborenen und Neokindern in der Schweiz. Tagebuch, Glossar, Peer Support, Events und mehr.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Frühchen Schweiz',
  },
  openGraph: {
    type: 'website',
    locale: 'de_CH',
    siteName: 'Frühchen Schweiz',
    title: 'Frühchen Schweiz — Gemeinsam stark',
    description:
      'Die digitale Begleitung für Familien mit Frühgeborenen und Neokindern in der Schweiz.',
  },
};

export const viewport: Viewport = {
  themeColor: '#F97316',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" className="h-full">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="h-full">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              borderRadius: '1rem',
              padding: '1rem',
              fontSize: '0.875rem',
            },
          }}
        />
      </body>
    </html>
  );
}
