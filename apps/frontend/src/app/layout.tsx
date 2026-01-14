
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import  Navbar  from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
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
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_APP_URL} />
      </head>
      <body className={inter.className}>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
      </body>
    </html>
  );
}