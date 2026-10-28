import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  ChevronLeft,
} from 'lucide-react';

interface AuthFormProps {
  initialMode?: 'login' | 'register' | 'forgot_password';
  onSuccess?: () => void;
  isModal?: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  initialMode = 'login',
  onSuccess,
  isModal = false,
}) => {
  const {
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    sendPasswordReset,
    error: authError,
    clearError,
  } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot_password'>(initialMode);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  // Retrieve destination if redirected from a protected route
  const redirectPath = (location.state as { from?: string })?.from || '/user/home';

  const handleModeChange = (newMode: 'login' | 'register' | 'forgot_password') => {
    setMode(newMode);
    setLocalError(null);
    setSuccessMessage(null);
    clearError();
  };

  const handleGoogleSignIn = async () => {
    setLocalError(null);
    setSuccessMessage(null);
    setIsGoogleSubmitting(true);
    try {
      await signInWithGoogle();
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(redirectPath, { replace: true });
      }
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setLocalError(err.message || 'Google sign-in could not be completed.');
      }
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);
    clearError();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setLocalError(language === 'en' ? 'Please enter a valid email address.' : 'कृपया मान्य ईमेल दर्ज करें।');
      return;
    }

    if (mode === 'forgot_password') {
      setIsSubmitting(true);
      try {
        await sendPasswordReset(trimmedEmail);
        setSuccessMessage(
          language === 'en'
            ? `Password reset link sent to ${trimmedEmail}. Please check your inbox or spam folder.`
            : `पासवर्ड रीसेट लिंक ${trimmedEmail} पर भेज दिया गया है। अपना इनबॉक्स चेक करें।`
        );
      } catch (err: any) {
        setLocalError(err.message || 'Failed to send password reset email.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!password || password.length < 6) {
      setLocalError(
        language === 'en'
          ? 'Password must contain at least 6 characters.'
          : 'पासवर्ड में कम से कम 6 अक्षर होने चाहिए।'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'register') {
        const trimmedName = displayName.trim() || trimmedEmail.split('@')[0];
        await signUpWithEmail(trimmedEmail, password, trimmedName);
      } else {
        await signInWithEmail(trimmedEmail, password);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate(redirectPath, { replace: true });
      }
    } catch (err: any) {
      setLocalError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeError = localError || authError;

  return (
    <div
      className={`w-full max-w-md mx-auto ${
        isModal
          ? 'p-0'
          : 'p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50'
      }`}
    >
      {/* Brand Header */}
      <div className="text-center mb-6">
        <Link to="/" className="inline-flex items-center gap-2 mb-3">
          <img
            src="/assets/aistudio/HEADER_LOGO_f8b18f40.png"
            alt="Scripter Logo"
            className="h-9 object-contain mx-auto"
          />
        </Link>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          {mode === 'login'
            ? language === 'en'
              ? 'Welcome back to Scripter'
              : 'स्क्रिप्टर में पुनः स्वागत है'
            : mode === 'register'
            ? language === 'en'
              ? 'Create your creator account'
              : 'नया क्रिएटर खाता बनाएं'
            : language === 'en'
            ? 'Reset your password'
            : 'पासवर्ड रीसेट करें'}
        </h2>
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
          {mode === 'login'
            ? language === 'en'
              ? 'Sign in to access your video scripts, research tools, and studio projects.'
              : 'अपनी स्क्रिप्ट्स और प्रोजेक्ट्स एक्सेस करने के लिए साइन इन करें।'
            : mode === 'register'
            ? language === 'en'
              ? 'Start turning your ideas into viral video scripts and studio recordings.'
              : 'वायरल वीडियो और स्टूडियो प्रोजेक्ट्स तैयार करना शुरू करें।'
            : language === 'en'
            ? 'Enter your registered email address and we will send you a recovery link.'
            : 'अपना रजिस्टर्ड ईमेल दर्ज करें, हम पासवर्ड रिकवरी लिंक भेजेंगे।'}
        </p>
      </div>

      {/* Primary One-Click Google Auth */}
      {mode !== 'forgot_password' && (
        <div className="mb-5">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleSubmitting || isSubmitting}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl text-xs font-bold text-slate-700 shadow-2xs hover:shadow-xs transition-all disabled:opacity-50"
          >
            {isGoogleSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
            <span>
              {isGoogleSubmitting
                ? language === 'en'
                  ? 'Connecting to Google...'
                  : 'Google से कनेक्ट हो रहा है...'
                : mode === 'register'
                ? language === 'en'
                  ? 'Sign up with Google (Instant)'
                  : 'Google से त्वरित साइन अप करें'
                : language === 'en'
                ? 'Continue with Google'
                : 'Google से जारी रखें'}
            </span>
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400">
              <span className="bg-white px-2.5">
                {language === 'en' ? 'Or use email & password' : 'या ईमेल और पासवर्ड का उपयोग करें'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Alert Messages */}
      {activeError && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-[11px] leading-relaxed">
            <p className="font-semibold">{activeError}</p>
          </div>
        </div>
      )}

      {/* Dedicated Success Screen for Password Reset Flow */}
      {mode === 'forgot_password' && successMessage ? (
        <div className="text-center py-4 space-y-4 animate-in fade-in">
          <div className="w-16 h-16 rounded-3xl mx-auto bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/80 shadow-xs">
            <Mail className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">
              {language === 'en' ? 'Password Reset Email Sent' : 'पासवर्ड रीसेट ईमेल भेजा गया'}
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 max-w-xs mx-auto leading-relaxed">
              {successMessage}
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-[11px] text-slate-600 text-left space-y-1">
            <p className="font-semibold text-slate-800">
              {language === 'en' ? 'Next steps:' : 'अगले कदम:'}
            </p>
            <ul className="list-disc list-inside space-y-0.5 text-slate-500">
              <li>{language === 'en' ? 'Click the link in the email from Firebase' : 'ईमेल में दिए गए सुरक्षित लिंक पर क्लिक करें'}</li>
              <li>{language === 'en' ? 'Enter and confirm your new password' : 'अपना नया पासवर्ड दर्ज करें'}</li>
              <li>{language === 'en' ? 'Log in with your updated credentials' : 'नए पासवर्ड के साथ लॉगिन करें'}</li>
            </ul>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleModeChange('login')}
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              {language === 'en' ? 'Return to Sign In' : 'साइन इन पर वापस जाएं'}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-2 px-4 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {isSubmitting
                ? language === 'en' ? 'Resending...' : 'पुनः भेजा जा रहा है...'
                : language === 'en' ? 'Did not receive it? Resend link' : 'ईमेल नहीं मिला? पुनः भेजें'}
            </button>
          </div>
        </div>
      ) : (
        /* Standard Form Fields */
        <form onSubmit={handleSubmit} className="space-y-3.5">
        {mode === 'register' && (
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              {language === 'en' ? 'Full Name' : 'पूरा नाम'}
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={language === 'en' ? 'e.g. Rituraj Tomar' : 'उदा. ऋतुराज तोमर'}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
            {language === 'en' ? 'Email Address' : 'ईमेल पता'}
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
            />
          </div>
        </div>

        {mode !== 'forgot_password' && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                {language === 'en' ? 'Password' : 'पासवर्ड'}
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => handleModeChange('forgot_password')}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  {language === 'en' ? 'Forgot password?' : 'पासवर्ड भूल गए?'}
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {mode === 'login' && (
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500"
              />
              <span>{language === 'en' ? 'Remember this device' : 'इस डिवाइस को याद रखें'}</span>
            </label>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || isGoogleSubmitting}
          className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
          <span>
            {isSubmitting
              ? language === 'en'
                ? 'Processing...'
                : 'प्रक्रिया जारी है...'
              : mode === 'login'
              ? language === 'en'
                ? 'Sign In to Scripter'
                : 'साइन इन करें'
              : mode === 'register'
              ? language === 'en'
                ? 'Create Scripter Account'
                : 'खाता बनाएं'
              : language === 'en'
              ? 'Send Reset Link'
              : 'रीसेट लिंक भेजें'}
          </span>
        </button>
      </form>
      )}

      {/* Switch Form Mode Footer */}
      <div className="mt-5 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
        {mode === 'login' ? (
          <p>
            {language === 'en' ? "Don't have an account yet?" : 'क्या आपके पास खाता नहीं है?'}{' '}
            <button
              type="button"
              onClick={() => handleModeChange('register')}
              className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
            >
              {language === 'en' ? 'Create an account' : 'नया खाता बनाएं'}
            </button>
          </p>
        ) : mode === 'register' ? (
          <p>
            {language === 'en' ? 'Already have an account?' : 'पहले से खाता है?'}{' '}
            <button
              type="button"
              onClick={() => handleModeChange('login')}
              className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
            >
              {language === 'en' ? 'Sign in' : 'साइन इन करें'}
            </button>
          </p>
        ) : (
          <button
            type="button"
            onClick={() => handleModeChange('login')}
            className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-slate-900"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Back to sign in' : 'साइन इन पर वापस जाएं'}</span>
          </button>
        )}
      </div>

      {/* Security Footnote */}
      <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Firebase Authentication & Cloud Security Active</span>
      </div>
    </div>
  );
};
