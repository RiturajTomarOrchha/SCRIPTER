import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  FileText,
  Video,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Plus,
  Play,
  Film,
  User,
  Sliders,
  Type,
  Maximize2,
  Code2,
  Eye,
  Radio,
  Download,
} from 'lucide-react';

export type ScreenplayTokenType =
  | 'scene-heading'
  | 'character'
  | 'parenthetical'
  | 'dialogue'
  | 'transition'
  | 'visual-cue'
  | 'action';

export interface ScreenplayLineToken {
  lineNumber: number;
  type: ScreenplayTokenType;
  rawText: string;
  displayText: string;
  characterName?: string;
}

interface ScreenplaySyntaxEditorProps {
  value: string;
  onChange: (newValue: string) => void;
  onSyncToSections?: () => void;
  collaboratorsEditingScreenplay?: Array<{
    userId: string;
    displayName: string;
    color: string;
  }>;
  onFocus?: () => void;
  onBlur?: () => void;
}

/**
 * Parses screenplay text into classified screenplay tokens for syntax highlighting
 */
export const tokenizeScreenplay = (text: string): ScreenplayLineToken[] => {
  const lines = text.split('\n');
  const tokens: ScreenplayLineToken[] = [];
  let previousType: ScreenplayTokenType = 'action';

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      tokens.push({
        lineNumber: index + 1,
        type: 'action',
        rawText: line,
        displayText: '',
      });
      previousType = 'action';
      return;
    }

    // 1. Scene Headings (Sluglines: INT., EXT., SCENE, दृश्य)
    const isSceneHeading =
      /^(?:INT\.|EXT\.|INT\.\/EXT\.|I\/E\.|SCENE\s*\d*|दृश्य\s*\d*)/i.test(trimmed) ||
      (/^[A-Z0-9\s\-_.,/]+$/.test(trimmed) &&
        (trimmed.includes(' - ') || trimmed.includes('DAY') || trimmed.includes('NIGHT') || trimmed.includes('STUDIO')));

    if (isSceneHeading) {
      tokens.push({
        lineNumber: index + 1,
        type: 'scene-heading',
        rawText: line,
        displayText: trimmed,
      });
      previousType = 'scene-heading';
      return;
    }

    // 2. Transitions (CUT TO:, FADE IN:, DISSOLVE TO:)
    const isTransition =
      /^(?:CUT TO:|FADE IN:|FADE OUT:|DISSOLVE TO:|SMASH CUT:|FADE TO BLACK:)/i.test(trimmed) ||
      trimmed.endsWith('TO:');

    if (isTransition) {
      tokens.push({
        lineNumber: index + 1,
        type: 'transition',
        rawText: line,
        displayText: trimmed,
      });
      previousType = 'transition';
      return;
    }

    // 3. Visual Cues & B-Roll ([B-ROLL: ...], [GRAPHIC: ...], [SFX: ...])
    const isVisualCue =
      /^\[(?:B-ROLL|GRAPHIC|ON SCREEN|SFX|MUSIC|CAMERA|विजुअल|टेक्स्ट).*?\]/i.test(trimmed) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'));

    if (isVisualCue) {
      tokens.push({
        lineNumber: index + 1,
        type: 'visual-cue',
        rawText: line,
        displayText: trimmed,
      });
      previousType = 'visual-cue';
      return;
    }

    // 4. Parentheticals ((smiling), (looking at camera), (धीमी आवाज में))
    const isParenthetical = /^\(.*?\)$/.test(trimmed);
    if (isParenthetical) {
      tokens.push({
        lineNumber: index + 1,
        type: 'parenthetical',
        rawText: line,
        displayText: trimmed,
      });
      previousType = 'parenthetical';
      return;
    }

    // 5. Character Names (ALL CAPS name followed by colon, or capitalized speaker cue)
    const isCharacter =
      /^(?:[A-Z0-9\s._'-]+(?:\s*\(.*?\))?):$/.test(trimmed) ||
      /^(?:NARRATOR|HOST|DOCTOR|SPEAKER|VOICEOVER|सूत्रधार|वक्ता|एंकर|क्रिएटर|DOCTOR SHARMA)(?:\s*\(.*?\))?:?$/i.test(trimmed) ||
      (/^[A-Z0-9\s._'-]{2,30}$/.test(trimmed) && !trimmed.includes('.') && trimmed === trimmed.toUpperCase());

    if (isCharacter) {
      tokens.push({
        lineNumber: index + 1,
        type: 'character',
        rawText: line,
        displayText: trimmed,
        characterName: trimmed.replace(':', ''),
      });
      previousType = 'character';
      return;
    }

    // 6. Dialogue Block (Follows character or parenthetical)
    if (previousType === 'character' || previousType === 'parenthetical') {
      tokens.push({
        lineNumber: index + 1,
        type: 'dialogue',
        rawText: line,
        displayText: trimmed,
      });
      previousType = 'dialogue';
      return;
    }

    // 7. General Action / Narration block
    tokens.push({
      lineNumber: index + 1,
      type: 'action',
      rawText: line,
      displayText: trimmed,
    });
    previousType = 'action';
  });

  return tokens;
};

export const ScreenplaySyntaxEditor: React.FC<ScreenplaySyntaxEditorProps> = ({
  value,
  onChange,
  onSyncToSections,
  collaboratorsEditingScreenplay = [],
  onFocus,
  onBlur,
}) => {
  const { language } = useLanguage();
  const [viewMode, setViewMode] = useState<'split' | 'highlighted' | 'editor'>('split');
  const [copied, setCopied] = useState(false);

  const tokens = useMemo(() => tokenizeScreenplay(value), [value]);

  // Insert screenplay boilerplate elements
  const handleInsertSnippet = (snippet: string) => {
    const nextVal = value ? `${value.trimEnd()}\n\n${snippet}\n` : `${snippet}\n`;
    onChange(nextVal);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col space-y-0">
      {/* Top Screenplay Controls & Syntax Legend Bar */}
      <div className="p-3.5 sm:px-5 border-b border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-100 text-indigo-900 font-bold text-xs">
            <Film className="w-3.5 h-3.5 text-indigo-600" />
            <span>{language === 'en' ? 'Screenplay Syntax Highlighting' : 'स्क्रीनप्ले सिंटैक्स हाइलाइटर'}</span>
          </div>

          {/* Collaborator Presence Indicators on this section */}
          {collaboratorsEditingScreenplay.length > 0 && (
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/90 text-amber-900 px-2.5 py-0.5 rounded-full text-[11px] font-semibold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping" />
              <span>
                {collaboratorsEditingScreenplay.map((c) => c.displayName).join(', ')}{' '}
                {language === 'en' ? 'editing screenplay' : 'स्क्रीनप्ले एडिट कर रहे हैं'}
              </span>
            </div>
          )}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <div className="flex items-center bg-slate-200/70 p-0.5 rounded-xl">
            <button
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                viewMode === 'split' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600'
              }`}
              title="Split View: Editor + Formatted Syntax"
            >
              <Maximize2 className="w-3 h-3" />
              <span>{language === 'en' ? 'Split View' : 'स्प्लिट व्यू'}</span>
            </button>
            <button
              onClick={() => setViewMode('highlighted')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                viewMode === 'highlighted' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600'
              }`}
              title="Syntax Highlighted View"
            >
              <Eye className="w-3 h-3" />
              <span>{language === 'en' ? 'Formatted' : 'फॉर्मेट'}</span>
            </button>
            <button
              onClick={() => setViewMode('editor')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                viewMode === 'editor' ? 'bg-white text-indigo-700 shadow-2xs font-bold' : 'text-slate-600'
              }`}
              title="Plain Raw Editor"
            >
              <Code2 className="w-3 h-3" />
              <span>{language === 'en' ? 'Editor' : 'एडिटर'}</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1 transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? (language === 'en' ? 'Copied' : 'कॉपी हुआ') : (language === 'en' ? 'Copy' : 'कॉपी')}</span>
          </button>
        </div>
      </div>

      {/* Screenplay Formatting Quick Action Pills */}
      <div className="px-3.5 py-2 border-b border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto text-[11px] font-semibold text-slate-700 scrollbar-none">
        <span className="text-slate-400 text-[10px] font-mono uppercase tracking-wider shrink-0 mr-1">
          {language === 'en' ? 'Insert Elements:' : 'एलिमेंट्स जोड़ें:'}
        </span>

        <button
          onClick={() => handleInsertSnippet('INT. STUDIO - DAY')}
          className="px-2.5 py-1 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 shrink-0 flex items-center gap-1 transition-colors"
        >
          <span className="font-mono font-bold text-cyan-700">🎬</span>
          <span>INT. / EXT. Slugline</span>
        </button>

        <button
          onClick={() => handleInsertSnippet('NARRATOR:\n(smiling directly into camera)\nAre you tired of paying high electricity bills every single month?')}
          className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 shrink-0 flex items-center gap-1 transition-colors"
        >
          <span className="font-mono font-bold text-amber-700">👤</span>
          <span>CHARACTER: Dialogue</span>
        </button>

        <button
          onClick={() => handleInsertSnippet('(pauses 2 seconds, looking thoughtful)')}
          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 shrink-0 flex items-center gap-1 transition-colors"
        >
          <span className="font-mono font-bold text-emerald-700">💭</span>
          <span>(Parenthetical Action)</span>
        </button>

        <button
          onClick={() => handleInsertSnippet('[B-ROLL: Drone aerial footage of solar rooftop installation]')}
          className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 shrink-0 flex items-center gap-1 transition-colors"
        >
          <span className="font-mono font-bold text-purple-700">📹</span>
          <span>[B-ROLL Visual]</span>
        </button>

        <button
          onClick={() => handleInsertSnippet('CUT TO:\n[ON SCREEN TEXT: 30% Government Subsidy Available]')}
          className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 shrink-0 flex items-center gap-1 transition-colors"
        >
          <span className="font-mono font-bold text-rose-700">✂️</span>
          <span>CUT TO: Transition</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div
        className={`grid ${
          viewMode === 'split' ? 'grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200' : 'grid-cols-1'
        } min-h-[480px]`}
      >
        {/* Left Side: Screenplay Input Editor */}
        {(viewMode === 'split' || viewMode === 'editor') && (
          <div className="flex flex-col bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm">
            <div className="px-4 py-2 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 font-bold text-slate-300">
                <Code2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Screenplay Text Editor</span>
              </span>
              <span>{value.length} chars · {value.split(/\s+/).filter(Boolean).length} words</span>
            </div>

            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={onFocus}
              onBlur={onBlur}
              rows={18}
              className="w-full h-full p-4 bg-transparent text-slate-100 focus:outline-hidden leading-relaxed resize-none font-mono selection:bg-blue-600/40"
              placeholder={`Write or paste standard screenplay formatted script:\n\nINT. STUDIO ROOM - DAY\n\nNARRATOR (V.O.):\n(smiling directly into camera)\nAre you tired of paying massive electricity bills every single month?\n\n[B-ROLL: Close-up of solar panel reflection]\n\nNARRATOR:\nSolar rooftops can slash up to 80% of your expenses!\n\nCUT TO:\n[ON SCREEN: Click link in bio to claim government subsidy]`}
            />
          </div>
        )}

        {/* Right Side: Syntax Highlighted Screenplay Output */}
        {(viewMode === 'split' || viewMode === 'highlighted') && (
          <div className="flex flex-col bg-slate-50/40 overflow-y-auto max-h-[600px]">
            <div className="px-4 py-2 border-b border-slate-200 bg-white flex items-center justify-between text-[11px] text-slate-500 font-semibold sticky top-0 z-10">
              <span className="flex items-center gap-1.5 text-indigo-950 font-bold">
                <Film className="w-3.5 h-3.5 text-indigo-600" />
                <span>Screenplay Syntax Highlighted Preview</span>
              </span>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="flex items-center gap-1 text-cyan-700">● Slugline</span>
                <span className="flex items-center gap-1 text-amber-700">● Character</span>
                <span className="flex items-center gap-1 text-emerald-700">● Action</span>
                <span className="flex items-center gap-1 text-purple-700">● B-Roll</span>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-3 font-sans">
              {tokens.length === 0 || !value.trim() ? (
                <div className="py-16 text-center text-slate-400 text-xs">
                  {language === 'en'
                    ? 'Start typing or use the quick action pills above to see live screenplay syntax highlighting.'
                    : 'सिंटैक्स हाइलाइटिंग देखने के लिए ऊपर दिए गए बटनों का उपयोग करें या स्क्रीनप्ले लिखना शुरू करें।'}
                </div>
              ) : (
                tokens.map((token, tIdx) => {
                  if (!token.displayText) {
                    return <div key={tIdx} className="h-2" />;
                  }

                  switch (token.type) {
                    case 'scene-heading':
                      return (
                        <div
                          key={tIdx}
                          className="mt-4 first:mt-0 p-2.5 rounded-xl bg-cyan-50/80 border-l-4 border-cyan-500 text-cyan-950 font-bold font-mono text-xs sm:text-sm tracking-wide shadow-2xs flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold bg-cyan-200/80 text-cyan-900 px-1.5 py-0.5 rounded font-mono">
                              SCENE
                            </span>
                            <span>{token.displayText}</span>
                          </div>
                          <span className="text-[10px] text-cyan-600 font-mono">#{token.lineNumber}</span>
                        </div>
                      );

                    case 'character':
                      return (
                        <div key={tIdx} className="mt-3 flex justify-center text-center">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-100/90 border border-amber-300/80 text-amber-950 font-black text-xs uppercase tracking-wider shadow-2xs">
                            <User className="w-3 h-3 text-amber-700" />
                            <span>{token.displayText}</span>
                          </div>
                        </div>
                      );

                    case 'parenthetical':
                      return (
                        <div key={tIdx} className="flex justify-center text-center">
                          <span className="text-xs italic text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80 font-medium">
                            {token.displayText}
                          </span>
                        </div>
                      );

                    case 'dialogue':
                      return (
                        <div
                          key={tIdx}
                          className="max-w-lg mx-auto p-3 rounded-2xl bg-white border border-slate-200 text-slate-900 font-medium text-xs sm:text-sm leading-relaxed shadow-2xs text-center sm:text-left"
                        >
                          {token.displayText}
                        </div>
                      );

                    case 'transition':
                      return (
                        <div key={tIdx} className="flex justify-end text-right my-2">
                          <span className="text-[11px] font-mono font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                            {token.displayText}
                          </span>
                        </div>
                      );

                    case 'visual-cue':
                      return (
                        <div
                          key={tIdx}
                          className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-200 text-purple-950 text-xs font-mono font-semibold flex items-center gap-2"
                        >
                          <span className="px-1.5 py-0.5 bg-purple-200/80 text-purple-900 rounded text-[10px] font-bold">
                            VISUAL
                          </span>
                          <span className="italic">{token.displayText}</span>
                        </div>
                      );

                    default:
                      return (
                        <div
                          key={tIdx}
                          className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans px-2"
                        >
                          {token.displayText}
                        </div>
                      );
                  }
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info & Bidirectional Sync */}
      <div className="p-3 px-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-700">
            {tokens.filter((t) => t.type === 'scene-heading').length} {language === 'en' ? 'Scenes' : 'दृश्य'} ·{' '}
            {tokens.filter((t) => t.type === 'character').length} {language === 'en' ? 'Characters' : 'किरदार'} ·{' '}
            {tokens.filter((t) => t.type === 'visual-cue').length} {language === 'en' ? 'B-Rolls' : 'B-रोल'}
          </span>
        </div>

        {onSyncToSections && (
          <button
            type="button"
            onClick={onSyncToSections}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-sm shadow-indigo-600/20"
            title="Convert screenplay lines into Hook, Core Content, and CTA cards"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Sync to Hook & Body Cards' : 'हुक व बॉडी कार्ड्स में सिंक करें'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
