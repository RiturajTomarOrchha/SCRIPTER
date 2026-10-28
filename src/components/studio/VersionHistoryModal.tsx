import React, { useState } from 'react';
import { ScriptVersion } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import {
  History,
  X,
  RotateCcw,
  Sparkles,
  Mic,
  Bookmark,
  Layers,
  Radio,
  Clock,
  FileText,
  Copy,
  Check,
  Plus,
  Trash2,
  ChevronRight,
  Eye,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  versions: ScriptVersion[];
  currentHook: string;
  currentBody: string;
  currentCta: string;
  onRestoreVersion: (version: ScriptVersion) => void;
  onCreateMilestone: (name: string, notes?: string) => void;
  onDeleteVersion?: (versionNumber: number) => void;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  onClose,
  versions,
  currentHook,
  currentBody,
  currentCta,
  onRestoreVersion,
  onCreateMilestone,
  onDeleteVersion,
}) => {
  const { language } = useLanguage();
  const [selectedVersion, setSelectedVersion] = useState<ScriptVersion | null>(
    versions[0] || null
  );
  const [activeTab, setActiveTab] = useState<'all' | 'milestones' | 'ai'>('all');
  const [isCreatingMilestone, setIsCreatingMilestone] = useState(false);
  const [milestoneName, setMilestoneName] = useState('');
  const [milestoneNotes, setMilestoneNotes] = useState('');
  const [copiedVerId, setCopiedVerId] = useState<number | null>(null);
  const [confirmRestoreVer, setConfirmRestoreVer] = useState<ScriptVersion | null>(null);

  if (!isOpen) return null;

  const currentFullText = `${currentHook}\n\n${currentBody}\n\n${currentCta}`;
  const currentWordCount = currentFullText.trim().split(/\s+/).filter(Boolean).length;

  const getMilestoneBadge = (ver: ScriptVersion) => {
    switch (ver.milestoneType) {
      case 'manual':
        return {
          label: ver.milestoneName || (language === 'en' ? 'Key Milestone' : 'मुख्य मील का पत्थर'),
          icon: Bookmark,
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        };
      case 'ai_generate':
        return {
          label: ver.milestoneName || (language === 'en' ? 'AI Initial Draft' : 'AI प्रारंभिक प्रारूप'),
          icon: Sparkles,
          color: 'bg-blue-100 text-blue-800 border-blue-200',
        };
      case 'ai_transform':
        return {
          label: ver.milestoneName || (language === 'en' ? 'AI Transformation' : 'AI रूपांतरण'),
          icon: Sparkles,
          color: 'bg-purple-100 text-purple-800 border-purple-200',
        };
      case 'voice':
        return {
          label: ver.milestoneName || (language === 'en' ? 'Voice Dictation' : 'ध्वनि डिक्टेशन'),
          icon: Mic,
          color: 'bg-rose-100 text-rose-800 border-rose-200',
        };
      case 'template':
        return {
          label: ver.milestoneName || (language === 'en' ? 'Applied Template' : 'लागू टेम्पलेट'),
          icon: Layers,
          color: 'bg-amber-100 text-amber-800 border-amber-200',
        };
      case 'news':
        return {
          label: ver.milestoneName || (language === 'en' ? 'Live News Grounding' : 'लाइव न्यूज संदर्भ'),
          icon: Radio,
          color: 'bg-cyan-100 text-cyan-800 border-cyan-200',
        };
      default:
        return {
          label: ver.milestoneName || (language === 'en' ? 'Autosave Snapshot' : 'स्वतः सहेजा स्नैपशॉट'),
          icon: History,
          color: 'bg-slate-100 text-slate-700 border-slate-200',
        };
    }
  };

  const filteredVersions = versions.filter((v) => {
    if (activeTab === 'milestones') return v.milestoneType === 'manual' || v.milestoneType === 'template';
    if (activeTab === 'ai') return v.milestoneType === 'ai_generate' || v.milestoneType === 'ai_transform';
    return true;
  });

  const handleCopyVersion = (ver: ScriptVersion) => {
    const full = `${ver.hook}\n\n${ver.mainContent.join('\n\n')}\n\n${ver.closing}`;
    navigator.clipboard.writeText(full);
    setCopiedVerId(ver.version);
    setTimeout(() => setCopiedVerId(null), 2000);
  };

  const handleSaveMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneName.trim()) return;
    onCreateMilestone(milestoneName.trim(), milestoneNotes.trim() || undefined);
    setMilestoneName('');
    setMilestoneNotes('');
    setIsCreatingMilestone(false);
  };

  const activeDisplayVersion = selectedVersion || versions[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-5xl h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {language === 'en' ? 'Script Version History & Milestones' : 'स्क्रिप्ट वर्जन हिस्ट्री और माइलस्टोन्स'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono text-[11px] font-bold">
                  {versions.length} {language === 'en' ? 'Snapshots' : 'वर्जन्स'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {language === 'en'
                  ? 'Inspect previous drafts, restore at key milestones, or snapshot critical revisions without losing progress.'
                  : 'पिछले ड्राफ्ट्स देखें, मुख्य माइलस्टोन्स पर वापस जाएं या बिना प्रगति खोए नया स्नैपशॉट बनाएं।'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreatingMilestone(true)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Save Milestone' : 'माइलस्टोन सेव करें'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Create Milestone Modal / Inline Form */}
        {isCreatingMilestone && (
          <div className="bg-blue-50/80 border-b border-blue-200 p-4 animate-in slide-in-from-top-2">
            <form onSubmit={handleSaveMilestone} className="max-w-2xl mx-auto space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-blue-600" />
                  {language === 'en' ? 'Create a Named Milestone Snapshot' : 'नया माइलस्टोन स्नैपशॉट बनाएं'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreatingMilestone(false)}
                  className="text-xs text-blue-700 hover:underline"
                >
                  {language === 'en' ? 'Cancel' : 'रद्द करें'}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  required
                  value={milestoneName}
                  onChange={(e) => setMilestoneName(e.target.value)}
                  placeholder={language === 'en' ? 'Milestone Name (e.g. "Draft 1 Polish")' : 'माइलस्टोन का नाम'}
                  className="sm:col-span-2 px-3 py-2 rounded-xl bg-white border border-blue-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                >
                  {language === 'en' ? 'Capture Snapshot' : 'स्नैपशॉट लें'}
                </button>
              </div>
              <input
                type="text"
                value={milestoneNotes}
                onChange={(e) => setMilestoneNotes(e.target.value)}
                placeholder={language === 'en' ? 'Optional note (e.g. "Reviewed by clinical advisor")' : 'वैकल्पिक टिप्पणी'}
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-blue-200 text-xs text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </form>
          </div>
        )}

        {/* Content Body: Left Timeline, Right Detailed Preview */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left Column: Version Timeline */}
          <div className="md:col-span-5 border-r border-slate-200 flex flex-col bg-slate-50/50 overflow-hidden">
            {/* Filter Tabs */}
            <div className="p-3 border-b border-slate-200 flex items-center gap-1.5 text-xs font-bold">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'all'
                    ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {language === 'en' ? 'All' : 'सभी'} ({versions.length})
              </button>
              <button
                onClick={() => setActiveTab('milestones')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'milestones'
                    ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {language === 'en' ? 'Milestones' : 'माइलस्टोन्स'}
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeTab === 'ai'
                    ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {language === 'en' ? 'AI Revisions' : 'AI वर्जन्स'}
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {filteredVersions.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  {language === 'en' ? 'No versions found in this filter' : 'इस फिल्टर में कोई वर्जन नहीं मिला'}
                </div>
              ) : (
                filteredVersions.map((ver, idx) => {
                  const badge = getMilestoneBadge(ver);
                  const BadgeIcon = badge.icon;
                  const isSelected = activeDisplayVersion?.version === ver.version;
                  const words =
                    ver.wordCount ||
                    `${ver.hook} ${ver.mainContent.join(' ')} ${ver.closing}`.trim().split(/\s+/).filter(Boolean).length;
                  const estTime = Math.round((words / 130) * 60);

                  return (
                    <div
                      key={ver.version}
                      onClick={() => setSelectedVersion(ver)}
                      className={`p-3.5 rounded-2xl cursor-pointer border transition-all text-xs relative ${
                        isSelected
                          ? 'bg-white border-blue-500 shadow-md ring-1 ring-blue-500'
                          : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-white/80'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md text-[11px]">
                            v{ver.version}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.color}`}
                          >
                            <BadgeIcon className="w-2.5 h-2.5" />
                            <span className="truncate max-w-[140px]">{badge.label}</span>
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {new Date(ver.updatedAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <p className="font-semibold text-slate-900 line-clamp-1 mb-1">
                        "{ver.hook}"
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                        <span>{words} {language === 'en' ? 'words' : 'शब्द'} · ~{estTime}s</span>
                        {ver.notes && (
                          <span className="text-[10px] text-amber-700 font-sans italic truncate max-w-[120px]">
                            {ver.notes}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Deep Comparison & Inspection */}
          <div className="md:col-span-7 flex flex-col bg-white overflow-hidden">
            {activeDisplayVersion ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Detail Header */}
                <div className="p-4 border-b border-slate-200 bg-slate-50/30 flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">
                        {language === 'en' ? 'Version' : 'वर्जन'} {activeDisplayVersion.version}
                      </h3>
                      {(() => {
                        const badge = getMilestoneBadge(activeDisplayVersion);
                        const Icon = badge.icon;
                        return (
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.color}`}>
                            <Icon className="w-3 h-3" />
                            <span>{badge.label}</span>
                          </span>
                        );
                      })()}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {new Date(activeDisplayVersion.updatedAt).toLocaleDateString([], {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {activeDisplayVersion.notes && ` · "${activeDisplayVersion.notes}"`}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyVersion(activeDisplayVersion)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      title="Copy full text of this version"
                    >
                      {copiedVerId === activeDisplayVersion.version ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">{language === 'en' ? 'Copied' : 'कॉपी हुआ'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{language === 'en' ? 'Copy Text' : 'कॉपी करें'}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setConfirmRestoreVer(activeDisplayVersion)}
                      className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Restore This Version' : 'यह वर्जन लोड करें'}</span>
                    </button>
                  </div>
                </div>

                {/* Script Sections Preview */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                  {/* Hook */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-950 uppercase tracking-wide">
                      <span className="flex items-center gap-1.5">
                        <span>⚡</span>
                        <span>{language === 'en' ? 'Opening Hook (0-5s)' : 'हुक (0-5 सेकंड)'}</span>
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                      {activeDisplayVersion.hook}
                    </p>
                  </div>

                  {/* Core Body */}
                  <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-blue-950 uppercase tracking-wide">
                      <span className="flex items-center gap-1.5">
                        <span>💡</span>
                        <span>{language === 'en' ? 'Core Content (5-45s)' : 'मुख्य सामग्री (5-45 सेकंड)'}</span>
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed whitespace-pre-line">
                      {activeDisplayVersion.mainContent.join('\n\n')}
                    </div>
                  </div>

                  {/* Closing CTA */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-950 uppercase tracking-wide">
                      <span className="flex items-center gap-1.5">
                        <span>🎯</span>
                        <span>{language === 'en' ? 'Conclusion & CTA (45-60s)' : 'कॉल टू एक्शन (45-60 सेकंड)'}</span>
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                      {activeDisplayVersion.closing}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-slate-400 text-xs">
                {language === 'en' ? 'Select a version to inspect' : 'विवरण देखने के लिए कोई वर्जन चुनें'}
              </div>
            )}
          </div>
        </div>

        {/* Confirmation Modal for Restore */}
        {confirmRestoreVer && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto">
                <RotateCcw className="w-6 h-6" />
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900">
                  {language === 'en'
                    ? `Restore Version ${confirmRestoreVer.version}?`
                    : `क्या आप वर्जन ${confirmRestoreVer.version} वापस लोड करना चाहते हैं?`}
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {language === 'en'
                    ? 'Your current script will be replaced with this version. We will automatically snapshot your current draft before restoring so nothing is lost.'
                    : 'आपकी वर्तमान स्क्रिप्ट इस वर्जन से बदल दी जाएगी। सुरक्षित रहने के लिए वर्तमान ड्राफ्ट का बैकअप स्नैपशॉट अपने आप ले लिया जाएगा।'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmRestoreVer(null)}
                  className="py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100"
                >
                  {language === 'en' ? 'Cancel' : 'रद्द करें'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onRestoreVersion(confirmRestoreVer);
                    setConfirmRestoreVer(null);
                    onClose();
                  }}
                  className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20"
                >
                  {language === 'en' ? 'Confirm Restore' : 'रीस्टोर करें'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
