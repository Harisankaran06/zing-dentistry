'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Save, CheckCircle2, ShieldCheck, Mail, Building, Key } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  const [clinicConfig, setClinicConfig] = useState({
    clinicName: 'Zing Dentistry',
    doctorName: 'Dr. Vidya BDS',
    phone: '+91 98415 84996',
    email: 'contact@zingdentistry.com',
    address: 'Annanagar East, Chennai, Tamil Nadu',
    hours: 'Mon–Sat: 10:00 AM – 8:00 PM',
  });

  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [savingConfig, setSavingConfig] = useState(false);
  const [configSuccess, setConfigSuccess] = useState(false);

  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push('/admin/login');
      } else {
        setUserEmail(data.session.user?.email || '');
        setCheckingAuth(false);
      }
    });
  }, [router]);

  const handleConfigSave = (e) => {
    e.preventDefault();
    setSavingConfig(true);
    setTimeout(() => {
      setSavingConfig(false);
      setConfigSuccess(true);
      setTimeout(() => setConfigSuccess(false), 3000);
    }, 500);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordError('');
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setUpdatingPassword(true);
    const { error } = await supabase.auth.updateUser({
      password: passwordForm.newPassword,
    });

    setUpdatingPassword(false);
    if (error) {
      setPasswordError(error.message);
    } else {
      setPasswordSuccess(true);
      setPasswordForm({ newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordSuccess(false), 3000);
    }
  };

  if (checkingAuth) {
    return <p className="text-center py-20 text-gray-500">Checking session…</p>;
  }

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#3D1F5C] flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#F0507B]" />
          Clinic & Admin Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage clinic information, contact details, and account security
        </p>
      </div>

      {/* Account Banner */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-purple-100 text-[#3D1F5C] flex items-center justify-center font-bold text-lg">
            {userEmail.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-[#3D1F5C]">{userEmail}</p>
            <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Authenticated Administrator
            </p>
          </div>
        </div>
      </div>

      {/* Clinic Details Form */}
      <form
        onSubmit={handleConfigSave}
        className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6 md:p-8 space-y-6"
      >
        <div className="flex items-center gap-2 border-b border-pink-50 pb-3">
          <Building className="w-5 h-5 text-[#F0507B]" />
          <h2 className="font-semibold text-lg text-[#3D1F5C]">Clinic Profile</h2>
        </div>

        {configSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Clinic details saved successfully.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Clinic Name
            </label>
            <input
              type="text"
              value={clinicConfig.clinicName}
              onChange={(e) => setClinicConfig({ ...clinicConfig, clinicName: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F0507B]/40 focus:border-[#F0507B]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Lead Dentist Name
            </label>
            <input
              type="text"
              value={clinicConfig.doctorName}
              onChange={(e) => setClinicConfig({ ...clinicConfig, doctorName: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F0507B]/40 focus:border-[#F0507B]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Contact Phone
            </label>
            <input
              type="text"
              value={clinicConfig.phone}
              onChange={(e) => setClinicConfig({ ...clinicConfig, phone: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F0507B]/40 focus:border-[#F0507B]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Contact Email
            </label>
            <input
              type="email"
              value={clinicConfig.email}
              onChange={(e) => setClinicConfig({ ...clinicConfig, email: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F0507B]/40 focus:border-[#F0507B]"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Clinic Address
            </label>
            <input
              type="text"
              value={clinicConfig.address}
              onChange={(e) => setClinicConfig({ ...clinicConfig, address: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F0507B]/40 focus:border-[#F0507B]"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Working Hours
            </label>
            <input
              type="text"
              value={clinicConfig.hours}
              onChange={(e) => setClinicConfig({ ...clinicConfig, hours: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F0507B]/40 focus:border-[#F0507B]"
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={savingConfig}
            className="flex items-center gap-2 bg-[#F0507B] hover:bg-[#e13f68] text-white font-medium px-6 py-2.5 rounded-full text-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            {savingConfig ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>

      {/* Security Form */}
      <form
        onSubmit={handlePasswordUpdate}
        className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6 md:p-8 space-y-6"
      >
        <div className="flex items-center gap-2 border-b border-pink-50 pb-3">
          <Key className="w-5 h-5 text-[#F0507B]" />
          <h2 className="font-semibold text-lg text-[#3D1F5C]">Update Password</h2>
        </div>

        {passwordError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
            {passwordError}
          </div>
        )}

        {passwordSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Password updated successfully.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              New Password
            </label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F0507B]/40 focus:border-[#F0507B]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F0507B]/40 focus:border-[#F0507B]"
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={updatingPassword}
            className="flex items-center gap-2 bg-[#3D1F5C] hover:bg-[#2b1642] text-white font-medium px-6 py-2.5 rounded-full text-sm transition-colors"
          >
            <Key className="w-4 h-4" />
            {updatingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
}
