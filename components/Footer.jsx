import Link from 'next/link';
import { MapPin, Phone, Clock, Calendar } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-purple-900 text-purple-100 mt-20 border-t border-purple-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Clinic Intro */}
          <div className="space-y-3">
            <h3 className="text-white font-serif font-bold text-xl">Zing Dentistry</h3>
            <p className="text-xs text-purple-200 leading-relaxed">
              Premier dental clinic in Anna Nagar East, Chennai. Dedicated to gentle dental care, laser teeth whitening, microscopic root canals, clear aligners, and family oral health.
            </p>
            <div className="pt-2">
              <Link
                href="/book"
                className="inline-flex items-center gap-1.5 bg-[#F0507B] hover:bg-[#e13f68] text-white text-xs font-bold px-4 py-2 rounded-full transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" /> Book Appointment
              </Link>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-purple-200">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  All Dental Services
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-white transition-colors">
                  Book an Appointment
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-white transition-colors">
                  About Dr. Vidya
                </Link>
              </li>
              <li>
                <Link href="/#transformations" className="hover:text-white transition-colors">
                  Smile Transformations
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Dental Treatments */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">
              Key Treatments
            </h4>
            <ul className="space-y-2 text-xs text-purple-200">
              <li>
                <Link
                  href="/services/root-canal-treatment-anna-nagar"
                  className="hover:text-white transition-colors"
                >
                  Root Canal in Anna Nagar
                </Link>
              </li>
              <li>
                <Link
                  href="/services/laser-teeth-whitening-chennai"
                  className="hover:text-white transition-colors"
                >
                  Laser Teeth Whitening
                </Link>
              </li>
              <li>
                <Link
                  href="/services/clear-aligners-braces-chennai"
                  className="hover:text-white transition-colors"
                >
                  Clear Aligners & Braces
                </Link>
              </li>
              <li>
                <Link
                  href="/services/dental-implants-chennai"
                  className="hover:text-white transition-colors"
                >
                  Dental Implants
                </Link>
              </li>
              <li>
                <Link
                  href="/services/general-dentistry-chennai"
                  className="hover:text-white transition-colors"
                >
                  General & Preventive Care
                </Link>
              </li>
              <li>
                <Link
                  href="/services/pediatric-dentistry-chennai"
                  className="hover:text-white transition-colors"
                >
                  Pediatric Dentistry
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">
              Clinic Contact
            </h4>
            <ul className="space-y-2.5 text-xs text-purple-200">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#F0507B] shrink-0 mt-0.5" />
                <span>Anna Nagar East, Chennai, Tamil Nadu, India</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#F0507B] shrink-0 mt-0.5" />
                <span>Mon–Sat: 10:00 AM – 8:00 PM</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#F0507B] shrink-0 mt-0.5" />
                <a
                  href="tel:+919841584996"
                  className="hover:text-white text-white font-semibold transition-colors"
                >
                  +91 98415 84996
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-purple-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-purple-300 gap-4">
          <p>
            © {new Date().getFullYear()} Zing Dentistry. Dental Clinic in Anna Nagar East, Chennai. All rights reserved.
          </p>
          <div>
            <Link
              href="/admin/login"
              rel="nofollow"
              className="text-xs text-purple-400 hover:text-purple-200 transition-colors"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
