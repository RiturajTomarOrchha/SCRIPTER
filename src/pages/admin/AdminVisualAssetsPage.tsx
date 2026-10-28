import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  adminStorage,
} from '../../services/adminStorage';
import { AdminVisualAsset } from '../../types';
import {
  Image,
  Video,
  Music,
  Type,
  Search,
  Filter,
  Plus,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Download,
  Tag,
  FolderOpen,
  Sparkles,
  Layers,
  X,
  Check,
  AlertCircle,
} from 'lucide-react';

interface AdminVisualAssetsPageProps {
  isMasterAdmin?: boolean;
}

export const AdminVisualAssetsPage: React.FC<AdminVisualAssetsPageProps> = ({ isMasterAdmin = false }) => {
  const { language } = useLanguage();
  const [assets, setAssets] = useState<AdminVisualAsset[]>(() => adminStorage.getAdminVisualAssets());
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'video' | 'audio' | 'image' | 'font' | 'graphic'>('all');
  const [licenseFilter, setLicenseFilter] = useState<'all' | 'free' | 'pro'>('all');
  const [selectedAsset, setSelectedAsset] = useState<AdminVisualAsset | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // New Asset Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<AdminVisualAsset['type']>('image');
  const [newCategory, setNewCategory] = useState('Backgrounds');
  const [newIndustry, setNewIndustry] = useState('Technology & SaaS');
  const [newLicense, setNewLicense] = useState<'free' | 'pro'>('free');
  const [newTags, setNewTags] = useState('tech, modern, corporate');
  const [newThumbnailUrl, setNewThumbnailUrl] = useState('https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60');

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (asset.tags || []).some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = typeFilter === 'all' || asset.type === typeFilter;
    const matchesLicense = licenseFilter === 'all' || asset.license === licenseFilter;
    return matchesSearch && matchesType && matchesLicense;
  });

  const handleToggleStatus = (asset: AdminVisualAsset) => {
    const updatedStatus = asset.status === 'active' ? 'archived' : 'active';
    const updated = { ...asset, status: updatedStatus as 'active' | 'archived' };
    adminStorage.saveAdminVisualAsset(
      updated,
      isMasterAdmin ? 'Master Admin' : 'Admin Operations',
      isMasterAdmin ? 'master-admin' : 'admin'
    );
    setAssets(adminStorage.getAdminVisualAssets());
    showToast(`Asset "${asset.title}" status changed to ${updatedStatus}`);
  };

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newAsset: AdminVisualAsset = {
      id: `ast-${Date.now()}`,
      title: newTitle.trim(),
      type: newType,
      category: newCategory,
      industry: newIndustry,
      license: newLicense,
      tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
      thumbnailUrl: newThumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60',
      fileSize: '4.2 MB',
      duration: newType === 'video' ? '0:15' : newType === 'audio' ? '1:45' : undefined,
      downloadsCount: 0,
      status: 'active',
      createdAt: '2026-10-28',
    };

    adminStorage.saveAdminVisualAsset(
      newAsset,
      isMasterAdmin ? 'Master Admin' : 'Admin Operations',
      isMasterAdmin ? 'master-admin' : 'admin'
    );
    setAssets(adminStorage.getAdminVisualAssets());
    setIsUploadModalOpen(false);
    showToast(`Visual asset "${newTitle}" published successfully.`);

    // Reset
    setNewTitle('');
    setNewTags('modern, 4k');
  };

  const getTypeIcon = (type: AdminVisualAsset['type']) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4 text-rose-500" />;
      case 'audio':
        return <Music className="w-4 h-4 text-emerald-500" />;
      case 'image':
        return <Image className="w-4 h-4 text-blue-500" />;
      case 'font':
        return <Type className="w-4 h-4 text-purple-500" />;
      case 'graphic':
        return <Layers className="w-4 h-4 text-amber-500" />;
      default:
        return <FolderOpen className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20 space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-lg animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-blue-50 text-blue-600">
              <Image className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {language === 'en' ? 'Visual Assets Management' : 'विज़ुअल एसेट प्रबंधन'}
            </h1>
            <span
              className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-md ${
                isMasterAdmin ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
              }`}
            >
              {isMasterAdmin ? 'Master Admin' : 'Content Media'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'en'
              ? 'Organize stock video clips, audio tracks, graphics, and font packs across industries.'
              : 'स्टॉक वीडियो, ऑडियो ट्रैक्स, ग्राफिक्स और फॉन्ट पैक्स का प्रबंधन करें।'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'en' ? 'Upload Asset' : 'एसेट अपलोड करें'}</span>
          </button>
        </div>
      </div>

      {/* Stats Quick Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Total Visual Assets</span>
          <p className="text-2xl font-black text-slate-900 font-mono mt-1">{assets.length}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Ready in Video Studio</span>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Stock B-Rolls</span>
          <p className="text-2xl font-black text-slate-900 font-mono mt-1">
            {assets.filter((a) => a.type === 'video').length}
          </p>
          <span className="text-[11px] text-blue-600 font-medium">4K & 1080p formats</span>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Audio Tracks</span>
          <p className="text-2xl font-black text-slate-900 font-mono mt-1">
            {assets.filter((a) => a.type === 'audio').length}
          </p>
          <span className="text-[11px] text-purple-600 font-medium">Royalty-free licensed</span>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Pro-Exclusive Items</span>
          <p className="text-2xl font-black text-slate-900 font-mono mt-1">
            {assets.filter((a) => a.license === 'pro').length}
          </p>
          <span className="text-[11px] text-amber-600 font-medium">Pro Tier unlock</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={language === 'en' ? 'Search by title, tag, or category...' : 'खोजें...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            {(['all', 'video', 'audio', 'image', 'graphic', 'font'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-2.5 py-1 rounded-lg font-semibold capitalize transition-all ${
                  typeFilter === type ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* License Filter */}
          <select
            value={licenseFilter}
            onChange={(e) => setLicenseFilter(e.target.value as any)}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Licenses</option>
            <option value="free">Free Tier</option>
            <option value="pro">Pro Exclusive</option>
          </select>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            {/* Asset Media Preview Header */}
            <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
              <img
                src={asset.thumbnailUrl}
                alt={asset.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

              {/* Type Badge */}
              <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
                {getTypeIcon(asset.type)}
                <span className="capitalize">{asset.type}</span>
              </div>

              {/* License Badge */}
              <div className="absolute top-2 right-2">
                {asset.license === 'pro' ? (
                  <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-3 h-3 fill-slate-950" />
                    <span>PRO</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/90 text-white font-bold text-[10px]">
                    FREE
                  </span>
                )}
              </div>

              {/* Duration or File size indicator */}
              <div className="absolute bottom-2 left-2 text-[10px] text-white/90 font-mono font-medium">
                {asset.duration ? asset.duration : asset.fileSize}
              </div>

              {/* Status Indicator */}
              <div className="absolute bottom-2 right-2">
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                    asset.status === 'active' ? 'bg-emerald-500/80 text-white' : 'bg-rose-500/80 text-white'
                  }`}
                >
                  {asset.status}
                </span>
              </div>
            </div>

            {/* Asset Details */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {asset.title}
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                  <span>{asset.category}</span>
                  <span>•</span>
                  <span>{asset.industry}</span>
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {(asset.tags || []).slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                  {(asset.tags || []).length > 3 && (
                    <span className="text-[10px] text-slate-400 self-center">
                      +{(asset.tags || []).length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-mono">
                  <Download className="w-3 h-3 text-slate-400" />
                  <span>{asset.downloadsCount.toLocaleString()} dl</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleStatus(asset)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                      asset.status === 'active'
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    {asset.status === 'active' ? 'Archive' : 'Activate'}
                  </button>

                  <button
                    onClick={() => setSelectedAsset(asset)}
                    className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                    title="Inspect Asset"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAssets.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Image className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900">No assets match your search</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria, license filter or upload a new visual asset to the library.
          </p>
        </div>
      )}

      {/* Asset Inspection Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                  {getTypeIcon(selectedAsset.type)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{selectedAsset.title}</h3>
                  <span className="text-xs text-slate-500 font-mono">ID: {selectedAsset.id}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedAsset(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-900">
              <img
                src={selectedAsset.thumbnailUrl}
                alt={selectedAsset.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-slate-400">Industry & Category</span>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {selectedAsset.category} • {selectedAsset.industry}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-slate-400">License Tier</span>
                <p className="font-bold text-slate-800 mt-0.5 uppercase tracking-wide">
                  {selectedAsset.license} Tier
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-slate-400">Dimensions / Duration</span>
                <p className="font-mono font-semibold text-slate-800 mt-0.5">
                  {selectedAsset.duration || 'Static Asset'} ({selectedAsset.fileSize})
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-slate-400">Platform Downloads</span>
                <p className="font-mono font-semibold text-slate-800 mt-0.5">
                  {selectedAsset.downloadsCount.toLocaleString()} times used
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedAsset(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Asset Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {language === 'en' ? 'Publish Visual Asset' : 'नया विज़ुअल एसेट जोड़ें'}
                  </h3>
                  <span className="text-xs text-slate-500">
                    Add media to Video Studio and Thumbnail Library
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAsset} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Asset Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern Glassmorphic Tech Abstract"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Asset Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="image">Image / Background</option>
                    <option value="video">B-Roll Video Clip</option>
                    <option value="audio">Music / Sound FX</option>
                    <option value="graphic">Graphic / Overlay</option>
                    <option value="font">Typography Font</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">License Tier</label>
                  <select
                    value={newLicense}
                    onChange={(e) => setNewLicense(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="free">Free Tier</option>
                    <option value="pro">Pro Exclusive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Industry</label>
                  <select
                    value={newIndustry}
                    onChange={(e) => setNewIndustry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="Technology & SaaS">Technology & SaaS</option>
                    <option value="Education & EdTech">Education & EdTech</option>
                    <option value="Business & Finance">Business & Finance</option>
                    <option value="Healthcare & Wellness">Healthcare & Wellness</option>
                    <option value="Entertainment & Creator">Entertainment & Creator</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Thumbnail Preview URL</label>
                <input
                  type="url"
                  value={newThumbnailUrl}
                  onChange={(e) => setNewThumbnailUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Search Tags (comma separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                >
                  Publish Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
