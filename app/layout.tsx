import '../styles/globals.css';
import '../config/games.config';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'GachaHub',
    template: '%s | GachaHub',
  },
  description: 'A unified multi-game gacha platform.',
  openGraph: {
    type: 'website',
    siteName: 'GachaHub',
    title: 'GachaHub',
    description: 'A unified multi-game gacha platform.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GachaHub',
    description: 'A unified multi-game gacha platform.',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://picsum.photos" />
        <link rel="preconnect" href="https://sgimage.netmarble.com" />
        <link rel="preconnect" href="https://images.pexels.com" />
        <link rel="dns-prefetch" href="https://picsum.photos" />
        <link rel="dns-prefetch" href="https://sgimage.netmarble.com" />
        <link rel="dns-prefetch" href="https://images.pexels.com" />
      </head>
      <body>{children}</body>
    </html>
  );
}
