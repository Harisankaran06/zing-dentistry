'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { MapPin, Clock, Phone, ArrowLeft } from 'lucide-react';

const TIME_SLOTS = ['Morning 10-1', 'Afternoon 1-4', 'Evening 4-8'];

export default function BookPage() {
  const [form, setForm] = useState({
    name: '',
    mobile_no: '',
    preferred_date: '',
    time_slot: TIME_SLOTS[0],
    reason: '',
    is_existing_patient: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.from('appointments').insert(form);
    setLoading(false);
    if (error) {
      setError("Couldn't send your request. Please try again or call us at +91 98415 84996.");
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF7F5] px-4 py-16">
        <div className="bg-white rounded-3xl shadow-md border border-pink-100 p-8 sm:p-10 max-w-md text-center">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
            ✓
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#3D1F5C] mb-3">
            Appointment Request Sent
          </h1>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            Thank you for choosing Zing Dentistry in Anna Nagar East. Our team will contact you shortly to confirm your consultation slot with Dr. Vidya.
          </p>
          <div className="border-t border-pink-50 pt-4 text-xs text-gray-500 mb-6">
            <p>Clinic: Anna Nagar East, Chennai</p>
            <p>Phone: +91 98415 84996</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F0507B] hover:text-[#e13f68]"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF7F5] py-12 px-4 sm:px-6">
      <div className="max-w-md mx-auto mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-[#3D1F5C]"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-pink-100/80 p-6 sm:p-8 max-w-md mx-auto">
        <div className="mb-6">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#F0507B] bg-[#F0507B]/10 px-2.5 py-0.5 rounded-full">
            Online Consultation
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#3D1F5C] mt-2 mb-1">
            Book an Appointment
          </h1>
          <p className="text-xs text-gray-500">
            Zing Dentistry · Anna Nagar East, Chennai
          </p>

          <div className="mt-3 flex items-center gap-4 text-[11px] text-gray-600 border-t border-pink-50/80 pt-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#F0507B]" /> Mon–Sat 10am–8pm
            </span>
            <a
              href="tel:+919841584996"
              className="flex items-center gap-1 text-[#F0507B] font-medium"
            >
              <Phone className="w-3 h-3" /> +91 98415 84996
            </a>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-pink-100 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#F0507B] focus:ring-1 focus:ring-[#F0507B]"
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Mobile Number *
            </label>
            <input
              type="tel"
              value={form.mobile_no}
              onChange={(e) => setForm({ ...form, mobile_no: e.target.value })}
              className="w-full border border-pink-100 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#F0507B] focus:ring-1 focus:ring-[#F0507B]"
              placeholder="e.g. 98415 84996"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Preferred Date *
            </label>
            <input
              type="date"
              value={form.preferred_date}
              onChange={(e) => setForm({ ...form, preferred_date: e.target.value })}
              className="w-full border border-pink-100 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#F0507B] focus:ring-1 focus:ring-[#F0507B]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Preferred Time Slot *
            </label>
            <select
              value={form.time_slot}
              onChange={(e) => setForm({ ...form, time_slot: e.target.value })}
              className="w-full border border-pink-100 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#F0507B] focus:ring-1 focus:ring-[#F0507B] bg-white"
            >
              {TIME_SLOTS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Reason for Visit (Optional)
            </label>
            <textarea
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="w-full border border-pink-100 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#F0507B] focus:ring-1 focus:ring-[#F0507B]"
              rows={3}
              placeholder="e.g. Toothache, teeth whitening, root canal, aligners checkup..."
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={form.is_existing_patient}
              onChange={(e) => setForm({ ...form, is_existing_patient: e.target.checked })}
              className="rounded text-[#F0507B] focus:ring-[#F0507B]"
            />
            <span>I am an existing patient at Zing Dentistry</span>
          </label>

          {error && <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F0507B] hover:bg-[#e13f68] text-white font-bold py-3.5 rounded-full transition-all duration-200 disabled:opacity-60 shadow-lg shadow-[#F0507B]/30 hover:scale-[1.01]"
          >
            {loading ? 'Sending Request…' : 'Request Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
}
