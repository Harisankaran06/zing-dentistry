import Link from 'next/link';
import GalleryPreview from '@/components/GalleryPreview';
import Reveal from '@/components/Reveal';

const services = [
  { title: 'General Dentistry', desc: 'Checkups, cleanings, and preventive care for the whole family.' },
  { title: 'Cosmetic Dentistry', desc: 'Whitening, veneers, and smile makeovers.' },
  { title: 'Orthodontics', desc: 'Braces and aligners for a straighter smile.' },
  { title: 'Emergency Care', desc: 'Fast relief when you need it most.' },
];

const testimonials = [
  { name: 'Priya S.', text: 'Painless, professional, and so friendly. Highly recommend!' },
  { name: 'Arun K.', text: "Best dental experience I've had. Clean clinic, great staff." },
  { name: 'Meena R.', text: 'They made my kids actually excited about going to the dentist.' },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h1 className="text-4xl sm:text-5xl font-bold text-purple-900 mb-4">
              Your Smile, Our Priority
            </h1>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Gentle, modern dental care for the whole family — right here in Chennai.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <Link
              href="/book"
              className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-3 rounded-full transition-colors"
            >
              Book Your Appointment
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Services overview */}
      <section id="services" className="py-16 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-3xl font-bold text-purple-900 text-center mb-10">
              Our Services
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 100}>
                <div className="bg-white border border-pink-100 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full">
                  <h3 className="font-semibold text-purple-800 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-600">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* About / Doctor Intro */}
      <section id="about" className="py-16 bg-purple-50 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <Reveal delay={100} className="order-2 md:order-2">
            <img
              src="/images/img1.jpeg"
              alt="Dr. V "
              className="rounded-2xl shadow-lg w-full object-contain max-w-sm mx-auto md:mx-0"
            />
          </Reveal>
          <Reveal className="order-1 md:order-1">
            <h2 className="text-3xl font-bold text-purple-900 mb-4">
              Meet Your Dentist
            </h2>
            <p className="text-gray-600 mb-4">
              With years of experience in family and cosmetic dentistry, Dr. Vidya and
              the Zing Dentistry team are committed to gentle, modern care for
              every patient who walks through the door.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>✓ BDS certified, years of clinical experience</li>
              <li>✓ Family-friendly, patient-first approach</li>
              <li>✓ Modern equipment & sterile, comfortable clinic</li>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-3xl font-bold text-purple-900 text-center mb-10">
              What Our Patients Say
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <div className="bg-white border border-pink-100 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full">
                  <p className="text-gray-600 italic mb-4">&ldquo;{t.text}&rdquo;</p>
                  <p className="font-semibold text-purple-800">— {t.name}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-16 bg-purple-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-3xl font-bold text-purple-900 text-center mb-10">
              Smile Transformations
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <GalleryPreview />
          </Reveal>
        </div>
      </section>

      {/* Contact Strip */}
      <section id="contact" className="py-16 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <Reveal>
            <h3 className="font-semibold text-purple-900 mb-2">Location</h3>
            <p className="text-gray-600">Chennai, Tamil Nadu</p>
          </Reveal>
          <Reveal delay={100}>
            <h3 className="font-semibold text-purple-900 mb-2">Hours</h3>
            <p className="text-gray-600">Mon–Sat: 10am – 8pm</p>
          </Reveal>
          <Reveal delay={200}>
            <h3 className="font-semibold text-purple-900 mb-2">Phone</h3>
            <p className="text-gray-600">+91 XXXXX XXXXX</p>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-purple-900 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to book your visit?
            </h2>
            <p className="text-purple-200 mb-6">
              Our team is ready to give you the care you deserve.
            </p>
            <Link
              href="/book"
              className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-3 rounded-full transition-colors"
            >
              Book Appointment
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}