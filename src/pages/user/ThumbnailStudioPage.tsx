import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useRole } from '../../context/RoleContext';
import { Project, BrandKit, SocialExportPreset } from '../../types';
import {
  getProjects,
  getBrandKitForProfile,
  saveProjectThumbnail,
  saveProjectCaptions,
  getExportPresets,
} from '../../services/storage';
import { generateSocialCaptions } from '../../services/aiService';
import {
  Image as ImageIcon,
  Type,
  Palette,
  Sparkles,
  Download,
  Share2,
  ArrowLeft,
  Save,
  CheckCircle2,
  Copy,
  ChevronDown,
  Upload,
  Layers,
  Sliders,
  Check,
  Film,
  RefreshCw,
  X
} from 'lucide-react';

export const ThumbnailStudioPage: React.FC = () => {
  const { language } = useLanguage();
  const { activeBusinessProfile } = useRole();
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation state passed from Projects, Templates, or Video Studio
  const navState = (location.state || {}) as {
    projectId?: string;
    headline?: string;
    aspectRatio?: '16:9' | '9:16' | '1:1' | '4:5';
    templateId?: string;
  };

  // 1. Projects & Associated Project
  const [projectsList, setProjectsList] = useState<Project[]>(() => getProjects());
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    navState.projectId || (projectsList[0]?.id || '')
  );

  const selectedProject = projectsList.find((p) => p.id === selectedProjectId) || projectsList[0];

  // Active Brand Kit for active Business Profile
  const [brandKit, setBrandKit] = useState<BrandKit>(() =>
    getBrandKitForProfile(activeBusinessProfile.id)
  );

  // 2. Canvas & Graphic Settings
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1' | '4:5'>(
    navState.aspectRatio || '16:9'
  );
  const [headline, setHeadline] = useState<string>(
    navState.headline || selectedProject?.title || 'How to Create Viral Video Content'
  );
  const [subtitle, setSubtitle] = useState<string>(
    '3 Simple Steps for Daily Success'
  );
  const [fontSize, setFontSize] = useState<number>(36);
  const [textAlignment, setTextAlignment] = useState<'left' | 'center' | 'right'>('center');
  const [verticalPosition, setVerticalPosition] = useState<'top' | 'center' | 'bottom'>('center');
  const [fontFamily, setFontFamily] = useState<string>('Plus Jakarta Sans');

  // Colors & Background
  const [textColor, setTextColor] = useState<string>('#FFFFFF');
  const [backgroundColor, setBackgroundColor] = useState<string>('#0B132B');
  const [accentColor, setAccentColor] = useState<string>('#F59E0B'); // Highlight box
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(
    selectedProject?.scenes?.[0]?.imageUrl || '/assets/aistudio/Master_Admin_UI___________6_Visual_Assets_Management_bfd1be4e.png'
  );
  const [showBrandLogo, setShowBrandLogo] = useState<boolean>(true);
  const [showBadge, setShowBadge] = useState<boolean>(true);
  const [badgeText, setBadgeText] = useState<string>(selectedProject?.category || 'VIRAL GUIDE');

  // 3. Editor Tabs ('text' | 'bg' | 'brand' | 'captions' | 'presets')
  const [activeTab, setActiveTab] = useState<'text' | 'bg' | 'brand' | 'captions' | 'presets'>('text');

  // 4. AI Captions State (Feature E)
  const [captionPlatform, setCaptionPlatform] = useState<
    'instagram' | 'youtube' | 'linkedin' | 'facebook' | 'twitter'
  >('instagram');
  const [isGeneratingCaptions, setIsGeneratingCaptions] = useState<boolean>(false);
  const [generatedCaption, setGeneratedCaption] = useState<string>('');
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([]);
  const [generatedCta, setGeneratedCta] = useState<string>('');
  const [captionToast, setCaptionToast] = useState<string | null>(null);

  // 5. Toast / Status State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // DOM Canvas Ref for real image export
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync when project selection changes
  useEffect(() => {
    if (selectedProject) {
      if (!navState.headline) {
        setHeadline(selectedProject.title);
      }
      if (selectedProject.scenes && selectedProject.scenes.length > 0) {
        setBackgroundImageUrl(selectedProject.scenes[0].imageUrl);
      }
      setBadgeText(selectedProject.category || 'VIRAL GUIDE');
    }
  }, [selectedProjectId]);

  // Apply Brand Kit
  const handleApplyBrandKit = () => {
    const kit = getBrandKitForProfile(activeBusinessProfile.id);
    setBrandKit(kit);
    setPrimaryColorHelper(kit);
    setToastMessage('Brand Kit applied to graphic!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const setPrimaryColorHelper = (kit: BrandKit) => {
    setAccentColor(kit.accentColor);
    setTextColor(kit.textColor === '#0F172A' ? '#FFFFFF' : kit.textColor);
    setBackgroundColor(kit.backgroundColor === '#F8FAFC' ? '#0F172A' : kit.backgroundColor);
    setFontFamily(kit.fontFamily);
  };

  // Draw on HTML5 Canvas & Export Real PNG
  const renderCanvas = (): string => {
    const canvas = canvasRef.current;
    if (!canvas) return '';

    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Canvas resolution mapping based on aspect ratio
    let width = 1280;
    let height = 720;
    if (aspectRatio === '9:16') {
      width = 1080;
      height = 1920;
    } else if (aspectRatio === '1:1') {
      width = 1080;
      height = 1080;
    } else if (aspectRatio === '4:5') {
      width = 1080;
      height = 1350;
    }

    canvas.width = width;
    canvas.height = height;

    // 1. Background fill
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // 2. Draw background image if present
    if (backgroundImageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = backgroundImageUrl;
      try {
        ctx.drawImage(img, 0, 0, width, height);
      } catch (e) {
        // Fallback to solid background
      }
    }

    // 3. Dark gradient overlay for text readability
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.65)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 4. Draw Badge
    if (showBadge && badgeText) {
      ctx.save();
      const badgeY = verticalPosition === 'top' ? height * 0.15 : height * 0.25;
      ctx.fillStyle = accentColor;
      ctx.font = `bold ${Math.round(fontSize * 0.45)}px sans-serif`;
      const badgeWidth = ctx.measureText(badgeText.toUpperCase()).width + 30;
      const badgeX = textAlignment === 'center' ? (width - badgeWidth) / 2 : textAlignment === 'left' ? 80 : width - badgeWidth - 80;

      ctx.fillRect(badgeX, badgeY - 25, badgeWidth, 35);
      ctx.fillStyle = '#0F172A';
      ctx.fillText(badgeText.toUpperCase(), badgeX + 15, badgeY);
      ctx.restore();
    }

    // 5. Draw Headline
    ctx.save();
    ctx.fillStyle = textColor;
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = textAlignment;

    const textX = textAlignment === 'center' ? width / 2 : textAlignment === 'left' ? 80 : width - 80;
    let textY = verticalPosition === 'top' ? height * 0.35 : verticalPosition === 'center' ? height * 0.5 : height * 0.7;

    // Wrap headline
    const words = headline.split(' ');
    let line = '';
    const maxWidth = width - 160;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, textX, textY);
        line = words[n] + ' ';
        textY += fontSize * 1.3;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, textX, textY);

    // 6. Draw Subtitle
    if (subtitle) {
      ctx.fillStyle = accentColor;
      ctx.font = `500 ${Math.round(fontSize * 0.6)}px sans-serif`;
      ctx.fillText(subtitle, textX, textY + fontSize * 1.2);
    }
    ctx.restore();

    // 7. Draw Watermark
    if (showBrandLogo) {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = `bold ${Math.round(fontSize * 0.4)}px sans-serif`;
      ctx.textAlign = 'right';
      ctx.fillText(`@${brandKit.brandName}`, width - 60, height - 50);
      ctx.restore();
    }

    return canvas.toDataURL('image/png');
  };

  // Export PNG to user device
  const handleDownloadImage = () => {
    const dataUrl = renderCanvas();
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.download = `${headline.replace(/\s+/g, '_').toLowerCase()}_thumbnail.png`;
    link.href = dataUrl;
    link.click();

    setToastMessage('High-resolution graphic downloaded to device!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Save Thumbnail to Project
  const handleSaveToProject = () => {
    if (!selectedProjectId) return;
    const dataUrl = renderCanvas();

    saveProjectThumbnail(selectedProjectId, {
      title: `${headline.substring(0, 30)}...`,
      headline,
      subtitle,
      aspectRatio,
      backgroundColor,
      textColor,
      accentColor,
      fontFamily,
      fontSize,
      textAlignment,
      position: verticalPosition,
      showBrandLogo,
      brandLogoUrl: brandKit.logoUrl,
      showBadge,
      badgeText,
      exportedImageUrl: dataUrl,
    });

    setProjectsList(getProjects());
    setToastMessage('Thumbnail saved to project library!');
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Generate AI Social Captions (Feature E)
  const handleGenerateCaptions = async () => {
    setIsGeneratingCaptions(true);
    try {
      const result = await generateSocialCaptions({
        topic: headline,
        scriptSnippet: selectedProject?.scriptSnippet,
        platform: captionPlatform,
        language: language === 'hi' ? 'hi' : 'en',
        businessProfile: activeBusinessProfile,
      });

      setGeneratedCaption(result.caption);
      setGeneratedHashtags(result.hashtags);
      setGeneratedCta(result.callToAction);
      setIsGeneratingCaptions(false);
      setActiveTab('captions');
      setToastMessage(result.providerNote);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (e) {
      setIsGeneratingCaptions(false);
    }
  };

  // Copy text helper
  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCaptionToast(`${label} copied to clipboard!`);
    setTimeout(() => setCaptionToast(null), 2500);
  };

  // Save Captions to Project
  const handleSaveCaptionsToProject = () => {
    if (!selectedProjectId || !generatedCaption) return;

    saveProjectCaptions(selectedProjectId, {
      platform: captionPlatform,
      tone: 'Engaging & Viral',
      language: language === 'hi' ? 'hi' : 'en',
      caption: generatedCaption,
      hashtags: generatedHashtags,
      callToAction: generatedCta,
      shortDescription: headline,
      isLiveAi: true,
      providerNote: 'Generated with Scripter AI',
    });

    setProjectsList(getProjects());
    setToastMessage('Captions saved to project!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-5 pb-24 md:pb-12 space-y-5">
      {/* 1. Header Toolbar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/user/projects')}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
                <ImageIcon className="w-5 h-5 text-amber-600" />
              </span>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {language === 'en' ? 'Thumbnail & Graphic Studio' : 'थंबनेल एवं ग्राफ़िक क्रिएटर'}
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                Phase 4
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
              <span>{selectedProject?.title}</span>
              <span>·</span>
              <span className="text-slate-400">{activeBusinessProfile.name}</span>
            </p>
          </div>
        </div>

        {/* Aspect Ratio Switcher & Actions */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {/* Ratio Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
            {[
              { id: '16:9', label: '16:9', sub: 'YouTube' },
              { id: '9:16', label: '9:16', sub: 'Reels' },
              { id: '1:1', label: '1:1', sub: 'Square' },
              { id: '4:5', label: '4:5', sub: 'Feed' },
            ].map((ratio) => (
              <button
                key={ratio.id}
                onClick={() => setAspectRatio(ratio.id as any)}
                className={`px-3 py-1 rounded-xl font-bold transition-all ${
                  aspectRatio === ratio.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {ratio.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleApplyBrandKit}
            className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            title="Apply Active Brand Kit"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Apply Brand Kit</span>
          </button>

          <button
            onClick={handleSaveToProject}
            className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save to Project</span>
          </button>

          <button
            onClick={handleDownloadImage}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Export Image</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl px-4 py-2.5 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2. Main Studio Canvas & Editor Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Live Graphic Canvas Preview (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="bg-slate-950 rounded-3xl p-5 sm:p-8 border border-slate-800 shadow-xl flex flex-col items-center justify-center min-h-[460px]">
            {/* Visual Canvas Framing */}
            <div
              style={{
                fontFamily: fontFamily,
                backgroundColor: backgroundColor,
              }}
              className={`relative overflow-hidden rounded-2xl border-2 border-white/20 shadow-2xl transition-all duration-300 flex flex-col justify-between p-6 ${
                aspectRatio === '16:9'
                  ? 'w-full max-w-[560px] aspect-video'
                  : aspectRatio === '9:16'
                  ? 'w-[280px] sm:w-[320px] aspect-[9/16]'
                  : aspectRatio === '1:1'
                  ? 'w-[320px] sm:w-[380px] aspect-square'
                  : 'w-[320px] sm:w-[360px] aspect-[4/5]'
              }`}
            >
              {/* Background Image Layer */}
              {backgroundImageUrl && (
                <img
                  src={backgroundImageUrl}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-45"
                />
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 pointer-events-none" />

              {/* Top Layer: Badge & Logo */}
              <div className="relative z-10 flex items-center justify-between">
                {showBadge && badgeText ? (
                  <span
                    style={{ backgroundColor: accentColor }}
                    className="text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded text-slate-950 shadow-sm"
                  >
                    {badgeText}
                  </span>
                ) : <span />}

                {showBrandLogo && (
                  <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-[10px] text-white font-bold">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>{brandKit.brandName}</span>
                  </div>
                )}
              </div>

              {/* Middle Layer: Headline & Subtitle */}
              <div
                className={`relative z-10 space-y-2 py-4 ${
                  textAlignment === 'center'
                    ? 'text-center'
                    : textAlignment === 'left'
                    ? 'text-left'
                    : 'text-right'
                }`}
              >
                <h2
                  style={{
                    color: textColor,
                    fontSize: `${fontSize * (aspectRatio === '9:16' ? 0.75 : 0.85)}px`,
                    lineHeight: '1.25',
                  }}
                  className="font-black drop-shadow-md tracking-tight"
                >
                  {headline}
                </h2>

                {subtitle && (
                  <p
                    style={{ color: accentColor }}
                    className="text-xs sm:text-sm font-bold tracking-wide drop-shadow-sm"
                  >
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Bottom Layer: Watermark handle */}
              <div className="relative z-10 flex items-center justify-between text-[11px] text-white/80 font-mono">
                <span>Scripter Studio</span>
                <span className="font-bold text-amber-300">
                  {aspectRatio === '16:9' ? '1280x720' : aspectRatio === '9:16' ? '1080x1920' : '1080x1080'}
                </span>
              </div>
            </div>

            {/* Hidden Offscreen Canvas for Real Pixel-Perfect Image Rendering */}
            <canvas ref={canvasRef} className="hidden" />

            <div className="mt-4 flex items-center gap-3 text-slate-400 text-xs">
              <span>Pixel-perfect export ready</span>
              <span>·</span>
              <button
                onClick={handleDownloadImage}
                className="text-amber-400 hover:text-amber-300 font-bold underline"
              >
                Click here to download PNG
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Studio Controls Sidebar (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
            {/* Tool Tabs Header */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-100 text-xs">
              {[
                { id: 'text', label: 'Headline', icon: Type },
                { id: 'bg', label: 'Image', icon: ImageIcon },
                { id: 'brand', label: 'Colors', icon: Palette },
                { id: 'captions', label: 'AI Captions', icon: Sparkles, badge: 'AI' },
                { id: 'presets', label: 'Presets', icon: Sliders },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-2 rounded-xl font-bold shrink-0 flex items-center gap-1.5 transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className="text-[9px] bg-amber-400 text-slate-950 px-1 rounded-full font-bold">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* TAB 1: Headline & Subtitle */}
            {activeTab === 'text' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Main Headline</label>
                  <textarea
                    rows={2}
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:bg-white resize-none"
                    placeholder="Enter catchy headline..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Supporting Subtitle</label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:bg-white"
                    placeholder="e.g. 3 Simple Daily Habits"
                  />
                </div>

                {/* Font Size & Alignment */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-600">Font Size:</span>
                      <span className="font-mono text-blue-600 font-bold">{fontSize}px</span>
                    </div>
                    <input
                      type="range"
                      min={22}
                      max={56}
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-600">Alignment:</span>
                    <div className="grid grid-cols-3 gap-1">
                      {['left', 'center', 'right'].map((align) => (
                        <button
                          key={align}
                          onClick={() => setTextAlignment(align as any)}
                          className={`py-1 rounded-lg border text-xs capitalize ${
                            textAlignment === align
                              ? 'bg-blue-600 text-white font-bold border-blue-600'
                              : 'bg-slate-50 text-slate-700'
                          }`}
                        >
                          {align}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Badge text */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">Category Tag Badge</span>
                    <button
                      onClick={() => setShowBadge(!showBadge)}
                      className={`text-xs font-bold ${showBadge ? 'text-blue-600' : 'text-slate-400'}`}
                    >
                      {showBadge ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                  {showBadge && (
                    <input
                      type="text"
                      value={badgeText}
                      onChange={(e) => setBadgeText(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 uppercase focus:bg-white"
                    />
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: Background & Project Images */}
            {activeTab === 'bg' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase">Background Image</h4>
                    <p className="text-xs text-slate-500">Pick from project scenes or upload custom</p>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (typeof reader.result === 'string') {
                          setBackgroundImageUrl(reader.result);
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                  </button>
                </div>

                {/* Project Scenes Grid */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-600">Available Project Scenes:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedProject?.scenes && selectedProject.scenes.length > 0 ? (
                      selectedProject.scenes.map((sc, i) => (
                        <div
                          key={i}
                          onClick={() => setBackgroundImageUrl(sc.imageUrl)}
                          className="aspect-video rounded-xl bg-slate-100 overflow-hidden border border-slate-200 hover:ring-2 hover:ring-blue-500 cursor-pointer"
                        >
                          <img src={sc.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 col-span-3">No scenes in this project.</p>
                    )}
                  </div>
                </div>

                {backgroundImageUrl && (
                  <button
                    onClick={() => setBackgroundImageUrl(null)}
                    className="text-xs text-red-600 hover:underline pt-1"
                  >
                    Remove background image (Use solid backdrop)
                  </button>
                )}
              </div>
            )}

            {/* TAB 3: Colors & Brand Kit */}
            {activeTab === 'brand' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase">Colors & Brand Identity</h4>
                    <p className="text-xs text-slate-500">Sync with active Business Profile</p>
                  </div>
                  <button
                    onClick={handleApplyBrandKit}
                    className="px-3 py-1 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold"
                  >
                    Sync Kit
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-600">Text Color</span>
                    <div className="flex items-center gap-1.5 p-1.5 bg-slate-50 rounded-xl border border-slate-200">
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-6 h-6 rounded border-0 cursor-pointer"
                      />
                      <span className="text-[11px] font-mono">{textColor}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-600">Accent Box</span>
                    <div className="flex items-center gap-1.5 p-1.5 bg-slate-50 rounded-xl border border-slate-200">
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="w-6 h-6 rounded border-0 cursor-pointer"
                      />
                      <span className="text-[11px] font-mono">{accentColor}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-600">Backdrop</span>
                    <div className="flex items-center gap-1.5 p-1.5 bg-slate-50 rounded-xl border border-slate-200">
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-6 h-6 rounded border-0 cursor-pointer"
                      />
                      <span className="text-[11px] font-mono">{backgroundColor}</span>
                    </div>
                  </div>
                </div>

                {/* Brand Logo Toggle */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-700">Display Brand Badge Overlay</span>
                  <button
                    onClick={() => setShowBrandLogo(!showBrandLogo)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      showBrandLogo ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        showBrandLogo ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: AI Captions & Social Media Post (Feature E) */}
            {activeTab === 'captions' && (
              <div className="space-y-4 animate-in fade-in duration-150 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    <span>AI Social Media Captions</span>
                  </h4>
                  <p className="text-slate-500 mt-0.5">Generate platform-tailored post text and hashtags.</p>
                </div>

                {/* Platform Selector */}
                <div className="space-y-1.5">
                  <span className="font-semibold text-slate-600">Target Platform:</span>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                    {['instagram', 'youtube', 'linkedin', 'facebook', 'twitter'].map((plat) => (
                      <button
                        key={plat}
                        onClick={() => setCaptionPlatform(plat as any)}
                        className={`py-1.5 rounded-xl font-bold capitalize border text-[11px] transition-all ${
                          captionPlatform === plat
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {plat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerateCaptions}
                  disabled={isGeneratingCaptions}
                  className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>{isGeneratingCaptions ? 'Generating Captions...' : 'Generate AI Captions ✨'}</span>
                </button>

                {captionToast && (
                  <p className="text-center font-bold text-emerald-600">{captionToast}</p>
                )}

                {/* Output Area */}
                {generatedCaption ? (
                  <div className="space-y-3 pt-2">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 text-[11px] uppercase">Post Caption:</span>
                        <button
                          onClick={() => handleCopyText(generatedCaption, 'Caption')}
                          className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </button>
                      </div>
                      <p className="text-slate-800 whitespace-pre-line leading-relaxed text-[11px]">
                        {generatedCaption}
                      </p>
                    </div>

                    {/* Hashtags */}
                    <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-900 text-[11px] uppercase">Hashtags:</span>
                        <button
                          onClick={() => handleCopyText(generatedHashtags.join(' '), 'Hashtags')}
                          className="px-2 py-0.5 rounded bg-white border border-blue-200 text-[11px] font-bold text-blue-700 hover:bg-blue-100 flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy All</span>
                        </button>
                      </div>
                      <p className="text-blue-800 font-mono text-[11px] leading-relaxed">
                        {generatedHashtags.join(' ')}
                      </p>
                    </div>

                    <button
                      onClick={handleSaveCaptionsToProject}
                      className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                    >
                      Save Captions to Project
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center text-slate-400">
                    Click "Generate AI Captions" to create viral hooks and hashtags for this content.
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: Social Media Export Presets (Feature F) */}
            {activeTab === 'presets' && (
              <div className="space-y-3 animate-in fade-in duration-150 text-xs">
                <h4 className="font-bold text-slate-900 uppercase">Social Media Export Presets</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {getExportPresets().map((preset) => (
                    <div
                      key={preset.id}
                      onClick={() => setAspectRatio(preset.aspectRatio)}
                      className={`p-2.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-2 ${
                        aspectRatio === preset.aspectRatio
                          ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-500/20'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-slate-900 text-xs">{preset.name}</p>
                          {preset.badge && (
                            <span className="text-[9px] bg-amber-400 text-slate-950 px-1 rounded font-bold">
                              {preset.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {preset.resolution} · {preset.recommendedFormat.toUpperCase()}
                        </p>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-blue-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {preset.aspectRatio}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleDownloadImage}
                    className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Preset Output</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
