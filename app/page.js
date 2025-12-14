"use client";
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import MovieRow from './components/MovieRow';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Page 1 Data
    fetch('/api/home')
      .then(res => res.json())
      .then(data => {
        setMovies(data.movies || []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Navbar />
        <div className="h-[60vh] bg-zinc-900 animate-pulse w-full"></div>
        <div className="p-8 space-y-4">
            <div className="h-8 bg-zinc-800 w-48 rounded"></div>
            <div className="flex gap-4">
                {[1,2,3,4,5].map(i => <div key={i} className="h-64 w-40 bg-zinc-900 rounded-xl animate-pulse"></div>)}
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {/* Slider Section */}
      <HeroSlider movies={movies} />

      {/* Content Sections */}
      <div className="-mt-16 relative z-20 space-y-2">
        <MovieRow title="Latest Uploads" movies={movies} />
        
        {/* Fake Logic: Just reversing/slicing array to show different 'Sections' */}
        <MovieRow title="Trending Now" movies={[...movies].reverse()} />
        <MovieRow title="Recommended For You" movies={movies.slice(5, 15)} />
      </div>

      <footer className="py-10 text-center text-zinc-600 text-sm border-t border-zinc-900 mt-10">
        <p>Designed by Netvlyx Team © 2025</p>
      </footer>
    </div>
  );
}
