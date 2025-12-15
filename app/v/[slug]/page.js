"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { decodeSlug, encodeData } from '@/lib/utils';
import { Download, PlayCircle, Package, ArrowLeft, X } from 'lucide-react';

export default function MoviePage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // UI States (Inline Menu ke liye)
  const [menuState, setMenuState] = useState('initial'); // 'initial', 'type-select', 'quality-select'
  const [viewType, setViewType] = useState('episode'); // 'episode' or 'batch'

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
      .then(res => res.json())
      .then(result => {
        setData(result);
        setLoading(false);
      });
    }
  }, [params]);

  // --- Handlers ---
  const handleMainClick = () => {
    const hasBatch = data.downloadSections.some(item => item.type === 'batch');
    if (hasBatch) {
      setMenuState('type-select');
    } else {
      setViewType('episode');
      setMenuState('quality-select');
    }
  };

  const getFilteredLinks = () => {
    return data?.downloadSections.filter(item => item.type === viewType) || [];
  };

  const navigateToDrive = (item) => {
    const key = encodeData({ 
        link: item.link, 
        quality: item.quality, 
        title: data.title, 
        poster: data.poster,
        type: item.type // Batch/Zip detection ke liye type bhejna zaruri hai
    });
    router.push(`/vlyxdrive?key=${key}`);
  };

  if (loading) return <div className="min-h-screen bg-[#0f1014] flex items-center justify-center text-white animate-pulse">Loading...</div>;
  if (!data) return <div className="min-h-screen bg-[#0f1014] flex items-center justify-center text-red-500">Not Found</div>;

  return (
    <div className="min-h-screen bg-[#0f1014] text-white pb-20 relative">
      
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{backgroundImage: `url(${data.poster})`}}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1014] via-[#0f1014]/60 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col md:flex-row gap-6 items-end z-20">
          <img src={data.poster} className="w-32 md:w-48 rounded-lg shadow-2xl border border-white/10 hidden md:block" />
          
          <div className="flex-1 w-full max-w-lg">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-white drop-shadow-lg">{data.title}</h1>
            
            {/* --- INLINE DYNAMIC MENU AREA --- */}
            <div className="bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl transition-all duration-300">
              
              {/* STATE 1: INITIAL BUTTON */}
              {menuState === 'initial' && (
                <button 
                  onClick={handleMainClick}
                  className="w-full bg-red-600 hover:bg-red-700 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition active:scale-95 text-lg"
                >
                  <Download className="w-6 h-6" /> Download / Watch
                </button>
              )}

              {/* STATE 2: SELECT TYPE (Episode vs Batch) */}
              {menuState === 'type-select' && (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400 font-semibold">Select Format</span>
                    <button onClick={() => setMenuState('initial')}><X className="w-5 h-5 text-gray-500" /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => { setViewType('episode'); setMenuState('quality-select'); }} className="bg-emerald-900/40 border border-emerald-500/30 p-4 rounded-xl flex flex-col items-center hover:bg-emerald-900/60 transition">
                       <PlayCircle className="w-8 h-8 text-emerald-400 mb-2" />
                       <span className="font-bold text-emerald-100">Episodes</span>
                    </button>
                    <button onClick={() => { setViewType('batch'); setMenuState('quality-select'); }} className="bg-purple-900/40 border border-purple-500/30 p-4 rounded-xl flex flex-col items-center hover:bg-purple-900/60 transition">
                       <Package className="w-8 h-8 text-purple-400 mb-2" />
                       <span className="font-bold text-purple-100">Batch Zip</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STATE 3: LINK LIST */}
              {menuState === 'quality-select' && (
                <div className="animate-in fade-in slide-in-from-right-4">
                  <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
                    <button onClick={() => setMenuState(data.downloadSections.some(i => i.type === 'batch') ? 'type-select' : 'initial')}>
                        <ArrowLeft className="w-5 h-5 text-gray-400" />
                    </button>
                    <span className="font-bold text-white">Select {viewType === 'batch' ? 'Pack' : 'Quality'}</span>
                  </div>
                  
                  <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto scrollbar-hide">
                    {getFilteredLinks().map((item, i) => (
                      <button 
                        key={i}
                        onClick={() => navigateToDrive(item)}
                        className={`w-full p-3 rounded-lg border text-left flex justify-between items-center transition active:bg-white/10 ${
                            viewType === 'batch' ? 'border-purple-500/30 bg-purple-500/10' : 'border-blue-500/30 bg-blue-500/10'
                        }`}
                      >
                        <div>
                            <span className="block font-bold text-sm text-gray-200">{item.quality}</span>
                            <span className="text-[10px] text-gray-400">{item.size || 'Unknown Size'}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded ${viewType === 'batch' ? 'bg-purple-600' : 'bg-blue-600'}`}>
                            GO
                        </span>
                      </button>
                    ))}
                    {getFilteredLinks().length === 0 && <p className="text-center text-gray-500 text-sm">No links found.</p>}
                  </div>
                </div>
              )}

            </div>
            {/* --- END MENU --- */}

          </div>
        </div>
      </div>

      {/* Plot Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <p className="text-gray-300 leading-relaxed mb-8 bg-[#18181b] p-4 rounded-xl border border-white/5">{data.plot}</p>
        
        {data.screenshots?.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {data.screenshots.map((src, i) => <img key={i} src={src} className="rounded-lg border border-white/5" loading="lazy" />)}
          </div>
        )}
      </div>
    </div>
  );
}
