import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SERVICES, getServiceBySlug } from '@/lib/servicesData';
import {
  Calendar,
  Phone,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  MapPin,
  Clock,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export function generateStaticParams() {
  return SERVICES.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }) {
  const service = getServiceBySlug(params.slug);
  if (!service) {
    return {
      title: 'Service Not Found',
    };
  }

  const canonicalUrl = `https://zingdentistry.in/services/${service.slug}`;

  return {
    title: service.seoTitle,
    description: service.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${service.seoTitle} | Zing Dentistry`,
      description: service.metaDescription,
      url: canonicalUrl,
      type: 'article',
      images: [
        {
          url: '/images/img.new.PNG',
          width: 1200,
          height: 630,
          alt: `${service.title} at Zing Dentistry, Anna Nagar East, Chennai`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${service.seoTitle} | Zing Dentistry`,
      description: service.metaDescription,
      images: ['/images/img.new.PNG'],
    },
  };
}

export default function ServiceDetailPage({ params }) {
  const service = getServiceBySlug(params.slug);

  if (!service) {
    notFound();
  }

  const otherServices = SERVICES.filter((s) => s.slug !== service.slug).slice(0, 4);

  // Structured Data (Service + FAQ + Breadcrumbs)
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalProcedure',
        '@id': `https://zingdentistry.in/services/${service.slug}#procedure`,
        name: service.title,
        description: service.overview,
        provider: {
          '@type': 'DentalClinic',
          name: 'Zing Dentistry',
          url: 'https://zingdentistry.in',
          telephone: '+91 98415 84996',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Anna Nagar East',
            addressRegion: 'Tamil Nadu',
            addressCountry: 'IN',
          },
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `https://zingdentistry.in/services/${service.slug}#breadcrumbs`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://zingdentistry.in',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Services',
            item: 'https://zingdentistry.in/services',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: service.title,
            item: `https://zingdentistry.in/services/${service.slug}`,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `https://zingdentistry.in/services/${service.slug}#faq`,
        mainEntity: service.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      },
    ],
  };

  return (
    <main className="bg-[#FBF7F5] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#3D1F5C] via-[#2D1645] to-[#3D1F5C] text-white py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center flex-wrap gap-2 text-xs text-purple-200">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>/</li>
              <li className="text-[#F0507B] font-semibold">{service.title}</li>
            </ol>
          </nav>

          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-[#F0507B] mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{service.category} · Anna Nagar East, Chennai</span>
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-6 leading-tight">
            {service.heroHeading}
          </h1>

          <p className="text-base sm:text-lg text-purple-100/90 leading-relaxed font-light max-w-3xl mb-8">
            {service.overview}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-2 bg-[#F0507B] hover:bg-[#e13f68] text-white font-bold text-sm px-8 py-4 rounded-full transition-transform hover:scale-105 shadow-xl shadow-[#F0507B]/30"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment for {service.title}</span>
            </Link>

            <a
              href="tel:+919841584996"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-6 py-4 rounded-full border border-white/20 backdrop-blur-md transition-colors"
            >
              <Phone className="w-4 h-4 text-[#F0507B]" />
              <span>Call Clinic +91 98415 84996</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Content Details */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Primary Details Column */}
            <div className="lg:col-span-8 space-y-12">
              {/* Benefits */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100/80 shadow-sm">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#3D1F5C] mb-6">
                  Key Benefits of {service.title} at Zing Dentistry
                </h2>
                <ul className="space-y-3.5">
                  {service.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-[#F0507B] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Symptoms / When You Need It */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100/80 shadow-sm">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#3D1F5C] mb-4">
                  Signs & Indications You May Need This Care
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mb-6 leading-relaxed">
                  If you are experiencing any of the following symptoms in Chennai, a timely dental checkup at Zing Dentistry in Anna Nagar East can resolve the problem early:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {service.symptoms.map((symptom, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 bg-purple-50/50 border border-purple-100 rounded-xl p-3.5 text-xs sm:text-sm text-gray-700"
                    >
                      <AlertCircle className="w-4 h-4 text-[#F0507B] shrink-0 mt-0.5" />
                      <span>{symptom}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Procedure */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100/80 shadow-sm">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#3D1F5C] mb-6">
                  What to Expect During Your Treatment
                </h2>
                <div className="space-y-6">
                  {service.steps.map((st, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#3D1F5C] text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#3D1F5C] mb-1">{st.step}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{st.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-pink-100/80 shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-[#F0507B] text-xs font-bold uppercase tracking-wider">
                  <HelpCircle className="w-4 h-4" />
                  <span>Frequently Asked Questions</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#3D1F5C] mb-6">
                  Questions About {service.title} in Anna Nagar East
                </h2>
                <div className="space-y-5">
                  {service.faqs.map((faq, idx) => (
                    <div key={idx} className="border-b border-pink-50 pb-5 last:border-none last:pb-0">
                      <h3 className="font-serif font-semibold text-base sm:text-lg text-[#3D1F5C] mb-2">
                        {faq.q}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar / Clinic Info Card */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-pink-100/80 shadow-sm space-y-6 sticky top-28">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#F0507B] bg-[#F0507B]/10 px-2.5 py-1 rounded-full">
                    Dental Practice
                  </span>
                  <h3 className="text-xl font-serif font-bold text-[#3D1F5C] mt-2">
                    Zing Dentistry
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Led by Dr. Vidya (BDS)
                  </p>
                </div>

                <div className="space-y-3.5 text-xs text-gray-700 border-t border-b border-pink-50 py-4">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#F0507B] shrink-0 mt-0.5" />
                    <span>Anna Nagar East, Chennai, Tamil Nadu, India</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-[#F0507B] shrink-0 mt-0.5" />
                    <span>Mon–Sat: 10:00 AM – 8:00 PM</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Phone className="w-4 h-4 text-[#F0507B] shrink-0 mt-0.5" />
                    <span>+91 98415 84996</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/book"
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#F0507B] hover:bg-[#e13f68] text-white text-xs font-bold py-3.5 rounded-full transition-all shadow-md"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Appointment Online</span>
                  </Link>

                  <a
                    href="tel:+919841584996"
                    className="w-full inline-flex items-center justify-center gap-2 bg-purple-50 hover:bg-purple-100 text-[#3D1F5C] text-xs font-bold py-3.5 rounded-full border border-purple-100 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-[#F0507B]" />
                    <span>Call +91 98415 84996</span>
                  </a>
                </div>

                {/* Other Services Links */}
                <div className="pt-4 border-t border-pink-50">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                    Other Treatments Offered
                  </h4>
                  <ul className="space-y-2">
                    {otherServices.map((other) => (
                      <li key={other.slug}>
                        <Link
                          href={`/services/${other.slug}`}
                          className="text-xs text-gray-700 hover:text-[#F0507B] flex items-center justify-between group py-1"
                        >
                          <span>{other.title}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-3">
                    <Link
                      href="/services"
                      className="text-xs font-bold text-[#F0507B] hover:text-[#e13f68] flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      View All Services
                    </Link>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

