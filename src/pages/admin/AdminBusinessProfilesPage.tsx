import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useRole } from '../../context/RoleContext';
import {
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  Building2,
  Users,
  FolderKanban,
  Sparkles,
  ExternalLink,
  X,
  Shield,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface BusinessProfileAdminItem {
  id: string;
  name: string;
  creatorName: string;
  creatorEmail: string;
  industry: string;
  category: string;
  targetAudience: string;
  preferredTone: string;
  preferredLanguage: string;
  teamMembersCount: number;
  projectsCount: number;
  hasBrandKit: boolean;
  status: 'Verified' | 'Active' | 'Under Review';
}

const INITIAL_PROFILES: BusinessProfileAdminItem[] = [
  {
    id: 'bp_adm_01',
    name: 'Tech Duniya',
    creatorName: 'Rituraj Tomar',
    creatorEmail: 'riturajtomarorchha@gmail.com',
    industry: 'Technology & Education',
    category: 'Hindi Tech News & AI Reviews',
    targetAudience: 'Indian Youth, Students & Tech Enthusiasts',
    preferredTone: 'Authoritative & Engaging',
    preferredLanguage: 'Hindi / Hinglish',
    teamMembersCount: 5,
    projectsCount: 24,
    hasBrandKit: true,
    status: 'Verified',
  },
  {
    id: 'bp_adm_02',
    name: 'Ayur Health Plus',
    creatorName: 'Neha Singh',
    creatorEmail: 'neha.singh@ayurcare.org',
    industry: 'Healthcare & Wellness',
    category: 'Ayurvedic Remedies & Lifestyle',
    targetAudience: 'Families, Senior Citizens & Health Seekers',
    preferredTone: 'Empathetic & Educational',
    preferredLanguage: 'Hindi',
    teamMembersCount: 2,
    projectsCount: 12,
    hasBrandKit: true,
    status: 'Verified',
  },
  {
    id: 'bp_adm_03',
    name: 'Growth Academy India',
    creatorName: 'Amit Sharma',
    creatorEmail: 'amit.sharma@edutech.in',
    industry: 'Education & Coaching',
    category: 'Class 11-12 Physics & IIT-JEE',
    targetAudience: 'Students preparing for engineering exams',
    preferredTone: 'Motivational & Structured',
    preferredLanguage: 'Hinglish',
    teamMembersCount: 4,
    projectsCount: 18,
    hasBrandKit: false,
    status: 'Active',
  },
  {
    id: 'bp_adm_04',
    name: 'Gujarat Spices & Snacks',
    creatorName: 'Suresh Patel',
    creatorEmail: 'suresh.patel@gujaratspices.com',
    industry: 'Food & Hospitality',
    category: 'Packaged Snacks & Regional Delicacies',
    targetAudience: 'Food Lovers, Retail Buyers & Distributors',
    preferredTone: 'Enthusiastic & Culturally Rooted',
    preferredLanguage: 'Hindi / Gujarati',
    teamMembersCount: 8,
    projectsCount: 41,
    hasBrandKit: true,
    status: 'Verified',
  },
  {
    id: 'bp_adm_05',
    name: 'Delhi Metro Realty',
    creatorName: 'Karan Mehra',
    creatorEmail: 'karan@delhirealty.com',
    industry: 'Real Estate & Property',
    category: 'Luxury Apartments & Commercial Leases',
    targetAudience: 'High Net Worth Investors & First-time Homebuyers',
    preferredTone: 'Professional & Persuasive',
    preferredLanguage: 'English / Hindi',
    teamMembersCount: 3,
    projectsCount: 8,
    hasBrandKit: false,
    status: 'Under Review',
  },
];

interface AdminBusinessProfilesPageProps {
  isMasterAdmin?: boolean;
}

export const AdminBusinessProfilesPage: React.FC<AdminBusinessProfilesPageProps> = ({ isMasterAdmin = false }) => {
  const { language } = useLanguage();
  const [profiles, setProfiles] = useState<BusinessProfileAdminItem[]>(INITIAL_PROFILES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [inspectProfile, setInspectProfile] = useState<BusinessProfileAdminItem | null>(null);

  const filteredProfiles = useMemo(() => {
    return profiles.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.creatorEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesIndustry = selectedIndustry === 'all' || p.industry.toLowerCase().includes(selectedIndustry.toLowerCase());

      return matchesSearch && matchesIndustry;
    });
  }, [profiles, searchQuery, selectedIndustry]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-indigo-50 text-indigo-600">
              <Briefcase className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {language === 'en' ? 'Business Profile Registry' : 'बिज़नेस प्रोफ़ाइल रजिस्ट्री'}
            </h1>
            <span
              className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-md uppercase tracking-wider ${
                isMasterAdmin ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-indigo-100 text-indigo-900'
              }`}
            >
              {isMasterAdmin ? 'Governance' : 'Operations'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'en'
              ? 'Inspect creator brand identities, target demographics, and industry category alignments across all accounts.'
              : 'सभी खातों के अंतर्गत क्रिएटर ब्रांड पहचान और जनसांख्यिकीय सेटिंग्स का अवलोकन करें।'}
          </p>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Active Profiles: <strong className="text-slate-900">{profiles.length}</strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'en'
                ? 'Search business profile, creator, or niche...'
                : 'प्रोफ़ाइल नाम, क्रिएटर या श्रेणी से खोजें...'
            }
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
          >
            <option value="all">All Industries</option>
            <option value="technology">Technology & Education</option>
            <option value="healthcare">Healthcare & Wellness</option>
            <option value="food">Food & Hospitality</option>
            <option value="real estate">Real Estate</option>
          </select>
        </div>
      </div>

      {/* Profiles Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProfiles.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center shrink-0">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{p.name}</h3>
                    <div className="text-[11px] text-slate-500 font-medium">{p.industry}</div>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    p.status === 'Verified'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : p.status === 'Active'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {p.status}
                </span>
              </div>

              <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="text-slate-600">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Creator Account</span>
                  <span className="font-semibold text-slate-900">{p.creatorName}</span>
                  <span className="text-[11px] text-slate-400 block font-mono">{p.creatorEmail}</span>
                </div>

                <div className="text-slate-600">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Niche / Category</span>
                  <span className="text-slate-800 font-medium">{p.category}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Tone</span>
                    <span className="font-bold text-slate-800 text-[11px]">{p.preferredTone}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <span className="text-[10px] text-slate-400 block">Projects</span>
                    <span className="font-bold text-blue-600 text-[11px]">{p.projectsCount} Created</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                {p.teamMembersCount} Team Members
              </span>
              <button
                onClick={() => setInspectProfile(p)}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
              >
                <span>Inspect Dossier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Inspect Profile Drawer Modal */}
      {inspectProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setInspectProfile(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center text-lg">
                {inspectProfile.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{inspectProfile.name}</h3>
                <p className="text-xs text-slate-500">{inspectProfile.industry}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {inspectProfile.status}
                </span>
              </div>
            </div>

            <div className="py-4 space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Demographics</span>
                <p className="text-slate-800 leading-relaxed font-medium">{inspectProfile.targetAudience}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Language Mode</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">{inspectProfile.preferredLanguage}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Brand Kit Configured</span>
                  <span className="font-semibold text-slate-800 mt-0.5 block">
                    {inspectProfile.hasBrandKit ? 'Yes (Fonts & Colors Active)' : 'Not Created'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Creator Account Reference</span>
                <div className="font-bold text-slate-900 mt-0.5">{inspectProfile.creatorName}</div>
                <div className="text-slate-500 font-mono">{inspectProfile.creatorEmail}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setInspectProfile(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
