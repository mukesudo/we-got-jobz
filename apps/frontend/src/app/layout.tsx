


import type { Metadata, Viewport } from 'next';

import { Inter } from 'next/font/google';

import Navbar from '@/components/layout/navbar';

import Footer from '@/components/layout/footer';

import { Toaster } from "@/components/ui/toaster"

import './globals.css';



const inter = Inter({ subsets: ['latin'] });



export const metadata: Metadata = {

  title: 'We got jobz - Hire Talented Freelancers',

  description: 'Connect with top-rated freelancers and complete your projects on time. Post jobs, receive bids, and manage contracts seamlessly.',

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

      <body className={inter.className}>

          <div className="fixed inset-0 -z-10 h-full w-full bg-gray-50 overflow-hidden">

            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-100 blur-3xl opacity-60" />

            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-purple-100 blur-3xl opacity-60" />

            <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full bg-pink-100 blur-3xl opacity-40" />

          </div>

          <div className="flex flex-col min-h-screen">

            <Navbar />

            <main className="flex-grow">

              {children}

            </main>

            <Footer />

            <Toaster />

          </div>

      </body>

    </html>

  );

}
