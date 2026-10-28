import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { adminStorage } from '../../services/adminStorage';
import { FeedbackSubmission } from '../../types';
import {
  MessageSquare,
  Star,
  CheckCircle2,
  Filter,
  Search,
  ThumbsUp,
  Tag,
  Clock,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

interface AdminFeedbackPageProps {
  isMasterAdmin?: boolean;
}

export const AdminFeedbackPage: React.FC<AdminFeedbackPageProps> = ({ isMasterAdmin = false }) => {
  const { language } = useLanguage();
  const [submissions, setSubmissions] = useState<FeedbackSubmission[]>(() =>
    adminStorage.getFeedbackSubmissions()
  );
  const [filterCategory, setFilterCategory] = useState<'all' | 'feature_request' | 'bug_report' | 'general' | 'compliment'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateStatus = (id: string, newStatus: FeedbackSubmission['status']) => {
    adminStorage.updateFeedbackStatus(
      id,
      newStatus,
      isMasterAdmin ? 'Master Admin' : 'Admin Operations',
      isMasterAdmin ? 'master-admin' : 'admin'
    );
    setSubmissions(adminStorage.getFeedbackSubmissions());
    showToast(`Feedback status updated to ${newStatus}`);
  };

  const filtered = submissions.filter((f) => {
    const matchesCategory = filterCategory === 'all' || f.category === filterCategory;
    const matchesSearch =
      (f.userName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.feedbackText || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const avgRating = (
    submissions.reduce((acc, curr) => acc + curr.rating, 0) / submissions.length
  ).toFixed(1);

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
              <MessageSquare className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {language === 'en' ? 'Creator Feedback & CSAT' : 'क्रिएटर फीडबैक और रेटिंग'}
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-purple-100 text-purple-800">
              User Voice
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'en'
              ? 'Analyze sentiment, product suggestions, and customer satisfaction ratings.'
              : 'क्रिएटर संतुष्टि रेटिंग और फीचर सुझावों का विश्लेषण करें।'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>Average CSAT: {avgRating} / 5.0</span>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Total Submissions</span>
          <p className="text-2xl font-black text-slate-900 font-mono mt-1">
            {submissions.length}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">96% Net Positive</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Feature Requests</span>
          <p className="text-2xl font-black text-slate-900 font-mono mt-1">
            {submissions.filter((s) => s.category === 'feature_request').length}
          </p>
          <span className="text-[11px] text-blue-600 font-medium">Reviewed for roadmap</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Bug Reports</span>
          <p className="text-2xl font-black text-slate-900 font-mono mt-1">
            {submissions.filter((s) => s.category === 'bug_report').length}
          </p>
          <span className="text-[11px] text-rose-600 font-medium">Escalated to engineering</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Actioned / Planned</span>
          <p className="text-2xl font-black text-slate-900 font-mono mt-1">
            {submissions.filter((s) => s.status === 'planned').length}
          </p>
          <span className="text-[11px] text-purple-600 font-medium">In active sprint</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search feedback..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs overflow-x-auto">
          {(['all', 'feature_request', 'bug_report', 'compliment', 'general'] as const).map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all whitespace-nowrap ${
                  filterCategory === cat
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            )
          )}
        </div>
      </div>

      {/* Feedback Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${
                        star <= item.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                  <span className="text-[11px] font-mono font-bold text-slate-600 ml-1">
                    {item.rating}.0
                  </span>
                </div>

                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold uppercase">
                  {item.category.replace('_', ' ')}
                </span>
              </div>

              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                "{item.feedbackText}"
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900">{item.userName}</span>
                <span className="text-[10px] text-slate-400 font-mono block">{item.submittedAt}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.status !== 'planned' && (
                  <button
                    onClick={() => handleUpdateStatus(item.id, 'planned')}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold transition-colors"
                  >
                    Add to Roadmap
                  </button>
                )}
                {item.status === 'new' && (
                  <button
                    onClick={() => handleUpdateStatus(item.id, 'reviewed')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
                  >
                    Mark Reviewed
                  </button>
                )}
                {item.status === 'planned' && (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                    Planned
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
