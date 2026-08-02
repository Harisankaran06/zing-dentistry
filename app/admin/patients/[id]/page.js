'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import ReceiptButton from '@/components/ReceiptButton';

const emptyPatientForm = {
  name: '', contact_no: '', appointment_date: '', occupation: '', address: '',
  date_of_birth: '', age: '', sex: 'Female', medical_history: '',
  past_illness_allergy_surgery: '', previous_dental_treatment: '',
};

export default function PatientDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [patient, setPatient] = useState(null);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [savingPatient, setSavingPatient] = useState(false);
  const [patientForm, setPatientForm] = useState(emptyPatientForm);

  const [showVisitForm, setShowVisitForm] = useState(false);
  const [savingVisit, setSavingVisit] = useState(false);
  const [visitForm, setVisitForm] = useState({
    visit_date: '', chief_complaint: '', clinical_findings: '',
    treatment_plan: '', treatment_done: '', amount_charged: '',
    amount_paid: '', payment_mode: 'Cash', consent_given: false, notes: '',
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push('/admin/login');
      else setCheckingAuth(false);
    });
  }, [router]);

  useEffect(() => {
    if (!checkingAuth && id) fetchAll();
  }, [checkingAuth, id]);

  const fetchAll = async () => {
    setLoading(true);
    const [{ data: p }, { data: v }] = await Promise.all([
      supabase.from('patients').select('*').eq('id', id).single(),
      supabase.from('visits').select('*').eq('patient_id', id).order('visit_date', { ascending: false }),
    ]);
    setPatient(p || null);
    if (p) {
      setPatientForm({
        name: p.name || '',
        contact_no: p.contact_no || '',
        appointment_date: p.appointment_date || '',
        occupation: p.occupation || '',
        address: p.address || '',
        date_of_birth: p.date_of_birth || '',
        age: p.age ?? '',
        sex: p.sex || 'Female',
        medical_history: p.medical_history || '',
        past_illness_allergy_surgery: p.past_illness_allergy_surgery || '',
        previous_dental_treatment: p.previous_dental_treatment || '',
      });
    }
    setVisits(v || []);
    setLoading(false);
  };

  const handleSavePatient = async (e) => {
    e.preventDefault();
    setSavingPatient(true);
    const payload = {
      name: patientForm.name,
      contact_no: patientForm.contact_no,
      appointment_date: patientForm.appointment_date || null,
      occupation: patientForm.occupation,
      address: patientForm.address,
      date_of_birth: patientForm.date_of_birth || null,
      age: patientForm.age ? parseInt(patientForm.age, 10) : null,
      sex: patientForm.sex,
      medical_history: patientForm.medical_history,
      past_illness_allergy_surgery: patientForm.past_illness_allergy_surgery,
      previous_dental_treatment: patientForm.previous_dental_treatment,
    };
    const { error } = await supabase.from('patients').update(payload).eq('id', id);
    setSavingPatient(false);
    if (error) {
      console.error('Patient update error:', error);
      alert(`Couldn't save patient details: ${error.message}`);
      return;
    }
    setEditMode(false);
    fetchAll();
  };

  const handleAddVisit = async (e) => {
    e.preventDefault();
    setSavingVisit(true);
    const payload = {
      patient_id: id,
      visit_date: visitForm.visit_date,
      chief_complaint: visitForm.chief_complaint,
      clinical_findings: { notes: visitForm.clinical_findings },
      treatment_plan: visitForm.treatment_plan,
      treatment_done: visitForm.treatment_done,
      amount_charged: visitForm.amount_charged ? parseFloat(visitForm.amount_charged) : null,
      amount_paid: visitForm.amount_paid ? parseFloat(visitForm.amount_paid) : null,
      payment_mode: visitForm.payment_mode,
      consent_given: visitForm.consent_given,
      notes: visitForm.notes,
    };
    const { error } = await supabase.from('visits').insert(payload);
    setSavingVisit(false);
    if (error) {
      console.error('Visit insert error:', error);
      alert(`Couldn't save the visit: ${error.message}`);
      return;
    }
    setVisitForm({
      visit_date: '', chief_complaint: '', clinical_findings: '',
      treatment_plan: '', treatment_done: '', amount_charged: '',
      amount_paid: '', payment_mode: 'Cash', consent_given: false, notes: '',
    });
    setShowVisitForm(false);
    fetchAll();
  };

  if (checkingAuth || loading) {
    return <p className="text-center py-20 text-gray-500">Loading…</p>;
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <p className="text-gray-600">Patient not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-purple-900">{patient.name}</h1>
          <Link href="/admin/patients" className="text-sm font-semibold text-purple-800">← Back to patients</Link>
        </div>

        {/* Patient info card */}
        <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-purple-900">Patient details</h2>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="bg-white border border-pink-200 text-purple-800 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-pink-50"
              >
                Edit
              </button>
            )}
          </div>

          {editMode ? (
            <form onSubmit={handleSavePatient} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient's name</label>
                <input value={patientForm.name} onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact no.</label>
                <input value={patientForm.contact_no} onChange={(e) => setPatientForm({ ...patientForm, contact_no: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Appointment date</label>
                <input type="date" value={patientForm.appointment_date} onChange={(e) => setPatientForm({ ...patientForm, appointment_date: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                <input value={patientForm.occupation} onChange={(e) => setPatientForm({ ...patientForm, occupation: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input type="number" value={patientForm.age} onChange={(e) => setPatientForm({ ...patientForm, age: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
                <select value={patientForm.sex} onChange={(e) => setPatientForm({ ...patientForm, sex: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2">
                  <option>Female</option><option>Male</option><option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of birth</label>
                <input type="date" value={patientForm.date_of_birth} onChange={(e) => setPatientForm({ ...patientForm, date_of_birth: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input value={patientForm.address} onChange={(e) => setPatientForm({ ...patientForm, address: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Medical history</label>
                <textarea value={patientForm.medical_history} onChange={(e) => setPatientForm({ ...patientForm, medical_history: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2" rows={2} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Past illness / allergy / surgery</label>
                <textarea value={patientForm.past_illness_allergy_surgery} onChange={(e) => setPatientForm({ ...patientForm, past_illness_allergy_surgery: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2" rows={2} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Previous dental treatment</label>
                <textarea value={patientForm.previous_dental_treatment} onChange={(e) => setPatientForm({ ...patientForm, previous_dental_treatment: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2" rows={2} />
              </div>
              <div className="sm:col-span-2 flex gap-3">
                <button type="submit" disabled={savingPatient} className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-2 rounded-full disabled:opacity-60">
                  {savingPatient ? 'Saving…' : 'Save changes'}
                </button>
                <button
                  type="button"
                  onClick={() => { setEditMode(false); fetchAll(); }}
                  className="bg-white border border-gray-200 text-gray-700 font-semibold px-6 py-2 rounded-full"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <p><span className="text-gray-500">Contact:</span> {patient.contact_no}</p>
              <p><span className="text-gray-500">Appointment date:</span> {patient.appointment_date || '—'}</p>
              <p><span className="text-gray-500">Age / Sex:</span> {patient.age} / {patient.sex}</p>
              <p><span className="text-gray-500">Occupation:</span> {patient.occupation || '—'}</p>
              <p><span className="text-gray-500">DOB:</span> {patient.date_of_birth || '—'}</p>
              <p className="sm:col-span-2"><span className="text-gray-500">Address:</span> {patient.address || '—'}</p>
              <p className="sm:col-span-2"><span className="text-gray-500">Medical history:</span> {patient.medical_history || '—'}</p>
              <p className="sm:col-span-2"><span className="text-gray-500">Past illness/allergy/surgery:</span> {patient.past_illness_allergy_surgery || '—'}</p>
              <p className="sm:col-span-2"><span className="text-gray-500">Previous dental treatment:</span> {patient.previous_dental_treatment || '—'}</p>
            </div>
          )}
        </div>

        {/* Visit history + add visit */}
        <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-purple-900">Visit history</h2>
            <button
              onClick={() => setShowVisitForm(!showVisitForm)}
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded-full text-sm"
            >
              + Log a visit
            </button>
          </div>

          {showVisitForm && (
            <form onSubmit={handleAddVisit} className="border border-pink-100 rounded-xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visit date</label>
                <input type="date" value={visitForm.visit_date} onChange={(e) => setVisitForm({ ...visitForm, visit_date: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment mode</label>
                <select value={visitForm.payment_mode} onChange={(e) => setVisitForm({ ...visitForm, payment_mode: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2">
                  <option>Cash</option><option>Card</option><option>UPI</option><option>Insurance</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Chief complaint</label>
                <textarea value={visitForm.chief_complaint} onChange={(e) => setVisitForm({ ...visitForm, chief_complaint: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2" rows={2} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Clinical findings</label>
                <textarea value={visitForm.clinical_findings} onChange={(e) => setVisitForm({ ...visitForm, clinical_findings: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2" rows={2} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Treatment plan</label>
                <textarea value={visitForm.treatment_plan} onChange={(e) => setVisitForm({ ...visitForm, treatment_plan: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2" rows={2} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Treatment done</label>
                <textarea value={visitForm.treatment_done} onChange={(e) => setVisitForm({ ...visitForm, treatment_done: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2" rows={2} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount charged</label>
                <input type="number" value={visitForm.amount_charged} onChange={(e) => setVisitForm({ ...visitForm, amount_charged: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount paid</label>
                <input type="number" value={visitForm.amount_paid} onChange={(e) => setVisitForm({ ...visitForm, amount_paid: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea value={visitForm.notes} onChange={(e) => setVisitForm({ ...visitForm, notes: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2" rows={2} />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 sm:col-span-2">
                <input type="checkbox" checked={visitForm.consent_given} onChange={(e) => setVisitForm({ ...visitForm, consent_given: e.target.checked })} />
                Patient consent given
              </label>
              <div className="sm:col-span-2">
                <button type="submit" disabled={savingVisit} className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-2 rounded-full disabled:opacity-60">
                  {savingVisit ? 'Saving…' : 'Save visit'}
                </button>
              </div>
            </form>
          )}

          {visits.length === 0 ? (
            <p className="text-gray-500 text-sm">No visits logged yet.</p>
          ) : (
            <div className="space-y-4">
              {visits.map((v) => (
                <div key={v.id} className="border border-pink-50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-purple-900">{v.visit_date}</p>
                    <p className="text-sm text-gray-500">{v.payment_mode} · ₹{v.amount_paid ?? 0} / ₹{v.amount_charged ?? 0}</p>
                  </div>
                  <p className="text-sm text-gray-700 mb-1"><span className="text-gray-500">Complaint:</span> {v.chief_complaint || '—'}</p>
                  <p className="text-sm text-gray-700 mb-1"><span className="text-gray-500">Findings:</span> {v.clinical_findings?.notes || '—'}</p>
                  <p className="text-sm text-gray-700 mb-1"><span className="text-gray-500">Plan:</span> {v.treatment_plan || '—'}</p>
                  <p className="text-sm text-gray-700 mb-2"><span className="text-gray-500">Done:</span> {v.treatment_done || '—'}</p>
                  <div className="flex justify-end">
                    <ReceiptButton patient={patient} visit={v} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
