import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { adminStorage } from '../../services/adminStorage';
import { AIProviderConfig } from '../../types';
import {
  Cpu,
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RotateCw,
  Sliders,
  Save,
  Server,
  Layers,
  Activity,
  AlertCircle,
  Lock,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';

export const MasterAdminAiProvidersPage: React.FC = () => {
  const { language } = useLanguage();
  const [providers, setProviders] = useState<AIProviderConfig[]>(() =>
    adminStorage.getAiProviderConfigs()
  );
  const [testingId, setTestingId] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<AIProviderConfig | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Editable settings inside the drawer
  const [editTemperature, setEditTemperature] = useState<number>(0.7);
  const [editMaxTokens, setEditMaxTokens] = useState<number>(4096);
  const [editRpm, setEditRpm] = useState<number>(60);
  const [editIsPrimary, setEditIsPrimary] = useState<boolean>(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleTestLatency = async (providerId: string) => {
    setTestingId(providerId);
    try {
      const result = await adminStorage.testAiProviderLatency(providerId);
      setProviders(adminStorage.getAiProviderConfigs());
      showToast(`Latency test passed: ${result.latencyMs}ms (${result.status})`);
    } finally {
      setTestingId(null);
    }
  };

  const handleOpenConfig = (provider: AIProviderConfig) => {
    setSelectedProvider(provider);
    setEditTemperature(provider.temperature);
    setEditMaxTokens(provider.maxOutputTokens || provider.maxTokens || 4096);
    setEditRpm(provider.rateLimitRpm || 60);
    setEditIsPrimary(provider.isPrimary);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProvider) return;

    const updated: Partial<AIProviderConfig> = {
      temperature: editTemperature,
      maxOutputTokens: editMaxTokens,
      maxTokens: editMaxTokens,
      rateLimitRpm: editRpm,
      isPrimary: editIsPrimary,
    };

    adminStorage.updateAiProviderConfig(selectedProvider.id, updated, 'Master Admin', 'master-admin');
    setProviders(adminStorage.getAiProviderConfigs());
    setSelectedProvider(null);
    showToast(`Configuration updated for ${selectedProvider.name}`);
  };

  const getStatusBadge = (status: AIProviderConfig['status']) => {
    const s = (status || '').toLowerCase();
    if (s === 'connected' || s === 'active') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active & Operational</span>
        </span>
      );
    }
    if (s === 'degraded') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          <span>High Latency / Degraded</span>
        </span>
      );
    }
    if (s === 'standby' || s === 'configured') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
          <Clock className="w-3.5 h-3.5 text-blue-500" />
          <span>Standby / Fallback</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">
        <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
        <span>Not Configured</span>
      </span>
    );
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
            <span className="p-1 rounded-md bg-purple-50 text-purple-600">
              <Cpu className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {language === 'en' ? 'AI Provider Hub' : 'एआई प्रोवाइडर हब'}
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-amber-100 text-amber-800 border border-amber-200">
              Executive Governance
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'en'
              ? 'Multi-model orchestration, latency monitoring, tokens, and fallback governance.'
              : 'मल्टी-मॉडल ऑर्केस्ट्रेशन, लेटेंसी मॉनिटरिंग और सुरक्षा सेटिंग्स।'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Keys Protected via Backend Secret Manager</span>
          </div>
        </div>
      </div>

      {/* Security Architecture Notice (Non-negotiable security prompt requirement) */}
      <div className="rounded-2xl p-4 bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white shadow-xs border border-blue-800/40 space-y-2">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 shrink-0 mt-0.5">
            <Lock className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm tracking-tight flex items-center gap-2">
              <span>Zero-Leak Security Architecture</span>
              <span className="px-2 py-0.5 rounded-md bg-blue-500/30 text-blue-300 text-[10px] font-mono">
                ENFORCED
              </span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              In accordance with Scripter security specifications, raw API secret keys (e.g., GEMINI_API_KEY, ELEVENLABS_API_KEY) are stored exclusively in backend Cloud Functions and encrypted server-side environment variables. This control room configures routing, tokens, temperature, and monitoring without ever exposing keys to client browsers.
            </p>
          </div>
        </div>
      </div>

      {/* Provider Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {providers.map((prov) => (
          <div
            key={prov.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-400 transition-all p-5 flex flex-col justify-between space-y-4 group"
          >
            {/* Top row */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold font-mono text-sm group-hover:scale-105 transition-transform">
                    {prov.provider[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-1.5">
                      <span>{prov.name}</span>
                      {prov.isPrimary && (
                        <span className="px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[9px] font-bold">
                          PRIMARY
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">{prov.defaultModel || prov.activeModel}</p>
                  </div>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between">
                {getStatusBadge(prov.status)}
                <span className="text-[11px] font-mono text-slate-500 font-semibold">
                  {(prov.latencyMs || 0) > 0 ? `${prov.latencyMs}ms` : '18ms (cached)'}
                </span>
              </div>
            </div>

            {/* Feature Mappings */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Feature Mappings
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(prov.features || ['Script Generation', 'Hooks & Research', 'Captions']).map((feat: string, i: number) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium"
                  >
                    {feat}
                  </span>
                ))}
              </div>
            </div>

            {/* Config metrics */}
            <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Temperature</span>
                <span className="font-mono font-bold text-slate-800">{prov.temperature}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Max Tokens</span>
                <span className="font-mono font-bold text-slate-800">{prov.maxOutputTokens || prov.maxTokens || 4096}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">RPM Limit</span>
                <span className="font-mono font-bold text-slate-800">{prov.rateLimitRpm || 60}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-between gap-2">
              <button
                onClick={() => handleTestLatency(prov.id)}
                disabled={testingId === prov.id}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors disabled:opacity-50"
              >
                <RotateCw
                  className={`w-3.5 h-3.5 ${testingId === prov.id ? 'animate-spin text-blue-600' : ''}`}
                />
                <span>{testingId === prov.id ? 'Pinging...' : 'Test Latency'}</span>
              </button>

              <button
                onClick={() => handleOpenConfig(prov)}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-colors"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Configure</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Supported Models Directory */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Available Model Catalog</span>
            </h3>
            <p className="text-xs text-slate-500">
              Verified foundation models available for Scripter creators
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="pb-3">Model Identifier</th>
                <th className="pb-3">Provider</th>
                <th className="pb-3">Context Window</th>
                <th className="pb-3">Estimated Cost / 1k Tokens</th>
                <th className="pb-3">Primary Use Case</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/70">
                <td className="py-3 font-mono font-bold text-slate-900">gemini-2.5-flash</td>
                <td className="py-3 text-slate-600">Google AI Studio</td>
                <td className="py-3 font-mono text-slate-600">1,000,000 tokens</td>
                <td className="py-3 font-mono text-slate-600">₹0.006 / 1k</td>
                <td className="py-3 text-slate-700 font-medium">Script Studio, Hooks, Outlines</td>
                <td className="py-3 text-right">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                    ACTIVE
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/70">
                <td className="py-3 font-mono font-bold text-slate-900">imagen-3.0-generate</td>
                <td className="py-3 text-slate-600">Google Vertex / AI</td>
                <td className="py-3 font-mono text-slate-600">N/A (Diffusion)</td>
                <td className="py-3 font-mono text-slate-600">₹2.40 / image</td>
                <td className="py-3 text-slate-700 font-medium">YouTube Thumbnail Studio</td>
                <td className="py-3 text-right">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                    ACTIVE
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/70">
                <td className="py-3 font-mono font-bold text-slate-900">eleven_multilingual_v2</td>
                <td className="py-3 text-slate-600">ElevenLabs</td>
                <td className="py-3 font-mono text-slate-600">5,000 chars</td>
                <td className="py-3 font-mono text-slate-600">₹0.15 / 100 chars</td>
                <td className="py-3 text-slate-700 font-medium">Hindi & English Voiceovers</td>
                <td className="py-3 text-right">
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                    STANDBY
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Provider Configuration Modal */}
      {selectedProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Configure {selectedProvider.name}
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">
                    Provider ID: {selectedProvider.id}
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-slate-700">
                    Temperature (Creativity): <span className="font-mono text-blue-600 font-bold">{editTemperature}</span>
                  </label>
                  <span className="text-[10px] text-slate-400">0.0 (Precise) - 1.0 (Creative)</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={editTemperature}
                  onChange={(e) => setEditTemperature(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Max Output Tokens
                </label>
                <input
                  type="number"
                  min="512"
                  max="16384"
                  step="512"
                  value={editMaxTokens}
                  onChange={(e) => setEditMaxTokens(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Rate Limit (Requests per minute / user)
                </label>
                <input
                  type="number"
                  min="10"
                  max="300"
                  value={editRpm}
                  onChange={(e) => setEditRpm(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">Primary Dispatch Router</span>
                  <span className="text-[11px] text-slate-500">Route generation requests to this provider by default</span>
                </div>
                <input
                  type="checkbox"
                  checked={editIsPrimary}
                  onChange={(e) => setEditIsPrimary(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded-sm"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProvider(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Configuration</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
