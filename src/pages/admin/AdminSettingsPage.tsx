import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  Settings,
  Bell,
  Moon,
  Sun,
  Shield,
  Save,
  CheckCircle2,
  Lock,
  User,
  Clock,
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { language } = useLanguage();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [criticalSmsAlerts, setCriticalSmsAlerts] = useState(true);
  const [sessionTimeoutMins, setSessionTimeoutMins] = useState(60);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Admin operational preferences saved.');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-20 space-y-6">
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
              <Settings className="w-5 h-5 text-blue-600" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {language === 'en' ? 'Admin Preferences' : 'एडमिन प्राथमिकताएं'}
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-blue-100 text-blue-800">
              Operations
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'en'
              ? 'Configure your administrative shift alerts, authentication timeouts, and personal dashboard views.'
              : 'व्यक्तिगत एडमिन सेटिंग्स और अलर्ट प्राथमिकताओं को कॉन्फ़िगर करें।'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Notification Preferences */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <span>Shift Alerts & Escalations</span>
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <div>
                <span className="font-semibold text-slate-800 block">Critical Content Moderation Alerts</span>
                <span className="text-[11px] text-slate-500">
                  Notify immediately when automated AI safety flags high-severity content
                </span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded-sm"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <div>
                <span className="font-semibold text-slate-800 block">Payment & Gateway Failure Alerts</span>
                <span className="text-[11px] text-slate-500">
                  Notify if webhook errors or refund requests spike beyond threshold
                </span>
              </div>
              <input
                type="checkbox"
                checked={criticalSmsAlerts}
                onChange={(e) => setCriticalSmsAlerts(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded-sm"
              />
            </label>
          </div>
        </div>

        {/* Security Session */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-700" />
            <span>Security & Session Inactivity</span>
          </h3>

          <div className="max-w-xs text-xs">
            <label className="block font-semibold text-slate-700 mb-1">
              Admin Session Idle Auto-Logout
            </label>
            <select
              value={sessionTimeoutMins}
              onChange={(e) => setSessionTimeoutMins(parseInt(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white font-medium"
            >
              <option value={15}>15 minutes (Strict High Security)</option>
              <option value={30}>30 minutes</option>
              <option value={60}>60 minutes (Standard Shift)</option>
              <option value={120}>2 hours</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
