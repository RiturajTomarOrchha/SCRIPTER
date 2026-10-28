import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useRole } from '../../context/RoleContext';
import { DEMO_TEMPLATES } from '../../data/mockData';
import { ContentTemplate } from '../../types';
import { addAuditLog } from '../../services/adminStorage';
import {
  Library,
  Search,
  Filter,
  Plus,
  Crown,
  Sparkles,
  Layers,
  Edit2,
  CheckCircle2,
  Clock,
  X,
  Check,
  Film,
  Video,
  FileText,
  Eye,
  Sliders,
} from 'lucide-react';

interface AdminTemplatesPageProps {
  isMasterAdmin?: boolean;
}

export const AdminTemplatesPage: React.FC<AdminTemplatesPageProps> = ({ isMasterAdmin = false }) => {
  const { language } = useLanguage();
  const { role, userProfile } = useRole();
  const [templates, setTemplates] = useState<ContentTemplate[]>(DEMO_TEMPLATES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [inspectTemplate, setInspectTemplate] = useState<ContentTemplate | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Template form state
  const [newTitle, setNewTitle] = useState('');
  const [newTitleHi, setNewTitleHi] = useState('');
  const [newIndustry, setNewIndustry] = useState('Healthcare & Wellness');
  const [newCategory, setNewCategory] = useState('Preventive Health');
  const [newFormat, setNewFormat] = useState<'reel' | 'long' | 'short' | 'post'>('reel');
  const [newDuration, setNewDuration] = useState('30s');
  const [newIsPremium, setNewIsPremium] = useState(true);
  const [newDescription, setNewDescription] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredTemplates = templates.filter((tpl) => {
    const matchesSearch =
      tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.titleHi.includes(searchQuery) ||
      tpl.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFormat = selectedFormat === 'all' || tpl.format === selectedFormat;
    const matchesIndustry = selectedIndustry === 'all' || tpl.industry.toLowerCase().includes(selectedIndustry.toLowerCase());

    return matchesSearch && matchesFormat && matchesIndustry;
  });

  const handleAddTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    const created: ContentTemplate = {
      id: `tpl_${Date.now()}`,
      title: newTitle,
      titleHi: newTitleHi || newTitle,
      category: newCategory,
      industry: newIndustry,
      format: newFormat,
      aspectRatio: newFormat === 'reel' ? '9:16' : '16:9',
      duration: newDuration,
      thumbnailUrl: '/assets/aistudio/HEADER_LOGO_f8b18f40.png',
      isPremium: newIsPremium,
      targetAudience: 'General Creators',
      description: newDescription,
      descriptionHi: newDescription,
      scriptOutline: [
        '0-3s: Provocative Hook with visual pattern interrupt',
        '4-15s: Core insight or mistake explanation',
        '16-25s: 3-step actionable remedy',
        '26-30s: Strong CTA: Save & follow for more tips',
      ],
      visualAssetsCount: 4,
      visualScenes: [],
      tags: ['trending', newFormat],
    };

    setTemplates([created, ...templates]);
    addAuditLog('TEMPLATE_CREATE', created.title, `Added ${created.format} template for ${created.industry}`, userProfile.name || 'Admin', role);
    setIsAddModalOpen(false);
    showToast(language === 'en' ? 'Template added to platform catalog!' : 'टेम्पलेट सफलतापूर्वक कैटलॉग में जोड़ा गया!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20 space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#0B132B] text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-slate-700 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-blue-50 text-blue-600">
              <Library className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {language === 'en' ? 'Template Library Catalog' : 'टेम्पलेट लाइब्रेरी प्रबंधन'}
            </h1>
            <span
              className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-md uppercase tracking-wider ${
                isMasterAdmin ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-blue-100 text-blue-900'
              }`}
            >
              Content Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'en'
              ? 'Curate high-converting script, reel, and video templates mapped to specific industries.'
              : 'सभी इंडस्ट्रीज के लिए उच्च गुणवत्ता वाले वीडियो और स्क्रिप्ट टेम्पलेट्स का प्रबंधन करें।'}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all shrink-0 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'en' ? 'Create Template' : 'नया टेम्पलेट बनाएं'}</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'en'
                ? 'Search templates by title, hook, or niche...'
                : 'टेम्पलेट शीर्षक या श्रेणी से खोजें...'
            }
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Format:</span>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
            >
              <option value="all">All Formats</option>
              <option value="reel">9:16 Reel / Short</option>
              <option value="long">16:9 Long Video</option>
              <option value="post">Graphic Post</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Industry:</span>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
            >
              <option value="all">All Industries</option>
              <option value="healthcare">Healthcare & Wellness</option>
              <option value="education">Education & Coaching</option>
              <option value="technology">IT & Technology</option>
              <option value="marketing">Digital Marketing</option>
            </select>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    tpl.format === 'reel'
                      ? 'bg-purple-100 text-purple-800'
                      : tpl.format === 'long'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {tpl.format.toUpperCase()} · {tpl.duration}
                </span>

                <div className="flex items-center gap-1">
                  {tpl.isPremium ? (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full flex items-center gap-1">
                      <Crown className="w-3 h-3 fill-amber-500" />
                      <span>Pro</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-full">
                      Free
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-3">
                <h3 className="text-sm font-bold text-slate-900 leading-snug">{tpl.title}</h3>
                <h4 className="text-xs text-purple-600 font-semibold mt-0.5 font-hindi">{tpl.titleHi}</h4>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{tpl.description}</p>
              </div>

              <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-medium text-slate-700">{tpl.industry}</span>
                <span className="font-mono">{tpl.aspectRatio}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">{tpl.scriptOutline.length} Scene Blocks</span>
              <button
                onClick={() => setInspectTemplate(tpl)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Outline</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Inspect Template Modal */}
      {inspectTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setInspectTemplate(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{inspectTemplate.title}</h3>
                <h4 className="text-xs text-purple-600 font-semibold font-hindi">{inspectTemplate.titleHi}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-500">{inspectTemplate.industry}</span>
                  <span>•</span>
                  <span className="text-xs text-slate-500 font-mono">{inspectTemplate.aspectRatio} ({inspectTemplate.duration})</span>
                </div>
              </div>
            </div>

            <div className="py-4 space-y-3.5 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description</span>
                <p className="text-slate-700 leading-relaxed mt-1">{inspectTemplate.description}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Script Scene Architecture ({inspectTemplate.scriptOutline.length} Beats)
                </span>
                <div className="space-y-2">
                  {inspectTemplate.scriptOutline.map((beat, i) => (
                    <div key={i} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-slate-800 leading-relaxed font-medium">{beat}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setInspectTemplate(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Template Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Library className="w-5 h-5 text-blue-600" />
              <span>Create New Content Template</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Author and publish a structured blueprint for creator video generation.
            </p>

            <form onSubmit={handleAddTemplate} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Title (English)</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    placeholder="e.g. 3 Winter Immunity Mistakes"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Title (Hindi)</label>
                  <input
                    type="text"
                    value={newTitleHi}
                    onChange={(e) => setNewTitleHi(e.target.value)}
                    placeholder="उदा. सर्दियों की 3 गलतियां"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Industry</label>
                  <select
                    value={newIndustry}
                    onChange={(e) => setNewIndustry(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none"
                  >
                    <option value="Healthcare & Wellness">Healthcare & Wellness</option>
                    <option value="Education & Coaching">Education & Coaching</option>
                    <option value="IT & Technology">IT & Technology</option>
                    <option value="Digital Marketing & Business">Digital Marketing</option>
                    <option value="Food & Recipe">Food & Recipe</option>
                    <option value="Personal Finance & Wealth">Personal Finance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Format & Duration</label>
                  <div className="flex gap-2">
                    <select
                      value={newFormat}
                      onChange={(e) => setNewFormat(e.target.value as any)}
                      className="w-2/3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none font-medium"
                    >
                      <option value="reel">9:16 Reel</option>
                      <option value="long">16:9 Long Video</option>
                      <option value="post">Graphic Post</option>
                    </select>
                    <input
                      type="text"
                      value={newDuration}
                      onChange={(e) => setNewDuration(e.target.value)}
                      placeholder="30s"
                      className="w-1/3 px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-center font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Description</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={2}
                  required
                  placeholder="Outline what makes this template viral and engaging..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="proCheck"
                  checked={newIsPremium}
                  onChange={(e) => setNewIsPremium(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <label htmlFor="proCheck" className="text-slate-700 font-medium cursor-pointer">
                  Require Pro / Business Plan (Premium Template)
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Publish Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
