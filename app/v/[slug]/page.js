"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { decodeSlug, encodeData } from '@/lib/utils';
import { Download, PlayCircle, Package, ArrowLeft, X, Film } from 'lucide-react';

export default function MoviePage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // UI States
  const [menuState, setMenuState] = useState('initial'); // 'initial', 'quality-select'
  const [viewType, setViewType] = useState('episode'); 

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

  // Main Button Logic
  const handleMainClick = () => {
    // Check agar series hai (Batch links available)
    const hasBatch = data.downloadSections.some(item => item.type === 'batch');
    
    if (hasBatch) {
      // Agar series hai, to pehle pucho (Episode ya Zip?) - Jaise Pic 1/2 me tha
      setViewType('batch'); // Default to batch view first
      setMenuState('quality-select');
    } else {
      // Agar movie hai, to direct quality list dikhao
      setViewType('episode');
      setMenuState('quality-select');
    }
  };

  const getFilteredLinks = () => {
    // Agar Episode mode hai, to batch hata do. Agar Batch mode hai, to sirf batch dikhao.
    if(viewType === 'batch') {
        // Show BOTH Batch and Episodes sorted nicely
        return data?.downloadSections || [];
    }
    return data?.downloadSections.filter(item => item.type === 'episode') || [];
  };

  const navigateToDrive = (item) => {
    const key = encodeData({ 
        link: item.link, 
        quality: item.quality, 
        title: data.title, 
        poster: data.poster,
        type: item.type 
    });
    router.push(`/vlyxdrive?key=${key}`);
  };

  if (loading) return <div className="min-h-screen bg-[#0f1014] flex items-center justify-center text-white animate-pulse">Loading Details...</div>;
  if (!data) return <div className="min-h-screen bg-[#0f1014] flex items-center justify-center text-red-500">Not Found</div>;

  return (
    <div className="min-h-screen bg-[#0f1014] text-white pb-20 relative font-sans">
      
      {/* Hero Background */}
      <div className="relative h-[60vh] w-full">
        <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{backgroundImage: `url(${data.poster})`}}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1014] via-[#0f1014]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f1014] via-transparent to-transparent"></div>
        
        {/* Poster & Title Area */}
        <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col md:flex-row gap-6 items-end z-20">
          <img src={data.poster} className="w-32 md:w-48 rounded-xl shadow-2xl border border-white/10 hidden md:block" />
          
          <div className="flex-1 w-full max-w-lg">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-white drop-shadow-xl leading-tight">{data.title}</h1>
            
            {/* --- INLINE DYNAMIC MENU --- */}
            <div className="bg-[#1c1c22]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl transition-all duration-300">
              
              {/* STATE 1: INITIAL BUTTON */}
              {menuState === 'initial' && (
                <button 
                  onClick={handleMainClick}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition active:scale-95 text-lg shadow-lg shadow-red-900/20"
                >
                  <PlayCircle className="w-6 h-6 fill-current" /> Download / Watch
                </button>
              )}

              {/* STATE 2: QUALITY LIST */}
              {menuState === 'quality-select' && (
                <div className="animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                    <span className="font-bold text-gray-200 text-sm">Select Quality</span>
                    <button onClick={() => setMenuState('initial')} className="p-1 hover:bg-white/10 rounded-full"><X className="w-4 h-4" /></button>
                  </div>
                  
                  <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto scrollbar-hide">
                    {data.downloadSections.map((item, i) => (
                      <button 
                        key={i}
                        onClick={() => navigateToDrive(item)}
                        className={`w-full p-3.5 rounded-xl border text-left flex justify-between items-center transition-all active:scale-95 group ${
                            item.type === 'batch' 
                            ? 'bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20' 
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                            {item.type === 'batch' ? <Package className="w-5 h-5 text-purple-400" /> : <Film className="w-5 h-5 text-blue-400" />}
                            <div>
                                <span className={`block font-bold text-sm ${item.type === 'batch' ? 'text-purple-200' : 'text-gray-200'}`}>
                                    {item.label} 
                                </span>
                            </div>
                        </div>
                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                            item.type === 'batch' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
                        }`}>
                            OPEN
                        </span>
                      </button>
                    ))}
                    
                    {data.downloadSections.length === 0 && <p className="text-center text-gray-500 text-sm py-2">No links found.</p>}
                  </div>
                </div>
              )}

            </div>
            {/* --- END MENU --- */}

          </div>
        </div>
      </div>

      {/* Description */}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-[#1c1c22] p-5 rounded-2xl border border-white/5">
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Storyline</h3>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base">{data.plot}</p>
        </div>
      </div>

    </div>
  );
                }
