import Link from 'next/link';
import { PlayCircle } from 'lucide-react';

export default function MovieCard({ movie }) {
  return (
    <Link href={`/v/${movie.slug}`} className="block group relative">
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-gray-800 shadow-lg border border-white/5">
        <img 
          src={movie.image} 
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        
        {/* Quality Badge */}
        <div className="absolute top-2 right-2 bg-red-600 px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-md">
            {movie.quality}
        </div>

        {/* Play Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
            <PlayCircle className="w-10 h-10 text-white/90" fill="black" />
        </div>
      </div>

      <div className="mt-2">
        <h3 className="text-white text-sm font-medium truncate">{movie.title}</h3>
        <p className="text-[11px] text-gray-500">{movie.year}</p>
      </div>
    </Link>
  );
}
