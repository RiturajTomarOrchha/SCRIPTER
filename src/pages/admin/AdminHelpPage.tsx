import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  HelpCircle,
  BookOpen,
  Shield,
  LifeBuoy,
  ChevronDown,
  ChevronUp,
  FileText,
  Key,
  Users,
  AlertTriangle,
} from 'lucide-react';

interface AdminHelpPageProps {
  isMasterAdmin?: boolean;
}

export const AdminHelpPage: React.FC<AdminHelpPageProps> = ({ isMasterAdmin = false }) => {
  const { language } = useLanguage();
  const [openSection, setOpenSection] = useState<number | null>(0);

  const articles = [
    {
      title: 'Standard Operating Procedure: Creator Account Assistance & Credit Adjustments',
      category: 'User Management',
      content: `1. Always inspect the user's historical AI credit consumption ledger before granting courtesy credits.
2. Courtesy credits must never exceed 500 credits per grant without Master Admin escalation.
3. Every credit adjustment requires a mandatory audit rationale that is indelibly logged in the security ledger.
4. Suspending an account prevents active video rendering and revokes authentication immediately.`,
    },
    {
      title: 'Content Moderation Guidelines & Trust Policy',
      category: 'Moderation',
      content: `1. Hate Speech & Harassment: Immediate takedown and warning on first strike. Second strike requires 7-day suspension.
2. Copyright Violations: Verify claimant documentation. If verified, remove script / video asset and alert creator.
3. NSFW & Explicit Media: Zero tolerance. Immediate takedown and account flagging.
4. Always record a moderation note explaining the violation reason when taking action.`,
    },
    {
      title: 'Support Desk Ticket Lifecycle & SLA Commitments',
      category: 'Support',
      content: `1. First Response SLA: Urgent tickets (under 15 mins), High priority (under 1 hour), Normal (under 4 hours).
2. For billing or payment double-charges, request Razorpay payment ID and cross-check the Payments Ledger.
3. Once an issue is fixed, reply clearly to the creator and update ticket status to "Resolved".`,
    },
    {
      title: 'Role-Based Access Control (RBAC) Privilege Matrix',
      category: 'Security & Access',
      content: `• User: Can only generate content, record videos, and manage personal business profiles.
• Admin (Operations): Can view creator profiles, answer tickets, moderate flagged content, manage template library and visual assets. Cannot modify plans or billing pricing.
• Master Admin (Executive): Full system sovereignty. Configures AI Provider Hub, alters credit pricing, views MRR billing ledger, invites admin staff, and toggles platform maintenance.`,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-20 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-blue-50 text-blue-600">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {language === 'en' ? 'Admin SOPs & Documentation' : 'एडमिन नियमावली और दस्तावेज'}
            </h1>
            <span
              className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-md ${
                isMasterAdmin ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
              }`}
            >
              Standard Operating Procedures
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'en'
              ? 'Operational runbooks, moderation guidelines, and role security requirements.'
              : 'संचालन नियमावली, मॉडरेशन दिशानिर्देश और सुरक्षा मानक।'}
          </p>
        </div>
      </div>

      {/* Articles Accordion */}
      <div className="space-y-4">
        {articles.map((art, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all"
          >
            <button
              onClick={() => setOpenSection(openSection === idx ? null : idx)}
              className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
            >
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-wider block mb-1">
                  {art.category}
                </span>
                <h3 className="font-bold text-slate-900 text-sm">{art.title}</h3>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500 shrink-0">
                {openSection === idx ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </button>

            {openSection === idx && (
              <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/40 text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-line">
                {art.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
