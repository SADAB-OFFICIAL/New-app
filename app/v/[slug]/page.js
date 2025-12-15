"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { decodeSlug, encodeData } from '@/lib/utils';
import { Download, PlayCircle, X, ChevronRight, Package, Film } from 'lucide-react';

export default function MoviePage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState('choice'); // 'choice' or 'list'
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

  // Logic to Open Download Modal
  const openDownloadMenu = () => {
    const hasBatch = data.downloadSections.some(item => item.type === 'batch');
    
    if (hasBatch) {
      setModalStep('choice'); // Show Choice (Green/Purple Buttons)
    } else {
      setViewType('episode');
      setModalStep('list'); // Show Links directly
    }
    setShowModal(true);
  };

  const getFilteredLinks = () => {
    return data?.downloadSections.filter(item => item.type === viewType) || [];
  };

  if (loading) return <div className="min-h-screen bg-[#0f1014] flex items-center justify-center text-white animate-pulse">Loading Details...</div>;
  if (!data) return <div className="min-h-screen bg-[#0f1014] flex items-center justify-center text-red-500">Not Found</div>;

  return (
    <div className="min-h-screen bg-[#0f1014] text-white pb-20 relative">
      
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{backgroundImage: `url(${data.poster})`}}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1014] via-[#0f1014]/60 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col md:flex-row gap-6 items-end">
          <img src={data.poster} className="w-32 md:w-48 rounded-lg shadow-2xl border border-white/10 hidden md:block" />
          <div className="flex-1 mb-4">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-2 text-white drop-shadow-lg">{data.title}</h1>
            <div className="flex gap-3 mt-4">
              <button 
                onClick={openDownloadMenu}
                className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition active:scale-95 shadow-lg shadow-red-600/30"
              >
                <Download className="w-5 h-5" /> Download / Watch
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Plot & Screenshots */}
      <div className="p-6 max-w-7xl mx-auto">
        <p className="text-gray-300 leading-relaxed mb-8 text-sm md:text-base bg-[#18181b] p-4 rounded-xl border border-white/5">{data.plot}</p>
        
        {data.screenshots?.length > 0 && (
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><span className="w-1 h-6 bg-yellow-500 rounded-full"></span> Screenshots</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {data.screenshots.map((src, i) => <img key={i} src={src} className="rounded-lg border border-white/5" loading="lazy" />)}
            </div>
          </div>
        )}
      </div>

      {/* --- DOWNLOAD MODAL (The Magic Part) --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-[#18181b] w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden relative">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#121215]">
              <h3 className="text-lg font-bold text-white">
                {modalStep === 'choice' ? "Select Option" : `Select ${viewType === 'batch' ? 'Pack' : 'Quality'}`}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 bg-white/10 rounded-full hover:bg-red-500/20 hover:text-red-500 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              
              {/* STEP 1: CHOICE (Single vs Bulk) */}
              {modalStep === 'choice' && (
                <div className="space-y-4">
                   {/* Single Episode Button (Green) */}
                  <button 
                    onClick={() => { setViewType('episode'); setModalStep('list'); }}
                    className="w-full p-6 rounded-2xl bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-500/30 hover:border-emerald-400 group transition-all"
                  >
                    <div className="flex flex-col items-center gap-2">
                        <PlayCircle className="w-10 h-10 text-emerald-400 group-hover:scale-110 transition" />
                        <span className="text-lg font-bold text-emerald-100">Episode-wise</span>
                        <span className="text-xs text-emerald-400/70">Download individual episodes</span>
                    </div>
                  </button>

                  {/* Bulk Download Button (Purple) */}
                  <button 
                    onClick={() => { setViewType('batch'); setModalStep('list'); }}
                    className="w-full p-6 rounded-2xl bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 hover:border-purple-400 group transition-all"
                  >
                    <div className="flex flex-col items-center gap-2">
                        <Package className="w-10 h-10 text-purple-400 group-hover:scale-110 transition" />
                        <span className="text-lg font-bold text-purple-100">Bulk Download</span>
                        <span className="text-xs text-purple-400/70">Download complete season/pack</span>
                    </div>
                  </button>
                </div>
              )}

              {/* STEP 2: LINK LIST */}
              {modalStep === 'list' && (
                <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1 scrollbar-hide">
                  {/* Back Button */}
                  {data.downloadSections.some(i => i.type === 'batch') && (
                    <button onClick={() => setModalStep('choice')} className="text-xs text-gray-500 hover:text-white mb-2 flex items-center gap-1">
                      ← Back to selection
                    </button>
                  )}

                  {getFilteredLinks().map((item, i) => (
                    <button 
                      key={i}
                      onClick={() => {
                        const key = encodeData({ 
                            link: item.link, 
                            quality: item.quality, 
                            title: data.title, 
                            poster: data.poster 
                        });
                        router.push(`/vlyxdrive?key=${key}`);
                      }}
                      className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all active:scale-95 ${
                        viewType === 'batch' 
                        ? 'bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20' 
                        : 'bg-blue-600/10 border-blue-500/30 hover:bg-blue-500/20'
                      }`}
                    >
                      <div className="text-left">
                        <div className={`font-bold ${viewType === 'batch' ? 'text-purple-300' : 'text-blue-300'}`}>
                          {item.quality}
                        </div>
                        <div className="text-[10px] text-gray-400 max-w-[200px] truncate">{item.label}</div>
                      </div>
                      <div className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                        viewType === 'batch' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
                      }`}>
                        GET LINK
                      </div>
                    </button>
                  ))}

                  {getFilteredLinks().length === 0 && (
                    <div className="text-center text-gray-500 py-4">No links available for this category.</div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
        }
