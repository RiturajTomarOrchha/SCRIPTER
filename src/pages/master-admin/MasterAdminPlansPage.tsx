import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { adminStorage } from '../../services/adminStorage';
import {
  Crown,
  Sparkles,
  Zap,
  CheckCircle2,
  Sliders,
  Save,
  Shield,
  Layers,
  HelpCircle,
  TrendingUp,
  AlertCircle,
  FileText,
  Video,
  Image,
  Mic,
  Database,
  Lock,
} from 'lucide-react';

interface PlanDefinition {
  id: 'free' | 'pro' | 'agency';
  name: string;
  priceInrMonthly: number;
  priceInrAnnual: number;
  monthlyCredits: number;
  allowedProfiles: number;
  allowedProjects: number;
  hasWatermark: boolean;
  priorityRendering: boolean;
  voiceoverEnabled: boolean;
  activeSubscribers: number;
}

interface CreditCostRule {
  operationKey: string;
  label: string;
  category: 'script' | 'video' | 'visual' | 'audio' | 'research';
  creditCost: number;
  description: string;
}

export const MasterAdminPlansPage: React.FC = () => {
  const { language } = useLanguage();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initial plans configuration adhering to existing pricing: Pro is ₹499/mo (1,000 credits)
  const [plans, setPlans] = useState<PlanDefinition[]>([
    {
      id: 'free',
      name: 'Free Starter',
      priceInrMonthly: 0,
      priceInrAnnual: 0,
      monthlyCredits: 100,
      allowedProfiles: 1,
      allowedProjects: 3,
      hasWatermark: true,
      priorityRendering: false,
      voiceoverEnabled: false,
      activeSubscribers: 11450,
    },
    {
      id: 'pro',
      name: 'Pro Creator',
      priceInrMonthly: 499,
      priceInrAnnual: 4990,
      monthlyCredits: 1000,
      allowedProfiles: 5,
      allowedProjects: 24,
      hasWatermark: false,
      priorityRendering: true,
      voiceoverEnabled: true,
      activeSubscribers: 1248,
    },
    {
      id: 'agency',
      name: 'Agency & Studio',
      priceInrMonthly: 1499,
      priceInrAnnual: 14990,
      monthlyCredits: 5000,
      allowedProfiles: 25,
      allowedProjects: 150,
      hasWatermark: false,
      priorityRendering: true,
      voiceoverEnabled: true,
      activeSubscribers: 144,
    },
  ]);

  // Operational Credit Matrix
  const [creditRules, setCreditRules] = useState<CreditCostRule[]>([
    {
      operationKey: 'script_full',
      label: 'Complete Script Generation',
      category: 'script',
      creditCost: 10,
      description: 'Generates title, hook, problem, solution, CTA and beat-by-beat breakdowns',
    },
    {
      operationKey: 'research_deep',
      label: 'Topic & Idea Deep Research',
      category: 'research',
      creditCost: 2,
      description: 'Crawls trending keywords, pain points and audience demographics',
    },
    {
      operationKey: 'hook_generator',
      label: 'Viral Hook Matrix (5 Variations)',
      category: 'script',
      creditCost: 3,
      description: 'AI-crafted psychological opening hooks',
    },
    {
      operationKey: 'thumbnail_generation',
      label: 'AI Thumbnail Generation (Imagen 3)',
      category: 'visual',
      creditCost: 20,
      description: 'Generates 1280x720 photorealistic or graphic YouTube thumbnail',
    },
    {
      operationKey: 'video_captions_sync',
      label: 'Auto Captions & Teleprompter Sync',
      category: 'video',
      creditCost: 15,
      description: 'Whisper audio sync, bilingual Hindi/English subtitles and animation styles',
    },
    {
      operationKey: 'ai_voiceover',
      label: 'ElevenLabs Voiceover Synthesis',
      category: 'audio',
      creditCost: 25,
      description: 'Natural human voice synthesis per 60 seconds of script audio',
    },
  ]);

  const [selectedPlanForEdit, setSelectedPlanForEdit] = useState<PlanDefinition | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateCreditCost = (operationKey: string, newCost: number) => {
    if (newCost < 0) return;
    setCreditRules((prev) =>
      prev.map((r) => (r.operationKey === operationKey ? { ...r, creditCost: newCost } : r))
    );
    adminStorage.addAuditLog({
      actorName: 'Master Admin',
      actorRole: 'master-admin',
      action: 'UPDATE_CREDIT_RULE',
      target: operationKey,
      details: `Credit cost adjusted to ${newCost} credits`,
      status: 'SUCCESS',
      severity: 'info',
    });
    showToast(`Updated cost for ${operationKey} to ${newCost} credits`);
  };

  const handleSavePlanChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanForEdit) return;

    setPlans((prev) =>
      prev.map((p) => (p.id === selectedPlanForEdit.id ? selectedPlanForEdit : p))
    );

    adminStorage.addAuditLog({
      actorName: 'Master Admin',
      actorRole: 'master-admin',
      action: 'UPDATE_SUBSCRIPTION_PLAN',
      target: selectedPlanForEdit.name,
      details: `Updated plan monthly price: ₹${selectedPlanForEdit.priceInrMonthly}, credits: ${selectedPlanForEdit.monthlyCredits}`,
      status: 'SUCCESS',
      severity: 'warning',
    });

    setSelectedPlanForEdit(null);
    showToast(`Plan "${selectedPlanForEdit.name}" limits updated.`);
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
            <span className="p-1 rounded-md bg-amber-50 text-amber-600">
              <Crown className="w-5 h-5 fill-amber-500" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {language === 'en' ? 'Plans, Features & Credit Rules' : 'प्लान और क्रेडिट नियम'}
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-amber-100 text-amber-800 border border-amber-200">
              Monetization Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'en'
              ? 'Configure subscription tier allowances, watermark rules, and AI token operational costs.'
              : 'सब्सक्रिप्शन टीयर, क्रेडिट्स कोटा और एआई फीचर लागत का प्रबंधन करें।'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Active MRR: ₹8,42,500</span>
          </div>
        </div>
      </div>

      {/* 1. Subscription Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-2xl border p-5 flex flex-col justify-between space-y-4 shadow-xs relative overflow-hidden transition-all hover:shadow-md ${
              plan.id === 'pro'
                ? 'border-blue-500 ring-2 ring-blue-500/10'
                : 'border-slate-200/90'
            }`}
          >
            {plan.id === 'pro' && (
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-lg uppercase tracking-wider">
                Most Popular
              </div>
            )}

            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{plan.name}</h3>
                  <span className="text-xs text-slate-400 font-mono">
                    {plan.activeSubscribers.toLocaleString()} subscribers
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900 font-mono">
                  ₹{plan.priceInrMonthly}
                </span>
                <span className="text-xs text-slate-500">/ month</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                or ₹{plan.priceInrAnnual} billed annually (2 months free)
              </p>

              {/* Feature Allowances List */}
              <div className="mt-5 space-y-2.5 text-xs pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Monthly AI Credits</span>
                  <span className="font-mono font-bold text-blue-600">
                    {plan.monthlyCredits.toLocaleString()} cr
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Business Profiles</span>
                  <span className="font-mono font-bold text-slate-800">
                    {plan.allowedProfiles} profiles
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Concurrent Projects</span>
                  <span className="font-mono font-bold text-slate-800">
                    {plan.allowedProjects} slots
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Scripter Watermark</span>
                  <span
                    className={`font-semibold ${
                      plan.hasWatermark ? 'text-amber-600' : 'text-emerald-600'
                    }`}
                  >
                    {plan.hasWatermark ? 'Included on Export' : 'No Watermark'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Priority 1080p Export</span>
                  <span
                    className={`font-semibold ${
                      plan.priorityRendering ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  >
                    {plan.priorityRendering ? 'Ultra-Fast 60fps' : 'Standard Queue'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedPlanForEdit({ ...plan })}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Configure Tier Limits</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Operational Credit Matrix */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>AI Feature Operation Costs (Credits Consumption Matrix)</span>
            </h3>
            <p className="text-xs text-slate-500">
              When a creator performs an action, credits are atomically debited from their subscription quota.
            </p>
          </div>
          <div className="text-xs text-slate-500 font-mono bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            Current Rate: ₹1.00 ≈ 2.0 AI Credits
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="pb-3">Action Label</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Description</th>
                <th className="pb-3 w-40 text-center">Credit Cost</th>
                <th className="pb-3 text-right">Adjust Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {creditRules.map((rule) => (
                <tr key={rule.operationKey} className="hover:bg-slate-50/70">
                  <td className="py-3 font-semibold text-slate-900">
                    <div>{rule.label}</div>
                    <div className="text-[10px] font-mono text-slate-400 font-normal">
                      {rule.operationKey}
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px] uppercase">
                      {rule.category}
                    </span>
                  </td>
                  <td className="py-3 text-slate-600 max-w-xs">{rule.description}</td>
                  <td className="py-3 text-center">
                    <span className="px-3 py-1 rounded-xl bg-blue-50 text-blue-700 font-mono font-bold text-sm">
                      {rule.creditCost} credits
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() =>
                          handleUpdateCreditCost(
                            rule.operationKey,
                            Math.max(1, rule.creditCost - 1)
                          )
                        }
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors"
                        title="Decrease cost by 1"
                      >
                        -
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateCreditCost(rule.operationKey, rule.creditCost + 1)
                        }
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors"
                        title="Increase cost by 1"
                      >
                        +
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Plan Modal */}
      {selectedPlanForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Edit {selectedPlanForEdit.name}
                  </h3>
                  <span className="text-xs text-slate-500">
                    Tier ID: {selectedPlanForEdit.id}
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSavePlanChanges} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Monthly Price (₹ INR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={selectedPlanForEdit.priceInrMonthly}
                    onChange={(e) =>
                      setSelectedPlanForEdit({
                        ...selectedPlanForEdit,
                        priceInrMonthly: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Monthly AI Credits
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={selectedPlanForEdit.monthlyCredits}
                    onChange={(e) =>
                      setSelectedPlanForEdit({
                        ...selectedPlanForEdit,
                        monthlyCredits: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Allowed Business Profiles
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={selectedPlanForEdit.allowedProfiles}
                    onChange={(e) =>
                      setSelectedPlanForEdit({
                        ...selectedPlanForEdit,
                        allowedProfiles: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Allowed Active Projects
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={selectedPlanForEdit.allowedProjects}
                    onChange={(e) =>
                      setSelectedPlanForEdit({
                        ...selectedPlanForEdit,
                        allowedProjects: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPlanForEdit.hasWatermark}
                    onChange={(e) =>
                      setSelectedPlanForEdit({
                        ...selectedPlanForEdit,
                        hasWatermark: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded-sm"
                  />
                  <span className="text-slate-700 font-medium">Embed watermark in video renders</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPlanForEdit.priorityRendering}
                    onChange={(e) =>
                      setSelectedPlanForEdit({
                        ...selectedPlanForEdit,
                        priorityRendering: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded-sm"
                  />
                  <span className="text-slate-700 font-medium">Priority rendering queue (60fps)</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPlanForEdit(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Plan Rules</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
