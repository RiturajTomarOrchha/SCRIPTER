import React from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useRole } from '../context/RoleContext';
import { useAuth } from '../context/AuthContext';
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
  LogIn,
  LogOut,
  User,
  Shield,
  Globe,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface UserSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserSidebar: React.FC<UserSidebarProps> = ({ isOpen, onClose }) => {
  const { language, toggleLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { creditsTotal, creditsUsed, activeBusinessProfile, role, setRole, isDevMode } = useRole();
  const { userProfile: authProfile, isAuthenticated, signInWithGoogle, signOutUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-68 bg-[#0B132B] text-slate-300 border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header with high-contrast white capsule for logo & Night Mode toggle */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80 bg-[#070D1E]/60 shrink-0">
          <Link to="/user/home" onClick={onClose} className="flex items-center">
            <div className="bg-white px-3 py-1.5 rounded-xl shadow-xs border border-white/20 flex items-center justify-center">
              <img
                src="/assets/aistudio/HEADER_LOGO_f8b18f40.png"
                alt="Scripter Logo"
                className="h-8 sm:h-9 object-contain"
              />
            </div>
          </Link>
          <div className="flex items-center gap-1">
            {/* Night Mode Icon in top header */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors"
              title={isDark ? (language === 'en' ? 'Switch to Light Mode' : 'लाइट मोड चालू करें') : (language === 'en' ? 'Switch to Dark Mode' : 'नाइट मोड चालू करें')}
              aria-label="Toggle Night Mode"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-300" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Drawer User Account Card & Controls (Only rendered inside mobile drawer) */}
        <div className="lg:hidden p-3 border-b border-slate-800/80 bg-slate-900/60 space-y-2.5">
          {isAuthenticated ? (
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-800/70 border border-slate-700/60">
              <div className="flex items-center gap-2.5 min-w-0">
                {authProfile?.photoURL ? (
                  <img
                    src={authProfile.photoURL}
                    alt={authProfile.displayName}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-600 shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {authProfile?.displayName?.slice(0, 2).toUpperCase() || 'SC'}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white truncate leading-tight">
                    {authProfile?.displayName || 'Creator'}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {authProfile?.email || 'Logged in'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  signOutUser().catch(() => {});
                  onClose();
                }}
                className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors shrink-0"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-1.5">
              <button
                onClick={() => {
                  signInWithGoogle().catch(() => {});
                  onClose();
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all"
              >
                <svg className="w-3.5 h-3.5 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>{language === 'en' ? 'Sign In with Google' : 'गूगल से साइन इन करें'}</span>
              </button>
            </div>
          )}

          {/* Clean Language Switcher Row */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 transition-all active:scale-98"
            title="Toggle Language / भाषा बदलें"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block leading-none">
                  {language === 'en' ? 'Language / भाषा' : 'भाषा / Language'}
                </span>
                <span className="text-xs font-bold text-white leading-tight">
                  {language === 'en' ? 'English (EN)' : 'हिन्दी (HI)'}
                </span>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-blue-400 bg-blue-950/70 px-2 py-0.5 rounded-lg border border-blue-800/60">
              {language === 'en' ? 'हिन्दी में बदलें' : 'Switch to EN'}
            </span>
          </button>

          {/* Mobile Role Switcher (User / Admin / Master Admin) - un-cramped with full width */}
          {isDevMode && (
            <div className="w-full pt-0.5">
              <div className="flex items-center justify-between mb-1 px-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  {language === 'en' ? 'Active Mode' : 'मोड स्विचर'}
                </span>
                <span className="text-[10px] text-amber-400 font-mono font-medium">Dev Switcher</span>
              </div>
              <div className="grid grid-cols-3 gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setRole('user');
                    onClose();
                  }}
                  className={`px-2 py-1.5 rounded-lg text-xs font-semibold text-center transition-all ${
                    role === 'user'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  User
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole('admin');
                    onClose();
                  }}
                  className={`px-2 py-1.5 rounded-lg text-xs font-semibold text-center transition-all ${
                    role === 'admin'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole('master-admin');
                    onClose();
                  }}
                  className={`px-2 py-1.5 rounded-lg text-xs font-semibold text-center transition-all ${
                    role === 'master-admin'
                      ? 'bg-amber-500 text-white font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  Master
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Active Profile context pill */}
        <div className="px-4 py-2.5 border-b border-slate-800/60 bg-slate-900/40">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold truncate">
                {language === 'en' ? 'Active Profile' : 'सक्रिय प्रोफ़ाइल'}
              </p>
              <p className="text-xs font-bold text-white truncate leading-tight">
                {activeBusinessProfile.name}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Rail */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-none">
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
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
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
        <div className="p-3 border-t border-slate-800/80 bg-[#070D1E]/40 space-y-2">
          <Link
            to="/user/credits"
            onClick={onClose}
            className="block p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Credits</span>
              </span>
              <span className="text-amber-300 font-mono font-bold text-xs">
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
            className="flex items-center justify-between px-3 py-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 text-xs transition-colors"
          >
            <span className="flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Help & Guides' : 'सहायता व गाइड'}</span>
            </span>
            <span className="text-[10px] text-slate-500">v1.2</span>
          </Link>

          {/* Primary Screen Preview Link */}
          <Link
            to="/login?preview=true"
            onClick={onClose}
            className="flex items-center justify-between px-3 py-1.5 rounded-xl text-blue-400 hover:text-blue-300 hover:bg-blue-950/40 text-[11px] font-semibold border border-blue-900/50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'en' ? 'View Primary Welcome Screen' : 'प्राइमरी वेलकम स्क्रीन देखें'}</span>
            </span>
            <span className="text-[10px] text-blue-300">→</span>
          </Link>

          {/* Dedicated Sign Out / Log Out Button (At the very bottom of the menu bar) */}
          <div className="pt-2 border-t border-slate-800/80">
            {isAuthenticated ? (
              <button
                onClick={async () => {
                  try {
                    await signOutUser();
                  } catch (err) {
                    console.error('Sign-out failed:', err);
                  }
                  onClose();
                  navigate('/login');
                }}
                className="w-full min-h-[46px] px-4 py-2.5 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 active:scale-98 border border-rose-800/60 text-rose-300 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
                title="Sign Out / लॉग आउट"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>{language === 'en' ? 'Sign Out / Log Out' : 'लॉग आउट (साइन आउट)'}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  navigate('/login');
                }}
                className="w-full min-h-[46px] px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-98 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/30"
              >
                <LogIn className="w-4 h-4" />
                <span>{language === 'en' ? 'Sign In / Register' : 'साइन इन / नया खाता बनाएं'}</span>
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};


