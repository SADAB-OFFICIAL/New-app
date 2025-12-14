"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { decodeData, encodeData } from '@/lib/utils'; // Agar error aaye to '../../lib/utils' kar dena

function VlyxDriveContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [links, setLinks] = useState([]);
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    const key = searchParams.get('key');
    if (key) {
      const decoded = decodeData(key);
      setMeta(decoded);
      // Backend call to resolve m4ulinks
      fetch(`/api/resolve?type=m4u&url=${encodeURIComponent(decoded.link)}`)
        .then(res => res.json())
        .then(data => setLinks(data.links || []));
    }
  }, []);

  return (
    <div className="w-full max-w-md flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-2">Select Server</h1>
      <p className="text-gray-400 mb-6">{meta?.title} - {meta?.quality}</p>

      <div className="space-y-4 w-full">
        {links.map((link, i) => (
          <button
            key={i}
            onClick={() => {
              if(link.server.includes('Hub-Cloud') || link.server.includes('V-Cloud')) {
                // Encode final key for N-Cloud
                const nKey = encodeData({ url: link.url, server: link.server });
                router.push(`/ncloud?key=${nKey}`);
              } else {
                window.open(link.url, '_blank');
              }
            }}
            className="w-full p-4 bg-gray-800 hover:bg-gray-700 rounded-xl border border-gray-600 flex items-center justify-between"
          >
            <span className="font-bold text-yellow-400">🚀 {link.server}</span>
            <span>👉</span>
          </button>
        ))}
        {links.length === 0 && <p>Scanning links...</p>}
      </div>
    </div>
  );
}

export default function VlyxDrive() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <Suspense fallback={<div className="text-white">Loading Drive...</div>}>
        <VlyxDriveContent />
      </Suspense>
    </div>
  );
}
