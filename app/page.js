"use client";
import { useEffect, useState } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import MovieCard from './components/MovieCard';
import HeroSlider from './components/HeroSlider';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Apni khud ki API call karein
    fetch('/api/home')
      .then(res => res.json())
      .then(data => {
        setMovies(data.movies || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#0f1014] pb-24 font-sans text-white">
      <Header />

      {loading ? (
        // Loading Skeleton
        <div className="pt-20 px-4 space-y-6">
            <div className="w-full h-56 bg-gray-800 rounded-2xl animate-pulse"></div>
            <div className="grid grid-cols-3 gap-3">
                {[1,2,3,4,5,6].map(i => <div key={i} className="h-40 bg-gray-800 rounded-xl animate-pulse"></div>)}
            </div>
        </div>
      ) : (
        <>
          {/* Hero Slider (Latest 5 Movies) */}
          <HeroSlider movies={movies.slice(0, 5)} />

          {/* Latest Movies Grid */}
          <div className="px-4 mt-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-1 h-5 bg-red-500 rounded-full"></span>
                  Latest Uploads
                </h2>
            </div>
            
            {/* Horizontal Scroll hatakar Grid kar diya taaki zyada movies dikhein */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {movies.map((m, i) => <MovieCard key={i} movie={m} />)}
            </div>
          </div>
        </>
      )}

      <BottomNav />
    </div>
  );
}
