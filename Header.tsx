import React from 'react';
import { Bell, Menu } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onMenuClick }) => {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4 md:hidden">
        <button onClick={onMenuClick} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-bold text-lg text-slate-800">DG Studio</span>
      </div>

      <div className="flex items-center space-x-4 ml-auto">
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-slate-800">{user.name}</div>
            <div className="text-xs text-slate-500">{user.role}</div>
          </div>
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;