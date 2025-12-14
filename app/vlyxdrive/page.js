"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { decodeData, encodeData } from '@/lib/utils';

function VlyxDriveContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [links, setLinks] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const key = searchParams.get('key');
    if (key) {
      const decoded = decodeData(key);
      setMeta(decoded);
      
      fetch(`/api/resolve?type=m4u&url=${encodeURIComponent(decoded.link)}`)
        .then(res => res.json())
        .then(data => {
          setLinks(data.links || []);
          setLoading(false);
        });
    }
  }, []);

  return (
    <div className="w-full max-w-md flex flex-col items-center">
      {/* Poster Display */}
      {meta?.poster && <img src={meta.poster} className="w-32 rounded-lg shadow-lg mb-4" />}
      
      <h1 className="text-2xl font-bold mb-2 text-center">Select Server</h1>
      <p className="text-gray-400 mb-6 text-center text-sm">{meta?.title}<br/><span className="text-blue-400">{meta?.quality}</span></p>

      <div className="space-y-3 w-full">
        {loading && <div className="text-center animate-pulse text-yellow-500">Scanning Cloud Servers...</div>}
        
        {links.map((link, i) => (
          <button
            key={i}
            onClick={() => {
              if(link.server.includes('Hub-Cloud') || link.server.includes('V-Cloud') || link.server.includes('GDFlix')) {
                
                // 🔥 N-CLOUD KEY GENERATION (As per Real Vlyx)
                const nKey = encodeData({ 
                    id: "", 
                    title: meta?.title || "Movie",
                    poster: meta?.poster || "",
                    url: link.url 
                });
                
                router.push(`/ncloud?key=${nKey}`);
              } else {
                window.open(link.url, '_blank');
              }
            }}
            className="w-full p-4 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-600 flex items-center justify-between transform hover:scale-105 transition"
          >
            <span className="font-bold text-yellow-400">{link.server}</span>
            <span>👉</span>
          </button>
        ))}
        {!loading && links.length === 0 && <div className="text-red-500 text-center">No compatible servers found.</div>}
      </div>
    </div>
  );
}

export default function VlyxDrive() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <Suspense fallback={<div className="text-white">Loading...</div>}>
        <VlyxDriveContent />
      </Suspense>
    </div>
  );
    }
