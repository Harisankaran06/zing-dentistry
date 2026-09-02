'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import BeforeAfterSlider from './BeforeAfterSlider';

const DEFAULT_SAMPLE_TRANSFORMATIONS = [
  {
    title: 'Laser Teeth Whitening',
    category: 'Cosmetic',
    description: 'Brightened by 7 shades in a single 45-minute in-office treatment session.',
    beforeUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80',
    afterUrl: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Porcelain Veneers Makeover',
    category: 'Smile Redesign',
    description: 'Custom porcelain veneers correcting chips, gaps, and minor alignment issues.',
    beforeUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    afterUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  },
];

export default function GalleryPreview() {
  const [transformations, setTransformations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransformations = async () => {
      try {
        const { data, error } = await supabase
          .from('transformations')
          .select('title, description, category, before_path, after_path')
          .eq('is_public', true)
          .order('created_at', { ascending: false })
          .limit(6);

        if (!error && data && data.length > 0) {
          const withUrls = data.map((t) => ({
            ...t,
            beforeUrl: supabase.storage.from('patient-images').getPublicUrl(t.before_path).data.publicUrl,
            afterUrl: supabase.storage.from('patient-images').getPublicUrl(t.after_path).data.publicUrl,
          }));
          setTransformations(withUrls);
        } else {
          setTransformations(DEFAULT_SAMPLE_TRANSFORMATIONS);
        }
      } catch (err) {
        setTransformations(DEFAULT_SAMPLE_TRANSFORMATIONS);
      } finally {
        setLoading(false);
      }
    };
    fetchTransformations();
  }, []);

  if (loading) {
    return (
      <div className="py-12 text-center text-gray-400">
        <p className="text-sm">Loading smile transformations...</p>
      </div>
    );
  }

  const itemsToDisplay = transformations.length > 0 ? transformations : DEFAULT_SAMPLE_TRANSFORMATIONS;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {itemsToDisplay.map((item, idx) => (
          <BeforeAfterSlider
            key={idx}
            beforeImage={item.beforeUrl}
            afterImage={item.afterUrl}
            title={item.title || 'Smile Transformation'}
            category={item.category || 'Cosmetic Care'}
            description={item.description || 'Gentle treatment with high precision aesthetics.'}
          />
        ))}
      </div>
      <p className="text-center text-xs text-gray-500 pt-2">
        💡 Drag the slider handle left or right to compare Before & After results
      </p>
    </div>
  );
}
