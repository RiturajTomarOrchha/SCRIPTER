import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { AuthForm } from '../../components/auth/AuthForm';
import {
  ChevronRight,
  AlertCircle,
  Loader2,
  Mail,
  X,
  Sparkles,
  ShieldAlert,
  Zap,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import firebaseConfig from '../../../firebase-applet-config.json';

export const AuthPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    loading,
    signInWithGoogle,
    signInAsDemoCreator,
    signOutUser,
    error: authError,
  } = useAuth();
  const { language, toggleLanguage } = useLanguage();

  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [hasCopiedDomain, setHasCopiedDomain] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const isPreview = queryParams.get('preview') === 'true';
  const redirectPath = (location.state as { from?: string })?.from || '/user/home';
  const isRegister = location.pathname === '/register';

  // If already authenticated and NOT in preview mode, redirect to User Home
  if (isAuthenticated && !loading && !isPreview) {
    return <Navigate to={redirectPath} replace />;
  }

  const isUnauthorizedDomain =
    googleError?.toLowerCase().includes('unauthorized-domain') ||
    authError?.toLowerCase().includes('unauthorized-domain');

  const handleGoogleSignIn = async () => {
    setGoogleError(null);
    setIsGoogleSubmitting(true);
    try {
      await signInWithGoogle();
      navigate(redirectPath, { replace: true });
    } catch (err: any) {
      if (err.code === 'auth/unauthorized-domain' || err.message?.includes('unauthorized-domain')) {
        setGoogleError(
          `auth/unauthorized-domain: Current domain '${window.location.hostname}' must be authorized in Firebase Console.`
        );
      } else if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        setGoogleError(err.message || 'Google sign-in could not be completed. Please try again.');
      }
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <div className="h-screen h-[100dvh] max-h-screen w-full bg-[#070D1E] text-white flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-hidden select-none">
      {/* Background Ambient Glows & Horizon (Matching Scripter Reference Showcase) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-gradient-to-b from-blue-600/25 via-indigo-600/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[700px] h-[200px] bg-gradient-to-t from-blue-500/20 via-blue-600/10 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* 1. TOP STYLISH WHITE CURVED HEADER FOR DARK LOGO */}
      <div className="relative w-full z-30 shrink-0">
        <div className="w-full bg-white pt-3 pb-3 sm:pb-3.5 px-4 sm:px-6 shadow-xl shadow-black/25 rounded-b-[32px] sm:rounded-b-[40px] flex items-center justify-between border-b border-slate-100">
          {/* Logo with perfect contrast on pure white background */}
          <div className="flex items-center gap-2">
            <img
              src="/assets/aistudio/HEADER_LOGO_f8b18f40.png"
              alt="Scripter — Complete Content Creation"
              className="h-8 sm:h-9 w-auto max-w-[210px] sm:max-w-none object-contain"
            />
          </div>

          {/* Minimal Language Toggle Pill */}
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold border border-slate-200/80 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-xs shrink-0"
            title="Toggle Language / भाषा बदलें"
          >
            <span className="text-xs">🌐</span>
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>

        {/* Ambient indicator bar if user is currently previewing while authenticated */}
        {isAuthenticated && isPreview && (
          <div className="w-full bg-blue-900/90 border-b border-blue-700/60 px-3 py-1.5 text-[11px] flex items-center justify-between text-blue-100">
            <span className="truncate">
              {language === 'en' ? 'Previewing as Logged In User' : 'प्राइमरी स्क्रीन प्रीव्यू मोड'}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => navigate('/user/home')}
                className="underline hover:text-white font-bold"
              >
                {language === 'en' ? 'Go to Dashboard' : 'डैशबोर्ड'}
              </button>
              <span>•</span>
              <button
                onClick={async () => {
                  try {
                    await signOutUser();
                  } catch (e) {
                    console.error(e);
                  }
                  navigate('/login');
                }}
                className="text-rose-300 underline font-bold"
              >
                {language === 'en' ? 'Sign Out' : 'लॉग आउट'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. CENTER CONTENT (NO SCROLL, COMPACT & IMPACTFUL MATCHING SHOWCASE IMAGE) */}
      <div className="flex-1 w-full max-w-sm mx-auto px-5 py-2 flex flex-col justify-center items-center text-center relative z-10 min-h-0">
        {/* 3D Scripter App Logo Badge with Vibrant Ring */}
        <div className="relative mb-2 sm:mb-3">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl p-1 bg-gradient-to-tr from-blue-500 via-indigo-500 to-amber-400 shadow-2xl shadow-blue-500/40 flex items-center justify-center mx-auto transition-transform active:scale-105">
            <img
              src="/assets/aistudio/Square_Scripter_Logo_d7bb9aeb.png"
              alt="Scripter 3D Icon"
              className="w-full h-full object-contain rounded-2xl"
            />
          </div>
        </div>

        {/* Brand Title & Tagline */}
        <div className="space-y-0.5 mb-2">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
            Scripter
          </h1>
          <p className="text-[11px] sm:text-xs font-semibold tracking-wider text-slate-300 uppercase">
            Complete Content Creation
          </p>
        </div>

        {/* Core Hindi Brand Slogan from Prompt 12 Reference */}
        <div className="space-y-1 mb-2">
          <h2 className="text-xl sm:text-2xl font-black text-amber-300 tracking-tight leading-tight">
            सोचिए • लिखिए • बनाइए
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            बेहतर कंटेंट, आसान तरीके से।
          </p>
        </div>

        {/* Stylish Curved Golden Wave SVG (Exact flowing ribbon from reference showcase) */}
        <div className="w-full max-w-[280px] sm:max-w-xs h-7 sm:h-8 flex items-center justify-center my-1 pointer-events-none">
          <svg viewBox="0 0 320 40" fill="none" className="w-full h-full">
            <path
              d="M0,28 C80,6 160,42 320,14"
              stroke="url(#goldenRibbon)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M15,32 C95,12 175,38 305,18"
              stroke="#FEF3C7"
              strokeWidth="1.2"
              strokeOpacity="0.8"
            />
            <defs>
              <linearGradient id="goldenRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* New Creator Welcome Credits Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[11px] font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>
            {language === 'en'
              ? '1-Click Sign In • 1,200 Free AI Credits'
              : '1-क्लिक साइन इन • 1,200 फ्री AI क्रेडिट्स'}
          </span>
        </div>

        {/* Error / Unauthorized Domain Resolution Card */}
        {isUnauthorizedDomain ? (
          <div className="w-full mb-3 p-3 rounded-2xl bg-amber-950/85 border border-amber-500/50 text-left space-y-2.5 animate-in fade-in shadow-xl shadow-amber-950/50">
            <div className="flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-amber-300">
                  {language === 'en' ? 'Domain Authorization Required in Firebase' : 'Firebase डोमेन ऑथराइजेशन आवश्यक'}
                </p>
                <p className="text-[10px] text-slate-300 mt-0.5 leading-snug">
                  {language === 'en'
                    ? `Current preview domain (${window.location.hostname}) must be added to Authorized Domains in Firebase Console.`
                    : `वर्तमान प्रीव्यू डोमेन (${window.location.hostname}) को Firebase कंसोल में जोड़ना आवश्यक है।`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={async () => {
                  await signInAsDemoCreator('support.scripter@gmail.com', 'Rituraj Tomar', 'user');
                  navigate(redirectPath, { replace: true });
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                <span>{language === 'en' ? 'Continue as Creator Now' : 'तुरंत क्रिएटर मोड में शुरू करें'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.hostname);
                  setHasCopiedDomain(true);
                  setTimeout(() => setHasCopiedDomain(false), 3000);
                }}
                className="py-2 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold border border-white/15 flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                title="Copy Domain Name"
              >
                {hasCopiedDomain ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{hasCopiedDomain ? 'Copied' : 'Copy'}</span>
              </button>

              <a
                href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/settings`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                title="Open Firebase Console"
              >
                <span>Console</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ) : (googleError || authError) ? (
          <div className="w-full mb-2 p-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="flex-1 text-left text-[11px]">{googleError || authError}</span>
          </div>
        ) : null}

        {/* 3. PRIMARY GOOGLE PILL BUTTON (Identical to Left Phone in Showcase 2) */}
        <div className="w-full space-y-2">
          <button
            onClick={handleGoogleSignIn}
            disabled={isGoogleSubmitting}
            className="w-full py-3.5 px-6 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm sm:text-base shadow-2xl shadow-blue-900/60 flex items-center justify-between group active:scale-98 transition-all disabled:opacity-60 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              {isGoogleSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              ) : (
                /* Official Multi-Color Google G SVG Icon */
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
              )}
              <span className="font-bold text-slate-900 tracking-tight">
                {isGoogleSubmitting
                  ? (language === 'en' ? 'Connecting to Google...' : 'गूगल से कनेक्ट हो रहा है...')
                  : (language === 'en' ? 'Continue with Google' : 'Google से जारी रखें')}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Quick Direct Explore in Development Mode */}
          <button
            onClick={() => navigate(redirectPath)}
            className="w-full py-1.5 text-center text-xs text-slate-400 hover:text-white font-medium transition-colors"
          >
            {language === 'en' ? 'Explore App without Sign In →' : 'बिना साइन इन किए ऐप देखें →'}
          </button>
        </div>
      </div>

      {/* 4. BOTTOM FOOTER & POWERED BY (MATCHING SHOWCASE IMAGE) */}
      <div className="w-full py-3 px-4 text-center shrink-0 relative z-20 space-y-1">
        {/* Discrete Alternative Email Login Trigger */}
        <button
          onClick={() => setShowEmailModal(true)}
          className="text-[11px] text-slate-500 hover:text-slate-300 font-medium inline-flex items-center gap-1 transition-colors"
        >
          <Mail className="w-3 h-3" />
          <span>{language === 'en' ? 'Or sign in with Email' : 'या ईमेल से साइन इन करें'}</span>
        </button>

        {/* Official Powered by Scripter Branding */}
        <p className="text-xs font-semibold text-slate-400 tracking-wide">
          Powered by <strong className="text-white font-bold">Scripter</strong>
        </p>
      </div>

      {/* MODAL: Email / Password Authentication (Clean popup so main screen never scrolls) */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0B132B] border border-slate-800 rounded-3xl max-w-sm w-full p-5 relative shadow-2xl animate-in zoom-in-95">
            <button
              onClick={() => setShowEmailModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800/60"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="mb-4 text-center">
              <h3 className="text-base font-bold text-white">
                {language === 'en' ? 'Email Sign In' : 'ईमेल से साइन इन करें'}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'en' ? 'Enter credentials below' : 'अपना विवरण दर्ज करें'}
              </p>
            </div>
            <AuthForm initialMode={isRegister ? 'register' : 'login'} />
          </div>
        </div>
      )}
    </div>
  );
};
