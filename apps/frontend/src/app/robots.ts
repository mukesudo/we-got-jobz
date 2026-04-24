import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://we-gotjobz.com'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/auth/', '/admin/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
