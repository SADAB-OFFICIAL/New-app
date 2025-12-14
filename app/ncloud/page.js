"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { decodeData } from '@/lib/utils';

function NCloudContent() {
  const searchParams = useSearchParams();
  const [videoUrl, setVideoUrl] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const key = searchParams.get('key');
    if (key) {
      const decoded = decodeData(key);
      setMeta(decoded);
      
      // Resolve HubCloud
      fetch(`/api/resolve?type=hub&url=${encodeURIComponent(decoded.url)}`)
        .then(res => res.json())
        .then(data => {
          setVideoUrl(data.streamUrl);
          setLoading(false);
        });
    }
  }, []);

  return (
    <div className="w-full max-w-4xl flex flex-col items-center">
      {/* Show Poster while loading */}
      {loading && meta?.poster && (
        <div className="mb-6 relative">
            <img src={meta.poster} className="w-48 rounded-xl opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-white"></div>
            </div>
        </div>
      )}

      {loading && <div className="text-xl font-bold animate-pulse text-blue-400">Bypassing Cloud Protection...</div>}

      {!loading && videoUrl && (
        <div className="w-full">
          <h2 className="text-xl font-bold mb-4 text-center text-green-400">Ready to Play</h2>
          <video controls autoPlay className="w-full rounded-lg shadow-2xl border border-gray-800 bg-black">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          <div className="mt-6 flex justify-center gap-4">
            <a href={videoUrl} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold transition">
              Download File
            </a>
          </div>
        </div>
      )}

      {!loading && !videoUrl && <div className="text-red-500 font-bold">Failed to resolve video. Link might be dead.</div>}
    </div>
  );
}

export default function NCloud() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <Suspense fallback={<div>Loading Player...</div>}>
        <NCloudContent />
      </Suspense>
    </div>
  );
        }
