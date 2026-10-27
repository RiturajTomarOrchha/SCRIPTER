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
} from 'lucide-react';

export const IdeasPage: React.FC = () => {
  const { activeBusinessProfile } = useRole();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');
  const [selectedIdea, setSelectedIdea] = useState<ContentIdea | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    return DEMO_CONTENT_IDEAS.filter((i) => isIdeaSaved(i.id)).map((i) => i.id);
  });

  const categories = [
    { id: 'all', labelEn: 'All Topics', labelHi: 'सभी विषय' },
    { id: 'Healthcare & Wellness', labelEn: 'Health & Wellness', labelHi: 'हेल्थ व वेलनेस' },
    { id: 'Tech & Software', labelEn: 'Technology & AI', labelHi: 'टेक्नोलॉजी व AI' },
    { id: 'Education & Training', labelEn: 'Education', labelHi: 'शिक्षा व करियर' },
    { id: 'Hospitality', labelEn: 'Food & Lifestyle', labelHi: 'खान-पान व लाइफस्टाइल' },
    { id: 'Real Estate', labelEn: 'Real Estate', labelHi: 'रियल एस्टेट' },
  ];

  const handleToggleSave = (ideaId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isNowSaved = toggleSaveIdea(ideaId);
    setSavedIds((prev) => (isNowSaved ? [...prev, ideaId] : prev.filter((id) => id !== ideaId)));
  };

  const filteredIdeas = useMemo(() => {
    return DEMO_CONTENT_IDEAS.filter((idea) => {
      // Tab filter
      if (activeTab === 'saved' && !savedIds.includes(idea.id)) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all' && idea.industry !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = idea.title.toLowerCase().includes(q) || idea.titleHi.toLowerCase().includes(q);
        const matchCat = idea.category.toLowerCase().includes(q);
        const matchSummary = idea.summary.toLowerCase().includes(q) || idea.summaryHi.toLowerCase().includes(q);
        return matchTitle || matchCat || matchSummary;
      }
      return true;
    });
  }, [searchQuery, selectedCategory, activeTab, savedIds]);

  const handleStartScript = (idea: ContentIdea) => {
    const topicText = language === 'hi' ? idea.titleHi : idea.title;
    navigate('/user/script-studio', {
      state: {
        prefilledTopic: topicText,
        ideaId: idea.id,
        category: idea.category,
        industry: idea.industry,
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      {/* Header & Personalization Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
                <Lightbulb className="w-5 h-5 fill-amber-500 text-amber-600" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {language === 'en' ? 'Ideas & Research Engine' : 'आइडिया एवं रिसर्च इंजन'}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {language === 'en'
                ? `Trending topic discovery and researched outlines tailored for ${activeBusinessProfile.name}.`
                : `${activeBusinessProfile.name} के लिए विशेष रूप से चुने गए विषय और प्रामाणिक रिसर्च।`}
            </p>
          </div>

          {/* Tab Switcher: All Ideas vs Saved */}
          <div className="flex items-center p-1 bg-slate-100 rounded-2xl self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {language === 'en' ? 'Explore All' : 'सभी विषय'}
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'saved'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span>{language === 'en' ? 'Saved Ideas' : 'सेव किए गए'}</span>
              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] flex items-center justify-center font-mono">
                {savedIds.length}
              </span>
            </button>
          </div>
        </div>

        {/* Search Bar & Industry Quick Selectors */}
        <div className="mt-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'en'
                  ? 'Search topics, categories, or keywords (e.g. immunity, screen time, study)...'
                  : 'विषय, कैटेगरी या कीवर्ड खोजें (जैसे: इम्यूनिटी, स्क्रीन डिटॉक्स, पढ़ाई)...'
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/70'
                  }`}
                >
                  {language === 'en' ? cat.labelEn : cat.labelHi}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ideas Grid */}
      {filteredIdeas.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
          <Lightbulb className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">
            {activeTab === 'saved'
              ? language === 'en'
                ? 'No Saved Ideas Yet'
                : 'अभी कोई आइडिया सेव नहीं किया गया है'
              : language === 'en'
              ? 'No Topics Found'
              : 'कोई विषय नहीं मिला'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {activeTab === 'saved'
              ? language === 'en'
                ? 'Tap the bookmark icon on any idea card to save it here for quick access.'
                : 'किसी भी कार्ड पर बुकमार्क आइकन दबाकर उसे यहाँ सेव करें।'
              : language === 'en'
              ? 'Try modifying your search or switching to a different industry category.'
              : 'सर्च शब्द बदलें या अन्य कैटेगरी चुनकर देखें।'}
          </p>
          {activeTab === 'saved' && (
            <button
              onClick={() => setActiveTab('all')}
              className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
            >
              {language === 'en' ? 'Browse All Topics' : 'सभी विषय देखें'}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredIdeas.map((idea) => {
            const isSaved = savedIds.includes(idea.id);
            const isMatchingCurrentProfile = idea.businessProfileId === activeBusinessProfile.id;

            return (
              <div
                key={idea.id}
                onClick={() => setSelectedIdea(idea)}
                className={`group bg-white rounded-2xl p-5 border transition-all hover:shadow-md cursor-pointer flex flex-col justify-between space-y-4 ${
                  isMatchingCurrentProfile
                    ? 'border-blue-200 hover:border-blue-400'
                    : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold">
                        {idea.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                        {idea.format}
                      </span>
                      {idea.isTrending && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200/60">
                          <TrendingUp className="w-3 h-3 text-amber-600" />
                          <span>{language === 'en' ? 'Trending' : 'ट्रेंडिंग'}</span>
                        </span>
                      )}
                    </div>

                    {/* Bookmark Toggle */}
                    <button
                      onClick={(e) => handleToggleSave(idea.id, e)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isSaved
                          ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                      }`}
                      title={isSaved ? 'Remove Bookmark' : 'Save Idea'}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 fill-amber-500" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Idea Title */}
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {language === 'hi' ? idea.titleHi : idea.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {language === 'hi' ? idea.summaryHi : idea.summary}
                  </p>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{idea.sources.length} Verified Sources</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedIdea(idea);
                      }}
                      className="px-2.5 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors"
                    >
                      {language === 'en' ? 'Research' : 'रिसर्च'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartScript(idea);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-xs"
                    >
                      <span>{language === 'en' ? 'Create Script' : 'स्क्रिप्ट बनाएं'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Idea Detail & Research Modal */}
      {selectedIdea && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col justify-between">
            {/* Modal Header */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-700 text-xs font-bold">
                    {selectedIdea.category}
                  </span>
                  <span className="text-xs text-slate-400">· {selectedIdea.format}</span>
                </div>
                <button
                  onClick={() => setSelectedIdea(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Title & Summary */}
              <div className="mt-4 space-y-2">
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {language === 'hi' ? selectedIdea.titleHi : selectedIdea.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'hi' ? selectedIdea.summaryHi : selectedIdea.summary}
                </p>
              </div>

              {/* Target Audience */}
              <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <span className="font-semibold text-slate-700">
                  {language === 'en' ? 'Recommended Audience:' : 'लक्षित दर्शक:'}
                </span>{' '}
                <span className="text-slate-600">{selectedIdea.targetAudience}</span>
              </div>

              {/* Researched Outline Breakdown */}
              <div className="mt-4 space-y-2 overflow-y-auto max-h-48 pr-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>{language === 'en' ? 'Researched Script Outline' : 'शोधित स्क्रिप्ट रूपरेखा'}</span>
                </h4>
                <div className="space-y-1.5">
                  {(language === 'hi' ? selectedIdea.outlineHi : selectedIdea.outline).map(
                    (step, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-800 leading-relaxed"
                      >
                        {step}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Research Sources & Fact Verification */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'en' ? 'Verified Fact Sources & Citations' : 'सत्यापित स्रोत एवं संदर्भ'}</span>
                </h4>
                <div className="space-y-1.5">
                  {selectedIdea.sources.map((src, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-[11px] text-slate-600 bg-slate-50/80 px-2.5 py-1.5 rounded-lg border border-slate-100"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span className="font-medium truncate">{src.name}</span>
                      </div>
                      <span className="text-slate-400 text-[10px] shrink-0 font-mono">{src.date}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 italic">
                  * All factual claims are grounded in published clinical/industry reports. Summaries are tailored by Scripter engine.
                </p>
              </div>
            </div>

            {/* Modal Bottom CTAs */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={(e) => handleToggleSave(selectedIdea.id, e)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
              >
                {savedIds.includes(selectedIdea.id) ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 text-slate-400" />
                    <span>Save Idea</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  const idea = selectedIdea;
                  setSelectedIdea(null);
                  handleStartScript(idea);
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>
                  {language === 'en'
                    ? 'Generate Script with this Idea'
                    : 'इस आइडिया से स्क्रिप्ट बनाएं'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
