'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import ReceiptButton from '@/components/ReceiptButton';

const STORAGE_BUCKET = 'patient-images'; // change if your bucket is named differently

export default function PatientDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [patient, setPatient] = useState(null);
  const [visits, setVisits] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showVisitForm, setShowVisitForm] = useState(false);
  const [savingVisit, setSavingVisit] = useState(false);
  const [visitForm, setVisitForm] = useState({
    visit_date: '', chief_complaint: '', clinical_findings: '',
    treatment_plan: '', treatment_done: '', amount_charged: '',
    amount_paid: '', payment_mode: 'Cash', consent_given: false, notes: '',
  });

  const [uploading, setUploading] = useState(false);
  const [imageLabel, setImageLabel] = useState('Before');
  const [imageIsPublic, setImageIsPublic] = useState(false);
  const [imageVisitId, setImageVisitId] = useState('');

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
    const [{ data: p }, { data: v }, { data: img }] = await Promise.all([
      supabase.from('patients').select('*').eq('id', id).single(),
      supabase.from('visits').select('*').eq('patient_id', id).order('visit_date', { ascending: false }),
      supabase.from('images').select('*').eq('patient_id', id).order('created_at', { ascending: false }),
    ]);
    setPatient(p || null);
    setVisits(v || []);
    setImages(img || []);
    setLoading(false);
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
      alert("Couldn't save the visit. Check required fields.");
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

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const filePath = `${id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file);

    if (uploadError) {
      setUploading(false);
      alert("Upload failed: " + uploadError.message);
      return;
    }

    const { error: insertError } = await supabase.from('images').insert({
      patient_id: id,
      visit_id: imageVisitId || null,
      storage_path: filePath,
      label: imageLabel,
      is_public: imageIsPublic,
    });

    setUploading(false);
    if (insertError) {
      alert("Image uploaded but couldn't save its record. Contact support.");
      return;
    }
    e.target.value = '';
    fetchAll();
  };

  const getImageUrl = (storagePath) => {
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath);
    return data?.publicUrl;
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
          <h2 className="text-lg font-semibold text-purple-900 mb-4">Patient details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <p><span className="text-gray-500">Contact:</span> {patient.contact_no}</p>
            <p><span className="text-gray-500">Age / Sex:</span> {patient.age} / {patient.sex}</p>
            <p><span className="text-gray-500">Occupation:</span> {patient.occupation || '—'}</p>
            <p><span className="text-gray-500">DOB:</span> {patient.date_of_birth || '—'}</p>
            <p className="sm:col-span-2"><span className="text-gray-500">Address:</span> {patient.address || '—'}</p>
            <p className="sm:col-span-2"><span className="text-gray-500">Medical history:</span> {patient.medical_history || '—'}</p>
            <p className="sm:col-span-2"><span className="text-gray-500">Past illness/allergy/surgery:</span> {patient.past_illness_allergy_surgery || '—'}</p>
            <p className="sm:col-span-2"><span className="text-gray-500">Previous dental treatment:</span> {patient.previous_dental_treatment || '—'}</p>
          </div>
        </div>

        {/* Visit history + add visit */}
        <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6 mb-6">
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

        {/* Before/after images */}
        <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6">
          <h2 className="text-lg font-semibold text-purple-900 mb-4">Before / after photos</h2>

          <div className="flex flex-wrap gap-3 items-end mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
              <select value={imageLabel} onChange={(e) => setImageLabel(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
                <option>Before</option><option>After</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link to visit</label>
              <select value={imageVisitId} onChange={(e) => setImageVisitId(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
                <option value="">None</option>
                {visits.map((v) => <option key={v.id} value={v.id}>{v.visit_date}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700 pb-2">
              <input type="checkbox" checked={imageIsPublic} onChange={(e) => setImageIsPublic(e.target.checked)} />
              Show on public gallery
            </label>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload photo</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="text-sm" />
            </div>
          </div>
          {uploading && <p className="text-sm text-gray-500 mb-4">Uploading…</p>}

          {images.length === 0 ? (
            <p className="text-gray-500 text-sm">No photos uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((img) => (
                <div key={img.id} className="rounded-lg overflow-hidden border border-pink-50">
                  <img src={getImageUrl(img.storage_path)} alt={img.label} className="w-full h-32 object-cover" />
                  <div className="p-2 text-xs text-gray-600 flex justify-between">
                    <span>{img.label}</span>
                    {img.is_public && <span className="text-pink-500 font-semibold">Public</span>}
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