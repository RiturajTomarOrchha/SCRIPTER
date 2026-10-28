import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import { useLanguage } from '../../context/LanguageContext';
import { BusinessProfile } from '../../types';
import {
  Briefcase,
  Plus,
  CheckCircle2,
  ChevronRight,
  Settings,
  Sparkles,
  Search,
  Trash2,
  Edit2,
  HeartPulse,
  Tv,
  GraduationCap,
  Cpu,
  Utensils,
  Building,
  Globe,
  Sliders,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react';

export const BusinessProfilesPage: React.FC = () => {
  const {
    businessProfiles,
    activeBusinessProfile,
    setActiveBusinessProfile,
    addBusinessProfile,
    updateBusinessProfile,
    removeBusinessProfile,
  } = useRole();
  const { language } = useLanguage();
  const navigate = useNavigate();

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState<BusinessProfile | null>(null);
  const [profileToDelete, setProfileToDelete] = useState<BusinessProfile | null>(null);

  // Create Form State
  const [createIndustry, setCreateIndustry] = useState('Healthcare & Wellness');
  const [createName, setCreateName] = useState('');
  const [createCategory, setCreateCategory] = useState('');
  const [createTargetAudience, setCreateTargetAudience] = useState('');
  const [createTone, setCreateTone] = useState('Educational & Empathetic');

  // Edit Form State
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editTone, setEditTone] = useState('');

  const industries = [
    { id: 'Healthcare & Wellness', labelEn: 'Health & Wellness', labelHi: 'हेल्थ व वेलनेस', icon: HeartPulse },
    { id: 'News & Media', labelEn: 'Media & Entertainment', labelHi: 'न्यूज़ व मीडिया', icon: Tv },
    { id: 'Education & Training', labelEn: 'Education', labelHi: 'शिक्षा व कोचिंग', icon: GraduationCap },
    { id: 'Tech & Software', labelEn: 'IT & Technology', labelHi: 'टेक्नोलॉजी व सॉफ्टवेयर', icon: Cpu },
    { id: 'Hospitality', labelEn: 'Food & Lifestyle', labelHi: 'खान-पान व लाइफस्टाइल', icon: Utensils },
    { id: 'Real Estate', labelEn: 'Real Estate', labelHi: 'रियल एस्टेट', icon: Building },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName.trim()) return;

    addBusinessProfile({
      name: createName.trim(),
      industry: createIndustry,
      category: createCategory.trim() || 'General Services',
      targetAudience: createTargetAudience.trim() || 'General Audience',
      preferredTone: createTone,
      preferredLanguage: 'Hindi / English',
    });

    setCreateName('');
    setCreateCategory('');
    setCreateTargetAudience('');
    setShowCreateModal(false);
  };

  const handleStartEdit = (prof: BusinessProfile) => {
    setEditingProfile(prof);
    setEditName(prof.name);
    setEditCategory(prof.category);
    setEditTone(prof.preferredTone);
  };

  const handleSaveEdit = () => {
    if (!editingProfile || !editName.trim()) return;
    updateBusinessProfile({
      ...editingProfile,
      name: editName.trim(),
      category: editCategory.trim(),
      preferredTone: editTone,
    });
    setEditingProfile(null);
  };

  const handleDelete = () => {
    if (!profileToDelete) return;
    removeBusinessProfile(profileToDelete.id);
    setProfileToDelete(null);
    if (editingProfile?.id === profileToDelete.id) {
      setEditingProfile(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-100 text-blue-700">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {language === 'en' ? 'Business Profiles' : 'बिज़नेस प्रोफ़ाइल प्रबंधन'}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {language === 'en'
                ? 'Create customized creator profiles tailored to distinct industries and audiences.'
                : 'एक से अधिक बिज़नेस प्रोफ़ाइल बनाएं — अलग-अलग उद्योगों के अनुसार कंटेंट सुझाव पाएं।'}
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-98 text-slate-950 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{language === 'en' ? 'Add New Profile' : 'नया प्रोफ़ाइल बनाएं'}</span>
          </button>
        </div>
      </div>

      {/* Profiles List */}
      <div className="space-y-3">
        {businessProfiles.map((prof) => {
          const isActive = prof.id === activeBusinessProfile.id;

          return (
            <div
              key={prof.id}
              className={`bg-white rounded-2xl p-5 border transition-all ${
                isActive
                  ? 'border-blue-500 ring-2 ring-blue-500/10 shadow-xs'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-base shrink-0 ${
                      isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Briefcase className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900">{prof.name}</h3>
                      {isActive && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200/60">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{language === 'en' ? 'Active Profile' : 'सक्रिय प्रोफ़ाइल'}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{prof.category}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2 flex-wrap">
                      <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                        {prof.industry}
                      </span>
                      <span>·</span>
                      <span>{prof.targetAudience}</span>
                      <span>·</span>
                      <span className="text-blue-600 font-medium">{prof.preferredTone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                  <button
                    onClick={() => handleStartEdit(prof)}
                    className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center"
                    title="Profile Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </button>

                  {isActive ? (
                    <button
                      onClick={() => navigate('/user/home')}
                      className="min-h-[44px] px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      {language === 'en' ? 'Open Home' : 'होम देखें'}
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveBusinessProfile(prof)}
                      className="min-h-[44px] px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-bold shadow-xs transition-colors"
                    >
                      {language === 'en' ? 'Switch to this' : 'यह प्रोफाइल चुनें'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Tip Box */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
        <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">
            {language === 'en'
              ? 'Multi-Profile Personalization'
              : 'मल्टी-प्रोफ़ाइल पर्सनलाइजेशन'}
          </p>
          <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
            {language === 'en'
              ? 'Switching your active profile updates your Home Dashboard recommendations, trending content topics, and AI script inputs automatically.'
              : 'सक्रिय प्रोफ़ाइल बदलने पर आपके होम डैशबोर्ड और आइडिया इंजन के सुझाव अपने आप उस उद्योग के अनुसार अपडेट हो जाते हैं।'}
          </p>
        </div>
      </div>

      {/* Create Profile Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {language === 'en' ? 'Create Business Profile' : 'नया बिज़नेस प्रोफ़ाइल बनाएं'}
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              {/* Step 1: Industry Selector */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-2">
                  1. {language === 'en' ? 'Choose Industry' : 'उद्योग चुनें'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {industries.map((ind) => {
                    const isSelected = createIndustry === ind.id;
                    const Icon = ind.icon;
                    return (
                      <button
                        key={ind.id}
                        type="button"
                        onClick={() => setCreateIndustry(ind.id)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <Icon className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                        <span className="text-[11px] block leading-tight">
                          {language === 'en' ? ind.labelEn : ind.labelHi}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Details */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    2. {language === 'en' ? 'Profile Name' : 'प्रोफ़ाइल का नाम'}
                  </label>
                  <input
                    type="text"
                    required
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    placeholder={
                      language === 'en' ? 'e.g. Apex Dental Clinic' : 'जैसे: अपेक्स डेंटल क्लिनिक'
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    {language === 'en' ? 'Category / Description' : 'कैटेगरी / विवरण'}
                  </label>
                  <input
                    type="text"
                    value={createCategory}
                    onChange={(e) => setCreateCategory(e.target.value)}
                    placeholder="e.g. Dental Care, Oral Health Advice"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    {language === 'en' ? 'Target Audience' : 'लक्षित दर्शक'}
                  </label>
                  <input
                    type="text"
                    value={createTargetAudience}
                    onChange={(e) => setCreateTargetAudience(e.target.value)}
                    placeholder="e.g. Local patients, families, youth"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  {language === 'en' ? 'Cancel' : 'रद्द करें'}
                </button>
                <button
                  type="submit"
                  disabled={!createName.trim()}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs disabled:opacity-50"
                >
                  {language === 'en' ? 'Create & Activate' : 'प्रोफ़ाइल बनाएं'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Settings Modal */}
      {editingProfile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Settings className="w-4 h-4 text-blue-600" />
                <span>{language === 'en' ? 'Profile Settings' : 'प्रोफ़ाइल सेटिंग्स'}</span>
              </h3>
              <button
                onClick={() => setEditingProfile(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Profile Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Category / Description
                </label>
                <input
                  type="text"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Preferred Tone
                </label>
                <input
                  type="text"
                  value={editTone}
                  onChange={(e) => setEditTone(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900"
                />
              </div>

              {businessProfiles.length > 1 && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const toDelete = editingProfile;
                      setEditingProfile(null);
                      setProfileToDelete(toDelete);
                    }}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete this profile</span>
                  </button>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setEditingProfile(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {profileToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                Delete "{profileToDelete.name}"?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                This will remove the profile. Projects created under this profile will remain safe.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setProfileToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
