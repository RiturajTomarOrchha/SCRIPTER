import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import { useLanguage } from '../../context/LanguageContext';
import { ContentIdea } from '../../types';
import { DEMO_CONTENT_IDEAS } from '../../data/mockData';
import { isIdeaSaved, toggleSaveIdea } from '../../services/storage';
import {
  Lightbulb,
  Search,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Calendar,
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
} from 'lucide-react';

export const IdeasPage: React.FC = () => {
  const { activeBusinessProfile } = useRole();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState<'for_you' | 'trending' | 'latest' | 'my_industry' | 'saved'>('for_you');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIdea, setSelectedIdea] = useState<ContentIdea | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    return DEMO_CONTENT_IDEAS.filter((i) => isIdeaSaved(i.id)).map((i) => i.id);
  });

  const categories = [
    { id: 'all', labelEn: 'All', labelHi: 'सभी', icon: Sparkles, color: 'text-blue-600 bg-blue-50' },
    { id: 'राजनीति', labelEn: 'Politics', labelHi: 'राजनीति', icon: Landmark, color: 'text-rose-600 bg-rose-50' },
    { id: 'बिज़नेस', labelEn: 'Business', labelHi: 'बिज़नेस', icon: Briefcase, color: 'text-amber-600 bg-amber-50' },
    { id: 'शिक्षा', labelEn: 'Education', labelHi: 'शिक्षा', icon: GraduationCap, color: 'text-indigo-600 bg-indigo-50' },
    { id: 'स्वास्थ्य', labelEn: 'Health', labelHi: 'स्वास्थ्य', icon: HeartPulse, color: 'text-emerald-600 bg-emerald-50' },
    { id: 'ट्रैवल', labelEn: 'Travel', labelHi: 'ट्रैवल', icon: Compass, color: 'text-sky-600 bg-sky-50' },
    { id: 'फूड', labelEn: 'Food', labelHi: 'फूड', icon: Utensils, color: 'text-orange-600 bg-orange-50' },
    { id: 'लाइफस्टाइल', labelEn: 'Lifestyle', labelHi: 'लाइफस्टाइल', icon: Palette, color: 'text-purple-600 bg-purple-50' },
  ];

  const handleToggleSave = (ideaId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isNowSaved = toggleSaveIdea(ideaId);
    setSavedIds((prev) => (isNowSaved ? [...prev, ideaId] : prev.filter((id) => id !== ideaId)));
  };

  const handleStartScript = (idea: ContentIdea) => {
    const topicText = language === 'hi' ? idea.titleHi : idea.title;
    navigate('/user/script-studio', {
      state: {
        prefilledTopic: topicText,
        ideaId: idea.id,
        category: idea.category,
        industry: idea.industry,
        outline: language === 'hi' ? idea.outlineHi : idea.outline,
      },
    });
  };

  // Filter ideas based on active tab, search, category, and business profile
  const filteredIdeas = useMemo(() => {
    return DEMO_CONTENT_IDEAS.filter((idea) => {
      // 1. Tab filter
      if (activeFilterTab === 'saved') {
        if (!savedIds.includes(idea.id)) return false;
      } else if (activeFilterTab === 'trending') {
        if (!idea.isTrending && idea.engagementPotential !== 'Viral') return false;
      } else if (activeFilterTab === 'my_industry') {
        if (idea.businessProfileId && idea.businessProfileId !== activeBusinessProfile.id) return false;
      }

      // 2. Category filter
      if (selectedCategory !== 'all') {
        const matchesCategory =
          idea.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
          idea.industry.toLowerCase().includes(selectedCategory.toLowerCase());
        if (!matchesCategory) return false;
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = idea.title.toLowerCase().includes(q) || idea.titleHi.toLowerCase().includes(q);
        const matchCat = idea.category.toLowerCase().includes(q) || idea.industry.toLowerCase().includes(q);
        const matchSummary = idea.summary.toLowerCase().includes(q) || idea.summaryHi.toLowerCase().includes(q);
        return matchTitle || matchCat || matchSummary;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, activeFilterTab, savedIds, activeBusinessProfile]);

  // Section 1: Today's Trending Ideas
  const trendingSectionIdeas = useMemo(() => {
    return DEMO_CONTENT_IDEAS.filter((i) => i.isTrending || i.id.startsWith('idea_solar') || i.id.startsWith('idea_orchha') || i.id.startsWith('idea_immunity')).slice(0, 3);
  }, []);

  // Section 2: Industry Recommendations
  const industryRecommendations = useMemo(() => {
    return DEMO_CONTENT_IDEAS.filter((i) => i.isIndustryRecommendation || i.businessProfileId === activeBusinessProfile.id || i.industry.includes('Media')).slice(0, 3);
  }, [activeBusinessProfile]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      {/* 1. Header & Search Bar matching Panel 1 */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        {/* Top Search Input with Search Icon */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'en'
                ? 'Search topics, keywords or industry (e.g. solar panel, immunity, viral news)...'
                : 'विषय, कीवर्ड या इंडस्ट्री खोजें (जैसे: सोलर पैनल, ओरछा, इम्युनिटी)...'
            }
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Pills row (For You, Trending, Latest News, My Industry, Saved Ideas) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { id: 'for_you', labelEn: 'For You', labelHi: 'मेरे लिए' },
            { id: 'trending', labelEn: 'Trending', labelHi: 'ट्रेंडिंग' },
            { id: 'latest', labelEn: 'Latest News', labelHi: 'ताज़ा ख़बरें' },
            { id: 'my_industry', labelEn: 'My Industry', labelHi: 'मेरी इंडस्ट्री' },
            { id: 'saved', labelEn: `Saved Ideas (${savedIds.length})`, labelHi: `सेव्ड आइडिया (${savedIds.length})` },
          ].map((tab) => {
            const isActive = activeFilterTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilterTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full font-bold transition-all shrink-0 ${
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

        {/* Category Pills with Colorful Icons */}
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

      {/* 2. SECTION A: आज के ट्रेंडिंग आइडिया (Today's Trending Ideas) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {language === 'en' ? "Today's Trending Ideas" : 'आज के ट्रेंडिंग आइडिया'}
            </h2>
          </div>
          <button
            onClick={() => setActiveFilterTab('trending')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-0.5"
          >
            <span>{language === 'en' ? 'View All' : 'सभी देखें'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trendingSectionIdeas.map((idea) => {
            const isSaved = savedIds.includes(idea.id);
            return (
              <div
                key={idea.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail Banner with Tag */}
                  <div className="relative h-36 bg-slate-900 overflow-hidden">
                    <img
                      src={idea.imageUrl || '/assets/aistudio/Master_Admin_UI___________6_Visual_Assets_Management_bfd1be4e.png'}
                      alt={idea.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                      Trending
                    </span>

                    <button
                      onClick={(e) => handleToggleSave(idea.id, e)}
                      className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md transition-colors ${
                        isSaved ? 'bg-amber-400 text-slate-950' : 'bg-black/50 text-white hover:bg-black/70'
                      }`}
                      title={isSaved ? 'Saved' : 'Save Idea'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                    </button>

                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300 font-medium">
                      <span>{idea.category}</span>
                      <span>{idea.usageCount || '1.2K उपयोग'}</span>
                    </div>
                  </div>

                  {/* Title & Summary */}
                  <div className="p-4 space-y-2">
                    <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                      {language === 'hi' ? idea.titleHi : idea.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {language === 'hi' ? idea.summaryHi : idea.summary}
                    </p>
                  </div>
                </div>

                {/* Bottom Actions Bar */}
                <div className="p-4 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => handleStartScript(idea)}
                    className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{language === 'en' ? 'Create Script' : 'स्क्रिप्ट बनाएं'}</span>
                  </button>

                  <button
                    onClick={() => setSelectedIdea(idea)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                    title={language === 'en' ? 'View Research Outline' : 'रिसर्च देखें'}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. SECTION B: आपकी इंडस्ट्री के लिए सुझाव (Recommendations for your Industry) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-blue-100 text-blue-700">
              <Briefcase className="w-3.5 h-3.5" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {language === 'en'
                ? `Recommendations for your Industry (${activeBusinessProfile.name})`
                : `आपकी इंडस्ट्री के लिए सुझाव (${activeBusinessProfile.name})`}
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {language === 'en' ? 'Personalized' : 'निजीकृत सुझाव'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {industryRecommendations.map((idea) => {
            const isSaved = savedIds.includes(idea.id);
            return (
              <div
                key={idea.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-32 bg-slate-900 overflow-hidden">
                    <img
                      src={idea.imageUrl || '/assets/aistudio/Scripter_App_Tools_Showcase_819e4ce4.png'}
                      alt={idea.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <button
                      onClick={(e) => handleToggleSave(idea.id, e)}
                      className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md transition-colors ${
                        isSaved ? 'bg-amber-400 text-slate-950' : 'bg-black/50 text-white hover:bg-black/70'
                      }`}
                      title={isSaved ? 'Saved' : 'Save Idea'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                    </button>

                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300 font-medium">
                      <span>{idea.category}</span>
                      <span>{idea.usageCount || '932 उपयोग'}</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                      {language === 'hi' ? idea.titleHi : idea.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {language === 'hi' ? idea.summaryHi : idea.summary}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center gap-2">
                  <button
                    onClick={() => handleStartScript(idea)}
                    className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{language === 'en' ? 'Create Script' : 'स्क्रिप्ट बनाएं'}</span>
                  </button>

                  <button
                    onClick={() => setSelectedIdea(idea)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                    title={language === 'en' ? 'View Research Outline' : 'रिसर्च देखें'}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Full Catalog Grid (Filtered View) */}
      <section className="space-y-3 pt-2">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          {language === 'en' ? 'Explore All Topics' : 'सभी आइडिया और रिसर्च'} ({filteredIdeas.length})
        </h2>

        {filteredIdeas.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80">
            <Lightbulb className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">
              {activeFilterTab === 'saved'
                ? language === 'en'
                  ? 'No Saved Ideas'
                  : 'कोई सेव किया गया आइडिया नहीं है'
                : language === 'en'
                ? 'No Topics Found'
                : 'कोई विषय नहीं मिला'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'en'
                ? 'Try adjusting your search keywords or switching filters.'
                : 'सर्च शब्द बदलें या फिल्टर बदलकर देखें।'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredIdeas.map((idea) => {
              const isSaved = savedIds.includes(idea.id);
              return (
                <div
                  key={idea.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold">
                          {idea.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                          {idea.format}
                        </span>
                        {idea.isTrending && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200/60">
                            <TrendingUp className="w-3 h-3 text-amber-600" />
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

                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {language === 'hi' ? idea.titleHi : idea.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {language === 'hi' ? idea.summaryHi : idea.summary}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedIdea(idea)}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      <span>{language === 'en' ? 'Research Outline' : 'आउटलाइन'}</span>
                    </button>

                    <button
                      onClick={() => handleStartScript(idea)}
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

      {/* 5. RESEARCH OUTLINE DRAWER / MODAL */}
      {selectedIdea && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-bold">
                    {selectedIdea.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
                    {selectedIdea.format}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {language === 'hi' ? selectedIdea.titleHi : selectedIdea.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedIdea(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Summary */}
            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs text-blue-950 space-y-1">
              <span className="font-bold uppercase tracking-wider text-[10px] text-blue-700">
                {language === 'en' ? 'Research Summary' : 'रिसर्च सारांश'}
              </span>
              <p className="leading-relaxed">
                {language === 'hi' ? selectedIdea.summaryHi : selectedIdea.summary}
              </p>
            </div>

            {/* Outline Points */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {language === 'en' ? 'Structured Script Flow' : 'संरचित स्क्रिप्ट रूपरेखा'}
              </h4>
              <div className="space-y-2">
                {(language === 'hi' ? selectedIdea.outlineHi : selectedIdea.outline).map((point, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed"
                  >
                    {point}
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Sources */}
            {selectedIdea.sources && selectedIdea.sources.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {language === 'en' ? 'Verified Reference Sources' : 'सत्यापित संदर्भ स्रोत'}
                </span>
                <div className="space-y-1">
                  {selectedIdea.sources.map((src, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs p-2 rounded-lg bg-emerald-50/60 border border-emerald-100 text-emerald-900"
                    >
                      <span className="flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{src.name}</span>
                      </span>
                      <span className="text-[10px] text-emerald-700 font-mono">{src.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Bottom Action Bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedIdea(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                {language === 'en' ? 'Close' : 'बंद करें'}
              </button>
              <button
                onClick={() => {
                  const idea = selectedIdea;
                  setSelectedIdea(null);
                  handleStartScript(idea);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>{language === 'en' ? 'Generate Script from this Idea' : 'इस आइडिया से स्क्रिप्ट बनाएं'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
