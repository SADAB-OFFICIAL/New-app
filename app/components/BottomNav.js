import { Home, Compass, Tv, Zap, User } from 'lucide-react';

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0f1014]/95 backdrop-blur-xl border-t border-white/5 pb-safe z-50">
      <div className="flex justify-around items-center h-16 px-2">
        <NavItem icon={<Home size={22} fill="currentColor" />} label="Home" active />
        <NavItem icon={<Compass size={22} />} label="Explore" />
        <NavItem icon={<Tv size={22} />} label="Series" />
        <NavItem icon={<Zap size={22} />} label="Live" />
        <NavItem icon={<User size={22} />} label="Profile" />
      </div>
    </div>
  );
}

function NavItem({ icon, label, active }) {
  return (
    <div className={`flex flex-col items-center gap-1 cursor-pointer transition-all duration-300 ${active ? 'text-red-500' : 'text-gray-500 hover:text-gray-300'}`}>
      <div className={`p-1.5 rounded-xl ${active ? 'bg-red-500/10' : ''}`}>
        {icon}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </div>
  );
  }
