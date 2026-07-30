'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import MonthlyReportButton from '@/components/MonthlyReportButton';

const statusColor = {
  pending: 'text-yellow-600',
  confirmed: 'text-blue-600',
  completed: 'text-green-600',
  cancelled: 'text-red-500',
};

const getTodayStr = () => {
  const d = new Date();
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
};

const getMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
};

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    todaysAppointments: 0,
    totalPatients: 0,
    treatmentsThisMonth: 0,
    monthlyRevenue: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

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
    if (session) {
      fetchAppointments();
      fetchStats();
    }
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

  const fetchStats = async () => {
    setStatsLoading(true);
    const todayStr = getTodayStr();
    const { start: monthStart, end: monthEnd } = getMonthRange();

    const [
      { count: todaysAppointments },
      { count: totalPatients },
      { count: treatmentsThisMonth },
      { data: revenueRows },
    ] = await Promise.all([
      supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('preferred_date', todayStr),
      supabase.from('patients').select('*', { count: 'exact', head: true }),
      supabase
        .from('visits')
        .select('*', { count: 'exact', head: true })
        .gte('visit_date', monthStart)
        .lte('visit_date', monthEnd),
      supabase
        .from('visits')
        .select('amount_paid')
        .gte('visit_date', monthStart)
        .lte('visit_date', monthEnd),
    ]);

    const monthlyRevenue = (revenueRows || []).reduce(
      (sum, row) => sum + (Number(row.amount_paid) || 0),
      0
    );

    setStats({
      todaysAppointments: todaysAppointments || 0,
      totalPatients: totalPatients || 0,
      treatmentsThisMonth: treatmentsThisMonth || 0,
      monthlyRevenue,
    });
    setStatsLoading(false);
  };

  // Finds a matching patient by mobile number, or creates a new one,
  // then links the appointment to that patient via patient_id.
  // Also keeps the patient's appointment_date in sync with this appointment.
  const ensurePatientForAppointment = async (appointment) => {
    // Already linked to a patient? Just make sure their appointment_date is up to date.
    if (appointment.patient_id) {
      const { error: updateError } = await supabase
        .from('patients')
        .update({ appointment_date: appointment.preferred_date })
        .eq('id', appointment.patient_id);

      if (updateError) {
        console.error(updateError);
      }
      return;
    }

    // Avoid duplicates: look for an existing patient with the same contact number.
    const { data: existingMatches, error: findError } = await supabase
      .from('patients')
      .select('id')
      .eq('contact_no', appointment.mobile_no)
      .limit(1);

    if (findError) {
      console.error(findError);
      return;
    }

    let patientId = existingMatches && existingMatches.length > 0 ? existingMatches[0].id : null;
    let createdNew = false;

    if (!patientId) {
      const { data: newPatient, error: insertError } = await supabase
        .from('patients')
        .insert({
          name: appointment.name,
          contact_no: appointment.mobile_no,
          appointment_date: appointment.preferred_date,
        })
        .select('id')
        .single();

      if (insertError) {
        console.error(insertError);
        return;
      }
      patientId = newPatient.id;
      createdNew = true;
    } else {
      // Matched an existing patient — still stamp their latest appointment date.
      const { error: updateError } = await supabase
        .from('patients')
        .update({ appointment_date: appointment.preferred_date })
        .eq('id', patientId);

      if (updateError) {
        console.error(updateError);
      }
    }

    const { error: linkError } = await supabase
      .from('appointments')
      .update({ patient_id: patientId })
      .eq('id', appointment.id);

    if (linkError) {
      console.error(linkError);
      return;
    }

    setAppointments((prev) =>
      prev.map((a) => (a.id === appointment.id ? { ...a, patient_id: patientId } : a))
    );

    if (createdNew) {
      setStats((prev) => ({ ...prev, totalPatients: prev.totalPatients + 1 }));
    }
  };

  const updateStatus = async (id, status) => {
    const appointment = appointments.find((a) => a.id === id);

    const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
    if (error) return;

    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));

    // Only add to the patient list once the appointment is confirmed.
    if (status === 'confirmed' && appointment) {
      await ensurePatientForAppointment(appointment);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (checkingAuth) {
    return <p className="text-center py-20 text-gray-500">Checking session…</p>;
  }

  const statCards = [
    {
      label: "Today's Appointments",
      value: stats.todaysAppointments,
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      icon: '📅',
    },
    {
      label: 'Total Patients',
      value: stats.totalPatients,
      bg: 'bg-green-50',
      text: 'text-green-600',
      icon: '👥',
    },
    {
      label: 'Treatments This Month',
      value: stats.treatmentsThisMonth,
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      icon: '🦷',
    },
    {
      label: 'Monthly Revenue',
      value: `₹${stats.monthlyRevenue.toLocaleString('en-IN')}`,
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      icon: '₹',
    },
  ];

  return (
    <div className="min-h-screen bg-purple-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <h1 className="text-2xl font-bold text-purple-900">Admin dashboard</h1>
          <div className="flex gap-3 flex-wrap">
            <MonthlyReportButton />
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

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-2xl shadow-sm border border-pink-100 p-5"
            >
              <div
                className={`w-10 h-10 rounded-xl ${card.bg} ${card.text} flex items-center justify-center text-lg mb-3`}
              >
                {card.icon}
              </div>
              <p className="text-sm text-gray-500 mb-1">{card.label}</p>
              <p className="text-xl font-bold text-purple-900">
                {statsLoading ? '—' : card.value}
              </p>
            </div>
          ))}
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