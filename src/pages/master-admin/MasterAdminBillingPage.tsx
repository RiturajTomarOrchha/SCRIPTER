import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { adminStorage } from '../../services/adminStorage';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  RotateCcw,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  ShieldAlert,
  ArrowUpRight,
  ExternalLink,
  ChevronDown,
  Info,
  X,
  Lock,
} from 'lucide-react';

interface TransactionRecord {
  id: string;
  orderId: string;
  userEmail: string;
  userName: string;
  amountInr: number;
  planName: string;
  paymentMethod: string;
  gateway: 'Razorpay' | 'Stripe';
  status: 'captured' | 'failed' | 'refunded' | 'pending';
  date: string;
  invoiceNumber: string;
  refundReason?: string;
}

export const MasterAdminBillingPage: React.FC = () => {
  const { language } = useLanguage();
  const [transactions, setTransactions] = useState<TransactionRecord[]>([
    {
      id: 'tx_pay_902148',
      orderId: 'order_IN_98412',
      userEmail: 'rahul.sharma@example.com',
      userName: 'Rahul Sharma',
      amountInr: 499,
      planName: 'Pro Creator',
      paymentMethod: 'UPI (GPay)',
      gateway: 'Razorpay',
      status: 'captured',
      date: '2026-10-24 14:32',
      invoiceNumber: 'INV-2026-1049',
    },
    {
      id: 'tx_pay_902149',
      orderId: 'order_IN_98413',
      userEmail: 'priya.verma@contentcraft.in',
      userName: 'Priya Verma',
      amountInr: 1499,
      planName: 'Agency & Studio',
      paymentMethod: 'Credit Card (HDFC ****4242)',
      gateway: 'Razorpay',
      status: 'captured',
      date: '2026-10-23 11:15',
      invoiceNumber: 'INV-2026-1050',
    },
    {
      id: 'tx_pay_902150',
      orderId: 'order_IN_98414',
      userEmail: 'vikram.singh@digitalpulse.co',
      userName: 'Vikram Singh',
      amountInr: 499,
      planName: 'Pro Creator',
      paymentMethod: 'Netbanking (ICICI)',
      gateway: 'Razorpay',
      status: 'failed',
      date: '2026-10-22 19:40',
      invoiceNumber: 'INV-2026-1051',
    },
    {
      id: 'tx_pay_902151',
      orderId: 'order_IN_98415',
      userEmail: 'neha.patel@healthfirst.org',
      userName: 'Dr. Neha Patel',
      amountInr: 499,
      planName: 'Pro Creator',
      paymentMethod: 'UPI (PhonePe)',
      gateway: 'Razorpay',
      status: 'refunded',
      date: '2026-10-21 09:12',
      invoiceNumber: 'INV-2026-1052',
      refundReason: 'Accidental double charge requested within 2 hours',
    },
    {
      id: 'tx_pay_902152',
      orderId: 'order_IN_98416',
      userEmail: 'amit.kumar@techjunction.io',
      userName: 'Amit Kumar',
      amountInr: 1499,
      planName: 'Agency & Studio',
      paymentMethod: 'UPI (Paytm)',
      gateway: 'Razorpay',
      status: 'captured',
      date: '2026-10-20 16:55',
      invoiceNumber: 'INV-2026-1053',
    },
    {
      id: 'tx_pay_902153',
      orderId: 'order_IN_98417',
      userEmail: 'ananya.deshmukh@viralreels.me',
      userName: 'Ananya Deshmukh',
      amountInr: 499,
      planName: 'Pro Creator',
      paymentMethod: 'Credit Card (Axis ****8910)',
      gateway: 'Razorpay',
      status: 'captured',
      date: '2026-10-19 13:20',
      invoiceNumber: 'INV-2026-1054',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'captured' | 'failed' | 'refunded'>('all');
  const [selectedTx, setSelectedTx] = useState<TransactionRecord | null>(null);
  const [refundCandidate, setRefundCandidate] = useState<TransactionRecord | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleProcessRefund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundCandidate || !refundReason.trim()) return;

    setTransactions((prev) =>
      prev.map((tx) =>
        tx.id === refundCandidate.id
          ? { ...tx, status: 'refunded', refundReason: refundReason.trim() }
          : tx
      )
    );

    adminStorage.addAuditLog({
      actorName: 'Master Admin',
      actorRole: 'master-admin',
      action: 'REFUND_TRANSACTION',
      target: refundCandidate.id,
      details: `Processed refund of ₹${refundCandidate.amountInr} for ${refundCandidate.userEmail}. Reason: ${refundReason.trim()}`,
      status: 'SUCCESS',
      severity: 'warning',
    });

    showToast(`Refund of ₹${refundCandidate.amountInr} initiated for ${refundCandidate.userName}`);
    setRefundCandidate(null);
    setRefundReason('');
  };

  const getStatusBadge = (status: TransactionRecord['status']) => {
    switch (status) {
      case 'captured':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Success</span>
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold">
            <XCircle className="w-3 h-3 text-rose-500" />
            <span>Failed</span>
          </span>
        );
      case 'refunded':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold">
            <RotateCcw className="w-3 h-3 text-amber-500" />
            <span>Refunded</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>Pending</span>
          </span>
        );
    }
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
            <span className="p-1 rounded-md bg-emerald-50 text-emerald-600">
              <CreditCard className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {language === 'en' ? 'Payments & Billing Oversight' : 'भुगतान और बिलिंग प्रबंधन'}
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-amber-100 text-amber-800 border border-amber-200">
              Financial Governance
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'en'
              ? 'Real-time transaction settlement, payment gateway status, invoices, and refund workflows.'
              : 'लेनदेन का विवरण, पेमेंट गेटवे और रिफंड वर्कफ़्लो का प्रबंधन करें।'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>PCI-DSS Compliant via Razorpay</span>
          </div>
        </div>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Monthly Recurring (MRR)</span>
          <p className="text-2xl font-black text-slate-900 font-mono mt-1">₹8,42,500</p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+14.8% vs September</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Paid Subscribers</span>
          <p className="text-2xl font-black text-slate-900 font-mono mt-1">1,392</p>
          <span className="text-[11px] text-slate-500 font-medium">1,248 Pro • 144 Agency</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Gateway Success Rate</span>
          <p className="text-2xl font-black text-slate-900 font-mono mt-1">99.4%</p>
          <span className="text-[11px] text-emerald-600 font-medium">UPI & RuPay optimized</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Refund Requests</span>
          <p className="text-2xl font-black text-slate-900 font-mono mt-1">
            {transactions.filter((t) => t.status === 'refunded').length}
          </p>
          <span className="text-[11px] text-amber-600 font-medium">Strict 7-day policy</span>
        </div>
      </div>

      {/* Payment Gateway Status Ribbon */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
            R
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Razorpay Payment Gateway (India)</h4>
            <p className="text-[11px] text-slate-500">
              Webhooks live • UPI AutoPay & Recurring Subscriptions active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Gateway Connected</span>
          </span>
        </div>
      </div>

      {/* Transactions Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden space-y-3 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Transactions Ledger</h3>
            <p className="text-xs text-slate-400">
              All subscription charges, renewals, and refund audits
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search user, ID, invoice..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="captured">Captured (Success)</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="pb-3">Transaction ID</th>
                <th className="pb-3">User</th>
                <th className="pb-3">Plan / Item</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Method</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 font-mono font-semibold text-slate-900">
                    <div>{tx.id}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{tx.invoiceNumber}</div>
                  </td>
                  <td className="py-3 font-medium text-slate-900">
                    <div>{tx.userName}</div>
                    <div className="text-[11px] text-slate-400 font-normal">{tx.userEmail}</div>
                  </td>
                  <td className="py-3 text-slate-700 font-medium">{tx.planName}</td>
                  <td className="py-3 font-mono font-bold text-slate-900">₹{tx.amountInr}</td>
                  <td className="py-3 text-slate-600 font-mono text-[11px]">{tx.paymentMethod}</td>
                  <td className="py-3 text-slate-500 font-mono text-[11px]">{tx.date}</td>
                  <td className="py-3">{getStatusBadge(tx.status)}</td>
                  <td className="py-3 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedTx(tx)}
                        className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors"
                      >
                        Receipt
                      </button>

                      {tx.status === 'captured' && (
                        <button
                          onClick={() => setRefundCandidate(tx)}
                          className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[11px] transition-colors"
                        >
                          Refund
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice / Receipt Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Invoice Details</h3>
                  <span className="text-xs text-slate-500 font-mono">{selectedTx.invoiceNumber}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer:</span>
                  <span className="font-bold text-slate-800">{selectedTx.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-mono text-slate-700">{selectedTx.userEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Gateway:</span>
                  <span className="font-semibold text-slate-800">{selectedTx.gateway}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Gateway Order ID:</span>
                  <span className="font-mono text-slate-700">{selectedTx.orderId}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Plan Purchased:</span>
                  <span className="font-bold text-slate-800">{selectedTx.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal:</span>
                  <span className="font-mono text-slate-700">₹{(selectedTx.amountInr / 1.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">GST (18%):</span>
                  <span className="font-mono text-slate-700">₹{(selectedTx.amountInr - selectedTx.amountInr / 1.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-sm">
                  <span className="text-slate-900">Total Paid:</span>
                  <span className="font-mono text-blue-600">₹{selectedTx.amountInr}</span>
                </div>
              </div>

              {selectedTx.refundReason && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                  <span className="font-bold text-[11px] uppercase tracking-wide">Refund Note:</span>
                  <p className="text-xs">{selectedTx.refundReason}</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Confirmation Modal (Explicit confirmation rule) */}
      {refundCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-rose-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-bold text-slate-900 text-base">Confirm Refund Processing</h3>
                <span className="text-xs text-slate-500 font-mono">ID: {refundCandidate.id}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              You are about to issue a refund of <strong className="font-mono text-slate-900">₹{refundCandidate.amountInr}</strong> to <strong>{refundCandidate.userName}</strong> ({refundCandidate.userEmail}). This action will downgrade their subscription and create an immutable audit entry.
            </p>

            <form onSubmit={handleProcessRefund} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Refund Reason (Mandatory Audit Note) *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="State the verifiable reason (e.g. duplicate charge, SLA breach)..."
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRefundCandidate(null);
                    setRefundReason('');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
                >
                  Confirm & Issue Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
