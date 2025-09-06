import type { Metadata } from 'next'
import { Poppins, Open_Sans } from 'next/font/google'
import './globals.css'
import Providers from './providers'

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
})

const openSans = Open_Sans({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-open-sans',
})

export const metadata: Metadata = {
  title: 'TourGuide AI - Connect with Local Tour Guides',
  description: 'AI-powered platform connecting travelers with verified local personal tour guides for authentic, personalized experiences. Discover unique local insights and earn by sharing your expertise.',
  keywords: 'tour guide, travel, local experiences, AI matching, personal guides, travel platform, authentic travel',
  authors: [{ name: 'TourGuide AI Team' }],
  creator: 'TourGuide AI',
  publisher: 'TourGuide AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://tourguide-ai.com'),
  openGraph: {
    title: 'TourGuide AI - Connect with Local Tour Guides',
    description: 'AI-powered platform connecting travelers with verified local personal tour guides for authentic experiences.',
    url: 'https://tourguide-ai.com',
    siteName: 'TourGuide AI',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TourGuide AI - Connect with Local Experts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TourGuide AI - Connect with Local Tour Guides',
    description: 'AI-powered platform connecting travelers with verified local personal tour guides.',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-verification-token',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${openSans.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3B82F6" />
      </head>
      <body className="font-sans antialiased scroll-smooth bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        <div id="root" className="relative">
          <Providers>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  )
}
