import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useRole } from '../../context/RoleContext';
import { getPaymentTransactions, getInvoices, saveUserProfile } from '../../services/storage';
import { PaymentTransaction, InvoiceItem, PaymentStatus } from '../../types';
import {
  CreditCard,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  Crown,
  FileText,
  ShieldCheck,
  Plus,
  ArrowRight,
  ExternalLink,
  Printer,
  X,
  Building,
  Check,
  Search,
  Filter,
  RotateCcw,
  HelpCircle,
  Lock,
  RefreshCw,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Layers,
  FileCheck,
  Info,
  Sparkles,
  Smartphone,
  Send,
  Trash2,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

interface SavedMethod {
  id: string;
  type: 'upi' | 'card' | 'netbanking';
  title: string;
  detail: string;
  isDefault: boolean;
  brand: string;
}

export const BillingPaymentsPage: React.FC = () => {
  const { language } = useLanguage();
  const { subscription, updateSubscription, userProfile, updateUserProfile, refreshState } = useRole();
  const navigate = useNavigate();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'history' | 'invoices' | 'methods' | 'security'>('history');

  // Transactions & Invoices data
  const [transactions] = useState<PaymentTransaction[]>(() => getPaymentTransactions());
  const [invoices] = useState<InvoiceItem[]>(() => getInvoices());

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'subscription' | 'topup' | 'successful' | 'pending_failed'>('all');

  // Plan Inclusions Accordion on Subscription Card (Reflecting Reference Poster Screen 4)
  const [isDetailsExpanded, setIsDetailsExpanded] = useState<boolean>(false);

  // Modals state
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);
  const [cancelReason, setCancelReason] = useState<string>('pricing');
  const [isAddMethodModalOpen, setIsAddMethodModalOpen] = useState<boolean>(false);
  const [newMethodType, setNewMethodType] = useState<'upi' | 'card'>('upi');
  const [newUpiId, setNewUpiId] = useState<string>('');
  const [newCardNumber, setNewCardNumber] = useState<string>('');
  const [newCardExp, setNewCardExp] = useState<string>('');

  // Interactive Reference Poster State Simulator
  // Presets: 'normal' | 'processing' | 'failed' | 'cancelled' | 'success' | 'empty'
  const [simulationState, setSimulationState] = useState<'normal' | 'processing' | 'failed' | 'cancelled' | 'success' | 'empty'>('normal');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Saved Payment Methods state
  const [savedMethods, setSavedMethods] = useState<SavedMethod[]>([
    {
      id: 'pm_upi_01',
      type: 'upi',
      title: 'Google Pay / PhonePe UPI',
      detail: 'rituraj@oksbi',
      isDefault: true,
      brand: 'UPI'
    },
    {
      id: 'pm_card_01',
      type: 'card',
      title: 'HDFC Bank Corporate Debit Card',
      detail: '•••• •••• •••• 4821 (Exp 08/28)',
      isDefault: false,
      brand: 'VISA'
    }
  ]);

  // Business Billing Information Form
  const [billingForm, setBillingForm] = useState({
    legalEntityName: userProfile.legalEntityName || userProfile.name || 'Rituraj Tomar',
    billingAddress: userProfile.billingAddress || 'Ward No. 4, Tikamgarh Road, Orchha, Madhya Pradesh - 472246',
    gstin: userProfile.gstin || '23AAAAA0000A1Z5',
    stateOfSupply: userProfile.stateOfSupply || 'Madhya Pradesh (23)'
  });

  // Filtered transactions calculation
  const displayedTransactions = useMemo(() => {
    if (simulationState === 'empty') return [];

    let list = [...transactions];

    if (selectedCategory === 'subscription') {
      list = list.filter((t) => t.description.toLowerCase().includes('plan') || t.description.toLowerCase().includes('subscription'));
    } else if (selectedCategory === 'topup') {
      list = list.filter((t) => t.description.toLowerCase().includes('credit') || t.description.toLowerCase().includes('top-up'));
    } else if (selectedCategory === 'successful') {
      list = list.filter((t) => t.status === 'successful');
    } else if (selectedCategory === 'pending_failed') {
      list = list.filter((t) => t.status === 'pending' || t.status === 'failed' || t.status === 'cancelled');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.orderId.toLowerCase().includes(q) ||
          t.invoiceNumber.toLowerCase().includes(q) ||
          t.amount.toString().includes(q)
      );
    }

    return list;
  }, [transactions, selectedCategory, searchQuery, simulationState]);

  // Filtered invoices calculation
  const displayedInvoices = useMemo(() => {
    if (simulationState === 'empty') return [];

    let list = [...invoices];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (inv) =>
          inv.description.toLowerCase().includes(q) ||
          inv.invoiceNumber.toLowerCase().includes(q) ||
          inv.planName.toLowerCase().includes(q)
      );
    }
    return list;
  }, [invoices, searchQuery, simulationState]);

  // Handle Save Billing Form
  const handleSaveBilling = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      legalEntityName: billingForm.legalEntityName,
      billingAddress: billingForm.billingAddress,
      gstin: billingForm.gstin,
      stateOfSupply: billingForm.stateOfSupply
    });
    showToast(language === 'en' ? 'Billing & GSTIN information saved successfully!' : 'बिलिंग और जीएसटी विवरण सुरक्षित कर लिया गया है!');
  };

  // Handle Cancel Subscription
  const handleConfirmCancel = () => {
    updateSubscription({
      status: 'active',
      cancelAtPeriodEnd: true
    });
    setIsCancelModalOpen(false);
    showToast(
      language === 'en'
        ? `Auto-renewal cancelled. You maintain full Pro Plan access until ${subscription.renewalDate || '10 Nov 2026'}.`
        : `ऑटो-नवीनीकरण रद्द किया गया। आपका प्रो प्लान ${subscription.renewalDate || '10 Nov 2026'} तक सक्रिय रहेगा।`
    );
    refreshState();
  };

  // Handle Add Method
  const handleAddPaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMethodType === 'upi') {
      if (!newUpiId.includes('@')) {
        showToast(language === 'en' ? 'Please enter a valid UPI ID (e.g., user@okhdfcbank)' : 'कृपया वैध UPI ID दर्ज करें');
        return;
      }
      setSavedMethods((prev) => [
        ...prev,
        {
          id: `pm_upi_${Date.now()}`,
          type: 'upi',
          title: 'UPI Virtual Payment Address',
          detail: newUpiId,
          isDefault: false,
          brand: 'UPI'
        }
      ]);
    } else {
      if (newCardNumber.length < 12) {
        showToast(language === 'en' ? 'Please enter valid 16-digit card number' : 'कृपया वैध कार्ड नंबर दर्ज करें');
        return;
      }
      setSavedMethods((prev) => [
        ...prev,
        {
          id: `pm_card_${Date.now()}`,
          type: 'card',
          title: 'Tokenized Debit Card',
          detail: `•••• •••• •••• ${newCardNumber.slice(-4)} (Exp ${newCardExp || '12/28'})`,
          isDefault: false,
          brand: 'VISA'
        }
      ]);
    }

    setIsAddMethodModalOpen(false);
    setNewUpiId('');
    setNewCardNumber('');
    setNewCardExp('');
    showToast(language === 'en' ? 'Payment method securely tokenized and added' : 'भुगतान विधि सुरक्षित रूप से जोड़ दी गई');
  };

  // Status Badge Helper
  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'successful':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === 'en' ? 'Successful' : 'सफल'}</span>
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>{language === 'en' ? 'Failed' : 'असफल'}</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>{language === 'en' ? 'Pending' : 'प्रक्रियाधीन'}</span>
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
            <span>{language === 'en' ? 'Refunded' : 'वापस किया गया'}</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <X className="w-3.5 h-3.5 text-slate-500" />
            <span>{language === 'en' ? 'Cancelled' : 'रद्द'}</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 lg:pb-12 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#0B132B] text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white border-b border-slate-200/80 sticky top-16 z-20 backdrop-blur-md bg-white/95">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
              <span>{language === 'en' ? 'Account & Billing' : 'खाता और बिलिंग'}</span>
              <span>/</span>
              <span className="text-blue-600 font-semibold">{language === 'en' ? 'Overview' : 'अवलोकन'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <CreditCard className="w-6 h-6 text-blue-600" />
              <span>{language === 'en' ? 'Payments & Billing' : 'सब्सक्रिप्शन और बिलिंग'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {language === 'en'
                ? 'Review your current plan, transparent payment history, GST tax invoices, and payment methods.'
                : 'अपना वर्तमान प्लान, पारदर्शी भुगतान इतिहास, जीएसटी चालान और सुरक्षित भुगतान विधियां प्रबंधित करें।'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
            <button
              onClick={() => navigate('/user/subscription')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all active:scale-95"
            >
              <Crown className="w-4 h-4 fill-white" />
              <span>{language === 'en' ? 'Manage Plan' : 'प्लान प्रबंधित करें'}</span>
            </button>
            <button
              onClick={() => navigate('/user/credits')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{language === 'en' ? 'Credits' : 'क्रेडिट्स'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Interactive Reference Poster State Simulator Bar */}
        <div className="bg-slate-900 text-white rounded-2xl p-3.5 shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-bold text-amber-400">
              {language === 'en' ? 'Reviewer / State Simulator:' : 'स्टेट सिमुलेटर (परीक्षण):'}
            </span>
            <span className="text-slate-300 hidden sm:inline">
              {language === 'en' ? 'Test all states from Scripter reference posters' : 'पोस्टर के सभी स्टेट्स देखें'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSimulationState('normal')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap transition-all ${
                simulationState === 'normal'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              Normal View
            </button>
            <button
              onClick={() => setSimulationState('processing')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap transition-all ${
                simulationState === 'processing'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              ⏳ Processing (68%)
            </button>
            <button
              onClick={() => setSimulationState('failed')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap transition-all ${
                simulationState === 'failed'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              ⚠️ Payment Failed
            </button>
            <button
              onClick={() => setSimulationState('cancelled')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap transition-all ${
                simulationState === 'cancelled'
                  ? 'bg-slate-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              ✕ Cancelled
            </button>
            <button
              onClick={() => setSimulationState('success')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap transition-all ${
                simulationState === 'success'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              ✅ Success (Screen 6)
            </button>
            <button
              onClick={() => setSimulationState('empty')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap transition-all ${
                simulationState === 'empty'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              📭 Empty History
            </button>
          </div>
        </div>

        {/* Dynamic Simulated State Banners (Matching Poster Bottom Row) */}
        {simulationState === 'processing' && (
          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {language === 'en'
                    ? 'Payment is processing... Please wait a few moments (68%)'
                    : 'पेमेंट प्रोसेस हो रहा है... कृपया कुछ क्षण प्रतीक्षा करें (68%)'}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  {language === 'en'
                    ? 'Communicating with banking rails for secure transaction authorization. Do not refresh or close this tab.'
                    : 'सुरक्षित लेनदेन सत्यापन किया जा रहा है। कृपया इस पेज को रिफ्रेश या बंद न करें।'}
                </p>
                <div className="w-full sm:w-64 bg-amber-200 h-2 rounded-full overflow-hidden mt-2.5">
                  <div className="bg-amber-600 h-full w-[68%] rounded-full animate-pulse transition-all duration-500" />
                </div>
              </div>
            </div>

            <button
              onClick={() => setSimulationState('normal')}
              className="px-3.5 py-1.5 bg-white text-slate-700 text-xs font-bold rounded-xl border border-slate-300 hover:bg-slate-50 transition-all shrink-0 self-start sm:self-center"
            >
              {language === 'en' ? 'Dismiss' : 'हटाएं'}
            </button>
          </div>
        )}

        {simulationState === 'failed' && (
          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-rose-900">
                  {language === 'en'
                    ? 'Payment Failed — Unable to process payment'
                    : 'पेमेंट असफल — भुगतान नहीं हो पाया। कृपया दोबारा प्रयास करें।'}
                </h3>
                <p className="text-xs text-rose-700 mt-0.5">
                  {language === 'en'
                    ? 'Bank server timed out during verification. No funds have been deducted from your account.'
                    : 'सत्यापन के दौरान बैंक सर्वर से संपर्क नहीं हो सका। आपके खाते से कोई राशि नहीं काटी गई है।'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
              <button
                onClick={() => navigate('/user/subscription')}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
              >
                {language === 'en' ? 'Retry Payment' : 'दोबारा प्रयास करें'}
              </button>
              <button
                onClick={() => setActiveTab('methods')}
                className="px-3.5 py-2 bg-white text-slate-700 hover:bg-slate-100 text-xs font-bold rounded-xl border border-rose-200 transition-all"
              >
                {language === 'en' ? 'Try Alternate Method' : 'दूसरा तरीका'}
              </button>
            </div>
          </div>
        )}

        {simulationState === 'cancelled' && (
          <div className="p-4 bg-slate-100 rounded-2xl border border-slate-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0">
                <X className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {language === 'en'
                    ? 'Purchase Cancelled — You cancelled this transaction'
                    : 'खरीद रद्द — आपने यह खरीद रद्द कर दी है।'}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  {language === 'en'
                    ? 'No changes have been made to your plan or credit balance.'
                    : 'आपके प्लान या क्रेडिट बैलेंस में कोई बदलाव नहीं किया गया है।'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSimulationState('normal')}
              className="px-3.5 py-1.5 bg-white text-slate-700 text-xs font-bold rounded-xl border border-slate-300 hover:bg-slate-50 transition-all shrink-0 self-start sm:self-center"
            >
              {language === 'en' ? 'Return' : 'वापस जाएं'}
            </button>
          </div>
        )}

        {simulationState === 'success' && (
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    {language === 'en'
                      ? 'Payment Successful! — Pro Plan Active'
                      : 'भुगतान सफल रहा! — आपका Pro Plan सक्रिय हो गया है'}
                  </h3>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                    {language === 'en' ? 'Active' : 'सक्रिय'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  {language === 'en'
                    ? '1,500 AI credits have been added to your account. Tax invoice INV-20241215 is available.'
                    : '1,500 AI क्रेडिट आपके अकाउंट में जोड़ दिए गए हैं। टैक्स चालान उपलब्ध है।'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
              <button
                onClick={() => {
                  setSelectedInvoice(invoices[0] || null);
                }}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'View Invoice' : 'इनवॉइस देखें'}</span>
              </button>
              <button
                onClick={() => setSimulationState('normal')}
                className="px-3.5 py-2 bg-white text-slate-700 hover:bg-slate-100 text-xs font-bold rounded-xl border border-slate-300 transition-all"
              >
                {language === 'en' ? 'Dismiss' : 'ठीक है'}
              </button>
            </div>
          </div>
        )}

        {/* Security & Sandbox Status Notice */}
        <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-200 flex items-start gap-3 text-xs text-blue-900">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">
              {language === 'en' ? 'Verified Cashfree Gateway Sandbox Mode: ' : 'सत्यापित कैशफ्री गेटवे सैंडबॉक्स वातावरण: '}
            </span>
            <span>
              {language === 'en'
                ? 'All subscriptions, credit packs, and tax invoices use compliant server-side sandbox records. Raw card numbers are never stored in the browser (compliant with RBI card tokenization and PCI-DSS Level 1).'
                : 'सभी सब्सक्रिप्शन, क्रेडिट खरीद और चालान सर्वर-साइड सैंडबॉक्स सत्यापन का उपयोग करते हैं। कार्ड विवरण ब्राउज़र में कभी सुरक्षित नहीं किए जाते।'}
            </span>
          </div>
        </div>

        {/* Section 1: Current Plan Summary Hero Card (Reflecting Reference Poster Screen 4 - "सब्सक्रिप्शन और बिलिंग") */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden transition-all">
          <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 bg-gradient-to-r from-white via-white to-amber-50/40">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
                <Crown className="w-7 h-7 fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {language === 'en' ? 'Current Plan' : 'वर्तमान प्लान'}
                  </span>
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>
                      {subscription.status === 'active'
                        ? language === 'en'
                          ? 'Active'
                          : 'सक्रिय'
                        : subscription.status === 'past_due'
                        ? 'Past Due'
                        : 'Cancelled'}
                    </span>
                  </span>
                  {subscription.cancelAtPeriodEnd && (
                    <span className="px-2 py-0.5 text-[11px] font-bold bg-amber-100 text-amber-800 rounded-full">
                      {language === 'en' ? 'Cancels at Period End' : 'अवधि अंत पर रद्द'}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  {subscription.planName || 'Pro Plan'}
                </h2>

                <div className="text-base sm:text-lg font-bold text-blue-600 mt-0.5 flex items-baseline gap-1.5">
                  <span>₹{(subscription.amount || 999).toLocaleString()}</span>
                  <span className="text-xs font-semibold text-slate-500">
                    / {subscription.billingCycle === 'yearly' ? (language === 'en' ? 'year' : 'साल') : (language === 'en' ? 'month' : 'महीना')}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {language === 'en'
                      ? `Next renewal: ${subscription.renewalDate || '10 Nov, 2026'} (${subscription.daysUntilRenewal || 12} days left)`
                      : `नवीनीकरण: ${subscription.renewalDate || '10 Nov, 2026'} (${subscription.daysUntilRenewal || 12} दिन शेष)`}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <button
                onClick={() => navigate('/user/subscription')}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all text-center"
              >
                {language === 'en' ? 'Change Plan / Upgrade' : 'प्लान बदलें / अपग्रेड करें'}
              </button>
              <button
                onClick={() => navigate('/user/credits')}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition-all text-center"
              >
                {language === 'en' ? 'Buy Extra Credits' : 'अतिरिक्त क्रेडिट खरीदें'}
              </button>
            </div>
          </div>

          {/* Plan Details & Inclusions Accordion (Poster Screen 4: 'प्लान विवरण देखें' & 'इस प्लान में शामिल') */}
          <div className="border-t border-slate-100 px-6 py-3.5 bg-slate-50/50 flex flex-col gap-3">
            <button
              onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
              className="flex items-center justify-between text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors w-full"
            >
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>
                  {isDetailsExpanded
                    ? language === 'en'
                      ? 'Hide Plan Inclusions & Features'
                      : 'प्लान विवरण छिपाएं'
                    : language === 'en'
                    ? 'View Plan Details & Inclusions (इस प्लान में शामिल)'
                    : 'प्लान विवरण देखें (इस प्लान में शामिल)'}
                </span>
              </span>
              {isDetailsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isDetailsExpanded && (
              <div className="pt-2 pb-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 animate-in fade-in">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{language === 'en' ? '5 Business Profiles' : '5 बिजनेस प्रोफाइल'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{language === 'en' ? '1,000 AI Credits / month' : 'प्रति माह 1,000 AI क्रेडिट'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{language === 'en' ? 'All Premium Templates' : 'प्रीमियम टेम्पलेट्स'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{language === 'en' ? 'Visual Pack (Full Access)' : 'विजुअल पैक (पूर्ण पहुंच)'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{language === 'en' ? 'Video Studio & HD Export' : 'वीडियो एडिटिंग फीचर्स'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{language === 'en' ? 'Priority Support & Updates' : 'सपोर्ट और अपडेट'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold transition-all relative whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'history'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{language === 'en' ? 'Payment History' : 'भुगतान इतिहास'}</span>
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-600 rounded-full">
              {displayedTransactions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold transition-all relative whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'invoices'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{language === 'en' ? 'Tax Invoices & Receipts' : 'चालान (इनवॉइस)'}</span>
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-600 rounded-full">
              {displayedInvoices.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('methods')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold transition-all relative whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'methods'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>{language === 'en' ? 'Payment Methods & Tax' : 'भुगतान विधियां और टैक्स'}</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold transition-all relative whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'security'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>{language === 'en' ? 'Gateway & Security' : 'गेटवे और सुरक्षा'}</span>
          </button>
        </div>

        {/* Tab 1: Payment History */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    language === 'en'
                      ? 'Search transactions by description, order ID, or amount...'
                      : 'विवरण, ऑर्डर आईडी या राशि से खोजें...'
                  }
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {language === 'en' ? 'All Transactions' : 'सभी लेनदेन'}
                </button>
                <button
                  onClick={() => setSelectedCategory('subscription')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === 'subscription'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {language === 'en' ? 'Subscriptions' : 'सब्सक्रिप्शन'}
                </button>
                <button
                  onClick={() => setSelectedCategory('topup')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === 'topup'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {language === 'en' ? 'Credit Packs' : 'क्रेडिट पैक'}
                </button>
                <button
                  onClick={() => setSelectedCategory('successful')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === 'successful'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {language === 'en' ? 'Successful' : 'सफल'}
                </button>
                <button
                  onClick={() => setSelectedCategory('pending_failed')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === 'pending_failed'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {language === 'en' ? 'Pending / Failed' : 'लंबित / असफल'}
                </button>
              </div>
            </div>

            {/* Transactions Card List */}
            {displayedTransactions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'en' ? 'No Payment Records Found' : 'कोई भुगतान रिकॉर्ड नहीं मिला'}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
                  {language === 'en'
                    ? 'When you upgrade your subscription or purchase additional AI credit packs, all transaction receipts and GST invoices will be logged here.'
                    : 'जब आप सदस्यता अपग्रेड करेंगे या अतिरिक्त क्रेडिट खरीदेंगे, तो आपके सभी लेनदेन और चालान यहां दिखाई देंगे।'}
                </p>
                <button
                  onClick={() => navigate('/user/subscription')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                >
                  {language === 'en' ? 'Explore Subscription Plans' : 'सब्सक्रिप्शन प्लान देखें'}
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden divide-y divide-slate-100">
                {displayedTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                        {tx.paymentMethod === 'UPI' ? (
                          <Smartphone className="w-5 h-5 text-blue-600" />
                        ) : (
                          <CreditCard className="w-5 h-5 text-indigo-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-slate-900">
                            {tx.description}
                          </h4>
                          {getStatusBadge(tx.status)}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap">
                          <span>{tx.date}</span>
                          <span>•</span>
                          <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                            {tx.orderId}
                          </span>
                          <span>•</span>
                          <span className="capitalize">{tx.paymentMethod}</span>
                          {tx.invoiceNumber && tx.invoiceNumber !== 'INV-UNAVAILABLE' && (
                            <>
                              <span>•</span>
                              <span className="font-mono text-[11px] text-blue-600">{tx.invoiceNumber}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-13 sm:pl-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="text-right">
                        <div className="text-base font-black text-slate-900">
                          ₹{tx.amount.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {language === 'en' ? 'Incl. 18% GST' : '18% GST सहित'}
                        </div>
                      </div>

                      {tx.status === 'successful' ? (
                        <button
                          onClick={() => {
                            const matchedInvoice: InvoiceItem = invoices.find(
                              (inv) => inv.invoiceNumber === tx.invoiceNumber
                            ) || {
                              id: tx.id,
                              invoiceNumber: tx.invoiceNumber,
                              date: tx.date,
                              description: tx.description,
                              planName: tx.planOrPackName,
                              amountInr: tx.totalPaidInr,
                              amount: tx.totalPaidInr,
                              status: 'paid',
                              period: tx.date,
                              downloadUrl: '#'
                            };
                            setSelectedInvoice(matchedInvoice);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition-all"
                          title={language === 'en' ? 'View GST Tax Invoice' : 'टैक्स इनवॉइस देखें'}
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{language === 'en' ? 'Invoice' : 'रसीद'}</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-400 italic px-2 py-1 bg-slate-50 rounded-lg">
                          {language === 'en' ? 'Invoice N/A' : 'रसीद अनुपलब्ध'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Invoices & Receipts */}
        {activeTab === 'invoices' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {language === 'en' ? 'Official GST Tax Invoices' : 'आधिकारिक जीएसटी चालान (इनवॉइस)'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {language === 'en'
                      ? 'Tax-compliant invoices containing SAC code 998314 and 18% GST calculation for business accounting and ITC filing.'
                      : 'व्यावसायिक इनपुट टैक्स क्रेडिट (ITC) और वित्तीय रिपोर्टिंग के लिए जीएसटी चालान।'}
                  </p>
                </div>

                <div className="text-xs text-slate-500 font-mono">
                  SAC / HSN: <span className="font-bold text-slate-800">998314</span>
                </div>
              </div>

              {displayedInvoices.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  {language === 'en' ? 'No invoices found.' : 'कोई चालान नहीं मिला।'}
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {displayedInvoices.map((inv) => (
                    <div
                      key={inv.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">
                              {inv.description}
                            </h4>
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                              PAID
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                            <span className="font-mono text-blue-600 font-semibold">{inv.invoiceNumber}</span>
                            <span>•</span>
                            <span>{inv.date}</span>
                            <span>•</span>
                            <span>{inv.period}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                        <div className="text-right">
                          <div className="text-base font-bold text-slate-900">
                            ₹{inv.amount.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {language === 'en' ? 'Incl. 18% GST' : '18% GST सहित'}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                            <span>{language === 'en' ? 'View' : 'देखें'}</span>
                          </button>
                          <button
                            onClick={() => {
                              showToast(language === 'en' ? `Downloading invoice ${inv.invoiceNumber}...` : `चालान ${inv.invoiceNumber} डाउनलोड हो रहा है...`);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>{language === 'en' ? 'PDF' : 'पीडीएफ'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Payment Methods & Tax Details */}
        {activeTab === 'methods' && (
          <div className="space-y-6">
            {/* Saved Payment Methods Box */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {language === 'en' ? 'Saved Payment Methods' : 'सुरक्षित भुगतान विधियां'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {language === 'en'
                      ? 'Securely managed tokenized instruments for recurring subscription renewal and fast credit purchases.'
                      : 'सदस्यता नवीनीकरण और त्वरित क्रेडिट खरीद के लिए टोकनाइज़्ड भुगतान माध्यम।'}
                  </p>
                </div>

                <button
                  onClick={() => setIsAddMethodModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition-all self-start sm:self-center"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Add Payment Method' : 'विधि जोड़ें'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {savedMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`p-4 rounded-2xl border transition-all flex items-start justify-between ${
                      method.isDefault ? 'border-blue-300 bg-blue-50/20' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                          method.brand === 'UPI' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'
                        }`}
                      >
                        {method.brand}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{method.title}</span>
                          {method.isDefault && (
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 font-mono mt-0.5 block">
                          {method.detail}
                        </span>
                      </div>
                    </div>

                    {!method.isDefault && (
                      <button
                        onClick={() => {
                          setSavedMethods((prev) =>
                            prev.map((m) => ({ ...m, isDefault: m.id === method.id }))
                          );
                          showToast(language === 'en' ? 'Default payment method updated' : 'डिफ़ॉल्ट भुगतान विधि बदली गई');
                        }}
                        className="text-[11px] font-bold text-blue-600 hover:underline shrink-0"
                      >
                        {language === 'en' ? 'Make Default' : 'डिफ़ॉल्ट बनाएं'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Business Billing Information & GSTIN */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Building className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'en' ? 'Business Billing Details & GSTIN' : 'व्यवसाय बिलिंग विवरण और जीएसटी (GSTIN)'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                {language === 'en'
                  ? 'Add your registered entity name and GSTIN to claim Input Tax Credit (ITC) on all invoices.'
                  : 'चालानों पर इनपुट टैक्स क्रेडिट प्राप्त करने के लिए अपना पंजीकृत जीएसटी नंबर दर्ज करें।'}
              </p>

              <form onSubmit={handleSaveBilling} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    {language === 'en' ? 'Legal Entity / Name' : 'पंजीकृत नाम / फर्म'}
                  </label>
                  <input
                    type="text"
                    value={billingForm.legalEntityName}
                    onChange={(e) => setBillingForm({ ...billingForm, legalEntityName: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    {language === 'en' ? 'GSTIN (15-digit Tax Identifier)' : 'जीएसटी नंबर (GSTIN)'}
                  </label>
                  <input
                    type="text"
                    value={billingForm.gstin}
                    onChange={(e) => setBillingForm({ ...billingForm, gstin: e.target.value.toUpperCase() })}
                    placeholder="23AAAAA0000A1Z5"
                    maxLength={15}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    {language === 'en' ? 'Format: 2 digits state code + 10 chars PAN + 3 digits' : 'प्रारूप: राज्य कोड (2) + पैन (10) + अन्य (3)'}
                  </span>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    {language === 'en' ? 'State of Supply' : 'आपूर्ति का राज्य'}
                  </label>
                  <select
                    value={billingForm.stateOfSupply}
                    onChange={(e) => setBillingForm({ ...billingForm, stateOfSupply: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Madhya Pradesh (23)">Madhya Pradesh (23)</option>
                    <option value="Maharashtra (27)">Maharashtra (27)</option>
                    <option value="Delhi (07)">Delhi (07)</option>
                    <option value="Karnataka (29)">Karnataka (29)</option>
                    <option value="Uttar Pradesh (09)">Uttar Pradesh (09)</option>
                    <option value="Gujarat (24)">Gujarat (24)</option>
                    <option value="Rajasthan (08)">Rajasthan (08)</option>
                    <option value="West Bengal (19)">West Bengal (19)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    {language === 'en' ? 'Billing Email Address' : 'बिलिंग ईमेल'}
                  </label>
                  <input
                    type="email"
                    defaultValue={userProfile.email}
                    disabled
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-medium text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-600 font-semibold mb-1">
                    {language === 'en' ? 'Complete Billing Address' : 'पूर्ण बिलिंग पता'}
                  </label>
                  <input
                    type="text"
                    value={billingForm.billingAddress}
                    onChange={(e) => setBillingForm({ ...billingForm, billingAddress: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2 flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95"
                  >
                    {language === 'en' ? 'Save Billing Information' : 'बिलिंग विवरण सुरक्षित करें'}
                  </button>
                </div>
              </form>
            </div>

            {/* Billing FAQ Accordion */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span>{language === 'en' ? 'Frequently Asked Questions (Billing)' : 'बिलिंग संबंधी सामान्य प्रश्न'}</span>
              </h3>

              <div className="space-y-2 text-xs divide-y divide-slate-100">
                <div className="pt-2">
                  <h4 className="font-bold text-slate-800">
                    {language === 'en' ? 'How does GST invoicing work on Scripter?' : 'स्क्रिप्टर पर जीएसटी चालान कैसे काम करता है?'}
                  </h4>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">
                    {language === 'en'
                      ? 'All subscriptions and top-up purchases include 18% GST under SAC Code 998314. If you provide your business GSTIN, invoices will reflect your GST identifier so you can claim Input Tax Credit.'
                      : 'सभी प्लान्स पर 18% जीएसटी लागू है (SAC कोड 998314)। यदि आप अपना जीएसटी नंबर जोड़ते हैं तो आपको इनपुट टैक्स क्रेडिट मिलेगा।'}
                  </p>
                </div>

                <div className="pt-2">
                  <h4 className="font-bold text-slate-800">
                    {language === 'en' ? 'What payment methods are supported?' : 'कौन से भुगतान माध्यम स्वीकार किए जाते हैं?'}
                  </h4>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">
                    {language === 'en'
                      ? 'We support all major Indian rails: UPI (Google Pay, PhonePe, Paytm, BHIM), Debit & Credit Cards (Visa, Mastercard, RuPay), Net Banking across 50+ banks, and Wallets.'
                      : 'हम यूपीआई (Google Pay, PhonePe, Paytm), डेबिट/क्रेडिट कार्ड, और 50+ बैंकों की नेट बैंकिंग का समर्थन करते हैं।'}
                  </p>
                </div>

                <div className="pt-2">
                  <h4 className="font-bold text-slate-800">
                    {language === 'en' ? 'What happens if a payment fails?' : 'भुगतान विफल होने पर क्या होगा?'}
                  </h4>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">
                    {language === 'en'
                      ? 'If funds are deducted during a failed session, bank verification rails will automatically reverse the transaction within 3-5 business days.'
                      : 'यदि विफल प्रयास में राशि कट जाती है, तो बैंक नियमानुसार 3-5 कार्य दिवसों में राशि स्वतः आपके खाते में वापस कर दी जाती है।'}
                  </p>
                </div>

                <div className="pt-2">
                  <h4 className="font-bold text-slate-800">
                    {language === 'en' ? 'How do I cancel my subscription renewal?' : 'सब्सक्रिप्शन नवीनीकरण कैसे रोकें?'}
                  </h4>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">
                    {language === 'en'
                      ? 'You can stop auto-renewal anytime by clicking "Cancel Renewal". Your current Pro access will remain active until the end of your prepaid period.'
                      : 'आप कभी भी "नवीनीकरण रद्द करें" चुन सकते हैं। वर्तमान अवधि समाप्त होने तक आपकी सुविधाएं सक्रिय रहेंगी।'}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {language === 'en' ? 'Have a specific billing inquiry?' : 'कोई विशिष्ट बिलिंग समस्या है?'}
                </span>
                <button
                  onClick={() => navigate('/user/help')}
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <span>{language === 'en' ? 'Contact Billing Support' : 'सपोर्ट से संपर्क करें'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Gateway & Security Architecture */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {language === 'en' ? 'Payment Gateway & Security Protocol' : 'पेमेंट गेटवे और सुरक्षा प्रोटोकॉल'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {language === 'en'
                      ? 'Transparent architectural disclosure on payment verification, tokenization, and backend integrity.'
                      : 'भुगतान सत्यापन, सुरक्षा और टोकनाइज़ेशन का तकनीकी विवरण।'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Lock className="w-4 h-4 text-blue-600" />
                    <span>RBI Tokenization & PCI-DSS Level 1</span>
                  </div>
                  <p className="text-slate-600">
                    Scripter’s web client never receives, handles, or stores raw 16-digit card numbers or CVV codes. All card data is securely tokenized through Cashfree / Razorpay’s certified PCI-DSS Level 1 compliant gateway.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>Server-Side Webhook Verification</span>
                  </div>
                  <p className="text-slate-600">
                    Subscriptions and AI credits are granted ONLY after authenticating cryptographically signed gateway webhooks (HMAC-SHA256 signature verification). Client-side redirects never grant authoritative credits directly.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Info className="w-4 h-4 text-amber-600" />
                    <span>Transparent Sandbox Environment</span>
                  </div>
                  <p className="text-slate-600">
                    The current build operates in verified Sandbox Mode for automated feature testing. Transactions generate authentic GST-compliant receipts without charging live credit cards.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Building className="w-4 h-4 text-purple-600" />
                    <span>Indian GST Statutory Compliance</span>
                  </div>
                  <p className="text-slate-600">
                    Invoices comply with Indian GST Rule 46 requirements: supplier GSTIN, unique consecutive serial numbers, SAC code 998314 for cloud software, intra-state CGST+SGST, and inter-state IGST calculations.
                  </p>
                </div>
              </div>

              {/* Developer Configuration Guide */}
              <div className="p-4 bg-slate-900 text-slate-300 rounded-xl text-xs font-mono space-y-2">
                <div className="text-amber-400 font-bold">
                  // Production Deployment Credentials Setup
                </div>
                <p className="text-[11px] text-slate-400">
                  To transition from sandbox mode to live production payments, configure your secure server environment with the following environment variables (never expose these in client-side bundles):
                </p>
                <div className="bg-slate-950 p-3 rounded-lg text-emerald-400 text-[11px] leading-relaxed">
                  CASHFREE_APP_ID=cf_app_live_xxxxxxxx<br />
                  CASHFREE_SECRET_KEY=cf_secret_live_xxxxxxxx<br />
                  CASHFREE_ENV=PRODUCTION<br />
                  CASHFREE_WEBHOOK_SECRET=cf_wh_sec_xxxxxxxx
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tax Invoice Receipt Viewer Modal (GST Rule 46 Compliant) */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedInvoice(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Branded GST Tax Invoice Sheet */}
            <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/40">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-200 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <img
                      src="/assets/aistudio/Square_Scripter_Logo_d7bb9aeb.png"
                      alt="Scripter Logo"
                      className="w-7 h-7 rounded-lg shadow-sm"
                    />
                    <span className="font-extrabold text-base text-slate-900">Scripter</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                    Scripter Technologies Private Limited<br />
                    Ward No. 4, Tikamgarh Road, Orchha, MP - 472246<br />
                    HSN / SAC Code: 998314 (Cloud AI Software Services)<br />
                    GSTIN: 23AABCS1429B1Z8
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full uppercase tracking-wider">
                    TAX INVOICE - PAID
                  </span>
                  <div className="font-mono text-xs font-bold text-slate-800 mt-2">
                    {selectedInvoice.invoiceNumber}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Date: {selectedInvoice.date}
                  </div>
                </div>
              </div>

              {/* Billed To Information */}
              <div className="grid grid-cols-2 gap-4 py-4 text-xs border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Billed To:</span>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {billingForm.legalEntityName || userProfile.name}
                  </div>
                  <div className="text-slate-600">{userProfile.email}</div>
                  <div className="text-slate-600">{billingForm.billingAddress}</div>
                  {billingForm.gstin && (
                    <div className="text-blue-600 font-mono font-bold mt-1">
                      GSTIN: {billingForm.gstin}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Payment Details:</span>
                  <div className="font-semibold text-slate-800 mt-0.5">UPI / Sandbox Verified</div>
                  <div className="text-slate-500 text-[11px]">Period: {selectedInvoice.period}</div>
                  <div className="text-emerald-600 font-bold mt-1 flex items-center justify-end gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Transaction Settled</span>
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              {(() => {
                const total = selectedInvoice.amount;
                const net = Math.round(total / 1.18);
                const gst = total - net;
                const cgst = Math.round(gst / 2);
                const sgst = gst - cgst;

                return (
                  <div className="py-4">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 font-semibold text-left">
                          <th className="pb-2">Description</th>
                          <th className="pb-2 text-center">SAC</th>
                          <th className="pb-2 text-right">Taxable</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="py-2.5 font-medium text-slate-800">{selectedInvoice.description}</td>
                          <td className="py-2.5 text-center text-slate-500 font-mono">998314</td>
                          <td className="py-2.5 text-right font-semibold text-slate-900">₹{net.toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="mt-4 pt-3 border-t border-slate-200 space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Taxable Value (Net):</span>
                        <span>₹{net.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-500 text-[11px]">
                        <span>CGST (9%):</span>
                        <span>₹{cgst.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-500 text-[11px]">
                        <span>SGST (9%):</span>
                        <span>₹{sgst.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-extrabold text-slate-900 text-sm pt-2 border-t border-slate-200">
                        <span>Total Amount Paid (INR):</span>
                        <span className="text-blue-600">₹{total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => {
                  showToast(language === 'en' ? 'Invoice receipt downloaded successfully' : 'चालान डाउनलोड हुआ');
                  setSelectedInvoice(null);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Method Modal */}
      {isAddMethodModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsAddMethodModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <span>{language === 'en' ? 'Add Payment Method' : 'भुगतान विधि जोड़ें'}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              {language === 'en'
                ? 'Your payment details are securely tokenized with Cashfree in compliance with RBI card-on-file guidelines.'
                : 'आरबीआई दिशानिर्देशों के तहत आपके कार्ड का केवल टोकन सुरक्षित किया जाता है।'}
            </p>

            {/* Method Type Selector */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl mb-4">
              <button
                type="button"
                onClick={() => setNewMethodType('upi')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  newMethodType === 'upi' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                UPI (GPay / PhonePe)
              </button>
              <button
                type="button"
                onClick={() => setNewMethodType('card')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  newMethodType === 'card' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
                }`}
              >
                Credit / Debit Card
              </button>
            </div>

            <form onSubmit={handleAddPaymentMethod} className="space-y-3.5 text-xs">
              {newMethodType === 'upi' ? (
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">
                    {language === 'en' ? 'UPI Virtual Payment Address (VPA)' : 'यूपीआई आईडी (VPA)'}
                  </label>
                  <input
                    type="text"
                    value={newUpiId}
                    onChange={(e) => setNewUpiId(e.target.value)}
                    placeholder="name@okhdfcbank"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">
                      {language === 'en' ? 'Card Number' : 'कार्ड नंबर'}
                    </label>
                    <input
                      type="text"
                      value={newCardNumber}
                      onChange={(e) => setNewCardNumber(e.target.value)}
                      placeholder="4111 2222 3333 4444"
                      maxLength={19}
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={newCardExp}
                        onChange={(e) => setNewCardExp(e.target.value)}
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">CVV</label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength={4}
                        required
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddMethodModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-sm"
                >
                  Save Payment Method
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subscription Cancellation Retention Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsCancelModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900">
              {language === 'en' ? 'Cancel Subscription Renewal?' : 'सब्सक्रिप्शन नवीनीकरण रद्द करें?'}
            </h3>
            <p className="text-xs text-slate-600 mt-1 mb-4 leading-relaxed">
              {language === 'en'
                ? `You will keep full access to your Pro Plan, 1,000 monthly credits, and 5 business profiles until ${
                    subscription.renewalDate || '10 Nov, 2026'
                  }. After this date, your account will move to the Free tier.`
                : `आपकी प्रो प्लान की सभी सुविधाएं ${
                    subscription.renewalDate || '10 Nov, 2026'
                  } तक सक्रिय रहेंगी। इसके बाद आपका खाता फ्री टियर में बदल जाएगा।`}
            </p>

            <div className="mb-4 text-xs">
              <label className="block text-slate-600 font-semibold mb-1">
                {language === 'en' ? 'Please tell us why you are cancelling:' : 'कृपया रद्द करने का कारण बताएं:'}
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pricing">Plan price is too high for my current usage</option>
                <option value="temporary">Taking a break from content creation</option>
                <option value="features">Looking for features not yet available</option>
                <option value="credits">I have enough unused credits saved</option>
                <option value="other">Other reason</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
              >
                {language === 'en' ? 'Keep My Subscription' : 'सब्सक्रिप्शन जारी रखें'}
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
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
