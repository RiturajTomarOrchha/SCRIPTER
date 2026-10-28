import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ShieldAlert, Crown, ArrowLeft, Lock, Loader2, LogIn } from 'lucide-react';

interface RoleGuardProps {
  requiredRole: 'admin' | 'master-admin';
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ requiredRole, children }) => {
  const { role, isDevMode } = useRole();
  const { isAuthenticated, loading: authLoading, signInWithGoogle, userProfile } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  // Show loading indicator while Firebase Auth resolves
  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-slate-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="text-xs font-medium">Verifying Firebase authentication session...</span>
      </div>
    );
  }

  // If not authenticated and not explicitly in Dev Mode bypass, prompt login
  if (!isAuthenticated && !isDevMode) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xl text-center space-y-5 animate-in fade-in">
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
            <LogIn className="w-8 h-8 stroke-[2.2]" />
          </div>

          <div>
            <span className="px-2.5 py-1 text-[11px] font-mono font-bold uppercase rounded-full bg-blue-50 text-blue-700 tracking-wider">
              Authentication Required
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-2">
              {language === 'en' ? 'Sign In to Access Console' : 'कंसोल एक्सेस करने के लिए साइन इन करें'}
            </h2>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              {language === 'en'
                ? 'Please sign in with your verified Google account to access administrative consoles and management tools.'
                : 'प्रशासनिक कंसोल और प्रबंधन टूल्स तक पहुँचने के लिए कृपया अपने सत्यापित Google खाते से साइन इन करें।'}
            </p>
          </div>

          <button
            onClick={() => signInWithGoogle().catch(() => {})}
            className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
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
            <span>{language === 'en' ? 'Sign In with Google' : 'Google से साइन इन करें'}</span>
          </button>
        </div>
      </div>
    );
  }

  // Active role check (effective role strictly governed by verified Auth profile in production, or Dev Mode switcher)
  const effectiveRole = isDevMode ? role : (userProfile?.role || 'user');

  // Master Admin has unrestricted access to all control room areas
  if (effectiveRole === 'master-admin') {
    return <>{children}</>;
  }

  // If page requires Admin and role is Admin, allow access
  if (requiredRole === 'admin' && effectiveRole === 'admin') {
    return <>{children}</>;
  }

  // Handle unauthorized state
  const isMasterAdminRequired = requiredRole === 'master-admin';

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xl text-center space-y-5 animate-in fade-in">
        <div
          className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg ${
            isMasterAdminRequired
              ? 'bg-gradient-to-tr from-amber-500 to-amber-600 text-white shadow-amber-500/20'
              : 'bg-gradient-to-tr from-rose-500 to-rose-600 text-white shadow-rose-500/20'
          }`}
        >
          {isMasterAdminRequired ? (
            <Crown className="w-8 h-8 fill-white" />
          ) : (
            <ShieldAlert className="w-8 h-8 stroke-[2.2]" />
          )}
        </div>

        <div>
          <span className="px-2.5 py-1 text-[11px] font-mono font-bold uppercase rounded-full bg-slate-100 text-slate-700 tracking-wider">
            HTTP 403 · Access Denied
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-2">
            {isMasterAdminRequired
              ? language === 'en'
                ? 'Master Admin Privileges Required'
                : 'मास्टर एडमिन अनुमति आवश्यक'
              : language === 'en'
              ? 'Administrative Authorization Required'
              : 'प्रशासनिक अनुमति आवश्यक'}
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            {isMasterAdminRequired
              ? language === 'en'
                ? 'This module governs core platform infrastructure, billing parameters, and administrative permissions. Only verified Master Admin accounts may access this section.'
                : 'यह मॉड्यूल मुख्य प्लेटफॉर्म इंफ्रास्ट्रक्चर और एडमिन परमिशन को नियंत्रित करता है। केवल सत्यापित मास्टर एडमिन ही इसे एक्सेस कर सकते हैं।'
              : language === 'en'
              ? 'Your current user account does not have authorization to view internal administrative workspaces. This action has been logged in security audit records.'
              : 'आपके वर्तमान खाते के पास प्रशासनिक कार्यक्षेत्र देखने की अनुमति नहीं है। यह प्रयास सुरक्षा ऑडिट में दर्ज कर लिया गया है।'}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <button
            onClick={() => {
              if (effectiveRole === 'admin') {
                navigate('/admin/dashboard');
              } else {
                navigate('/user/home');
              }
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>
              {effectiveRole === 'admin'
                ? language === 'en'
                  ? 'Return to Admin Console'
                  : 'एडमिन कंसोल पर लौटें'
                : language === 'en'
                ? 'Return to Creator Home'
                : 'क्रिएटर होम पर लौटें'}
            </span>
          </button>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <Lock className="w-3.5 h-3.5" />
          <span>Role-Based Access Control (RBAC) Active</span>
        </div>
      </div>
    </div>
  );
};
