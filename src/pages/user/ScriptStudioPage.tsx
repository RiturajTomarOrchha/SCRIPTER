import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  generateScriptWithAi,
  transformScriptWithAi,
  GeneratedScriptResult,
  isGeminiConfigured,
} from '../../services/aiService';
import { saveProject, addNotification, getProjects } from '../../services/storage';
import { ScriptScene, ScriptVersion, Project } from '../../types';
import {
  FileText,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Edit3,
  Video,
  Layers,
  Volume2,
  Clock,
  RotateCcw,
  Plus,
  Bookmark,
  Share2,
  Sliders,
  Play,
  Pause,
  AlertCircle,
  Briefcase,
  Eye,
  Save,
  Zap,
  ShoppingBag,
  X,
  History,
  ChevronDown,
  Wand2,
  HelpCircle,
  Scissors,
  Maximize2,
  CheckCircle2,
} from 'lucide-react';

export const ScriptStudioPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeBusinessProfile, useCredits, deductCredits, creditsInfo } = useRole();
  const { language } = useLanguage();

  // Navigation state parameters (passed from Ideas or Projects)
  const navState = (location.state as {
    prefilledTopic?: string;
    ideaId?: string;
    category?: string;
    industry?: string;
    outline?: string[];
    projectId?: string;
  }) || {};

  // Form & Settings State
  const defaultTopic = language === 'hi' ? 'सोलर पैनल से बिजली बिल कैसे कम करें?' : 'How to Reduce Electricity Bill with Solar Panels';
  const [topic, setTopic] = useState<string>(navState.prefilledTopic || defaultTopic);
  const [isChangingTopic, setIsChangingTopic] = useState<boolean>(false);
  const [tempTopic, setTempTopic] = useState<string>(topic);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Script Configuration (Panel 2)
  const [selectedLanguage, setSelectedLanguage] = useState<'hi' | 'en' | 'hinglish'>('hi');
  const [videoLength, setVideoLength] = useState<'30s' | '60s' | '90s' | '180s'>('60s');
  const [tone, setTone] = useState<string>('शांत और प्रभावी');
  const [targetAudience, setTargetAudience] = useState<string>('सामान्य जनता');

  // Script Content State (Sections Hook, Body, CTA)
  const [hook, setHook] = useState<string>(
    'क्या आप हर महीने बढ़ते बिजली बिल से परेशान हैं?'
  );
  const [mainBody, setMainBody] = useState<string>(
    'तो सोलर पैनल आपके लिए एक बेहतरीन समाधान हो सकता है, अधिक यह पर्यावरण के लिए भी सुरक्षित है, यह सौर ऊर्जा से न सिर्फ आपके बिजली बिल में बड़ी कमी लाएगा बल्कि यह एक सुरक्षित निवेश भी साबित हो सकता है।'
  );
  const [closingCta, setClosingCta] = useState<string>(
    'अगर आप भी अपने घर या कारोबार में सोलर पैनल लगवाने की सोच रहे हैं, तो तुरंत नीचे दिए गए लिंक से डिटेल्स प्राप्त करें और आज ही अपनी छत को पावर प्लांट बनाएं!'
  );

  // Active View / Edit Mode
  const [activeTabMode, setActiveTabMode] = useState<'script' | 'edit' | 'visuals'>('script');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [transformLoading, setTransformLoading] = useState<string | null>(null);
  const [customPromptOpen, setCustomPromptOpen] = useState<boolean>(false);
  const [customInstruction, setCustomInstruction] = useState<string>('');

  // Version History State
  const [isVersionDrawerOpen, setIsVersionDrawerOpen] = useState<boolean>(false);
  const [versions, setVersions] = useState<ScriptVersion[]>([
    {
      version: 1,
      updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      hook: 'क्या आप हर महीने बढ़ते बिजली बिल से परेशान हैं?',
      mainContent: [
        'तो सोलर पैनल आपके लिए एक बेहतरीन समाधान हो सकता है, अधिक यह पर्यावरण के लिए भी सुरक्षित है, यह सौर ऊर्जा से न सिर्फ आपके बिजली बिल में बड़ी कमी लाएगा बल्कि यह एक सुरक्षित निवेश भी साबित हो सकता है।'
      ],
      closing: 'अगर आप भी अपने घर या कारोबार में सोलर पैनल लगवाने की सोच रहे हैं, तो तुरंत नीचे दिए गए लिंक से डिटेल्स प्राप्त करें और आज ही अपनी छत को पावर प्लांट बनाएं!'
    }
  ]);

  // Project linkage
  const [savedProjectId, setSavedProjectId] = useState<string | null>(navState.projectId || null);
  const [saveSuccessToast, setSaveSuccessToast] = useState<boolean>(false);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);
  const [isInsufficientCreditModalOpen, setIsInsufficientCreditModalOpen] = useState(false);

  // Calculate stats
  const fullScriptText = `${hook}\n\n${mainBody}\n\n${closingCta}`;
  const totalChars = fullScriptText.length;
  const wordCount = fullScriptText.trim().split(/\s+/).length;
  const estimatedSeconds = Math.round((wordCount / 130) * 60);

  // If outline was passed from an idea on mount, set it up
  useEffect(() => {
    if (navState.outline && navState.outline.length >= 2) {
      setHook(navState.outline[0] || hook);
      setMainBody(navState.outline.slice(1, -1).join('\n\n') || navState.outline[1]);
      if (navState.outline.length > 2) {
        setClosingCta(navState.outline[navState.outline.length - 1]);
      }
    }
  }, [navState.outline]);

  // Save version snapshot helper
  const recordVersion = (newHook: string, newBody: string, newClosing: string) => {
    const newVer: ScriptVersion = {
      version: versions.length + 1,
      updatedAt: new Date().toISOString(),
      hook: newHook,
      mainContent: [newBody],
      closing: newClosing,
    };
    setVersions((prev) => [newVer, ...prev]);
  };

  // AI Generation (Primary)
  const handleGenerateScript = async () => {
    if (creditsInfo.totalAvailable < 1) {
      setIsInsufficientCreditModalOpen(true);
      return;
    }

    setIsGenerating(true);
    try {
      const durSec = videoLength === '30s' ? 30 : videoLength === '60s' ? 60 : 90;
      const result = await generateScriptWithAi({
        topic,
        videoType: videoLength === '30s' ? 'short' : 'medium',
        durationSeconds: durSec,
        language: selectedLanguage,
        tone,
        businessProfile: activeBusinessProfile,
      });

      setHook(result.hook);
      setMainBody(result.mainContent.join('\n\n'));
      setClosingCta(result.closing);
      recordVersion(result.hook, result.mainContent.join('\n\n'), result.closing);

      // Deduct 1 credit atomically
      useCredits(1);
      deductCredits(1, 'script_generation', `AI Script for: "${topic}"`, {
        businessProfileName: activeBusinessProfile.name,
      });

      addNotification({
        type: 'script_ready',
        title: language === 'en' ? 'Script Generated' : 'स्क्रिप्ट तैयार हो गई',
        titleHi: 'स्क्रिप्ट तैयार हो गई',
        message: `Generated: "${topic}"`,
        messageHi: `"${topic}" के लिए आपकी स्क्रिप्ट तैयार है।`,
        actionUrl: '/user/script-studio',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Quick Transformation Handlers
  const handleTransform = async (action: 'rewrite' | 'expand' | 'shorten' | 'add_hook' | 'add_cta' | 'custom') => {
    setTransformLoading(action);
    try {
      const res = await transformScriptWithAi({
        action,
        currentHook: hook,
        currentMain: [mainBody],
        currentClosing: closingCta,
        topic,
        language: selectedLanguage,
        tone,
        customInstruction: action === 'custom' ? customInstruction : undefined,
      });

      setHook(res.hook);
      setMainBody(res.mainContent.join('\n\n'));
      setClosingCta(res.closing);
      recordVersion(res.hook, res.mainContent.join('\n\n'), res.closing);
      setCustomPromptOpen(false);
      setCustomInstruction('');
    } catch (err) {
      console.error(err);
    } finally {
      setTransformLoading(null);
    }
  };

  // Save to Project
  const handleSaveProject = () => {
    const project = saveProject({
      id: savedProjectId || undefined,
      title: topic,
      titleHi: selectedLanguage === 'hi' ? topic : undefined,
      industry: activeBusinessProfile.industry,
      category: activeBusinessProfile.category,
      status: 'in_progress',
      format: videoLength === '30s' ? 'short' : 'reel',
      duration: `${estimatedSeconds}s`,
      scriptSnippet: hook,
      businessProfileId: activeBusinessProfile.id,
      scriptVersions: versions,
      notes: `Tone: ${tone} · Length: ${videoLength}`,
    });

    setSavedProjectId(project.id);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 2500);
    return project;
  };

  // Copy full script
  const handleCopyScript = () => {
    navigator.clipboard.writeText(fullScriptText);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  // Open in Teleprompter (Direct Handoff as mandated in Prompt 6)
  const handleOpenTeleprompter = () => {
    const proj = handleSaveProject();
    navigate('/user/teleprompter', {
      state: {
        projectId: proj.id,
        scriptText: fullScriptText,
        title: topic,
      },
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 pb-24 md:pb-12 space-y-5">
      {/* 1. Top Breadcrumb & Selected Topic Bar (Panel 2) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/user/ideas')}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
            title="Back to Ideas"
          >
            ← {language === 'en' ? 'Back' : 'वापस'}
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">
                {language === 'en' ? 'Selected Topic:' : 'चयनित विषय:'}
              </span>
              <button
                onClick={() => {
                  setTempTopic(topic);
                  setIsChangingTopic(true);
                }}
                className="text-[11px] font-bold text-blue-600 hover:underline"
              >
                {language === 'en' ? 'Change' : 'विषय बदलें'}
              </button>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-1">
              {topic}
            </h1>
          </div>
        </div>

        <button
          onClick={() => setIsGuideOpen(true)}
          className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 self-start sm:self-auto"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{language === 'en' ? 'How to write a script?' : 'स्क्रिप्ट कैसे लिखें?'}</span>
        </button>
      </div>

      {/* 2. Script Settings Bar (Panel 2: भाषा, लंबाई, टोन, Audience) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
          <span className="uppercase tracking-wider text-[11px] text-slate-400">
            {language === 'en' ? 'Script Settings' : 'स्क्रिप्ट सेटिंग्स'}
          </span>
          <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
            Active: {activeBusinessProfile.name}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Language */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500">
              {language === 'en' ? 'Language' : 'भाषा'}
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as any)}
              className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-800 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              <option value="hi">हिंदी (Hindi)</option>
              <option value="en">English</option>
              <option value="hinglish">Hinglish</option>
            </select>
          </div>

          {/* Length */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500">
              {language === 'en' ? 'Length' : 'लंबाई'}
            </label>
            <select
              value={videoLength}
              onChange={(e) => setVideoLength(e.target.value as any)}
              className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-800 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              <option value="30s">30 सेकंड (Shorts)</option>
              <option value="60s">60 सेकंड (Reels)</option>
              <option value="90s">90 सेकंड</option>
              <option value="180s">3 मिनट (Long)</option>
            </select>
          </div>

          {/* Tone */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500">
              {language === 'en' ? 'Tone' : 'टोन'}
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-800 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              <option value="शांत और प्रभावी">शांत और प्रभावी (Calm)</option>
              <option value="उत्साही और वायरल">उत्साही और वायरल (Energetic)</option>
              <option value="पेशेवर">पेशेवर (Professional)</option>
              <option value="सरल भाषा">सरल भाषा (Simple)</option>
              <option value="प्रेरणादायक">प्रेरणादायक (Motivational)</option>
            </select>
          </div>

          {/* Audience */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500">
              {language === 'en' ? 'Audience' : 'Audience'}
            </label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-800 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              <option value="सामान्य जनता">सामान्य जनता (General)</option>
              <option value="युवा और छात्र">युवा और छात्र (Youth)</option>
              <option value="कारोबारी और उद्यमी">कारोबारी (Business)</option>
              <option value="परिवार और वरिष्ठ">परिवार (Families)</option>
            </select>
          </div>
        </div>

        {/* Primary AI Generation Trigger Button (Matching Panel 2) */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleGenerateScript}
            disabled={isGenerating}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all disabled:opacity-60"
          >
            <Sparkles className="w-4 h-4 fill-white" />
            <span>
              {isGenerating
                ? (language === 'en' ? 'Generating Script...' : 'AI से स्क्रिप्ट बन रही है...')
                : (language === 'en' ? 'Create Script with AI' : 'AI से स्क्रिप्ट बनाएं')}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white/20 text-[11px] font-mono">
              1 क्रेडिट
            </span>
          </button>
        </div>
      </div>

      {/* 3. Action Toolbar / Transformation Pills (Panel 2: AI स्क्रिप्ट, मेरा एडिट, री-राइट, लंबा करें...) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          onClick={() => setActiveTabMode('script')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTabMode === 'script'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{language === 'en' ? 'AI Script' : 'AI स्क्रिप्ट'}</span>
        </button>

        <button
          onClick={() => setActiveTabMode('edit')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTabMode === 'edit'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{language === 'en' ? 'My Edit' : 'मेरा एडिट'}</span>
        </button>

        {/* AI Quick Transformation Buttons */}
        <button
          onClick={() => handleTransform('rewrite')}
          disabled={Boolean(transformLoading)}
          className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold transition-all shrink-0 flex items-center gap-1.5"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${transformLoading === 'rewrite' ? 'animate-spin text-blue-600' : ''}`} />
          <span>{language === 'en' ? 'Rewrite' : 'री-राइट'}</span>
        </button>

        <button
          onClick={() => handleTransform('expand')}
          disabled={Boolean(transformLoading)}
          className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold transition-all shrink-0 flex items-center gap-1.5"
        >
          <Maximize2 className={`w-3.5 h-3.5 ${transformLoading === 'expand' ? 'animate-pulse text-blue-600' : ''}`} />
          <span>{language === 'en' ? 'Expand' : 'लंबा करें'}</span>
        </button>

        <button
          onClick={() => handleTransform('shorten')}
          disabled={Boolean(transformLoading)}
          className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold transition-all shrink-0 flex items-center gap-1.5"
        >
          <Scissors className={`w-3.5 h-3.5 ${transformLoading === 'shorten' ? 'animate-pulse text-blue-600' : ''}`} />
          <span>{language === 'en' ? 'Shorten' : 'छोटा करें'}</span>
        </button>

        <button
          onClick={() => handleTransform('add_hook')}
          disabled={Boolean(transformLoading)}
          className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold transition-all shrink-0 flex items-center gap-1.5"
        >
          <Wand2 className={`w-3.5 h-3.5 ${transformLoading === 'add_hook' ? 'animate-pulse text-blue-600' : ''}`} />
          <span>{language === 'en' ? 'Add Hook' : 'हुक जोड़ें'}</span>
        </button>

        <button
          onClick={() => handleTransform('add_cta')}
          disabled={Boolean(transformLoading)}
          className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold transition-all shrink-0 flex items-center gap-1.5"
        >
          <ArrowRight className={`w-3.5 h-3.5 ${transformLoading === 'add_cta' ? 'animate-pulse text-blue-600' : ''}`} />
          <span>{language === 'en' ? 'Add CTA' : 'CTA जोड़ें'}</span>
        </button>

        <button
          onClick={() => setCustomPromptOpen(true)}
          className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-semibold transition-all shrink-0 flex items-center gap-1.5"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{language === 'en' ? 'Custom' : 'कस्टम'}</span>
        </button>
      </div>

      {/* 4. Structured Script Sections (Panel 2: Hook, Core, CTA) */}
      <div className="space-y-4">
        {/* Section A: Hook (0-5s) */}
        <div className="bg-white rounded-3xl p-5 border border-amber-200/90 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-amber-100 text-amber-700">⚡</span>
              <h3 className="text-xs sm:text-sm font-bold text-amber-950 uppercase tracking-wide">
                {language === 'en' ? 'Hook (0-5 Seconds)' : 'हुक (0-5 सेकंड)'}
              </h3>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">
                Attention Grabber
              </span>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(hook);
                setCopiedToast(true);
                setTimeout(() => setCopiedToast(false), 2000);
              }}
              className="text-xs text-amber-700 hover:text-amber-900 font-semibold flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              <span>{language === 'en' ? 'Copy' : 'कॉपी'}</span>
            </button>
          </div>

          <textarea
            rows={2}
            value={hook}
            onChange={(e) => setHook(e.target.value)}
            className="w-full p-3 rounded-2xl bg-amber-50/50 border border-amber-200 text-sm font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 leading-relaxed resize-none"
            placeholder="Enter attention-grabbing opening hook..."
          />
        </div>

        {/* Section B: Core Points (5-45s) */}
        <div className="bg-white rounded-3xl p-5 border border-blue-200/90 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-blue-100 text-blue-700">💡</span>
              <h3 className="text-xs sm:text-sm font-bold text-blue-950 uppercase tracking-wide">
                {language === 'en' ? 'Core Content (5-45 Seconds)' : 'मुख्य बात (5-45 सेकंड)'}
              </h3>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">
                Value & Solution
              </span>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(mainBody);
                setCopiedToast(true);
                setTimeout(() => setCopiedToast(false), 2000);
              }}
              className="text-xs text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              <span>{language === 'en' ? 'Copy' : 'कॉपी'}</span>
            </button>
          </div>

          <textarea
            rows={5}
            value={mainBody}
            onChange={(e) => setMainBody(e.target.value)}
            className="w-full p-3.5 rounded-2xl bg-blue-50/30 border border-blue-200 text-sm font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 leading-relaxed resize-none"
            placeholder="Enter primary script points and value breakdown..."
          />
        </div>

        {/* Section C: Conclusion & CTA (45-60s) */}
        <div className="bg-white rounded-3xl p-5 border border-emerald-200/90 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-emerald-100 text-emerald-700">🎯</span>
              <h3 className="text-xs sm:text-sm font-bold text-emerald-950 uppercase tracking-wide">
                {language === 'en' ? 'Conclusion & CTA (45-60 Seconds)' : 'निष्कर्ष और CTA (45-60 सेकंड)'}
              </h3>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                Action Driven
              </span>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(closingCta);
                setCopiedToast(true);
                setTimeout(() => setCopiedToast(false), 2000);
              }}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              <span>{language === 'en' ? 'Copy' : 'कॉपी'}</span>
            </button>
          </div>

          <textarea
            rows={3}
            value={closingCta}
            onChange={(e) => setClosingCta(e.target.value)}
            className="w-full p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-200 text-sm font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 leading-relaxed resize-none"
            placeholder="Enter clear call to action, subscribe, or link reminder..."
          />
        </div>

        {/* Live Counters & Helper */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-2">
          <span className="font-mono">
            {totalChars}/800 {language === 'en' ? 'characters' : 'वर्ण'} · ~{estimatedSeconds}s {language === 'en' ? 'read time' : 'अनुमानित समय'}
          </span>
          <button
            onClick={() => setIsGuideOpen(true)}
            className="text-blue-600 hover:underline flex items-center gap-1 text-[11px]"
          >
            <span>{language === 'en' ? 'Script guidelines & tips' : 'स्क्रिप्ट कैसे लिखें?'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 5. Bottom Sticky Action Bar (Panel 2: सेव करें, वर्जन हिस्ट्री, कॉपी करें, टेलीप्रॉम्प्टर में खोलें) */}
      <div className="sticky bottom-4 z-30 bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-slate-200 shadow-xl flex flex-wrap items-center justify-between gap-3">
        {/* Left Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveProject}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Save Draft' : 'सेव करें'}</span>
          </button>

          <button
            onClick={() => setIsVersionDrawerOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors relative"
          >
            <History className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Versions' : 'वर्जन हिस्ट्री'}</span>
            <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] flex items-center justify-center font-mono">
              {versions.length}
            </span>
          </button>

          <button
            onClick={handleCopyScript}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Copy All' : 'कॉपी करें'}</span>
          </button>
        </div>

        {/* Primary Right Button: Open in Teleprompter */}
        <button
          onClick={handleOpenTeleprompter}
          className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all"
        >
          <Video className="w-4 h-4 fill-white" />
          <span>{language === 'en' ? 'Open in Teleprompter' : 'टेलीप्रॉम्प्टर में खोलें'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Toast Feedback */}
      {saveSuccessToast && (
        <div className="fixed bottom-20 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{language === 'en' ? 'Script saved to projects successfully!' : 'स्क्रिप्ट प्रोजेक्ट्स में सेव हो गई!'}</span>
        </div>
      )}
      {copiedToast && (
        <div className="fixed bottom-20 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{language === 'en' ? 'Copied to clipboard!' : 'क्लिपबोर्ड पर कॉपी हो गया!'}</span>
        </div>
      )}

      {/* Change Topic Modal */}
      {isChangingTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {language === 'en' ? 'Edit Topic / Idea' : 'विषय बदलें'}
            </h3>
            <textarea
              rows={3}
              value={tempTopic}
              onChange={(e) => setTempTopic(e.target.value)}
              className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new content idea or question..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsChangingTopic(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                {language === 'en' ? 'Cancel' : 'रद्द करें'}
              </button>
              <button
                onClick={() => {
                  if (tempTopic.trim()) {
                    setTopic(tempTopic.trim());
                  }
                  setIsChangingTopic(false);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
              >
                {language === 'en' ? 'Update Topic' : 'अपडेट करें'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom AI Instruction Modal */}
      {customPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {language === 'en' ? 'Custom AI Transformation' : 'कस्टम AI निर्देश'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'en'
                ? 'Tell the AI exactly how you want to adjust your script (e.g. make it funnier, add doctor advice, quote a statistic)...'
                : 'AI को बताएं कि स्क्रिप्ट में क्या बदलाव करना है (जैसे: थोड़ा मजाकिया बनाएं, डॉक्टर की सलाह जोड़ें)...'}
            </p>
            <textarea
              rows={3}
              value={customInstruction}
              onChange={(e) => setCustomInstruction(e.target.value)}
              className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Add 2 practical real-world statistics..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setCustomPromptOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                {language === 'en' ? 'Cancel' : 'रद्द करें'}
              </button>
              <button
                onClick={() => handleTransform('custom')}
                disabled={!customInstruction.trim()}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 disabled:opacity-50"
              >
                {language === 'en' ? 'Apply Instruction' : 'लागू करें'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Script Guide Modal */}
      {isGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {language === 'en' ? 'How to Write Viral Short-Form Scripts' : 'स्क्रिप्ट कैसे लिखें? (गाइड)'}
              </h3>
              <button
                onClick={() => setIsGuideOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950">
                <p className="font-bold mb-1">1. 3-सेकंड का मजबूत हुक (Hook):</p>
                <p>वीडियो शुरू होते ही दर्शक का ध्यान आकर्षित करने के लिए कोई सवाल पूछें या चौंकाने वाला तथ्य बताएं। कभी भी लंबा परिचय न दें।</p>
              </div>
              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950">
                <p className="font-bold mb-1">2. सीधे मुख्य बात पर आएं (Core Value):</p>
                <p>मुद्दे को 2-3 छोटे और स्पष्ट बिंदुओं में समझाएं। हर वाक्य 8-10 शब्दों से बड़ा न हो ताकि टेलीप्रॉम्प्टर पर आसानी से पढ़ा जा सके।</p>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                <p className="font-bold mb-1">3. स्पष्ट कॉल टू एक्शन (Call to Action):</p>
                <p>अंत में दर्शकों को बताएं कि उन्हें क्या करना है—वीडियो सेव करें, लिंक देखें या कमेंट में राय दें।</p>
              </div>
            </div>
            <button
              onClick={() => setIsGuideOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              {language === 'en' ? 'Got It' : 'समझ गया'}
            </button>
          </div>
        </div>
      )}

      {/* Version History Drawer */}
      {isVersionDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 overflow-y-auto space-y-4 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'en' ? 'Script Version History' : 'वर्जन हिस्ट्री'}
                </h3>
              </div>
              <button
                onClick={() => setIsVersionDrawerOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {versions.map((ver, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md font-mono">
                      v{ver.version} {idx === 0 ? '(Current)' : ''}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(ver.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="font-semibold text-slate-800 line-clamp-2">
                    "{ver.hook}"
                  </p>
                  <p className="text-slate-500 text-[11px] line-clamp-2">
                    {ver.mainContent[0]}
                  </p>

                  {idx !== 0 && (
                    <button
                      onClick={() => {
                        setHook(ver.hook);
                        setMainBody(ver.mainContent.join('\n\n'));
                        setClosingCta(ver.closing);
                        setIsVersionDrawerOpen(false);
                      }}
                      className="w-full py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-bold text-[11px] transition-colors"
                    >
                      {language === 'en' ? 'Restore this version' : 'यह वर्जन लोड करें'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Insufficient Credits Modal */}
      {isInsufficientCreditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative text-center">
            <button
              onClick={() => setIsInsufficientCreditModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
              <Zap className="w-7 h-7 fill-amber-500 text-amber-600" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              {language === 'en' ? 'Insufficient AI Credits' : 'क्रेडिट समाप्त हो गए हैं'}
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              {language === 'en'
                ? `Generating a full YouTube/Reel script requires AI credits. You currently have ${creditsInfo.totalAvailable} credits remaining.`
                : `स्क्रिप्ट जेनरेशन के लिए क्रेडिट आवश्यक हैं। आपके पास केवल ${creditsInfo.totalAvailable} क्रेडिट शेष हैं।`}
            </p>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <button
                onClick={() => {
                  setIsInsufficientCreditModalOpen(false);
                  navigate('/user/credits');
                }}
                className="py-2.5 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{language === 'en' ? 'Buy Top-up' : 'क्रेडिट खरीदें'}</span>
              </button>
              <button
                onClick={() => {
                  setIsInsufficientCreditModalOpen(false);
                  navigate('/user/subscription');
                }}
                className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                {language === 'en' ? 'Upgrade Plan' : 'प्लान अपग्रेड'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
