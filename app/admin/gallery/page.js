'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function AdminGallery() {
  const [session, setSession] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [label, setLabel] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push('/admin/login');
      else setSession(data.session);
      setCheckingAuth(false);
    });
  }, [router]);

  useEffect(() => {
    if (session) fetchImages();
  }, [session]);

  const fetchImages = async () => {
    const { data, error } = await supabase.from('images').select('*').order('id', { ascending: false });
    if (!error && data) setImages(data);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const filePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('patient-images')
      .upload(filePath, file);

    if (uploadError) {
      alert("Couldn't upload the image. Try again.");
      setUploading(false);
      return;
    }

    const { error: insertError } = await supabase
      .from('images')
      .insert({ storage_path: filePath, label, is_public: isPublic });

    setUploading(false);
    if (insertError) {
      alert("Image uploaded but couldn't save the record. Check the images table.");
      return;
    }

    setFile(null);
    setLabel('');
    fetchImages();
  };

  const togglePublic = async (id, current) => {
    const { error } = await supabase.from('images').update({ is_public: !current }).eq('id', id);
    if (!error) setImages((prev) => prev.map((img) => (img.id === id ? { ...img, is_public: !current } : img)));
  };

  const deleteImage = async (img) => {
    await supabase.storage.from('patient-images').remove([img.storage_path]);
    await supabase.from('images').delete().eq('id', img.id);
    setImages((prev) => prev.filter((i) => i.id !== img.id));
  };

  if (checkingAuth) return <p className="text-center py-20 text-gray-500">Checking session…</p>;

  return (
    <div className="min-h-screen bg-purple-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-purple-900">Smile gallery</h1>
          <Link href="/admin" className="text-sm font-semibold text-purple-800">← Back to dashboard</Link>
        </div>

        <form onSubmit={handleUpload} className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-purple-900 mb-4">Upload a photo</h2>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-4 block text-sm"
            required
          />
          <input
            type="text"
            placeholder="Label, e.g. Before — cleaning"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 text-sm"
          />
          <label className="flex items-center gap-2 mb-4 text-sm text-gray-700">
            <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
            Show on public website
          </label>
          <button
            type="submit"
            disabled={uploading}
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-2 rounded-full disabled:opacity-60"
          >
            {uploading ? 'Uploading…' : 'Upload'}
          </button>
        </form>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((img) => {
            const { data: urlData } = supabase.storage.from('patient-images').getPublicUrl(img.storage_path);
            return (
              <div key={img.id} className="bg-white rounded-xl border border-pink-100 overflow-hidden">
                <img src={urlData.publicUrl} alt={img.label || 'Patient photo'} className="w-full h-32 object-cover" />
                <div className="p-2">
                  <p className="text-xs text-gray-600 truncate">{img.label}</p>
                  <div className="flex justify-between items-center mt-1">
                    <button onClick={() => togglePublic(img.id, img.is_public)} className="text-xs text-purple-700 font-semibold">
                      {img.is_public ? 'Public' : 'Hidden'}
                    </button>
                    <button onClick={() => deleteImage(img)} className="text-xs text-red-500">Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}