import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { useLanguage } from '../context/LanguageContext';
import { Bell, ChevronDown, Sparkles, User, Globe, Menu, Shield } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, showSidebarToggle = false }) => {
  const { role, setRole, isDevMode, activeBusinessProfile, creditsTotal, creditsUsed } = useRole();
  const { language, toggleLanguage, t } = useLanguage();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand & Mobile Sidebar Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {showSidebarToggle && (
            <button
              onClick={onToggleSidebar}
              className="p-2 -ml-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg lg:hidden"
              aria-label="Toggle navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to={role === 'user' ? '/user/home' : role === 'admin' ? '/admin/dashboard' : '/master-admin/dashboard'} className="flex items-center gap-2">
            <img
              src="/assets/aistudio/HEADER_LOGO_f8b18f40.png"
              alt="Scripter Logo"
              className="h-8 sm:h-9 object-contain"
            />
          </Link>
        </div>

        {/* Center / Dev Mode Role Switcher Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {isDevMode && (
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 border border-amber-200/80 text-amber-900 hover:bg-amber-100 transition-colors shadow-2xs"
                title="Development / Test Mode Role Switcher"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse hidden sm:inline-block" />
                <span className="font-mono uppercase text-[10px] tracking-wider text-amber-700 bg-amber-200/60 px-1 rounded sm:inline">DEV</span>
                <span className="capitalize">{role === 'master-admin' ? 'Master Admin' : role}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {showRoleDropdown && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 text-slate-800 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setShowRoleDropdown(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/70">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      {t('devMode')} Role Switcher
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Instantly preview each platform perspective
                    </p>
                  </div>

                  <button
                    onClick={() => setRole('user')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-blue-50 transition-colors ${
                      role === 'user' ? 'text-blue-700 font-semibold bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="font-medium">User Role</p>
                        <p className="text-[10px] text-slate-400">Content Creator Experience</p>
                      </div>
                    </div>
                    {role === 'user' && <span className="text-blue-600 text-xs">●</span>}
                  </button>

                  <button
                    onClick={() => setRole('admin')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-100 transition-colors ${
                      role === 'admin' ? 'text-blue-700 font-semibold bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-slate-600" />
                      <div>
                        <p className="font-medium">Admin Role</p>
                        <p className="text-[10px] text-slate-400">Operations & Moderation</p>
                      </div>
                    </div>
                    {role === 'admin' && <span className="text-blue-600 text-xs">●</span>}
                  </button>

                  <button
                    onClick={() => setRole('master-admin')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-amber-50 transition-colors ${
                      role === 'master-admin' ? 'text-amber-800 font-semibold bg-amber-50/50' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <div>
                        <p className="font-medium">Master Admin Role</p>
                        <p className="text-[10px] text-slate-400">Full Platform Executive Control</p>
                      </div>
                    </div>
                    {role === 'master-admin' && <span className="text-amber-600 text-xs">●</span>}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Bilingual Toggle (EN | HI) */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
            title="Toggle Language / भाषा बदलें"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-mono text-[11px] uppercase tracking-wider">{language === 'en' ? 'EN' : 'HI'}</span>
          </button>
        </div>

        {/* Right: Credits, Notifications, Profile Avatar */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Credits Summary Badge on larger screens */}
          {role === 'user' && (
            <Link
              to="/user/credits"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200/70 text-amber-900 text-xs font-medium hover:bg-amber-100/70 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span className="font-mono tabular-nums font-semibold">{creditsTotal - creditsUsed}</span>
              <span className="text-amber-700/80 text-[11px]">{t('creditsLeft')}</span>
            </Link>
          )}

          {/* Notifications */}
          <Link
            to={role === 'user' ? '/user/notifications' : role === 'admin' ? '/admin/notifications' : '/master-admin/notifications'}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </Link>

          {/* User Profile Avatar */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-blue-500/20 transition-all focus:outline-hidden"
              aria-label="User Profile"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-semibold text-xs flex items-center justify-center shadow-xs">
                RT
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
            </button>

            {showProfileMenu && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-slate-800 animate-in fade-in slide-in-from-top-2 duration-150"
                onClick={() => setShowProfileMenu(false)}
              >
                <div className="px-3.5 py-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900">Rituraj Tomar</p>
                  <p className="text-[11px] text-slate-500 truncate">riturajtomarorchha@gmail.com</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold rounded-md bg-blue-50 text-blue-700">
                      Pro Plan
                    </span>
                    <span className="text-[10px] text-slate-400">· {activeBusinessProfile.name}</span>
                  </div>
                </div>

                <Link
                  to="/user/profile"
                  className="block px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  {t('navProfile')} & Account
                </Link>
                <Link
                  to="/user/business-profiles"
                  className="block px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  {t('navBusinessProfiles')}
                </Link>
                <Link
                  to="/user/brand-kit"
                  className="block px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium text-amber-700"
                >
                  ✨ {language === 'en' ? 'Brand Kit & Logo' : 'ब्रांड किट और लोगो'}
                </Link>
                <Link
                  to="/user/templates"
                  className="block px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  {language === 'en' ? 'Templates & Packs' : 'टेम्पलेट्स और विजुअल पैक'}
                </Link>
                <Link
                  to="/user/thumbnail-studio"
                  className="block px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  {language === 'en' ? 'Thumbnail & Graphics' : 'थंबनेल और ग्राफिक्स'}
                </Link>
                <Link
                  to="/user/subscription"
                  className="block px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  {t('navPlansCredits')}
                </Link>
                <Link
                  to="/user/settings"
                  className="block px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  {t('navSystemSettings')}
                </Link>
                <div className="my-1 border-t border-slate-100" />
                <Link
                  to="/user/help"
                  className="block px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  {t('navHelpDocs')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
