import { getTrending, getUpcoming, getBollywood, getSouth } from '@/lib/tmdb';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import MovieRow from './components/MovieRow';

export const revalidate = 3600; // Cache data for 1 hour

export default async function Home() {
  // Fetch Data Server Side
  const [trending, upcoming, bollywood, south] = await Promise.all([
    getTrending(),
    getUpcoming(),
    getBollywood(),
    getSouth()
  ]);

  return (
    <main className="min-h-screen bg-[#0f1014]">
      {/* Top Header */}
      <Header />

      {/* Content Area */}
      <div className="pt-20 pb-24">
        
        {/* Featured / Trending */}
        <MovieRow title="Trending Today" movies={trending} />

        {/* Upcoming */}
        <MovieRow title="Upcoming Movies" movies={upcoming} />

        {/* Bollywood Special */}
        <MovieRow title="Popular in Bollywood" movies={bollywood} />

        {/* South Indian */}
        <MovieRow title="South Indian Hits" movies={south} />

      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </main>
  );
}
