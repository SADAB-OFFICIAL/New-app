import { Home, Music, Tv, Radio, User } from 'lucide-react';

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0f1014]/95 backdrop-blur-lg border-t border-white/5 px-6 py-3 pb-5 z-50">
      <div className="flex justify-between items-center">
        <div className="flex flex-col items-center gap-1 text-white">
          <div className="bg-[#1e1e24] p-2 rounded-xl">
             <Home className="w-5 h-5 text-white" fill="currentColor" />
          </div>
          <span className="text-[10px] font-medium">Home</span>
        </div>
        
        <div className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition">
          <Music className="w-5 h-5" />
          <span className="text-[10px]">Music</span>
        </div>

        <div className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition">
          <Tv className="w-5 h-5" />
          <span className="text-[10px]">Anime</span>
        </div>

        <div className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition">
          <Radio className="w-5 h-5" />
          <span className="text-[10px]">Live</span>
        </div>

        <div className="flex flex-col items-center gap-1 text-gray-500 hover:text-white transition">
          <User className="w-5 h-5" />
          <span className="text-[10px]">Me</span>
        </div>
      </div>
    </div>
  );
    }
