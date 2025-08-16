import { Metadata } from 'next'

// Base SEO configuration
export const siteConfig = {
  name: 'Developer Portfolio',
  title: 'Modern Developer Portfolio | Full-Stack Development',
  description: 'Professional developer portfolio showcasing modern web applications, full-stack projects, and technical expertise in React, Next.js, TypeScript, and more.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio.dev',
  ogImage: '/og-image.jpg',
  creator: 'Developer Name',
  keywords: [
    'developer portfolio',
    'full-stack developer',
    'web development',
    'React developer',
    'Next.js',
    'TypeScript',
    'JavaScript',
    'frontend development',
    'backend development',
    'software engineer',
    'web applications',
    'modern web development'
  ],
  authors: [
    {
      name: 'Developer Name',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio.dev',
    }
  ],
  social: {
    twitter: '@developer',
    github: 'https://github.com/developer',
    linkedin: 'https://linkedin.com/in/developer',
  }
}

// Generate metadata for pages
export function generateMetadata({
  title,
  description,
  image,
  url,
  type = 'website',
  noIndex = false,
}: {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  noIndex?: boolean
}): Metadata {
  const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title
  const metaDescription = description || siteConfig.description
  const metaImage = image || siteConfig.ogImage
  const metaUrl = url ? `${siteConfig.url}${url}` : siteConfig.url

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: siteConfig.keywords,
    authors: siteConfig.authors,
    creator: siteConfig.creator,
    openGraph: {
      type,
      locale: 'en_US',
      url: metaUrl,
      title: metaTitle,
      description: metaDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
      creator: siteConfig.social.twitter,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_VERIFICATION,
    },
    alternates: {
      canonical: metaUrl,
    },
  }
}

// Generate JSON-LD structured data
export function generatePersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.creator,
    url: siteConfig.url,
    sameAs: [
      siteConfig.social.github,
      siteConfig.social.linkedin,
      siteConfig.social.twitter.replace('@', 'https://twitter.com/'),
    ],
    jobTitle: 'Full-Stack Developer',
    worksFor: {
      '@type': 'Organization',
      name: 'Freelance',
    },
    description: siteConfig.description,
    image: `${siteConfig.url}/profile-photo.jpg`,
    knowsAbout: [
      'Web Development',
      'JavaScript',
      'TypeScript',
      'React',
      'Next.js',
      'Node.js',
      'Full-Stack Development',
      'Frontend Development',
      'Backend Development',
    ],
  }
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    author: {
      '@type': 'Person',
      name: siteConfig.creator,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteConfig.url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generateProjectSchema(project: {
  title: string
  description: string
  url?: string
  githubUrl?: string
  techStack: string[]
  imageUrl?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title,
    description: project.description,
    url: project.url,
    codeRepository: project.githubUrl,
    programmingLanguage: project.techStack,
    author: {
      '@type': 'Person',
      name: siteConfig.creator,
    },
    image: project.imageUrl ? `${siteConfig.url}${project.imageUrl}` : undefined,
    applicationCategory: 'WebApplication',
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  }
}