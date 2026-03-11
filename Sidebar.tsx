import React, { useState } from 'react';
import { LayoutDashboard, Wand2, Heart, Settings, LogOut, Layers, ChevronLeft, ChevronRight, X, ChevronDown } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onLogout: () => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  onCloseMobile?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onLogout, isCollapsed, toggleCollapse, onCloseMobile }) => {
  const [isNavExpanded, setIsNavExpanded] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'generator', label: 'AI Generator', icon: Wand2 },
    { id: 'favorites', label: 'Favorites', icon: Heart },
  ];

  const toggleNav = () => {
    if (!isCollapsed) {
      setIsNavExpanded(!isNavExpanded);
    }
  };

  return (
    <aside 
      className={`h-full bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out shadow-2xl md:shadow-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className={`p-6 flex items-center border-b border-slate-100 h-[89px] ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Layers className="text-white w-5 h-5" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold text-slate-800 tracking-tight whitespace-nowrap animate-fade-in">
              DG Studio
            </span>
          )}
        </div>
        {/* Mobile Close Button */}
        <button onClick={onCloseMobile} className="md:hidden p-2 text-slate-400 hover:text-slate-600 active:scale-90 transition-transform">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
        
        {/* Collapsible Main Menu Group */}
        {!isCollapsed && (
          <button 
            onClick={toggleNav}
            className="w-full flex items-center justify-between px-2 py-2 mb-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors group"
          >
            <span>Menu Principal</span>
            <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isNavExpanded ? '' : '-rotate-90'}`} />
          </button>
        )}

        <div className={`space-y-1 transition-all duration-300 ease-in-out overflow-hidden ${
          isCollapsed ? 'opacity-100 max-h-none' : (isNavExpanded ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0 pointer-events-none')
        }`}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as ViewState)}
                title={isCollapsed ? item.label : ''}
                className={`w-full flex items-center rounded-xl transition-all duration-200 group relative ${
                  isCollapsed ? 'justify-center p-3' : 'space-x-3 px-4 py-3'
                } ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700 font-medium shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                {!isCollapsed && <span className="whitespace-nowrap overflow-hidden">{item.label}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-100 space-y-2 bg-slate-50/50">
        <button 
          onClick={() => onNavigate('settings')}
          title={isCollapsed ? 'Settings' : ''}
          className={`w-full flex items-center rounded-xl transition-colors ${
            isCollapsed ? 'justify-center p-3' : 'space-x-3 px-4 py-3'
          } ${
            currentView === 'settings' 
              ? 'bg-indigo-50 text-indigo-700' 
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Settings className="w-5 h-5 text-slate-400 flex-shrink-0" />
          {!isCollapsed && <span className="whitespace-nowrap font-medium">Configurações</span>}
        </button>
        
        <button 
          onClick={onLogout}
          title={isCollapsed ? 'Sign Out' : ''}
          className={`w-full flex items-center rounded-xl text-red-600 hover:bg-red-50 transition-colors ${
            isCollapsed ? 'justify-center p-3' : 'space-x-3 px-4 py-3'
          }`}
        >
          <LogOut className="w-5 h-5 text-red-400 flex-shrink-0" />
          {!isCollapsed && <span className="whitespace-nowrap font-medium">Sair</span>}
        </button>

        {/* Desktop Toggle Collapse Button */}
        <button
          onClick={toggleCollapse}
          className={`hidden md:flex w-full items-center rounded-xl mt-4 transition-colors text-slate-400 hover:bg-slate-100 hover:text-slate-600 ${
             isCollapsed ? 'justify-center p-3' : 'px-4 py-2 justify-end'
          }`}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;