import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-purple-900 text-purple-100 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Zing Dentistry</h3>
            <p className="text-sm text-purple-200">
              Modern dental care for your whole family, delivered with warmth and precision.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/services" className="hover:text-white">Services</Link></li>
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-purple-200">
              <li>Chennai, Tamil Nadu</li>
              <li>hello@zingdentistry.com</li>
              <li>+91 XXXXX XXXXX</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-purple-700 mt-8 pt-6 text-center text-sm text-purple-300">
          © {new Date().getFullYear()} Zing Dentistry. All rights reserved.
        </div>
      </div>
    </footer>
  );
}