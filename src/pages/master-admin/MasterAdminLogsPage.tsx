import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { adminStorage } from '../../services/adminStorage';
import { AdminAuditLog } from '../../types';
import {
  FileText,
  Search,
  Filter,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Lock,
  Download,
  Eye,
  X,
} from 'lucide-react';

export const MasterAdminLogsPage: React.FC = () => {
  const { language } = useLanguage();
  const [logs, setLogs] = useState<AdminAuditLog[]>(() =>
    adminStorage.getAuditLogs()
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'info' | 'warning' | 'critical'>('all');
  const [selectedLog, setSelectedLog] = useState<AdminAuditLog | null>(null);

  const filteredLogs = logs.filter((log) => {
    const actor = log.actorName || log.adminName || '';
    const act = log.action || log.actionType || '';
    const tgt = log.target || log.targetEntity || '';
    const sev = log.severity || (log.status === 'WARNING' ? 'warning' : log.status === 'FAILED' ? 'critical' : 'info');

    const matchesSearch =
      actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tgt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || sev === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const getSeverityBadge = (severity?: AdminAuditLog['severity']) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold uppercase tracking-wider">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            <span>Critical</span>
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Warning</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-3 h-3 text-blue-600" />
            <span>Info</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-slate-100 text-slate-800">
              <FileText className="w-5 h-5 text-slate-800" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {language === 'en' ? 'Security & Audit Logs' : 'सुरक्षा और ऑडिट लॉग'}
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-amber-100 text-amber-800 border border-amber-200">
              Immutable Trail
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'en'
              ? 'Complete chronological ledger of administrative interventions, role changes, and credit overrides.'
              : 'सभी प्रशासनिक परिवर्तनों और संवेदनशील क्रियाओं का संपूर्ण ऑडिट लॉग।'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Append-Only Ledger (Non-deletable)</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit trail by actor, action, target, or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
          {(['all', 'info', 'warning', 'critical'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all ${
                severityFilter === sev
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="p-3 pl-4">Timestamp</th>
                <th className="p-3">Actor</th>
                <th className="p-3">Action</th>
                <th className="p-3">Target</th>
                <th className="p-3">Details</th>
                <th className="p-3">Severity</th>
                <th className="p-3 pr-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3 pl-4 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                  <td className="p-3 font-semibold text-slate-900">
                    <div>{log.actorName || log.adminName}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{log.actorRole || log.adminRole}</div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-bold text-[10px]">
                      {log.action || log.actionType}
                    </span>
                  </td>
                  <td className="p-3 text-slate-700 font-medium">{log.target || log.targetEntity}</td>
                  <td className="p-3 text-slate-600 max-w-xs truncate font-sans">{log.details}</td>
                  <td className="p-3">{getSeverityBadge(log.severity || (log.status === 'WARNING' ? 'warning' : log.status === 'FAILED' ? 'critical' : 'info'))}</td>
                  <td className="p-3 pr-4 text-right">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="p-1 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Inspect Log Entry"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="p-12 text-center">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900">No audit records match query</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting the severity or search term.</p>
          </div>
        )}
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-slate-100 text-slate-800">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Audit Record Inspection</h3>
                  <span className="text-xs text-slate-500 font-mono">{selectedLog.id}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-slate-400">Actor & Role:</span>
                <p className="font-bold text-slate-900">
                  {selectedLog.actorName || selectedLog.adminName} ({selectedLog.actorRole || selectedLog.adminRole})
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-slate-400">Action & Target:</span>
                <p className="font-mono font-bold text-blue-700">
                  {selectedLog.action || selectedLog.actionType} ➔ {selectedLog.target || selectedLog.targetEntity}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-slate-400">Audit Details & Rationale:</span>
                <p className="text-slate-800 leading-relaxed font-sans">{selectedLog.details}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-slate-400 block font-sans">Timestamp</span>
                  <span className="text-slate-800 font-bold">{selectedLog.timestamp}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                  <span className="text-slate-400 block font-sans">Outcome Status</span>
                  <span className="text-emerald-700 font-bold uppercase">{selectedLog.status}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
