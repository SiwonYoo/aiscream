import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ModalInitializer from '@/components/common/ModalInitializer';
import GlobalModal from '@/components/modal/GlobalModal';
import { ThemeProvider } from 'next-themes';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aiscream.vercel.app').replace(/\/$/, '');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: 'AiScReam',
    template: '%s | AiScReam',
  },
  description: '글이 시작되는 소리, AiScReam',

  openGraph: {
    title: 'AiScReam',
    description: '글이 시작되는 소리, AiScReam',
    url: siteUrl,
    siteName: 'AiScReam',
    type: 'website',
    images: [
      {
        url: '/AiScReam-OG.jpg',
        width: 1200,
        height: 630,
        alt: 'AiScReam',
      },
    ],
  },

  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider attribute={'class'} defaultTheme="system" enableSystem>
          <ModalInitializer />
          <div id="app-root" className="flex min-h-screen flex-col antialiased">
            {children}
            <GlobalModal />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
