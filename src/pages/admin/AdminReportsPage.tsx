import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  FileText,
  Video,
  Sparkles,
  Layers,
  ArrowUpRight,
  Filter,
  CheckCircle2,
} from 'lucide-react';

interface AdminReportsPageProps {
  isMasterAdmin?: boolean;
}

export const AdminReportsPage: React.FC<AdminReportsPageProps> = ({ isMasterAdmin = false }) => {
  const { language } = useLanguage();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Metric,October 2026,September 2026,Growth\n' +
      'Scripts Generated,48210,39450,+22.2%\n' +
      'Teleprompter Sessions,14320,11900,+20.3%\n' +
      'Video Renders Completed,9840,7810,+26.0%\n' +
      'Thumbnails Generated,18920,14200,+33.2%\n' +
      'Total AI Credits Consumed,412800,328400,+25.7%\n' +
      'Active Creators,12842,10920,+17.6%\n';

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `scripter_analytics_report_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Analytics CSV report exported successfully');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20 space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-blue-50 text-blue-600">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {language === 'en' ? 'Usage Analytics & Reports' : 'उपयोग विश्लेषण और रिपोर्ट'}
            </h1>
            <span
              className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-md ${
                isMasterAdmin ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
              }`}
            >
              {isMasterAdmin ? 'Executive Intelligence' : 'Operational Reports'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'en'
              ? 'Platform generation velocity, AI token consumption, and feature engagement metrics.'
              : 'कंटेंट निर्माण गति, एआई टोकन खपत और फीचर उपयोग के आंकड़े।'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl text-xs font-semibold text-slate-600">
            {(['7d', '30d', '90d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  timeRange === r ? 'bg-slate-900 text-white shadow-2xs' : 'hover:bg-slate-100'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Scripts Created</span>
          <p className="text-2xl font-black text-slate-900 font-mono mt-1">48,210</p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+22.2% vs last period</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Teleprompter Recs</span>
          <p className="text-2xl font-black text-slate-900 font-mono mt-1">14,320</p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+20.3% vs last period</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Video Studio Exports</span>
          <p className="text-2xl font-black text-slate-900 font-mono mt-1">9,840</p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+26.0% vs last period</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Credits Consumed</span>
          <p className="text-2xl font-black text-blue-600 font-mono mt-1">4,12,800</p>
          <span className="text-[11px] text-slate-400 font-mono">₹2.06L API equiv</span>
        </div>
      </div>

      {/* Feature Consumption & Top Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Feature Token Share */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">AI Credit Consumption by Tool</h3>

          <div className="space-y-3 pt-1">
            {[
              { name: 'Script Studio (Hooks & Long-form)', percent: 45, credits: '185,760', color: 'bg-blue-600' },
              { name: 'Video Captions & Teleprompter Sync', percent: 25, credits: '103,200', color: 'bg-emerald-600' },
              { name: 'Thumbnail Studio (Imagen 3)', percent: 20, credits: '82,560', color: 'bg-amber-500' },
              { name: 'AI Voiceovers (ElevenLabs)', percent: 10, credits: '41,280', color: 'bg-purple-600' },
            ].map((tool, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700">{tool.name}</span>
                  <span className="font-mono text-slate-500 font-semibold">
                    {tool.percent}% ({tool.credits} cr)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className={`${tool.color} h-2 rounded-full`} style={{ width: `${tool.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Templates Leaderboard */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Most Utilized Templates</h3>

          <div className="space-y-2 text-xs">
            {[
              { title: 'EdTech 60-Second Concept Explainer', uses: 2480, format: 'Reel / 9:16' },
              { title: 'Tech Review & Comparison Breakdown', uses: 1940, format: 'Landscape / 16:9' },
              { title: 'SaaS Product Feature Showcase', uses: 1620, format: 'Square / 1:1' },
              { title: 'Finance Rule of 72 Viral Hook', uses: 1410, format: 'Reel / 9:16' },
              { title: 'Medical Mythbusters Daily Series', uses: 1190, format: 'Reel / 9:16' },
            ].map((tmpl, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 flex items-center justify-between border border-slate-100"
              >
                <div>
                  <h4 className="font-semibold text-slate-900">{tmpl.title}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">{tmpl.format}</span>
                </div>
                <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md text-[11px]">
                  {tmpl.uses.toLocaleString()} creates
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
