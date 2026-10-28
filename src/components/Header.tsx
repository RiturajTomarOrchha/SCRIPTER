import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Bell, ChevronDown, Sparkles, User, Globe, Menu, Shield, LogIn, LogOut, Check, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, showSidebarToggle = false }) => {
  const {
    role,
    setRole,
    isDevMode,
    activeBusinessProfile,
    creditsTotal,
    creditsUsed,
    unreadNotificationsCount,
    userProfile,
    subscription,
  } = useRole();
  const { userProfile: authProfile, isAuthenticated, signInWithGoogle, signOutUser } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const roleMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (roleMenuRef.current && !roleMenuRef.current.contains(target)) {
        setShowRoleDropdown(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#070D1E]/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-17 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Logo cleanly displayed without enclosing box, enlarged for high mobile visibility */}
        <div className="flex items-center shrink-0">
          <Link
            to={role === 'user' ? '/user/home' : role === 'admin' ? '/admin/dashboard' : '/master-admin/dashboard'}
            className="flex items-center group transition-transform active:scale-95 py-0.5"
            title="Scripter — Complete Content Creation"
          >
            <img
              src="/assets/aistudio/HEADER_LOGO_f8b18f40.png"
              alt="Scripter — Complete Content Creation"
              className="h-10 sm:h-11 md:h-12 w-auto max-w-[215px] sm:max-w-none object-contain select-none transition-all drop-shadow-xs"
            />
          </Link>
        </div>

        {/* Center: Desktop Test Mode Role Switcher Bar & Language Toggle (hidden on mobile to keep header clean) */}
        <div className="hidden md:flex items-center gap-2">
          {isDevMode && (
            <div className="relative" ref={roleMenuRef}>
              <button
                onClick={() => setShowRoleDropdown((prev) => !prev)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-amber-50 border border-amber-300/80 text-amber-900 hover:bg-amber-100/80 transition-colors shadow-2xs"
                title="Test Mode Role Switcher"
                aria-haspopup="true"
                aria-expanded={showRoleDropdown}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="font-mono uppercase text-[9px] font-bold tracking-wider text-amber-800 bg-amber-200/70 px-1 py-0.5 rounded">
                  TEST
                </span>
                <span className="font-semibold capitalize text-slate-800">
                  {role === 'master-admin' ? 'Master Admin' : role === 'admin' ? 'Admin' : 'User'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showRoleDropdown && (
                <div
                  className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 py-1.5 z-50 text-slate-800 animate-in fade-in slide-in-from-top-1 duration-150"
                  role="menu"
                >
                  <div className="px-3.5 py-2 border-b border-slate-100 bg-slate-50/80">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Test Mode Switcher
                      </p>
                      <span className="text-[9px] font-mono bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-semibold">
                        Preview
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                      Simulate all 3 application roles for testing.
                    </p>
                  </div>

                  <div className="p-1 space-y-0.5">
                    {/* User Option */}
                    <button
                      onClick={() => {
                        setRole('user');
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        role === 'user' ? 'bg-blue-50 text-blue-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 leading-tight">User</p>
                          <p className="text-[10px] text-slate-500">Creator studio & tools</p>
                        </div>
                      </div>
                      {role === 'user' && <Check className="w-4 h-4 text-blue-600" />}
                    </button>

                    {/* Admin Option */}
                    <button
                      onClick={() => {
                        setRole('admin');
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        role === 'admin' ? 'bg-blue-50 text-blue-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${role === 'admin' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                          <Shield className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 leading-tight">Admin</p>
                          <p className="text-[10px] text-slate-500">Moderation & operations</p>
                        </div>
                      </div>
                      {role === 'admin' && <Check className="w-4 h-4 text-blue-600" />}
                    </button>

                    {/* Master Admin Option */}
                    <button
                      onClick={() => {
                        setRole('master-admin');
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        role === 'master-admin' ? 'bg-amber-50 text-amber-900 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${role === 'master-admin' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 leading-tight">Master Admin</p>
                          <p className="text-[10px] text-slate-500">Platform executive controls</p>
                        </div>
                      </div>
                      {role === 'master-admin' && <Check className="w-4 h-4 text-amber-600" />}
                    </button>
                  </div>

                  <div className="px-3 py-1.5 border-t border-slate-100 bg-slate-50/50 text-[10px] text-slate-400">
                    Production RBAC remains strictly governed by verified credentials.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bilingual Toggle (EN | HI) */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
            title="Toggle Language / भाषा बदलें"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-mono text-[11px] uppercase tracking-wider">{language === 'en' ? 'EN' : 'HI'}</span>
          </button>
        </div>

        {/* Right side: Desktop extras + Mobile Header (Notifications then Menu toggle side-by-side) */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Desktop Credits Summary Badge */}
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

          {/* Night Mode / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title={isDark ? (language === 'en' ? 'Switch to Light Mode' : 'लाइट मोड चालू करें') : (language === 'en' ? 'Switch to Night Mode' : 'नाइट मोड चालू करें')}
            aria-label="Toggle Night Mode"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-400 fill-amber-400/20" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            )}
          </button>

          {/* Notifications Bell (visible on both Desktop and Mobile right side) */}
          <Link
            to={role === 'user' ? '/user/notifications' : role === 'admin' ? '/admin/notifications' : '/master-admin/notifications'}
            className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-xs">
                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button: Positioned immediately beside Notification Bell on mobile (Part 8 requirement) */}
          {showSidebarToggle && (
            <button
              onClick={onToggleSidebar}
              className="p-2 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl lg:hidden transition-colors"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-6 h-6 stroke-[2.2]" />
            </button>
          )}

          {/* Desktop Authentication Actions (hidden on mobile; mobile accesses auth inside menu drawer) */}
          {!isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 text-xs font-semibold transition-all"
              >
                {language === 'en' ? 'Log in' : 'लॉग इन'}
              </Link>
              <button
                onClick={() => signInWithGoogle().catch(() => {})}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all"
                title="Instant Google Sign In"
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
                <span>{language === 'en' ? 'Google' : 'गूगल'}</span>
              </button>
            </div>
          ) : null}

          {/* Desktop User Profile Avatar (hidden on mobile; mobile accesses profile inside drawer) */}
          <div className="relative hidden md:block" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-blue-500/20 transition-all focus:outline-hidden"
              aria-label="User Profile"
            >
              {authProfile?.photoURL ? (
                <img
                  src={authProfile.photoURL}
                  alt={authProfile.displayName}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-semibold text-xs flex items-center justify-center shadow-xs">
                  {authProfile?.displayName
                    ? authProfile.displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                    : 'SC'}
                </div>
              )}
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showProfileMenu && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-slate-800 animate-in fade-in slide-in-from-top-2 duration-150"
                onClick={() => setShowProfileMenu(false)}
              >
                <div className="px-3.5 py-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    {authProfile?.displayName || userProfile?.name || 'Content Creator'}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {authProfile?.email || userProfile?.email || 'creator@scripter.app'}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold rounded-md bg-blue-50 text-blue-700">
                      {subscription?.planName || 'Pro Plan'}
                    </span>
                    <span className="text-[10px] text-slate-400">· {activeBusinessProfile.name}</span>
                  </div>
                  {isAuthenticated && (
                    <span className="inline-flex items-center gap-1 mt-1 text-[10px] text-emerald-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Firebase Verified
                    </span>
                  )}
                </div>

                <Link
                  to="/user/profile"
                  className="block px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  {t('navProfile')} & Account
                </Link>
                <Link
                  to="/user/subscription"
                  className="block px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  {t('navPlansCredits')}
                </Link>
                <Link
                  to="/user/billing"
                  className="block px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  {language === 'en' ? 'Payments & Invoices' : 'भुगतान और बिलिंग'}
                </Link>
                <Link
                  to="/user/credits"
                  className="block px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  {language === 'en' ? 'Usage & AI Credits' : 'क्रेडिट उपयोग'}
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
                <div className="my-1 border-t border-slate-100" />
                {isAuthenticated ? (
                  <button
                    onClick={async () => {
                      setShowProfileMenu(false);
                      try {
                        await signOutUser();
                      } catch (err) {
                        console.error(err);
                      }
                      navigate('/login');
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center justify-between"
                  >
                    <span>{language === 'en' ? 'Sign Out' : 'साइन आउट'}</span>
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => signInWithGoogle().catch(() => {})}
                    className="w-full text-left px-3.5 py-2 text-xs text-blue-600 hover:bg-blue-50 flex items-center justify-between font-medium"
                  >
                    <span>{language === 'en' ? 'Sign In with Google' : 'Google से साइन इन करें'}</span>
                    <LogIn className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

