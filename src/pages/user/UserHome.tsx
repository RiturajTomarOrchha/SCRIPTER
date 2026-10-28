import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import { useLanguage } from '../../context/LanguageContext';
import { getProjects, getAllIdeas } from '../../services/storage';
import { Project, ContentIdea, ProjectStatus } from '../../types';
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
  TrendingUp,
  FolderKanban,
  Film,
  Palette,
  LayoutTemplate,
  Image as ImageIcon,
} from 'lucide-react';

export const UserHome: React.FC = () => {
  const { activeBusinessProfile, setActiveBusinessProfile, businessProfiles, creditsTotal, creditsUsed } = useRole();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [projects, setProjects] = useState<Project[]>(() => getProjects().slice(0, 4));

  useEffect(() => {
    setProjects(getProjects().slice(0, 4));
  }, []);

  const creditsPercent = Math.min(100, Math.round((creditsUsed / creditsTotal) * 100));

  // Get suggested topics filtered by active business profile
  const allIdeas = getAllIdeas();
  const suggestedIdeas = allIdeas.filter(
    (i) => i.businessProfileId === activeBusinessProfile.id || i.industry === activeBusinessProfile.industry
  );
  const displayedIdeas = suggestedIdeas.length > 0 ? suggestedIdeas : allIdeas.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      {/* 1. Welcome & Business Profile Switcher Bar */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
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
                  ? `Transforming your ideas into high-impact scripts & viral content for ${activeBusinessProfile.name}.`
                  : `आइए ${activeBusinessProfile.name} के लिए आपके विचारों को प्रभावी स्क्रिप्ट और वीडियो में बदलें।`}
              </p>
            </div>
          </div>

          {/* Active Business Profile Pill with Quick Switcher Trigger */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setShowProfileModal(true)}
              className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/90 text-left transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
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
            <span>
              {creditsTotal - creditsUsed} {t('creditsLeft')} in current cycle
            </span>
            <span className="font-mono">{creditsPercent}%</span>
          </div>
        </div>
      </section>

      {/* 2. Primary Actions / Create Hub */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Prominent Action: Discover Ideas */}
        <div className="md:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B132B] via-[#1C2541] to-[#2563EB] p-6 text-white shadow-md">
          <div className="relative z-10 max-w-md space-y-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-xs text-[11px] font-medium text-amber-300 border border-white/15">
              <Sparkles className="w-3 h-3" />
              <span>{language === 'en' ? 'Phase 2 Operational Engine' : 'फेज़ 2 संपूर्ण समाधान'}</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {language === 'en'
                ? `Create High-Impact Content for ${activeBusinessProfile.name}`
                : `${activeBusinessProfile.name} के लिए उच्च प्रभाव वाला कंटेंट बनाएं`}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {language === 'en'
                ? `Explore researched outlines, write structured scripts in 30 seconds, and manage drafts in your library.`
                : 'शोधित विषय खोजें, AI से 30 सेकंड में संरचित स्क्रिप्ट बनाएं, और अपने प्रोजेक्ट्स में सुरक्षित करें।'}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate('/user/script-studio')}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
              >
                <FileText className="w-4 h-4 fill-slate-950" />
                <span>{language === 'en' ? 'Start Script Studio' : 'स्क्रिप्ट स्टूडियो शुरू करें'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => navigate('/user/ideas')}
                className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold backdrop-blur-xs border border-white/20 flex items-center gap-2 transition-colors"
              >
                <Lightbulb className="w-4 h-4" />
                <span>{language === 'en' ? 'Discover Ideas' : 'आइडिया खोजें'}</span>
              </button>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-60 h-60 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Quick Launch Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {language === 'en' ? 'Quick Tools' : 'त्वरित टूल्स'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold">
                Connected Flow
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-2">
              {language === 'en' ? 'Content Workflow' : 'कंटेंट वर्कफ़्लो'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'en'
                ? 'Jump straight into your projects or personalize business settings.'
                : 'अपने प्रोजेक्ट्स देखें या नई प्रोफाइल सेटिंग्स कॉन्फ़िगर करें।'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
            <button
              onClick={() => navigate('/user/projects')}
              className="p-2.5 rounded-2xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-left transition-colors border border-slate-100 flex flex-col gap-1"
            >
              <FolderKanban className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold">My Projects</span>
            </button>
            <button
              onClick={() => navigate('/user/video-studio')}
              className="p-2.5 rounded-2xl bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-800 text-left transition-colors border border-slate-100 flex flex-col gap-1"
            >
              <Film className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-semibold">Video Studio</span>
            </button>
            <button
              onClick={() => navigate('/user/templates')}
              className="p-2.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-left transition-colors border border-slate-100 flex flex-col gap-1"
            >
              <LayoutTemplate className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold">Templates</span>
            </button>
            <button
              onClick={() => navigate('/user/brand-kit')}
              className="p-2.5 rounded-2xl bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-left transition-colors border border-slate-100 flex flex-col gap-1"
            >
              <Palette className="w-4 h-4 text-rose-600" />
              <span className="text-xs font-semibold">Brand Kit</span>
            </button>
            <button
              onClick={() => navigate('/user/thumbnail-studio')}
              className="p-2.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-left transition-colors border border-slate-100 flex flex-col gap-1"
            >
              <ImageIcon className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-semibold">Thumbnails</span>
            </button>
            <button
              onClick={() => navigate('/user/teleprompter')}
              className="p-2.5 rounded-2xl bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 text-left transition-colors border border-slate-100 flex flex-col gap-1"
            >
              <Video className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-semibold">Teleprompter</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Tailored Recommendations for Active Profile (Poster 3 Screen 5) */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                <Sparkles className="w-4 h-4 fill-amber-500" />
              </span>
              <h3 className="text-base font-bold text-slate-900">
                {language === 'en'
                  ? `Recommended Topics for ${activeBusinessProfile.name}`
                  : `${activeBusinessProfile.name} के लिए सुझाए गए विषय`}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'en'
                ? `Curated based on ${activeBusinessProfile.industry} audience trends`
                : `आपके उद्योग (${activeBusinessProfile.industry}) के आधार पर तैयार`}
            </p>
          </div>
          <Link
            to="/user/ideas"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>{language === 'en' ? 'See All Ideas' : 'सभी देखें'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {displayedIdeas.map((idea) => (
            <div
              key={idea.id}
              onClick={() =>
                navigate('/user/script-studio', {
                  state: {
                    prefilledTopic: language === 'hi' ? idea.titleHi : idea.title,
                    industry: idea.industry,
                    category: idea.category,
                  },
                })
              }
              className="p-4 rounded-2xl bg-slate-50/70 hover:bg-blue-50/50 border border-slate-200/80 hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between group space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">
                    {idea.format}
                  </span>
                  {idea.isTrending && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700">
                      <TrendingUp className="w-3 h-3 text-amber-500" />
                      <span>Trending</span>
                    </span>
                  )}
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {language === 'hi' ? idea.titleHi : idea.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  {language === 'hi' ? idea.summaryHi : idea.summary}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-blue-600">
                <span>{language === 'en' ? 'Start Script' : 'स्क्रिप्ट बनाएं'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Content Journey Visual Roadmap */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">{t('contentJourneyTitle')}</h3>
            <p className="text-xs text-slate-500">{t('contentJourneySubtitle')}</p>
          </div>
          <span className="hidden sm:inline-block text-[11px] font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
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
              status: 'Live & Connected',
              path: '/user/ideas',
            },
            {
              step: '02',
              name: t('stepResearch'),
              icon: Search,
              color: 'text-blue-500',
              bg: 'bg-blue-50',
              border: 'border-blue-200',
              status: 'Live & Connected',
              path: '/user/ideas',
            },
            {
              step: '03',
              name: t('stepScript'),
              icon: FileText,
              color: 'text-indigo-500',
              bg: 'bg-indigo-50',
              border: 'border-indigo-200',
              status: 'Script Studio Active',
              path: '/user/script-studio',
            },
            {
              step: '04',
              name: t('stepRecord'),
              icon: Video,
              color: 'text-emerald-500',
              bg: 'bg-emerald-50',
              border: 'border-emerald-200',
              status: 'Teleprompter Mode',
              path: '/user/script-studio',
            },
            {
              step: '05',
              name: t('stepProduce'),
              icon: FolderKanban,
              color: 'text-purple-500',
              bg: 'bg-purple-50',
              border: 'border-purple-200',
              status: 'My Projects Ready',
              path: '/user/projects',
            },
          ].map((stage) => {
            const Icon = stage.icon;
            return (
              <button
                key={stage.step}
                onClick={() => navigate(stage.path)}
                className={`p-3.5 rounded-2xl border text-left transition-all hover:shadow-xs group ${stage.border} ${stage.bg}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] font-bold text-slate-400">{stage.step}</span>
                  <Icon className={`w-4 h-4 ${stage.color} group-hover:scale-110 transition-transform`} />
                </div>
                <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {stage.name}
                </p>
                <span className="text-[10px] text-slate-500 mt-1 block font-medium">{stage.status}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. Recent Projects */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">{t('recentProjects')}</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {projects.some((p) => !p.isDemo) ? 'Synced' : 'Demo Data'}
            </span>
          </div>
          <Link
            to="/user/projects"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>{t('viewAllProjects')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-600">{t('noProjectsYet')}</p>
            <button
              onClick={() => navigate('/user/script-studio')}
              className="mt-3 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
            >
              Start First Project
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {projects.map((proj) => {
              const statusStyles =
                ({
                  draft: 'bg-slate-100 text-slate-600',
                  in_progress: 'bg-blue-50 text-blue-700 border border-blue-200/60',
                  completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
                  archived: 'bg-amber-50 text-amber-700',
                } as Record<ProjectStatus, string>)[proj.status] || 'bg-slate-100 text-slate-600';

              return (
                <div
                  key={proj.id}
                  onClick={() => navigate('/user/projects')}
                  className="py-3 sm:py-4 flex items-center justify-between gap-3 hover:bg-slate-50/80 -mx-2 px-2 rounded-2xl transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
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

      {/* Profile Switcher Quick Modal */}
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
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  navigate('/user/business-profiles');
                }}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Manage All Profiles →
              </button>
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
