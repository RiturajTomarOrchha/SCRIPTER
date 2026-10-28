import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import { useLanguage } from '../../context/LanguageContext';
import { generateScriptWithAi, GeneratedScriptResult, isGeminiConfigured } from '../../services/aiService';
import { saveProject } from '../../services/storage';
import { ScriptScene, ScriptVersion } from '../../types';
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
} from 'lucide-react';

export const ScriptStudioPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeBusinessProfile, useCredits, creditsUsed, creditsTotal } = useRole();
  const { language } = useLanguage();

  // Location state parameters (passed from Ideas page if clicked)
  const navState = (location.state as {
    prefilledTopic?: string;
    ideaId?: string;
    category?: string;
    industry?: string;
  }) || {};

  // Form State
  const [topic, setTopic] = useState(
    navState.prefilledTopic ||
      (language === 'hi'
        ? 'सर्दियों में इम्यूनिटी कैसे बढ़ाएं'
        : 'How to Boost Immunity Naturally in Winter')
  );
  const [videoType, setVideoType] = useState<'short' | 'medium' | 'long' | 'custom'>('short');
  const [selectedLanguage, setSelectedLanguage] = useState<'hi' | 'en' | 'hinglish'>(
    language === 'hi' ? 'hi' : 'en'
  );
  const [tone, setTone] = useState<string>('Educational & Informative');
  const [additionalInstructions, setAdditionalInstructions] = useState('');

  // Generation & Flow States
  // 'form' | 'generating' | 'result'
  const [studioStage, setStudioStage] = useState<'form' | 'generating' | 'result'>('form');
  const [generatingProgress, setGeneratingProgress] = useState(0);
  const [activeResultTab, setActiveResultTab] = useState<'script' | 'visuals' | 'voice'>('script');

  // Script Data State
  const [generatedScript, setGeneratedScript] = useState<GeneratedScriptResult | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableHook, setEditableHook] = useState('');
  const [editableMain, setEditableMain] = useState<string[]>([]);
  const [editableClosing, setEditableClosing] = useState('');
  const [scenes, setScenes] = useState<ScriptScene[]>([]);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [isSavedToProject, setIsSavedToProject] = useState(false);
  const [savedProjectId, setSavedProjectId] = useState<string | null>(null);

  // Teleprompter Controls State
  const [teleprompterSpeed, setTeleprompterSpeed] = useState<number>(3);
  const [teleprompterFontSize, setTeleprompterFontSize] = useState<number>(18);
  const [isTeleprompterPlaying, setIsTeleprompterPlaying] = useState(false);

  const durationSeconds = videoType === 'short' ? 30 : videoType === 'medium' ? 60 : 120;
  const hasGemini = isGeminiConfigured();

  // Tone Options
  const toneOptions = [
    { id: 'Educational & Informative', labelEn: 'Informative', labelHi: 'जानकारीपूर्ण' },
    { id: 'Professional', labelEn: 'Professional', labelHi: 'पेशेवर' },
    { id: 'Conversational', labelEn: 'Conversational', labelHi: 'संवादात्मक' },
    { id: 'Motivational', labelEn: 'Motivational', labelHi: 'प्रेरणादायक' },
    { id: 'Simple & Clear', labelEn: 'Simple Language', labelHi: 'सरल भाषा' },
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setStudioStage('generating');
    setGeneratingProgress(15);

    // Simulate animated generation pipeline
    const interval = setInterval(() => {
      setGeneratingProgress((prev) => {
        if (prev >= 85) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 350);

    try {
      const result = await generateScriptWithAi({
        topic,
        videoType,
        durationSeconds,
        language: selectedLanguage,
        tone,
        additionalInstructions,
        businessProfile: activeBusinessProfile,
      });

      clearInterval(interval);
      setGeneratingProgress(100);

      setTimeout(() => {
        setGeneratedScript(result);
        setEditableHook(result.hook);
        setEditableMain(result.mainContent);
        setEditableClosing(result.closing);
        setScenes(result.scenes.map((s) => ({ ...s, selected: true })));
        setStudioStage('result');
        useCredits(10);
      }, 400);
    } catch (err) {
      clearInterval(interval);
      setStudioStage('form');
      console.error(err);
    }
  };

  const copyToClipboard = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleSaveToProject = () => {
    const titleText = topic;
    const project = saveProject({
      id: savedProjectId || undefined,
      title: titleText,
      titleHi: selectedLanguage === 'hi' ? titleText : undefined,
      industry: activeBusinessProfile.industry,
      category: activeBusinessProfile.category,
      status: 'in_progress',
      format: videoType === 'short' ? 'reel' : 'short',
      duration: `${durationSeconds}s`,
      scriptSnippet: editableHook,
      businessProfileId: activeBusinessProfile.id,
      scriptVersions: [
        {
          version: 1,
          updatedAt: new Date().toISOString(),
          hook: editableHook,
          mainContent: editableMain,
          closing: editableClosing,
        },
      ],
      scenes: scenes,
      notes: `Generated in Script Studio with ${tone} tone.`,
    });

    setSavedProjectId(project.id);
    setIsSavedToProject(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      {/* Top Breadcrumb & Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (studioStage === 'result') setStudioStage('form');
              else navigate('/user/home');
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            ←
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>{language === 'en' ? 'Script Studio' : 'स्क्रिप्ट स्टूडियो'}</span>
              <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-bold">
                Phase 2
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              {language === 'en'
                ? 'From idea to viral script in seconds'
                : 'विषय से तैयार स्क्रिप्ट तक — सरल, तेज़ और पेशेवर'}
            </p>
          </div>
        </div>

        {/* AI Engine Status Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-xs">
          <Sparkles className={`w-3.5 h-3.5 ${hasGemini ? 'text-blue-600' : 'text-amber-500'}`} />
          <span className="text-[11px] font-medium hidden sm:inline">
            {hasGemini ? 'Gemini 2.5 Flash' : 'Curated Engine (Demo Mode)'}
          </span>
        </div>
      </div>

      {/* ================= STAGE 1: CREATE SCRIPT FORM ================= */}
      {studioStage === 'form' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
          {/* Active Profile context */}
          <div className="flex items-center justify-between p-3 bg-blue-50/60 rounded-2xl border border-blue-100 text-xs text-blue-900">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                {language === 'en' ? 'Active Profile:' : 'सक्रिय प्रोफाइल:'}{' '}
                <strong>{activeBusinessProfile.name}</strong> ({activeBusinessProfile.industry})
              </span>
            </div>
            <button
              onClick={() => navigate('/user/ideas')}
              className="text-[11px] font-bold text-blue-700 hover:underline shrink-0"
            >
              {language === 'en' ? 'Browse Ideas' : 'आइडिया देखें'} →
            </button>
          </div>

          {/* 1. Topic / Idea input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs sm:text-sm font-bold text-slate-900">
                1. {language === 'en' ? 'Topic / Content Idea' : 'विषय / आइडिया'}
              </label>
              <span className="text-[11px] text-slate-400 font-mono">{topic.length}/200</span>
            </div>
            <textarea
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value.slice(0, 200))}
              placeholder={
                language === 'en'
                  ? 'e.g. How to control high blood pressure naturally in 30 days...'
                  : 'जैसे: सर्दियों में इम्युनिटी कैसे बढ़ाएं, डायबिटीज कंट्रोल टिप्स...'
              }
              className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* 2. Video Duration / Type */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-bold text-slate-900">
              2. {language === 'en' ? 'Video Format & Duration' : 'वीडियो प्रकार एवं अवधि'}
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { id: 'short', label: 'Short', range: '15-30s', icon: '⚡' },
                { id: 'medium', label: 'Medium', range: '30-60s', icon: '⏱️' },
                { id: 'long', label: 'Long', range: '60-180s', icon: '📺' },
              ].map((item) => {
                const isSelected = videoType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setVideoType(item.id as any)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'border-amber-400 bg-amber-50/50 shadow-2xs ring-1 ring-amber-400'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <span className="text-sm">{item.icon}</span>
                    <p className="text-xs font-bold text-slate-900 mt-1">{item.label}</p>
                    <span className="text-[10px] text-slate-500 block font-mono">{item.range}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Language & Tone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-bold text-slate-900">
                3. {language === 'en' ? 'Script Language' : 'भाषा'}
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as any)}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="hi">हिंदी (Hindi - Devanagari)</option>
                <option value="en">English (Universal)</option>
                <option value="hinglish">Hinglish (Hindi in Roman script)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-bold text-slate-900">
                4. {language === 'en' ? 'Tone & Style' : 'टोन / शैली'}
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {toneOptions.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTone(t.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      tone === t.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                    }`}
                  >
                    {language === 'en' ? t.labelEn : t.labelHi}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Additional Instructions */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-bold text-slate-900">
              5. {language === 'en' ? 'Additional Instructions (Optional)' : 'अतिरिक्त निर्देश (वैकल्पिक)'}
            </label>
            <input
              type="text"
              value={additionalInstructions}
              onChange={(e) => setAdditionalInstructions(e.target.value)}
              placeholder={
                language === 'en'
                  ? 'e.g. Include 3 kitchen ingredients, keep sentences short for speaking...'
                  : 'जैसे: आसान घरेलू उपाय शामिल करें, बोलने में आसान वाक्य हों...'
              }
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200/90 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="p-1 rounded-md bg-amber-100 text-amber-700">
                <Sparkles className="w-3.5 h-3.5 fill-amber-500" />
              </span>
              <span>
                Cost: <strong>10 AI Credits</strong> ({creditsTotal - creditsUsed} remaining)
              </span>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!topic.trim()}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-98 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>{language === 'en' ? 'Generate Script' : 'स्क्रिप्ट जनरेट करें ✨'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= STAGE 2: GENERATING PROGRESS ================= */}
      {studioStage === 'generating' && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-md text-center max-w-lg mx-auto space-y-6">
          {/* Animated Mascot / Icon */}
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-400 text-white flex items-center justify-center mx-auto shadow-xl shadow-blue-500/20 animate-bounce">
            <Sparkles className="w-10 h-10 fill-white" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {language === 'en'
                ? 'Crafting Your Script...'
                : 'आपकी स्क्रिप्ट तैयार हो रही है...'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'en'
                ? 'Synthesizing viral hooks, researched points, and timing...'
                : 'AI आपके विषय के अनुसार उत्तम और प्रभावशाली स्क्रिप्ट लिख रहा है'}
            </p>
          </div>

          {/* 4-Step Checklist */}
          <div className="space-y-2 text-left max-w-xs mx-auto text-xs text-slate-700">
            <div className="flex items-center gap-2 text-emerald-600">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{language === 'en' ? 'Topic analysis' : 'विषय का विश्लेषण'}</span>
            </div>
            <div className={`flex items-center gap-2 ${generatingProgress >= 40 ? 'text-emerald-600' : 'text-slate-400'}`}>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{language === 'en' ? 'Gathering research & clinical facts' : 'संबंधित जानकारी जुटाई जा रही है'}</span>
            </div>
            <div className={`flex items-center gap-2 ${generatingProgress >= 70 ? 'text-emerald-600' : 'text-slate-400'}`}>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{language === 'en' ? 'Structuring timing & hooks' : 'संरचना तैयार की जा रही है'}</span>
            </div>
            <div className={`flex items-center gap-2 ${generatingProgress >= 90 ? 'text-emerald-600' : 'text-slate-400'}`}>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{language === 'en' ? 'Finalizing script draft' : 'आकर्षक स्क्रिप्ट लिखी जा रही है...'}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-600 to-amber-400 h-3 rounded-full transition-all duration-300"
                style={{ width: `${generatingProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>Estimated: 5-10s</span>
              <span>{generatingProgress}%</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= STAGE 3: SCRIPT RESULT ================= */}
      {studioStage === 'result' && generatedScript && (
        <div className="space-y-6">
          {/* Navigation Tabs for Result */}
          <div className="bg-white rounded-2xl p-1.5 border border-slate-200/80 shadow-2xs flex items-center justify-between gap-1">
            <div className="flex items-center gap-1 w-full sm:w-auto">
              <button
                onClick={() => setActiveResultTab('script')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  activeResultTab === 'script'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>{language === 'en' ? 'Script' : 'स्क्रिप्ट'}</span>
              </button>

              <button
                onClick={() => setActiveResultTab('visuals')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  activeResultTab === 'visuals'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>{language === 'en' ? 'Visual Storyboard' : 'विजुअल सुझाव'}</span>
                <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-mono">
                  {scenes.length}
                </span>
              </button>

              <button
                onClick={() => setActiveResultTab('voice')}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  activeResultTab === 'voice'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{language === 'en' ? 'Voice & Teleprompter' : 'वॉइस व टेलीप्रॉम्प्टर'}</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => setStudioStage('form')}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>New</span>
              </button>
            </div>
          </div>

          {/* TAB 1: SCRIPT TAB */}
          {activeResultTab === 'script' && (
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{topic}</h2>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>{durationSeconds} seconds duration</span>
                    </span>
                    <span>·</span>
                    <span>{tone}</span>
                    <span>·</span>
                    <span className="text-emerald-600 font-medium">Ready to record</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      isEditing
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditing ? 'Save Edits' : 'Edit Inline'}</span>
                  </button>

                  <button
                    onClick={handleSaveToProject}
                    disabled={isSavedToProject}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isSavedToProject
                        ? 'bg-emerald-100 text-emerald-800 cursor-default'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                    }`}
                  >
                    {isSavedToProject ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Saved to Projects</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save to Projects</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 1. Hook Card */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                      Hook (0-5s)
                    </span>
                    <span className="text-[10px] text-amber-700 bg-amber-200/60 px-1.5 py-0.5 rounded-md">
                      Attention Grabber
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(editableHook, 'hook')}
                    className="p-1 rounded-md text-amber-700 hover:bg-amber-100 transition-colors"
                    title="Copy Hook"
                  >
                    {copiedSection === 'hook' ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {isEditing ? (
                  <textarea
                    rows={2}
                    value={editableHook}
                    onChange={(e) => setEditableHook(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white border border-amber-300 text-xs sm:text-sm text-slate-900 focus:outline-hidden"
                  />
                ) : (
                  <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                    "{editableHook}"
                  </p>
                )}
              </div>

              {/* 2. Main Content Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Main Content (5-{durationSeconds - 5}s)
                    </span>
                    <span className="text-[10px] text-blue-700 bg-blue-100/70 px-1.5 py-0.5 rounded-md">
                      Core Value Points
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(editableMain.join('\n'), 'main')}
                    className="p-1 rounded-md text-slate-500 hover:bg-slate-200 transition-colors"
                    title="Copy Content"
                  >
                    {copiedSection === 'main' ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {isEditing ? (
                  <textarea
                    rows={5}
                    value={editableMain.join('\n')}
                    onChange={(e) => setEditableMain(e.target.value.split('\n'))}
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-hidden"
                  />
                ) : (
                  <ul className="space-y-2">
                    {editableMain.map((point, idx) => (
                      <li key={idx} className="text-xs sm:text-sm text-slate-800 leading-relaxed flex items-start gap-2">
                        <span className="text-blue-600 font-bold mt-0.5">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* 3. Closing / CTA Card */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                      Closing & CTA ({durationSeconds - 5}-{durationSeconds}s)
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(editableClosing, 'closing')}
                    className="p-1 rounded-md text-emerald-700 hover:bg-emerald-100 transition-colors"
                    title="Copy CTA"
                  >
                    {copiedSection === 'closing' ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {isEditing ? (
                  <textarea
                    rows={2}
                    value={editableClosing}
                    onChange={(e) => setEditableClosing(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white border border-emerald-300 text-xs sm:text-sm text-slate-900 focus:outline-hidden"
                  />
                ) : (
                  <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                    "{editableClosing}"
                  </p>
                )}
              </div>

              {/* Bottom Flow Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    const fullText = `HOOK:\n${editableHook}\n\nMAIN:\n${editableMain.join('\n')}\n\nCLOSING:\n${editableClosing}`;
                    copyToClipboard(fullText, 'all');
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                >
                  {copiedSection === 'all' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSection === 'all' ? 'Entire Script Copied!' : 'Copy Complete Script'}</span>
                </button>

                <button
                  onClick={() => setActiveResultTab('visuals')}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors"
                >
                  <span>{language === 'en' ? 'Next: Visual Storyboard' : 'अगला: विजुअल सुझाव'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: VISUAL STORYBOARD */}
          {activeResultTab === 'visuals' && (
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'en' ? 'Scene-by-Scene Visual Storyboard' : 'सीन-अनुसार विजुअल सुझाव'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'en'
                    ? 'Recommended B-roll, illustrations, and camera angles for each segment'
                    : 'प्रत्येक दृश्य के लिए उपयुक्त B-roll और फुटेज'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {scenes.map((scene, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3"
                  >
                    <div className="w-20 h-16 rounded-xl bg-slate-200 overflow-hidden shrink-0 border border-slate-200 relative group">
                      <img
                        src={scene.imageUrl}
                        alt={`Scene ${scene.sceneNumber}`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 px-1 rounded bg-black/70 text-[9px] font-mono text-white">
                        {scene.timeRange}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-blue-700 uppercase">
                          Scene {scene.sceneNumber} ({scene.timeRange})
                        </span>
                        <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                          Matched
                        </span>
                      </div>
                      <p className="text-xs text-slate-800 mt-1 leading-snug">
                        {language === 'hi' && scene.descriptionHi ? scene.descriptionHi : scene.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveResultTab('script')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  ← {language === 'en' ? 'Back to Script' : 'स्क्रिप्ट पर वापस'}
                </button>
                <button
                  onClick={() => setActiveResultTab('voice')}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs transition-colors"
                >
                  <span>{language === 'en' ? 'Next: Voice & Teleprompter' : 'अगला: टेलीप्रॉम्प्टर'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: VOICE TIPS & TELEPROMPTER */}
          {activeResultTab === 'voice' && (
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
              {/* Presentation Tips */}
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-blue-600" />
                  <span>{language === 'en' ? 'Speaker Presentation Tips' : 'प्रेजेंटेशन टिप्स'}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                  {generatedScript.voiceTips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 flex items-start gap-2"
                    >
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teleprompter Preview Simulator */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Video className="w-4 h-4 text-purple-600" />
                    <span>{language === 'en' ? 'Interactive Teleprompter View' : 'टेलीप्रॉम्प्टर मोड'}</span>
                  </h4>

                  {/* Teleprompter Controls */}
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 text-[11px]">Speed:</span>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        value={teleprompterSpeed}
                        onChange={(e) => setTeleprompterSpeed(parseInt(e.target.value, 10))}
                        className="w-16 accent-blue-600"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 text-[11px]">Text:</span>
                      <button
                        onClick={() => setTeleprompterFontSize((prev) => Math.max(14, prev - 2))}
                        className="px-1.5 py-0.5 bg-slate-100 rounded text-xs font-mono"
                      >
                        A-
                      </button>
                      <button
                        onClick={() => setTeleprompterFontSize((prev) => Math.min(26, prev + 2))}
                        className="px-1.5 py-0.5 bg-slate-100 rounded text-xs font-mono"
                      >
                        A+
                      </button>
                    </div>
                  </div>
                </div>

                {/* Teleprompter Dark Screen Preview */}
                <div className="bg-slate-950 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden border border-slate-800 shadow-inner">
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/10 px-2 py-0.5 rounded-full text-[10px] text-amber-300 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{durationSeconds}s</span>
                  </div>

                  <div className="max-w-md mx-auto text-center space-y-4">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400 bg-blue-950/60 px-2.5 py-1 rounded-md border border-blue-800">
                      Live Reading Frame
                    </span>
                    <p
                      style={{ fontSize: `${teleprompterFontSize}px` }}
                      className="font-medium text-amber-200 leading-relaxed transition-all"
                    >
                      "{editableHook}"
                    </p>
                    <p
                      style={{ fontSize: `${teleprompterFontSize - 2}px` }}
                      className="text-slate-300 leading-relaxed opacity-85"
                    >
                      {editableMain[0]}
                    </p>
                  </div>
                </div>
              </div>

              {/* Final Actions: Save & Projects */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <button
                  onClick={() => setActiveResultTab('script')}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  ← {language === 'en' ? 'Back to Script' : 'स्क्रिप्ट पर वापस'}
                </button>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleSaveToProject}
                    className="px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavedToProject ? 'Saved!' : 'Save Project'}</span>
                  </button>
                  <button
                    onClick={() => {
                      handleSaveToProject();
                      navigate('/user/teleprompter', {
                        state: {
                          projectId: savedProjectId,
                          scriptText: `${editableHook}\n\n${editableMain.join('\n\n')}\n\n${editableClosing}`,
                          title: topic,
                        },
                      });
                    }}
                    className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Video className="w-4 h-4" />
                    <span>{language === 'en' ? 'Launch Teleprompter' : 'टेलीप्रॉम्प्टर खोलें'}</span>
                  </button>
                  <button
                    onClick={() => {
                      handleSaveToProject();
                      navigate('/user/projects');
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <span>{language === 'en' ? 'Projects' : 'प्रोजेक्ट्स'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
