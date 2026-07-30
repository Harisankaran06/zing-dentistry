'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { generateMonthlyReport } from '@/lib/generateMonthlyReport';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function MonthlyReportButton() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const startDate = new Date(year, month - 1, 1).toISOString().slice(0, 10);
      const endDate = new Date(year, month, 0).toISOString().slice(0, 10);

      const { data, error } = await supabase
        .from('visits')
        .select('visit_date, treatment_done, payment_mode, amount_paid, patients(name)')
        .gte('visit_date', startDate)
        .lte('visit_date', endDate)
        .order('visit_date', { ascending: true });

      if (error) {
        alert(error.message);
        return;
      }

      if (!data || data.length === 0) {
        alert('No visits found for the selected month.');
        return;
      }

      const visits = data.map((v) => ({
        patient_name: v.patients?.name,
        visit_date: v.visit_date,
        treatment_done: v.treatment_done,
        payment_mode: v.payment_mode,
        amount_paid: v.amount_paid,
      }));

      const monthLabel = MONTHS[month - 1] + ' ' + year;
      generateMonthlyReport(visits, monthLabel);
    } catch (err) {
      alert('Something went wrong while generating the report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-1 bg-white border border-pink-200 rounded-full pl-2 pr-1 py-1">
      <select
        value={month}
        onChange={(e) => setMonth(Number(e.target.value))}
        className="text-sm text-purple-800 bg-transparent focus:outline-none pr-1"
      >
        {MONTHS.map((m, i) => (
          <option key={m} value={i + 1}>
            {m}
          </option>
        ))}
      </select>
      <select
        value={year}
        onChange={(e) => setYear(Number(e.target.value))}
        className="text-sm text-purple-800 bg-transparent focus:outline-none pr-2 border-l border-pink-100 pl-2"
      >
        {[year - 1, year, year + 1].map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
      <button
        onClick={handleDownload}
        disabled={loading}
        className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-1.5 rounded-full text-sm font-semibold disabled:opacity-50 whitespace-nowrap"
      >
        {loading ? 'Generating...' : 'Download Report'}
      </button>
    </div>
  );
}
