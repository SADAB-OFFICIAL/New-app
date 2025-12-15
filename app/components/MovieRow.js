import Link from 'next/link';
import { Star } from 'lucide-react';

export default function MovieRow({ title, movies }) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-end px-4 mb-4">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <span className="text-xs text-gray-500 font-medium cursor-pointer">See All</span>
      </div>
      
      <div className="flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide">
        {movies.map((movie) => (
          <Link 
            key={movie.id} 
            href={`/search?q=${encodeURIComponent(movie.title)}`} // Temporary logic to link to scraper
            className="flex-shrink-0 w-[140px] group"
          >
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2 shadow-lg shadow-black/50">
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                loading="lazy"
              />
              
              {/* Rating Badge */}
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded-md flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-[10px] font-bold text-white">
                  {movie.vote_average?.toFixed(1)}
                </span>
              </div>
            </div>
            
            <h3 className="text-white text-sm font-semibold truncate px-1">
              {movie.title}
            </h3>
            <p className="text-gray-500 text-xs px-1">
              {movie.release_date?.split('-')[0] || 'N/A'}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
