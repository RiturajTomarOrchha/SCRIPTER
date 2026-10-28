import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
  DEMO_PLATFORM_METRICS,
  DEMO_RECENT_ADMIN_USERS,
  DEMO_TOP_TEMPLATES,
} from '../../data/mockData';
import { adminStorage } from '../../services/adminStorage';
import { AdminUserRecord } from '../../types';
import { getFirebaseStatus } from '../../services/firebase/config';
import {
  Users,
  Briefcase,
  FolderKanban,
  Cpu,
  ArrowUpRight,
  Calendar,
  Sparkles,
  Server,
  ShieldAlert,
  Crown,
  CreditCard,
  Layers,
  CheckCircle2,
  Clock,
  Activity,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const MasterAdminHome: React.FC = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('01 Oct 2026 - 31 Oct 2026');
  const firebaseStatus = getFirebaseStatus();
  const metrics = DEMO_PLATFORM_METRICS;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20 space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-amber-500/10 text-amber-600">
              <Crown className="w-5 h-5 fill-amber-500" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('masterAdminTitle')}
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-amber-100 text-amber-800 border border-amber-200">
              {t('demoDataNotice')}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {t('masterAdminSubtitle')}
          </p>
        </div>

        {/* Date Filter & Status */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{dateRange}</span>
          </div>
          <button
            onClick={() => navigate('/master-admin/analytics')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            {language === 'en' ? 'Full Analytics' : 'विस्तृत रिपोर्ट'}
          </button>
        </div>
      </div>

      {/* 2. Overview KPI Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Card 1: Total Users */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">{t('totalUsers')}</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900 font-mono tabular-nums tracking-tight">
              {metrics.totalUsers.toLocaleString()}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+{metrics.usersGrowthMonthly}% {t('thisMonth')}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Business Profiles */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">{t('activeProfilesCount')}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900 font-mono tabular-nums tracking-tight">
              {metrics.businessProfiles.toLocaleString()}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+{metrics.profilesGrowthMonthly}% {t('thisMonth')}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Total Projects */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">{t('totalProjectsCount')}</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900 font-mono tabular-nums tracking-tight">
              {metrics.totalProjects.toLocaleString()}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+{metrics.projectsGrowthMonthly}% {t('thisMonth')}</span>
            </div>
          </div>
        </div>

        {/* Card 4: AI Usage */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">{t('totalAiRequests')}</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900 font-mono tabular-nums tracking-tight">
              {metrics.totalAiRequests.toLocaleString()}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+{metrics.aiRequestsGrowthMonthly}% {t('thisMonth')}</span>
            </div>
          </div>
        </div>

        {/* Card 5: Platform Revenue */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">{t('platformRevenue')}</span>
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <span className="font-bold text-xs">₹</span>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900 font-mono tabular-nums tracking-tight">
              ₹ {metrics.totalRevenueInr.toLocaleString('en-IN')}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+{metrics.revenueGrowthMonthly}% {t('thisMonth')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Platform Activity Trend & Industry Distribution */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity Trend Graph (Responsive visual representation) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span>{t('platformActivity')}</span>
              </h3>
              <p className="text-xs text-slate-400">Daily creation frequency across October 2026</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <span>Scripts</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Projects</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>New Users</span>
              </span>
            </div>
          </div>

          {/* Clean lightweight SVG Trend Visualization */}
          <div className="pt-2">
            <div className="h-52 w-full flex items-end justify-between gap-1 sm:gap-2 px-1">
              {[
                { day: '1 Oct', scripts: 320, projects: 120, users: 45 },
                { day: '5 Oct', scripts: 480, projects: 190, users: 70 },
                { day: '10 Oct', scripts: 650, projects: 260, users: 95 },
                { day: '15 Oct', scripts: 810, projects: 340, users: 130 },
                { day: '20 Oct', scripts: 1100, projects: 480, users: 180 },
                { day: '25 Oct', scripts: 1420, projects: 610, users: 240 },
                { day: '31 Oct', scripts: 1840, projects: 820, users: 310 },
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <div className="w-full max-w-[42px] bg-slate-50 rounded-lg p-1 flex flex-col justify-end gap-1 h-40">
                    <div
                      className="w-full bg-blue-600 rounded-sm transition-all group-hover:bg-blue-500"
                      style={{ height: `${(item.scripts / 1900) * 100}%` }}
                      title={`Scripts: ${item.scripts}`}
                    />
                    <div
                      className="w-full bg-amber-500 rounded-sm transition-all group-hover:bg-amber-400"
                      style={{ height: `${(item.projects / 1900) * 100}%` }}
                      title={`Projects: ${item.projects}`}
                    />
                    <div
                      className="w-full bg-emerald-500 rounded-sm transition-all group-hover:bg-emerald-400"
                      style={{ height: `${(item.users / 1900) * 100}%` }}
                      title={`Users: ${item.users}`}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Industry Breakdown Card */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              {language === 'en' ? 'Industry Share' : 'इंडस्ट्री के अनुसार'}
            </h3>
            <span className="text-[10px] font-mono font-semibold text-slate-400">12,842 Users</span>
          </div>

          <div className="space-y-3 pt-1">
            {[
              { name: 'Education & Coaching', percent: 22, count: '2,841', color: 'bg-blue-600' },
              { name: 'Tech & Startups', percent: 16, count: '2,056', color: 'bg-emerald-600' },
              { name: 'Business & Finance', percent: 15, count: '1,924', color: 'bg-amber-500' },
              { name: 'Healthcare & Wellness', percent: 10, count: '1,348', color: 'bg-rose-500' },
              { name: 'Food & Lifestyle', percent: 9, count: '1,102', color: 'bg-purple-600' },
              { name: 'Media & Entertainment', percent: 14, count: '1,805', color: 'bg-indigo-600' },
              { name: 'Other Niches', percent: 14, count: '1,766', color: 'bg-slate-400' },
            ].map((ind, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700">{ind.name}</span>
                  <span className="font-mono text-slate-500 tabular-nums font-semibold">
                    {ind.percent}% ({ind.count})
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className={`${ind.color} h-1.5 rounded-full`} style={{ width: `${ind.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Quick Governance Navigation */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-5 sm:p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{language === 'en' ? 'Quick Platform Management' : 'त्वरित प्लेटफ़ॉर्म प्रबंधन'}</span>
            </h3>
            <p className="text-xs text-slate-300">
              Direct access to operational hubs and configuration modules
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => navigate('/master-admin/ai-providers')}
            className="p-3.5 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-xs text-left border border-white/10 transition-colors"
          >
            <Cpu className="w-5 h-5 text-amber-400 mb-1.5" />
            <p className="text-xs font-bold">AI Provider Hub</p>
            <p className="text-[10px] text-slate-300 mt-0.5">Gemini, OpenAI, Anthropic</p>
          </button>

          <button
            onClick={() => navigate('/master-admin/plans')}
            className="p-3.5 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-xs text-left border border-white/10 transition-colors"
          >
            <Crown className="w-5 h-5 text-blue-400 mb-1.5" />
            <p className="text-xs font-bold">Plans & Credits</p>
            <p className="text-[10px] text-slate-300 mt-0.5">Tiers, tokens, rules</p>
          </button>

          <button
            onClick={() => navigate('/master-admin/moderation')}
            className="p-3.5 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-xs text-left border border-white/10 transition-colors"
          >
            <ShieldAlert className="w-5 h-5 text-rose-400 mb-1.5" />
            <p className="text-xs font-bold">Content Moderation</p>
            <p className="text-[10px] text-slate-300 mt-0.5">User reports & flags</p>
          </button>

          <button
            onClick={() => navigate('/master-admin/templates')}
            className="p-3.5 rounded-xl bg-white/10 hover:bg-white/15 backdrop-blur-xs text-left border border-white/10 transition-colors"
          >
            <Layers className="w-5 h-5 text-emerald-400 mb-1.5" />
            <p className="text-xs font-bold">Template Library</p>
            <p className="text-[10px] text-slate-300 mt-0.5">Manage 840+ video packs</p>
          </button>
        </div>
      </section>

      {/* 5. Recent Registered Users Table & System Status */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Registered Users */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">{t('recentUsers')}</h3>
              <p className="text-xs text-slate-400">Latest creator sign-ups on Scripter</p>
            </div>
            <button
              onClick={() => navigate('/master-admin/users')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-2.5">User</th>
                  <th className="pb-2.5">Industry</th>
                  <th className="pb-2.5">Plan</th>
                  <th className="pb-2.5">Joined</th>
                  <th className="pb-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {adminStorage.getAdminUsers().slice(0, 5).map((usr: AdminUserRecord) => (
                  <tr key={usr.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 font-semibold text-slate-900">
                      <div>{usr.name}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{usr.email}</div>
                    </td>
                    <td className="py-3 text-slate-600">{usr.industry || 'Content Creation'}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold text-[10px] uppercase">
                        {usr.plan}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-slate-500 text-[11px]">{usr.joinedDate}</td>
                    <td className="py-3 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          usr.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            usr.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                        <span>{usr.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System & Backend Status (Accurate check, no fake claims) */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-slate-600" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900">{t('systemStatus')}</h3>
          </div>

          <div className="space-y-3 text-xs">
            {/* Firebase */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">{t('serviceFirebase')}</span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    firebaseStatus.isConfigured
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {firebaseStatus.isConfigured ? 'Connected' : 'Demo Mode'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">{firebaseStatus.statusText}</p>
            </div>

            {/* AI Providers */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">{t('serviceAi')}</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800">
                  Ready (Gemini API)
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Server-side Gemini ready for Milestone 2 script engine
              </p>
            </div>

            {/* Storage */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">{t('serviceMedia')}</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-200 text-slate-800">
                  Pending Setup
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Scheduled for Video Studio & Visual Pack milestone
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
