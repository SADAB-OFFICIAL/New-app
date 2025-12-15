"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { decodeData } from '@/lib/utils';
import { Server, Download, Play, AlertCircle } from 'lucide-react';

function NCloudContent() {
  const searchParams = useSearchParams();
  const [streams, setStreams] = useState([]);
  const [activeStream, setActiveStream] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const key = searchParams.get('key');
    if (key) {
      const decoded = decodeData(key);
      setMeta(decoded);
      
      // Pass 'type' (batch/episode) to API to filter correct files
      const mode = decoded.type || 'episode'; 
      const apiUrl = `/api/resolve?type=hub&url=${encodeURIComponent(decoded.url)}&mode=${mode}`;

      fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
          if (data.streams && data.streams.length > 0) {
            setStreams(data.streams);
            setActiveStream(data.streams[0]); 
          } else {
            setError("No playable links found.");
          }
          setLoading(false);
        })
        .catch(() => { setError("Failed to resolve."); setLoading(false); });
    }
  }, []);

  if (loading) return <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">Loading Servers...</div>;
  if (error) return <div className="min-h-screen bg-black flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-[#0f1014] text-white pb-10">
      
      {/* Video Player */}
      <div className="w-full bg-black sticky top-0 z-10">
        <div className="max-w-5xl mx-auto aspect-video">
            <video key={activeStream?.link} controls autoPlay className="w-full h-full" poster={meta?.poster}>
                <source src={activeStream?.link} type="video/mp4" />
                <source src={activeStream?.link} type="video/mkv" />
                Your browser does not support the video tag.
            </video>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-6">
        <h1 className="text-xl font-bold mb-2">{meta?.title}</h1>
        <div className="bg-[#18181b] rounded-2xl p-5 border border-white/5">
            <h3 className="text-sm font-bold text-gray-400 mb-4 flex gap-2"><Server className="w-4 h-4" /> Select Server</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {streams.map((stream, idx) => (
                    <button key={idx} onClick={() => setActiveStream(stream)}
                        className={`p-3 rounded-xl border flex items-center justify-between transition ${
                            activeStream?.link === stream.link ? 'bg-red-600/10 border-red-600' : 'bg-[#27272a] border-transparent'
                        }`}>
                        <span className={`text-sm font-bold ${activeStream?.link === stream.link ? 'text-red-500' : 'text-gray-300'}`}>{stream.server}</span>
                        {stream.link.includes('.zip') && <span className="text-[10px] bg-purple-600 px-2 rounded text-white">ZIP</span>}
                    </button>
                ))}
            </div>
        </div>

        <div className="mt-6 flex justify-center">
            <a href={activeStream?.link} className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full font-bold">
                <Download className="w-5 h-5" /> Download File
            </a>
        </div>
      </div>
    </div>
  );
}

export default function NCloud() {
  return <Suspense fallback={<div>Loading...</div>}><NCloudContent /></Suspense>;
    }
