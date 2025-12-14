"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch('/api/home').then(res => res.json()).then(data => setMovies(data.movies || []));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-3xl font-bold text-red-600 mb-6">NetVlyx</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {movies.map((m, i) => (
          <Link key={i} href={`/v/${m.slug}`}>
            <div className="group cursor-pointer">
              <img src={m.image} alt={m.title} className="rounded-lg hover:scale-105 transition duration-300" />
              <p className="mt-2 text-sm font-medium truncate">{m.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
