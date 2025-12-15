"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play } from 'lucide-react';

export default function HeroSlider({ movies }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [movies.length]);

  if (!movies || movies.length === 0) return null;

  return (
    <div className="relative w-full h-[55vh] md:h-[70vh] overflow-hidden">
      {movies.map((movie, index) => (
        <div 
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Background Image with Blur for better text visibility */}
          <div className="absolute inset-0 bg-cover bg-center blur-sm scale-110" style={{ backgroundImage: `url(${movie.image})` }}></div>
          
          {/* Main Clear Image */}
          <img src={movie.image} alt={movie.title} className="absolute inset-0 w-full h-full object-contain md:object-cover z-0" />
          
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1014] via-[#0f1014]/50 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f1014] via-transparent to-transparent z-10"></div>
        </div>
      ))}

      {/* Content */}
      <div className="absolute bottom-0 left-0 p-6 w-full z-20">
        <div className="flex items-center gap-2 mb-2">
            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded border border-white/10">
                {movies[current]?.quality}
            </span>
            <span className="text-red-500 text-xs font-bold tracking-wider">LATEST</span>
        </div>
        
        <h1 className="text-2xl md:text-5xl font-extrabold mb-4 text-white drop-shadow-md line-clamp-2">
          {movies[current]?.title}
        </h1>
        
        <div className="flex gap-3">
          <Link href={`/v/${movies[current]?.slug}`} className="flex-1 md:flex-none">
            <button className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 active:scale-95 transition-transform">
              <Play className="w-4 h-4 fill-current" /> Watch Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
          }
