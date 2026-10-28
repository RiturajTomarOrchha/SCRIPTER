import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  searchNewsWithGoogle,
  NewsSearchResult,
} from '../../services/aiService';
import {
  Search,
  Sparkles,
  ExternalLink,
  Flame,
  CheckCircle2,
  Loader2,
  ArrowRight,
  TrendingUp,
  Globe,
  Radio,
  Copy,
  Check,
  Plus,
  BookOpen,
  X,
} from 'lucide-react';

interface RealTimeNewsPanelProps {
  currentTopic: string;
  industry?: string;
  onApplyTopic?: (newTopic: string) => void;
  onApplyHook?: (newHook: string) => void;
  onClose?: () => void;
  isInline?: boolean;
}

export const RealTimeNewsPanel: React.FC<RealTimeNewsPanelProps> = ({
  currentTopic,
  industry = 'General',
  onApplyTopic,
  onApplyHook,
  onClose,
  isInline = false,
}) => {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState(currentTopic);
  const [isSearching, setIsSearching] = useState(false);
  const [newsResult, setNewsResult] = useState<NewsSearchResult | null>(null);
  const [appliedHookIndex, setAppliedHookIndex] = useState<number | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setAppliedHookIndex(null);
    try {
      const result = await searchNewsWithGoogle({
        topic: currentTopic,
        query: searchQuery.trim(),
        industry,
        language,
      });
      setNewsResult(result);
    } catch (err) {
      console.error('Error fetching Google Search news:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleInsertHook = (hookText: string, index: number) => {
    if (onApplyHook) {
      onApplyHook(hookText);
      setAppliedHookIndex(index);
      setTimeout(() => setAppliedHookIndex(null), 3000);
    }
  };

  return (
    <div
      className={`bg-white rounded-3xl border border-slate-200/90 shadow-lg ${
        isInline ? 'p-5 sm:p-6' : 'p-6 max-w-3xl w-full mx-auto relative'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 text-[11px] font-bold uppercase tracking-wider mb-1">
            <Radio className="w-3.5 h-3.5 animate-pulse text-red-600" />
            <span>Google Search News & Real-Time Intelligence</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>
              {language === 'en'
                ? 'Brainstorm with Live Current Events'
                : 'ताजा खबरों और घटनाओं के साथ विचार मंथन'}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Live Web Connected" />
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'en'
              ? 'Pull breaking news, recent announcements, and verified facts via Google Search Grounding to craft timely, viral scripts.'
              : 'गूगल सर्च से वर्तमान घटनाएं, नए अपडेट्स और आंकड़े सीधे अपनी स्क्रिप्ट में शामिल करें।'}
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="my-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'en'
                ? 'Search recent news (e.g. Budget 2026, tech breakthroughs, market trends)...'
                : 'हालिया खबरें खोजें (उदा. नई नीतियां, सोलर सब्सिडी, टेक लॉन्च)...'
            }
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium"
          />
        </div>
        <button
          type="submit"
          disabled={isSearching || !searchQuery.trim()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 shrink-0"
        >
          {isSearching ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          <span>{isSearching ? 'Searching...' : language === 'en' ? 'Fetch News' : 'खोजें'}</span>
        </button>
      </form>

      {/* Suggested Quick Trends */}
      {!newsResult && !isSearching && (
        <div className="py-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl mx-auto bg-slate-100 text-slate-500 flex items-center justify-center">
            <Globe className="w-6 h-6 text-blue-600" />
          </div>
          <div className="max-w-md mx-auto">
            <h4 className="text-xs font-bold text-slate-800">
              {language === 'en' ? 'Connect Your Script to Current Headlines' : 'अपनी स्क्रिप्ट को आज की खबरों से जोड़ें'}
            </h4>
            <p className="text-[11px] text-slate-500 mt-1">
              {language === 'en'
                ? 'Click "Fetch News" or search a specific topic above to retrieve fresh statistics, viral hooks, and source citations.'
                : 'ऊपर "खोजें" बटन दबाकर वास्तविक समय की खबरें, आंकड़े और वायरल हुक प्राप्त करें।'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {[
              'Solar energy subsidies & rebates',
              'Creator economy trends 2026',
              'AI tools for video editing',
              'Health & morning routine habits',
            ].map((trend, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setSearchQuery(trend);
                  searchNewsWithGoogle({
                    topic: currentTopic,
                    query: trend,
                    industry,
                    language,
                  }).then(setNewsResult);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200/80 text-[11px] text-slate-600 hover:text-blue-700 transition-colors flex items-center gap-1.5"
              >
                <Flame className="w-3 h-3 text-amber-500" />
                <span>{trend}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isSearching && (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 animate-in fade-in">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center">
              <Search className="w-6 h-6 text-blue-600 animate-pulse" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">
              {language === 'en'
                ? `Scanning Google Search for "${searchQuery}"...`
                : `गूगल सर्च पर "${searchQuery}" से जुड़ी खबरें तलाशी जा रही हैं...`}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Extracting key statistics, viral hooks, and source links
            </p>
          </div>
        </div>
      )}

      {/* Search Results Display */}
      {newsResult && !isSearching && (
        <div className="space-y-5 animate-in fade-in">
          {/* Headline & Overview */}
          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                Verified Intelligence
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                {newsResult.providerNote || 'Live Google Search Grounding'}
              </span>
            </div>
            <h4 className="text-sm font-black text-slate-900 leading-snug">
              {newsResult.headline || `Recent Developments on ${newsResult.searchQuery}`}
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {newsResult.summary || newsResult.content?.slice(0, 280) + '...'}
            </p>
          </div>

          {/* Key Facts / Developments */}
          {newsResult.keyDevelopments && newsResult.keyDevelopments.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'en' ? 'Key Facts & Developments' : 'मुख्य तथ्य और आंकड़े'}</span>
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {newsResult.keyDevelopments.map((fact, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 flex items-start gap-2.5"
                  >
                    <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-[11px] leading-relaxed flex-1">{fact}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Hooks with 1-Click Insert */}
          {newsResult.recommendedHooks && newsResult.recommendedHooks.length > 0 && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  <span>
                    {language === 'en' ? 'High-Retention Video Hooks' : 'उच्च-प्रभाव वीडियो हुक'}
                  </span>
                </h5>
                <span className="text-[10px] text-slate-400">Click to insert into script</span>
              </div>

              <div className="space-y-2">
                {newsResult.recommendedHooks.map((h, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/80 hover:border-amber-300 transition-all flex items-center justify-between gap-3"
                  >
                    <p className="text-xs font-semibold text-slate-800 italic">"{h}"</p>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopy(h, `hook-${i}`)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-amber-100/60 transition-colors"
                        title="Copy Hook"
                      >
                        {copiedText === `hook-${i}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      {onApplyHook && (
                        <button
                          type="button"
                          onClick={() => handleInsertHook(h, i)}
                          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold shadow-2xs transition-all flex items-center gap-1"
                        >
                          {appliedHookIndex === i ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Inserted!</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3 h-3" />
                              <span>Use as Hook</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content Angles */}
          {newsResult.creatorAngles && newsResult.creatorAngles.length > 0 && (
            <div className="space-y-2 pt-1">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                <span>{language === 'en' ? 'Viral Content Angles' : 'वायरल कंटेंट एंगल्स'}</span>
              </h5>
              <div className="flex flex-wrap gap-2">
                {newsResult.creatorAngles.map((angle, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (onApplyTopic) onApplyTopic(`${angle}: ${newsResult.searchQuery}`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-700 text-xs font-semibold transition-all border border-slate-200/70 flex items-center gap-1.5"
                  >
                    <span>{angle}</span>
                    <ArrowRight className="w-3 h-3 opacity-60" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Grounding Source Citations (Mandatory for Google Search Grounding) */}
          {newsResult.sources && newsResult.sources.length > 0 && (
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-500" />
                  <span>Google Search Sources & Citations</span>
                </span>
                <span className="text-[10px] text-slate-400">Verified Web Links</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {newsResult.sources.map((src, idx) => (
                  <a
                    key={idx}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 text-slate-700 text-xs flex items-center justify-between group transition-colors"
                  >
                    <span className="truncate pr-2 font-medium">{src.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
