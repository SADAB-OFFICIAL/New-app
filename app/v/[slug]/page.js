"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { decodeSlug, encodeData } from '@/lib/utils';

export default function MoviePage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!params?.slug) return;

    const rawSlug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
    const slugData = decodeSlug(rawSlug);

    if (slugData?.sourceUrl) {
      fetch('/api/movie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: `${slugData.sourceUrl}/${slugData.slug}/` })
      })
      .then(res => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        setError("Link Expired or Error");
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [params]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white animate-pulse">Loading Details...</div>;
  if (error || !data) return <div className="min-h-screen bg-black flex items-center justify-center text-red-500">{error || "Not Found"}</div>;

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-20">
      <button onClick={() => router.back()} className="text-gray-400 hover:text-white mb-4">← Back</button>

      <div className="flex flex-col md:flex-row gap-6 max-w-5xl mx-auto">
        <img src={data.poster} className="w-full md:w-64 rounded-xl shadow-lg border border-gray-800" />
        
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
          <div className="bg-gray-900 p-4 rounded-lg text-gray-300 text-sm mb-6">{data.plot}</div>

          <h2 className="text-xl font-bold text-red-500 mb-3">Download Links</h2>
          <div className="space-y-3">
            {data.downloadSections?.map((item, i) => (
              <button 
                key={i}
                onClick={() => {
                  // 🔥 POSTER DATA ADDED HERE
                  const key = encodeData({ 
                      link: item.link, 
                      quality: item.quality, 
                      title: data.title,
                      poster: data.poster 
                  });
                  router.push(`/vlyxdrive?key=${key}`);
                }}
                className="w-full p-4 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-600 flex items-center justify-between transition"
              >
                <div>
                  <div className="font-bold text-blue-400">{item.quality}</div>
                  <div className="text-xs text-gray-500">{item.label}</div>
                </div>
                <div className="bg-blue-600 px-3 py-1 rounded text-xs font-bold">Download</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {data.screenshots?.length > 0 && (
        <div className="max-w-5xl mx-auto mt-10">
          <h3 className="text-xl font-bold mb-4 text-yellow-500">Screenshots</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {data.screenshots.map((src, i) => <img key={i} src={src} className="rounded-lg" loading="lazy" />)}
          </div>
        </div>
      )}
    </div>
  );
    }
