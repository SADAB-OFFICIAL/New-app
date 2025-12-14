"use client";
import Link from 'next/link';

export default function MovieRow({ title, movies }) {
  if(!movies || movies.length === 0) return null;

  return (
    <div className="py-6 px-4 md:px-8">
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 border-l-4 border-red-600 pl-3">
        {title}
      </h2>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
        {movies.map((movie, i) => (
          <Link key={i} href={`/v/${movie.slug}`} className="flex-shrink-0 w-36 md:w-48 group cursor-pointer relative">
            <div className="aspect-[2/3] overflow-hidden rounded-lg border border-gray-800 relative">
              <img 
                src={movie.image} 
                alt={movie.title} 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
              />
              {/* Hover Play Icon */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-red-600 rounded-full p-3 shadow-lg transform scale-0 group-hover:scale-100 transition-transform">
                    <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
            </div>
            <h3 className="text-gray-300 text-sm mt-2 font-medium truncate group-hover:text-white transition">
              {movie.title}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
