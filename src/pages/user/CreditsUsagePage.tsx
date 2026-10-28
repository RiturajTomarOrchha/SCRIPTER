import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useRole } from '../../context/RoleContext';
import { DEMO_TOPUP_PACKAGES } from '../../data/mockData';
import { CreditTopupPackage, CreditLedgerEntry } from '../../types';
import {
  Zap,
  TrendingUp,
  Clock,
  Sparkles,
  ShoppingBag,
  ArrowUpRight,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Search,
  CheckCircle2,
  X,
  CreditCard,
  ShieldCheck,
  Info,
  Calendar,
  Layers,
  Check,
  RefreshCw,
  Crown,
  Download,
  Filter,
  ArrowRight,
  AlertTriangle,
  FileCheck,
  HelpCircle,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

export const CreditsUsagePage: React.FC = () => {
  const { language } = useLanguage();
  const {
    creditsInfo,
    subscription,
    buyCredits,
    refreshState
  } = useRole();
  const navigate = useNavigate();

  // Loading & State Simulators
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [simulateInsufficient, setSimulateInsufficient] = useState<boolean>(false);
  const [isSimulatedError, setIsSimulatedError] = useState<boolean>(false);

  // Buy Credits Modal State
  const [isBuyModalOpen, setIsBuyModalOpen] = useState<boolean>(false);
  const [selectedPackage, setSelectedPackage] = useState<CreditTopupPackage>(DEMO_TOPUP_PACKAGES[1]); // Default 500 pack
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState<CreditTopupPackage | null>(null);

  // Full Ledger Modal
  const [isFullLedgerModalOpen, setIsFullLedgerModalOpen] = useState<boolean>(false);

  // Ledger Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<'this_month' | 'last_month' | 'all_time'>('this_month');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      refreshState();
      setIsLoading(false);
      showToast(language === 'en' ? 'Credit balance refreshed' : 'क्रेडिट बैलेंस अपडेट हो गया');
    }, 600);
  };

  // Effective display balance (respects simulation toggle)
  const effectiveTotal = simulateInsufficient ? 0 : creditsInfo.totalAvailable;
  const isLowBalance = !simulateInsufficient && effectiveTotal <= 200 && effectiveTotal > 0;
  const isZeroBalance = simulateInsufficient || effectiveTotal === 0;

  const percentUsed = Math.min(
    100,
    Math.round((creditsInfo.monthlyUsed / Math.max(1, creditsInfo.monthlyAllowance)) * 100)
  );

  const handleCompletePurchase = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      buyCredits(selectedPackage.credits, selectedPackage.price);
      setIsProcessingPayment(false);
      setPurchaseSuccess(selectedPackage);
      setSimulateInsufficient(false);
      refreshState();
    }, 1200);
  };

  // Filtered Ledger Entries
  const filteredLedger = useMemo(() => {
    return creditsInfo.recentLedger.filter((item) => {
      // Category filter
      if (selectedCategoryFilter === 'scripts' && item.operationType !== 'script_generation') return false;
      if (selectedCategoryFilter === 'captions' && item.operationType !== 'caption_generation') return false;
      if (selectedCategoryFilter === 'thumbnails' && item.operationType !== 'thumbnail_generation') return false;
      if (selectedCategoryFilter === 'research' && item.operationType !== 'topic_research') return false;
      if (selectedCategoryFilter === 'topup' && item.operationType !== 'topup_purchase' && item.operationType !== 'monthly_grant') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchDesc = item.description.toLowerCase().includes(q) || (item.descriptionHi && item.descriptionHi.toLowerCase().includes(q));
        const matchTitle = item.projectTitle ? item.projectTitle.toLowerCase().includes(q) : false;
        const matchProfile = item.businessProfileName ? item.businessProfileName.toLowerCase().includes(q) : false;
        return matchDesc || matchTitle || matchProfile;
      }

      return true;
    });
  }, [creditsInfo.recentLedger, selectedCategoryFilter, searchQuery]);

  const getOperationIcon = (type: string) => {
    switch (type) {
      case 'script_generation':
        return (
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
        );
      case 'caption_generation':
        return (
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
        );
      case 'thumbnail_generation':
        return (
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <ImageIcon className="w-4 h-4" />
          </div>
        );
      case 'topic_research':
        return (
          <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
            <Search className="w-4 h-4" />
          </div>
        );
      case 'topup_purchase':
      case 'monthly_grant':
      case 'plan_allowance':
        return (
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 fill-emerald-600" />
          </div>
        );
      default:
        return (
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4" />
          </div>
        );
    }
  };

  // Export ledger to JSON
  const handleExportLedger = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify(creditsInfo.recentLedger, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `scripter_credit_ledger_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(language === 'en' ? 'Ledger exported as JSON' : 'बहीखाता डाउनलोड हो गया');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 lg:pb-12">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#0B132B] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Title Bar */}
      <div className="bg-white border-b border-slate-200/80 sticky top-16 z-20 backdrop-blur-md bg-white/90">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
                <span>{language === 'en' ? 'Usage & AI Credits' : 'उपयोग और AI क्रेडिट्स'}</span>
              </h1>
              <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full flex items-center gap-1 ${
                isZeroBalance
                  ? 'bg-rose-100 text-rose-800'
                  : isLowBalance
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                <Zap className={`w-3 h-3 ${isZeroBalance ? 'fill-rose-500 text-rose-500' : 'fill-amber-500 text-amber-500'}`} />
                {effectiveTotal.toLocaleString()} {language === 'en' ? 'Available' : 'उपलब्ध'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {language === 'en'
                ? 'Track your monthly allowance, top-up balance, and AI operation costs.'
                : 'अपनी मासिक सीमा, अतिरिक्त टॉप-अप बैलेंस और एआई उपयोग का विवरण देखें।'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Quick Refresh */}
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
              title={language === 'en' ? 'Refresh Balance' : 'बैलेंस रिफ्रेश करें'}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
            </button>

            {/* Test Simulation Toggle */}
            <button
              onClick={() => setSimulateInsufficient(!simulateInsufficient)}
              className={`px-2.5 py-1.5 text-[11px] font-bold rounded-xl border transition-all ${
                simulateInsufficient
                  ? 'bg-rose-50 border-rose-300 text-rose-700'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="Test insufficient credit state"
            >
              {simulateInsufficient
                ? (language === 'en' ? 'Reset Balance' : 'बैलेंस रीसेट')
                : (language === 'en' ? 'Test 0 Credits' : 'शून्य टेस्ट')}
            </button>

            {/* Buy Credits Button */}
            <button
              onClick={() => setIsBuyModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{language === 'en' ? 'Buy More Credits' : 'अतिरिक्त क्रेडिट खरीदें'}</span>
            </button>

            {/* Upgrade Plan Button */}
            <button
              onClick={() => navigate('/user/subscription')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-all"
            >
              <span>{language === 'en' ? 'Upgrade Plan' : 'प्लान अपग्रेड'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Loading Skeleton Simulation */}
        {isLoading && (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center animate-pulse">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              {language === 'en' ? 'Synchronizing Credit Ledger...' : 'क्रेडिट बहीखाता सिंक्रोनाइज़ हो रहा है...'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Checking active monthly allowance and top-up entitlements</p>
          </div>
        )}

        {/* State A: Insufficient Credits Banner (Matching Reference Poster Screen 7) */}
        {isZeroBalance && (
          <div className="bg-gradient-to-r from-rose-500/15 via-rose-500/10 to-transparent border-2 border-rose-300 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md animate-in slide-in-from-top-2">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-sm">
                <AlertTriangle className="w-6 h-6 stroke-[2.3]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-rose-950">
                    {language === 'en' ? 'Your AI Credits Have Expired / Depleted!' : 'आपके AI क्रेडिट समाप्त हो गए हैं!'}
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-200 text-rose-900 rounded-full uppercase">
                    {language === 'en' ? 'Action Required' : 'कार्रवाई आवश्यक'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-rose-800/90 mt-1 max-w-xl leading-relaxed">
                  {language === 'en'
                    ? 'To continue creating content without pause, buy additional top-up credits or upgrade your plan to unlock more monthly quota.'
                    : 'अपना कंटेंट बनाना जारी रखने के लिए अतिरिक्त क्रेडिट खरीदें या अपना प्लान अपग्रेड करें।'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 self-stretch sm:self-center">
              <button
                onClick={() => setIsBuyModalOpen(true)}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-transform active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>{language === 'en' ? 'Buy Extra Credits' : 'अतिरिक्त क्रेडिट खरीदें'}</span>
              </button>
              <button
                onClick={() => navigate('/user/subscription')}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all text-center"
              >
                {language === 'en' ? 'Upgrade Plan' : 'प्लान अपग्रेड करें'}
              </button>
            </div>
          </div>
        )}

        {/* State B: Low Credit Warning Banner (When remaining <= 200) */}
        {isLowBalance && (
          <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-amber-900">
                {language === 'en' ? 'Low Credit Balance Alert' : 'कम क्रेडिट बैलेंस चेतावनी'}
              </h3>
              <p className="text-xs text-amber-800/90 mt-0.5">
                {language === 'en'
                  ? `You have only ${creditsInfo.totalAvailable} AI credits remaining in your balance. Top-up anytime to prevent generation pauses.`
                  : `आपके पास केवल ${creditsInfo.totalAvailable} क्रेडिट्स शेष हैं। बिना रुकावट काम जारी रखने के लिए अतिरिक्त क्रेडिट्स लें या प्लान अपग्रेड करें।`}
              </p>
            </div>
            <button
              onClick={() => setIsBuyModalOpen(true)}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm whitespace-nowrap self-center transition-all"
            >
              {language === 'en' ? 'Top-up Now' : 'टॉप-अप करें'}
            </button>
          </div>
        )}

        {/* Section A: Hero Card (Dynamic Gradient Banner with Dual Allowance Breakdown) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E1B4B] via-[#2E1065] to-[#0F172A] text-white p-6 sm:p-8 shadow-xl">
          {/* Subtle background glow effect */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-semibold tracking-wider uppercase text-purple-200/90">
                  {language === 'en' ? 'Current Available Balance' : 'वर्तमान उपलब्ध बैलेंस'}
                </span>
                <span className="px-2.5 py-0.5 text-[11px] font-bold bg-white/20 text-white rounded-full backdrop-blur-sm border border-white/10 flex items-center gap-1">
                  <Crown className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {subscription.planName}
                </span>
              </div>
              <div className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-2 flex items-baseline gap-2">
                <span>{effectiveTotal.toLocaleString()}</span>
                <span className="text-base sm:text-lg font-normal text-purple-200">
                  {language === 'en' ? 'Credits' : 'क्रेडिट्स'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-purple-200/80 mt-1">
                {language === 'en'
                  ? `${creditsInfo.monthlyUsed} used of ${creditsInfo.monthlyAllowance} monthly credits (${creditsInfo.remainingMonthly} remaining)`
                  : `${creditsInfo.monthlyAllowance} मासिक क्रेडिट में से ${creditsInfo.monthlyUsed} उपयोग किए (${creditsInfo.remainingMonthly} शेष)`}
              </p>
            </div>

            {/* Quick Actions matching poster */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsBuyModalOpen(true)}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
              >
                <Zap className="w-4 h-4 fill-slate-900" />
                <span>{language === 'en' ? 'Buy More Credits' : 'अतिरिक्त क्रेडिट खरीदें'}</span>
              </button>
              <button
                onClick={() => navigate('/user/subscription')}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl backdrop-blur-sm border border-white/15 transition-all"
              >
                {language === 'en' ? 'Change Plan' : 'प्लान बदलें'}
              </button>
            </div>
          </div>

          {/* Progress Bar & Breakdown */}
          <div className="relative z-10 mt-6 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between text-xs text-purple-200/90 mb-2 font-medium">
              <span>{language === 'en' ? 'Monthly Consumption' : 'मासिक उपयोग'}</span>
              <span>{percentUsed}% {language === 'en' ? 'consumed' : 'उपयोग हुआ'}</span>
            </div>
            <div className="w-full h-3 bg-white/15 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400 rounded-full transition-all duration-700"
                style={{ width: `${percentUsed}%` }}
              />
            </div>

            {/* 3 Metric Summary Boxes matching Screen 1 "Mera Plan" */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-3">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-purple-200 font-medium">
                    {language === 'en' ? 'AI Credit (Monthly)' : 'AI क्रेडिट (मासिक)'}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-white/10 text-purple-200 rounded">
                    Plan
                  </span>
                </div>
                <div className="text-xl font-bold text-white mt-1">
                  {creditsInfo.monthlyAllowance.toLocaleString()}
                </div>
                <div className="text-[11px] text-purple-300/90 mt-1 flex items-center justify-between">
                  <span>{creditsInfo.monthlyUsed} {language === 'en' ? 'used' : 'उपयोग'}</span>
                  <span className="font-semibold text-emerald-300">{creditsInfo.remainingMonthly} {language === 'en' ? 'left' : 'शेष'}</span>
                </div>
                <span className="text-[10px] text-purple-300/70 block mt-1">
                  {language === 'en'
                    ? `Resets ${creditsInfo.resetDate} (${creditsInfo.daysUntilReset}d left)`
                    : `${creditsInfo.resetDate} को रीसेट होगा`}
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-purple-200 font-medium">
                    {language === 'en' ? 'Additional Top-up' : 'अतिरिक्त क्रेडिट'}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-400/20 text-amber-300 rounded">
                    No Expiry
                  </span>
                </div>
                <div className="text-xl font-bold text-amber-300 mt-1">
                  {creditsInfo.purchasedCredits.toLocaleString()}
                </div>
                <div className="text-[11px] text-purple-300/90 mt-1 flex items-center justify-between">
                  <span>0 {language === 'en' ? 'used' : 'उपयोग'}</span>
                  <span className="font-semibold text-amber-200">{creditsInfo.purchasedCredits} {language === 'en' ? 'left' : 'शेष'}</span>
                </div>
                <span className="text-[10px] text-purple-300/70 block mt-1">
                  {language === 'en' ? 'Rolls over indefinitely' : 'हमेशा सुरक्षित रहता है'}
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-purple-200 font-medium">
                    {language === 'en' ? 'Estimated AI Content' : 'संभावित कंटेंट आउटपुट'}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-400/20 text-emerald-300 rounded">
                    Ready
                  </span>
                </div>
                <div className="text-xs text-purple-200 space-y-1 mt-2">
                  <div className="flex justify-between">
                    <span>YouTube Scripts (10cr):</span>
                    <strong className="text-white">~{Math.floor(effectiveTotal / 10)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Reels & Hooks (5cr):</span>
                    <strong className="text-white">~{Math.floor(effectiveTotal / 5)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Thumbnails (15cr):</span>
                    <strong className="text-white">~{Math.floor(effectiveTotal / 15)}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section B: Quick Links Grid matching Poster 1 Screen 1 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => navigate('/user/subscription')}
            className="p-3.5 bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-sm transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Crown className="w-4 h-4 fill-amber-500" />
            </div>
            <span className="text-xs font-bold text-slate-800 block group-hover:text-blue-600 transition-colors">
              {language === 'en' ? 'Change Plan' : 'प्लान बदलें'}
            </span>
            <span className="text-[11px] text-slate-400">
              {subscription.planName} (Active)
            </span>
          </button>

          <button
            onClick={() => setIsBuyModalOpen(true)}
            className="p-3.5 bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-sm transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800 block group-hover:text-blue-600 transition-colors">
              {language === 'en' ? 'Buy Extra Credits' : 'क्रेडिट खरीदें'}
            </span>
            <span className="text-[11px] text-slate-400">
              From ₹0.25 / credit
            </span>
          </button>

          <button
            onClick={() => navigate('/user/billing')}
            className="p-3.5 bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-sm transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <CreditCard className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800 block group-hover:text-blue-600 transition-colors">
              {language === 'en' ? 'Payment History' : 'भुगतान इतिहास'}
            </span>
            <span className="text-[11px] text-slate-400">
              Tax Invoices & Receipts
            </span>
          </button>

          <button
            onClick={() => setIsFullLedgerModalOpen(true)}
            className="p-3.5 bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:shadow-sm transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <FileCheck className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800 block group-hover:text-blue-600 transition-colors">
              {language === 'en' ? 'Credit History' : 'क्रेडिट इतिहास'}
            </span>
            <span className="text-[11px] text-slate-400">
              Auditable Ledger
            </span>
          </button>
        </div>

        {/* Section C: Usage Overview Stats (4 Cards matching poster) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-slate-900">
              {language === 'en' ? 'Usage Overview' : 'उपयोग का विवरण'}
            </h2>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as any)}
              className="text-xs font-semibold bg-white border border-slate-200 text-slate-700 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="this_month">{language === 'en' ? 'This Month' : 'इस महीने'}</option>
              <option value="last_month">{language === 'en' ? 'Last Month' : 'पिछले महीने'}</option>
              <option value="all_time">{language === 'en' ? 'All Time' : 'कुल समय'}</option>
            </select>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
              <span className="text-xs text-slate-500 font-medium block">
                {language === 'en' ? 'Total Used' : 'कुल उपयोग'}
              </span>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {creditsInfo.monthlyUsed}
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 mt-1.5">
                <TrendingUp className="w-3 h-3" />
                <span>+12% {language === 'en' ? 'vs last month' : 'पिछले महीने से'}</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
              <span className="text-xs text-slate-500 font-medium block">
                {language === 'en' ? 'Remaining Allowance' : 'शेष मासिक कोटा'}
              </span>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {creditsInfo.remainingMonthly}
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1.5">
                <span>{percentUsed < 80 ? 'Good Pace' : 'High Usage'}</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
              <span className="text-xs text-slate-500 font-medium block">
                {language === 'en' ? 'Daily Average' : 'दैनिक औसत'}
              </span>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                32
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mt-1.5">
                <Clock className="w-3 h-3" />
                <span>{language === 'en' ? 'credits / day' : 'क्रेडिट / दिन'}</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
              <span className="text-xs text-slate-500 font-medium block">
                {language === 'en' ? 'Most Used Feature' : 'सबसे ज्यादा उपयोग'}
              </span>
              <div className="text-base font-bold text-slate-900 mt-1 truncate">
                {language === 'en' ? 'Script Generation' : 'स्क्रिप्ट जेनरेशन'}
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-purple-600 mt-1.5">
                <span>65% of all credits</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section C2: Transparent AI Operation Pricing Explainer */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              {language === 'en' ? 'Transparent Credit Consumption Guide' : 'पारदर्शी क्रेडिट दरें'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            {language === 'en'
              ? 'Credits are deducted only when an operation succeeds. Failed operations are never charged.'
              : 'क्रेडिट्स केवल सफल ऑपरेशन पर ही काटे जाते हैं। असफल होने पर कोई चार्ज नहीं लगता।'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">YouTube / Long Script</span>
                <span className="text-[11px] text-slate-500">Multi-scene & teleprompter</span>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg">
                10 cr
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Reel / Short / Hook</span>
                <span className="text-[11px] text-slate-500">Fast viral 30-60s script</span>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg">
                5 cr
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Topic & Competitor Research</span>
                <span className="text-[11px] text-slate-500">AI trending research angles</span>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-teal-100 text-teal-700 rounded-lg">
                5 cr
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Thumbnail & Graphic Pack</span>
                <span className="text-[11px] text-slate-500">High-converting visual card</span>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg">
                15 cr
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Captions & Hashtags</span>
                <span className="text-[11px] text-slate-500">Multi-platform social copy</span>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-lg">
                5 cr
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Teleprompter & Recording</span>
                <span className="text-[11px] text-slate-500">Full voice sync & exports</span>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-lg">
                Free
              </span>
            </div>
          </div>
        </div>

        {/* Section D: Auditable Recent Usage Ledger with Search & Filters */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'en' ? 'Recent Usage Ledger' : 'उपयोग का बहीखाता'}
                </h3>
                <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded-full">
                  {filteredLedger.length} {language === 'en' ? 'entries' : 'प्रविष्टियां'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'en'
                  ? 'Transparent, tamper-proof history of every credit deduction and grant.'
                  : 'प्रत्येक क्रेडिट उपयोग और टॉप-अप का प्रामाणिक रिकॉर्ड।'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFullLedgerModalOpen(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
              >
                <span>{language === 'en' ? 'View All (Full History)' : 'सभी देखें'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Search & Filter Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              <button
                onClick={() => setSelectedCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-full font-bold transition-all whitespace-nowrap ${
                  selectedCategoryFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {language === 'en' ? 'All' : 'सभी'}
              </button>
              <button
                onClick={() => setSelectedCategoryFilter('scripts')}
                className={`px-3 py-1.5 rounded-full font-bold transition-all whitespace-nowrap ${
                  selectedCategoryFilter === 'scripts'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {language === 'en' ? 'Scripts' : 'स्क्रिप्ट'}
              </button>
              <button
                onClick={() => setSelectedCategoryFilter('captions')}
                className={`px-3 py-1.5 rounded-full font-bold transition-all whitespace-nowrap ${
                  selectedCategoryFilter === 'captions'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {language === 'en' ? 'Captions' : 'कैप्शन'}
              </button>
              <button
                onClick={() => setSelectedCategoryFilter('thumbnails')}
                className={`px-3 py-1.5 rounded-full font-bold transition-all whitespace-nowrap ${
                  selectedCategoryFilter === 'thumbnails'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {language === 'en' ? 'Thumbnails' : 'थंबनेल'}
              </button>
              <button
                onClick={() => setSelectedCategoryFilter('topup')}
                className={`px-3 py-1.5 rounded-full font-bold transition-all whitespace-nowrap ${
                  selectedCategoryFilter === 'topup'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {language === 'en' ? 'Top-ups & Grants' : 'टॉप-अप'}
              </button>
            </div>

            {/* Search Input */}
            <div className="relative shrink-0">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'en' ? 'Search operations...' : 'ऑपरेशन खोजें...'}
                className="w-full sm:w-48 pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* List or Empty State */}
          {filteredLedger.length === 0 ? (
            <div className="py-10 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold text-slate-700">
                {language === 'en' ? 'No usage records found' : 'कोई रिकॉर्ड नहीं मिला'}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {language === 'en'
                  ? 'Try adjusting your search query or category filter.'
                  : 'फ़िल्टर या खोज शब्द बदलकर देखें।'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredLedger.slice(0, 7).map((item) => (
                <div key={item.id} className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors px-1 rounded-xl">
                  <div className="flex items-center gap-3 min-w-0">
                    {getOperationIcon(item.operationType)}
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                        {language === 'hi' && item.descriptionHi ? item.descriptionHi : item.description}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span>{item.timestamp}</span>
                        {item.projectTitle && (
                          <>
                            <span>•</span>
                            <span className="truncate text-slate-500 font-medium">{item.projectTitle}</span>
                          </>
                        )}
                        {item.businessProfileName && (
                          <>
                            <span>•</span>
                            <span className="truncate">{item.businessProfileName}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-xs sm:text-sm font-bold ${
                        item.amount > 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {item.amount > 0 ? `+${item.amount}` : item.amount}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {language === 'en' ? 'Balance' : 'बैलेंस'}: {item.balanceAfter}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Buy More Credits Modal */}
      {isBuyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsBuyModalOpen(false);
                setPurchaseSuccess(null);
              }}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {purchaseSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-in zoom-in">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {language === 'en' ? 'Credits Added Successfully!' : 'क्रेडिट्स सफलतापूर्वक जोड़े गए!'}
                </h3>
                <p className="text-sm text-slate-600 mt-1 max-w-sm mx-auto">
                  {language === 'en'
                    ? `${purchaseSuccess.credits.toLocaleString()} AI credits have been credited to your account. Your new balance is ready.`
                    : `${purchaseSuccess.credits.toLocaleString()} क्रेडिट्स आपके खाते में जोड़ दिए गए हैं।`}
                </p>

                <div className="mt-5 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5 max-w-md mx-auto">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Package:</span>
                    <span className="font-semibold text-slate-800">{purchaseSuccess.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Credits Credited:</span>
                    <span className="font-bold text-emerald-600">+{purchaseSuccess.credits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Amount Paid (Test Mode):</span>
                    <span className="font-semibold text-slate-800">₹{purchaseSuccess.price}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsBuyModalOpen(false);
                    setPurchaseSuccess(null);
                  }}
                  className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md"
                >
                  {language === 'en' ? 'Done & Return to Credits' : 'पूर्ण हुआ'}
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <h3 className="text-lg font-bold text-slate-900">
                    {language === 'en' ? 'Buy Extra AI Credits' : 'अतिरिक्त AI क्रेडिट खरीदें'}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mb-5">
                  {language === 'en'
                    ? 'Top-up credits never expire while your plan is active and roll over indefinitely.'
                    : 'टॉप-अप क्रेडिट्स सक्रिय प्लान के दौरान कभी खत्म नहीं होते।'}
                </p>

                {/* Packages Selection List */}
                <div className="space-y-2.5 mb-5">
                  {DEMO_TOPUP_PACKAGES.map((pkg) => {
                    const isSelected = selectedPackage.id === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="topup-pkg"
                            checked={isSelected}
                            onChange={() => setSelectedPackage(pkg)}
                            className="text-blue-600 focus:ring-blue-500 w-4 h-4"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-900">
                                {pkg.credits.toLocaleString()} {language === 'en' ? 'Credits' : 'क्रेडिट्स'}
                              </span>
                              {pkg.badge && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                                  {pkg.badge}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500">
                              {pkg.perCreditCost} • {pkg.description}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-extrabold text-slate-900">
                            ₹{pkg.price}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Sandbox / Test Mode Transparent Notice */}
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 mb-5 flex items-start gap-2.5 text-xs text-amber-900">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Transparent Sandbox Test Mode: </span>
                    <span>
                      Payment gateway is in verified sandbox development mode. No real bank charge will occur, and genuine credits will be added to your ledger.
                    </span>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs space-y-1 mb-5">
                  <div className="flex justify-between text-slate-600">
                    <span>Selected Pack:</span>
                    <span className="font-semibold text-slate-800">{selectedPackage.name}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Base Amount:</span>
                    <span className="font-semibold text-slate-800">₹{(selectedPackage.price / 1.18).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>GST (18% included):</span>
                    <span className="font-semibold text-slate-800">₹{(selectedPackage.price - selectedPackage.price / 1.18).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-1.5 flex justify-between font-bold text-slate-900 text-sm">
                    <span>Total Payable:</span>
                    <span className="text-blue-600">₹{selectedPackage.price}</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  disabled={isProcessingPayment}
                  onClick={handleCompletePurchase}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{language === 'en' ? 'Verifying Sandbox Order...' : 'ऑर्डर सत्यापित किया जा रहा है...'}</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>{language === 'en' ? `Pay ₹${selectedPackage.price} & Add Credits` : `₹${selectedPackage.price} भुगतान करें और क्रेडिट जोड़ें`}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* View All (Full History) Modal */}
      {isFullLedgerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative max-h-[90vh] flex flex-col">
            <button
              onClick={() => setIsFullLedgerModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between mb-4 pr-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {language === 'en' ? 'Complete AI Credit Ledger' : 'संपूर्ण क्रेडिट बहीखाता'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'en'
                    ? 'Permanent, auditable log of every generation, grant, and top-up.'
                    : 'सभी लेनदेनों का पूर्ण प्रामाणिक रिकॉर्ड।'}
                </p>
              </div>

              <button
                onClick={handleExportLedger}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Export JSON' : 'डाउनलोड'}</span>
              </button>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-slate-100 pr-1">
              {creditsInfo.recentLedger.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {getOperationIcon(item.operationType)}
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                        {language === 'hi' && item.descriptionHi ? item.descriptionHi : item.description}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span>{item.timestamp}</span>
                        {item.projectTitle && (
                          <>
                            <span>•</span>
                            <span className="truncate text-slate-500 font-medium">{item.projectTitle}</span>
                          </>
                        )}
                        {item.businessProfileName && (
                          <>
                            <span>•</span>
                            <span className="truncate">{item.businessProfileName}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-xs sm:text-sm font-bold ${
                        item.amount > 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {item.amount > 0 ? `+${item.amount}` : item.amount}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {language === 'en' ? 'Balance' : 'बैलेंस'}: {item.balanceAfter}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Showing {creditsInfo.recentLedger.length} total ledger records</span>
              <button
                onClick={() => setIsFullLedgerModalOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl"
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
