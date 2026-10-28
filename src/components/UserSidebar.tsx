import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useRole } from '../context/RoleContext';
import {
  LayoutDashboard,
  Lightbulb,
  FileText,
  Mic,
  Video,
  Film,
  FolderKanban,
  Briefcase,
  Sparkles,
  Settings,
  X,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserSidebar: React.FC<UserSidebarProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const { creditsTotal, creditsUsed, activeBusinessProfile } = useRole();
  const location = useLocation();

  const navItems = [
    {
      id: 'dashboard',
      path: '/user/home',
      labelEn: 'Dashboard',
      labelHi: 'डैशबोर्ड',
      icon: LayoutDashboard,
    },
    {
      id: 'ideas',
      path: '/user/ideas',
      labelEn: 'Ideas & Trending',
      labelHi: 'आइडिया और ट्रेंड्स',
      icon: Lightbulb,
    },
    {
      id: 'script-studio',
      path: '/user/script-studio',
      labelEn: 'Script Studio',
      labelHi: 'स्क्रिप्ट स्टूडियो',
      icon: FileText,
    },
    {
      id: 'teleprompter',
      path: '/user/teleprompter',
      labelEn: 'Teleprompter',
      labelHi: 'टेलीप्रॉम्प्टर',
      icon: Mic,
    },
    {
      id: 'video-recording',
      path: '/user/video-recording',
      labelEn: 'Video Recording',
      labelHi: 'वीडियो रिकॉर्डिंग',
      icon: Video,
    },
    {
      id: 'video-studio',
      path: '/user/video-studio',
      labelEn: 'Video Studio',
      labelHi: 'वीडियो स्टूडियो',
      icon: Film,
    },
    {
      id: 'projects',
      path: '/user/projects',
      labelEn: 'Projects & Library',
      labelHi: 'प्रोजेक्ट्स व लाइब्रेरी',
      icon: FolderKanban,
    },
    {
      id: 'business-profiles',
      path: '/user/business-profiles',
      labelEn: 'Business Profile',
      labelHi: 'बिज़नेस प्रोफ़ाइल',
      icon: Briefcase,
    },
    {
      id: 'credits',
      path: '/user/credits',
      labelEn: 'AI Credits',
      labelHi: 'AI क्रेडिट्स',
      icon: Sparkles,
      badge: `${creditsTotal - creditsUsed}`,
    },
    {
      id: 'settings',
      path: '/user/settings',
      labelEn: 'Settings',
      labelHi: 'सेटिंग्स',
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar Container matching Poster Design */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0B132B] text-slate-300 border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80 bg-[#070D1E]/60 shrink-0">
          <Link to="/user/home" onClick={onClose} className="flex items-center gap-2">
            <img
              src="/assets/aistudio/HEADER_LOGO_f8b18f40.png"
              alt="Scripter"
              className="h-8 object-contain"
            />
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Profile context pill */}
        <div className="px-4 py-3 border-b border-slate-800/60 bg-slate-900/40">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold truncate">
                {language === 'en' ? 'Active Profile' : 'सक्रिय प्रोफ़ाइल'}
              </p>
              <p className="text-xs font-bold text-white truncate">
                {activeBusinessProfile.name}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Rail */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path !== '/user/home' && location.pathname.startsWith(item.path));

            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={onClose}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{language === 'en' ? item.labelEn : item.labelHi}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-amber-400/20 text-amber-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Footer: Quick Credits & Help */}
        <div className="p-4 border-t border-slate-800/80 bg-[#070D1E]/40 space-y-2">
          <Link
            to="/user/credits"
            onClick={onClose}
            className="block p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Credits</span>
              </span>
              <span className="text-amber-300 font-mono font-bold">
                {creditsTotal - creditsUsed} left
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                style={{ width: `${Math.min(100, Math.round((creditsUsed / creditsTotal) * 100))}%` }}
              />
            </div>
          </Link>

          <Link
            to="/user/help"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 text-xs transition-colors"
          >
            <span className="flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Help & Guides' : 'सहायता व गाइड'}</span>
            </span>
            <span className="text-[10px] text-slate-500">v1.2</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

