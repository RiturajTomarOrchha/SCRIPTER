import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  generateScriptWithAi,
  transformScriptWithAi,
  GeneratedScriptResult,
  isGeminiConfigured,
} from '../../services/aiService';
import { saveProject, addNotification, getProjects, getProjectById } from '../../services/storage';
import { ScriptScene, ScriptVersion, Project, TopicResearchContext, ContentIdea } from '../../types';
import { DEMO_CONTENT_IDEAS } from '../../data/mockData';
import {
  FileText,
  Sparkles,
  ArrowRight,
  ArrowLeft,
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
  BookOpen,
  ExternalLink,
  ShieldCheck,
  Trash2,
  Hash,
  MessageSquare,
  Flame,
  Mic,
  Download,
} from 'lucide-react';
import { VoiceDictationBar } from '../../components/studio/VoiceDictationBar';
import { exportScriptToPdf } from '../../services/pdfExportService';
import { VersionHistoryModal } from '../../components/studio/VersionHistoryModal';
import { TemplatePreviewModal } from '../../components/studio/TemplatePreviewModal';
import { ContentTemplate } from '../../types';

export const ScriptStudioPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeBusinessProfile, useCredits, deductCredits, creditsInfo, userProfile } = useRole();
  const { language } = useLanguage();

  // Navigation state parameters (passed from Ideas, Research, Projects, or Teleprompter)
  const navState = (location.state as {
    prefilledTopic?: string;
    ideaId?: string;
    category?: string;
    industry?: string;
    outline?: string[];
    projectId?: string;
    researchContext?: TopicResearchContext;
    initialHook?: string;
    scriptText?: string;
    version?: number;
  }) || {};

  // Form & Settings State
  const defaultTopic = language === 'hi' ? 'सोलर पैनल से बिजली बिल कैसे कम करें?' : 'How to Reduce Electricity Bill with Solar Panels';
  const [topic, setTopic] = useState<string>(navState.prefilledTopic || defaultTopic);
  const [isChangingTopic, setIsChangingTopic] = useState<boolean>(false);
  const [tempTopic, setTempTopic] = useState<string>(topic);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isResearchDrawerOpen, setIsResearchDrawerOpen] = useState<boolean>(false);

  // Look up matching research context if not passed directly via navigation state
  const resolvedResearch: TopicResearchContext | null = React.useMemo(() => {
    if (navState.researchContext) return navState.researchContext;
    const match = DEMO_CONTENT_IDEAS.find((i) => i.id === navState.ideaId || i.title === topic || i.titleHi === topic);
    if (match) {
      return {
        summary: match.summary,
        summaryHi: match.summaryHi,
        keyPoints: match.keyPoints || match.outline,
        keyPointsHi: match.keyPointsHi || match.outlineHi,
        sources: match.sources || [],
        suggestedHooks: match.suggestedHooks,
        suggestedAngles: match.suggestedAngles,
        relevance: match.relevanceLabel || match.relevance,
        tags: match.tags,
        viewCount: match.viewCount,
      };
    }
    return null;
  }, [navState.researchContext, navState.ideaId, topic]);

  // Script Configuration (Panel 3: फॉर्मेट, भाषा, लंबाई, टोन/शैली, प्लेटफॉर्म)
  const [selectedFormat, setSelectedFormat] = useState<string>('Reels / Short');
  const [selectedLanguage, setSelectedLanguage] = useState<'hi' | 'en' | 'hinglish'>('hi');
  const [videoLength, setVideoLength] = useState<'30s' | '60s' | '90s' | '180s'>('60s');
  const [tone, setTone] = useState<string>('सरल और संवादात्मक');
  const [targetAudience, setTargetAudience] = useState<string>('General Audience');
  const [platform, setPlatform] = useState<string>('Instagram Reels');

  // Script Content State (Structured Sections: Hook, Body, CTA)
  // Gracefully initialize from navState.scriptText if returned from Teleprompter
  const parseNavScript = () => {
    if (!navState.scriptText) return null;
    const parts = navState.scriptText.split('\n\n').map(s => s.trim()).filter(Boolean);
    if (parts.length >= 3) {
      return {
        hook: parts[0],
        body: parts.slice(1, -1).join('\n\n'),
        closing: parts[parts.length - 1],
      };
    }
    if (parts.length === 2) {
      return { hook: parts[0], body: parts[1], closing: '' };
    }
    if (parts.length === 1) {
      return { hook: '', body: parts[0], closing: '' };
    }
    return null;
  };
  const parsedNav = parseNavScript();

  const [hook, setHook] = useState<string>(
    parsedNav?.hook ||
      navState.initialHook ||
      (language === 'hi'
        ? 'क्या आपका भी बिजली का बिल हर महीने बढ़ता जा रहा है?'
        : 'Are you frustrated with surging electricity bills every single month?')
  );
  const [mainBody, setMainBody] = useState<string>(
    parsedNav?.body ||
      (language === 'hi'
        ? 'तो इसके लिए एक बढ़िया समाधान है - सोलर पैनल। सोलर पैनल सूरज की रोशनी से बिजली बनाता है, जिससे आप अपने घर या ऑफिस की ज़रूरत का बड़ा हिस्सा खुद ही पूरा कर सकते हैं। इसकी लागत पहले जैसी नहीं रही, क्योंकि सरकार की सब्सिडी और कई योजनाओं से यह अब अधिक किफायती हो गया है।'
        : 'Solar panels provide an immediate, eco-friendly solution that cuts electricity expenses by 80-90% while earning government subsidies under PM Surya Ghar Yojana.')
  );
  const [closingCta, setClosingCta] = useState<string>(
    parsedNav?.closing ||
      (language === 'hi'
        ? 'अगर आप भी बिजली बिल में लंबे समय तक बचत करना चाहते हैं, तो आज ही सोलर पैनल के विकल्पों के बारे में जानकारी लें और अपने घर के लिए सही सिस्टम चुनें। ऐसा ही और उपयोगी कंटेंट पाने के लिए हमारे चैनल को फॉलो करें!'
        : 'If you are considering rooftop solar, check the link below to calculate your estimated savings today. Follow for daily energy-saving tips!')
  );

  // Active View Mode ('script' | 'edit' | 'research')
  const [activeTabMode, setActiveTabMode] = useState<'script' | 'edit' | 'research'>('script');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [transformLoading, setTransformLoading] = useState<string | null>(null);
  const [customPromptOpen, setCustomPromptOpen] = useState<boolean>(false);
  const [customInstruction, setCustomInstruction] = useState<string>('');

  const [isVoiceDictationOpen, setIsVoiceDictationOpen] = useState<boolean>(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(false);

  // Append transcribed text from Web Speech API to target section
  const handleAppendFromVoice = (section: 'hook' | 'body' | 'cta', text: string) => {
    if (section === 'hook') {
      setHook((prev) => (prev ? `${prev} ${text}` : text));
    } else if (section === 'body') {
      setMainBody((prev) => (prev ? `${prev} ${text}` : text));
    } else if (section === 'cta') {
      setClosingCta((prev) => (prev ? `${prev} ${text}` : text));
    }
  };

  // Version History State
  const [isVersionDrawerOpen, setIsVersionDrawerOpen] = useState<boolean>(false);
  const [versions, setVersions] = useState<ScriptVersion[]>([
    {
      version: 1,
      updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      hook: hook,
      mainContent: [mainBody],
      closing: closingCta,
    },
  ]);

  // Project linkage
  const [savedProjectId, setSavedProjectId] = useState<string | null>(navState.projectId || null);
  const [saveSuccessToast, setSaveSuccessToast] = useState<boolean>(false);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isInsufficientCreditModalOpen, setIsInsufficientCreditModalOpen] = useState(false);

  // Autosave State
  type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');
  const isInitialMount = useRef(true);

  // Load existing project data if projectId is supplied without direct scriptText
  useEffect(() => {
    if (navState.projectId) {
      const proj = getProjectById(navState.projectId);
      if (proj) {
        if (!navState.prefilledTopic && proj.title) {
          setTopic(proj.title);
        }
        if (!navState.scriptText && proj.scriptVersions && proj.scriptVersions.length > 0) {
          const latest = proj.scriptVersions[0];
          setHook(latest.hook || proj.scriptSnippet || '');
          setMainBody(latest.mainContent?.join('\n\n') || '');
          setClosingCta(latest.closing || '');
          setVersions(proj.scriptVersions);
        } else if (!navState.scriptText && proj.scriptSnippet) {
          setHook(proj.scriptSnippet);
        }
      }
    }
  }, [navState.projectId]);

  // Calculate stats
  const fullScriptText = `${hook}\n\n${mainBody}\n\n${closingCta}`;
  const totalChars = fullScriptText.length;
  const wordCount = fullScriptText.trim().split(/\s+/).filter(Boolean).length;
  const estimatedSeconds = Math.round((wordCount / 130) * 60);

  // Debounced Autosave (1500ms)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setSaveStatus('unsaved');
    const timer = setTimeout(() => {
      try {
        setSaveStatus('saving');
        const proj = saveProject({
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
        if (!savedProjectId && proj.id) {
          setSavedProjectId(proj.id);
        }
        setSaveStatus('saved');
        setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } catch (err) {
        console.error('Autosave error:', err);
        setSaveStatus('error');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [hook, mainBody, closingCta, topic, versions, tone, videoLength, selectedFormat]);

  // Guard against navigating away with unsaved state
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (saveStatus === 'unsaved' || saveStatus === 'saving') {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveStatus]);

  // If outline was passed from an idea on mount, set it up
  useEffect(() => {
    if (navState.outline && navState.outline.length >= 2) {
      setHook(navState.initialHook || navState.outline[0] || hook);
      setMainBody(navState.outline.slice(1, -1).join('\n\n') || navState.outline[1]);
      if (navState.outline.length > 2) {
        setClosingCta(navState.outline[navState.outline.length - 1]);
      }
    }
  }, [navState.outline, navState.initialHook]);

  // Toast clear
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

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

  // AI Generation (Primary - grounded in Research Context)
  const handleGenerateScript = async () => {
    if (creditsInfo.totalAvailable < 1) {
      setIsInsufficientCreditModalOpen(true);
      return;
    }

    setIsGenerating(true);
    try {
      const durSec = videoLength === '30s' ? 30 : videoLength === '60s' ? 60 : 90;

      // Ground prompt in research facts if available
      const researchBulletPoints = resolvedResearch
        ? (language === 'hi' ? resolvedResearch.keyPointsHi : resolvedResearch.keyPoints)?.join('; ')
        : '';
      const additionalNotes = researchBulletPoints
        ? `Grounded in verified facts: ${researchBulletPoints}`
        : '';

      const result = await generateScriptWithAi({
        topic,
        videoType: videoLength === '30s' ? 'short' : 'medium',
        durationSeconds: durSec,
        language: selectedLanguage,
        tone,
        additionalInstructions: additionalNotes,
        businessProfile: activeBusinessProfile,
      });

      setHook(result.hook);
      setMainBody(result.mainContent.join('\n\n'));
      setClosingCta(result.closing);
      recordVersion(result.hook, result.mainContent.join('\n\n'), result.closing);

      // Deduct 1 credit atomically with ledger entry
      deductCredits(1, 'script_generation', `AI Script for: "${topic}"`, {
        businessProfileName: activeBusinessProfile.name,
      });

      setToastMessage(language === 'en' ? 'Script generated successfully with verified facts!' : 'शोध आधारित स्क्रिप्ट सफलतापूर्वक तैयार हुई!');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Quick Transformation Handlers
  const handleTransform = async (action: 'rewrite' | 'expand' | 'shorten' | 'add_hook' | 'add_cta' | 'custom') => {
    if (creditsInfo.totalAvailable < 1) {
      setIsInsufficientCreditModalOpen(true);
      return;
    }

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

      deductCredits(1, 'script_generation', `Script transformation (${action}): "${topic}"`, {
        businessProfileName: activeBusinessProfile.name,
      });

      setToastMessage(language === 'en' ? `Transformation applied: ${action}` : 'बदलाव लागू किया गया!');
    } catch (err) {
      console.error(err);
    } finally {
      setTransformLoading(null);
    }
  };

  // Insert a research point directly into the script body
  const handleInsertResearchPoint = (pointText: string) => {
    setMainBody((prev) => `${prev}\n\n• ${pointText}`);
    setToastMessage(language === 'en' ? 'Fact added to script!' : 'तथ्य स्क्रिप्ट में जोड़ा गया!');
  };

  // Apply alternate hook from research
  const handleApplyResearchHook = (hookText: string) => {
    setHook(hookText);
    setToastMessage(language === 'en' ? 'Hook updated from research!' : 'हुक अपडेट किया गया!');
  };

  // Clear script
  const handleClearScript = () => {
    if (confirm(language === 'en' ? 'Clear the current script text?' : 'क्या आप वर्तमान स्क्रिप्ट खाली करना चाहते हैं?')) {
      setHook('');
      setMainBody('');
      setClosingCta('');
    }
  };

  // Save to Project
  const handleSaveProject = () => {
    setSaveStatus('saving');
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
    setSaveStatus('saved');
    setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
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

  // Open in Teleprompter (Prompt 6 & 8 direct handoff)
  const handleOpenTeleprompter = () => {
    const proj = handleSaveProject();
    navigate('/user/teleprompter', {
      state: {
        projectId: proj.id,
        scriptText: fullScriptText,
        title: topic,
        version: versions[0]?.version || 1,
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 pb-24 md:pb-12 space-y-5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Top Breadcrumb & Selected Topic Banner (Panel 3 Image 1 & 2) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/user/ideas')}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
            title="Back to Ideas & Research"
          >
            ← {language === 'en' ? 'Back' : 'वापस'}
          </button>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">
                {language === 'en' ? 'Selected Topic:' : 'चयनित विषय:'}
              </span>
              <button
                onClick={() => {
                  setTempTopic(topic);
                  setIsChangingTopic(true);
                }}
                className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>{language === 'en' ? 'Change' : 'विषय बदलें'}</span>
              </button>
            </div>
            <h1 className="text-base sm:text-xl font-bold text-slate-900 line-clamp-1">
              {topic}
            </h1>
          </div>
        </div>

        {/* Right side Topic Actions: Autosave Badge, Research Context Pill, Save Draft */}
        <div className="flex flex-wrap items-center gap-2 self-end md:self-auto">
          {/* Autosave Status Indicator */}
          {saveStatus === 'saving' && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-200/60 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span>{language === 'en' ? 'Autosaving...' : 'ऑटो-सेव...'}</span>
            </span>
          )}
          {saveStatus === 'saved' && (
            <span
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200/60"
              title={`Saved at ${lastSavedTime}`}
            >
              <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
              <span>{language === 'en' ? 'Saved' : 'सुरक्षित'}</span>
            </span>
          )}
          {saveStatus === 'unsaved' && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-semibold border border-amber-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>{language === 'en' ? 'Unsaved' : 'असेव्ड'}</span>
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-[11px] font-semibold border border-red-200/60">
              <AlertCircle className="w-3 h-3 text-red-600" />
              <span>{language === 'en' ? 'Save Failed' : 'सेव असफल'}</span>
            </span>
          )}

          {resolvedResearch && (
            <button
              onClick={() => setIsResearchDrawerOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
              title="Open verified research context & source notes"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>{language === 'en' ? 'Research Context' : 'रिसर्च संदर्भ'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>
          )}

          <button
            onClick={handleSaveProject}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-200"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Save Draft' : 'सेव ड्राफ्ट'}</span>
          </button>
        </div>
      </div>

      {/* 2. Script Settings Bar (Panel 3: कंटेंट फॉर्मेट, भाषा, लंबाई, टोन/शैली, प्लेटफॉर्म) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
          <span className="uppercase tracking-wider text-[11px] text-slate-400">
            {language === 'en' ? 'Script Settings' : 'स्क्रिप्ट सेटिंग्स'}
          </span>
          <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200/50">
            {activeBusinessProfile.name} • {activeBusinessProfile.industry}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 text-xs">
          {/* Content Format */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {language === 'en' ? 'Format' : 'कंटेंट फॉर्मेट'}
            </label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full min-h-[44px] px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              <option value="Reels / Short">Short Video (Reels)</option>
              <option value="Story">Story / Status</option>
              <option value="Long Form">Long Video (YouTube)</option>
            </select>
          </div>

          {/* Language */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {language === 'en' ? 'Language' : 'भाषा'}
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as any)}
              className="w-full min-h-[44px] px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              <option value="hi">हिंदी (Hindi)</option>
              <option value="en">English</option>
              <option value="hinglish">Hinglish</option>
            </select>
          </div>

          {/* Length */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {language === 'en' ? 'Length' : 'लंबाई'}
            </label>
            <select
              value={videoLength}
              onChange={(e) => setVideoLength(e.target.value as any)}
              className="w-full min-h-[44px] px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              <option value="30s">30 सेकंड (Shorts)</option>
              <option value="60s">~ 60 सेकंड (Reels)</option>
              <option value="90s">90 सेकंड</option>
              <option value="180s">3 मिनट (Long)</option>
            </select>
          </div>

          {/* Tone / Style */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {language === 'en' ? 'Tone / Style' : 'टोन / शैली'}
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full min-h-[44px] px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              <option value="सरल और संवादात्मक">सरल और संवादात्मक (Friendly)</option>
              <option value="शांत और प्रभावी">शांत और प्रभावी (Calm)</option>
              <option value="उत्साही और वायरल">उत्साही और वायरल (Energetic)</option>
              <option value="पेशेवर">पेशेवर (Professional)</option>
              <option value="तथ्यात्मक">तथ्यात्मक (Factual)</option>
            </select>
          </div>

          {/* Platform */}
          <div className="space-y-1 col-span-2 sm:col-span-1">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {language === 'en' ? 'Platform' : 'प्लेटफॉर्म'}
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full min-h-[44px] px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              <option value="Instagram Reels">Instagram Reels</option>
              <option value="YouTube Shorts">YouTube Shorts</option>
              <option value="Facebook Reels">Facebook Reels</option>
              <option value="LinkedIn Video">LinkedIn Video</option>
            </select>
          </div>
        </div>

        {/* Primary AI Generation Trigger Button */}
        <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="line-clamp-1">
              {resolvedResearch
                ? (language === 'en' ? 'Grounded in verified research facts & citations.' : 'सत्यापित शोध संदर्भों के आधार पर तैयार होगी।')
                : (language === 'en' ? 'Ready to generate high-retention structured script.' : 'उच्च गुणवत्ता वाली संरचित स्क्रिप्ट तैयार करने के लिए तैयार।')}
            </span>
          </div>

          <button
            onClick={handleGenerateScript}
            disabled={isGenerating}
            className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all disabled:opacity-60"
          >
            <Sparkles className="w-4 h-4 fill-white shrink-0" />
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

      {/* 3. Action Toolbar: Transformation Pills (Panel 3: री-राइट, संक्षिप्त करें, विस्तारित करें...) */}
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
          <span>{language === 'en' ? 'Generated Script' : 'जनरेटेड स्क्रिप्ट'}</span>
        </button>

        {resolvedResearch && (
          <button
            onClick={() => setActiveTabMode('research')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              activeTabMode === 'research'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Research Context' : 'रिसर्च संदर्भ'}</span>
          </button>
        )}

        <button
          onClick={() => handleTransform('rewrite')}
          disabled={Boolean(transformLoading)}
          className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold transition-all shrink-0 flex items-center gap-1.5"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${transformLoading === 'rewrite' ? 'animate-spin text-blue-600' : ''}`} />
          <span>{language === 'en' ? 'Rewrite' : 'री-राइट'}</span>
        </button>

        <button
          onClick={() => handleTransform('shorten')}
          disabled={Boolean(transformLoading)}
          className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold transition-all shrink-0 flex items-center gap-1.5"
        >
          <Scissors className={`w-3.5 h-3.5 ${transformLoading === 'shorten' ? 'animate-pulse text-blue-600' : ''}`} />
          <span>{language === 'en' ? 'Shorten' : 'संक्षिप्त करें'}</span>
        </button>

        <button
          onClick={() => handleTransform('expand')}
          disabled={Boolean(transformLoading)}
          className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold transition-all shrink-0 flex items-center gap-1.5"
        >
          <Maximize2 className={`w-3.5 h-3.5 ${transformLoading === 'expand' ? 'animate-pulse text-blue-600' : ''}`} />
          <span>{language === 'en' ? 'Expand' : 'विस्तारित करें'}</span>
        </button>

        <button
          onClick={() => setCustomPromptOpen(true)}
          className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-semibold transition-all shrink-0 flex items-center gap-1.5"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{language === 'en' ? 'Custom AI Edit' : 'कस्टम AI निर्देश'}</span>
        </button>

        <button
          onClick={() => setIsVoiceDictationOpen((prev) => !prev)}
          className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
            isVoiceDictationOpen
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
          }`}
          title="Dictate spoken script with Web Speech API"
        >
          <Mic className={`w-3.5 h-3.5 ${isVoiceDictationOpen ? 'animate-pulse' : ''}`} />
          <span>{language === 'en' ? 'Voice Dictate' : 'वॉइस डिक्टेट'}</span>
        </button>

        <button
          onClick={() => setIsTemplateModalOpen(true)}
          className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-semibold transition-all shrink-0 flex items-center gap-1.5"
          title="Browse Viral Templates & Outlines"
        >
          <Layers className="w-3.5 h-3.5 text-purple-600" />
          <span>{language === 'en' ? 'Templates' : 'टेम्पलेट्स'}</span>
        </button>
      </div>

      {/* 4. MAIN WORKSPACE: 2 Columns (Left: Script Editor, Right: AI Tools & Preview) matching Image 1 & 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (8 cols): Structured Script Editor */}
        <div className="lg:col-span-8 space-y-4">
          {activeTabMode === 'research' && resolvedResearch ? (
            /* Inline Research Context View */
            <div className="bg-white rounded-3xl p-5 border border-blue-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                    <BookOpen className="w-4 h-4" />
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    {language === 'en' ? 'Research Brief & Sources' : 'शोध सारांश व संदर्भ स्रोत'}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTabMode('script')}
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  ← {language === 'en' ? 'Back to Script' : 'स्क्रिप्ट पर लौटें'}
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs text-blue-950 leading-relaxed">
                {language === 'hi' ? resolvedResearch.summaryHi || resolvedResearch.summary : resolvedResearch.summary}
              </div>

              {/* Key points with one-click insert */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {language === 'en' ? 'Key Facts (Click + to insert into script)' : 'मुख्य बिंदु (+ पर क्लिक करके स्क्रिप्ट में जोड़ें)'}
                </span>
                <div className="space-y-2">
                  {(language === 'hi' ? resolvedResearch.keyPointsHi || resolvedResearch.keyPoints : resolvedResearch.keyPoints)?.map((point, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 text-xs"
                    >
                      <span className="leading-relaxed text-slate-800">{point}</span>
                      <button
                        onClick={() => handleInsertResearchPoint(point)}
                        className="px-2.5 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold shrink-0 flex items-center gap-1 transition-colors"
                        title="Add to script body"
                      >
                        <Plus className="w-3 h-3" />
                        <span>जोड़ें</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Sources */}
              {resolvedResearch.sources && resolvedResearch.sources.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {language === 'en' ? 'Verified Sources' : 'सत्यापित संदर्भ स्रोत'}
                  </span>
                  <div className="space-y-1.5">
                    {resolvedResearch.sources.map((s, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                      >
                        <span className="font-semibold text-slate-800">{s.name}</span>
                        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
                          <span>{s.date}</span>
                          {s.url && (
                            <a href={s.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Structured Script Sections: Hook (0-5s), Main Content (5-50s), CTA (50-60s) */
            <div className="space-y-4">
              {/* Hands-Free Voice Dictation Bar (Web Speech API) */}
              {isVoiceDictationOpen && (
                <VoiceDictationBar
                  selectedLanguage={selectedLanguage}
                  onAppendText={handleAppendFromVoice}
                  onClose={() => setIsVoiceDictationOpen(false)}
                />
              )}

              {/* Word count header indicator matching Image 2 Panel 3 */}
              <div className="flex items-center justify-between text-xs font-semibold px-2">
                <span className="text-slate-500">
                  {language === 'en' ? 'Generated Script (Reels ~ 60s)' : 'जनरेटेड स्क्रिप्ट (Reels ~ 60 सेकंड)'}
                </span>
                <span className="font-mono text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  {wordCount} / 600 {language === 'en' ? 'words' : 'शब्द'}
                </span>
              </div>

              {/* Section A: Hook (0-5s) */}
              <div className="bg-white rounded-3xl p-5 border border-amber-200 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-amber-100 text-amber-700">⚡</span>
                    <h3 className="text-xs sm:text-sm font-bold text-amber-950 uppercase tracking-wide">
                      {language === 'en' ? '[Hook - 0-5 Seconds]' : '[Hook - 0-5 सेकंड]'}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsVoiceDictationOpen(true)}
                      className="text-xs text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded-lg font-semibold flex items-center gap-1 transition-colors"
                      title="Speak to dictate hook"
                    >
                      <Mic className="w-3 h-3" />
                      <span>{language === 'en' ? 'Voice' : 'आवाज'}</span>
                    </button>
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
                </div>

                <textarea
                  rows={2}
                  value={hook}
                  onChange={(e) => setHook(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-amber-50/40 border border-amber-200 text-sm font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 leading-relaxed resize-none"
                  placeholder="Enter attention-grabbing opening hook..."
                />
              </div>

              {/* Section B: Main Content (5-50s) */}
              <div className="bg-white rounded-3xl p-5 border border-blue-200 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-blue-100 text-blue-700">💡</span>
                    <h3 className="text-xs sm:text-sm font-bold text-blue-950 uppercase tracking-wide">
                      {language === 'en' ? '[Main Content - 5-50 Seconds]' : '[मुख्य भाग - 5-50 सेकंड]'}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsVoiceDictationOpen(true)}
                      className="text-xs text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg font-semibold flex items-center gap-1 transition-colors"
                      title="Speak to dictate core body"
                    >
                      <Mic className="w-3 h-3" />
                      <span>{language === 'en' ? 'Voice' : 'आवाज'}</span>
                    </button>
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
                </div>

                <textarea
                  rows={6}
                  value={mainBody}
                  onChange={(e) => setMainBody(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-blue-50/20 border border-blue-200 text-sm font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 leading-relaxed resize-none"
                  placeholder="Enter core content breakdown and value points..."
                />
              </div>

              {/* Section C: Conclusion & CTA (50-60s) */}
              <div className="bg-white rounded-3xl p-5 border border-emerald-200 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-emerald-100 text-emerald-700">🎯</span>
                    <h3 className="text-xs sm:text-sm font-bold text-emerald-950 uppercase tracking-wide">
                      {language === 'en' ? '[Closing & CTA - 50-60 Seconds]' : '[समापन और CTA - 50-60 सेकंड]'}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsVoiceDictationOpen(true)}
                      className="text-xs text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg font-semibold flex items-center gap-1 transition-colors"
                      title="Speak to dictate CTA"
                    >
                      <Mic className="w-3 h-3" />
                      <span>{language === 'en' ? 'Voice' : 'आवाज'}</span>
                    </button>
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
                </div>

                <textarea
                  rows={3}
                  value={closingCta}
                  onChange={(e) => setClosingCta(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-emerald-50/30 border border-emerald-200 text-sm font-medium text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 leading-relaxed resize-none"
                  placeholder="Enter clear call to action..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 cols): AI Tools List & Video Preview matching Image 1 & 2 */}
        <div className="lg:col-span-4 space-y-4">
          {/* SCRIPT PREVIEW BOX matching Image 1 Panel 3 */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-blue-600" />
                <span>{language === 'en' ? 'Script Preview' : 'स्क्रिप्ट प्रीव्यू'}</span>
              </h4>
              <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                ~{estimatedSeconds}s Reel
              </span>
            </div>

            {/* Video Preview Frame */}
            <div className="relative rounded-2xl overflow-hidden aspect-video sm:aspect-[4/3] bg-slate-950 border border-slate-800 shadow-md">
              <img
                src="/assets/aistudio/Master_Admin_UI___________6_Visual_Assets_Management_bfd1be4e.png"
                alt="Presenter"
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              {/* Subtitle Banner matching Image 1 Panel 3 */}
              <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-md p-2 rounded-xl border border-white/10 text-center">
                <p className="text-xs font-bold text-amber-300 leading-snug line-clamp-2">
                  "{hook || topic}"
                </p>
                <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono mt-1">
                  <span>0:00 / 0:58</span>
                  <span className="text-emerald-400 font-bold">HD 1080p</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI TOOLS LIST matching Image 2 Panel 3 */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-xs space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-100">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{language === 'en' ? 'Quick AI Tools' : 'AI टूल्स'}</span>
            </h4>

            <div className="space-y-1.5">
              {[
                { id: 'add_hook', label: language === 'en' ? 'Add Viral Hook' : '⚡ हुक जोड़ें', action: () => handleTransform('add_hook') },
                { id: 'add_cta', label: language === 'en' ? 'Add High-Converting CTA' : '🎯 CTA जोड़ें', action: () => handleTransform('add_cta') },
                { id: 'expand', label: language === 'en' ? 'Expand Bullet Points' : '📝 पॉइंट्स लिखें', action: () => handleTransform('expand') },
                { id: 'tone', label: language === 'en' ? 'Switch Tone & Style' : '🎨 टोन बदलें', action: () => setCustomPromptOpen(true) },
                { id: 'simplify', label: language === 'en' ? 'Simplify Language' : '🗣️ भाषा सरल करें', action: () => handleTransform('shorten') },
                { id: 'notes', label: language === 'en' ? 'Add Custom Notes' : '✍️ अपने नोट्स जोड़ें', action: () => setCustomPromptOpen(true) },
              ].map((tool) => (
                <button
                  key={tool.id}
                  onClick={tool.action}
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-semibold flex items-center justify-between transition-colors border border-slate-100"
                >
                  <span>{tool.label}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400 -rotate-90" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Bottom Sticky Action Bar matching Image 1 & 2 */}
      <div className="sticky bottom-20 sm:bottom-4 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Utilities: 4 equal grid columns on mobile, row on tablet/desktop */}
        <div className="grid grid-cols-4 sm:flex sm:items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
          <button
            onClick={handleClearScript}
            className="min-h-[42px] px-2 sm:px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1 transition-colors"
            title="Clear script fields"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="truncate">{language === 'en' ? 'Clear' : 'क्लियर'}</span>
          </button>

          <button
            onClick={handleCopyScript}
            className="min-h-[42px] px-2 sm:px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1 transition-colors"
            title="Copy entire script to clipboard"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="truncate">{language === 'en' ? 'Copy All' : 'कॉपी'}</span>
          </button>

          <button
            onClick={() => setIsVersionDrawerOpen(true)}
            className="min-h-[42px] px-2 sm:px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1 transition-colors"
            title="View revision history"
          >
            <History className="w-3.5 h-3.5" />
            <span className="truncate">{versions.length} {language === 'en' ? 'Vers' : 'वर्जन'}</span>
          </button>

          <button
            type="button"
            onClick={() =>
              exportScriptToPdf({
                title: topic,
                hook,
                mainBody,
                closingCta,
                language: selectedLanguage,
                videoLength,
                tone,
                targetAudience,
                businessProfileName: activeBusinessProfile?.name,
                creatorName: userProfile?.name,
              })
            }
            className="min-h-[42px] px-2 sm:px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-800 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/50 text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1 transition-colors shadow-2xs"
            title="Download branded production-ready PDF"
          >
            <Download className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            <span className="truncate">{language === 'en' ? 'PDF' : 'PDF'}</span>
          </button>
        </div>

        {/* Primary Right Action: Teleprompter Handoff */}
        <button
          onClick={handleOpenTeleprompter}
          className="w-full sm:w-auto min-h-[46px] px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all"
        >
          <Video className="w-4 h-4 fill-white shrink-0" />
          <span>{language === 'en' ? 'Send to Teleprompter →' : '🚀 टेलीप्रॉम्प्टर में खोलें'}</span>
        </button>
      </div>

      {/* RESEARCH CONTEXT DRAWER / MODAL */}
      {isResearchDrawerOpen && resolvedResearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                  <BookOpen className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'en' ? 'Research Context & Facts' : 'रिसर्च संदर्भ और तथ्य'}
                </h3>
              </div>
              <button
                onClick={() => setIsResearchDrawerOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Overview */}
            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs text-blue-950 leading-relaxed">
              {language === 'hi' ? resolvedResearch.summaryHi || resolvedResearch.summary : resolvedResearch.summary}
            </div>

            {/* Key Facts with insert button */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {language === 'en' ? 'Facts & Talking Points (Insert into script)' : 'मुख्य तथ्य (स्क्रिप्ट में जोड़ें)'}
              </h4>
              <div className="space-y-2">
                {(language === 'hi' ? resolvedResearch.keyPointsHi || resolvedResearch.keyPoints : resolvedResearch.keyPoints)?.map((pt, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 text-xs"
                  >
                    <span className="leading-relaxed text-slate-800">{pt}</span>
                    <button
                      onClick={() => handleInsertResearchPoint(pt)}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shrink-0 flex items-center gap-1 transition-colors text-[11px]"
                    >
                      <Plus className="w-3 h-3" />
                      <span>जोड़ें</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Alternate Hooks */}
            {resolvedResearch.suggestedHooks && resolvedResearch.suggestedHooks.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {language === 'en' ? 'Alternative Opening Hooks' : 'वैकल्पिक शुरुआती हुक'}
                </h4>
                <div className="space-y-2">
                  {resolvedResearch.suggestedHooks.map((h, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <span className="text-[10px] uppercase font-bold text-amber-800 block">{h.type}</span>
                        <p className="font-semibold text-slate-900 mt-0.5">"{language === 'hi' ? h.hookHi : h.hook}"</p>
                      </div>
                      <button
                        onClick={() => handleApplyResearchHook(language === 'hi' ? h.hookHi : h.hook)}
                        className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold shrink-0 text-[11px]"
                      >
                        लागू करें
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verified Sources */}
            {resolvedResearch.sources && (
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {language === 'en' ? 'Verified Citations' : 'सत्यापित संदर्भ स्रोत'}
                </h4>
                <div className="space-y-1">
                  {resolvedResearch.sources.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-700">
                      <span className="font-medium">{s.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">{s.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
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
                ? 'Tell the AI exactly how you want to adjust your script (e.g. make it funnier, quote official data, simplify language)...'
                : 'AI को बताएं कि स्क्रिप्ट में क्या बदलाव करना है (जैसे: थोड़ा मजाकिया बनाएं, सरकारी डेटा जोड़ें)...'}
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

      {/* Version History Drawer */}
      {isVersionDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md h-full p-6 shadow-2xl border-l border-slate-200 flex flex-col justify-between space-y-4 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'en' ? 'Script Revision History' : 'वर्जन हिस्ट्री'}
                </h3>
              </div>
              <button
                onClick={() => setIsVersionDrawerOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {versions.map((ver) => (
                <div
                  key={ver.version}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-blue-600">v{ver.version}</span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {new Date(ver.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="line-clamp-2 font-medium text-slate-800">
                    "{ver.hook}"
                  </p>
                  <button
                    onClick={() => {
                      setHook(ver.hook);
                      const restoredBody = ver.mainContent.join('\n\n');
                      setMainBody(restoredBody);
                      setClosingCta(ver.closing);
                      recordVersion(ver.hook, restoredBody, ver.closing);
                      setIsVersionDrawerOpen(false);
                      setToastMessage(language === 'en' ? `Restored v${ver.version}` : `वर्जन ${ver.version} रीस्टोर किया गया`);
                    }}
                    className="w-full py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold transition-colors"
                  >
                    {language === 'en' ? 'Restore This Version' : 'यह वर्जन रीस्टोर करें'}
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsVersionDrawerOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
            >
              {language === 'en' ? 'Close' : 'बंद करें'}
            </button>
          </div>
        </div>
      )}

      {/* Template Preview & Inspector Modal */}
      <TemplatePreviewModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        currentIndustry={activeBusinessProfile.industry}
        hasExistingScriptContent={Boolean(hook || mainBody || closingCta)}
        onApplyTemplate={(tpl: ContentTemplate) => {
          recordVersion(hook, mainBody, closingCta);
          const outline = tpl.scriptOutline || [];
          let newHook = tpl.title;
          let newBody = tpl.description;
          let newCta = 'Follow for more daily tips!';

          if (outline.length >= 3) {
            newHook = outline[0];
            newBody = outline.slice(1, -1).join('\n\n');
            newCta = outline[outline.length - 1];
          } else if (outline.length === 2) {
            newHook = outline[0];
            newBody = outline[1];
            newCta = tpl.description;
          }

          setHook(newHook);
          setMainBody(newBody);
          setClosingCta(newCta);
          setToastMessage(language === 'en' ? `Applied "${tpl.title}" template` : `"${tpl.title}" टेम्पलेट लागू किया गया`);
        }}
      />
    </div>
  );
};
