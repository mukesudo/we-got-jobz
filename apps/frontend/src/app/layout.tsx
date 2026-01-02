// Next.js 15 Frontend Layout & Auth Setup


import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import { Navbar } from '@/components/layout/navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'We-got-jobz - Hire Talented Freelancers',
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
async function getHealth() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://automatic-barnacle-7pjx99qqxx4fxjrv-3000.app.github.dev'}/health`, {
    cache: "no-store",
  });
  return res.json();
}


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const health = await getHealth();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_APP_URL} />
      </head>
      <body className={inter.className}>
        <pre>{JSON.stringify(health, null, 2)}</pre>
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
