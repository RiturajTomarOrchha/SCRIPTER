import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useRole } from '../../context/RoleContext';
import { BrandKit } from '../../types';
import {
  getStoredBusinessProfiles,
  getBrandKitForProfile,
  saveBrandKit,
} from '../../services/storage';
import {
  Palette,
  Upload,
  Save,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  ChevronDown,
  Layers,
  Image as ImageIcon,
  Type,
  Eye,
  ShieldCheck,
  RefreshCw,
  HelpCircle
} from 'lucide-react';

export const BrandKitPage: React.FC = () => {
  const { language } = useLanguage();
  const { activeBusinessProfile, setActiveBusinessProfile } = useRole();
  const navigate = useNavigate();

  const businessProfiles = getStoredBusinessProfiles();
  const [selectedProfileId, setSelectedProfileId] = useState<string>(activeBusinessProfile.id);

  // Load Brand Kit for selected profile
  const [currentKit, setCurrentKit] = useState<BrandKit>(() =>
    getBrandKitForProfile(activeBusinessProfile.id)
  );

  // Form Fields
  const [brandName, setBrandName] = useState<string>(currentKit.brandName);
  const [tagline, setTagline] = useState<string>(currentKit.tagline || '');
  const [logoUrl, setLogoUrl] = useState<string>(currentKit.logoUrl || '/assets/aistudio/Square_Scripter_Logo_d7bb9aeb.png');
  const [primaryColor, setPrimaryColor] = useState<string>(currentKit.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState<string>(currentKit.secondaryColor);
  const [accentColor, setAccentColor] = useState<string>(currentKit.accentColor);
  const [backgroundColor, setBackgroundColor] = useState<string>(currentKit.backgroundColor);
  const [textColor, setTextColor] = useState<string>(currentKit.textColor);
  const [fontFamily, setFontFamily] = useState<string>(currentKit.fontFamily);
  const [watermarkEnabled, setWatermarkEnabled] = useState<boolean>(currentKit.watermarkEnabled);
  const [watermarkPosition, setWatermarkPosition] = useState<
    'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  >(currentKit.watermarkPosition);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Reload when switching profile
  useEffect(() => {
    const kit = getBrandKitForProfile(selectedProfileId);
    setCurrentKit(kit);
    setBrandName(kit.brandName);
    setTagline(kit.tagline || '');
    setLogoUrl(kit.logoUrl || '/assets/aistudio/Square_Scripter_Logo_d7bb9aeb.png');
    setPrimaryColor(kit.primaryColor);
    setSecondaryColor(kit.secondaryColor);
    setAccentColor(kit.accentColor);
    setBackgroundColor(kit.backgroundColor);
    setTextColor(kit.textColor);
    setFontFamily(kit.fontFamily);
    setWatermarkEnabled(kit.watermarkEnabled);
    setWatermarkPosition(kit.watermarkPosition);
  }, [selectedProfileId]);

  // Curated Aesthetic Palettes
  const palettePresets = [
    {
      name: 'Emerald Health',
      primary: '#059669',
      secondary: '#0284C7',
      accent: '#F59E0B',
      background: '#F8FAFC',
      text: '#0F172A',
    },
    {
      name: 'Editorial Red & Navy',
      primary: '#DC2626',
      secondary: '#1E293B',
      accent: '#FBBF24',
      background: '#0B132B',
      text: '#FFFFFF',
    },
    {
      name: 'Modern Royal Blue',
      primary: '#2563EB',
      secondary: '#4F46E5',
      accent: '#10B981',
      background: '#F8FAFC',
      text: '#1E293B',
    },
    {
      name: 'Cyber Purple & Neon',
      primary: '#7C3AED',
      secondary: '#2563EB',
      accent: '#06B6D4',
      background: '#0F172A',
      text: '#F8FAFC',
    },
    {
      name: 'Warm Terracotta',
      primary: '#EA580C',
      secondary: '#D97706',
      accent: '#16A34A',
      background: '#FFFBEB',
      text: '#451A03',
    },
    {
      name: 'Luxury Navy & Gold',
      primary: '#1E3A8A',
      secondary: '#B45309',
      accent: '#059669',
      background: '#F8FAFC',
      text: '#0F172A',
    },
  ];

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setLogoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Brand Kit
  const handleSaveBrandKit = () => {
    const updated = saveBrandKit({
      businessProfileId: selectedProfileId,
      brandName,
      tagline,
      logoUrl,
      primaryColor,
      secondaryColor,
      accentColor,
      backgroundColor,
      textColor,
      fontFamily,
      watermarkEnabled,
      watermarkPosition,
    });

    setCurrentKit(updated);
    setToastMessage(language === 'en' ? 'Brand Kit saved successfully!' : 'ब्रांड किट सफलतापूर्वक सुरक्षित की गई!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      {/* 1. Header Toolbar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/user/business-profiles')}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Back to Profiles"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
                <Palette className="w-5 h-5 text-purple-600" />
              </span>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {language === 'en' ? 'Brand Kit & Visual Identity' : 'ब्रांड किट एवं विजुअल पहचान'}
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'en'
                ? 'Manage reusable logos, colors, fonts, and watermarks across all videos and thumbnails.'
                : 'अपने सभी वीडियो, थंबनेल और पोस्ट के लिए लोगो, रंग और वॉटरमार्क सेट करें।'}
            </p>
          </div>
        </div>

        {/* Business Profile Switcher & Save Button */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="relative">
            <select
              value={selectedProfileId}
              onChange={(e) => setSelectedProfileId(e.target.value)}
              className="pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 rounded-xl focus:bg-white"
            >
              {businessProfiles.map((bp) => (
                <option key={bp.id} value={bp.id}>
                  {bp.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={handleSaveBrandKit}
            className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{language === 'en' ? 'Save Brand Kit' : 'सेव करें'}</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl px-4 py-3 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2. Main Studio Viewport (Editor Left + Live Preview Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Brand Configuration Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Section A: Brand Identity */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              {language === 'en' ? '1. Brand Logo & Name' : '1. ब्रांड नाम एवं लोगो'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Brand Name</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. AyurVeda Wellness"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Brand Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Daily Health Tips"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:bg-white"
                />
              </div>
            </div>

            {/* Logo Upload Box */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-semibold text-slate-700">Official Brand Logo</label>
              <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden p-1 shrink-0">
                  <img src={logoUrl} alt="Brand Logo" className="w-full h-full object-contain" />
                </div>
                <div className="space-y-1">
                  <label className="cursor-pointer px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Logo Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-slate-400">PNG or SVG with transparent background recommended</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section B: Brand Colors & Curated Palettes */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">
                {language === 'en' ? '2. Color Palette & Presets' : '2. रंग पैलेट'}
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">5 Swatches</span>
            </div>

            {/* Curated Presets Bar */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-600">Quick Palette Presets:</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {palettePresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      setPrimaryColor(preset.primary);
                      setSecondaryColor(preset.secondary);
                      setAccentColor(preset.accent);
                      setBackgroundColor(preset.background);
                      setTextColor(preset.text);
                    }}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all text-xs"
                  >
                    <p className="font-bold text-slate-800 text-[11px] truncate">{preset.name}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: preset.primary }} />
                      <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: preset.secondary }} />
                      <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: preset.accent }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Color Pickers */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Primary Color</label>
                <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-xl border border-slate-200">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-7 h-7 rounded-lg border-0 cursor-pointer"
                  />
                  <span className="text-xs font-mono font-bold text-slate-800">{primaryColor}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Secondary</label>
                <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-xl border border-slate-200">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-7 h-7 rounded-lg border-0 cursor-pointer"
                  />
                  <span className="text-xs font-mono font-bold text-slate-800">{secondaryColor}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Accent (Highlight)</label>
                <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-xl border border-slate-200">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-7 h-7 rounded-lg border-0 cursor-pointer"
                  />
                  <span className="text-xs font-mono font-bold text-slate-800">{accentColor}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section C: Typography & Watermark */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              {language === 'en' ? '3. Typography & Watermark' : '3. फ़ॉन्ट एवं वॉटरमार्क'}
            </h3>

            {/* Font Family Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Official Font Family</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'Plus Jakarta Sans', label: 'Plus Jakarta Sans (Modern)' },
                  { id: 'Inter', label: 'Inter (Clean)' },
                  { id: 'Poppins', label: 'Poppins (Bold Viral)' },
                  { id: 'Cinzel', label: 'Cinzel (Editorial / Luxury)' },
                  { id: 'Rozha One', label: 'Rozha One (Traditional Hindi)' },
                ].map((font) => (
                  <button
                    key={font.id}
                    onClick={() => setFontFamily(font.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all text-xs font-semibold ${
                      fontFamily === font.id
                        ? 'bg-blue-50 border-blue-600 text-blue-700 ring-2 ring-blue-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Watermark Position */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800">Auto Watermark on Content</p>
                  <p className="text-[11px] text-slate-400">Display corner watermark badge on exported videos & graphics</p>
                </div>
                <button
                  onClick={() => setWatermarkEnabled(!watermarkEnabled)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    watermarkEnabled ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      watermarkEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {watermarkEnabled && (
                <div className="grid grid-cols-4 gap-2 pt-1 text-xs">
                  {[
                    { id: 'top-left', label: 'Top Left' },
                    { id: 'top-right', label: 'Top Right' },
                    { id: 'bottom-left', label: 'Bottom Left' },
                    { id: 'bottom-right', label: 'Bottom Right' },
                  ].map((pos) => (
                    <button
                      key={pos.id}
                      onClick={() => setWatermarkPosition(pos.id as any)}
                      className={`py-1.5 rounded-xl font-bold border transition-all text-[11px] ${
                        watermarkPosition === pos.id
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Real-time Live Brand Mockup Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-950 rounded-3xl p-5 border border-slate-800 shadow-xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span>Live Brand Card Preview</span>
              </span>
              <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-mono">
                {fontFamily}
              </span>
            </div>

            {/* Simulated Reel / Thumbnail Card with Brand Kit Applied */}
            <div
              style={{
                fontFamily: fontFamily,
                backgroundColor: backgroundColor,
                color: textColor,
              }}
              className="rounded-2xl p-6 border border-white/15 shadow-2xl relative overflow-hidden transition-all duration-300 min-h-[300px] flex flex-col justify-between"
            >
              {/* Corner Watermark */}
              {watermarkEnabled && (
                <div
                  className={`absolute z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md ${
                    watermarkPosition === 'top-right'
                      ? 'top-3 right-3'
                      : watermarkPosition === 'top-left'
                      ? 'top-3 left-3'
                      : watermarkPosition === 'bottom-left'
                      ? 'bottom-3 left-3'
                      : 'bottom-3 right-3'
                  }`}
                  style={{
                    backgroundColor: primaryColor,
                    color: '#FFFFFF',
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-300" />
                  <span>{brandName}</span>
                </div>
              )}

              {/* Top Brand Identity */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white p-1 border shadow-xs overflow-hidden shrink-0 flex items-center justify-center">
                  <img src={logoUrl} alt="" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight">{brandName}</h4>
                  <p className="text-[11px] opacity-75">{tagline || 'Content Creation Engine'}</p>
                </div>
              </div>

              {/* Sample Headline with Accent Color */}
              <div className="space-y-2 py-6">
                <span
                  style={{ backgroundColor: accentColor }}
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-slate-950 font-mono"
                >
                  Brand Style Highlight
                </span>
                <h3 className="text-lg font-black leading-snug">
                  Viral Content Creation with Scripter
                </h3>
                <p className="text-xs opacity-80 leading-relaxed">
                  Consistent branding increases video recall by up to 80% across social feeds.
                </p>
              </div>

              {/* Action Button styled with Primary Color */}
              <div className="pt-2">
                <div
                  style={{ backgroundColor: primaryColor }}
                  className="w-full py-2.5 rounded-xl text-center text-white text-xs font-bold shadow-md cursor-default"
                >
                  Follow @{brandName.replace(/\s+/g, '').toLowerCase()}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() =>
                  navigate('/user/thumbnail-studio', {
                    state: {
                      brandKitId: currentKit.id,
                      headline: `${brandName} Official Announcement`,
                    },
                  })
                }
                className="w-full py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Create Thumbnail using this Brand Kit</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
