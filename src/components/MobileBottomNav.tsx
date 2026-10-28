import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Home, Lightbulb, Plus, FolderKanban, User } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { language } = useLanguage();

  const navItems = [
    { id: 'home', label: language === 'en' ? 'Home' : 'होम', path: '/user/home', icon: Home },
    { id: 'ideas', label: language === 'en' ? 'Ideas' : 'आइडिया', path: '/user/ideas', icon: Lightbulb },
    { id: 'create', label: language === 'en' ? 'Create' : 'बनाएं', path: '/user/create', icon: Plus, isAction: true },
    { id: 'projects', label: language === 'en' ? 'Projects' : 'प्रोजेक्ट्स', path: '/user/projects', icon: FolderKanban },
    { id: 'profile', label: language === 'en' ? 'Profile' : 'प्रोफ़ाइल', path: '/user/profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#070D1E]/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 shadow-lg md:hidden pb-safe transition-colors">
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className="flex flex-col items-center justify-center -mt-5 group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 via-blue-500 to-amber-400 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 group-active:scale-95 transition-transform ring-4 ring-white dark:ring-[#070D1E]">
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 tracking-tight mt-1">
                  {item.label}
                </span>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 transition-colors min-h-[44px] ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                  <span className="text-[10px] tracking-tight mt-1 font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
