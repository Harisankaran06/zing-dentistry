'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function PatientsPage() {
  const [session, setSession] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [patients, setPatients] = useState([]);
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', contact_no: '', occupation: '', address: '', date_of_birth: '',
    age: '', sex: 'Female', medical_history: '', past_illness_allergy_surgery: '',
    previous_dental_treatment: '', appointment_date: '',
  });
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push('/admin/login');
      else setSession(data.session);
      setCheckingAuth(false);
    });
  }, [router]);

  useEffect(() => { if (session) fetchPatients(); }, [session]);

  const fetchPatients = async () => {
    const { data, error } = await supabase
      .from('patients')
      .select('*, visits(count)')
      .order('created_at', { ascending: false });
    if (!error && data) setPatients(data);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      age: form.age ? parseInt(form.age, 10) : null,
      appointment_date: form.appointment_date || null,
    };
    const { error } = await supabase.from('patients').insert(payload);
    setSaving(false);
    if (error) {
      alert("Couldn't save the patient. Check required fields.");
      return;
    }
    setForm({
      name: '', contact_no: '', occupation: '', address: '', date_of_birth: '',
      age: '', sex: 'Female', medical_history: '', past_illness_allergy_surgery: '',
      previous_dental_treatment: '', appointment_date: '',
    });
    setShowForm(false);
    fetchPatients();
  };

  const filtered = patients.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  if (checkingAuth) return <p className="text-center py-20 text-gray-500">Checking session…</p>;

  return (
    <div className="min-h-screen bg-purple-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-purple-900">Patients</h1>
          <Link href="/admin" className="text-sm font-semibold text-purple-800">← Back to dashboard</Link>
        </div>

        <div className="flex justify-between items-center mb-4 gap-3">
          <input
            placeholder="Search by name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full max-w-xs"
          />
          <button onClick={() => setShowForm(!showForm)} className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded-full text-sm whitespace-nowrap">
            + New patient
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAdd} className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient's name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact no.</label>
              <input value={form.contact_no} onChange={(e) => setForm({ ...form, contact_no: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Appointment date</label>
              <input type="date" value={form.appointment_date} onChange={(e) => setForm({ ...form, appointment_date: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
              <input value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
              <select value={form.sex} onChange={(e) => setForm({ ...form, sex: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2">
                <option>Female</option><option>Male</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of birth</label>
              <input type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Medical history</label>
              <textarea value={form.medical_history} onChange={(e) => setForm({ ...form, medical_history: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2" rows={2} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Past illness / allergy / surgery</label>
              <textarea value={form.past_illness_allergy_surgery} onChange={(e) => setForm({ ...form, past_illness_allergy_surgery: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2" rows={2} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Previous dental treatment</label>
              <textarea value={form.previous_dental_treatment} onChange={(e) => setForm({ ...form, previous_dental_treatment: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2" rows={2} />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" disabled={saving} className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-2 rounded-full disabled:opacity-60">
                {saving ? 'Saving…' : 'Save patient'}
              </button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6">
          {filtered.length === 0 ? (
            <p className="text-gray-500 text-sm">No patients yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-pink-100">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Contact</th>
                  <th className="py-2 pr-4">Age / sex</th>
                  <th className="py-2 pr-4">Appointment</th>
                  <th className="py-2 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const visitCount = p.visits?.[0]?.count ?? 0;
                  return (
                    <tr key={p.id} className="border-b border-pink-50">
                      <td className="py-3 pr-4 font-medium text-purple-900">
                        {p.name}
                        {visitCount > 0 && (
                          <span className="ml-2 inline-block text-xs font-semibold text-purple-600 bg-purple-100 rounded-full px-2 py-0.5">
                            {visitCount} visit{visitCount === 1 ? '' : 's'}
                          </span>
                        )}
                      </td>
                      <td className="py-3 pr-4">{p.contact_no}</td>
                      <td className="py-3 pr-4">{p.age} / {p.sex}</td>
                      <td className="py-3 pr-4">{p.appointment_date || '—'}</td>
                      <td className="py-3 pr-4">
                        <Link href={`/admin/patients/${p.id}`} className="text-pink-600 font-semibold">Open →</Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
