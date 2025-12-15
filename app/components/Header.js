import { Search, Bell } from 'lucide-react';

export default function Header() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#0f1014]/95 backdrop-blur-md px-4 py-3 border-b border-white/5">
      <div className="flex items-center justify-between">
        {/* Logo Area */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/20">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white ml-0.5"><path d="M8 5v14l11-7z"/></svg>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">HZ<span className="text-red-500">Flix</span></span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 mx-4 max-w-md hidden md:flex items-center bg-[#1c1c22] rounded-full px-4 py-2 border border-white/10">
          <Search className="w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search movies, anime..." className="bg-transparent border-none outline-none text-sm text-white ml-3 w-full placeholder-gray-500" />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <Search className="w-6 h-6 text-white md:hidden" />
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-300" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-[#0f1014]"></span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white">
            U
          </div>
        </div>
      </div>
    </div>
  );
}
