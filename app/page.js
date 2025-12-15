"use client";
import { useEffect, useState } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import MovieCard from './components/MovieCard';
import { Play } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/home')
      .then(res => res.json())
      .then(data => {
        setMovies(data.movies || []);
        setLoading(false);
      });
  }, []);

  // Featured Movie (First in the list)
  const featured = movies[0];

  return (
    <div className="min-h-screen bg-[#0f1014] pb-24 font-sans text-white">
      <Header />

      {loading ? (
        // Skeleton Loader
        <div className="pt-20 px-4 space-y-6">
            <div className="w-full h-48 bg-gray-800 rounded-2xl animate-pulse"></div>
            <div className="flex gap-4 overflow-hidden">
                {[1,2,3].map(i => <div key={i} className="w-36 h-56 bg-gray-800 rounded-xl animate-pulse shrink-0"></div>)}
            </div>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          {featured && (
            <div className="relative w-full h-[55vh] md:h-[70vh]">
              <div className="absolute inset-0">
                <img src={featured.image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1014] via-[#0f1014]/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f1014]/80 to-transparent"></div>
              </div>
              
              <div className="absolute bottom-0 left-0 p-6 w-full md:w-2/3 z-10">
                <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider mb-3 inline-block">
                    Trending #1
                </span>
                <h1 className="text-3xl md:text-5xl font-extrabold mb-3 leading-tight text-white drop-shadow-lg">
                  {featured.title}
                </h1>
                <p className="text-gray-300 text-sm md:text-base line-clamp-2 mb-5 max-w-lg">
                  Latest blockbuster available now. Watch in HD with multiple audio support.
                </p>
                <div className="flex gap-3">
                  <Link href={`/v/${featured.slug}`} className="flex-1 md:flex-none">
                    <button className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-red-600/30">
                      <Play className="w-5 h-5 fill-current" /> Watch Now
                    </button>
                  </Link>
                  <button className="px-6 py-3 rounded-xl font-bold bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition">
                    + My List
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Rows */}
          <div className="space-y-8 pl-5 mt-4">
            
            {/* Latest Uploads */}
            <section>
              <div className="flex justify-between items-center pr-5 mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-1 h-5 bg-red-500 rounded-full"></span>
                  Latest Uploads
                </h2>
                <span className="text-xs text-gray-500">View All</span>
              </div>
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 pr-5">
                {movies.map((m, i) => <MovieCard key={i} movie={m} />)}
              </div>
            </section>

            {/* Trending (Reversed for variety) */}
            <section>
              <div className="flex justify-between items-center pr-5 mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-1 h-5 bg-yellow-500 rounded-full"></span>
                  Trending Now
                </h2>
              </div>
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 pr-5">
                {[...movies].reverse().map((m, i) => <MovieCard key={i} movie={m} />)}
              </div>
            </section>

          </div>
        </>
      )}

      <BottomNav />
    </div>
  );
    }
