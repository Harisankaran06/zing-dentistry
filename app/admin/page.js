'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

const statusColor = {
  pending: 'text-yellow-600',
  confirmed: 'text-blue-600',
  completed: 'text-green-600',
  cancelled: 'text-red-500',
};

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push('/admin/login');
      } else {
        setSession(data.session);
      }
      setCheckingAuth(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push('/admin/login');
    });

    return () => listener?.subscription?.unsubscribe();
  }, [router]);

  useEffect(() => {
    if (session) fetchAppointments();
  }, [session]);

  const fetchAppointments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setAppointments(data);
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
    if (!error) {
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (checkingAuth) {
    return <p className="text-center py-20 text-gray-500">Checking session…</p>;
  }

  return (
    <div className="min-h-screen bg-purple-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <h1 className="text-2xl font-bold text-purple-900">Admin dashboard</h1>
          <div className="flex gap-3">
            <Link
              href="/admin/patients"
              className="bg-white border border-pink-200 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold hover:bg-pink-50"
            >
              Patients
            </Link>
            <Link
              href="/admin/gallery"
              className="bg-white border border-pink-200 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold hover:bg-pink-50"
            >
              Manage gallery
            </Link>
            <button
              onClick={handleLogout}
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold"
            >
              Log out
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6 overflow-x-auto">
          <h2 className="text-lg font-semibold text-purple-900 mb-4">Appointment requests</h2>

          {loading ? (
            <p className="text-gray-500 text-sm">Loading…</p>
          ) : appointments.length === 0 ? (
            <p className="text-gray-500 text-sm">No appointment requests yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-pink-100">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Mobile</th>
                  <th className="py-2 pr-4">Date / slot</th>
                  <th className="py-2 pr-4">Reason</th>
                  <th className="py-2 pr-4">Existing?</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id} className="border-b border-pink-50">
                    <td className="py-3 pr-4 font-medium text-purple-900">{a.name}</td>
                    <td className="py-3 pr-4">{a.mobile_no}</td>
                    <td className="py-3 pr-4">{a.preferred_date} · {a.time_slot}</td>
                    <td className="py-3 pr-4">{a.reason}</td>
                    <td className="py-3 pr-4">{a.is_existing_patient ? 'Yes' : 'No'}</td>
                    <td className={`py-3 pr-4 capitalize ${statusColor[a.status] || ''}`}>{a.status}</td>
                    <td className="py-3 pr-4">
                      <select
                        value={a.status}
                        onChange={(e) => updateStatus(a.id, e.target.value)}
                        className="border border-gray-200 rounded-lg px-2 py-1 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}