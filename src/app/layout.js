import {
  Cormorant_Garamond,
  Great_Vibes,
  Playfair_Display,
  Lora,
} from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-great-vibes',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-lora',
  display: 'swap',
});

export const metadata = {
  title: 'Debolina & Anirban — Engagement Ceremony',
  description:
    'You are cordially invited to celebrate the engagement ceremony of Debolina Das & Anirban Majumdar. Friday, 07 August 2026 at Birnagar Sporting Club.',
  openGraph: {
    title: 'Debolina & Anirban — Engagement Ceremony',
    description: 'Save the Date — Friday, 07 August 2026',
    images: ['/meta_banner.png'],
    type: 'website',
  },
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical first frames for instant canvas paint */}
        <link rel="preload" as="image" href="/frames-mobile/ezgif-frame-001.jpg" media="(max-width: 768px)" crossOrigin="anonymous" />
        <link rel="preload" as="image" href="/frames-mobile/ezgif-frame-002.jpg" media="(max-width: 768px)" crossOrigin="anonymous" />
        <link rel="preload" as="image" href="/frames-mobile/ezgif-frame-003.jpg" media="(max-width: 768px)" crossOrigin="anonymous" />
        <link rel="preload" as="image" href="/frames-desktop/ezgif-frame-001.jpg" media="(min-width: 769px)" crossOrigin="anonymous" />
        <link rel="preload" as="image" href="/frames-desktop/ezgif-frame-002.jpg" media="(min-width: 769px)" crossOrigin="anonymous" />
        <link rel="preload" as="image" href="/frames-desktop/ezgif-frame-003.jpg" media="(min-width: 769px)" crossOrigin="anonymous" />
      </head>
      <body
        className={`${cormorant.variable} ${greatVibes.variable} ${playfair.variable} ${lora.variable}`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
