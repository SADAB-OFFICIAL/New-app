"use client";
import { useEffect, useState } from 'react';
import { decodeSlug, encodeData } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function MoviePage({ params }) {
  const [data, setData] = useState(null);
  const router = useRouter();
  const slugData = decodeSlug(decodeURIComponent(params.slug[0] || params.slug));

  useEffect(() => {
    if (slugData?.sourceUrl) {
      fetch('/api/movie', {
        method: 'POST',
        body: JSON.stringify({ url: `${slugData.sourceUrl}/${slugData.slug}/` })
      }).then(res => res.json()).then(setData);
    }
  }, []);

  if (!data) return <div className="bg-black min-h-screen text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row gap-6">
        <img src={data.poster} className="w-48 rounded-lg mx-auto md:mx-0" />
        <div>
          <h1 className="text-4xl font-bold mb-4">{data.title}</h1>
          <p className="text-gray-400">{data.plot}</p>
        </div>
      </div>

      {/* Screenshots */}
      <h2 className="text-2xl font-bold mt-8 mb-4">Screenshots</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {data.screenshots?.map((src, i) => (
          <img key={i} src={src} className="rounded-lg" />
        ))}
      </div>

      {/* Download Buttons */}
      <h2 className="text-2xl font-bold mt-8 mb-4">Download Links</h2>
      <div className="flex flex-col gap-3 max-w-md">
        {data.downloadSections?.map((item, i) => (
          <button 
            key={i}
            onClick={() => {
              // Encode data for VlyxDrive
              const key = encodeData({ link: item.link, quality: item.quality, title: data.title });
              router.push(`/vlyxdrive?key=${key}`);
            }}
            className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg flex justify-between font-bold"
          >
            <span>Download {item.quality}</span>
            <span>⚡ Fast</span>
          </button>
        ))}
      </div>
    </div>
  );
}
