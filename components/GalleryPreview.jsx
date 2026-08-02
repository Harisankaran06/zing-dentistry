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
        .select('title, description, category, before_path, after_path')
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {transformations.map((t, i) => (
        <div key={i} className="rounded-2xl overflow-hidden shadow-sm bg-white border border-gray-100">
          <div className="grid grid-cols-2">
            <div>
              <img src={t.beforeUrl} alt="Before" className="w-full h-48 object-cover" />
              <div className="bg-red-400 text-white text-center text-sm font-bold tracking-wide py-2">
                BEFORE
              </div>
            </div>
            <div>
              <img src={t.afterUrl} alt="After" className="w-full h-48 object-cover" />
              <div className="bg-teal-500 text-white text-center text-sm font-bold tracking-wide py-2">
                AFTER
              </div>
            </div>
          </div>

          <div className="p-5">
            {t.category && (
              <span className="inline-block bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full mb-3">
                {t.category}
              </span>
            )}
            {t.title && <h3 className="text-lg font-bold text-gray-900 mb-1">{t.title}</h3>}
            {t.description && <p className="text-sm text-gray-500">{t.description}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
