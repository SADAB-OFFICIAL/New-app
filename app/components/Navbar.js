"use client";
import { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if(query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed w-full z-50 bg-gradient-to-b from-black/90 to-transparent transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400 cursor-pointer">
            NETVLYX
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center bg-black/40 border border-gray-700 rounded-full px-4 py-1 backdrop-blur-md">
            <Search className="w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search movies..." 
              className="bg-transparent border-none focus:ring-0 text-white px-3 py-1 text-sm w-64 outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
              {isOpen ? <X /> : <Search />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isOpen && (
        <div className="md:hidden bg-black/95 absolute top-16 left-0 w-full p-4 border-b border-gray-800 animate-in slide-in-from-top-5">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Search..." 
              className="flex-1 bg-gray-900 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-red-600"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold">GO</button>
          </form>
        </div>
      )}
    </nav>
  );
                }
