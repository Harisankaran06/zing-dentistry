'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar.jsx';
import AdminTopBar from '@/components/admin/AdminTopBar.jsx';
import AddPatientModal from '@/components/admin/AddPatientModal.jsx';

export default function AdminLayout({ children }) {
  const [addPatientOpen, setAddPatientOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleSearch = (query) => {
    if (query.trim()) {
      router.push(`/admin/patients?query=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FBF7F5]">
      <AdminSidebar onAddPatient={() => setAddPatientOpen(true)} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopBar
          onAddPatient={() => setAddPatientOpen(true)}
          onSearch={handleSearch}
        />

        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>

      <AddPatientModal
        isOpen={addPatientOpen}
        onClose={() => setAddPatientOpen(false)}
      />
    </div>
  );
}