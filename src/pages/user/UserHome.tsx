import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
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
import { ProductivityTrendsSection } from '../../components/analytics/ProductivityTrendsSection';

export const UserHome: React.FC = () => {
  const { activeBusinessProfile, setActiveBusinessProfile, businessProfiles, creditsTotal, creditsUsed, userProfile } = useRole();
  const { userProfile: authProfile } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [projects, setProjects] = useState<Project[]>(() => getProjects().slice(0, 4));

  useEffect(() => {
    setProjects(getProjects().slice(0, 4));
  }, []);

  const creditsPercent = Math.min(100, Math.round((creditsUsed / creditsTotal) * 100));

  const displayName = authProfile?.displayName || userProfile?.name || 'Content Creator';
  const initials = displayName.split(' ').filter(Boolean).map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'SC';

  // Get suggested topics filtered by active business profile
  const allIdeas = getAllIdeas();
  const suggestedIdeas = allIdeas.filter(
    (i) => i.businessProfileId === activeBusinessProfile.id || i.industry === activeBusinessProfile.industry
  );
  const displayedIdeas = suggestedIdeas.length > 0 ? suggestedIdeas : allIdeas.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-32 md:pb-12 space-y-6">
      {/* 1. Welcome & Business Profile Switcher Card */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {authProfile?.photoURL ? (
              <img
                src={authProfile.photoURL}
                alt={displayName}
                className="w-13 h-13 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-700 shadow-md shadow-blue-500/10 shrink-0"
              />
            ) : (
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 text-white flex items-center justify-center font-bold text-base shadow-md shadow-blue-500/20 shrink-0">
                {initials}
              </div>
            )}
            <div>
              <p className="text-xs text-slate-400 font-medium">{language === 'en' ? 'Welcome Back,' : 'नमस्ते,'}</p>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {displayName}
                </h1>
                <span className="text-lg">👑</span>
              </div>
              {/* Profile Pill Trigger */}
              <button
                onClick={() => setShowProfileModal(true)}
                className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
              >
                <Briefcase className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="truncate max-w-[190px] sm:max-w-xs">{activeBusinessProfile.name}</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Quick Create Action Button on Desktop */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => navigate('/user/script-studio')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{language === 'en' ? 'Create New Script' : 'नई स्क्रिप्ट बनाएं'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. AI Credits Capsule Card (Exact Design from Reference Showcase 2) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0B132B] via-[#121B35] to-[#1C2541] p-5 sm:p-6 text-white border border-amber-400/25 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 text-base">★</span>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
              AI Credits
            </span>
          </div>

          <Link
            to="/user/credits"
            className="px-3.5 py-1 rounded-full border border-amber-400/80 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 text-xs font-bold transition-colors"
          >
            {t('buyCredits')}
          </Link>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white tabular-nums tracking-tight">
              {creditsUsed}
            </span>
            <span className="text-slate-400 text-base font-semibold">/</span>
            <span className="text-slate-300 text-lg font-semibold tabular-nums">
              {creditsTotal}
            </span>
            <span className="text-xs text-slate-400 font-medium ml-1">
              {language === 'en' ? 'credits used' : 'क्रेडिट प्रयुक्त'}
            </span>
          </div>

          {/* Progress Bar with Gold Glow */}
          <div className="w-full bg-slate-800/80 rounded-full h-3 overflow-hidden mt-2.5 p-0.5 border border-white/10">
            <div
              className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 h-full rounded-full transition-all duration-500 shadow-xs shadow-amber-400/50"
              style={{ width: `${creditsPercent}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2">
            <span>Next reset: Monthly Plan</span>
            <span className="font-bold text-amber-300">
              {creditsTotal - creditsUsed} {t('creditsLeft')}
            </span>
          </div>
        </div>
      </section>

      {/* 3. Create New Content Hub (2x2 Grid Matching Reference Poster) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>{language === 'en' ? 'Create New Content' : 'नया कंटेंट बनाएं'}</span>
          </h2>
          <Link
            to="/user/script-studio"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* 1. New Script */}
          <button
            onClick={() => navigate('/user/script-studio')}
            className="p-3.5 sm:p-4 rounded-3xl bg-amber-50/70 dark:bg-amber-950/30 hover:bg-amber-100/70 dark:hover:bg-amber-950/50 border border-amber-200/80 dark:border-amber-800/40 text-left transition-all group flex flex-col justify-between min-h-[96px] sm:min-h-[110px]"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <FileText className="w-4 h-4 fill-white" />
              </div>
              <ChevronRight className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-2">
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {language === 'en' ? 'New Script' : 'नया स्क्रिप्ट'}
              </p>
              <p className="text-[10px] sm:text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                {language === 'en' ? 'Write with AI' : 'नया स्क्रिप्ट लिखें'}
              </p>
            </div>
          </button>

          {/* 2. Explore Ideas */}
          <button
            onClick={() => navigate('/user/ideas')}
            className="p-3.5 sm:p-4 rounded-3xl bg-blue-50/70 dark:bg-blue-950/30 hover:bg-blue-100/70 dark:hover:bg-blue-950/50 border border-blue-200/80 dark:border-blue-800/40 text-left transition-all group flex flex-col justify-between min-h-[96px] sm:min-h-[110px]"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Lightbulb className="w-4 h-4" />
              </div>
              <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-2">
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {language === 'en' ? 'Explore Ideas' : 'आइडिया खोजें'}
              </p>
              <p className="text-[10px] sm:text-[11px] text-blue-800 dark:text-blue-300 font-medium">
                {language === 'en' ? 'Get fresh ideas' : 'नए आइडिया पाएं'}
              </p>
            </div>
          </button>

          {/* 3. Visual Pack */}
          <button
            onClick={() => navigate('/user/templates')}
            className="p-3.5 sm:p-4 rounded-3xl bg-rose-50/70 dark:bg-rose-950/30 hover:bg-rose-100/70 dark:hover:bg-rose-950/50 border border-rose-200/80 dark:border-rose-800/40 text-left transition-all group flex flex-col justify-between min-h-[96px] sm:min-h-[110px]"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                <Palette className="w-4 h-4" />
              </div>
              <ChevronRight className="w-4 h-4 text-rose-600 dark:text-rose-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-2">
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {language === 'en' ? 'Visual Pack' : 'विजुअल पैक'}
              </p>
              <p className="text-[10px] sm:text-[11px] text-rose-800 dark:text-rose-300 font-medium">
                {language === 'en' ? 'Find visuals & B-roll' : 'विजुअल चुनें'}
              </p>
            </div>
          </button>

          {/* 4. Production (Teleprompter & Video) */}
          <button
            onClick={() => navigate('/user/teleprompter')}
            className="p-3.5 sm:p-4 rounded-3xl bg-emerald-50/70 dark:bg-emerald-950/30 hover:bg-emerald-100/70 dark:hover:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/40 text-left transition-all group flex flex-col justify-between min-h-[96px] sm:min-h-[110px]"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Video className="w-4 h-4" />
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="mt-2">
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {language === 'en' ? 'Production' : 'प्रोडक्शन'}
              </p>
              <p className="text-[10px] sm:text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
                {language === 'en' ? 'Teleprompter & Video' : 'वीडियो बनाएं'}
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* 3. 30-Day Productivity Trends & Recharts Analytics Summary */}
      <ProductivityTrendsSection projects={projects} />

      {/* 4. Tailored Recommendations for Active Profile (Poster 3 Screen 5) */}
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
              status: 'Teleprompter & Record',
              path: '/user/teleprompter',
            },
            {
              step: '05',
              name: t('stepProduce'),
              icon: Film,
              color: 'text-purple-500',
              bg: 'bg-purple-50',
              border: 'border-purple-200',
              status: 'Video Studio & Export',
              path: '/user/video-studio',
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
