'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const TIME_SLOTS = ['Morning 10-1', 'Afternoon 1-4', 'Evening 4-8'];

export default function BookPage() {
  const [form, setForm] = useState({
    name: '', mobile_no: '', preferred_date: '', time_slot: TIME_SLOTS[0],
    reason: '', is_existing_patient: false,
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
      setError("Couldn't send your request. Please try again or call us.");
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50 px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-8 max-w-sm text-center">
          <h1 className="text-xl font-bold text-purple-900 mb-2">Request sent</h1>
          <p className="text-gray-600 text-sm">We've received your appointment request. Our team will call you shortly to confirm.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50 py-12 px-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-pink-100 p-8 max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-purple-900 mb-6">Book an appointment</h1>

        <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4"
          required
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile number</label>
        <input
          value={form.mobile_no}
          onChange={(e) => setForm({ ...form, mobile_no: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4"
          required
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred date</label>
        <input
          type="date"
          value={form.preferred_date}
          onChange={(e) => setForm({ ...form, preferred_date: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4"
          required
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred time</label>
        <select
          value={form.time_slot}
          onChange={(e) => setForm({ ...form, time_slot: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4"
        >
          {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <label className="block text-sm font-medium text-gray-700 mb-1">Reason for visit</label>
        <textarea
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4"
          rows={3}
        />

        <label className="flex items-center gap-2 mb-6 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.is_existing_patient}
            onChange={(e) => setForm({ ...form, is_existing_patient: e.target.checked })}
          />
          I'm an existing patient
        </label>

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-full disabled:opacity-60"
        >
          {loading ? 'Sending…' : 'Request appointment'}
        </button>
      </form>
    </div>
  );
}