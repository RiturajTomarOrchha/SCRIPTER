import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useRole } from '../../context/RoleContext';
import { getPaymentTransactions, getInvoices } from '../../services/storage';
import { PaymentTransaction, InvoiceItem } from '../../types';
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
  Check
} from 'lucide-react';

export const BillingPaymentsPage: React.FC = () => {
  const { language } = useLanguage();
  const { subscription, userProfile } = useRole();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'history' | 'invoices' | 'methods'>('history');
  const [transactions] = useState<PaymentTransaction[]>(() => getPaymentTransactions());
  const [invoices] = useState<InvoiceItem[]>(() => getInvoices());

  // Invoice Receipt Modal
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const getStatusBadge = (status: PaymentTransaction['status']) => {
    switch (status) {
      case 'successful':
        return (
          <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>{language === 'en' ? 'Successful' : 'सफल'}</span>
          </span>
        );
      case 'failed':
        return (
          <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-rose-100 text-rose-800 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            <span>{language === 'en' ? 'Failed' : 'असफल'}</span>
          </span>
        );
      case 'pending':
        return (
          <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>{language === 'en' ? 'Pending' : 'प्रक्रियाधीन'}</span>
          </span>
        );
    }
  };

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
              <CreditCard className="w-6 h-6 text-blue-600" />
              <span>{language === 'en' ? 'Payments & Billing' : 'भुगतान और बिलिंग'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {language === 'en'
                ? 'Manage your subscription, invoices, transaction receipts, and payment methods.'
                : 'अपनी सदस्यता, चालान (इनवॉइस), रसीदें और भुगतान विधियां प्रबंधित करें।'}
            </p>
          </div>

          <button
            onClick={() => navigate('/user/subscription')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all shrink-0 self-start sm:self-center active:scale-95"
          >
            <Crown className="w-4 h-4 fill-white" />
            <span>{language === 'en' ? 'Manage Plan' : 'प्लान प्रबंधित करें'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Sandbox Test Mode Notice */}
        <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-200 flex items-start gap-3 text-xs text-blue-900">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">Transparent Payment Gateway Environment: </span>
            <span>
              All payments, top-ups, and subscriptions use verifiable server-side sandbox records. No live card details are stored locally. Invoices conform to standard 18% GST regulations.
            </span>
          </div>
        </div>

        {/* Current Plan Hero Banner */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
              <Crown className="w-7 h-7 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {language === 'en' ? 'Current Plan' : 'वर्तमान प्लान'}
                </span>
                <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full">
                  {subscription.status === 'active' ? (language === 'en' ? 'Active' : 'सक्रिय') : 'Inactive'}
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {subscription.planName}
              </h2>
              <div className="text-base font-bold text-blue-600 mt-0.5">
                ₹{subscription.amount.toLocaleString()} <span className="text-xs font-semibold text-slate-500">/ {subscription.billingCycle}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'en'
                  ? `Next renewal on ${subscription.renewalDate} (${subscription.daysUntilRenewal || '12'} days left)`
                  : `अगला नवीनीकरण: ${subscription.renewalDate}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate('/user/subscription')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all"
            >
              {language === 'en' ? 'Change Plan' : 'प्लान बदलें'}
            </button>
            <button
              onClick={() => navigate('/user/credits')}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition-all"
            >
              {language === 'en' ? 'Buy Extra Credits' : 'क्रेडिट्स खरीदें'}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold transition-all relative ${
              activeTab === 'history'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {language === 'en' ? 'Payment History' : 'भुगतान इतिहास'}
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold transition-all relative ${
              activeTab === 'invoices'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {language === 'en' ? 'Invoices & Receipts' : 'चालान (इनवॉइस)'}
          </button>
          <button
            onClick={() => setActiveTab('methods')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold transition-all relative ${
              activeTab === 'methods'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {language === 'en' ? 'Payment Methods & Tax' : 'भुगतान विधियां और टैक्स'}
          </button>
        </div>

        {/* Tab 1: Payment History */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'en' ? 'Recent Transactions' : 'हाल के लेनदेन'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'en'
                    ? 'All payments made towards subscriptions and additional AI credits.'
                    : 'सब्सक्रिप्शन और क्रेडिट खरीद के लिए किए गए सभी भुगतानों का विवरण।'}
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900">
                          {tx.description}
                        </h4>
                        {getStatusBadge(tx.status)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <span>{tx.date}</span>
                        <span>•</span>
                        <span className="font-mono text-[11px]">{tx.invoiceNumber}</span>
                        <span>•</span>
                        <span className="capitalize">{tx.paymentMethod}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-13 sm:pl-0">
                    <div className="text-right">
                      <div className="text-base font-bold text-slate-900">
                        ₹{tx.amount.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {language === 'en' ? 'Incl. 18% GST' : '18% GST सहित'}
                      </div>
                    </div>

                    {tx.status === 'successful' && (
                      <button
                        onClick={() => {
                          const matchedInvoice: InvoiceItem = invoices.find((inv) => inv.invoiceNumber === tx.invoiceNumber) || {
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
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        title={language === 'en' ? 'View Tax Invoice' : 'टैक्स इनवॉइस देखें'}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Invoices & Receipts */}
        {activeTab === 'invoices' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {language === 'en' ? 'Tax Invoices & Receipts' : 'टैक्स इनवॉइस और रसीदें'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'en'
                  ? 'Official GST-compliant tax invoices for your accounting and business tax filing.'
                  : 'आपके व्यवसाय और टैक्स फाइलिंग के लिए आधिकारिक जीएसटी चालान।'}
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {inv.description}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="font-mono">{inv.invoiceNumber}</span>
                        <span>•</span>
                        <span>{inv.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-slate-900">
                      ₹{inv.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Receipt' : 'रसीद'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Payment Methods & Tax */}
        {activeTab === 'methods' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {language === 'en' ? 'Saved Payment Methods' : 'सुरक्षित भुगतान विधियां'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {language === 'en'
                      ? 'Securely managed tokenized payment instruments for recurring subscriptions.'
                      : 'स्वचालित नवीनीकरण के लिए टोकनाइज़्ड भुगतान माध्यम।'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/20 flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      UPI
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">Google Pay / PhonePe UPI</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                          Default
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 font-mono mt-0.5 block">
                        rituraj@oksbi
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      VISA
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">HDFC Bank Debit Card</span>
                      <span className="text-xs text-slate-500 font-mono mt-0.5 block">
                        •••• •••• •••• 4821 (Exp 08/28)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Address & GSTIN Box */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Building className="w-4 h-4 text-slate-700" />
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'en' ? 'Business Billing Details & GSTIN' : 'व्यवसाय बिलिंग विवरण और जीएसटी'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                {language === 'en'
                  ? 'Add your business name and GSTIN to claim Input Tax Credit (ITC) on all invoices.'
                  : 'चालानों पर इनपुट टैक्स क्रेडिट प्राप्त करने के लिए अपना जीएसटी नंबर दर्ज करें।'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Legal Entity / Name</label>
                  <input
                    type="text"
                    defaultValue={userProfile.name}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">GSTIN (Optional)</label>
                  <input
                    type="text"
                    placeholder="22AAAAA0000A1Z5"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-600 font-semibold mb-1">Billing Address</label>
                  <input
                    type="text"
                    defaultValue="Orchha, Madhya Pradesh, India - 472246"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => showToast(language === 'en' ? 'Billing address saved' : 'बिलिंग पता सुरक्षित किया गया')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all"
                >
                  {language === 'en' ? 'Save Billing Information' : 'सुरक्षित करें'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tax Invoice Receipt Viewer Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedInvoice(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Branded Invoice Sheet */}
            <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/30">
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
                  <div className="text-[11px] text-slate-500 mt-1">
                    Scripter Technologies Private Limited<br />
                    HSN / SAC Code: 998314 (Cloud Software Services)<br />
                    GSTIN: 07AABCS1429B1Z8
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-full uppercase tracking-wider">
                    TAX INVOICE - PAID
                  </span>
                  <div className="font-mono text-xs font-bold text-slate-800 mt-2">
                    {selectedInvoice.invoiceNumber}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {selectedInvoice.date}
                  </div>
                </div>
              </div>

              {/* Billed To */}
              <div className="grid grid-cols-2 gap-4 py-4 text-xs border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Billed To:</span>
                  <div className="font-bold text-slate-900 mt-0.5">{userProfile.name}</div>
                  <div className="text-slate-500">{userProfile.email}</div>
                  <div className="text-slate-500">Madhya Pradesh, India</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Payment Method:</span>
                  <div className="font-semibold text-slate-800 mt-0.5">UPI / Sandbox Verified</div>
                  <div className="text-emerald-600 font-bold">Transaction Successful</div>
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
                          <th className="pb-2 text-right">Qty</th>
                          <th className="pb-2 text-right">Taxable</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="py-2.5 font-medium text-slate-800">{selectedInvoice.description}</td>
                          <td className="py-2.5 text-right text-slate-600">1</td>
                          <td className="py-2.5 text-right font-semibold text-slate-900">₹{net}</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="mt-4 pt-3 border-t border-slate-200 space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Taxable Amount (Net):</span>
                        <span>₹{net}</span>
                      </div>
                      <div className="flex justify-between text-slate-500 text-[11px]">
                        <span>CGST (9%):</span>
                        <span>₹{cgst}</span>
                      </div>
                      <div className="flex justify-between text-slate-500 text-[11px]">
                        <span>SGST (9%):</span>
                        <span>₹{sgst}</span>
                      </div>
                      <div className="flex justify-between font-extrabold text-slate-900 text-sm pt-2 border-t border-slate-200">
                        <span>Total Paid (INR):</span>
                        <span className="text-blue-600">₹{total}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={handlePrintReceipt}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => {
                  showToast(language === 'en' ? 'Invoice receipt downloaded' : 'चालान डाउनलोड हुआ');
                  setSelectedInvoice(null);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
