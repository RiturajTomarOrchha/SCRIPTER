import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useRole } from '../../context/RoleContext';
import { getTaxonomies, saveTaxonomy, toggleTaxonomyStatus } from '../../services/adminStorage';
import { IndustryTaxonomy } from '../../types';
import {
  Building2,
  Plus,
  Search,
  CheckCircle2,
  X,
  Edit2,
  Layers,
  FolderKanban,
  Check,
  Activity,
  GraduationCap,
  Cpu,
  TrendingUp,
  Utensils,
  Landmark,
  Film,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

const iconComponents: Record<string, React.ElementType> = {
  Activity,
  GraduationCap,
  Cpu,
  TrendingUp,
  Utensils,
  Landmark,
  Building2,
  Film,
};

interface AdminIndustriesPageProps {
  isMasterAdmin?: boolean;
}

export const AdminIndustriesPage: React.FC<AdminIndustriesPageProps> = ({ isMasterAdmin = false }) => {
  const { language } = useLanguage();
  const { role, userProfile } = useRole();
  const [taxonomies, setTaxonomies] = useState<IndustryTaxonomy[]>(() => getTaxonomies());
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaxonomy, setEditingTaxonomy] = useState<IndustryTaxonomy | null>(null);
  const [nameEn, setNameEn] = useState('');
  const [nameHi, setNameHi] = useState('');
  const [description, setDescription] = useState('');
  const [categoriesStr, setCategoriesStr] = useState('');
  const [iconName, setIconName] = useState('Building2');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const refreshList = () => {
    setTaxonomies(getTaxonomies());
  };

  const handleOpenModal = (tax?: IndustryTaxonomy) => {
    if (tax) {
      setEditingTaxonomy(tax);
      setNameEn(tax.nameEn);
      setNameHi(tax.nameHi);
      setDescription(tax.description);
      setCategoriesStr(tax.categories.join(', '));
      setIconName(tax.icon);
    } else {
      setEditingTaxonomy(null);
      setNameEn('');
      setNameHi('');
      setDescription('');
      setCategoriesStr('Sub-Category 1, Sub-Category 2');
      setIconName('Building2');
    }
    setIsModalOpen(true);
  };

  const handleSaveTaxonomy = (e: React.FormEvent) => {
    e.preventDefault();
    const categories = categoriesStr
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    saveTaxonomy(
      {
        id: editingTaxonomy ? editingTaxonomy.id : undefined,
        nameEn,
        nameHi,
        description,
        categories,
        icon: iconName,
      },
      userProfile.name || 'Admin',
      role
    );

    refreshList();
    setIsModalOpen(false);
    showToast(language === 'en' ? 'Industry taxonomy updated successfully!' : 'इंडस्ट्री टैक्सोनॉमी सुरक्षित हुई!');
  };

  const handleToggle = (id: string) => {
    toggleTaxonomyStatus(id, userProfile.name || 'Admin', role);
    refreshList();
    showToast(language === 'en' ? 'Industry active status toggled' : 'सक्रियता स्थिति बदली गई');
  };

  const filteredTaxonomies = taxonomies.filter(
    (t) =>
      t.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.nameHi.includes(searchQuery) ||
      t.categories.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
            <span className="p-1 rounded-md bg-purple-50 text-purple-600">
              <Building2 className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {language === 'en' ? 'Industry & Category Taxonomy' : 'इंडस्ट्री और कैटेगरी प्रबंधन'}
            </h1>
            <span
              className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-md uppercase tracking-wider ${
                isMasterAdmin ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-purple-100 text-purple-900'
              }`}
            >
              Platform Taxonomy
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'en'
              ? 'Configure industries, niches, and categories that power the Idea Engine, Script Studio, and Templates.'
              : 'क्रिएटर आइडिया और स्क्रिप्ट स्टूडियो को संचालित करने वाली इंडस्ट्री और सब-कैटेगरी का प्रबंधन करें।'}
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all shrink-0 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'en' ? 'Add Industry' : 'नई इंडस्ट्री जोड़ें'}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'en' ? 'Search industry name or sub-categories...' : 'इंडस्ट्री या कैटेगरी खोजें...'
            }
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Taxonomy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTaxonomies.map((tax) => {
          const IconComp = iconComponents[tax.icon] || Building2;
          return (
            <div
              key={tax.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                tax.isActive ? 'border-slate-200/90' : 'border-slate-200 opacity-60 bg-slate-50/50'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{tax.nameEn}</h3>
                        <span className="text-xs font-semibold text-purple-600 font-hindi">({tax.nameHi})</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{tax.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleToggle(tax.id)}
                      className={`p-1 rounded-lg text-xs font-bold transition-colors ${
                        tax.isActive ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'
                      }`}
                      title={tax.isActive ? 'Active Industry' : 'Disabled'}
                    >
                      {tax.isActive ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                    </button>
                    <button
                      onClick={() => handleOpenModal(tax)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit Industry"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Categories Pills */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Sub-Categories ({tax.categories.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {tax.categories.map((c, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 rounded-lg text-[11px] font-medium text-slate-700 transition-colors"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <strong>{tax.templatesCount}</strong> Templates
                </span>
                <span className="flex items-center gap-1">
                  <FolderKanban className="w-3.5 h-3.5 text-slate-400" />
                  <strong>{tax.projectsCount}</strong> Projects
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900">
              {editingTaxonomy ? 'Edit Industry Taxonomy' : 'Add New Industry Taxonomy'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Configured categories immediately populate creator dropdowns across all workflows.
            </p>

            <form onSubmit={handleSaveTaxonomy} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Industry Name (English)</label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    required
                    placeholder="e.g. Travel & Tourism"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Industry Name (Hindi)</label>
                  <input
                    type="text"
                    value={nameHi}
                    onChange={(e) => setNameHi(e.target.value)}
                    required
                    placeholder="उदा. यात्रा और पर्यटन"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Description / Audience Context</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Target creators and businesses in this niche"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Sub-Categories (Comma-separated)
                </label>
                <textarea
                  value={categoriesStr}
                  onChange={(e) => setCategoriesStr(e.target.value)}
                  rows={3}
                  required
                  placeholder="Budget Travel, Luxury Stays, Itinerary Guides, Trekking"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Separate each sub-category with a comma (,).
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Industry Taxonomy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
