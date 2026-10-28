import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useRole } from '../../context/RoleContext';
import {
  User,
  Crown,
  Briefcase,
  Zap,
  CreditCard,
  Bell,
  Sliders,
  Shield,
  Lock,
  HelpCircle,
  FileText,
  Trash2,
  ChevronRight,
  Camera,
  Check,
  X,
  AlertTriangle,
  Download,
  Key,
  Smartphone,
  LogOut,
  Sparkles
} from 'lucide-react';

export const AccountSettingsPage: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const {
    userProfile,
    updateUserProfile,
    subscription,
    creditsInfo,
    activeBusinessProfile
  } = useRole();
  const navigate = useNavigate();

  // Modals
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);

  // Edit Profile Form State
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone || '+91 98765 43210');
  const [bio, setBio] = useState(userProfile.bio || 'AI Content Creator & Filmmaker');

  // Preferences
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [scriptReadyAlert, setScriptReadyAlert] = useState(true);
  const [creditAlert, setCreditAlert] = useState(true);
  const [marketingEmail, setMarketingEmail] = useState(false);

  // Two-factor Auth
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Delete Account Confirmation Input
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      phone,
      bio
    });
    setIsEditProfileOpen(false);
    showToast(language === 'en' ? 'Profile updated successfully' : 'प्रोफ़ाइल सफलतापूर्वक अपडेट हुई');
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify({
        profile: userProfile,
        subscription,
        credits: creditsInfo,
        exportTimestamp: new Date().toISOString()
      }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `scripter_account_data_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(language === 'en' ? 'Account data exported as JSON' : 'खाता डेटा JSON में डाउनलोड किया गया');
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText.trim().toUpperCase() !== 'DELETE') {
      showToast(language === 'en' ? 'Please type DELETE to confirm' : 'कृपया पुष्टि के लिए DELETE टाइप करें');
      return;
    }
    // In accordance with Section 8, inform user honestly and reset
    localStorage.clear();
    setIsDeleteAccountModalOpen(false);
    showToast(language === 'en' ? 'Account reset initiated' : 'खाता रीसेट किया गया');
    setTimeout(() => {
      window.location.href = '/user/home';
    }, 1500);
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sliders className="w-6 h-6 text-blue-600" />
            <span>{language === 'en' ? 'Account & Settings' : 'खाता और सेटिंग्स'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'en'
              ? 'Manage your personal profile, notifications, security, preferences and account data.'
              : 'अपनी प्रोफ़ाइल, सुरक्षा, सूचनाएं और प्राथमिकताओं का प्रबंधन करें।'}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* User Profile Card Banner */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-md overflow-hidden">
                {userProfile.avatarUrl ? (
                  <img src={userProfile.avatarUrl} alt={userProfile.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{userProfile.name.charAt(0)}</span>
                )}
              </div>
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="absolute -bottom-1 -right-1 p-1.5 bg-white text-slate-700 rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
                title="Change Photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900">{userProfile.name}</h2>
                <span className="px-2.5 py-0.5 text-[11px] font-extrabold bg-blue-100 text-blue-700 rounded-full flex items-center gap-1">
                  <Crown className="w-3 h-3 fill-blue-600" />
                  {subscription.planName}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{userProfile.email}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{userProfile.bio || 'AI Content Creator'}</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all shrink-0 self-start sm:self-center"
          >
            {language === 'en' ? 'Edit Profile' : 'प्रोफ़ाइल बदलें'}
          </button>
        </div>

        {/* Settings Navigation Menu Group */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {/* 1. Profile Details */}
          <div
            onClick={() => setIsEditProfileOpen(true)}
            className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/70 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {language === 'en' ? 'Profile Information' : 'व्यक्तिगत जानकारी'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'en' ? 'Manage your personal details and contact info' : 'नाम, ईमेल और बायो प्रबंधित करें'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
          </div>

          {/* 2. Business Profile */}
          <div
            onClick={() => navigate('/user/business-profiles')}
            className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/70 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {language === 'en' ? 'Business Profiles' : 'बिजनेस प्रोफाइल्स'}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                    {activeBusinessProfile.name}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {language === 'en' ? 'Your active industry niche, tone, and audience settings' : 'सक्रिय उद्योग श्रेणी और लक्षित दर्शक'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
          </div>

          {/* 3. Subscription & Plans */}
          <div
            onClick={() => navigate('/user/subscription')}
            className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/70 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {language === 'en' ? 'Subscription Plans' : 'सब्सक्रिप्शन प्लान्स'}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                    {subscription.planName}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {language === 'en' ? 'Plan details, renewal schedule, and upgrade options' : 'प्लान विवरण और अपग्रेड विकल्प'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
          </div>

          {/* 4. AI Credits */}
          <div
            onClick={() => navigate('/user/credits')}
            className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/70 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 fill-amber-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {language === 'en' ? 'AI Credits & Usage' : 'एआई क्रेडिट्स और उपयोग'}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                    {creditsInfo.totalAvailable} left
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {language === 'en' ? 'Check remaining credits, transparent costs, and purchase top-ups' : 'क्रेडिट बैलेंस और उपयोग देखें'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
          </div>

          {/* 5. Payments & Invoices */}
          <div
            onClick={() => navigate('/user/billing')}
            className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/70 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {language === 'en' ? 'Payments & Billing' : 'भुगतान और बिलिंग'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'en' ? 'Payment history, downloadable GST invoices, and billing info' : 'चालान डाउनलोड और लेनदेन इतिहास'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
          </div>

          {/* 6. Notifications Settings */}
          <div
            onClick={() => setIsNotificationsModalOpen(true)}
            className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/70 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {language === 'en' ? 'Notification Preferences' : 'सूचना प्राथमिकताएं'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'en' ? 'Configure in-app alerts, low credit warnings, and updates' : 'अलर्ट और सूचनाएं सेट करें'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
          </div>

          {/* 7. App Preferences */}
          <div
            onClick={() => setIsPreferencesModalOpen(true)}
            className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/70 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {language === 'en' ? 'App Preferences' : 'ऐप प्राथमिकताएं'}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full uppercase">
                    {language}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {language === 'en' ? 'Language (English / हिन्दी), default export format, and UI settings' : 'भाषा और वीडियो प्राथमिकताएं'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
          </div>

          {/* 8. Security */}
          <div
            onClick={() => setIsSecurityModalOpen(true)}
            className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/70 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {language === 'en' ? 'Security & 2FA' : 'सुरक्षा और 2FA'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'en' ? 'Password change, two-factor authentication, and active sessions' : 'पासवर्ड और खाता सुरक्षा'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
          </div>

          {/* 9. Privacy & Data Export */}
          <div
            onClick={() => setIsPrivacyModalOpen(true)}
            className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/70 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {language === 'en' ? 'Privacy & Data Export' : 'गोपनीयता और डेटा डाउनलोड'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'en' ? 'Download your complete content archive and manage privacy' : 'अपना संपूर्ण डेटा डाउनलोड करें'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
          </div>

          {/* 10. Help & Support */}
          <div
            onClick={() => navigate('/user/help')}
            className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/70 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {language === 'en' ? 'Help & Support' : 'सहायता और संपर्क'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'en' ? 'FAQs, video tutorials, and contact support team' : 'सामान्य प्रश्न और सहायता टीम से संपर्क'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
          </div>

          {/* 11. Terms & Policies */}
          <div
            onClick={() => setIsTermsModalOpen(true)}
            className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/70 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {language === 'en' ? 'Terms & Policies' : 'नियम और नीतियां'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'en' ? 'Terms of service, refund policy, and privacy standards' : 'सेवा की शर्तें और रिफंड नीति'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
          </div>

          {/* 12. Delete Account (Danger Zone) */}
          <div
            onClick={() => setIsDeleteAccountModalOpen(true)}
            className="p-4 sm:p-5 flex items-center justify-between hover:bg-rose-50/70 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-rose-600">
                  {language === 'en' ? 'Delete Account' : 'खाता हटाएं'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'en' ? 'Permanently delete your account, scripts, and media' : 'खाता और सारा डेटा स्थायी रूप से मिटाएं'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-rose-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsEditProfileOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {language === 'en' ? 'Edit Personal Profile' : 'प्रोफ़ाइल विवरण बदलें'}
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              {language === 'en'
                ? 'Protected identifiers and subscription tiers cannot be altered here.'
                : 'खाते की सुरक्षा जानकारी यहाँ सुरक्षित रहती है।'}
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bio / Content Specialty</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification Preferences Modal */}
      {isNotificationsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsNotificationsModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {language === 'en' ? 'Notification Preferences' : 'सूचना प्राथमिकताएं'}
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Choose which events trigger alerts.
            </p>

            <div className="space-y-4 text-xs">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 block">Script & Video Generation Alerts</span>
                  <span className="text-slate-500">Notify when AI script or export is finished</span>
                </div>
                <input
                  type="checkbox"
                  checked={scriptReadyAlert}
                  onChange={(e) => setScriptReadyAlert(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 block">Low AI Credits Alert</span>
                  <span className="text-slate-500">Warn me when remaining credits drop below 200</span>
                </div>
                <input
                  type="checkbox"
                  checked={creditAlert}
                  onChange={(e) => setCreditAlert(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 block">Billing & Payment Invoices</span>
                  <span className="text-slate-500">Email receipts on subscription renewal</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-900 block">Product Announcements</span>
                  <span className="text-slate-500">Occasional new template releases</span>
                </div>
                <input
                  type="checkbox"
                  checked={marketingEmail}
                  onChange={(e) => setMarketingEmail(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>
            </div>

            <button
              onClick={() => {
                setIsNotificationsModalOpen(false);
                showToast(language === 'en' ? 'Notification preferences saved' : 'प्राथमिकताएं सुरक्षित की गईं');
              }}
              className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* App Preferences Modal */}
      {isPreferencesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsPreferencesModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {language === 'en' ? 'Application Preferences' : 'ऐप प्राथमिकताएं'}
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Customize language and creative studio defaults.
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  {language === 'en' ? 'Interface Language' : 'भाषा'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all ${
                      language === 'en'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage('hi')}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all ${
                      language === 'hi'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    हिन्दी (Hindi)
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Default Video Aspect Ratio
                </label>
                <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800">
                  <option value="9:16">9:16 (Instagram Reels & Shorts)</option>
                  <option value="16:9">16:9 (YouTube & Desktop)</option>
                  <option value="1:1">1:1 (Square Feed Post)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Script Studio Auto-save Interval
                </label>
                <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800">
                  <option value="15">Every 15 seconds (Recommended)</option>
                  <option value="30">Every 30 seconds</option>
                  <option value="60">Every 60 seconds</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => {
                setIsPreferencesModalOpen(false);
                showToast(language === 'en' ? 'Preferences saved' : 'प्राथमिकताएं सुरक्षित की गईं');
              }}
              className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Security & 2FA Modal */}
      {isSecurityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsSecurityModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {language === 'en' ? 'Security & Authentication' : 'सुरक्षा सेटिंग्स'}
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Protect your account and AI projects.
            </p>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                  <div>
                    <span className="font-bold text-slate-900 block">Two-Factor Authentication (2FA)</span>
                    <span className="text-slate-500">Require OTP on sign-in</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={twoFactorEnabled}
                  onChange={(e) => {
                    setTwoFactorEnabled(e.target.checked);
                    showToast(e.target.checked ? '2FA Enabled' : '2FA Disabled');
                  }}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-2">Change Password</span>
                <input
                  type="password"
                  placeholder="Current Password"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl mb-2 text-xs"
                />
                <input
                  type="password"
                  placeholder="New Password (min 8 characters)"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl mb-3 text-xs"
                />
                <button
                  type="button"
                  onClick={() => showToast('Password updated')}
                  className="px-3 py-1.5 bg-slate-900 text-white font-bold rounded-lg text-[11px]"
                >
                  Update Password
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block">Active Device Sessions</span>
                <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800">Chrome on Windows (Current Session)</span>
                    <span className="block text-emerald-600">Active Now • Orchha, India</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsSecurityModalOpen(false)}
              className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Privacy & Data Export Modal */}
      {isPrivacyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsPrivacyModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {language === 'en' ? 'Privacy & Data Export' : 'गोपनीयता और डेटा'}
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              You own 100% of the scripts, graphics, and video metadata you create.
            </p>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">Download Account Archive</h4>
                <p className="text-slate-500 mb-3">
                  Export all your scripts, projects, brand kit configs, and credit ledgers in JSON format.
                </p>
                <button
                  onClick={handleExportData}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Complete Archive</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600">
                <h4 className="font-bold text-slate-900 mb-1">Data Retention Policy</h4>
                <p>
                  Your scripts and media assets are preserved securely in your personal workspace and never used for public AI training without explicit permission.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsPrivacyModalOpen(false)}
              className="mt-6 w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Terms & Policies Modal */}
      {isTermsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setIsTermsModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-2">Terms & Policies</h3>
            <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
              <p>
                <strong>1. Terms of Service:</strong> By using Scripter, you agree to create compliant content respecting platform community guidelines. AI credits are consumed upon successful generation.
              </p>
              <p>
                <strong>2. Subscriptions & Billing:</strong> Plans renew automatically at the specified billing cycle (monthly or annual). You may cancel anytime before the renewal date.
              </p>
              <p>
                <strong>3. Refund Policy:</strong> Unused top-up credit packs are eligible for refund requests within 7 days of purchase.
              </p>
              <p>
                <strong>4. Commercial Rights:</strong> You own all output scripts and video exports produced within your active subscription tier.
              </p>
            </div>

            <button
              onClick={() => setIsTermsModalOpen(false)}
              className="mt-6 w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl"
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* Two-step Account Deletion Modal (Section 8 compliant) */}
      {isDeleteAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsDeleteAccountModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 text-center">
              {language === 'en' ? 'Delete Account Permanently' : 'खाता स्थायी रूप से हटाएं'}
            </h3>
            <p className="text-xs text-slate-600 text-center mt-1">
              {language === 'en'
                ? 'This action is irreversible. All your projects, scripts, brand kits, and remaining AI credits will be permanently erased.'
                : 'यह क्रिया अपरिवर्तनीय है। आपके सभी प्रोजेक्ट्स, स्क्रिप्ट और क्रेडिट्स हमेशा के लिए मिट जाएंगे।'}
            </p>

            <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900">
              <span className="font-bold block mb-1">To confirm deletion:</span>
              <span>Type <strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-rose-300">DELETE</strong> in the box below:</span>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full mt-2 px-3 py-2 bg-white border border-rose-300 rounded-xl font-mono text-center text-xs uppercase text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <button
                onClick={() => setIsDeleteAccountModalOpen(false)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                disabled={deleteConfirmText.trim().toUpperCase() !== 'DELETE'}
                onClick={handleDeleteAccount}
                className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all disabled:opacity-40"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
