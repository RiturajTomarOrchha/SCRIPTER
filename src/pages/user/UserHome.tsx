import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import { useLanguage } from '../../context/LanguageContext';
import { DEMO_PROJECTS } from '../../data/mockData';
import { Project } from '../../types';
import {
  Sparkles,
  ChevronRight,
  Plus,
  Lightbulb,
  FileText,
  Video,
  Layers,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  Briefcase,
  ExternalLink,
  SlidersHorizontal,
} from 'lucide-react';

export const UserHome: React.FC = () => {
  const { activeBusinessProfile, setActiveBusinessProfile, businessProfiles, creditsTotal, creditsUsed } = useRole();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [projects] = useState<Project[]>(DEMO_PROJECTS);

  const creditsPercent = Math.min(100, Math.round((creditsUsed / creditsTotal) * 100));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      {/* 1. Welcome & Business Profile Switcher Bar */}
      <section className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-md shadow-blue-500/20 shrink-0">
              RT
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  {t('welcomeGreeting')} <span className="text-blue-600">Rituraj Tomar</span>
                </h1>
                <span className="text-lg">👋</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                {language === 'en'
                  ? "Let's turn your ideas into high-impact scripts & videos."
                  : 'आइए आपके विचारों को प्रभावी स्क्रिप्ट और वीडियो में बदलें।'}
              </p>
            </div>
          </div>

          {/* Active Business Profile Pill with Quick Switcher Trigger */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setShowProfileModal(true)}
              className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/90 text-left transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                  {t('activeProfile')}
                </p>
                <p className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <span>{activeBusinessProfile.name}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* AI Credits Tracker */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-amber-100 text-amber-700">
                <Sparkles className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
              </span>
              <span className="font-semibold text-slate-700">{t('aiCredits')}</span>
              <span className="font-mono text-slate-500 tabular-nums">
                <strong className="text-slate-900">{creditsUsed}</strong> / {creditsTotal} {t('creditsUsed')}
              </span>
            </div>
            <Link
              to="/user/credits"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>{t('buyCredits')}</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Progress Meter */}
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-400 to-amber-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${creditsPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
            <span>{creditsTotal - creditsUsed} {t('creditsLeft')} in current cycle</span>
            <span className="font-mono">{creditsPercent}%</span>
          </div>
        </div>
      </section>

      {/* 2. Primary Actions / Create Hub */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Prominent Action: Discover Ideas */}
        <div className="md:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B132B] via-[#1C2541] to-[#2563EB] p-6 text-white shadow-md">
          <div className="relative z-10 max-w-md space-y-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-xs text-[11px] font-medium text-amber-300 border border-white/15">
              <Sparkles className="w-3 h-3" />
              <span>{language === 'en' ? 'Start Your Next Creation' : 'नई शुरुआत करें'}</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {language === 'en' ? 'Discover High-Converting Content Topics' : 'उच्च प्रभाव वाले ट्रेंडिंग विषय खोजें'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {language === 'en'
                ? `Get industry-tailored video ideas, researched outlines, and viral hooks for ${activeBusinessProfile.name}.`
                : `${activeBusinessProfile.name} के लिए शोधित रूपरेखा और वीडियो आइडिया प्राप्त करें।`}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate('/user/ideas')}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
              >
                <Lightbulb className="w-4 h-4 fill-slate-950" />
                <span>{language === 'en' ? 'Discover Ideas' : 'आइडिया खोजें'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => navigate('/user/script-studio')}
                className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold backdrop-blur-xs border border-white/20 flex items-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>{language === 'en' ? 'Write a Script' : 'स्क्रिप्ट लिखें'}</span>
              </button>
            </div>
          </div>
          {/* Subtle background decoration */}
          <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-60 h-60 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Quick Launch Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {language === 'en' ? 'Quick Tools' : 'त्वरित टूल्स'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold">
                Milestone 1
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-2">
              {language === 'en' ? 'Production Suite' : 'प्रोडक्शन सुइट'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'en'
                ? 'Teleprompter, visual library, and script studio.'
                : 'टेलीप्रॉम्प्टर, विज़ुअल लाइब्रेरी और स्टूडियो।'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => navigate('/user/teleprompter')}
              className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-left transition-colors border border-slate-100 flex flex-col gap-1.5"
            >
              <Video className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold">Teleprompter</span>
            </button>
            <button
              onClick={() => navigate('/user/templates')}
              className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-left transition-colors border border-slate-100 flex flex-col gap-1.5"
            >
              <Layers className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-semibold">Templates</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Content Journey Visual Roadmap */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">{t('contentJourneyTitle')}</h3>
            <p className="text-xs text-slate-500">{t('contentJourneySubtitle')}</p>
          </div>
          <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
            5-Stage Pipeline
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {[
            {
              step: '01',
              name: t('stepDiscover'),
              icon: Lightbulb,
              color: 'text-amber-500',
              bg: 'bg-amber-50',
              border: 'border-amber-200',
              status: 'Ready in M1',
              path: '/user/ideas',
            },
            {
              step: '02',
              name: t('stepResearch'),
              icon: Search,
              color: 'text-blue-500',
              bg: 'bg-blue-50',
              border: 'border-blue-200',
              status: 'Upcoming',
              path: '/user/research',
            },
            {
              step: '03',
              name: t('stepScript'),
              icon: FileText,
              color: 'text-indigo-500',
              bg: 'bg-indigo-50',
              border: 'border-indigo-200',
              status: 'Upcoming',
              path: '/user/script-studio',
            },
            {
              step: '04',
              name: t('stepRecord'),
              icon: Video,
              color: 'text-emerald-500',
              bg: 'bg-emerald-50',
              border: 'border-emerald-200',
              status: 'Upcoming',
              path: '/user/teleprompter',
            },
            {
              step: '05',
              name: t('stepProduce'),
              icon: Layers,
              color: 'text-purple-500',
              bg: 'bg-purple-50',
              border: 'border-purple-200',
              status: 'Upcoming',
              path: '/user/video-studio',
            },
          ].map((stage) => {
            const Icon = stage.icon;
            return (
              <button
                key={stage.step}
                onClick={() => navigate(stage.path)}
                className={`p-3.5 rounded-xl border text-left transition-all hover:shadow-xs group ${stage.border} ${stage.bg}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] font-bold text-slate-400">{stage.step}</span>
                  <Icon className={`w-4 h-4 ${stage.color} group-hover:scale-110 transition-transform`} />
                </div>
                <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {stage.name}
                </p>
                <span className="text-[10px] text-slate-500 mt-1 block font-medium">
                  {stage.status}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Quick Actions Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">{t('createContentHeading')}</h3>
          <span className="text-xs text-slate-400 font-medium">
            {language === 'en' ? 'Tailored to' : 'आधारित'} {activeBusinessProfile.name}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => navigate('/user/script-studio')}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400 text-left transition-all shadow-2xs hover:shadow-xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">{t('createNewScript')}</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">{t('createNewScriptDesc')}</p>
          </button>

          <button
            onClick={() => navigate('/user/ideas')}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-400 text-left transition-all shadow-2xs hover:shadow-xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">{t('exploreIdeas')}</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">{t('exploreIdeasDesc')}</p>
          </button>

          <button
            onClick={() => navigate('/user/templates')}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-pink-400 text-left transition-all shadow-2xs hover:shadow-xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">{t('visualPack')}</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">{t('visualPackDesc')}</p>
          </button>

          <button
            onClick={() => navigate('/user/teleprompter')}
            className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-400 text-left transition-all shadow-2xs hover:shadow-xs group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Video className="w-5 h-5" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">{t('production')}</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">{t('productionDesc')}</p>
          </button>
        </div>
      </section>

      {/* 5. Recent Projects */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">{t('recentProjects')}</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              Demo Data
            </span>
          </div>
          <Link
            to="/user/projects"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>{t('viewAllProjects')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-600">{t('noProjectsYet')}</p>
            <button
              onClick={() => navigate('/user/create')}
              className="mt-3 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
            >
              Start First Project
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {projects.map((proj) => {
              const statusStyles = {
                draft: 'bg-slate-100 text-slate-600',
                in_progress: 'bg-blue-50 text-blue-700 border border-blue-200/60',
                completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
                archived: 'bg-amber-50 text-amber-700',
              }[proj.status];

              return (
                <div
                  key={proj.id}
                  onClick={() => navigate('/user/projects')}
                  className="py-3 sm:py-4 flex items-center justify-between gap-3 hover:bg-slate-50/80 -mx-2 px-2 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 border border-slate-200/60">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                        {language === 'hi' && proj.titleHi ? proj.titleHi : proj.title}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span>{proj.category}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{proj.timeAgo}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${statusStyles}`}>
                      {proj.status.replace('_', ' ')}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Profile Switcher Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-base font-bold text-slate-900">{t('switchProfile')}</h4>
                <p className="text-xs text-slate-500">
                  {language === 'en'
                    ? 'Tailor content ideas and scripts to your business domain'
                    : 'अपने उद्योग के अनुसार कंटेंट सुझाव सेट करें'}
                </p>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-2 max-h-80 overflow-y-auto pr-1">
              {businessProfiles.map((prof) => {
                const isSelected = prof.id === activeBusinessProfile.id;
                return (
                  <button
                    key={prof.id}
                    onClick={() => {
                      setActiveBusinessProfile(prof);
                      setShowProfileModal(false);
                    }}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{prof.name}</p>
                        <p className="text-[11px] text-slate-500">{prof.category}</p>
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {businessProfiles.length} Profiles Available
              </span>
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
