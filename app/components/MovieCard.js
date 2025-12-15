import Link from 'next/link';
import { Star, PlayCircle } from 'lucide-react';

export default function MovieCard({ movie }) {
  return (
    <Link href={`/v/${movie.slug}`} className="block flex-shrink-0 w-[150px] group">
      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-gray-800 shadow-xl shadow-black/40 border border-white/5">
        <img 
          src={movie.image} 
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>

        {/* Rating Badge */}
        {movie.rating && (
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 border border-white/10">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-[10px] font-bold text-white">{movie.rating}</span>
          </div>
        )}

        {/* Play Icon on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <PlayCircle className="w-12 h-12 text-white/90 drop-shadow-lg" fill="black" />
        </div>
      </div>

      <div className="mt-2.5 px-1">
        <h3 className="text-white text-sm font-semibold truncate leading-tight">{movie.title}</h3>
        <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] text-gray-500">{movie.year}</span>
            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300 border border-white/5">HD</span>
        </div>
      </div>
    </Link>
  );
          }
