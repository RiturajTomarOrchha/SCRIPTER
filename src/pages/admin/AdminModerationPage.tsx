import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { adminStorage } from '../../services/adminStorage';
import { ContentModerationItem } from '../../types';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Filter,
  Search,
  Clock,
  UserX,
  FileText,
  Shield,
  X,
  Flag,
  ArrowRight,
} from 'lucide-react';

interface AdminModerationPageProps {
  isMasterAdmin?: boolean;
}

export const AdminModerationPage: React.FC<AdminModerationPageProps> = ({ isMasterAdmin = false }) => {
  const { language } = useLanguage();
  const [queue, setQueue] = useState<ContentModerationItem[]>(() =>
    adminStorage.getModerationQueue()
  );
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'flagged' | 'resolved' | 'dismissed'>('all');
  const [selectedItem, setSelectedItem] = useState<ContentModerationItem | null>(null);
  const [actionItem, setActionItem] = useState<{ item: ContentModerationItem; action: 'dismiss' | 'flag' | 'remove' | 'ban' } | null>(null);
  const [actionNote, setActionNote] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredQueue = queue.filter((item) => {
    if (statusFilter === 'all') return true;
    return item.status === statusFilter;
  });

  const handleExecuteAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionItem) return;

    const mappedAction: 'Approved' | 'Flagged' | 'Removed' =
      actionItem.action === 'dismiss'
        ? 'Approved'
        : actionItem.action === 'flag'
        ? 'Flagged'
        : 'Removed';

    adminStorage.takeModerationAction(
      actionItem.item.id,
      mappedAction,
      actionNote.trim() || 'Moderator review decision recorded',
      isMasterAdmin ? 'Master Admin' : 'Admin Operations',
      isMasterAdmin ? 'master-admin' : 'admin'
    );

    setQueue(adminStorage.getModerationQueue());
    showToast(`Moderation action "${actionItem.action}" applied to item ${actionItem.item.id}`);
    setActionItem(null);
    setActionNote('');
  };

  const getSeverityBadge = (severity: ContentModerationItem['severity']) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold uppercase tracking-wider">
            Critical
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
            Medium
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider">
            Low
          </span>
        );
    }
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
            <span className="p-1 rounded-md bg-rose-50 text-rose-600">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {language === 'en' ? 'Content Moderation Desk' : 'कंटेंट मॉडरेशन डेस्क'}
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-rose-100 text-rose-800">
              Trust & Safety
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'en'
              ? 'Review automated AI safety flags, community reports, and policy violations.'
              : 'एआई सेफ्टी फ़्लैग्स, कम्युनिटी रिपोर्ट्स और नीति उल्लंघनों की समीक्षा करें।'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>{queue.filter((q) => q.status === 'pending').length} Pending Reviews</span>
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          {(['all', 'pending', 'flagged', 'resolved', 'dismissed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl font-bold capitalize transition-all whitespace-nowrap ${
                statusFilter === tab
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Moderation Queue Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredQueue.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-900">{item.id}</span>
                <span className="text-slate-300">•</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold uppercase">
                  {item.contentType}
                </span>
                {getSeverityBadge(item.severity)}
                <span className="text-slate-300">•</span>
                <span className="text-[11px] text-slate-400 font-mono">{item.flaggedAt}</span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm">{item.contentTitle}</h3>
                <p className="text-xs text-rose-600 font-semibold mt-0.5 flex items-center gap-1.5">
                  <Flag className="w-3.5 h-3.5 shrink-0" />
                  <span>Violation Reason: {item.flagReason}</span>
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Creator: <strong className="text-slate-800">{item.creatorName}</strong> ({item.creatorEmail})</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
              <button
                onClick={() => setSelectedItem(item)}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Inspect</span>
              </button>

              {item.status === 'pending' && (
                <>
                  <button
                    onClick={() => setActionItem({ item, action: 'dismiss' })}
                    className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition-colors"
                  >
                    Dismiss (Safe)
                  </button>

                  <button
                    onClick={() => setActionItem({ item, action: 'remove' })}
                    className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    Take Down Content
                  </button>
                </>
              )}

              {item.status !== 'pending' && (
                <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-500 font-mono text-xs font-semibold uppercase">
                  Status: {item.status}
                </span>
              )}
            </div>
          </div>
        ))}

        {filteredQueue.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900">Moderation Queue Clear</h3>
            <p className="text-xs text-slate-500 mt-1">
              There are no content items currently requiring review in this category.
            </p>
          </div>
        )}
      </div>

      {/* Inspect Item Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Content Inspection</h3>
                  <span className="text-xs text-slate-500 font-mono">{selectedItem.id}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-slate-400">Content Title</span>
                <p className="font-bold text-slate-900">{selectedItem.contentTitle}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-slate-400">Reported Snippet / Content Body</span>
                <p className="font-mono text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 leading-relaxed">
                  {selectedItem.contentPreview}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-slate-400">Flag Reason</span>
                  <p className="font-bold text-rose-600 mt-0.5">{selectedItem.flagReason}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-slate-400">Severity</span>
                  <div className="mt-1">{getSeverityBadge(selectedItem.severity)}</div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {actionItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-900 text-base capitalize">
                Confirm {actionItem.action} Action
              </h3>
            </div>

            <p className="text-xs text-slate-600">
              You are about to execute <strong>{actionItem.action.toUpperCase()}</strong> on item{' '}
              <span className="font-mono">{actionItem.item.id}</span> by{' '}
              <strong>{actionItem.item.creatorName}</strong>.
            </p>

            <form onSubmit={handleExecuteAction} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Audit Explanation / Mod Note (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Reason for decision..."
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActionItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                >
                  Confirm & Apply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
