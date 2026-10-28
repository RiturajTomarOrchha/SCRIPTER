import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import { useLanguage } from '../../context/LanguageContext';
import { ContentIdea, TopicResearchContext } from '../../types';
import { DEMO_CONTENT_IDEAS } from '../../data/mockData';
import { isIdeaSaved, toggleSaveIdea } from '../../services/storage';
import { generateTopicResearchWithAi } from '../../services/aiService';
import {
  Lightbulb,
  Search,
  Bookmark,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  Clock,
  Filter,
  Layers,
  FileText,
  TrendingUp,
  X,
  Share2,
  Edit3,
  Landmark,
  Briefcase,
  GraduationCap,
  HeartPulse,
  Compass,
  Utensils,
  Palette,
  ChevronRight,
  BookOpen,
  Sun,
  Radio,
  Flame,
  CheckSquare,
  Square,
  Copy,
  Zap,
  Info,
  ShieldCheck,
  Tag,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';

export const IdeasPage: React.FC = () => {
  const { activeBusinessProfile, useCredits } = useRole();
  const { language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  // Route awareness: if opened via /user/research or has state ideaId
  const navState = (location.state as { ideaId?: string; topic?: string }) || {};
  const isResearchRoute = location.pathname.includes('/user/research');

  // Search & Filter State (Panel 1)
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState<'for_you' | 'trending' | 'latest' | 'my_industry' | 'saved'>('for_you');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // View state: 'list' (Panel 1) vs 'detail' (Panel 2 - Topic Details & Research)
  const [viewMode, setViewMode] = useState<'list' | 'detail'>(() => {
    return isResearchRoute || Boolean(navState.ideaId) ? 'detail' : 'list';
  });

  // Selected idea for Topic Details & Research (Panel 2)
  const [selectedIdea, setSelectedIdea] = useState<ContentIdea>(() => {
    if (navState.ideaId) {
      const match = DEMO_CONTENT_IDEAS.find((i) => i.id === navState.ideaId);
      if (match) return match;
    }
    // Default to solar or first trending idea for rich research display
    return DEMO_CONTENT_IDEAS.find((i) => i.id === 'idea_solar_01') || DEMO_CONTENT_IDEAS[0];
  });

  // Panel 2 Detail Tabs: शोध सारांश | मुख्य बिंदु | स्रोत | एंगल / हुक | स्क्रिप्ट सुझाव
  const [activeDetailTab, setActiveDetailTab] = useState<'summary' | 'key_points' | 'sources' | 'hooks' | 'outline'>('summary');
  const [selectedHookIndex, setSelectedHookIndex] = useState<number>(0);
  const [selectedKeyPoints, setSelectedKeyPoints] = useState<string[]>([]);

  // Saved bookmarks persistence
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    return DEMO_CONTENT_IDEAS.filter((i) => isIdeaSaved(i.id)).map((i) => i.id);
  });

  // Custom AI Research generation state
  const [isResearchingCustom, setIsResearchingCustom] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync selected key points when selectedIdea changes
  useEffect(() => {
    if (selectedIdea) {
      const points = language === 'hi'
        ? (selectedIdea.keyPointsHi || selectedIdea.outlineHi)
        : (selectedIdea.keyPoints || selectedIdea.outline);
      setSelectedKeyPoints(points || []);
      setSelectedHookIndex(0);
    }
  }, [selectedIdea, language]);

  // Toast auto-clear
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Categories matching reference infographics
  const categories = [
    { id: 'all', labelEn: 'All', labelHi: 'सभी', icon: Sparkles, color: 'text-blue-600 bg-blue-50' },
    { id: 'trending', labelEn: 'Trending', labelHi: 'ट्रेंडिंग', icon: Flame, color: 'text-rose-600 bg-rose-50' },
    { id: 'बिजनेस', labelEn: 'Business', labelHi: 'बिजनेस', icon: Briefcase, color: 'text-amber-600 bg-amber-50' },
    { id: 'स्वास्थ्य', labelEn: 'Health', labelHi: 'स्वास्थ्य', icon: HeartPulse, color: 'text-emerald-600 bg-emerald-50' },
    { id: 'शिक्षा', labelEn: 'Education', labelHi: 'शिक्षा', icon: GraduationCap, color: 'text-indigo-600 bg-indigo-50' },
    { id: 'यात्रा', labelEn: 'Travel', labelHi: 'यात्रा', icon: Compass, color: 'text-sky-600 bg-sky-50' },
    { id: 'कृषि / सौर', labelEn: 'Agri & Solar', labelHi: 'कृषि / सौर', icon: Sun, color: 'text-yellow-600 bg-yellow-50' },
    { id: 'टेक्नोलॉजी', labelEn: 'Technology', labelHi: 'टेक्नोलॉजी', icon: Radio, color: 'text-cyan-600 bg-cyan-50' },
    { id: 'राजनीति', labelEn: 'Politics', labelHi: 'राजनीति', icon: Landmark, color: 'text-orange-600 bg-orange-50' },
  ];

  const handleToggleSave = (ideaId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isNowSaved = toggleSaveIdea(ideaId);
    setSavedIds((prev) => (isNowSaved ? [...prev, ideaId] : prev.filter((id) => id !== ideaId)));
    setToastMessage(isNowSaved ? (language === 'en' ? 'Idea saved to bookmarks' : 'आइडिया सेव किया गया') : (language === 'en' ? 'Idea removed from bookmarks' : 'आइडिया सेव से हटाया गया'));
  };

  const handleShare = (idea: ContentIdea, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const url = window.location.origin + `/user/ideas`;
    navigator.clipboard?.writeText(`${language === 'hi' ? idea.titleHi : idea.title} — Scripter AI: ${url}`);
    setToastMessage(language === 'en' ? 'Link copied to clipboard!' : 'लिंक कॉपी हो गया!');
  };

  // Open Topic Details & Research (Panel 2)
  const handleOpenResearch = (idea: ContentIdea) => {
    setSelectedIdea(idea);
    setActiveDetailTab('summary');
    setViewMode('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Direct Handoff to Script Studio (Carrying full Research Context)
  const handleStartScriptWithResearch = (idea: ContentIdea) => {
    const topicText = language === 'hi' ? idea.titleHi : idea.title;
    const selectedHook = idea.suggestedHooks && idea.suggestedHooks[selectedHookIndex]
      ? (language === 'hi' ? idea.suggestedHooks[selectedHookIndex].hookHi : idea.suggestedHooks[selectedHookIndex].hook)
      : undefined;

    const researchContext: TopicResearchContext = {
      summary: idea.summary,
      summaryHi: idea.summaryHi,
      keyPoints: idea.keyPoints || idea.outline,
      keyPointsHi: idea.keyPointsHi || idea.outlineHi,
      sources: idea.sources || [],
      suggestedHooks: idea.suggestedHooks,
      suggestedAngles: idea.suggestedAngles,
      selectedHook: selectedHook,
      relevance: idea.relevanceLabel || idea.relevance,
      tags: idea.tags,
      viewCount: idea.viewCount,
    };

    navigate('/user/script-studio', {
      state: {
        prefilledTopic: topicText,
        ideaId: idea.id,
        category: idea.category,
        industry: idea.industry,
        outline: language === 'hi' ? idea.outlineHi : idea.outline,
        researchContext: researchContext,
        initialHook: selectedHook,
      },
    });
  };

  // Generate In-Depth AI Research for any custom searched topic
  const handleGenerateCustomResearch = async () => {
    if (!searchQuery.trim()) return;
    setIsResearchingCustom(true);

    try {
      // Deduct 1 credit for in-depth AI research
      useCredits(1);
    } catch {
      // Continue gracefully
    }

    try {
      const result = await generateTopicResearchWithAi({
        topic: searchQuery.trim(),
        industry: activeBusinessProfile.industry,
        language: language === 'hi' ? 'hi' : 'en',
        businessProfile: activeBusinessProfile,
      });

      const customIdea: ContentIdea = {
        id: `custom_res_${Date.now()}`,
        title: searchQuery.trim(),
        titleHi: searchQuery.trim(),
        industry: activeBusinessProfile.industry,
        category: 'कस्टम शोध',
        format: 'Short (15-30s)',
        duration: 'Reels (60 सेकंड)',
        relevance: 'High',
        relevanceLabel: 'उच्च',
        viewCount: 'ताज़ा विश्लेषण',
        targetAudience: `${activeBusinessProfile.name} दर्शक`,
        engagementPotential: 'Trending',
        usageCount: 'नया विषय',
        tags: [`#${searchQuery.trim().replace(/\s+/g, '')}`, '#Research', '#ScripterAI'],
        imageUrl: '/assets/aistudio/Master_Admin_UI___________6_Visual_Assets_Management_bfd1be4e.png',
        summary: result.summary,
        summaryHi: result.summaryHi || result.summary,
        keyPoints: result.keyPoints,
        keyPointsHi: result.keyPointsHi || result.keyPoints,
        sources: result.sources,
        suggestedHooks: result.suggestedHooks,
        suggestedAngles: result.suggestedAngles,
        outline: result.keyPoints.slice(0, 3),
        outlineHi: (result.keyPointsHi || result.keyPoints).slice(0, 3),
        isTrending: true,
        sourceAttributionType: result.isLiveAi ? 'verified_news' : 'public_research',
      };

      setSelectedIdea(customIdea);
      setViewMode('detail');
      setActiveDetailTab('summary');
      setToastMessage(language === 'en' ? 'AI Research completed successfully!' : 'AI शोध सफलतापूर्वक तैयार हुआ!');
    } catch (err) {
      console.error('Custom research failed:', err);
    } finally {
      setIsResearchingCustom(false);
    }
  };

  // Filter ideas based on active tab, search, category, and business profile
  const filteredIdeas = useMemo(() => {
    return DEMO_CONTENT_IDEAS.filter((idea) => {
      // 1. Tab filter
      if (activeFilterTab === 'saved') {
        if (!savedIds.includes(idea.id)) return false;
      } else if (activeFilterTab === 'trending') {
        if (!idea.isTrending && idea.engagementPotential !== 'Viral') return false;
      } else if (activeFilterTab === 'latest') {
        if (!idea.isTimelyNews && !idea.isTrending) return false;
      } else if (activeFilterTab === 'my_industry') {
        if (idea.businessProfileId && idea.businessProfileId !== activeBusinessProfile.id) return false;
      }

      // 2. Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'trending') {
          if (!idea.isTrending) return false;
        } else {
          const matchesCategory =
            idea.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
            idea.industry.toLowerCase().includes(selectedCategory.toLowerCase());
          if (!matchesCategory) return false;
        }
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = idea.title.toLowerCase().includes(q) || idea.titleHi.toLowerCase().includes(q);
        const matchCat = idea.category.toLowerCase().includes(q) || idea.industry.toLowerCase().includes(q);
        const matchSummary = idea.summary.toLowerCase().includes(q) || idea.summaryHi.toLowerCase().includes(q);
        const matchTags = idea.tags?.some((t) => t.toLowerCase().includes(q));
        return matchTitle || matchCat || matchSummary || matchTags;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, activeFilterTab, savedIds, activeBusinessProfile]);

  // Section 1: "आपके लिए सुझाव (Based on your profile)" - Image 1 & 2
  const profileSuggestions = useMemo(() => {
    return DEMO_CONTENT_IDEAS.filter((i) => !i.isTimelyNews).slice(0, 3);
  }, []);

  // Section 2: "ट्रेंडिंग टॉपिक्स (News & Media) / करेंट न्यूज़ और चर्चा के विषय" - Image 1 & 2
  const trendingNewsTopics = useMemo(() => {
    return DEMO_CONTENT_IDEAS.filter((i) => i.isTimelyNews || i.id.includes('news') || i.id.includes('growth') || i.id.includes('interview'));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 pb-24 md:pb-12 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {viewMode === 'list' ? (
        /* ================= PANEL 1: IDEAS & TRENDING TOPICS ================= */
        <div className="space-y-6">
          {/* 1. Header & Search Bar matching Panel 1 */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
            {/* Search Input Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    handleGenerateCustomResearch();
                  }
                }}
                placeholder={
                  language === 'en'
                    ? 'Search topics, keywords, or industry (or press Enter for AI research)...'
                    : 'किस विषय पर कंटेंट बनाना चाहते हैं? (सर्च करें या एंटर दबाकर गहरा शोध करें)...'
                }
                className="w-full pl-11 pr-24 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs font-medium"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {searchQuery.trim() && (
                  <button
                    onClick={handleGenerateCustomResearch}
                    disabled={isResearchingCustom}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                    title="Run deep AI research on this topic"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isResearchingCustom ? 'शोध हो रहा है...' : 'शोध करें'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Filter Pills row matching Image 1 & 2: For You, Trending, Latest News, My Industry, Saved Ideas */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
              {[
                { id: 'for_you', labelEn: 'For You', labelHi: 'मेरे लिए (For You)' },
                { id: 'trending', labelEn: 'Trending', labelHi: 'ट्रेंडिंग (Trending)' },
                { id: 'latest', labelEn: 'Latest News', labelHi: 'ताज़ा ख़बरें (Latest News)' },
                { id: 'my_industry', labelEn: `My Industry (${activeBusinessProfile.industry})`, labelHi: `मेरी इंडस्ट्री (${activeBusinessProfile.industry})` },
                { id: 'saved', labelEn: `Saved Ideas (${savedIds.length})`, labelHi: `सेव्ड आइडिया (${savedIds.length})` },
              ].map((tab) => {
                const isActive = activeFilterTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilterTab(tab.id as any)}
                    className={`px-4 py-2 rounded-full font-bold transition-all shrink-0 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {language === 'en' ? tab.labelEn : tab.labelHi}
                  </button>
                );
              })}
            </div>

            {/* Category Icons Row matching Image 1 & 2 */}
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-none pt-1">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold shrink-0 transition-all border ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-2xs ring-1 ring-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className={`p-1 rounded-lg ${cat.color} shrink-0`}>
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <span>{language === 'en' ? cat.labelEn : cat.labelHi}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. SECTION A: "आपके लिए सुझाव (Based on your profile)" matching Image 1 & 2 */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-amber-100 text-amber-800">
                  <Sparkles className="w-4 h-4 fill-amber-500 text-amber-600" />
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    {language === 'en' ? 'Suggested for You (Based on your profile)' : 'आपके लिए सुझाव (Based on your profile)'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {language === 'en' ? `Tailored to ${activeBusinessProfile.name} (${activeBusinessProfile.industry})` : `${activeBusinessProfile.name} (${activeBusinessProfile.industry}) के आधार पर तैयार`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveFilterTab('for_you')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-0.5"
              >
                <span>{language === 'en' ? 'View All' : 'सभी देखें'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {profileSuggestions.map((idea) => {
                const isSaved = savedIds.includes(idea.id);
                return (
                  <div
                    key={idea.id}
                    onClick={() => handleOpenResearch(idea)}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
                  >
                    <div>
                      {/* Thumbnail Banner */}
                      <div className="relative h-40 bg-slate-900 overflow-hidden">
                        <img
                          src={idea.imageUrl || '/assets/aistudio/Master_Admin_UI___________9_Payments___Billing_Management_7414dccf.png'}
                          alt={idea.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          {idea.isTrending && (
                            <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs flex items-center gap-1">
                              <Flame className="w-3 h-3 fill-current" />
                              <span>Trending</span>
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-md bg-emerald-600/90 text-white text-[10px] font-bold">
                            For You
                          </span>
                        </div>

                        <button
                          onClick={(e) => handleToggleSave(idea.id, e)}
                          className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md transition-colors ${
                            isSaved ? 'bg-amber-400 text-slate-950 shadow-xs' : 'bg-black/50 text-white hover:bg-black/70'
                          }`}
                          title={isSaved ? 'Saved' : 'Save Idea'}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                        </button>

                        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300 font-medium">
                          <span className="bg-black/60 px-2 py-0.5 rounded-md text-[10px]">{idea.category}</span>
                          <span className="text-amber-300 font-mono font-bold">{idea.duration || 'Reels 60s'}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {language === 'hi' ? idea.titleHi : idea.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {language === 'hi' ? idea.summaryHi : idea.summary}
                        </p>

                        {/* Tags */}
                        {idea.tags && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {idea.tags.slice(0, 2).map((t, idx) => (
                              <span key={idx} className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-mono">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="p-4 pt-0 flex items-center gap-2 border-t border-slate-100 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartScriptWithResearch(idea);
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{language === 'en' ? 'Create Script' : 'स्क्रिप्ट बनाएं'}</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenResearch(idea);
                        }}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                        title={language === 'en' ? 'View In-depth Research' : 'शोध देखें'}
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 3. SECTION B: "ट्रेंडिंग टॉपिक्स (News & Media) / करेंट न्यूज़ और चर्चा के विषय" matching Image 1 & 2 */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-rose-100 text-rose-700">
                  <Radio className="w-4 h-4 text-rose-600" />
                </span>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    {language === 'en' ? 'Trending Topics (News & Media)' : 'ट्रेंडिंग टॉपिक्स (News & Media)'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {language === 'en' ? 'Verified current events, regional news & trending discussions' : 'करेंट न्यूज़ और चर्चा के विषय (सत्यापित संदर्भ सहित)'}
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                Verified Sources
              </span>
            </div>

            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs divide-y divide-slate-100">
              {trendingNewsTopics.map((news) => {
                const isSaved = savedIds.includes(news.id);
                return (
                  <div
                    key={news.id}
                    onClick={() => handleOpenResearch(news)}
                    className="py-3.5 first:pt-1 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group cursor-pointer hover:bg-slate-50/70 p-2 rounded-2xl transition-all"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      {/* Small Thumbnail */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-900 shrink-0 relative">
                        <img
                          src={news.imageUrl || '/assets/aistudio/Master_Admin_UI___________4_Industry_Categories_Management_c2759e0a.png'}
                          alt={news.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-bold flex items-center gap-1 border border-rose-200/50">
                            <Flame className="w-3 h-3 fill-rose-600" />
                            <span>Trending</span>
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {news.viewCount || '1.8M views'}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/50">
                            सत्यापित संदर्भ
                          </span>
                        </div>

                        <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                          {language === 'hi' ? news.titleHi : news.title}
                        </h4>

                        {news.tags && (
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                            {news.tags.map((t, i) => (
                              <span key={i}>{t}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={(e) => handleToggleSave(news.id, e)}
                        className={`p-2 rounded-xl border transition-colors ${
                          isSaved ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-white text-slate-400 border-slate-200 hover:text-slate-700'
                        }`}
                        title="Save Idea"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartScriptWithResearch(news);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <span>{language === 'en' ? 'Create Script' : 'स्क्रिप्ट बनाएं'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 4. Full Catalog Grid (Filtered) */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {language === 'en' ? 'Explore All Topics & Research' : 'सभी आइडिया और रिसर्च'} ({filteredIdeas.length})
              </h2>
              <span className="text-xs text-slate-400">
                {activeFilterTab !== 'for_you' ? `Filter: ${activeFilterTab}` : 'Filtered View'}
              </span>
            </div>

            {filteredIdeas.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80 space-y-3">
                <Lightbulb className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">
                  {language === 'en' ? 'No Topics Match Your Search' : 'कोई विषय नहीं मिला'}
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {language === 'en'
                    ? `Generate in-depth research on "${searchQuery}" directly with Scripter AI!`
                    : `क्या आप "${searchQuery}" पर सीधा AI शोध तैयार करना चाहते हैं?`}
                </p>
                {searchQuery.trim() && (
                  <button
                    onClick={handleGenerateCustomResearch}
                    disabled={isResearchingCustom}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-2 shadow-xs transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isResearchingCustom ? 'शोध हो रहा है...' : `"${searchQuery}" पर शोध तैयार करें`}</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredIdeas.map((idea) => {
                  const isSaved = savedIds.includes(idea.id);
                  return (
                    <div
                      key={idea.id}
                      onClick={() => handleOpenResearch(idea)}
                      className="bg-white rounded-3xl p-5 border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold">
                              {idea.category}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                              {idea.duration || idea.format}
                            </span>
                            {idea.isTrending && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200/60">
                                <Flame className="w-3 h-3 text-rose-600" />
                                <span>Trending</span>
                              </span>
                            )}
                          </div>

                          <button
                            onClick={(e) => handleToggleSave(idea.id, e)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isSaved ? 'text-amber-500 bg-amber-50' : 'text-slate-400 hover:text-slate-600'
                            }`}
                          >
                            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                          </button>
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                          {language === 'hi' ? idea.titleHi : idea.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {language === 'hi' ? idea.summaryHi : idea.summary}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenResearch(idea);
                          }}
                          className="text-xs font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                          <span>{language === 'en' ? 'Research Details' : 'विषय विवरण और शोध'}</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartScriptWithResearch(idea);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-all"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>{language === 'en' ? 'Create Script' : 'स्क्रिप्ट बनाएं'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      ) : (
        /* ================= PANEL 2: TOPIC DETAILS & RESEARCH (विषय विवरण और शोध) ================= */
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Top Bar Navigation matching Image 1 & 2 Panel 2 */}
          <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-slate-200/90 shadow-xs flex items-center justify-between">
            <button
              onClick={() => {
                setViewMode('list');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-blue-600" />
              <span>{language === 'en' ? '← Back to Ideas' : '← वापस जाएं'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => handleToggleSave(selectedIdea.id, e)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-colors ${
                  savedIds.includes(selectedIdea.id)
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${savedIds.includes(selectedIdea.id) ? 'fill-current' : ''}`} />
                <span>{savedIds.includes(selectedIdea.id) ? (language === 'en' ? 'Saved' : 'सेव्ड') : (language === 'en' ? 'Save Idea' : 'सेव करें')}</span>
              </button>

              <button
                onClick={(e) => handleShare(selectedIdea, e)}
                className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Share' : 'शेयर'}</span>
              </button>
            </div>
          </div>

          {/* Header Card: Thumbnail, Title, Meta Chips matching Image 1 & 2 Panel 2 */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row gap-5 items-start">
              {/* Thumbnail Frame */}
              <div className="w-full md:w-64 h-48 md:h-44 rounded-2xl overflow-hidden bg-slate-900 shrink-0 relative shadow-sm">
                <img
                  src={selectedIdea.imageUrl || '/assets/aistudio/Master_Admin_UI___________9_Payments___Billing_Management_7414dccf.png'}
                  alt={selectedIdea.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                  {selectedIdea.isTrending ? 'Trending' : 'Verified'}
                </span>
              </div>

              {/* Title & Metadata */}
              <div className="flex-1 space-y-2.5">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold">
                    📊 उपयोग: {selectedIdea.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-bold">
                    ⏱️ {selectedIdea.duration || 'Reels (60 सेकंड)'}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold">
                    🎯 प्रासंगिकता: {selectedIdea.relevanceLabel || 'उच्च'}
                  </span>
                  {selectedIdea.viewCount && (
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-mono font-semibold">
                      👁️ {selectedIdea.viewCount}
                    </span>
                  )}
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
                  {language === 'hi' ? selectedIdea.titleHi : selectedIdea.title}
                </h1>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {language === 'hi' ? selectedIdea.summaryHi : selectedIdea.summary}
                </p>

                {/* Tags row */}
                {selectedIdea.tags && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {selectedIdea.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Bar inside Card */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200/60">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>
                    {selectedIdea.sourceAttributionType === 'verified_news'
                      ? 'सत्यापित समाचार स्रोत'
                      : 'सत्यापित संदर्भ व शोध आधार'}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStartScriptWithResearch(selectedIdea)}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-blue-500/20 active:scale-98 transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>{language === 'en' ? 'Create Script' : 'Create Script'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 5 Interactive Tabs matching Image 1 & 2 Panel 2 */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            {/* Tabs Header */}
            <div className="border-b border-slate-200 flex items-center overflow-x-auto scrollbar-none bg-slate-50/50 p-1.5">
              {[
                { id: 'summary', labelEn: 'Research & Sources', labelHi: 'शोध सारांश' },
                { id: 'key_points', labelEn: 'Key Points', labelHi: 'मुख्य बिंदु' },
                { id: 'sources', labelEn: `Sources (${selectedIdea.sources?.length || 0})`, labelHi: `स्रोत (${selectedIdea.sources?.length || 0})` },
                { id: 'hooks', labelEn: 'Suggested Angles', labelHi: 'एंगल / हुक' },
                { id: 'outline', labelEn: 'Script Outline', labelHi: 'स्क्रिप्ट सुझाव' },
              ].map((tab) => {
                const isActive = activeDetailTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveDetailTab(tab.id as any)}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {language === 'en' ? tab.labelEn : tab.labelHi}
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT */}
            <div className="p-5 sm:p-6 space-y-5">
              {/* TAB 1: शोध सारांश (Research Summary) */}
              {activeDetailTab === 'summary' && (
                <div className="space-y-5">
                  {/* Brief Overview */}
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {language === 'en' ? 'Topic Overview' : 'विषय का संक्षिप्त सारांश'}
                    </h3>
                    <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs sm:text-sm text-blue-950 leading-relaxed">
                      {language === 'hi' ? selectedIdea.summaryHi : selectedIdea.summary}
                    </div>
                  </div>

                  {/* Key Research Points Preview */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {language === 'en' ? 'Core Research Points (For Script)' : 'मुख्य शोध बिंदु (स्क्रिप्ट के लिए उपयोगी)'}
                    </h3>
                    <div className="space-y-2">
                      {(language === 'hi' ? (selectedIdea.keyPointsHi || selectedIdea.outlineHi) : (selectedIdea.keyPoints || selectedIdea.outline)).map((point, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-800"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sources Preview matching Image 1 & 2 */}
                  {selectedIdea.sources && selectedIdea.sources.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          {language === 'en' ? 'Verified References' : 'संबंधित स्रोत (वास्तविक संदर्भ)'}
                        </h3>
                        <button
                          onClick={() => setActiveDetailTab('sources')}
                          className="text-xs font-bold text-blue-600 hover:underline"
                        >
                          {language === 'en' ? 'View All Sources' : 'सभी देखें >'}
                        </button>
                      </div>

                      <div className="space-y-2">
                        {selectedIdea.sources.map((src, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="p-1 rounded-md bg-blue-100 text-blue-700 font-bold text-[10px]">
                                {idx + 1}
                              </span>
                              <div>
                                <p className="font-bold text-slate-800">{src.name}</p>
                                {src.url && (
                                  <a
                                    href={src.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[11px] text-blue-600 hover:underline truncate max-w-xs block"
                                  >
                                    {src.url}
                                  </a>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[11px] font-mono text-slate-500">{src.date}</span>
                              {src.url && <ExternalLink className="w-3.5 h-3.5 text-slate-400" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: मुख्य बिंदु (Key Points Interactive Fact Sheet) */}
              {activeDetailTab === 'key_points' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {language === 'en' ? 'Select Facts to Include in Your Script' : 'स्क्रिप्ट में शामिल करने के लिए बिंदु चुनें'}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {language === 'en' ? 'Selected points will automatically pre-fill into Script Studio.' : 'चुने गए बिंदु स्वचालित रूप से स्क्रिप्ट स्टूडियो में जुड़ जाएंगे।'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {(language === 'hi' ? (selectedIdea.keyPointsHi || selectedIdea.outlineHi) : (selectedIdea.keyPoints || selectedIdea.outline)).map((point, idx) => {
                      const isSelected = selectedKeyPoints.includes(point);
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            setSelectedKeyPoints((prev) =>
                              prev.includes(point) ? prev.filter((p) => p !== point) : [...prev, point]
                            );
                          }}
                          className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
                            isSelected
                              ? 'bg-blue-50/80 border-blue-300 text-blue-950 shadow-2xs'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <div className="flex-1 text-xs sm:text-sm leading-relaxed">
                            {point}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: स्रोत (Sources & Verification) */}
              {activeDetailTab === 'sources' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-2.5 text-xs text-emerald-950">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      {language === 'en'
                        ? 'Scripter Research Integrity: All listed references are sourced from public government portals, authoritative newsfeeds, or verified industry benchmarks. No fabricated citations.'
                        : 'स्क्रिप्टर शोध सत्यता: सभी संदर्भ आधिकारिक सरकारी पोर्टल्स, विश्वसनीय समाचार स्रोतों या प्रमाणित इंडस्ट्री अध्ययनों से लिए गए हैं।'}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {selectedIdea.sources?.map((source, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="p-1 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                              #{idx + 1}
                            </span>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">{source.name}</h4>
                            {source.verified && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-semibold">
                                Verified
                              </span>
                            )}
                          </div>
                          {source.url && (
                            <p className="text-xs text-blue-600 font-mono break-all">{source.url}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs text-slate-500 font-mono">{source.date}</span>
                          {source.url && (
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                              title="Open verified source in new tab"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: एंगल / हुक (Suggested Angles & Hooks) */}
              {activeDetailTab === 'hooks' && (
                <div className="space-y-5">
                  {/* Selectable Hooks */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {language === 'en' ? 'Select Opening Hook for Script' : 'शुरुआती हुक चुनें (स्क्रिप्ट के लिए)'}
                    </h3>
                    <div className="space-y-2.5">
                      {(selectedIdea.suggestedHooks || [
                        { type: 'Question', hook: 'Are you frustrated with this issue?', hookHi: 'क्या आप भी इस समस्या से परेशान हैं?' },
                        { type: 'Direct Value', hook: 'Here are 3 verified tips.', hookHi: 'जानिए 3 सबसे असरदार तरीके।' },
                      ]).map((item, idx) => {
                        const isSelected = selectedHookIndex === idx;
                        return (
                          <div
                            key={idx}
                            onClick={() => setSelectedHookIndex(idx)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                              isSelected
                                ? 'bg-amber-50/80 border-amber-300 text-slate-950 shadow-xs ring-1 ring-amber-300'
                                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-amber-800 uppercase tracking-wider text-[10px]">
                                {item.type}
                              </span>
                              {isSelected && (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                  Selected for Script
                                </span>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                              "{language === 'hi' ? item.hookHi : item.hook}"
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Content Angles */}
                  {selectedIdea.suggestedAngles && selectedIdea.suggestedAngles.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {language === 'en' ? 'Recommended Content Angles' : 'सुझाए गए कंटेंट एंगल'}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedIdea.suggestedAngles.map((ang, idx) => (
                          <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs">
                            <p className="font-bold text-slate-900">{language === 'hi' ? ang.angleHi : ang.angle}</p>
                            <p className="text-slate-500 text-[11px]">Target: {ang.targetAudience}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: स्क्रिप्ट सुझाव (Script Outline) */}
              {activeDetailTab === 'outline' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {language === 'en' ? 'Structured Script Framework' : 'संरचित स्क्रिप्ट रूपरेखा'}
                    </h3>
                    <div className="space-y-2.5">
                      {(language === 'hi' ? selectedIdea.outlineHi : selectedIdea.outline).map((step, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed"
                        >
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Sticky Action Bar matching Image 1 & 2 Panel 2 */}
            <div className="p-4 sm:p-5 bg-[#0B132B] text-white flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
              <div>
                <p className="text-xs sm:text-sm font-bold text-white">
                  {language === 'hi' ? selectedIdea.titleHi : selectedIdea.title}
                </p>
                <p className="text-[11px] text-slate-300">
                  {language === 'en' ? 'Ready with full research points & verified citations.' : 'सभी मुख्य बिंदु और संदर्भ सहित स्क्रिप्ट स्टूडियो में लोड होगा।'}
                </p>
              </div>

              <button
                onClick={() => handleStartScriptWithResearch(selectedIdea)}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all shrink-0"
              >
                <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{language === 'en' ? '⚡ Create Script with this Research →' : '⚡ इस विषय पर स्क्रिप्ट बनाएं →'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
