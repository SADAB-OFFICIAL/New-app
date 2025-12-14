"use client";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { decodeData } from '@/lib/utils';

export default function NCloud() {
  const searchParams = useSearchParams();
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const key = searchParams.get('key');
    if (key) {
      const decoded = decodeData(key);
      // Resolve HubCloud to get final mp4 link
      fetch(`/api/resolve?type=hub&url=${encodeURIComponent(decoded.url)}`)
        .then(res => res.json())
        .then(data => {
          setVideoUrl(data.streamUrl);
          setLoading(false);
        });
    }
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      {loading ? (
        <div className="animate-pulse text-white text-xl">Bypassing Cloud Protection...</div>
      ) : videoUrl ? (
        <div className="w-full max-w-4xl">
          {/* Simple Video Player */}
          <video controls autoPlay className="w-full rounded-lg shadow-2xl border border-gray-800">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="mt-4 text-center">
            <a href={videoUrl} className="bg-green-600 text-white px-6 py-2 rounded-full font-bold">
              Direct Download File
            </a>
          </div>
        </div>
      ) : (
        <div className="text-red-500">Failed to resolve video. Try again.</div>
      )}
    </div>
  );
}
