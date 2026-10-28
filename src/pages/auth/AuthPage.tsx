import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { AuthForm } from '../../components/auth/AuthForm';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, CheckCircle2, Video, Zap, Shield, Wand2 } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const { language } = useLanguage();

  const isRegister = location.pathname === '/register';

  // If already authenticated, redirect to User Home
  if (isAuthenticated && !loading) {
    return <Navigate to="/user/home" replace />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-12 bg-slate-50/60">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Value Proposition Showcase (Hidden on Mobile) */}
        <div className="hidden lg:block lg:col-span-6 space-y-6 pr-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 fill-blue-500" />
            <span>AI-Powered Viral Scriptwriting & Teleprompter</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Turn your ideas into ready-to-record video scripts in minutes.
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed">
            Scripter brings your entire content pipeline under one roof: from trend discovery and topic research to structured hooks, teleprompter recording, and social packs.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <Wand2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">High-Retention Script Generation</h4>
                <p className="text-[11px] text-slate-500">
                  Powered by Gemini 3.8 Flash with Hindi, Hinglish, and English multilingual support.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Studio Teleprompter & Recording</h4>
                <p className="text-[11px] text-slate-500">
                  Smooth auto-scroll, voice speed calibration, and camera mirror overlay.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Secure Firebase Cloud Storage</h4>
                <p className="text-[11px] text-slate-500">
                  Your business profiles, brand kits, and scripts safely synced to Cloud Firestore.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Instant Google Setup
            </span>
            <span>·</span>
            <span>Zero credit card required for Starter</span>
          </div>
        </div>

        {/* Right: AuthForm Container */}
        <div className="lg:col-span-6 w-full flex justify-center">
          <AuthForm initialMode={isRegister ? 'register' : 'login'} />
        </div>
      </div>
    </div>
  );
};
