import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { Analytics } from '@vercel/analytics/react';

import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';

import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});

export const metadata: Metadata = {
  title: {
    default: 'We Got Jobz - Hire Top Freelancers & Find Remote Work',
    template: '%s | We Got Jobz'
  },
  description:
    'We Got Jobz is the premier freelance marketplace connecting businesses with talented professionals worldwide. Find expert developers, designers, writers, and more. Secure escrow payments, verified reviews, and seamless project management.',
  keywords: [
    'freelance marketplace',
    'hire freelancers',
    'find remote work',
    'freelance jobs',
    'remote work',
    'contract work',
    'gig economy',
    'freelance platform',
    'hire developers',
    'hire designers',
    'escrow payments',
    'secure payments',
    'verified freelancers',
    'project management',
    'remote talent',
    'global freelancers'
  ],
  authors: [{ name: 'We Got Jobz' }],
  creator: 'We Got Jobz',
  publisher: 'We Got Jobz',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://we-gotjobz.com',
    title: 'We Got Jobz - Hire Top Freelancers & Find Remote Work',
    description: 'Connect with top-rated freelancers for your projects. Secure escrow payments, verified reviews, and seamless collaboration.',
    siteName: 'We Got Jobz',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'We Got Jobz - Freelance Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'We Got Jobz - Hire Top Freelancers & Find Remote Work',
    description: 'Connect with top-rated freelancers for your projects. Secure escrow payments, verified reviews, and seamless collaboration.',
    images: ['/og-image.png'],
    creator: '@wegotjobz',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL || 'https://we-gotjobz.com',
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geistSans.variable}>
        <div className="fixed inset-0 -z-10 h-full w-full bg-gray-50 overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-blue-100 opacity-60 blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-5%] h-[500px] w-[500px] rounded-full bg-purple-100 opacity-60 blur-3xl" />
          <div className="absolute left-[30%] top-[40%] h-[300px] w-[300px] rounded-full bg-pink-100 opacity-40 blur-3xl" />
        </div>

        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <Toaster />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
