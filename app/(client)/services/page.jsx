import Link from 'next/link';
import { SERVICES } from '@/lib/servicesData';
import {
  Sparkles,
  Smile,
  ShieldPlus,
  Zap,
  Wrench,
  Wand2,
  Baby,
  Stethoscope,
  Gem,
  Calendar,
  Phone,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

const iconMap = {
  'Microscopic Root Canal': ShieldPlus,
  'Laser Teeth Whitening': Sparkles,
  'Clear Aligners & Braces': Wrench,
  'Dental Implants': Zap,
  'General & Preventive Dentistry': Smile,
  'Smile Makeover & Porcelain Veneers': Wand2,
  'Pediatric Dentistry': Baby,
  'Wisdom Tooth Removal & Minor Oral Surgery': Stethoscope,
  'Porcelain Veneers & Ceramic Crowns': Gem,
};

export const metadata = {
  title: 'Dental Services in Anna Nagar East, Chennai',
  description:
    'Comprehensive dental treatments at Zing Dentistry in Anna Nagar East, Chennai. Laser teeth whitening, microscopic root canal, clear aligners, dental implants & pediatric care.',
  alternates: {
    canonical: 'https://zingdentistry.in/services',
  },
  openGraph: {
    title: 'Dental Services in Anna Nagar East, Chennai | Zing Dentistry',
    description:
      'Explore gentle dental treatments at Zing Dentistry, Anna Nagar East, Chennai. Microscopic root canals, laser whitening, invisible aligners & dental implants.',
    url: 'https://zingdentistry.in/services',
    type: 'website',
  },
};

export default function ServicesPage() {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: SERVICES.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: service.title,
      url: `https://zingdentistry.in/services/${service.slug}`,
      description: service.shortDesc,
    })),
  };

  return (
    <main className="bg-[#FBF7F5] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#3D1F5C] via-[#2D1645] to-[#3D1F5C] text-white py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav className="text-xs text-purple-200 mb-4 flex items-center justify-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#F0507B] font-semibold">Services</span>
          </nav>

          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#F0507B] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Modern Dental Care · Anna Nagar East, Chennai</span>
          </span>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white mb-4">
            Dental Treatments & Services in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F0507B] via-pink-300 to-purple-200">
              Anna Nagar East, Chennai
            </span>
          </h1>

          <p className="text-sm sm:text-base text-purple-100/90 max-w-2xl mx-auto font-light leading-relaxed">
            From preventive family checkups and laser whitening to microscopic root canals and invisible aligners, Zing Dentistry provides gentle, transparent dental care for patients of all ages.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 bg-[#F0507B] hover:bg-[#e13f68] text-white font-bold text-sm px-7 py-3.5 rounded-full transition-transform hover:scale-105 shadow-lg"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Consultation</span>
            </Link>
            <a
              href="tel:+919841584996"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-6 py-3.5 rounded-full border border-white/20 backdrop-blur-md transition-colors"
            >
              <Phone className="w-4 h-4 text-[#F0507B]" />
              <span>Call +91 98415 84996</span>
            </a>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((s) => {
              const Icon = iconMap[s.title] || Smile;
              return (
                <article
                  key={s.slug}
                  className="bg-white rounded-2xl p-7 shadow-sm border border-pink-100/80 hover:border-[#F0507B]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#3D1F5C] flex items-center justify-center border border-purple-100">
                        <Icon className="w-6 h-6 text-[#F0507B]" strokeWidth={1.75} />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#3D1F5C] bg-[#FBF7F5] border border-pink-100 px-3 py-1 rounded-full">
                        {s.badge}
                      </span>
                    </div>

                    <h2 className="font-serif font-bold text-xl text-[#3D1F5C] mb-3">
                      <Link
                        href={`/services/${s.slug}`}
                        className="hover:text-[#F0507B] transition-colors"
                      >
                        {s.title}
                      </Link>
                    </h2>

                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                      {s.shortDesc}
                    </p>

                    <div className="space-y-2 mb-6">
                      {s.benefits.slice(0, 2).map((b, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                          <CheckCircle2 className="w-4 h-4 text-[#F0507B] shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-pink-50 flex items-center justify-between">
                    <Link
                      href={`/services/${s.slug}`}
                      className="text-xs font-bold text-[#3D1F5C] hover:text-[#F0507B] flex items-center gap-1 group"
                    >
                      Read Guide <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                      href="/book"
                      className="text-xs font-bold text-[#F0507B] hover:text-[#e13f68]"
                    >
                      Book Visit →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Local Assurance Strip */}
      <section className="bg-white border-t border-pink-100 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#3D1F5C] mb-3">
            Why Patients in Anna Nagar Trust Zing Dentistry
          </h2>
          <p className="text-sm text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Conveniently located in Anna Nagar East, Chennai, Dr. Vidya and team combine hospital-grade sterilization, advanced dental equipment, and gentle techniques to ensure every visit is comfortable and reassuring.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/book"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F0507B] hover:bg-[#e13f68] text-white font-bold px-8 py-3.5 rounded-full shadow-md transition-transform hover:scale-105"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Your Visit</span>
            </Link>
            <a
              href="tel:+919841584996"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-purple-50 hover:bg-purple-100 text-[#3D1F5C] font-semibold px-7 py-3.5 rounded-full border border-purple-200 transition-colors"
            >
              <Phone className="w-4 h-4 text-[#F0507B]" />
              <span>Direct Call: +91 98415 84996</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

