import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { adminStorage } from '../../services/adminStorage';
import {
  Bell,
  Send,
  Users,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Clock,
  Radio,
  FileText,
  Filter,
  X,
} from 'lucide-react';

interface AdminNotificationsPageProps {
  isMasterAdmin?: boolean;
}

interface BroadcastRecord {
  id: string;
  title: string;
  body: string;
  targetAudience: 'all' | 'free' | 'pro' | 'agency';
  category: 'system_announcement' | 'feature_release' | 'maintenance_alert' | 'billing_alert';
  sentBy: string;
  sentAt: string;
  recipientsCount: number;
  readRatePercent: number;
}

export const AdminNotificationsPage: React.FC<AdminNotificationsPageProps> = ({ isMasterAdmin = false }) => {
  const { language } = useLanguage();
  const [broadcasts, setBroadcasts] = useState<BroadcastRecord[]>([
    {
      id: 'bc-9021',
      title: 'Exciting Update: Gemini 2.5 Flash Script Engine Live!',
      body: 'Generate sharper hooks, viral outlines, and bilingual Hindi/English scripts 4x faster with our updated AI pipeline.',
      targetAudience: 'all',
      category: 'feature_release',
      sentBy: 'Master Admin',
      sentAt: '2026-10-24 10:00',
      recipientsCount: 12842,
      readRatePercent: 78.4,
    },
    {
      id: 'bc-9022',
      title: 'Scheduled Maintenance: 02 Nov 2026 (02:00 - 04:00 IST)',
      body: 'Our rendering cluster will undergo scheduled infrastructure upgrades. Video exports will pause for 2 hours.',
      targetAudience: 'all',
      category: 'maintenance_alert',
      sentBy: 'Admin Operations',
      sentAt: '2026-10-22 15:30',
      recipientsCount: 12842,
      readRatePercent: 62.1,
    },
    {
      id: 'bc-9023',
      title: 'Pro Exclusive: New 60fps Video Export Presets',
      body: 'Export crisp 60fps Reels and YouTube 4K Shorts directly without watermarks.',
      targetAudience: 'pro',
      category: 'feature_release',
      sentBy: 'Master Admin',
      sentAt: '2026-10-20 12:00',
      recipientsCount: 1248,
      readRatePercent: 91.2,
    },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newTarget, setNewTarget] = useState<BroadcastRecord['targetAudience']>('all');
  const [newCategory, setNewCategory] = useState<BroadcastRecord['category']>('system_announcement');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) return;

    const count =
      newTarget === 'all'
        ? 12842
        : newTarget === 'pro'
        ? 1248
        : newTarget === 'agency'
        ? 144
        : 11450;

    const record: BroadcastRecord = {
      id: `bc-${Date.now()}`,
      title: newTitle.trim(),
      body: newBody.trim(),
      targetAudience: newTarget,
      category: newCategory,
      sentBy: isMasterAdmin ? 'Master Admin' : 'Admin Operations',
      sentAt: '2026-10-28 13:15',
      recipientsCount: count,
      readRatePercent: 0,
    };

    setBroadcasts([record, ...broadcasts]);
    adminStorage.addAuditLog({
      actorName: isMasterAdmin ? 'Master Admin' : 'Admin Operations',
      actorRole: isMasterAdmin ? 'master-admin' : 'admin',
      action: 'BROADCAST_NOTIFICATION',
      target: newTarget,
      details: `Dispatched announcement "${newTitle.trim()}" to ${count} recipients`,
      status: 'SUCCESS',
      severity: 'info',
    });

    showToast(`Broadcast dispatched to ${count.toLocaleString()} creators`);
    setNewTitle('');
    setNewBody('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20 space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-blue-50 text-blue-600">
              <Radio className="w-5 h-5 text-blue-600" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {language === 'en' ? 'Platform Broadcasts & Alerts' : 'प्लेटफ़ॉर्म ब्रॉडकास्ट और अलर्ट'}
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-blue-100 text-blue-800">
              Communications
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'en'
              ? 'Dispatch targeted in-app alerts, maintenance banners, and release notes to creators.'
              : 'क्रिएटर्स को इन-ऐप अलर्ट, मेंटेनेंस नोटिस और नए फीचर्स के संदेश भेजें।'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Composer Form (Left 1 Col) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Send className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Compose Global Broadcast</h3>
          </div>

          <form onSubmit={handleBroadcast} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Audience</label>
              <select
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium"
              >
                <option value="all">All Registered Creators (12,842 users)</option>
                <option value="pro">Pro Creators Only (1,248 users)</option>
                <option value="agency">Agency Tier Only (144 users)</option>
                <option value="free">Free Starter Tier (11,450 users)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Alert Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium"
              >
                <option value="system_announcement">System Announcement</option>
                <option value="feature_release">Feature Drop / Release</option>
                <option value="maintenance_alert">Maintenance Notice</option>
                <option value="billing_alert">Billing / Commercial Alert</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Broadcast Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. New AI Voiceover Models Released"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Message Body *</label>
              <textarea
                rows={4}
                required
                placeholder="Write the full announcement message visible in creator notifications..."
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Broadcast Now</span>
            </button>
          </form>
        </div>

        {/* Broadcast History Table (Right 2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Dispatched Broadcasts History</h3>
              <p className="text-[11px] text-slate-400">Past notifications sent across Scripter</p>
            </div>
          </div>

          <div className="space-y-3">
            {broadcasts.map((bc) => (
              <div
                key={bc.id}
                className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/60 text-xs space-y-2 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{bc.title}</span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 font-bold text-[10px] uppercase">
                      {bc.targetAudience}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{bc.sentAt}</span>
                </div>

                <p className="text-slate-600 leading-relaxed">{bc.body}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                  <span>Sent by: <strong className="text-slate-700">{bc.sentBy}</strong></span>
                  <div className="flex items-center gap-3 font-mono">
                    <span>Recipients: {bc.recipientsCount.toLocaleString()}</span>
                    <span>Read Rate: {bc.readRatePercent}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
