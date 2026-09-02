import Link from 'next/link';
import {
  Sparkles,
  Smile,
  Wand2,
  Zap,
  Wrench,
  Stethoscope,
  Baby,
  ShieldPlus,
  Gem,
  Star,
  CheckCircle2,
  Calendar,
  Phone,
  Award,
  Shield,
  HeartHandshake,
  MapPin,
  Clock,
} from 'lucide-react';
import GalleryPreview from '@/components/GalleryPreview';
import Reveal from '@/components/Reveal';
import FAQSection from '@/components/FAQSection';
import FloatingQuickActions from '@/components/FloatingQuickActions';

const services = [
  {
    title: 'General Dentistry',
    desc: 'Routine checkups, digital X-rays, scaling, cleanings, and preventive care to maintain oral health.',
    icon: Smile,
    badge: 'Preventive',
  },
  {
    title: 'Laser Teeth Whitening',
    desc: 'Safe, in-office whitening treatments that brighten your smile up to 8 shades in under an hour.',
    icon: Sparkles,
    badge: 'Cosmetic',
  },
  {
    title: 'Smile Makeover',
    desc: 'Complete aesthetic transformations using custom veneers, bonding, and shade matching.',
    icon: Wand2,
    badge: 'Popular',
  },
  {
    title: 'Dental Implants',
    desc: 'Permanent, titanium-supported tooth replacement that looks, feels, and functions like natural teeth.',
    icon: Zap,
    badge: 'Restorative',
  },
  {
    title: 'Clear Aligners & Braces',
    desc: 'Invisible aligners and modern orthodontics to straighten teeth comfortably for teens and adults.',
    icon: Wrench,
    featured: true,
    badge: 'Featured',
  },
  {
    title: 'Microscopic Root Canal',
    desc: 'Pain-free, single-visit root canal therapy performed with precision optics to preserve natural teeth.',
    icon: ShieldPlus,
    badge: 'Pain-Free',
  },
  {
    title: 'Pediatric Dentistry',
    desc: 'Gentle, child-friendly dental care in a warm, comforting environment kids actually look forward to.',
    icon: Baby,
    badge: 'Kids Care',
  },
  {
    title: 'Painless Oral Surgery',
    desc: 'Precision wisdom tooth extractions and minor surgical care performed with minimal discomfort.',
    icon: Stethoscope,
    badge: 'Surgical',
  },
  {
    title: 'Porcelain Veneers & Crowns',
    desc: 'High-grade ceramic veneers and crowns crafted for strength, durability, and natural brilliance.',
    icon: Gem,
    badge: 'Aesthetic',
  },
];

const testimonials = [
  {
    name: 'Priya Sundaram',
    role: 'Verified Patient',
    text: 'Dr. Vidya and the staff made my root canal completely pain-free! The clinic is spotless, high-tech, and super welcoming.',
    rating: 5,
    tag: 'Root Canal Therapy',
  },
  {
    name: 'Arun Kumar',
    role: 'Verified Patient',
    text: 'Got laser teeth whitening done before my wedding. The results exceeded my expectations — 6 shades brighter in 45 minutes!',
    rating: 5,
    tag: 'Teeth Whitening',
  },
  {
    name: 'Meena & Family',
    role: 'Family Care Patient',
    text: 'My 6-year-old used to be terrified of dentists. Zing Dentistry made her feel so safe and happy. Highly recommended for families in Chennai!',
    rating: 5,
    tag: 'Pediatric Dental',
  },
];

const trustBadges = [
  { icon: Award, title: '15+ Years', desc: 'Clinical Excellence' },
  { icon: Shield, title: '100% Sterile', desc: 'Hospital-Grade Safety' },
  { icon: HeartHandshake, title: 'Painless Tech', desc: 'Gentle Patient Care' },
  { icon: Smile, title: '5,000+', desc: 'Smiles Transformed' },
];

export default function Home() {
  return (
    <main className="relative overflow-hidden bg-[#FBF7F5]">
      {/* Floating Action Bar */}
      <FloatingQuickActions />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-b from-[#3D1F5C] via-[#2D1645] to-[#3D1F5C] text-white overflow-hidden">
        {/* Background Decorative Mesh Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F0507B]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy Column */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <Reveal>
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#F0507B]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Modern Dental Care · Annanagar East, Chennai</span>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white leading-tight">
                  Your Smile Deserves <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F0507B] via-pink-300 to-purple-200">
                    Painless & Radiant
                  </span>{' '}
                  Care.
                </h1>
              </Reveal>

              <Reveal delay={150}>
                <p className="text-base sm:text-lg text-purple-100/90 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                  Experience gentle, state-of-the-art dental treatments tailored for your entire family. From laser whitening to invisible aligners and pain-free root canals.
                </p>
              </Reveal>

              <Reveal delay={200}>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link
                    href="/book"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F0507B] hover:bg-[#e13f68] text-white font-bold px-8 py-4 rounded-full transition-all duration-200 shadow-lg shadow-[#F0507B]/30 hover:scale-105"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Your Appointment</span>
                  </Link>

                  <a
                    href="tel:+919841584996"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-4 rounded-full border border-white/20 backdrop-blur-md transition-all"
                  >
                    <Phone className="w-4 h-4 text-[#F0507B]" />
                    <span>Call +91 98415 84996</span>
                  </a>
                </div>
              </Reveal>
            </div>

            {/* Right Feature Card / Glass Badge Column */}
            <div className="lg:col-span-5 relative">
              <Reveal delay={200}>
                <div className="relative mx-auto max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl text-left space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <h2 className="text-lg font-serif font-bold text-white">Zing Dental Clinic</h2>
                      <p className="text-xs text-purple-200">Annanagar East, Chennai</p>
                    </div>
                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {trustBadges.map((badge, idx) => {
                      const Icon = badge.icon;
                      return (
                        <div
                          key={idx}
                          className="bg-white/5 border border-white/10 rounded-2xl p-3.5 transition-transform hover:-translate-y-1"
                        >
                          <Icon className="w-5 h-5 text-[#F0507B] mb-2" />
                          <p className="text-sm font-bold text-white">{badge.title}</p>
                          <p className="text-[11px] text-purple-200/80">{badge.desc}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-purple-200">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#F0507B]" /> Mon–Sat 10am - 8pm
                    </span>
                    <span className="flex items-center gap-1 text-yellow-300 font-bold">
                      <Star className="w-3.5 h-3.5 fill-yellow-300" /> 4.9 (500+ Reviews)
                    </span>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section id="services" className="py-20 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-[#F0507B] text-xs font-bold uppercase tracking-wider bg-[#F0507B]/10 px-3 py-1 rounded-full border border-[#F0507B]/20">
                Comprehensive Treatments
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#3D1F5C] mt-3">
                Our Dental Services
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Delivering advanced aesthetic and clinical dentistry with a gentle, patient-first touch.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.title} delay={i * 50}>
                  <div
                    className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 h-full border flex flex-col justify-between ${
                      s.featured
                        ? 'border-2 border-[#F0507B] ring-2 ring-[#F0507B]/20'
                        : 'border-pink-100/80 hover:border-[#F0507B]/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#3D1F5C] flex items-center justify-center border border-purple-100">
                          <Icon className="w-6 h-6 text-[#F0507B]" strokeWidth={1.75} />
                        </div>
                        {s.badge && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#3D1F5C] bg-[#FBF7F5] border border-pink-100 px-2.5 py-0.5 rounded-full">
                            {s.badge}
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif font-bold text-lg text-[#3D1F5C] mb-2">
                        {s.title}
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed mb-4">{s.desc}</p>
                    </div>

                    <div className="pt-3 border-t border-pink-50 flex items-center justify-between">
                      <Link
                        href="/book"
                        className="text-xs font-bold text-[#F0507B] hover:text-[#e13f68] flex items-center gap-1 group"
                      >
                        Book Visit <span className="transition-transform group-hover:translate-x-1">→</span>
                      </Link>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Meet Your Dentist */}
      <section id="about" className="py-20 bg-gradient-to-r from-purple-900 via-[#3D1F5C] to-purple-950 text-white scroll-mt-20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <Reveal className="md:col-span-5">
              <div className="relative mx-auto max-w-sm">
                <div className="absolute inset-0 bg-[#F0507B]/30 rounded-3xl blur-2xl transform rotate-3" />
                <img
                  src="/images/img1.jpeg"
                  alt="Dr. Vidya - Zing Dentistry"
                  className="relative rounded-3xl shadow-2xl border-4 border-white/20 w-full object-cover max-h-[420px]"
                />
              </div>
            </Reveal>

            <Reveal delay={100} className="md:col-span-7 space-y-6">
              <span className="text-[#F0507B] text-xs font-bold uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/15">
                Lead Dentist Profile
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
                Meet Dr. Vidya (BDS)
              </h2>
              <p className="text-sm text-purple-100/90 leading-relaxed">
                With over a decade of clinical experience in family and cosmetic dentistry, Dr. Vidya and the Zing Dentistry team are devoted to providing warm, gentle, and transparent oral healthcare for every patient.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  'BDS Certified with advanced training in aesthetic & endodontic dentistry',
                  'Specialized in pain-free, anxiety-free treatments for kids and adults',
                  'Strict hospital-grade sterilization with 100% single-use disposable packs',
                  'Transparent diagnosis with intraoral cameras & clear step-by-step guidance',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-purple-100">
                    <CheckCircle2 className="w-5 h-5 text-[#F0507B] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  href="/book"
                  className="inline-flex items-center gap-2 bg-[#F0507B] hover:bg-[#e13f68] text-white text-sm font-bold px-7 py-3 rounded-full transition-transform hover:scale-105 shadow-lg"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Consult Dr. Vidya</span>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Interactive Smile Transformations */}
      <section id="transformations" className="py-20 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-[#F0507B] text-xs font-bold uppercase tracking-wider bg-[#F0507B]/10 px-3 py-1 rounded-full border border-[#F0507B]/20">
                Interactive Showcase
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#3D1F5C] mt-3">
                Real Patient Smile Transformations
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Drag the slider handles below to compare actual Before & After dental transformation results.
              </p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <GalleryPreview />
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-purple-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-[#F0507B] text-xs font-bold uppercase tracking-wider bg-[#F0507B]/10 px-3 py-1 rounded-full border border-[#F0507B]/20">
                Patient Stories
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#3D1F5C] mt-3">
                What Our Patients Say
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <div className="bg-white border border-pink-100/80 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-yellow-400 mb-3">
                      {[...Array(t.rating)].map((_, rIdx) => (
                        <Star key={rIdx} className="w-4 h-4 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm italic leading-relaxed mb-6">
                      &ldquo;{t.text}&rdquo;
                    </p>
                  </div>

                  <div className="pt-4 border-t border-pink-50 flex items-center justify-between">
                    <div>
                      <p className="font-serif font-bold text-[#3D1F5C] text-sm">{t.name}</p>
                      <p className="text-[11px] text-[#F0507B] font-medium">{t.role}</p>
                    </div>
                    <span className="text-[10px] bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full font-semibold">
                      {t.tag}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <div id="faq" className="scroll-mt-20">
        <FAQSection />
      </div>

      {/* Contact & Location Strip */}
      <section id="contact" className="py-16 bg-[#3D1F5C] text-white scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <Reveal>
            <div className="space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-2 text-[#F0507B] font-bold">
                <MapPin className="w-5 h-5" />
                <h3>Clinic Location</h3>
              </div>
              <p className="text-sm text-purple-100">Annanagar East, Chennai, Tamil Nadu</p>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-2 text-[#F0507B] font-bold">
                <Clock className="w-5 h-5" />
                <h3>Working Hours</h3>
              </div>
              <p className="text-sm text-purple-100">Mon–Sat: 10:00 AM – 8:00 PM</p>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-2 text-[#F0507B] font-bold">
                <Phone className="w-5 h-5" />
                <h3>Contact Phone</h3>
              </div>
              <p className="text-sm text-purple-100">+91 98415 84996</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-gradient-to-r from-[#F0507B] via-pink-500 to-[#F0507B] py-16 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-3">
              Ready for a Brighter, Pain-Free Smile?
            </h2>
            <p className="text-purple-100 text-sm sm:text-base mb-8 max-w-lg mx-auto">
              Book your consultation with Dr. Vidya today. Friendly care, modern technology, zero anxiety.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center gap-2 bg-[#3D1F5C] hover:bg-[#2b1642] text-white font-bold px-9 py-4 rounded-full shadow-2xl transition-transform hover:scale-105"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment Now</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
