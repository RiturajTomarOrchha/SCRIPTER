import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { adminStorage } from '../../services/adminStorage';
import { PlatformSystemSettings } from '../../types';
import {
  Settings,
  Shield,
  Save,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Server,
  Database,
  RefreshCw,
  Sliders,
  Power,
  Users,
} from 'lucide-react';

export const MasterAdminSystemPage: React.FC = () => {
  const { language } = useLanguage();
  const [settings, setSettings] = useState<PlatformSystemSettings>(() =>
    adminStorage.getPlatformSystemSettings()
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isConfirmMaintenanceOpen, setIsConfirmMaintenanceOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleMaintenance = () => {
    if (!settings.maintenanceMode) {
      setIsConfirmMaintenanceOpen(true);
    } else {
      const updated = { ...settings, maintenanceMode: false };
      setSettings(updated);
      adminStorage.updatePlatformSystemSettings(updated, 'Master Admin', 'master-admin');
      showToast('Maintenance mode deactivated. Scripter platform online.');
    }
  };

  const handleConfirmMaintenance = () => {
    const updated = { ...settings, maintenanceMode: true };
    setSettings(updated);
    adminStorage.updatePlatformSystemSettings(updated, 'Master Admin', 'master-admin');
    setIsConfirmMaintenanceOpen(false);
    showToast('Platform put into Maintenance Mode. Creator access paused.');
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    adminStorage.updatePlatformSystemSettings(settings, 'Master Admin', 'master-admin');
    showToast('Platform system settings saved and active.');
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
            <span className="p-1 rounded-md bg-slate-100 text-slate-800">
              <Settings className="w-5 h-5 text-slate-800" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {language === 'en' ? 'System Settings & Security' : 'सिस्टम सेटिंग्स और सुरक्षा'}
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-amber-100 text-amber-800 border border-amber-200">
              System Configuration
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'en'
              ? 'Global platform controls, maintenance mode, security policies, and cluster limits.'
              : 'वैश्विक प्लेटफ़ॉर्म नियंत्रण, मेंटेनेंस मोड और सुरक्षा नीतियां।'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700">
            <Server className="w-3.5 h-3.5 text-blue-600" />
            <span>Cloud Infrastructure: Stable (99.98% SLA)</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* Critical Kill-Switches Ribbon */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Power className="w-4 h-4 text-rose-600" />
            <span>Platform Access & Maintenance Gate</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Maintenance Mode */}
            <div
              className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                settings.maintenanceMode
                  ? 'bg-rose-50 border-rose-200 text-rose-950'
                  : 'bg-slate-50 border-slate-200/80 text-slate-800'
              }`}
            >
              <div>
                <span className="font-bold text-sm block">Maintenance Mode</span>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  When enabled, all user-facing app routes display a maintenance splash screen. Only administrators can authenticate.
                </p>
                {settings.maintenanceMode && (
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-rose-600 text-white font-bold text-[10px]">
                    LIVE MAINTENANCE ACTIVE
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleToggleMaintenance}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  settings.maintenanceMode
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-rose-600 hover:bg-rose-700 text-white'
                }`}
              >
                {settings.maintenanceMode ? 'Deactivate' : 'Enable Mode'}
              </button>
            </div>

            {/* Registrations Open */}
            <div className="p-4 rounded-xl border bg-slate-50 border-slate-200/80 text-slate-800 flex items-start justify-between gap-4">
              <div>
                <span className="font-bold text-sm block">New User Registrations</span>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  Allow new creators to sign up. Disabling locks the platform to existing account holders only.
                </p>
              </div>

              <input
                type="checkbox"
                checked={settings.userRegistrationOpen}
                onChange={(e) =>
                  setSettings({ ...settings, userRegistrationOpen: e.target.checked })
                }
                className="w-5 h-5 text-blue-600 rounded-sm mt-1 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Global Operational Limits */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>Resource Throttles & Rendering Policies</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Max AI Requests / Minute per Creator
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={settings.maxAiRequestsPerMinute}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    maxAiRequestsPerMinute: parseInt(e.target.value) || 20,
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Prevents bot spam and DDoS attempts
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Default Video Render Resolution
              </label>
              <select
                value={settings.defaultVideoQuality}
                onChange={(e) =>
                  setSettings({ ...settings, defaultVideoQuality: e.target.value as any })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium"
              >
                <option value="720p">720p HD (Standard Mobile)</option>
                <option value="1080p">1080p Full HD (60fps Pro Default)</option>
                <option value="4k">4K Ultra HD (Agency Tier)</option>
              </select>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Applied to new video export jobs
              </span>
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Enforce Free-Tier Watermark
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={settings.watermarkEnabledGlobal}
                    onChange={(e) =>
                      setSettings({ ...settings, watermarkEnabledGlobal: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 rounded-sm cursor-pointer"
                  />
                  <span className="text-slate-600 font-medium">Always imprint Scripter badge</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Free plan users cannot export unbranded videos
              </span>
            </div>
          </div>
        </div>

        {/* Database & Cloud Backup Health */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-600" />
            <span>Database Integrity & Backups</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-slate-400 text-[11px] block">Automated Snapshot</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">Every 6 Hours</span>
              <span className="text-[10px] text-emerald-600 font-medium">Last: 28 Oct, 06:00 IST</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-slate-400 text-[11px] block">Database Engine</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">Cloud Firestore</span>
              <span className="text-[10px] text-blue-600 font-medium">Multi-Region (asia-south1)</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-slate-400 text-[11px] block">Media Storage</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">Google Cloud Storage</span>
              <span className="text-[10px] text-purple-600 font-medium">Encrypted at rest (AES-256)</span>
            </div>
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Global Platform Settings</span>
          </button>
        </div>
      </form>

      {/* Maintenance Confirmation Dialog */}
      {isConfirmMaintenanceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-rose-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-bold text-slate-900 text-base">Enable Maintenance Mode?</h3>
                <span className="text-xs text-rose-600 font-semibold">Immediate Platform Disruption</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Enabling maintenance mode will temporarily prevent creators from generating scripts, recording videos, or exporting files. Use this only for critical deployments or database migrations.
            </p>

            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setIsConfirmMaintenanceOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmMaintenance}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xs"
              >
                Confirm Maintenance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
