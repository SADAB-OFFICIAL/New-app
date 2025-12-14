"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../components/Navbar';
import Link from 'next/link';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      setLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          setMovies(data.movies || []);
          setLoading(false);
        });
    }
  }, [query]);

  return (
    <div className="p-4 md:p-8 pt-24">
      <h1 className="text-2xl font-bold text-white mb-6">
        Results for: <span className="text-red-500">{query}</span>
      </h1>

      {loading ? (
        <div className="text-white animate-pulse">Searching...</div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map((m, i) => (
            <Link key={i} href={`/v/${m.slug}`}>
              <div className="group cursor-pointer">
                <div className="overflow-hidden rounded-lg border border-gray-800 relative aspect-[2/3]">
                  <img src={m.image} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                </div>
                <p className="mt-2 text-sm text-gray-300 truncate">{m.title}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-center mt-10">No movies found.</div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Suspense fallback={<div className="text-white pt-24 text-center">Loading Search...</div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
        }
