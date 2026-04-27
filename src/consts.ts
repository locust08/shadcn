// Site Configuration
// Centralized configuration for site metadata, SEO, and branding

export const SITE_TITLE = 'SME Business Financing Malaysia | Ruang Bestari'
export const SITE_DESCRIPTION =
  'Working capital and business funding for registered Malaysian businesses, with repayment from 6 to 60 months and APR up to 12%.'

export const GITHUB_URL = 'https://github.com/locust08/shadcn'
export const SITE_URL = 'https://business.ruangbestari.com.my/'

export const SITE_METADATA = {
  title: {
    default: 'SME Business Financing Malaysia | Ruang Bestari'
  },
  description:
    'Working capital and business funding for registered Malaysian businesses, with repayment from 6 to 60 months and APR up to 12%.',
  keywords: [
    'SME business financing',
    'business loan Malaysia',
    'company loan',
    'working capital',
    'Ruang Bestari',
    'KPKT licensed loan',
    'business funding',
    'cash flow financing',
    'SME loan',
    'Malaysia financing'
  ],
  authors: [{ name: 'Ruang Bestari', url: SITE_URL }],
  creator: 'Ruang Bestari',
  publisher: 'Ruang Bestari',
  robots: {
    index: true,
    follow: true
  },
  language: 'en-US',
  locale: 'en_US',
  icons: {
    icon: [
      { url: '/favicon/favicon.ico', sizes: '48x48' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180' }],
    shortcut: [{ url: '/favicon/favicon.ico' }]
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Ruang Bestari',
    title: 'SME Business Financing Malaysia | Ruang Bestari',
    description:
      'Working capital and business funding for registered Malaysian businesses, with repayment from 6 to 60 months and APR up to 12%.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SME Business Financing Malaysia | Ruang Bestari',
        type: 'image/png'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ruangbestari',
    creator: '@ruangbestari',
    title: 'SME Business Financing Malaysia | Ruang Bestari',
    description:
      'Working capital and business funding for registered Malaysian businesses, with repayment from 6 to 60 months and APR up to 12%.',
    images: ['/images/og-image.png']
  },
  verification: {
    google: '', // Add your Google verification code
    yandex: '', // Add your Yandex verification code
    bing: '' // Add your Bing verification code
  }
}

// Social media links
export const SOCIAL_LINKS = {
  github: GITHUB_URL,
  twitter: '#',
  linkedin: '#',
  discord: '#'
}

// Company information for structured data
export const COMPANY_INFO = {
  name: 'Ruang Bestari',
  legalName: 'Ruang Bestari',
  url: SITE_URL,
  logo: `/images/site-logo.png`,
  foundingDate: '2024',
  address: {
    streetAddress: 'No.19-1, Jalan KS10/KU5, Taman Klang Sentral',
    addressLocality: 'Klang',
    addressRegion: 'Selangor',
    postalCode: '41050',
    addressCountry: 'MY'
  },
  contactPoint: {
    telephone: '017-8228430',
    contactType: 'customer support',
    email: 'gigigoh6767@gmail.com'
  },
  sameAs: Object.values(SOCIAL_LINKS)
}
