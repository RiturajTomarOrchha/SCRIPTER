import React, { useState, useMemo } from 'react';
import { ContentTemplate } from '../../types';
import { getTemplates } from '../../services/storage';
import { useLanguage } from '../../context/LanguageContext';
import {
  Layers,
  X,
  Search,
  Sparkles,
  Clock,
  Video,
  FileText,
  Check,
  ChevronRight,
  Eye,
  ArrowRight,
  Filter,
  CheckCircle2,
  Tag,
  AlertCircle,
  Play,
} from 'lucide-react';

interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (template: ContentTemplate) => void;
  currentIndustry?: string;
  hasExistingScriptContent?: boolean;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  isOpen,
  onClose,
  onApplyTemplate,
  currentIndustry,
  hasExistingScriptContent = false,
}) => {
  const { language } = useLanguage();
  const [templates] = useState<ContentTemplate[]>(() => getTemplates());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<'all' | 'reel' | 'long' | 'post'>('all');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<ContentTemplate | null>(null);
  const [confirmApply, setConfirmApply] = useState<boolean>(false);

  // Available industries
  const industries = useMemo(() => {
    const set = new Set<string>();
    templates.forEach((t) => {
      if (t.industry) set.add(t.industry);
    });
    return Array.from(set);
  }, [templates]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((tpl) => {
      if (selectedFormat !== 'all' && tpl.format !== selectedFormat) return false;
      if (selectedIndustry !== 'all' && tpl.industry !== selectedIndustry) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = tpl.title.toLowerCase().includes(query) || (tpl.titleHi && tpl.titleHi.toLowerCase().includes(query));
        const catMatch = tpl.category.toLowerCase().includes(query);
        const tagMatch = tpl.tags?.some((tag) => tag.toLowerCase().includes(query));
        if (!titleMatch && !catMatch && !tagMatch) return false;
      }
      return true;
    });
  }, [templates, selectedFormat, selectedIndustry, searchQuery]);

  if (!isOpen) return null;

  // Pick first template by default if none previewed
  const currentSelected = previewTemplate || filteredTemplates[0] || templates[0];

  const handleApplyClick = () => {
    if (!currentSelected) return;
    if (hasExistingScriptContent) {
      setConfirmApply(true);
    } else {
      onApplyTemplate(currentSelected);
      onClose();
    }
  };

  const handleConfirmApply = () => {
    if (currentSelected) {
      onApplyTemplate(currentSelected);
      setConfirmApply(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-5xl h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {language === 'en' ? 'Script Template Preview & Inspector' : 'स्क्रिप्ट टेम्पलेट प्रीव्यू और चयन'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-mono text-[11px] font-bold">
                  {filteredTemplates.length} {language === 'en' ? 'Templates' : 'टेम्पलेट्स'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {language === 'en'
                  ? 'Preview structural outlines, pacing, and visual storyboards before applying to your script editor.'
                  : 'अपने एडिटर में लागू करने से पहले टेम्पलेट की बनावट, टाइमिंग और सीन्स का विस्तृत प्रीव्यू देखें।'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-3 sm:px-5 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'en'
                  ? 'Search by title, topic, or keyword (e.g. Health, Checklist, Finance)...'
                  : 'शीर्षक या कीवर्ड से खोजें...'
              }
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 font-medium"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {/* Format filter */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl">
              <button
                onClick={() => setSelectedFormat('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  selectedFormat === 'all' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600'
                }`}
              >
                {language === 'en' ? 'All Formats' : 'सभी फॉर्मेट'}
              </button>
              <button
                onClick={() => setSelectedFormat('reel')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  selectedFormat === 'reel' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600'
                }`}
              >
                9:16 {language === 'en' ? 'Reels' : 'रील्स'}
              </button>
              <button
                onClick={() => setSelectedFormat('long')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  selectedFormat === 'long' ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600'
                }`}
              >
                16:9 {language === 'en' ? 'Video' : 'वीडियो'}
              </button>
            </div>

            {/* Industry filter */}
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-semibold focus:outline-hidden"
            >
              <option value="all">{language === 'en' ? 'All Industries' : 'सभी उद्योग'}</option>
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content Body: Left Template List, Right Deep Structural Preview */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left Column: Template Cards */}
          <div className="md:col-span-5 border-r border-slate-200 flex flex-col bg-slate-50/50 overflow-y-auto p-3 space-y-2.5">
            {filteredTemplates.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                {language === 'en' ? 'No templates match your search' : 'कोई टेम्पलेट नहीं मिला'}
              </div>
            ) : (
              filteredTemplates.map((tpl) => {
                const isSelected = currentSelected?.id === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => setPreviewTemplate(tpl)}
                    className={`p-3.5 rounded-2xl cursor-pointer border transition-all text-xs relative ${
                      isSelected
                        ? 'bg-white border-indigo-500 shadow-md ring-1 ring-indigo-500'
                        : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-white/90'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 relative">
                        {tpl.thumbnailUrl ? (
                          <img
                            src={tpl.thumbnailUrl}
                            alt={tpl.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <Video className="w-6 h-6" />
                          </div>
                        )}
                        <span className="absolute bottom-1 right-1 px-1 rounded bg-slate-900/80 text-white text-[9px] font-mono">
                          {tpl.aspectRatio}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[10px]">
                            {tpl.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            {tpl.duration}
                          </span>
                        </div>

                        <h4 className="font-bold text-slate-900 text-xs line-clamp-1">
                          {language === 'hi' && tpl.titleHi ? tpl.titleHi : tpl.title}
                        </h4>

                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {language === 'hi' && tpl.descriptionHi ? tpl.descriptionHi : tpl.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Complete Structure Preview */}
          <div className="md:col-span-7 flex flex-col bg-white overflow-hidden">
            {currentSelected ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Preview Action Header */}
                <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/40 flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                        {language === 'hi' && currentSelected.titleHi ? currentSelected.titleHi : currentSelected.title}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-bold">
                        {currentSelected.format === 'reel' ? 'Short Reel (9:16)' : 'Long Video (16:9)'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {currentSelected.industry} · {currentSelected.duration} · {currentSelected.targetAudience}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleApplyClick}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>{language === 'en' ? 'Apply to Script Editor' : 'एडिटर में लागू करें'}</span>
                  </button>
                </div>

                {/* Detailed Breakdown */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
                  {/* Summary Callout */}
                  <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 text-xs text-indigo-950 leading-relaxed">
                    <p className="font-bold mb-1 flex items-center gap-1.5 text-indigo-900">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{language === 'en' ? 'Template Structure & Flow' : 'टेम्पलेट बनावट और प्रवाह'}</span>
                    </p>
                    <p>
                      {language === 'hi' && currentSelected.descriptionHi
                        ? currentSelected.descriptionHi
                        : currentSelected.description}
                    </p>
                  </div>

                  {/* Script Outline Breakdown (Hook, Core, CTA) */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {language === 'en' ? 'Script Sections & Timing Blueprint' : 'स्क्रिप्ट संरचना और टाइमिंग ब्लूप्रिंट'}
                    </h4>

                    {currentSelected.scriptOutline && currentSelected.scriptOutline.length > 0 ? (
                      currentSelected.scriptOutline.map((point, idx) => {
                        const isHook = idx === 0;
                        const isCta = idx === currentSelected.scriptOutline.length - 1;
                        return (
                          <div
                            key={idx}
                            className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
                              isHook
                                ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                                : isCta
                                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                                : 'bg-blue-50/50 border-blue-200 text-blue-950'
                            }`}
                          >
                            <div className="flex items-center justify-between font-bold text-[11px]">
                              <span>
                                {isHook
                                  ? '⚡ Hook (0-5s)'
                                  : isCta
                                  ? '🎯 Conclusion & CTA (Last 15s)'
                                  : `💡 Content Block ${idx} (Value & Core)`}
                              </span>
                              <span className="text-[10px] font-mono opacity-75">
                                Step {idx + 1}
                              </span>
                            </div>
                            <p className="text-slate-800 font-medium leading-relaxed">
                              {point}
                            </p>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-400">
                        {language === 'en' ? 'Standard 3-part retention framework' : 'मानक 3-चरणीय स्क्रिप्ट रूपरेखा'}
                      </p>
                    )}
                  </div>

                  {/* Storyboard Visual Scenes */}
                  {currentSelected.visualScenes && currentSelected.visualScenes.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          {language === 'en' ? 'Storyboard Visual Scenes' : 'विजुअल सीन्स और शॉट्स'}
                        </h4>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {currentSelected.visualScenes.length} {language === 'en' ? 'scenes' : 'सीन्स'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {currentSelected.visualScenes.map((scene, sIdx) => (
                          <div
                            key={sIdx}
                            className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs"
                          >
                            <div className="w-12 h-12 rounded-xl bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                              <img
                                src={scene.imageUrl}
                                alt={scene.description}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                                {scene.timeRange}
                              </span>
                              <p className="font-medium text-slate-800 line-clamp-2 mt-1 text-[11px]">
                                {language === 'hi' && scene.descriptionHi ? scene.descriptionHi : scene.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {currentSelected.tags && currentSelected.tags.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-2">
                      <Tag className="w-3.5 h-3.5 text-slate-400" />
                      {currentSelected.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Confirmation Modal when replacing existing draft */}
        {confirmApply && currentSelected && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900">
                  {language === 'en' ? 'Apply This Template to Editor?' : 'क्या आप यह टेम्पलेट लागू करना चाहते हैं?'}
                </h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {language === 'en'
                    ? 'Applying this template will populate the Hook, Core Value, and CTA. A milestone snapshot of your current script will be automatically saved in Version History.'
                    : 'यह टेम्पलेट लागू करने पर हुक, मुख्य सामग्री और CTA अपडेट हो जाएंगे। सुरक्षित रहने के लिए वर्तमान स्क्रिप्ट का बैकअप अपने आप वर्जन हिस्ट्री में सेव हो जाएगा।'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmApply(false)}
                  className="py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100"
                >
                  {language === 'en' ? 'Cancel' : 'रद्द करें'}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmApply}
                  className="py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
                >
                  {language === 'en' ? 'Apply Template' : 'टेम्पलेट लागू करें'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
