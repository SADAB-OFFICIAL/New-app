"use client";
import { useEffect, useState } from 'react';
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

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-3xl font-bold text-red-600 mb-6">NetVlyx</h1>
      
      {loading ? (
        <div className="text-center text-gray-500 animate-pulse">Loading Movies...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {movies.map((m, i) => (
            <Link key={i} href={`/v/${m.slug}`}>
              <div className="group cursor-pointer">
                <div className="overflow-hidden rounded-lg">
                  <img src={m.image} alt={m.title} className="w-full h-auto transform group-hover:scale-110 transition duration-300" />
                </div>
                <p className="mt-2 text-sm font-medium truncate group-hover:text-red-500 transition">{m.title}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
  }
