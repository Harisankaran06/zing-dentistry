'use client';
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Plus, Search, User, Phone, Calendar, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import AddPatientModal from '@/components/admin/AddPatientModal';

function PatientsListContent() {
  const [session, setSession] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [patients, setPatients] = useState([]);
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push('/admin/login');
      else setSession(data.session);
      setCheckingAuth(false);
    });
  }, [router]);

  useEffect(() => {
    const q = searchParams.get('query');
    if (q !== null) {
      setQuery(q);
    }
  }, [searchParams]);

  useEffect(() => {
    if (session) fetchPatients();
  }, [session]);

  const fetchPatients = async () => {
    const { data, error } = await supabase
      .from('patients')
      .select('*, visits(count)')
      .order('created_at', { ascending: false });
    if (!error && data) setPatients(data);
  };

  const filtered = patients.filter((p) => {
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.contact_no && p.contact_no.includes(q)) ||
      (p.occupation && p.occupation.toLowerCase().includes(q))
    );
  });

  if (checkingAuth) return <p className="text-center py-20 text-gray-500">Checking session…</p>;

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#3D1F5C]">Patients Directory</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Total {patients.length} registered patient{patients.length === 1 ? '' : 's'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[#F0507B] hover:bg-[#e13f68] text-white font-medium px-5 py-2.5 rounded-full text-sm transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Patient</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Strip */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search patients by name, phone number, or occupation..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#F0507B]/30 focus:border-[#F0507B]"
          />
        </div>
        {query && (
          <button
            onClick={() => setQuery('')}
            className="text-xs text-gray-500 hover:text-gray-700 px-3 py-2"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Patients Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <User className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">No patients found</p>
            <p className="text-sm text-gray-400 mt-1">
              {query ? 'Try matching a different search term' : 'Get started by adding your first patient'}
            </p>
            {!query && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 inline-flex items-center gap-2 bg-[#F0507B] text-white font-medium px-5 py-2 rounded-full text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Patient
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#FBF7F5] border-b border-pink-100 text-xs font-semibold uppercase tracking-wider text-[#3D1F5C]/70">
                <tr>
                  <th className="py-3.5 px-6">Patient Name</th>
                  <th className="py-3.5 px-6">Contact Number</th>
                  <th className="py-3.5 px-6">Demographics</th>
                  <th className="py-3.5 px-6">Last / Appt Date</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-50">
                {filtered.map((p) => {
                  const visitCount = p.visits?.[0]?.count ?? 0;
                  return (
                    <tr key={p.id} className="hover:bg-pink-50/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-purple-100 text-[#3D1F5C] font-semibold flex items-center justify-center text-sm shrink-0">
                            {p.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <Link
                              href={`/admin/patients/${p.id}`}
                              className="font-semibold text-[#3D1F5C] hover:text-[#F0507B] transition-colors"
                            >
                              {p.name}
                            </Link>
                            {visitCount > 0 && (
                              <span className="ml-2 inline-block text-[11px] font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-full px-2 py-0.5">
                                {visitCount} visit{visitCount === 1 ? '' : 's'}
                              </span>
                            )}
                            {p.occupation && (
                              <p className="text-xs text-gray-400 mt-0.5">{p.occupation}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600 font-medium">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span>{p.contact_no}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {p.age || p.sex ? (
                          <span>
                            {p.age ? `${p.age} yrs` : ''} {p.sex ? `· ${p.sex}` : ''}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {p.appointment_date ? (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#F0507B]" />
                            <span>{p.appointment_date}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          href={`/admin/patients/${p.id}`}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-[#F0507B] hover:text-[#e13f68]"
                        >
                          View Record <ArrowRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddPatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchPatients();
        }}
      />
    </div>
  );
}

export default function PatientsPage() {
  return (
    <Suspense fallback={<p className="text-center py-20 text-gray-500">Loading directory...</p>}>
      <PatientsListContent />
    </Suspense>
  );
}
