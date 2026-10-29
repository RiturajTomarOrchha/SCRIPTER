import React, { useState } from 'react';
import { CollaboratorPresence } from '../../services/firebase/collaborationService';
import { useLanguage } from '../../context/LanguageContext';
import {
  Users,
  Radio,
  Share2,
  Check,
  Sparkles,
  UserPlus,
  Circle,
  HelpCircle,
} from 'lucide-react';

interface CollaboratorPresenceBarProps {
  collaborators: CollaboratorPresence[];
  isSyncing: boolean;
  isConnected: boolean;
  lastRemoteEditor: string | null;
  scriptId: string;
  onSimulateCollaborator?: () => void;
}

export const CollaboratorPresenceBar: React.FC<CollaboratorPresenceBarProps> = ({
  collaborators,
  isSyncing,
  isConnected,
  lastRemoteEditor,
  scriptId,
  onSimulateCollaborator,
}) => {
  const { language } = useLanguage();
  const [copiedLink, setCopiedLink] = useState(false);
  const [showPresenceDetails, setShowPresenceDetails] = useState(false);

  const handleShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getSectionLabel = (sec: string) => {
    switch (sec) {
      case 'hook':
        return language === 'en' ? 'Hook (0-5s)' : 'हुक (0-5s)';
      case 'mainBody':
        return language === 'en' ? 'Core Content' : 'मुख्य सामग्री';
      case 'closingCta':
        return language === 'en' ? 'CTA & Conclusion' : 'कॉल टू एक्शन';
      case 'screenplay':
        return language === 'en' ? 'Screenplay' : 'स्क्रीनप्ले';
      default:
        return language === 'en' ? 'Viewing' : 'देख रहे हैं';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-2.5 sm:px-4 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Left: Live Connection & Collaborator Avatars */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isConnected ? 'bg-emerald-500' : 'bg-amber-400'
              }`}
            />
            {isConnected && (
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute" />
            )}
          </div>
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            <span>
              {collaborators.length > 0
                ? `${collaborators.length} ${language === 'en' ? 'Online in Script' : 'ऑनलाइन'}`
                : language === 'en'
                ? 'Live Session Active'
                : 'लाइव सत्र सक्रिय'}
            </span>
          </span>
        </div>

        {/* Collaborators Avatar Stack */}
        {collaborators.length > 0 && (
          <div className="flex items-center -space-x-1.5 overflow-hidden">
            {collaborators.map((c, idx) => {
              const initials = (c.displayName || 'User')
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);

              return (
                <div
                  key={c.userId || idx}
                  className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white shadow-xs relative group cursor-pointer transition-transform hover:scale-110 hover:z-10"
                  style={{ backgroundColor: c.color || '#2563EB' }}
                  title={`${c.displayName} (${getSectionLabel(c.activeSection)})`}
                >
                  {c.photoURL ? (
                    <img
                      src={c.photoURL}
                      alt={c.displayName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span>{initials}</span>
                  )}

                  {/* Tooltip on hover */}
                  <div className="hidden group-hover:block absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded-md shadow-lg whitespace-nowrap z-30 font-medium">
                    <p className="font-bold">{c.displayName}</p>
                    <p className="text-slate-300 text-[9px]">{getSectionLabel(c.activeSection)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Syncing Status Indicator */}
        {isSyncing && (
          <span className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 animate-pulse">
            <Radio className="w-3 h-3" />
            <span>{language === 'en' ? 'Syncing...' : 'सिंक हो रहा है...'}</span>
          </span>
        )}

        {/* Last Remote Editor alert */}
        {lastRemoteEditor && (
          <span className="hidden sm:inline-block text-[11px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-lg">
            {language === 'en' ? 'Last edit by' : 'अंतिम संपादन:'}{' '}
            <strong className="text-slate-800">{lastRemoteEditor}</strong>
          </span>
        )}
      </div>

      {/* Right: Actions (Invite & Test Simulation) */}
      <div className="flex items-center gap-2">
        {onSimulateCollaborator && (
          <button
            type="button"
            onClick={onSimulateCollaborator}
            className="px-2.5 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-[11px] font-bold flex items-center gap-1 transition-colors"
            title="Add a simulated collaborator to test real-time presence indicators"
          >
            <Sparkles className="w-3 h-3 text-purple-600" />
            <span>{language === 'en' ? 'Simulate Co-writer' : 'सह-लेखक जोड़ें'}</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleShareLink}
          className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-200/80"
          title="Share script link with collaborators"
        >
          {copiedLink ? (
            <>
              <Check className="w-3 h-3 text-emerald-600" />
              <span className="text-emerald-700">{language === 'en' ? 'Link Copied!' : 'लिंक कॉपी हुआ!'}</span>
            </>
          ) : (
            <>
              <Share2 className="w-3 h-3" />
              <span>{language === 'en' ? 'Share Session' : 'शेयर लिंक'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
