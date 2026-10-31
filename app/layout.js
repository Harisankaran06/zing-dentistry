import './globals.css';

export const metadata = {
  metadataBase: new URL('https://zingdentistry.in'),
  title: {
    default: 'Zing Dentistry | Dental Clinic & Dentist in Anna Nagar East, Chennai',
    template: '%s | Zing Dentistry',
  },
  description:
    'Zing Dentistry is a dental clinic in Anna Nagar East, Chennai led by Dr. Vidya. Offering microscopic root canals, laser teeth whitening, clear aligners, dental implants & family dentistry.',
  keywords: [
    'Dentist in Anna Nagar East Chennai',
    'Dental clinic in Anna Nagar',
    'Dentist in Chennai',
    'Root canal treatment in Anna Nagar',
    'Teeth whitening in Chennai',
    'Clear aligners Chennai',
    'Dental implants Chennai',
    'Pediatric dentist Anna Nagar',
    'Zing Dentistry',
  ],
  authors: [{ name: 'Dr. Vidya', url: 'https://zingdentistry.in' }],
  creator: 'Zing Dentistry',
  publisher: 'Zing Dentistry',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: 'https://zingdentistry.in',
  },
  openGraph: {
    title: 'Zing Dentistry | Dental Clinic & Dentist in Anna Nagar East, Chennai',
    description:
      'Gentle dental clinic in Anna Nagar East, Chennai. Providing laser whitening, microscopic root canals, invisible aligners, and dental implants by Dr. Vidya.',
    url: 'https://zingdentistry.in',
    siteName: 'Zing Dentistry',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/images/img.new.PNG',
        width: 1200,
        height: 630,
        alt: 'Zing Dentistry - Dental Clinic in Anna Nagar East, Chennai',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zing Dentistry | Dental Clinic in Anna Nagar East, Chennai',
    description:
      'Dental care, laser teeth whitening, microscopic root canals, and invisible aligners in Anna Nagar East, Chennai.',
    images: ['/images/img.new.PNG'],
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
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};

const clinicSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'DentalClinic',
      '@id': 'https://zingdentistry.in/#clinic',
      name: 'Zing Dentistry',
      url: 'https://zingdentistry.in',
      telephone: '+91 98415 84996',
      image: 'https://zingdentistry.in/images/img.new.PNG',
      logo: 'https://zingdentistry.in/logo/logo.new.PNG',
      description:
        'Zing Dentistry is a dental clinic in Anna Nagar East, Chennai providing dental care, laser teeth whitening, microscopic root canals, clear aligners, and dental implants.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Anna Nagar East',
        addressRegion: 'Tamil Nadu',
        addressCountry: 'IN',
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
          ],
          opens: '10:00',
          closes: '20:00',
        },
      ],
      medicalSpecialty: 'Dentistry',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://zingdentistry.in/#website',
      url: 'https://zingdentistry.in',
      name: 'Zing Dentistry',
      inLanguage: 'en-IN',
      publisher: {
        '@id': 'https://zingdentistry.in/#clinic',
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
