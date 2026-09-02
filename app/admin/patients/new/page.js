'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, UserPlus, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function NewPatientPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    contact_no: '',
    appointment_date: '',
    occupation: '',
    address: '',
    date_of_birth: '',
    age: '',
    sex: 'Female',
    medical_history: '',
    past_illness_allergy_surgery: '',
    previous_dental_treatment: '',
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push('/admin/login');
      else setCheckingAuth(false);
    });
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.contact_no.trim()) {
      setError('Patient name and contact number are required.');
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      name: form.name.trim(),
      contact_no: form.contact_no.trim(),
      appointment_date: form.appointment_date || null,
      occupation: form.occupation.trim() || null,
      address: form.address.trim() || null,
      date_of_birth: form.date_of_birth || null,
      age: form.age ? parseInt(form.age, 10) : null,
      sex: form.sex,
      medical_history: form.medical_history.trim() || null,
      past_illness_allergy_surgery: form.past_illness_allergy_surgery.trim() || null,
      previous_dental_treatment: form.previous_dental_treatment.trim() || null,
    };

    const { data, error: insertError } = await supabase
      .from('patients')
      .insert(payload)
      .select('id')
      .single();

    setSaving(false);

    if (insertError) {
      console.error('Error adding patient:', insertError);
      setError(`Failed to save patient: ${insertError.message}`);
      return;
    }

    router.push(`/admin/patients/${data.id}`);
  };

  if (checkingAuth) {
    return <p className="text-center py-20 text-gray-500">Checking session…</p>;
  }

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/patients"
            className="p-2 rounded-full border border-pink-100 text-[#3D1F5C] hover:bg-pink-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="font-serif text-2xl font-bold text-[#3D1F5C]">New Patient Intake</h1>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6 md:p-8 space-y-6"
      >
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Rahul Sharma"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F0507B]/40 focus:border-[#F0507B]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Contact Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="contact_no"
              value={form.contact_no}
              onChange={handleChange}
              placeholder="e.g. +91 98410 12345"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F0507B]/40 focus:border-[#F0507B]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Appointment Date
            </label>
            <input
              type="date"
              name="appointment_date"
              value={form.appointment_date}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F0507B]/40 focus:border-[#F0507B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Occupation
            </label>
            <input
              type="text"
              name="occupation"
              value={form.occupation}
              onChange={handleChange}
              placeholder="e.g. Architect"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F0507B]/40 focus:border-[#F0507B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Age
            </label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              placeholder="e.g. 34"
              min="0"
              max="120"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F0507B]/40 focus:border-[#F0507B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Sex
            </label>
            <select
              name="sex"
              value={form.sex}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F0507B]/40 focus:border-[#F0507B]"
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="date_of_birth"
              value={form.date_of_birth}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F0507B]/40 focus:border-[#F0507B]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Chennai, Tamil Nadu"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F0507B]/40 focus:border-[#F0507B]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Medical History
          </label>
          <textarea
            name="medical_history"
            value={form.medical_history}
            onChange={handleChange}
            placeholder="Diabetes, Hypertension, Heart condition, Asthma..."
            rows={2}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F0507B]/40 focus:border-[#F0507B]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Past Illness / Allergies / Surgeries
          </label>
          <textarea
            name="past_illness_allergy_surgery"
            value={form.past_illness_allergy_surgery}
            onChange={handleChange}
            placeholder="Allergies to local anesthetics, penicillin, past operations..."
            rows={2}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F0507B]/40 focus:border-[#F0507B]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Previous Dental Treatment
          </label>
          <textarea
            name="previous_dental_treatment"
            value={form.previous_dental_treatment}
            onChange={handleChange}
            placeholder="Root canals, extractions, braces, crowns done previously..."
            rows={2}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F0507B]/40 focus:border-[#F0507B]"
          />
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-pink-50">
          <Link
            href="/admin/patients"
            className="px-5 py-2.5 rounded-full border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#F0507B] hover:bg-[#e13f68] text-white text-sm font-semibold transition-colors disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Patient'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
