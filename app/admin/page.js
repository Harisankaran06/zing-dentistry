'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import MonthlyReportButton from '@/components/MonthlyReportButton';

const statusColor = {
  pending: 'text-yellow-600',
  confirmed: 'text-blue-600',
  completed: 'text-green-600',
  cancelled: 'text-red-500',
};

// Chip styling for the calendar grid — brand-toned instead of semantic red/green.
const chipStyle = {
  pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  confirmed: 'bg-[#F0507B]/10 text-[#F0507B] border border-[#F0507B]/30',
  completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  cancelled: 'bg-gray-100 text-gray-400 border border-gray-200 line-through',
};

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Formats a Date using its LOCAL year/month/day (no UTC conversion,
// so no off-by-one-day bug in timezones ahead of UTC like IST).
const formatLocalDate = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getTodayStr = () => {
  return formatLocalDate(new Date());
};

const getMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    start: formatLocalDate(start),
    end: formatLocalDate(end),
  };
};

// Sunday-start of the week containing `date`.
const getWeekStart = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
};

// Builds a fixed 6-row (42-day) month grid, Sunday-start, like a standard
// calendar UI — including the trailing/leading days from adjacent months.
const getMonthGridWeeks = (year, month) => {
  const firstOfMonth = new Date(year, month, 1);
  const gridStart = getWeekStart(firstOfMonth);

  const weeks = [];
  let cursor = new Date(gridStart);
  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
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

  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

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
    setSelectedAppointment((prev) => (prev && prev.id === id ? { ...prev, status } : prev));

    if (status === 'confirmed' && appointment) {
      await ensurePatientForAppointment(appointment);
    }
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

  // ---- Month calendar data ----
  const todayStr = getTodayStr();
  const today = new Date();
  const baseMonthDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const gridWeeks = getMonthGridWeeks(baseMonthDate.getFullYear(), baseMonthDate.getMonth());

  const monthDays = gridWeeks.flat().map((date) => {
    const dateStr = formatLocalDate(date);
    return {
      date,
      dateStr,
      dayNumber: date.getDate(),
      isToday: dateStr === todayStr,
      inCurrentMonth: date.getMonth() === baseMonthDate.getMonth(),
      items: appointments
        .filter((a) => a.preferred_date === dateStr)
        .sort((a, b) => (a.time_slot || '').localeCompare(b.time_slot || '')),
    };
  });

  // ---- Today's schedule panel data ----
  const todaysAppointmentsList = appointments
    .filter((a) => a.preferred_date === todayStr)
    .sort((a, b) => (a.time_slot || '').localeCompare(b.time_slot || ''));

  const todaysCounts = {
    total: todaysAppointmentsList.length,
    pending: todaysAppointmentsList.filter((a) => a.status === 'pending').length,
    confirmed: todaysAppointmentsList.filter((a) => a.status === 'confirmed').length,
    completed: todaysAppointmentsList.filter((a) => a.status === 'completed').length,
  };

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <h1 className="text-2xl font-serif text-[#3D1F5C]">Admin dashboard</h1>
          <MonthlyReportButton />
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
              <p className="text-xl font-bold text-[#3D1F5C]">
                {statsLoading ? '—' : card.value}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          {/* Month calendar */}
          <div className="flex-1 min-w-0 bg-white rounded-2xl shadow-sm border border-pink-100 p-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <h2 className="text-lg font-semibold text-[#3D1F5C]">
                {MONTH_LABELS[baseMonthDate.getMonth()]} {baseMonthDate.getFullYear()}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMonthOffset((m) => m - 1)}
                  className="p-1.5 rounded-full border border-pink-100 text-[#3D1F5C] hover:bg-pink-50"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setMonthOffset(0)}
                  className="px-3 py-1.5 rounded-full border border-pink-100 text-sm text-[#3D1F5C] hover:bg-pink-50"
                >
                  Today
                </button>
                <button
                  onClick={() => setMonthOffset((m) => m + 1)}
                  className="p-1.5 rounded-full border border-pink-100 text-[#3D1F5C] hover:bg-pink-50"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-1">
              {DAY_LABELS.map((label) => (
                <div
                  key={label}
                  className="text-center text-[11px] font-medium text-[#3D1F5C]/50 py-1"
                >
                  {label}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {monthDays.map((day) => (
                <div
                  key={day.dateStr}
                  className={`min-h-[92px] rounded-lg p-1.5 border ${
                    day.isToday
                      ? 'border-[#F0507B] bg-[#F0507B]/5'
                      : 'border-pink-50 bg-[#FBF7F5]/40'
                  } ${!day.inCurrentMonth ? 'opacity-40' : ''}`}
                >
                  <p
                    className={`text-xs mb-1 ${
                      day.isToday ? 'font-semibold text-[#F0507B]' : 'text-[#3D1F5C]/70'
                    }`}
                  >
                    {day.dayNumber}
                  </p>
                  <div className="space-y-1 max-h-[64px] overflow-y-auto">
                    {day.items.map((a) => (
                      <button
                        key={a.id}
                        onClick={() => setSelectedAppointment(a)}
                        className={`w-full text-left text-[10px] leading-tight rounded px-1.5 py-1 truncate ${
                          chipStyle[a.status] || 'bg-gray-50 text-gray-600 border border-gray-200'
                        }`}
                        title={`${a.name} · ${a.time_slot}`}
                      >
                        {a.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's schedule panel */}
          <aside className="w-full lg:w-80 shrink-0 bg-white rounded-2xl shadow-sm border border-pink-100 p-6">
            <h2 className="text-lg font-semibold text-[#3D1F5C] mb-4">Today&apos;s Schedule</h2>

            <div className="grid grid-cols-4 gap-2 mb-5">
              {[
                { label: 'Today', value: todaysCounts.total },
                { label: 'Pending', value: todaysCounts.pending },
                { label: 'Confirmed', value: todaysCounts.confirmed },
                { label: 'Done', value: todaysCounts.completed },
              ].map((c) => (
                <div
                  key={c.label}
                  className="text-center bg-[#FBF7F5] rounded-lg py-2 px-1 border border-pink-50"
                >
                  <p className="text-base font-bold text-[#3D1F5C]">{c.value}</p>
                  <p className="text-[10px] text-gray-500">{c.label}</p>
                </div>
              ))}
            </div>

            {todaysAppointmentsList.length === 0 ? (
              <p className="text-sm text-gray-400">No appointments today.</p>
            ) : (
              <div className="space-y-3">
                {todaysAppointmentsList.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setSelectedAppointment(a)}
                    className="w-full text-left border-b border-pink-50 pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-[#3D1F5C]">{a.name}</p>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          chipStyle[a.status] || 'bg-gray-50 text-gray-600 border border-gray-200'
                        }`}
                      >
                        {a.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {a.time_slot} · {a.reason || 'Visit reason not specified'}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </aside>
        </div>

        {/* Full request list */}
        <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6 overflow-x-auto">
          <h2 className="text-lg font-semibold text-[#3D1F5C] mb-4">Appointment requests</h2>

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
                    <td className="py-3 pr-4 font-medium text-[#3D1F5C]">{a.name}</td>
                    <td className="py-3 pr-4">{a.mobile_no}</td>
                    <td className="py-3 pr-4">
                      {a.preferred_date} · {a.time_slot}
                    </td>
                    <td className="py-3 pr-4">{a.reason}</td>
                    <td className="py-3 pr-4">{a.is_existing_patient ? 'Yes' : 'No'}</td>
                    <td className={`py-3 pr-4 capitalize ${statusColor[a.status] || ''}`}>
                      {a.status}
                    </td>
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

      {/* Appointment detail popover, à la Practo's calendar click-through */}
      {selectedAppointment && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-[#3D1F5C]/30 p-4"
          onClick={() => setSelectedAppointment(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedAppointment(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <p className="font-serif text-lg text-[#3D1F5C]">{selectedAppointment.name}</p>
            <p className="text-sm text-gray-500 mb-4">{selectedAppointment.mobile_no}</p>

            <dl className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <dt className="text-gray-500">Date / slot</dt>
                <dd className="text-[#3D1F5C]">
                  {selectedAppointment.preferred_date} · {selectedAppointment.time_slot}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Reason</dt>
                <dd className="text-[#3D1F5C]">{selectedAppointment.reason}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Existing patient?</dt>
                <dd className="text-[#3D1F5C]">
                  {selectedAppointment.is_existing_patient ? 'Yes' : 'No'}
                </dd>
              </div>
            </dl>

            <label className="block text-xs text-gray-500 mb-1">Status</label>
            <select
              value={selectedAppointment.status}
              onChange={(e) => updateStatus(selectedAppointment.id, e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}