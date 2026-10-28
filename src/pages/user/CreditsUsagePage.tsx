import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useRole } from '../../context/RoleContext';
import { DEMO_TOPUP_PACKAGES } from '../../data/mockData';
import { CreditTopupPackage } from '../../types';
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
  Check
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

  // Buy Credits Modal State
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<CreditTopupPackage>(DEMO_TOPUP_PACKAGES[1]); // Default 500 pack
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState<CreditTopupPackage | null>(null);

  // Time filter for overview
  const [timeFilter, setTimeFilter] = useState<'this_month' | 'last_month' | 'all_time'>('this_month');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

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
      refreshState();
    }, 1200);
  };

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
        return (
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
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
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>{language === 'en' ? 'AI Credits & Usage' : 'एआई क्रेडिट्स और उपयोग'}</span>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-100 text-amber-800 rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3 fill-amber-500 text-amber-500" />
                {creditsInfo.totalAvailable} {language === 'en' ? 'Available' : 'उपलब्ध'}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {language === 'en'
                ? 'Track your monthly allowance, top-up balance, and AI operation costs.'
                : 'अपनी मासिक सीमा, अतिरिक्त टॉप-अप बैलेंस और एआई उपयोग का विवरण देखें।'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBuyModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{language === 'en' ? 'Buy More Credits' : 'अतिरिक्त क्रेडिट खरीदें'}</span>
            </button>
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
        {/* Low Credit Warning Banner if remaining <= 200 */}
        {creditsInfo.totalAvailable <= 200 && (
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
                  ? `You have only ${creditsInfo.totalAvailable} AI credits remaining. Upgrade your plan or buy a top-up pack to continue generating scripts uninterrupted.`
                  : `आपके पास केवल ${creditsInfo.totalAvailable} क्रेडिट्स शेष हैं। बिना रुकावट काम जारी रखने के लिए अतिरिक्त क्रेडिट्स लें या प्लान अपग्रेड करें।`}
              </p>
            </div>
            <button
              onClick={() => setIsBuyModalOpen(true)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm whitespace-nowrap self-center"
            >
              {language === 'en' ? 'Top-up Now' : 'टॉप-अप करें'}
            </button>
          </div>
        )}

        {/* Hero Card: Dynamic Gradient Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E1B4B] via-[#2E1065] to-[#0F172A] text-white p-6 sm:p-8 shadow-xl">
          {/* Subtle background glow effect */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-semibold tracking-wider uppercase text-purple-200/90">
                  {language === 'en' ? 'Current Balance' : 'वर्तमान बैलेंस'}
                </span>
                <span className="px-2.5 py-0.5 text-[11px] font-bold bg-white/20 text-white rounded-full backdrop-blur-sm border border-white/10">
                  {subscription.planName}
                </span>
              </div>
              <div className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-2 flex items-baseline gap-2">
                <span>{creditsInfo.totalAvailable.toLocaleString()}</span>
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

            {/* Quick Actions */}
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-3">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                <span className="text-[11px] text-purple-200 block">
                  {language === 'en' ? 'Monthly Allowance' : 'मासिक सीमा'}
                </span>
                <span className="text-base font-bold text-white mt-0.5 block">
                  {creditsInfo.monthlyAllowance.toLocaleString()} {language === 'en' ? 'Credits' : 'क्रेडिट्स'}
                </span>
                <span className="text-[10px] text-purple-300/80">
                  {language === 'en'
                    ? `Resets ${creditsInfo.resetDate} (${creditsInfo.daysUntilReset}d left)`
                    : `${creditsInfo.resetDate} को रीसेट होगा (${creditsInfo.daysUntilReset} दिन बाकी)`}
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                <span className="text-[11px] text-purple-200 block">
                  {language === 'en' ? 'Purchased Top-up' : 'खरीदे गए अतिरिक्त'}
                </span>
                <span className="text-base font-bold text-amber-300 mt-0.5 block">
                  {creditsInfo.purchasedCredits.toLocaleString()} {language === 'en' ? 'Credits' : 'क्रेडिट्स'}
                </span>
                <span className="text-[10px] text-purple-300/80">
                  {language === 'en' ? 'Never expires with active plan' : 'सक्रिय प्लान के साथ कभी समाप्त नहीं होते'}
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                <span className="text-[11px] text-purple-200 block">
                  {language === 'en' ? 'Total Available' : 'कुल उपलब्ध'}
                </span>
                <span className="text-base font-bold text-emerald-300 mt-0.5 block">
                  {creditsInfo.totalAvailable.toLocaleString()} {language === 'en' ? 'Credits' : 'क्रेडिट्स'}
                </span>
                <span className="text-[10px] text-purple-300/80">
                  {language === 'en' ? 'Ready for AI generations' : 'सभी AI फीचर्स के लिए तैयार'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Overview Stats (4 Cards matching poster) */}
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

        {/* Transparent AI Operation Pricing Explainer */}
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

        {/* Auditable Recent Usage Ledger */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {language === 'en' ? 'Recent Usage Ledger' : 'उपयोग का बहीखाता'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'en'
                  ? 'Transparent, tamper-proof history of every credit deduction and grant.'
                  : 'प्रत्येक क्रेडिट उपयोग और टॉप-अप का प्रामाणिक रिकॉर्ड।'}
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {creditsInfo.recentLedger.map((item) => (
              <div key={item.id} className="py-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {getOperationIcon(item.operationType)}
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                      {item.description}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span>{item.timestamp}</span>
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
    </div>
  );
};
