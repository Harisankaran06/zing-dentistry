'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function GalleryPreview() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from('images')
        .select('storage_path, label')
        .eq('is_public', true)
        .limit(6);

      if (!error && data) {
        const withUrls = data.map((img) => {
          const { data: urlData } = supabase.storage
            .from('patient-images')
            .getPublicUrl(img.storage_path);
          return { ...img, url: urlData.publicUrl };
        });
        setImages(withUrls);
      }
      setLoading(false);
    };
    fetchImages();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading gallery...</p>;

  if (images.length === 0) {
    return (
      <p className="text-center text-gray-500">
        Gallery coming soon — check back for patient transformations.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {images.map((img, i) => (
        <div key={i} className="rounded-xl overflow-hidden shadow-sm">
          <img
            src={img.url}
            alt={img.label || 'Patient photo'}
            className="w-full h-40 object-cover"
          />
        </div>
      ))}
    </div>
  );
}