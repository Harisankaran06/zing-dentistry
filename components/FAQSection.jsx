'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'Are treatments at Zing Dentistry painful?',
    a: 'Not at all. We specialize in gentle, pain-free dental techniques. For procedures like root canals or extractions, we use advanced local anesthesia and gentle precision so you feel completely comfortable throughout.',
  },
  {
    q: 'How long does laser teeth whitening last?',
    a: 'In-office laser whitening results typically last 1 to 2 years depending on lifestyle habits (such as coffee, tea, or smoking). We also provide customized home care guidance to maintain your bright smile.',
  },
  {
    q: 'What is the advantage of invisible aligners over metal braces?',
    a: 'Clear aligners are nearly invisible, removable for eating and brushing, and generally more comfortable since there are no metal wires or brackets to cause cheek irritation.',
  },
  {
    q: 'How often should my family visit the dentist?',
    a: 'We recommend routine dental checkups and professional cleaning every 6 months. Early preventive care stops small cavities or gum issues from turning into complex procedures.',
  },
  {
    q: 'What safety and sterilization protocols do you follow?',
    a: 'Your health is our highest priority. We use hospital-grade autoclaves, 100% disposable barrier consumables, single-use sterilized pouch packs, and strict infection control guidelines.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-20 bg-gradient-to-b from-[#FBF7F5] to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 bg-[#F0507B]/10 text-[#F0507B] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-[#F0507B]/20 mb-3">
            <HelpCircle className="w-3.5 h-3.5" /> FAQ Guide
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#3D1F5C]">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-gray-600 mt-2 max-w-lg mx-auto">
            Everything you need to know about our gentle dental care procedures and clinic visits.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-pink-100/80 shadow-sm overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                >
                  <span className="font-serif font-semibold text-[#3D1F5C] text-base sm:text-lg pr-4">
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[#F0507B] bg-pink-50 transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 bg-[#F0507B] text-white' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-pink-50/60 pt-3 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
