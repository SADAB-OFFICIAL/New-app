"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation'; // useParams import kiya
import { decodeSlug, encodeData } from '@/lib/utils'; // Path alias fixed

export default function MoviePage() {
  const params = useParams(); // Hook se params nikale
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Slug milne ka wait karein
    if (!params?.slug) return;

    // Slug array ho sakta hai ya string, use handle karein
    const rawSlug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
    const slugData = decodeSlug(rawSlug);

    if (slugData?.sourceUrl) {
      // API call
      fetch('/api/movie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: `${slugData.sourceUrl}/${slugData.slug}/` })
      })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch movie data");
        return res.json();
      })
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Movie not found or Link Expired");
        setLoading(false);
      });
    } else {
      setError("Invalid Movie Link");
      setLoading(false);
    }
  }, [params]);

  // Loading State
  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
      <p className="text-gray-400 animate-pulse">Loading Details...</p>
    </div>
  );

  // Error State
  if (error) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-red-500 font-bold">
      {error}
    </div>
  );

  // Main UI
  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <button 
        onClick={() => router.back()} 
        className="mb-6 px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 transition"
      >
        ← Back
      </button>

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        <div className="w-full md:w-1/3 flex-shrink-0">
           <img 
             src={data.poster} 
             alt={data.title} 
             className="w-full rounded-xl shadow-2xl border border-gray-800" 
           />
        </div>
        
        <div className="w-full md:w-2/3">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            {data.title}
          </h1>
          
          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 mb-8">
            <h3 className="text-xl font-semibold mb-2 text-red-500">Plot</h3>
            <p className="text-gray-300 leading-relaxed">{data.plot}</p>
          </div>

          {/* Download Buttons Area */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold border-l-4 border-red-600 pl-4">Download Links</h2>
            <div className="grid gap-3">
              {data.downloadSections?.length > 0 ? (
                data.downloadSections.map((item, i) => (
                  <button 
                    key={i}
                    onClick={() => {
                      const key = encodeData({ link: item.link, quality: item.quality, title: data.title });
                      router.push(`/vlyxdrive?key=${key}`);
                    }}
                    className="group relative w-full p-4 bg-gray-800 hover:bg-blue-900/30 border border-gray-700 hover:border-blue-500 rounded-xl transition-all duration-300 text-left flex items-center justify-between"
                  >
                    <div>
                      <span className="block font-bold text-white group-hover:text-blue-400 transition">
                        Download {item.quality}
                      </span>
                      <span className="text-xs text-gray-500">{item.label}</span>
                    </div>
                    <div className="bg-blue-600 px-3 py-1 rounded text-xs font-bold text-white shadow-lg shadow-blue-500/20">
                      ⚡ GET LINK
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 bg-gray-800 rounded text-yellow-500">
                  Links loading or unavailable directly. Try reloading.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Screenshots */}
      {data.screenshots?.length > 0 && (
        <div className="max-w-6xl mx-auto mt-16">
          <h2 className="text-2xl font-bold mb-6 border-l-4 border-yellow-500 pl-4">Screenshots</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.screenshots.map((src, i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-gray-800 group">
                <img 
                  src={src} 
                  loading="lazy"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500" 
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
