'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, Calendar, MessageCircle, X } from 'lucide-react';

export default function FloatingQuickActions() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 print:hidden">
      {/* Expanded Quick Options */}
      {open && (
        <div className="flex flex-col gap-2.5 items-end animate-in fade-in slide-in-from-bottom-5 duration-200">
          <a
            href="https://wa.me/919841584996?text=Hi%20Zing%20Dentistry,%20I'd%20like%20to%20book%20an%20appointment"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold py-2.5 px-4 rounded-full shadow-lg transition-transform hover:scale-105"
          >
            <span>WhatsApp Us</span>
            <MessageCircle className="w-4 h-4" />
          </a>

          <a
            href="tel:+919841584996"
            className="flex items-center gap-3 bg-[#3D1F5C] hover:bg-[#2b1642] text-white text-xs font-bold py-2.5 px-4 rounded-full shadow-lg transition-transform hover:scale-105"
          >
            <span>Call Clinic Direct</span>
            <Phone className="w-4 h-4" />
          </a>

          <Link
            href="/book"
            className="flex items-center gap-3 bg-[#F0507B] hover:bg-[#e13f68] text-white text-xs font-bold py-2.5 px-4 rounded-full shadow-lg transition-transform hover:scale-105"
          >
            <span>Book Online</span>
            <Calendar className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Main Toggle Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white transition-all duration-300 ${
          open ? 'bg-gray-800 rotate-90 scale-95' : 'bg-[#F0507B] hover:bg-[#e13f68] hover:scale-105 ring-4 ring-[#F0507B]/30'
        }`}
        aria-label="Quick Actions"
      >
        {open ? <X className="w-6 h-6" /> : <Phone className="w-6 h-6 animate-pulse" />}
      </button>
    </div>
  );
}
