"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { decodeData } from '@/lib/utils';
import { Server, Download, Play, AlertCircle } from 'lucide-react';

function NCloudContent() {
  const searchParams = useSearchParams();
  const [streams, setStreams] = useState([]);
  const [activeStream, setActiveStream] = useState(null); // Jo abhi chal raha hai
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const key = searchParams.get('key');
    if (key) {
      const decoded = decodeData(key);
      setMeta(decoded);
      
      // API call to get ALL servers
      fetch(`/api/resolve?type=hub&url=${encodeURIComponent(decoded.url)}`)
        .then(res => res.json())
        .then(data => {
          if (data.streams && data.streams.length > 0) {
            setStreams(data.streams);
            setActiveStream(data.streams[0]); // Pehle wale ko default bana do
          } else {
            setError("No playable links found.");
          }
          setLoading(false);
        })
        .catch(err => {
            setError("Failed to resolve links.");
            setLoading(false);
        });
    }
  }, []);

  // 1. Loading UI
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        {meta?.poster && <img src={meta.poster} className="w-32 rounded-lg mb-6 opacity-60 shadow-lg shadow-red-900/20" />}
        <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-300 font-medium">Fetching Servers...</p>
        </div>
      </div>
    );
  }

  // 2. Error UI
  if (error || !activeStream) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-4">
        <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
        <h2 className="text-xl text-white font-bold mb-2">Oops! Link Expired</h2>
        <p className="text-gray-500 mb-6">{error || "Could not extract video links."}</p>
        <button onClick={() => window.location.reload()} className="bg-white/10 px-6 py-2 rounded-full text-white hover:bg-white/20 transition">Try Again</button>
      </div>
    );
  }

  // 3. Main Player & Server Selection UI
  return (
    <div className="min-h-screen bg-[#0f1014] text-white pb-10">
      
      {/* Video Player Section */}
      <div className="w-full bg-black sticky top-0 z-10 shadow-2xl shadow-red-900/10">
        <div className="max-w-5xl mx-auto aspect-video">
            <video 
                key={activeStream.link} // Key change hone par player reload hoga
                controls 
                autoPlay 
                className="w-full h-full"
                poster={meta?.poster}
            >
                <source src={activeStream.link} type="video/mp4" />
                <source src={activeStream.link} type="video/mkv" />
                Your browser does not support the video tag.
            </video>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-6">
        {/* Title Info */}
        <h1 className="text-xl md:text-2xl font-bold leading-tight mb-2 text-gray-100">
            {meta?.title}
        </h1>
        <p className="text-sm text-green-500 flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Streaming from: <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded">{activeStream.server}</span>
        </p>

        {/* Server Selection Grid */}
        <div className="bg-[#18181b] rounded-2xl p-5 border border-white/5">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Server className="w-4 h-4" /> Select Server
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {streams.map((stream, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveStream(stream)}
                        className={`relative flex items-center justify-between p-3 rounded-xl border transition-all duration-200 group ${
                            activeStream.link === stream.link 
                            ? 'bg-red-600/10 border-red-600/50 shadow-[0_0_15px_rgba(220,38,38,0.3)]' 
                            : 'bg-[#27272a] border-transparent hover:bg-[#3f3f46]'
                        }`}
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className={`p-2 rounded-lg ${activeStream.link === stream.link ? 'bg-red-600 text-white' : 'bg-black/40 text-gray-400'}`}>
                                <Play className="w-4 h-4 fill-current" />
                            </div>
                            <div className="text-left overflow-hidden">
                                <p className={`text-sm font-semibold truncate ${activeStream.link === stream.link ? 'text-red-500' : 'text-gray-200'}`}>
                                    {stream.server}
                                </p>
                                <p className="text-[10px] text-gray-500 truncate">High Speed</p>
                            </div>
                        </div>
                        
                        {activeStream.link === stream.link && (
                            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_#ef4444]"></div>
                        )}
                    </button>
                ))}
            </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <a 
                href={activeStream.link} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition shadow-lg active:scale-95"
            >
                <Download className="w-5 h-5" /> Download File
            </a>
            
            <button 
                onClick={() => {
                    if (navigator.share) {
                        navigator.share({
                            title: meta?.title,
                            text: `Watch ${meta?.title} on Netvlyx`,
                            url: window.location.href
                        })
                    } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Link Copied!");
                    }
                }}
                className="flex items-center gap-2 bg-[#27272a] text-white px-8 py-3 rounded-full font-bold hover:bg-[#3f3f46] transition border border-white/10"
            >
                Share Link
            </button>
        </div>

      </div>
    </div>
  );
}

export default function NCloud() {
  return (
    <Suspense fallback={<div className="bg-black h-screen w-full"></div>}>
      <NCloudContent />
    </Suspense>
  );
                  }
