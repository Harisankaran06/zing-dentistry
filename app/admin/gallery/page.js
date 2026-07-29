'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

const STORAGE_BUCKET = 'patient-images';

export default function AdminGallery() {
  const [session, setSession] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [transformations, setTransformations] = useState([]);

  const [title, setTitle] = useState('');
  const [beforeFile, setBeforeFile] = useState(null);
  const [afterFile, setAfterFile] = useState(null);
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
    if (session) fetchTransformations();
  }, [session]);

  const fetchTransformations = async () => {
    const { data, error } = await supabase
      .from('transformations')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setTransformations(data);
  };

  const uploadOne = async (file, tag) => {
    const fileExt = file.name.split('.').pop();
    const filePath = `transformations/${Date.now()}-${tag}-${Math.random()
      .toString(36)
      .slice(2)}.${fileExt}`;

    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(filePath, file);

    if (error) {
      // Throw the REAL Supabase error message up to handleUpload instead of swallowing it
      throw new Error(`${tag} upload failed: ${error.message}`);
    }
    return filePath;
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!beforeFile || !afterFile) {
      alert('Please select both a Before and an After photo.');
      return;
    }
    setUploading(true);

    try {
      const [beforePath, afterPath] = await Promise.all([
        uploadOne(beforeFile, 'before'),
        uploadOne(afterFile, 'after'),
      ]);

      const { error: insertError } = await supabase.from('transformations').insert({
        title,
        before_path: beforePath,
        after_path: afterPath,
        is_public: isPublic,
      });

      if (insertError) {
        console.error('Insert error:', insertError);
        alert(`Photos uploaded but the record couldn't be saved: ${insertError.message}`);
      } else {
        setTitle('');
        setBeforeFile(null);
        setAfterFile(null);
        fetchTransformations();
      }
    } catch (err) {
      // This now shows the REAL error instead of a generic message
      console.error('Upload error:', err);
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const togglePublic = async (id, current) => {
    const { error } = await supabase
      .from('transformations')
      .update({ is_public: !current })
      .eq('id', id);
    if (!error) {
      setTransformations((prev) =>
        prev.map((t) => (t.id === id ? { ...t, is_public: !current } : t))
      );
    }
  };

  const deleteTransformation = async (t) => {
    await supabase.storage.from(STORAGE_BUCKET).remove([t.before_path, t.after_path]);
    await supabase.from('transformations').delete().eq('id', t.id);
    setTransformations((prev) => prev.filter((i) => i.id !== t.id));
  };

  const getUrl = (path) => supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl;

  if (checkingAuth) return <p className="text-center py-20 text-gray-500">Checking session…</p>;

  return (
    <div className="min-h-screen bg-purple-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-purple-900">Smile gallery</h1>
          <Link href="/admin" className="text-sm font-semibold text-purple-800">← Back to dashboard</Link>
        </div>

        <form onSubmit={handleUpload} className="bg-white rounded-2xl shadow-sm border border-pink-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-purple-900 mb-4">Add a before / after</h2>

          <input
            type="text"
            placeholder="Title, e.g. Teeth whitening"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 text-sm"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Before photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBeforeFile(e.target.files[0])}
                className="block text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">After photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAfterFile(e.target.files[0])}
                className="block text-sm"
                required
              />
            </div>
          </div>

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

        {transformations.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">No transformations yet — add one above.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {transformations.map((t) => (
              <div key={t.id} className="bg-white rounded-xl border border-pink-100 overflow-hidden">
                <div className="grid grid-cols-2">
                  <div className="relative">
                    <img src={getUrl(t.before_path)} alt="Before" className="w-full h-32 object-cover" />
                    <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
                      Before
                    </span>
                  </div>
                  <div className="relative">
                    <img src={getUrl(t.after_path)} alt="After" className="w-full h-32 object-cover" />
                    <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
                      After
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm text-gray-700 truncate mb-1">{t.title || 'Untitled'}</p>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => togglePublic(t.id, t.is_public)}
                      className="text-xs text-purple-700 font-semibold"
                    >
                      {t.is_public ? 'Public' : 'Hidden'}
                    </button>
                    <button onClick={() => deleteTransformation(t)} className="text-xs text-red-500">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}