'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Calendar, Clock, MapPin, Menu, X } from 'lucide-react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/#services', label: 'Services' },
    { href: '/#about', label: 'About Doctor' },
    { href: '/#transformations', label: 'Transformations' },
    { href: '/#faq', label: 'FAQ' },
    { href: '/#contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Top Clinic Info Strip */}
      <div className="bg-[#3D1F5C] text-[#FBF7F5] text-xs py-2 px-4 border-b border-white/10 hidden sm:block">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 opacity-90">
              <MapPin className="w-3.5 h-3.5 text-[#F0507B]" />
              Annanagar East, Chennai
            </span>
            <span className="flex items-center gap-1.5 opacity-90">
              <Clock className="w-3.5 h-3.5 text-[#F0507B]" />
              Mon–Sat: 10am – 8pm
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="tel:+919841584996"
              className="flex items-center gap-1.5 font-semibold text-[#F0507B] hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              +91 98415 84996
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-pink-100/80 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center h-full py-2">
              <Image
                src="/logo/zing-logo.png"
                alt="Zing Dentistry"
                width={170}
                height={180}
                className="h-14 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-gray-700 hover:text-[#F0507B] transition-colors relative py-1 group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F0507B] transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-4">
              <a
                href="tel:+919841584996"
                className="flex items-center gap-2 text-xs font-bold text-[#3D1F5C] hover:text-[#F0507B] transition-colors py-2 px-3 rounded-full border border-pink-100 hover:bg-pink-50"
              >
                <Phone className="w-3.5 h-3.5 text-[#F0507B]" />
                <span>Call Us</span>
              </a>

              <Link
                href="/book"
                className="flex items-center gap-2 bg-[#F0507B] hover:bg-[#e13f68] text-white text-xs font-bold px-5 py-2.5 rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Appointment</span>
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden p-2 text-[#3D1F5C] hover:text-[#F0507B] focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Drawer */}
          {menuOpen && (
            <div className="lg:hidden py-4 border-t border-pink-100 flex flex-col gap-3 animate-in fade-in duration-150">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-gray-700 hover:text-[#F0507B] py-2 px-2 rounded-lg hover:bg-pink-50/50"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-2 flex flex-col gap-2">
                <a
                  href="tel:+919841584996"
                  className="flex items-center justify-center gap-2 text-sm font-bold text-[#3D1F5C] py-2.5 rounded-xl border border-pink-100 bg-purple-50/50"
                >
                  <Phone className="w-4 h-4 text-[#F0507B]" />
                  Call Direct: +91 98415 84996
                </a>

                <Link
                  href="/book"
                  className="flex items-center justify-center gap-2 bg-[#F0507B] text-white text-sm font-bold py-3 rounded-xl text-center shadow-sm"
                  onClick={() => setMenuOpen(false)}
                >
                  <Calendar className="w-4 h-4" />
                  Book Appointment
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
