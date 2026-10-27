import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
  Users,
  Briefcase,
  ShieldAlert,
  MessageSquare,
  LifeBuoy,
  BarChart3,
  CheckCircle2,
  Clock,
  ArrowRight,
  Shield,
  Layers,
  Building2,
} from 'lucide-react';

export const AdminHome: React.FC = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-20 space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-blue-50 text-blue-600">
              <Shield className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {t('adminDashboardTitle')}
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-blue-100 text-blue-800">
              Operations
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {t('adminDashboardSubtitle')}
          </p>
        </div>
      </div>

      {/* 2. Operational Queue Cards */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Creators</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono mt-2">1,248</p>
          <span className="text-[11px] text-emerald-600 font-medium">98.2% healthy</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pending Reports</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono mt-2">6</p>
          <span className="text-[11px] text-rose-600 font-medium">Requires review</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Open Tickets</span>
            <LifeBuoy className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono mt-2">14</p>
          <span className="text-[11px] text-amber-600 font-medium">Avg response 22m</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">New Feedback</span>
            <MessageSquare className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono mt-2">28</p>
          <span className="text-[11px] text-purple-600 font-medium">This week</span>
        </div>
      </section>

      {/* 3. Operational Workspaces Grid */}
      <section className="space-y-3">
        <h3 className="text-base font-bold text-slate-900">
          {language === 'en' ? 'Administrative Workspaces' : 'प्रशासनिक कार्यक्षेत्र'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onClick={() => navigate('/admin/users')}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400 cursor-pointer transition-all shadow-xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">{t('navUserManagement')}</h4>
            <p className="text-xs text-slate-500 mt-1">
              Search, inspect, and assist active content creators and accounts.
            </p>
            <span className="mt-3 text-xs font-semibold text-blue-600 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Open Users <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div
            onClick={() => navigate('/admin/moderation')}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-rose-400 cursor-pointer transition-all shadow-xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">{t('navModeration')}</h4>
            <p className="text-xs text-slate-500 mt-1">
              Review flagged content, automated safety alerts, and community reports.
            </p>
            <span className="mt-3 text-xs font-semibold text-rose-600 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Review Queue <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div
            onClick={() => navigate('/admin/tickets')}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-400 cursor-pointer transition-all shadow-xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">{t('navTickets')}</h4>
            <p className="text-xs text-slate-500 mt-1">
              Respond to creator inquiries, billing issues, and technical tickets.
            </p>
            <span className="mt-3 text-xs font-semibold text-amber-600 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Manage Tickets <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div
            onClick={() => navigate('/admin/business-profiles')}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-400 cursor-pointer transition-all shadow-xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">{t('navBusinessProfiles')}</h4>
            <p className="text-xs text-slate-500 mt-1">
              Review registered business profiles and brand assets across industries.
            </p>
            <span className="mt-3 text-xs font-semibold text-indigo-600 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Inspect Profiles <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div
            onClick={() => navigate('/admin/templates')}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-400 cursor-pointer transition-all shadow-xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">{t('navTemplates')}</h4>
            <p className="text-xs text-slate-500 mt-1">
              Inspect template library quality, category alignments, and performance.
            </p>
            <span className="mt-3 text-xs font-semibold text-emerald-600 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              View Templates <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div
            onClick={() => navigate('/admin/reports')}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-400 cursor-pointer transition-all shadow-xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">{t('navAnalytics')}</h4>
            <p className="text-xs text-slate-500 mt-1">
              Operational usage reports and daily platform health summaries.
            </p>
            <span className="mt-3 text-xs font-semibold text-slate-700 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              View Reports <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
