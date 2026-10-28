import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useRole } from '../../context/RoleContext';
import { DEMO_SUBSCRIPTION_PLANS } from '../../data/mockData';
import { SubscriptionPlan, PlanTier } from '../../types';
import {
  Crown,
  Check,
  X as XIcon,
  Sparkles,
  Zap,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
  AlertTriangle,
  Gift,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';

export const SubscriptionPlansPage: React.FC = () => {
  const { language } = useLanguage();
  const {
    subscription,
    updateSubscription,
    refreshState
  } = useRole();
  const navigate = useNavigate();

  // Billing Cycle Toggle: monthly vs yearly
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Plan Selection for Modal
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<SubscriptionPlan | null>(null);
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponApplied, setCouponApplied] = useState<boolean>(false);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isProcessingUpgrade, setIsProcessingUpgrade] = useState<boolean>(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<boolean>(false);

  // Cancellation Modal State
  const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);
  const [cancelFeedback, setCancelFeedback] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApplyCoupon = () => {
    setCouponError(null);
    if (!couponCode.trim()) return;

    if (couponCode.trim().toUpperCase() === 'LAUNCH20') {
      setCouponApplied(true);
      setCouponDiscount(0.20);
      showToast(language === 'en' ? 'Coupon LAUNCH20 applied: 20% discount!' : 'कूपन लागू हुआ: 20% की छूट!');
    } else {
      setCouponError(language === 'en' ? 'Invalid coupon code. Try "LAUNCH20"' : 'अमान्य कूपन कोड। "LAUNCH20" का प्रयास करें');
    }
  };

  const handleConfirmPlanSwitch = () => {
    if (!selectedPlanForCheckout) return;

    setIsProcessingUpgrade(true);
    setTimeout(() => {
      const planPrice = billingCycle === 'yearly'
        ? selectedPlanForCheckout.priceYearly
        : selectedPlanForCheckout.priceMonthly;
      const discountedPrice = couponApplied ? Math.round(planPrice * (1 - couponDiscount)) : planPrice;

      updateSubscription({
        planId: selectedPlanForCheckout.tier,
        planName: selectedPlanForCheckout.name,
        billingCycle,
        amount: discountedPrice,
        status: 'active',
        cancelAtPeriodEnd: false
      });

      setIsProcessingUpgrade(false);
      setCheckoutSuccess(true);
      refreshState();
    }, 1500);
  };

  const handleCancelSubscription = () => {
    updateSubscription({
      status: 'active',
      cancelAtPeriodEnd: true
    });
    setIsCancelModalOpen(false);
    showToast(
      language === 'en'
        ? 'Subscription will cancel at the end of the billing period. You retain access until then.'
        : 'सब्सक्रिप्शन अवधि समाप्त होने पर रद्द हो जाएगा। तब तक आपका एक्सेस जारी रहेगा।'
    );
    refreshState();
  };

  // Comparison feature list items
  const comparisonFeatures = [
    { name: language === 'en' ? 'Monthly AI Credits' : 'मासिक एआई क्रेडिट्स', free: '100 / mo', pro: '1,000 / mo', business: '5,000 / mo' },
    { name: language === 'en' ? 'Business Profiles' : 'बिजनेस प्रोफाइल्स', free: '2 Profiles', pro: '5 Profiles', business: '20 Profiles' },
    { name: language === 'en' ? 'All Script & Reel Templates' : 'सभी टेम्पलेट्स', free: false, pro: true, business: true },
    { name: language === 'en' ? 'HD 1080p Video Studio Exports' : 'HD वीडियो एक्सपोर्ट', free: false, pro: true, business: true },
    { name: language === 'en' ? 'Advanced AI Script Engines' : 'उन्नत AI इंजन', free: false, pro: true, business: true },
    { name: language === 'en' ? 'Watermark Free Videos & Graphics' : 'बिना वॉटरमार्क एक्सपोर्ट', free: false, pro: true, business: true },
    { name: language === 'en' ? 'Custom Brand Kit & Fonts' : 'कस्टम ब्रांड किट', free: false, pro: true, business: true },
    { name: language === 'en' ? 'Priority Generation Speed' : 'प्राथमिकता गति', free: false, pro: true, business: true },
    { name: language === 'en' ? 'Team Collaboration (5 Seats)' : 'टीम सहयोग (5 सीटें)', free: false, pro: false, business: true },
    { name: language === 'en' ? '24/7 Dedicated Support' : '24/7 डेडिकेटेड सपोर्ट', free: false, pro: false, business: true },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 lg:pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#0B132B] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white border-b border-slate-200/80 sticky top-16 z-20 backdrop-blur-md bg-white/90">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Crown className="w-6 h-6 text-amber-500 fill-amber-500" />
              <span>{language === 'en' ? 'Plans & Subscriptions' : 'प्लान्स और सब्सक्रिप्शन'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {language === 'en'
                ? 'Choose the right plan for your content workflow. Upgrade or downgrade anytime.'
                : 'अपने कंटेंट वर्कफ़्लो के अनुसार सही प्लान चुनें। कभी भी अपग्रेड या बदल सकते हैं।'}
            </p>
          </div>

          {/* Billing Cycle Switch */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-center shrink-0">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {language === 'en' ? 'Monthly' : 'मासिक'}
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{language === 'en' ? 'Annual' : 'वार्षिक'}</span>
              <span className="px-1.5 py-0.5 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 rounded-md">
                {language === 'en' ? 'Save 20%' : '20% बचत'}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
        {/* Current Active Plan Status Banner */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Crown className="w-6 h-6 fill-amber-500 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {language === 'en' ? 'Current Plan' : 'वर्तमान प्लान'}
                </span>
                <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                  subscription.status === 'active'
                    ? subscription.cancelAtPeriodEnd
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {subscription.cancelAtPeriodEnd
                    ? (language === 'en' ? 'Cancels at Period End' : 'अवधि अंत पर समाप्त')
                    : (language === 'en' ? 'Active' : 'सक्रिय')}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                {subscription.planName}
                <span className="text-sm font-semibold text-slate-500 ml-2">
                  (₹{subscription.amount.toLocaleString()} / {subscription.billingCycle})
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {subscription.cancelAtPeriodEnd
                  ? (language === 'en'
                      ? `Access continues until ${subscription.renewalDate}. You will not be billed again.`
                      : `आपका एक्सेस ${subscription.renewalDate} तक रहेगा। दोबारा बिलिंग नहीं होगी।`)
                  : (language === 'en'
                      ? `Renews automatically on ${subscription.renewalDate} (${subscription.billingCycle} cycle)`
                      : `स्वतः नवीनीकरण: ${subscription.renewalDate}`)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/user/billing')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition-all"
            >
              {language === 'en' ? 'Billing History' : 'बिलिंग इतिहास'}
            </button>
            {!subscription.cancelAtPeriodEnd && subscription.planId !== 'free' && (
              <button
                onClick={() => setIsCancelModalOpen(true)}
                className="px-3 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-xs font-bold rounded-xl transition-colors"
              >
                {language === 'en' ? 'Cancel Plan' : 'प्लान रद्द करें'}
              </button>
            )}
          </div>
        </div>

        {/* 3 Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DEMO_SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrentPlan = subscription.planId === plan.tier;
            const price = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
            const displayPeriod = billingCycle === 'yearly'
              ? (language === 'en' ? '/ year' : '/ वर्ष')
              : (language === 'en' ? '/ month' : '/ माह');

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 transition-all flex flex-col justify-between ${
                  plan.isPopular
                    ? 'bg-gradient-to-b from-blue-50/50 to-white border-2 border-blue-600 shadow-xl shadow-blue-500/10'
                    : 'bg-white border border-slate-200/90 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Popular Pill Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-extrabold rounded-full uppercase tracking-wider shadow-md">
                    {language === 'en' ? 'Most Popular' : 'सबसे लोकप्रिय'}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                    {isCurrentPlan && (
                      <span className="px-2.5 py-0.5 text-[11px] font-extrabold bg-blue-100 text-blue-700 rounded-full">
                        {language === 'en' ? 'Current' : 'वर्तमान'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{plan.description}</p>

                  <div className="mt-5 mb-5 pb-5 border-b border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                        ₹{price.toLocaleString()}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {displayPeriod}
                      </span>
                    </div>
                    {billingCycle === 'yearly' && price > 0 && (
                      <span className="text-[11px] text-emerald-600 font-bold block mt-1">
                        {language === 'en' ? 'Includes 2 months free!' : '2 महीने का मुफ़्त लाभ शामिल!'}
                      </span>
                    )}
                  </div>

                  {/* Highlights */}
                  <div className="space-y-3 mb-6 text-xs text-slate-700">
                    <div className="flex items-center gap-2.5 font-bold text-slate-900">
                      <Zap className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                      <span>{plan.creditsPerMonth.toLocaleString()} {language === 'en' ? 'AI Credits / mo' : 'क्रेडिट्स / माह'}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 stroke-[2.5] shrink-0" />
                      <span>{plan.businessProfilesAllowed} {language === 'en' ? 'Business Profiles' : 'बिजनेस प्रोफाइल्स'}</span>
                    </div>

                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 stroke-[2.5] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA Button */}
                <button
                  disabled={isCurrentPlan}
                  onClick={() => {
                    setSelectedPlanForCheckout(plan);
                    setCouponApplied(false);
                    setCouponCode('');
                    setCouponDiscount(0);
                    setCouponError(null);
                    setCheckoutSuccess(false);
                  }}
                  className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm ${
                    isCurrentPlan
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : plan.isPopular
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/20 active:scale-95'
                      : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-95'
                  }`}
                >
                  {isCurrentPlan
                    ? (language === 'en' ? 'Current Active Plan' : 'सक्रिय प्लान')
                    : (language === 'en' ? `Choose ${plan.name}` : `${plan.name} चुनें`)}
                </button>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Matrix */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm overflow-hidden">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">
              {language === 'en' ? 'Full Plan Feature Comparison' : 'सभी फीचर्स की तुलना'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'en'
                ? 'Compare allowances, export options, and AI capabilities across every tier.'
                : 'सभी प्लान्स की क्षमताओं, क्रेडिट्स और एक्सपोर्ट विकल्पों की विस्तृत तुलना।'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-3 px-4 font-bold text-slate-700">
                    {language === 'en' ? 'Feature' : 'फ़ीचर'}
                  </th>
                  <th className="py-3 px-4 text-center font-bold text-slate-700">Free</th>
                  <th className="py-3 px-4 text-center font-bold text-blue-600 bg-blue-50/50 rounded-t-xl">Pro (Most Popular)</th>
                  <th className="py-3 px-4 text-center font-bold text-slate-700">Business</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparisonFeatures.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {row.name}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-600">
                      {typeof row.free === 'boolean' ? (
                        row.free ? (
                          <Check className="w-4 h-4 text-emerald-600 stroke-[2.5] mx-auto" />
                        ) : (
                          <XIcon className="w-4 h-4 text-slate-300 mx-auto" />
                        )
                      ) : (
                        row.free
                      )}
                    </td>
                    <td className="py-3 px-4 text-center text-blue-900 font-medium bg-blue-50/30">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? (
                          <Check className="w-4 h-4 text-emerald-600 stroke-[2.5] mx-auto" />
                        ) : (
                          <XIcon className="w-4 h-4 text-slate-300 mx-auto" />
                        )
                      ) : (
                        row.pro
                      )}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-800 font-semibold">
                      {typeof row.business === 'boolean' ? (
                        row.business ? (
                          <Check className="w-4 h-4 text-emerald-600 stroke-[2.5] mx-auto" />
                        ) : (
                          <XIcon className="w-4 h-4 text-slate-300 mx-auto" />
                        )
                      ) : (
                        row.business
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Plan Checkout & Confirmation Modal */}
      {selectedPlanForCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedPlanForCheckout(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <XIcon className="w-5 h-5" />
            </button>

            {checkoutSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-in zoom-in">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {language === 'en' ? 'Plan Updated Successfully!' : 'प्लान सफलतापूर्वक अपडेट हुआ!'}
                </h3>
                <p className="text-sm text-slate-600 mt-1 max-w-sm mx-auto">
                  {language === 'en'
                    ? `You are now on the ${selectedPlanForCheckout.name}. Your monthly allowance and entitlements have been updated.`
                    : `आपका प्लान अब ${selectedPlanForCheckout.name} में अपग्रेड हो गया है।`}
                </p>

                <div className="mt-5 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5 max-w-md mx-auto">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Plan:</span>
                    <span className="font-semibold text-slate-800">{selectedPlanForCheckout.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Monthly AI Credits:</span>
                    <span className="font-bold text-emerald-600">{selectedPlanForCheckout.creditsPerMonth.toLocaleString()} cr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Billing Cycle:</span>
                    <span className="font-semibold text-slate-800 capitalize">{billingCycle}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPlanForCheckout(null)}
                  className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md"
                >
                  {language === 'en' ? 'Done & Return to Dashboard' : 'पूर्ण हुआ'}
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Crown className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <h3 className="text-lg font-bold text-slate-900">
                    {language === 'en' ? 'Confirm Plan Change' : 'प्लान बदलने की पुष्टि'}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mb-5">
                  {language === 'en'
                    ? `Upgrading to ${selectedPlanForCheckout.name} (${billingCycle} billing).`
                    : `${selectedPlanForCheckout.name} में बदलाव की पुष्टि करें।`}
                </p>

                {/* Plan Summary Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-4 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 text-sm">{selectedPlanForCheckout.name}</span>
                    <span className="font-extrabold text-blue-600 text-sm">
                      ₹{billingCycle === 'yearly' ? selectedPlanForCheckout.priceYearly : selectedPlanForCheckout.priceMonthly} / {billingCycle}
                    </span>
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Includes {selectedPlanForCheckout.creditsPerMonth.toLocaleString()} AI credits/month and {selectedPlanForCheckout.businessProfilesAllowed} Business Profiles.
                  </div>
                </div>

                {/* Coupon Code Section */}
                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {language === 'en' ? 'Have a Coupon Code?' : 'कूपन कोड है?'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="e.g. LAUNCH20"
                      disabled={couponApplied}
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs uppercase font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponApplied}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50"
                    >
                      {couponApplied ? 'Applied' : 'Apply'}
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
                  {couponApplied && (
                    <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5" />
                      <span>20% Launch Discount Applied!</span>
                    </p>
                  )}
                </div>

                {/* Tax Breakdown */}
                {(() => {
                  const basePlanPrice = billingCycle === 'yearly'
                    ? selectedPlanForCheckout.priceYearly
                    : selectedPlanForCheckout.priceMonthly;
                  const discountVal = couponApplied ? Math.round(basePlanPrice * couponDiscount) : 0;
                  const subtotal = basePlanPrice - discountVal;
                  const gst = Math.round(subtotal - subtotal / 1.18);
                  const netBase = subtotal - gst;

                  return (
                    <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs space-y-1.5 mb-5">
                      <div className="flex justify-between text-slate-600">
                        <span>Plan Price ({billingCycle}):</span>
                        <span className="font-semibold text-slate-800">₹{basePlanPrice}</span>
                      </div>
                      {couponApplied && (
                        <div className="flex justify-between text-emerald-600 font-semibold">
                          <span>Discount (LAUNCH20 - 20%):</span>
                          <span>-₹{discountVal}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-slate-600">
                        <span>Base Amount (Net):</span>
                        <span className="font-semibold text-slate-800">₹{netBase}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>GST (18% inclusive):</span>
                        <span className="font-semibold text-slate-800">₹{gst}</span>
                      </div>
                      <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900 text-sm">
                        <span>Total Payable:</span>
                        <span className="text-blue-600">₹{subtotal}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Test Mode Banner */}
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 mb-5 flex items-start gap-2.5 text-xs text-amber-900">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Verified Test Gateway: </span>
                    <span>
                      Order is processed through developer sandbox verification. No real money will be charged.
                    </span>
                  </div>
                </div>

                <button
                  disabled={isProcessingUpgrade}
                  onClick={handleConfirmPlanSwitch}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessingUpgrade ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{language === 'en' ? 'Verifying & Activating Plan...' : 'प्लान सक्रिय किया जा रहा है...'}</span>
                    </>
                  ) : (
                    <span>{language === 'en' ? 'Confirm & Activate Plan' : 'पुष्टि करें और प्लान शुरू करें'}</span>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center">
              {language === 'en' ? 'Cancel Subscription?' : 'क्या आप सदस्यता रद्द करना चाहते हैं?'}
            </h3>
            <p className="text-xs text-slate-600 text-center mt-1">
              {language === 'en'
                ? `Your ${subscription.planName} benefits will remain active until ${subscription.renewalDate}. After that date, your account will downgrade to Free Starter.`
                : `आपके लाभ ${subscription.renewalDate} तक चालू रहेंगे। उसके बाद खाता फ्री प्लान में बदल जाएगा।`}
            </p>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {language === 'en' ? 'Tell us why you are leaving (optional)' : 'कारण बताएं (वैकल्पिक)'}
              </label>
              <textarea
                value={cancelFeedback}
                onChange={(e) => setCancelFeedback(e.target.value)}
                placeholder="Too expensive, missing features, etc..."
                rows={2}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                {language === 'en' ? 'Keep My Plan' : 'प्लान बनाए रखें'}
              </button>
              <button
                onClick={handleCancelSubscription}
                className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                {language === 'en' ? 'Confirm Cancellation' : 'रद्द करने की पुष्टि करें'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
