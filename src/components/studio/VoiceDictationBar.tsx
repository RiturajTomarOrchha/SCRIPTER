import React, { useState, useEffect } from 'react';
import { useSpeechToText } from '../../hooks/useSpeechToText';
import { useLanguage } from '../../context/LanguageContext';
import {
  Mic,
  MicOff,
  Volume2,
  Check,
  RotateCcw,
  Sparkles,
  AlertCircle,
  X,
  Radio,
} from 'lucide-react';

interface VoiceDictationBarProps {
  onAppendText: (targetSection: 'hook' | 'body' | 'cta', text: string) => void;
  selectedLanguage: 'hi' | 'en' | 'hinglish';
  onClose?: () => void;
}

export const VoiceDictationBar: React.FC<VoiceDictationBarProps> = ({
  onAppendText,
  selectedLanguage,
  onClose,
}) => {
  const { language } = useLanguage();
  const [targetSection, setTargetSection] = useState<'hook' | 'body' | 'cta'>('body');
  const [accumulatedSpeech, setAccumulatedSpeech] = useState<string>('');

  const speechLang =
    selectedLanguage === 'hi' || selectedLanguage === 'hinglish' ? 'hi-IN' : 'en-US';

  const {
    isListening,
    interimTranscript,
    isSupported,
    error,
    startListening,
    stopListening,
  } = useSpeechToText({
    lang: speechLang,
    onFinalResult: (newChunk) => {
      setAccumulatedSpeech((prev) => (prev ? `${prev} ${newChunk}` : newChunk));
      onAppendText(targetSection, newChunk);
    },
  });

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(speechLang);
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-slate-700/80 space-y-3.5 animate-in slide-in-from-top-3 duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${
              isListening
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/40 animate-pulse ring-4 ring-red-500/20'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-bold text-white">
                {language === 'en'
                  ? 'Hands-Free Microphone Transcription'
                  : 'माइक्रोफोन वॉइस ट्रांसक्रिप्शन'}
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold uppercase">
                {speechLang} · Web Speech API
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {isListening
                ? language === 'en'
                  ? 'Speak clearly into your microphone — ideas are transcribed in real time.'
                  : 'माइक्रोफोन में बोलें — आपकी आवाज सीधे स्क्रिप्ट में टाइप होगी।'
                : language === 'en'
                ? 'Click "Start Recording" to dictate your thoughts directly into the script.'
                : 'स्क्रिप्ट में सीधे बोलने के लिए "रिकॉर्डिंग शुरू करें" पर क्लिक करें।'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Target Section Selector */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <span className="text-[10px] uppercase text-slate-400 px-2 font-mono">Target:</span>
            {(['hook', 'body', 'cta'] as const).map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setTargetSection(sec)}
                className={`px-2.5 py-1 rounded-lg text-xs capitalize transition-colors ${
                  targetSection === sec
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sec === 'hook' ? '⚡ Hook' : sec === 'body' ? '📝 Body' : '🚀 CTA'}
              </button>
            ))}
          </div>

          {onClose && (
            <button
              type="button"
              onClick={() => {
                stopListening();
                onClose();
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Live Interim Transcript Bubble */}
      {(isListening || accumulatedSpeech || interimTranscript) && (
        <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-200 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 text-red-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              LIVE TRANSCRIBING TO {targetSection.toUpperCase()}
            </span>
            {accumulatedSpeech && (
              <button
                type="button"
                onClick={() => setAccumulatedSpeech('')}
                className="hover:text-slate-200 transition-colors"
              >
                Clear buffer
              </button>
            )}
          </div>
          <p className="font-medium text-xs sm:text-sm leading-relaxed">
            {accumulatedSpeech}
            <span className="text-amber-300 italic ml-1">{interimTranscript}</span>
          </p>
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <p className="text-[11px]">{error}</p>
        </div>
      )}

      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <button
          type="button"
          onClick={toggleListening}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md active:scale-95 ${
            isListening
              ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          <span>
            {isListening
              ? language === 'en'
                ? 'Stop Dictation'
                : 'डिक्टेशन रोकें'
              : language === 'en'
              ? 'Start Recording Voice'
              : 'आवाज से लिखना शुरू करें'}
          </span>
        </button>

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <Volume2 className="w-3.5 h-3.5 text-blue-400" />
          <span>
            {language === 'en'
              ? 'Transcribing into '
              : 'टाइप हो रहा है: '}
            <strong className="text-white capitalize font-mono">{targetSection}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
