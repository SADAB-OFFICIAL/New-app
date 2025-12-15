import { Search } from 'lucide-react';

export default function Header() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-[#0f1014]/90 backdrop-blur-md flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-600/40">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white"><path d="M8 5v14l11-7z"/></svg>
        </div>
        <h1 className="text-xl font-bold text-white tracking-wide">HZ Flix</h1>
      </div>

      <div className="flex items-center bg-[#1e1e24] rounded-full px-4 py-2 w-48 border border-white/5">
        <Search className="w-4 h-4 text-gray-400 mr-2" />
        <input 
          type="text" 
          placeholder="Search Movie" 
          className="bg-transparent border-none outline-none text-sm text-gray-200 w-full placeholder-gray-500"
        />
      </div>
    </div>
  );
}
