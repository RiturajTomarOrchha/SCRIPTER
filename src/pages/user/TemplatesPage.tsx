import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useRole } from '../../context/RoleContext';
import { ContentTemplate, Project } from '../../types';
import { getTemplates, saveProject } from '../../services/storage';
import {
  Layers,
  Search,
  Filter,
  Sparkles,
  Play,
  Film,
  FileText,
  Clock,
  CheckCircle2,
  Lock,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Plus,
  X,
  Palette,
  Image as ImageIcon
} from 'lucide-react';

export const TemplatesPage: React.FC = () => {
  const { language } = useLanguage();
  const { activeBusinessProfile } = useRole();
  const navigate = useNavigate();

  const [templates, setTemplates] = useState<ContentTemplate[]>(() => getTemplates());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<'all' | 'reel' | 'long' | 'post'>('all');
  const [selectedAccess, setSelectedAccess] = useState<'all' | 'free' | 'premium'>('all');

  // Selected template for full detail modal (Poster 4 Screen 3)
  const [activeTemplate, setActiveTemplate] = useState<ContentTemplate | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState<boolean>(false);

  // Categories list derived from templates and active business profile
  const categoryFilters = [
    { id: 'all', labelEn: 'All Categories', labelHi: 'सभी श्रेणियां' },
    { id: 'Healthcare & Wellness', labelEn: 'Healthcare', labelHi: 'स्वास्थ्य' },
    { id: 'Education & Training', labelEn: 'Education', labelHi: 'शिक्षा' },
    { id: 'News & Media', labelEn: 'News & Media', labelHi: 'मीडिया' },
    { id: 'Tech & Software', labelEn: 'Tech & Startups', labelHi: 'टेक्नोलॉजी' },
    { id: 'Real Estate', labelEn: 'Real Estate', labelHi: 'रियल एस्टेट' },
    { id: 'Hospitality', labelEn: 'Food & Recipes', labelHi: 'खान-पान' },
  ];

  const filteredTemplates = useMemo(() => {
    return templates.filter((tpl) => {
      // Category filter
      if (selectedCategory !== 'all' && tpl.industry !== selectedCategory) {
        return false;
      }
      // Format filter
      if (selectedFormat !== 'all' && tpl.format !== selectedFormat) {
        return false;
      }
      // Access filter
      if (selectedAccess === 'free' && tpl.isPremium) return false;
      if (selectedAccess === 'premium' && !tpl.isPremium) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle =
          tpl.title.toLowerCase().includes(q) ||
          tpl.titleHi.toLowerCase().includes(q) ||
          tpl.description.toLowerCase().includes(q);
        const matchTags = tpl.tags.some((t) => t.toLowerCase().includes(q));
        return matchTitle || matchTags;
      }
      return true;
    });
  }, [templates, selectedCategory, selectedFormat, selectedAccess, searchQuery]);

  // Use Template in Script Studio
  const handleUseInScriptStudio = (tpl: ContentTemplate) => {
    navigate('/user/script-studio', {
      state: {
        prefilledTopic: tpl.title,
        industry: tpl.industry,
        category: tpl.category,
        templateId: tpl.id,
      },
    });
  };

  // Create Project directly from Template
  const handleCreateProjectFromTemplate = (tpl: ContentTemplate) => {
    const newProject = saveProject({
      title: tpl.title,
      titleHi: tpl.titleHi,
      industry: tpl.industry,
      category: tpl.category,
      format: tpl.format === 'long' ? 'long' : 'reel',
      duration: tpl.duration,
      status: 'in_progress',
      scriptSnippet: tpl.scriptOutline[0] || '',
      appliedTemplateId: tpl.id,
      scenes: tpl.visualScenes || [],
      scriptVersions: [
        {
          version: 1,
          updatedAt: new Date().toISOString(),
          hook: tpl.scriptOutline[0] || tpl.title,
          mainContent: tpl.scriptOutline.slice(1, -1),
          closing: tpl.scriptOutline[tpl.scriptOutline.length - 1] || 'Follow for more!',
        },
      ],
      notes: `Created from template: ${tpl.title}`,
    });

    setActiveTemplate(null);
    navigate('/user/projects');
  };

  // Open Thumbnail Studio with Template
  const handleOpenInThumbnailStudio = (tpl: ContentTemplate) => {
    navigate('/user/thumbnail-studio', {
      state: {
        templateId: tpl.id,
        headline: tpl.title,
        aspectRatio: tpl.aspectRatio === '16:9' ? '16:9' : '9:16',
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      {/* 1. Header Banner (Poster 4 Screen 1 & 2) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
                <Layers className="w-5 h-5 text-amber-600" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {language === 'en' ? 'Templates & Creative Packs' : 'टेम्पलेट्स एवं विजुअल पैक्स'}
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                Phase 4
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {language === 'en'
                ? `High-performing video and graphic templates tailored for ${activeBusinessProfile.name}.`
                : 'आपकी चुनी हुई श्रेणी के अनुसार तैयार पेशेवर वीडियो, स्क्रिप्ट और थंबनेल टेम्पलेट्स।'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => navigate('/user/brand-kit')}
              className="px-4 py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors"
            >
              <Palette className="w-4 h-4 text-purple-600" />
              <span>{language === 'en' ? 'Brand Kit' : 'ब्रांड किट'}</span>
            </button>
            <button
              onClick={() => navigate('/user/thumbnail-studio')}
              className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-98 text-slate-950 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs"
            >
              <ImageIcon className="w-4 h-4" />
              <span>{language === 'en' ? 'Create Thumbnail' : 'थंबनेल बनाएं'}</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-5 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'en'
                  ? 'Search templates by keyword, topic, or format...'
                  : 'टेम्पलेट का नाम, विषय या प्रारूप खोजें...'
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
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

          {/* Industry Category Filter Chips (Poster 4 Screen 2) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categoryFilters.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  {language === 'en' ? cat.labelEn : cat.labelHi}
                </button>
              );
            })}
          </div>

          {/* Secondary Filter Row: Format & Access */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Format:</span>
              {[
                { id: 'all', label: 'All' },
                { id: 'reel', label: 'Reels / Shorts (9:16)' },
                { id: 'long', label: 'Video (16:9)' },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => setSelectedFormat(fmt.id as any)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    selectedFormat === fmt.id
                      ? 'bg-slate-800 text-white font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Plan:</span>
              {[
                { id: 'all', label: 'All' },
                { id: 'free', label: 'Free' },
                { id: 'premium', label: 'Premium 👑' },
              ].map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => setSelectedAccess(acc.id as any)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    selectedAccess === acc.id
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Templates Grid (Poster 4 Screen 2) */}
      {filteredTemplates.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-xs max-w-md mx-auto space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Layers className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {language === 'en' ? 'No templates found' : 'कोई टेम्पलेट नहीं मिला'}
          </h3>
          <p className="text-xs text-slate-500">
            {language === 'en'
              ? 'Try adjusting your filters or search keywords to discover more creative templates.'
              : 'कृपया अलग श्रेणी चुनें या सर्च कीवर्ड बदलें।'}
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedFormat('all');
              setSelectedAccess('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTemplates.map((template) => {
            return (
              <div
                key={template.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Thumbnail Preview Area */}
                <div className="relative aspect-video bg-slate-900 overflow-hidden cursor-pointer" onClick={() => setActiveTemplate(template)}>
                  <img
                    src={template.thumbnailUrl}
                    alt={template.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-bold border border-white/10">
                      {template.category}
                    </span>
                    {template.isPremium ? (
                      <span className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center gap-1 shadow-xs">
                        <Sparkles className="w-3 h-3 fill-slate-950" />
                        <span>Premium</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/90 text-white font-bold text-[10px]">
                        Free
                      </span>
                    )}
                  </div>

                  {/* Center Play Indicator */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white/90 text-slate-950 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                    </div>
                  </div>

                  {/* Bottom Duration & Ratio */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px] font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-300" />
                      <span>{template.duration}</span>
                    </span>
                    <span className="bg-white/20 px-2 py-0.5 rounded font-bold">
                      {template.aspectRatio}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {language === 'hi' && template.titleHi ? template.titleHi : template.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {language === 'hi' && template.descriptionHi
                        ? template.descriptionHi
                        : template.description}
                    </p>
                  </div>

                  {/* Included Content Features */}
                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-500">
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span>{template.scriptOutline.length} Scenes Script</span>
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Film className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Visual Pack</span>
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => setActiveTemplate(template)}
                      className="py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-colors"
                    >
                      {language === 'en' ? 'Preview' : 'विवरण देखें'}
                    </button>
                    <button
                      onClick={() => {
                        if (template.isPremium) {
                          setShowPremiumModal(true);
                        } else {
                          handleUseInScriptStudio(template);
                        }
                      }}
                      className="py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center justify-center gap-1 transition-colors shadow-2xs"
                    >
                      <span>{language === 'en' ? 'Use Template' : 'उपयोग करें'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Template Details Modal (Poster 4 Screen 3) */}
      {activeTemplate && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  {activeTemplate.category} · {activeTemplate.duration}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  {language === 'hi' && activeTemplate.titleHi
                    ? activeTemplate.titleHi
                    : activeTemplate.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveTemplate(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Preview Box */}
            <div className="rounded-2xl overflow-hidden bg-black aspect-video relative border border-slate-800">
              {activeTemplate.previewVideoUrl ? (
                <video
                  src={activeTemplate.previewVideoUrl}
                  controls
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={activeTemplate.thumbnailUrl}
                  alt={activeTemplate.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* What's Included Section (Poster 4 Screen 3) */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {language === 'en' ? 'What is Included in this Template' : 'इस टेम्पलेट में शामिल है:'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-800">Script Structure</p>
                    <p className="text-[11px] text-slate-500">{activeTemplate.scriptOutline.length} timed hook & content scenes</p>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-800">Visual Pack & B-Roll</p>
                    <p className="text-[11px] text-slate-500">{activeTemplate.visualAssetsCount} photo & video recommendations</p>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-800">Title & Subtitle Style</p>
                    <p className="text-[11px] text-slate-500">{activeTemplate.recommendedTitleStyle || 'Viral Yellow'}</p>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-800">Engagement CTA</p>
                    <p className="text-[11px] text-slate-500">Closing formula to drive saves & shares</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Script Outline Snippet */}
            <div className="space-y-1.5 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs">
              <p className="font-bold text-amber-900 uppercase text-[11px]">Recommended Script Flow:</p>
              <ul className="space-y-1 text-slate-800">
                {activeTemplate.scriptOutline.map((line, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => handleOpenInThumbnailStudio(activeTemplate)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors w-full sm:w-auto"
              >
                Create Thumbnail from Template
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleCreateProjectFromTemplate(activeTemplate)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors w-full sm:w-auto"
                >
                  Create Project
                </button>
                <button
                  onClick={() => handleUseInScriptStudio(activeTemplate)}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors w-full sm:w-auto"
                >
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>Start in Script Studio</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Premium Upgrade Modal State (Poster 1 Additional States) */}
      {showPremiumModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <Sparkles className="w-7 h-7 fill-amber-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {language === 'en' ? 'Premium Creator Template' : 'प्रीमियम टेम्पलेट'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'en'
                  ? 'This template includes professional visual packs and advanced structure available on Pro & Business plans.'
                  : 'यह एक प्रीमियम टेम्पलेट है। इसका उपयोग करने के लिए अपना प्लान अपग्रेड करें।'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setShowPremiumModal(false)}
                className="py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowPremiumModal(false);
                  navigate('/user/subscription');
                }}
                className="py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-xs"
              >
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
