import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useRole } from '../../context/RoleContext';
import { AppNotification } from '../../types';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Sparkles,
  ShieldAlert,
  Megaphone,
  Check,
  Trash2,
  ExternalLink,
  ArrowLeft,
  Filter
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { language } = useLanguage();
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification
  } = useRole();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'important' | 'system'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered notifications
  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === 'unread') return !notif.isRead;
    if (activeTab === 'important') {
      return (
        notif.type === 'low_credits' ||
        notif.type === 'payment' ||
        notif.type === 'security'
      );
    }
    if (activeTab === 'system') {
      return notif.type === 'announcement' || notif.type === 'system';
    }
    return true;
  });

  const getNotificationIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'script_ready':
      case 'export_ready':
        return (
          <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
          </div>
        );
      case 'low_credits':
        return (
          <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
          </div>
        );
      case 'payment':
        return (
          <div className="w-10 h-10 rounded-xl bg-teal-100/80 text-teal-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5 stroke-[2.2]" />
          </div>
        );
      case 'security':
        return (
          <div className="w-10 h-10 rounded-xl bg-rose-100/80 text-rose-600 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 stroke-[2.2]" />
          </div>
        );
      case 'announcement':
        return (
          <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-blue-600 flex items-center justify-center shrink-0">
            <Megaphone className="w-5 h-5 stroke-[2.2]" />
          </div>
        );
      case 'template':
        return (
          <div className="w-10 h-10 rounded-xl bg-purple-100/80 text-purple-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 stroke-[2.2]" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5 stroke-[2.2]" />
          </div>
        );
    }
  };

  const handleActionClick = (notif: AppNotification) => {
    if (!notif.isRead) {
      markNotificationRead(notif.id);
    }
    if (notif.actionUrl) {
      navigate(notif.actionUrl);
    }
  };

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
    showToast(language === 'en' ? 'All notifications marked as read' : 'सभी सूचनाएं पढ़ी हुई चिह्नित की गईं');
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification(id);
    showToast(language === 'en' ? 'Notification removed' : 'सूचना हटा दी गई');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 lg:pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#0B132B] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner / Header */}
      <div className="bg-white border-b border-slate-200/80 sticky top-16 z-20 backdrop-blur-md bg-white/90">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(-1)}
                  className="p-1.5 -ml-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors sm:hidden"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>{language === 'en' ? 'Notifications' : 'सूचनाएं (Notifications)'}</span>
                  {unreadNotificationsCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-blue-100 text-blue-700 rounded-full">
                      {unreadNotificationsCount} {language === 'en' ? 'new' : 'नई'}
                    </span>
                  )}
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {language === 'en'
                  ? 'Stay updated with your projects, credits, subscription and account.'
                  : 'अपने प्रोजेक्ट्स, क्रेडिट्स, सब्सक्रिप्शन और खाते के सभी अपडेट देखें।'}
              </p>
            </div>

            {unreadNotificationsCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors shrink-0 self-start sm:self-center"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{language === 'en' ? 'Mark all as read' : 'सभी पढ़ी हुई मार्क करें'}</span>
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {language === 'en' ? `All (${notifications.length})` : `सभी (${notifications.length})`}
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap ${
                activeTab === 'unread'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {language === 'en' ? `Unread (${unreadNotificationsCount})` : `अपठित (${unreadNotificationsCount})`}
            </button>
            <button
              onClick={() => setActiveTab('important')}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap ${
                activeTab === 'important'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {language === 'en' ? 'Important' : 'महत्वपूर्ण'}
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap ${
                activeTab === 'system'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {language === 'en' ? 'System & Updates' : 'सिस्टम और अपडेट'}
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <Bell className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              {language === 'en' ? 'No notifications found' : 'कोई सूचना उपलब्ध नहीं'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {activeTab === 'unread'
                ? language === 'en'
                  ? "You're all caught up! You have read all your notifications."
                  : 'आप पूरी तरह अपडेट हैं! आपके पास कोई अपठित सूचना नहीं है।'
                : language === 'en'
                ? 'When you generate scripts, use AI credits, or update subscriptions, alerts will appear here.'
                : 'जब आप स्क्रिप्ट बनाएंगे, क्रेडिट्स उपयोग करेंगे या प्लान बदलेंगे, सूचनाएं यहाँ दिखाई देंगी।'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleActionClick(notif)}
                className={`relative group bg-white rounded-2xl border p-4 sm:p-5 transition-all cursor-pointer hover:shadow-md ${
                  notif.isRead
                    ? 'border-slate-200/80 bg-white/80 opacity-90'
                    : 'border-blue-200 bg-blue-50/20 shadow-sm ring-1 ring-blue-500/10'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Category Icon */}
                  {getNotificationIcon(notif.type)}

                  {/* Body Content */}
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {notif.title}
                      </h4>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 inline-block animate-pulse" />
                      )}
                      <span className="text-[11px] text-slate-400 font-medium ml-auto">
                        {notif.timestamp}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      {notif.message}
                    </p>

                    {/* Action Link & Button */}
                    {notif.actionUrl && (
                      <div className="mt-2.5 flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700">
                        <span>{notif.actionLabel || (language === 'en' ? 'View Details' : 'विवरण देखें')}</span>
                        <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    )}
                  </div>

                  {/* Hover Delete Action */}
                  <button
                    onClick={(e) => handleDelete(notif.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    title={language === 'en' ? 'Remove notification' : 'हटाएं'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
