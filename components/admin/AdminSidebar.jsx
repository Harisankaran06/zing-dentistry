'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  CalendarDays,
  Users,
  UserPlus,
  Images,
  Settings,
  Stethoscope,
  LogOut,
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

// Brand tokens — keep in sync with tailwind.config.js
// cream:  #FBF7F5
// plum:   #3D1F5C
// pink:   #F0507B

const NAV_ITEMS = [
  { href: '/admin', label: 'Calendar', icon: CalendarDays, exact: true },
  { href: '/admin/patients', label: 'Patients', icon: Users },
  { href: '/admin/patients/new', label: 'Add patient', icon: UserPlus },
  { href: '/admin/gallery', label: 'Gallery', icon: Images },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

function isActive(pathname, item) {
  if (item.exact) return pathname === item.href;
  return pathname.startsWith(item.href);
}

export default function AdminSidebar({ onAddPatient }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <aside className="hidden md:flex md:flex-col md:w-20 lg:w-56 shrink-0 bg-[#3D1F5C] text-[#FBF7F5] min-h-screen sticky top-0">
      <div className="flex items-center gap-2 px-4 lg:px-5 h-16 border-b border-white/10">
        <Stethoscope className="w-6 h-6 text-[#F0507B] shrink-0" strokeWidth={2} />
        <span className="hidden lg:block font-serif text-lg tracking-tight truncate">
          Dr. V&apos;s Zing
        </span>
      </div>

      <nav className="flex-1 py-4 px-2 lg:px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item);
          const Icon = item.icon;
          const isAddPatient = item.href === '/admin/patients/new';

          if (isAddPatient && onAddPatient) {
            return (
              <button
                key={item.href}
                type="button"
                onClick={onAddPatient}
                className={[
                  'w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                  'justify-center lg:justify-start text-[#FBF7F5]/75 hover:bg-white/10 hover:text-[#FBF7F5]',
                ].join(' ')}
                title={item.label}
              >
                <Icon className="w-5 h-5 shrink-0 text-[#F0507B]" strokeWidth={2} />
                <span className="hidden lg:block truncate">{item.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                'justify-center lg:justify-start',
                active
                  ? 'bg-[#F0507B] text-white font-medium'
                  : 'text-[#FBF7F5]/75 hover:bg-white/10 hover:text-[#FBF7F5]',
              ].join(' ')}
              title={item.label}
            >
              <Icon className="w-5 h-5 shrink-0" strokeWidth={1.75} />
              <span className="hidden lg:block truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-2 lg:px-3 py-3 border-t border-white/10">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm
                     justify-center lg:justify-start text-[#FBF7F5]/75
                     hover:bg-white/10 hover:text-[#FBF7F5] transition-colors"
          title="Log out"
        >
          <LogOut className="w-5 h-5 shrink-0" strokeWidth={1.75} />
          <span className="hidden lg:block">Log out</span>
        </button>
      </div>

      <div className="hidden lg:block px-5 py-3 border-t border-white/10 text-xs text-[#FBF7F5]/60">
        Annanagar East, Chennai
      </div>
    </aside>
  );
}