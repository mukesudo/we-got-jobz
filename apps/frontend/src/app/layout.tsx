import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';

import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';

import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
});

export const metadata: Metadata = {
  title: 'We got jobz - Hire Talented Freelancers',
  description:
    'Connect with top-rated freelancers and complete your projects on time. Post jobs, receive bids, and manage contracts seamlessly.',
  keywords: 'freelance, marketplace, hire, projects, freelancers',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    title: 'We-got-jobz',
    description: 'Connect with top-rated freelancers for your projects',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://we-gotjobz.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'We-got-jobz',
    description: 'Connect with top-rated freelancers for your projects',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL || 'https://we-gotjobz.com',
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
      </body>
    </html>
  );
}
