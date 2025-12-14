"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Info } from 'lucide-react';

export default function HeroSlider({ movies }) {
  const [current, setCurrent] = useState(0);

  // Top 5 movies only for slider
  const slides = movies.slice(0, 5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); // 5 seconds auto slide
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
      {/* Background Images */}
      {slides.map((movie, index) => (
        <div 
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={movie.image} alt={movie.title} className="w-full h-full object-cover object-top" />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-4 md:p-12 pb-12 z-10 flex flex-col items-start space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white max-w-2xl text-shadow leading-tight">
          {slides[current]?.title}
        </h1>
        
        <div className="flex gap-4 mt-4">
          <Link href={`/v/${slides[current]?.slug}`}>
            <button className="bg-white text-black px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-200 transition">
              <Play className="fill-black w-5 h-5" /> Play Now
            </button>
          </Link>
          <button className="bg-gray-600/70 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-600/90 backdrop-blur-sm transition">
            <Info className="w-5 h-5" /> More Info
          </button>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 right-4 flex gap-2 z-20">
        {slides.map((_, i) => (
          <div 
            key={i} 
            className={`h-2 w-2 rounded-full transition-all ${i === current ? 'bg-red-600 w-6' : 'bg-gray-400'}`} 
          />
        ))}
      </div>
    </div>
  );
}
