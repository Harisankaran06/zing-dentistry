'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function GalleryPreview() {
  const [transformations, setTransformations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransformations = async () => {
      const { data, error } = await supabase
        .from('transformations')
        .select('title, before_path, after_path')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (!error && data) {
        const withUrls = data.map((t) => ({
          ...t,
          beforeUrl: supabase.storage.from('patient-images').getPublicUrl(t.before_path).data.publicUrl,
          afterUrl: supabase.storage.from('patient-images').getPublicUrl(t.after_path).data.publicUrl,
        }));
        setTransformations(withUrls);
      }
      setLoading(false);
    };
    fetchTransformations();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading gallery...</p>;

  if (transformations.length === 0) {
    return (
      <p className="text-center text-gray-500">
        Gallery coming soon — check back for patient transformations.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {transformations.map((t, i) => (
        <div key={i} className="rounded-xl overflow-hidden shadow-sm bg-white">
          <div className="grid grid-cols-2">
            <div className="relative">
              <img src={t.beforeUrl} alt="Before" className="w-full h-40 object-cover" />
              <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                Before
              </span>
            </div>
            <div className="relative">
              <img src={t.afterUrl} alt="After" className="w-full h-40 object-cover" />
              <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                After
              </span>
            </div>
          </div>
          {t.title && <p className="text-center text-sm text-gray-700 py-2 px-2">{t.title}</p>}
        </div>
      ))}
    </div>
  );
}