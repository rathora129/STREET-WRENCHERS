import { Sora, Inter } from 'next/font/google';
import StyledComponentsRegistry from './registry';
import Providers from './providers';
import { SITE_URL } from '@/lib/site';

const display = Sora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Street Wrenchers — Premium Auto Care in Dubai',
    template: '%s | Street Wrenchers',
  },
  description:
    'Multi-brand automotive service centre in Dubai, UAE — scheduled maintenance, mechanical and engine repair, AC, brakes, detailing, PPF and annual maintenance plans.',
  applicationName: 'Street Wrenchers',
  keywords: [
    'car service Dubai',
    'auto repair Dubai',
    'minor service',
    'major service',
    'AC repair',
    'car detailing Dubai',
    'PPF Dubai',
    'AMC Dubai',
  ],
  icons: {
    icon: [
      { url: '/assets/icons/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/assets/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/assets/icons/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    siteName: 'Street Wrenchers',
    title: 'Street Wrenchers — Premium Auto Care in Dubai',
    description:
      'Scheduled maintenance, mechanical repair, detailing and annual maintenance plans for every make and model in Dubai.',
    images: [{ url: '/assets/banners/og-default.jpg', width: 1200, height: 630, alt: 'Street Wrenchers' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Street Wrenchers — Premium Auto Care in Dubai',
    description: 'Precision. Performance. Reliability.',
    images: ['/assets/banners/og-default.jpg'],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
};

export const viewport = {
  themeColor: '#08080a',
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'dark',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <StyledComponentsRegistry>
          <Providers>{children}</Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
