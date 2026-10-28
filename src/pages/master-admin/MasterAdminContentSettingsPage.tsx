import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { adminStorage } from '../../services/adminStorage';
import {
  Sliders,
  Sparkles,
  Save,
  CheckCircle2,
  FileText,
  Search,
  Globe,
  Radio,
  BookOpen,
  Layers,
} from 'lucide-react';

export const MasterAdminContentSettingsPage: React.FC = () => {
  const { language } = useLanguage();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Content generation prompt templates
  const [reelSystemPrompt, setReelSystemPrompt] = useState(
    'You are the expert viral scriptwriter for Scripter. Always produce high-energy 60-second vertical video scripts with a 3-second psychological hook, clear visual cues, and a high-converting CTA. Format in Hindi-English mixed hinglish or pure english depending on creator preference.'
  );

  const [longFormSystemPrompt, setLongFormSystemPrompt] = useState(
    'You are a master educational and documentary script architect. Craft structured, narrative-driven 8-12 minute video outlines with act breaks, b-roll recommendations, and retention checkpoints every 45 seconds.'
  );

  const [researchSources, setResearchSources] = useState([
    { name: 'Google Trends (India & Global)', enabled: true },
    { name: 'YouTube Trending API (Viral Feeds)', enabled: true },
    { name: 'Reddit Top Discussions (Niche Subreddits)', enabled: true },
    { name: 'NewsAPI (Business & Tech Headlines)', enabled: true },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleSource = (idx: number) => {
    setResearchSources((prev) =>
      prev.map((src, i) => (i === idx ? { ...src, enabled: !src.enabled } : src))
    );
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    adminStorage.addAuditLog({
      actorName: 'Master Admin',
      actorRole: 'master-admin',
      action: 'UPDATE_CONTENT_SETTINGS',
      target: 'AI Prompts & Research Crawlers',
      details: 'Updated global script prompt guidelines and active research feed sources',
      status: 'SUCCESS',
      severity: 'info',
    });
    showToast('Content and Research AI guidelines saved.');
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
            <span className="p-1 rounded-md bg-purple-50 text-purple-600">
              <Sliders className="w-5 h-5 text-purple-600" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {language === 'en' ? 'Content & Research Settings' : 'कंटेंट और रिसर्च सेटिंग्स'}
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-amber-100 text-amber-800 border border-amber-200">
              AI Engine Tuning
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'en'
              ? 'Configure default system prompts, viral hooks formulas, and trend crawling sources.'
              : 'डिफ़ॉल्ट सिस्टम प्रॉम्प्ट्स, वायरल हुक फॉर्मूले और रिसर्च स्रोतों को कॉन्फ़िगर करें।'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveSettings}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* System Prompt Directives */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Foundation System Directives for Script Generation</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Short-Form (Reels / Shorts / TikTok) Master Directive
              </label>
              <textarea
                rows={3}
                value={reelSystemPrompt}
                onChange={(e) => setReelSystemPrompt(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs focus:ring-2 focus:ring-blue-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Long-Form (YouTube / Course / Explainer) Master Directive
              </label>
              <textarea
                rows={3}
                value={longFormSystemPrompt}
                onChange={(e) => setLongFormSystemPrompt(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs focus:ring-2 focus:ring-blue-500 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Ideas & Research Feeds */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600" />
            <span>Active Idea Discovery & Trend Crawling Feeds</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {researchSources.map((source, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50 flex items-center justify-between"
              >
                <div>
                  <span className="font-semibold text-slate-900 block">{source.name}</span>
                  <span className="text-[10px] text-slate-400">Refreshed every 15 minutes</span>
                </div>
                <input
                  type="checkbox"
                  checked={source.enabled}
                  onChange={() => handleToggleSource(idx)}
                  className="w-4 h-4 text-blue-600 rounded-sm cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
