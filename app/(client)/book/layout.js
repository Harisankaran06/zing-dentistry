export const metadata = {
  title: 'Book a Dental Appointment in Anna Nagar East',
  description:
    'Schedule your dental appointment with Dr. Vidya at Zing Dentistry, Anna Nagar East, Chennai. Convenient consultation slots for teeth whitening, root canal, aligners & cleanings.',
  alternates: {
    canonical: 'https://zingdentistry.in/book',
  },
  openGraph: {
    title: 'Book a Dental Appointment in Anna Nagar East | Zing Dentistry Chennai',
    description:
      'Schedule your dental visit with Dr. Vidya at Zing Dentistry, Anna Nagar East, Chennai. Mon–Sat: 10:00 AM – 8:00 PM. Call +91 98415 84996.',
    url: 'https://zingdentistry.in/book',
    type: 'website',
    images: [
      {
        url: '/images/img.new.PNG',
        width: 1200,
        height: 630,
        alt: 'Book Appointment at Zing Dentistry Anna Nagar East, Chennai',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book a Dental Appointment | Zing Dentistry Anna Nagar East',
    description:
      'Schedule your visit at Zing Dentistry in Anna Nagar East, Chennai. Call +91 98415 84996.',
    images: ['/images/img.new.PNG'],
  },
};

export default function BookLayout({ children }) {
  return children;
}

