import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useRole } from '../../context/RoleContext';
import {
  getUserPreferences,
  saveUserPreferences,
  getPaymentTransactions
} from '../../services/storage';
import { UserPreferences, PlanTier } from '../../types';
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
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Laptop,
  Globe,
  Radio,
  FileCheck,
  ShieldCheck,
  RefreshCw,
  QrCode,
  ArrowRight
} from 'lucide-react';

export const AccountSettingsPage: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const {
    userProfile,
    updateUserProfile,
    subscription,
    creditsInfo,
    activeBusinessProfile,
    businessProfiles,
    setActiveBusinessProfile,
    refreshState
  } = useRole();
  const navigate = useNavigate();

  // Active Section on Desktop (and active mobile drawer if selected)
  const [activeSection, setActiveSection] = useState<
    | 'profile'
    | 'business'
    | 'preferences'
    | 'notifications'
    | 'subscription'
    | 'billing'
    | 'security'
    | 'privacy'
    | 'help'
    | 'delete'
  >('profile');

  // Mobile navigation state: null = show category list; string = show active section modal/view
  const [mobileActiveSection, setMobileActiveSection] = useState<string | null>(null);

  // Edit Profile Form State
  const [fullName, setFullName] = useState<string>(userProfile.name || 'Rituraj Tomar');
  const [phone, setPhone] = useState<string>(userProfile.phone || '+91 98765 43210');
  const [location, setLocation] = useState<string>(userProfile.location || 'Orchha, Madhya Pradesh, India');
  const [bio, setBio] = useState<string>(
    userProfile.bio || 'AI Content Creator & Filmmaker producing viral short-form videos across India.'
  );

  // Password Change Form State
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // Two-Factor Authentication (2FA) State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(userProfile.twoFactorEnabled || false);
  const [is2faModalOpen, setIs2faModalOpen] = useState<boolean>(false);
  const [totpCode, setTotpCode] = useState<string>('');

  // Preferences State
  const [appPreferences, setAppPreferences] = useState<UserPreferences>(() => getUserPreferences());

  // Delete Account Confirmation State
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState<boolean>(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState<string>('');

  // Sign Out Modal State
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState<boolean>(false);

  // Avatar selector modal
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState<boolean>(false);

  // Toast message feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle Save Profile Form
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      showToast(language === 'en' ? 'Full name cannot be empty' : 'नाम रिक्त नहीं हो सकता');
      return;
    }

    updateUserProfile({
      name: fullName.trim(),
      phone: phone.trim(),
      location: location.trim(),
      bio: bio.trim()
    });

    showToast(language === 'en' ? 'Profile information updated successfully' : 'प्रोफ़ाइल जानकारी सुरक्षित की गई');
  };

  // Handle Password Update
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast(language === 'en' ? 'Please enter your current password' : 'कृपया वर्तमान पासवर्ड दर्ज करें');
      return;
    }
    if (newPassword.length < 8) {
      showToast(language === 'en' ? 'New password must be at least 8 characters' : 'नया पासवर्ड कम से कम 8 अक्षरों का होना चाहिए');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast(language === 'en' ? 'New passwords do not match' : 'नया पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast(language === 'en' ? 'Password updated securely!' : 'पासवर्ड सफलतापूर्वक बदल दिया गया!');
  };

  // Handle 2FA Verification
  const handleVerify2fa = (e: React.FormEvent) => {
    e.preventDefault();
    if (totpCode.trim().length !== 6) {
      showToast(language === 'en' ? 'Please enter a valid 6-digit TOTP code' : 'कृपया वैध 6 अंकों का कोड दर्ज करें');
      return;
    }

    const nextState = !twoFactorEnabled;
    setTwoFactorEnabled(nextState);
    updateUserProfile({ twoFactorEnabled: nextState });
    setIs2faModalOpen(false);
    setTotpCode('');
    showToast(
      nextState
        ? language === 'en'
          ? 'Two-Factor Authentication (2FA) is now enabled!'
          : 'टू-फैक्टर ऑथेंटिकेशन (2FA) सक्रिय हो गया है!'
        : language === 'en'
        ? 'Two-Factor Authentication (2FA) disabled'
        : '2FA निष्क्रिय कर दिया गया'
    );
  };

  // Handle Save Preferences
  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    saveUserPreferences(appPreferences);
    showToast(language === 'en' ? 'Preferences saved successfully' : 'प्राथमिकताएं सुरक्षित कर ली गईं');
  };

  // Handle Data Export (JSON Archive)
  const handleExportData = () => {
    const fullTransactions = getPaymentTransactions();
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(
        JSON.stringify(
          {
            userProfile,
            activeBusinessProfile,
            businessProfiles,
            subscription,
            creditsInfo,
            paymentTransactions: fullTransactions,
            preferences: appPreferences,
            exportTimestamp: new Date().toISOString()
          },
          null,
          2
        )
      );

    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `scripter_account_archive_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast(language === 'en' ? 'Complete account archive exported as JSON' : 'खाता डेटा JSON में डाउनलोड किया गया');
  };

  // Handle Delete Account
  const handleDeleteAccount = () => {
    if (deleteConfirmText.trim().toUpperCase() !== 'DELETE') {
      showToast(language === 'en' ? 'Please type DELETE to confirm' : 'कृपया पुष्टि के लिए DELETE टाइप करें');
      return;
    }

    localStorage.clear();
    setIsDeleteAccountModalOpen(false);
    showToast(language === 'en' ? 'Account permanently reset and cleared' : 'खाता स्थायी रूप से हटा दिया गया');
    setTimeout(() => {
      window.location.href = '/user/home';
    }, 1500);
  };

  // Handle Sign Out
  const handleSignOut = () => {
    setIsSignOutModalOpen(false);
    showToast(language === 'en' ? 'Signed out successfully' : 'लॉग आउट सफल रहा');
    setTimeout(() => {
      navigate('/user/home');
    }, 800);
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

      {/* Top Header Bar */}
      <div className="bg-white border-b border-slate-200/80 sticky top-16 z-20 backdrop-blur-md bg-white/95">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <Sliders className="w-6 h-6 text-blue-600" />
              <span>{language === 'en' ? 'Account & Settings' : 'खाता और सेटिंग्स'}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {language === 'en'
                ? 'Manage your profile, preferences, security, subscription and account settings.'
                : 'अपनी प्रोफ़ाइल, प्राथमिकताएं, सुरक्षा, सदस्यता और खाता सेटिंग्स प्रबंधित करें।'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
            <button
              onClick={() => setIsSignOutModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>{language === 'en' ? 'Sign Out' : 'लॉग आउट'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {/* ========================================================================= */}
        {/* MOBILE VIEW (lg:hidden) — Matches Reference Poster Mobile Screens */}
        {/* ========================================================================= */}
        <div className="lg:hidden space-y-4">
          {/* Mobile Profile Summary Card (Matches Reference Poster Screen) */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-md overflow-hidden">
                  {userProfile.avatarUrl ? (
                    <img src={userProfile.avatarUrl} alt={userProfile.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{fullName.charAt(0)}</span>
                  )}
                </div>
                <button
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="absolute -bottom-1 -right-1 p-1 bg-white text-slate-700 rounded-full shadow-md border border-slate-200"
                >
                  <Camera className="w-3 h-3 text-blue-600" />
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-slate-900">{fullName}</h2>
                </div>
                <p className="text-xs text-slate-500 truncate max-w-[180px]">{userProfile.email}</p>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 mt-1 bg-amber-50 text-amber-800 text-[10px] font-bold rounded-full border border-amber-200">
                  <Crown className="w-3 h-3 text-amber-600 fill-amber-600" />
                  <span>{subscription.planName || 'Pro Plan'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveSection('profile');
                setMobileActiveSection('profile');
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
            >
              {language === 'en' ? 'Edit Profile' : 'संपादित करें'}
            </button>
          </div>

          {/* Mobile Settings Category List (Cards with Chevrons) */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {/* 1. Business Profiles */}
            <div
              onClick={() => navigate('/user/business-profiles')}
              className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {language === 'en' ? 'Business Profiles' : 'बिजनेस प्रोफाइल्स'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {language === 'en' ? 'Manage your business information' : 'सक्रिय उद्योग श्रेणी और प्रोफाइल'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* 2. Preferences */}
            <div
              onClick={() => {
                setActiveSection('preferences');
                setMobileActiveSection('preferences');
              }}
              className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {language === 'en' ? 'Preferences' : 'ऐप प्राथमिकताएं'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {language === 'en' ? 'Content preferences and default settings' : 'भाषा, वीडियो प्रारूप और डिफॉल्ट'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* 3. Notification Settings */}
            <div
              onClick={() => {
                setActiveSection('notifications');
                setMobileActiveSection('notifications');
              }}
              className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {language === 'en' ? 'Notification Settings' : 'सूचना प्राथमिकताएं'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {language === 'en' ? 'Manage your notification preferences' : 'अलर्ट और संदेश प्राथमिकताएं'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* 4. Subscription */}
            <div
              onClick={() => navigate('/user/subscription')}
              className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Crown className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {language === 'en' ? 'Subscription' : 'सब्सक्रिप्शन प्लान'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {language === 'en' ? 'View and manage your plan' : 'वर्तमान प्लान और नवीनीकरण'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* 5. Payments & Billing */}
            <div
              onClick={() => navigate('/user/billing')}
              className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {language === 'en' ? 'Payments & Billing' : 'भुगतान और बिलिंग'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {language === 'en' ? 'Invoices, payment methods and history' : 'चालान, रसीदें और भुगतान इतिहास'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* 6. Security */}
            <div
              onClick={() => {
                setActiveSection('security');
                setMobileActiveSection('security');
              }}
              className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {language === 'en' ? 'Security' : 'खाता सुरक्षा'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {language === 'en' ? 'Change password, 2FA and security settings' : 'पासवर्ड, 2FA और सक्रिय सत्र'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* 7. Privacy */}
            <div
              onClick={() => {
                setActiveSection('privacy');
                setMobileActiveSection('privacy');
              }}
              className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {language === 'en' ? 'Privacy' : 'गोपनीयता और डेटा'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {language === 'en' ? 'Manage your privacy settings and export data' : 'डेटा डाउनलोड और गोपनीयता'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* 8. Help & Support */}
            <div
              onClick={() => navigate('/user/help')}
              className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {language === 'en' ? 'Help & Support' : 'सहायता और संपर्क'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {language === 'en' ? 'Get help and contact support' : 'सामान्य प्रश्न और सहायता टीम'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* 9. Delete Account */}
            <div
              onClick={() => setIsDeleteAccountModalOpen(true)}
              className="p-4 flex items-center justify-between hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-rose-600">
                    {language === 'en' ? 'Delete Account' : 'खाता हटाएं'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {language === 'en' ? 'Permanently delete your account and data' : 'खाता और सभी सामग्री स्थायी रूप से हटाएं'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-rose-400" />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP LAYOUT (hidden lg:grid) — Matches Reference Poster Desktop View */}
        {/* ========================================================================= */}
        <div className="hidden lg:grid grid-cols-12 gap-6 items-start">
          {/* Left Sub-Navigation Menu Column (col-span-3) */}
          <div className="col-span-3 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-2 space-y-1">
              <button
                onClick={() => setActiveSection('profile')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeSection === 'profile'
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4" />
                <span>{language === 'en' ? 'Profile' : 'प्रोफ़ाइल'}</span>
              </button>

              <button
                onClick={() => navigate('/user/business-profiles')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
              >
                <span className="flex items-center gap-3">
                  <Briefcase className="w-4 h-4" />
                  <span>{language === 'en' ? 'Business Profiles' : 'बिजनेस प्रोफाइल्स'}</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveSection('preferences')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeSection === 'preferences'
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>{language === 'en' ? 'Preferences' : 'प्राथमिकताएं'}</span>
              </button>

              <button
                onClick={() => setActiveSection('notifications')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeSection === 'notifications'
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>{language === 'en' ? 'Notification Settings' : 'सूचना सेटिंग्स'}</span>
              </button>

              <button
                onClick={() => navigate('/user/subscription')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
              >
                <span className="flex items-center gap-3">
                  <Crown className="w-4 h-4" />
                  <span>{language === 'en' ? 'Subscription' : 'सब्सक्रिप्शन'}</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => navigate('/user/billing')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
              >
                <span className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4" />
                  <span>{language === 'en' ? 'Payments & Billing' : 'भुगतान और बिलिंग'}</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveSection('security')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeSection === 'security'
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>{language === 'en' ? 'Security' : 'सुरक्षा'}</span>
              </button>

              <button
                onClick={() => setActiveSection('privacy')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeSection === 'privacy'
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>{language === 'en' ? 'Privacy' : 'गोपनीयता'}</span>
              </button>

              <button
                onClick={() => navigate('/user/help')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
              >
                <span className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4" />
                  <span>{language === 'en' ? 'Help & Support' : 'सहायता'}</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => setIsDeleteAccountModalOpen(true)}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{language === 'en' ? 'Delete Account' : 'खाता हटाएं'}</span>
                </button>
              </div>
            </div>

            {/* Need Help Card (Matches Desktop Reference Mockup) */}
            <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white">
                  {language === 'en' ? 'Need Help?' : 'सहायता चाहिए?'}
                </span>
              </div>
              <p className="text-[11px] text-blue-200 leading-relaxed">
                {language === 'en'
                  ? 'Have questions about credit usage, subscription plans, or content export?'
                  : 'क्रेडिट, प्लान्स या एक्सपोर्ट संबंधी सहायता के लिए संपर्क करें।'}
              </p>
              <button
                onClick={() => navigate('/user/help')}
                className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-all text-center block"
              >
                {language === 'en' ? 'Contact Support' : 'सपोर्ट से जुड़ें'}
              </button>
            </div>
          </div>

          {/* Center Main Content Area (col-span-6) */}
          <div className="col-span-6 space-y-6">
            {/* 1. Profile Section */}
            {activeSection === 'profile' && (
              <div className="space-y-6">
                {/* Profile Information Card */}
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {language === 'en' ? 'Profile Information' : 'व्यक्तिगत जानकारी'}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {language === 'en'
                          ? 'Update your personal information and creator details.'
                          : 'अपनी व्यक्तिगत जानकारी और क्रिएटर प्रोफ़ाइल अपडेट करें।'}
                      </p>
                    </div>

                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95"
                    >
                      {language === 'en' ? 'Save Changes' : 'सुरक्षित करें'}
                    </button>
                  </div>

                  {/* Profile Header Block */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-md overflow-hidden">
                        {userProfile.avatarUrl ? (
                          <img src={userProfile.avatarUrl} alt={userProfile.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{fullName.charAt(0)}</span>
                        )}
                      </div>
                      <button
                        onClick={() => setIsAvatarModalOpen(true)}
                        className="absolute -bottom-1 -right-1 p-1.5 bg-white text-slate-700 rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
                        title="Change Photo"
                      >
                        <Camera className="w-3.5 h-3.5 text-blue-600" />
                      </button>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-extrabold text-slate-900">{fullName}</h4>
                        <span className="px-2.5 py-0.5 text-[11px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200 rounded-full flex items-center gap-1">
                          <Crown className="w-3 h-3 fill-blue-600" />
                          <span>{subscription.planName || 'Pro Plan'}</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{userProfile.email}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {language === 'en' ? 'Member since 12 Mar 2024' : 'सदस्य: 12 मार्च 2024 से'}
                      </p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">
                          {language === 'en' ? 'Full Name' : 'पूरा नाम'}
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1 flex items-center justify-between">
                          <span>{language === 'en' ? 'Email Address' : 'ईमेल पता'}</span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            <span>Protected</span>
                          </span>
                        </label>
                        <input
                          type="email"
                          value={userProfile.email}
                          disabled
                          className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-medium text-slate-500 cursor-not-allowed"
                        />
                        <span className="text-[10px] text-slate-400 mt-0.5 block">
                          {language === 'en'
                            ? 'Protected authentication identifier (Google Sign-In)'
                            : 'प्रमाणीकरण पहचानकर्ता (परिवर्तन प्रतिबंधित)'}
                        </span>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">
                          {language === 'en' ? 'Phone Number' : 'फ़ोन नंबर'}
                        </label>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">
                          {language === 'en' ? 'Location / City' : 'स्थान / शहर'}
                        </label>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="Orchha, Madhya Pradesh"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">
                        {language === 'en' ? 'Creator Bio / Tagline' : 'बायो / विवरण'}
                      </label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </form>
                </div>

                {/* Bottom 2-Card Grid (Change Password + Two-Factor Authentication) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Change Password Card */}
                  <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {language === 'en' ? 'Change Password' : 'पासवर्ड बदलें'}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {language === 'en'
                          ? 'Update your password to keep your account secure.'
                          : 'खाता सुरक्षित रखने के लिए नियमित रूप से पासवर्ड बदलें।'}
                      </p>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="space-y-2.5 text-xs">
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">
                          {language === 'en' ? 'Current Password' : 'वर्तमान पासवर्ड'}
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showCurrentPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">
                          {language === 'en' ? 'New Password' : 'नया पासवर्ड'}
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="At least 8 characters"
                            className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">
                          {language === 'en' ? 'Confirm New Password' : 'नया पासवर्ड पुष्टि करें'}
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter new password"
                            className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full mt-2 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
                      >
                        {language === 'en' ? 'Update Password' : 'पासवर्ड अपडेट करें'}
                      </button>
                    </form>
                  </div>

                  {/* Two-Factor Authentication Card */}
                  <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                        <h4 className="text-sm font-bold text-slate-900">
                          {language === 'en' ? 'Two-Factor Authentication' : 'टू-फैक्टर ऑथेंटिकेशन (2FA)'}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {language === 'en'
                          ? 'Add an extra layer of security using an authenticator app (Google Authenticator, Authy).'
                          : 'ऑथेंटिकेटर ऐप के माध्यम से अपने खाते में अतिरिक्त सुरक्षा जोड़ें।'}
                      </p>

                      <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2.5 h-2.5 rounded-full ${
                              twoFactorEnabled ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          <span className="text-xs font-bold text-slate-800">
                            Status: {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {twoFactorEnabled ? 'Active' : 'Not configured'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIs2faModalOpen(true)}
                      className={`w-full py-2.5 font-bold text-xs rounded-xl transition-all shadow-sm ${
                        twoFactorEnabled
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {twoFactorEnabled
                        ? language === 'en'
                          ? 'Configure / Disable 2FA'
                          : '2FA कॉन्फ़िगर करें'
                        : language === 'en'
                        ? 'Enable 2FA'
                        : '2FA सक्रिय करें'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Preferences Section */}
            {activeSection === 'preferences' && (
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {language === 'en' ? 'Application & Content Preferences' : 'ऐप और कंटेंट प्राथमिकताएं'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {language === 'en'
                      ? 'Customize language, default video formats, and editor workflow.'
                      : 'भाषा, डिफॉल्ट वीडियो प्रारूप और कार्यप्रवाह प्राथमिकताएं सेट करें।'}
                  </p>
                </div>

                <form onSubmit={handleSavePreferences} className="space-y-4 text-xs">
                  {/* Language Selector */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <label className="block text-slate-800 font-bold">
                      {language === 'en' ? 'Application Language' : 'ऐप भाषा'}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setLanguage('en');
                          setAppPreferences({ ...appPreferences, language: 'en' });
                          showToast('Language set to English');
                        }}
                        className={`p-3 rounded-xl border font-bold text-xs text-left transition-all ${
                          language === 'en'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        English (Default)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setLanguage('hi');
                          setAppPreferences({ ...appPreferences, language: 'hi' });
                          showToast('भाषा हिन्दी चुनी गई');
                        }}
                        className={`p-3 rounded-xl border font-bold text-xs text-left transition-all ${
                          language === 'hi'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        हिन्दी (Hindi)
                      </button>
                    </div>
                  </div>

                  {/* Video Format Default */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <label className="block text-slate-800 font-bold">
                      {language === 'en' ? 'Default Content Format' : 'डिफ़ॉल्ट कंटेंट प्रारूप'}
                    </label>
                    <div className="grid grid-cols-3 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setAppPreferences({ ...appPreferences, defaultVideoFormat: '9:16' })}
                        className={`p-2.5 rounded-xl border font-bold text-xs text-center transition-all ${
                          appPreferences.defaultVideoFormat === '9:16'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        9:16 (Reels/Shorts)
                      </button>
                      <button
                        type="button"
                        onClick={() => setAppPreferences({ ...appPreferences, defaultVideoFormat: '16:9' })}
                        className={`p-2.5 rounded-xl border font-bold text-xs text-center transition-all ${
                          appPreferences.defaultVideoFormat === '16:9'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        16:9 (YouTube)
                      </button>
                      <button
                        type="button"
                        onClick={() => setAppPreferences({ ...appPreferences, defaultVideoFormat: '1:1' })}
                        className={`p-2.5 rounded-xl border font-bold text-xs text-center transition-all ${
                          appPreferences.defaultVideoFormat === '1:1'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        1:1 (Post/Feed)
                      </button>
                    </div>
                  </div>

                  {/* Export Resolution */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <label className="block text-slate-800 font-bold">
                      {language === 'en' ? 'Default Export Quality' : 'एक्सपोर्ट गुणवत्ता'}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setAppPreferences({ ...appPreferences, defaultExportResolution: '1080p' })}
                        className={`p-3 rounded-xl border font-bold text-xs text-left transition-all ${
                          appPreferences.defaultExportResolution === '1080p'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        1080p Full HD (Pro Plan)
                      </button>
                      <button
                        type="button"
                        onClick={() => setAppPreferences({ ...appPreferences, defaultExportResolution: '720p' })}
                        className={`p-3 rounded-xl border font-bold text-xs text-left transition-all ${
                          appPreferences.defaultExportResolution === '720p'
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        720p Standard HD
                      </button>
                    </div>
                  </div>

                  {/* Auto-Save Drafts */}
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block">
                        {language === 'en' ? 'Auto-Save Script Drafts' : 'स्क्रिप्ट ड्राफ्ट स्वतः सुरक्षित करें'}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {language === 'en' ? 'Automatically save script revisions every 30 seconds' : 'हर 30 सेकंड में स्वतः सुरक्षित करें'}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={appPreferences.autoSaveDrafts}
                      onChange={(e) => setAppPreferences({ ...appPreferences, autoSaveDrafts: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                    >
                      {language === 'en' ? 'Save Preferences' : 'प्राथमिकताएं सुरक्षित करें'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 3. Notification Settings Section */}
            {activeSection === 'notifications' && (
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {language === 'en' ? 'Notification Preferences' : 'सूचना प्राथमिकताएं'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {language === 'en'
                        ? 'Control which alerts appear in your Notification Center and email.'
                        : 'इन-ऐप अलर्ट और ईमेल संदेशों को नियंत्रित करें।'}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate('/user/notifications')}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <span>{language === 'en' ? 'View Notifications' : 'सूचना केंद्र'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block">
                        {language === 'en' ? 'In-App Alerts' : 'इन-ऐप अलर्ट्स'}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {language === 'en' ? 'Receive real-time alerts when scripts, research or exports finish' : 'स्क्रिप्ट और वीडियो तैयार होने पर सूचना'}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={appPreferences.inAppNotifications}
                      onChange={(e) => setAppPreferences({ ...appPreferences, inAppNotifications: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block">
                        {language === 'en' ? 'Low Credit Threshold Warning (< 200 Credits)' : 'कम क्रेडिट चेतावनी (< 200 क्रेडिट्स)'}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {language === 'en' ? 'Proactive notification when balance approaches depletion' : 'क्रेडिट समाप्त होने से पहले सतर्कता संदेश'}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={appPreferences.creditThresholdAlerts}
                      onChange={(e) => setAppPreferences({ ...appPreferences, creditThresholdAlerts: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block">
                        {language === 'en' ? 'Email Monthly Digest & Account Updates' : 'मासिक ईमेल सारांश'}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {language === 'en' ? 'Sent to your registered email address' : 'आपके पंजीकृत ईमेल पर भेजा जाएगा'}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={appPreferences.emailNotifications}
                      onChange={(e) => setAppPreferences({ ...appPreferences, emailNotifications: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => {
                        saveUserPreferences(appPreferences);
                        showToast(language === 'en' ? 'Notification preferences saved' : 'सूचना प्राथमिकताएं सुरक्षित की गईं');
                      }}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                    >
                      {language === 'en' ? 'Save Notification Settings' : 'सेटिंग्स सुरक्षित करें'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Security Section */}
            {activeSection === 'security' && (
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {language === 'en' ? 'Security & Active Sessions' : 'सुरक्षा और सक्रिय सत्र'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {language === 'en'
                      ? 'Review active devices and manage account authentication options.'
                      : 'सक्रिय डिवाइसेज और खाता सुरक्षा की समीक्षा करें।'}
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <span className="font-bold text-slate-900 block">
                      {language === 'en' ? 'Active Sessions & Devices' : 'सक्रिय सत्र और उपकरण'}
                    </span>

                    <div className="space-y-2">
                      <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Laptop className="w-5 h-5 text-blue-600 shrink-0" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">Windows PC — Google Chrome</span>
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                                Current
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400">Orchha, MP, India • IP: 103.212.xx.xx</span>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-600">Active now</span>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Smartphone className="w-5 h-5 text-slate-600 shrink-0" />
                          <div>
                            <span className="font-bold text-slate-900">Android Phone — Scripter Mobile PWA</span>
                            <span className="text-[11px] text-slate-400 block">Orchha, MP, India • 2 hours ago</span>
                          </div>
                        </div>
                        <button
                          onClick={() => showToast(language === 'en' ? 'Session revoked' : 'सत्र समाप्त किया गया')}
                          className="text-[11px] font-bold text-rose-600 hover:underline"
                        >
                          Revoke
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => showToast(language === 'en' ? 'Signed out of all other devices' : 'अन्य सभी सत्र समाप्त किए गए')}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                    >
                      {language === 'en' ? 'Sign Out of All Other Devices' : 'अन्य सभी सत्रों से लॉग आउट करें'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Privacy & Data Archive Section */}
            {activeSection === 'privacy' && (
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {language === 'en' ? 'Privacy & Data Controls' : 'गोपनीयता और डेटा नियंत्रण'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {language === 'en'
                      ? 'Download your content data or review our strict data retention standards.'
                      : 'अपनी सामग्री का बैकअप लें और गोपनीयता मानकों की समीक्षा करें।'}
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <span className="font-bold text-slate-900 block">
                      {language === 'en' ? 'Export Complete Account Archive (JSON)' : 'संपूर्ण डेटा बैकअप डाउनलोड करें (JSON)'}
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      {language === 'en'
                        ? 'Download an encrypted JSON export of your user profile, active business profiles, generated video scripts, thumbnails, and credit ledger records.'
                        : 'अपनी प्रोफ़ाइल, स्क्रिप्ट्स, विजुअल्स और क्रेडिट इतिहास का संपूर्ण बैकअप डाउनलोड करें।'}
                    </p>
                    <button
                      onClick={handleExportData}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>{language === 'en' ? 'Download JSON Archive' : 'डेटा डाउनलोड करें'}</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <span className="font-bold text-slate-900 block">
                      {language === 'en' ? 'Zero AI Training on Private Creator Data' : 'निजी डेटा पर शून्य AI प्रशिक्षण'}
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      {language === 'en'
                        ? 'Your business niche, proprietary prompts, audio recordings, and brand kit assets are never used to train foundational AI models without explicit opt-in consent.'
                        : 'आपके व्यक्तिगत प्रॉम्प्ट्स और वीडियो कंटेंट का उपयोग AI मॉडल प्रशिक्षण के लिए नहीं किया जाता।'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Account Status & Quick Actions (col-span-3) */}
          <div className="col-span-3 space-y-5">
            {/* Account Status Card (Matches Reference Mockup) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {language === 'en' ? 'Account Status' : 'खाता स्थिति'}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                  Active
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/20 shrink-0">
                  <Crown className="w-6 h-6 fill-white" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-slate-900">
                    {subscription.planName || 'Pro Plan'}
                  </h4>
                  <span className="text-[11px] text-slate-400 block">
                    Member since 12 Mar 2024
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>{language === 'en' ? 'Next renewal:' : 'अगला नवीनीकरण:'}</span>
                  <span className="font-bold text-slate-900">10 Nov 2026</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{language === 'en' ? 'AI Credits:' : 'एआई क्रेडिट्स:'}</span>
                  <span className="font-bold text-blue-600">{creditsInfo.totalAvailable} left</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/user/subscription')}
                className="w-full mt-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all text-center block"
              >
                {language === 'en' ? 'Manage Plan' : 'प्लान प्रबंधित करें'}
              </button>
            </div>

            {/* Quick Actions Card (Matches Reference Mockup) */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {language === 'en' ? 'Quick Actions' : 'त्वरित विकल्प'}
              </span>

              <div className="divide-y divide-slate-100 text-xs">
                <div
                  onClick={() => navigate('/user/subscription')}
                  className="py-2.5 flex items-center justify-between hover:text-blue-600 transition-colors cursor-pointer group"
                >
                  <div>
                    <span className="font-bold text-slate-900 group-hover:text-blue-600 block">
                      {language === 'en' ? 'View Subscription' : 'सब्सक्रिप्शन देखें'}
                    </span>
                    <span className="text-[11px] text-slate-400">See current plan details</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>

                <div
                  onClick={() => navigate('/user/billing')}
                  className="py-2.5 flex items-center justify-between hover:text-blue-600 transition-colors cursor-pointer group"
                >
                  <div>
                    <span className="font-bold text-slate-900 group-hover:text-blue-600 block">
                      {language === 'en' ? 'Manage Billing' : 'बिलिंग प्रबंधित करें'}
                    </span>
                    <span className="text-[11px] text-slate-400">Invoices and payment history</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>

                <div
                  onClick={() => setActiveSection('security')}
                  className="py-2.5 flex items-center justify-between hover:text-blue-600 transition-colors cursor-pointer group"
                >
                  <div>
                    <span className="font-bold text-slate-900 group-hover:text-blue-600 block">
                      {language === 'en' ? 'Security Settings' : 'सुरक्षा सेटिंग्स'}
                    </span>
                    <span className="text-[11px] text-slate-400">Password, 2FA and login security</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>

                <div
                  onClick={() => setActiveSection('notifications')}
                  className="py-2.5 flex items-center justify-between hover:text-blue-600 transition-colors cursor-pointer group"
                >
                  <div>
                    <span className="font-bold text-slate-900 group-hover:text-blue-600 block">
                      {language === 'en' ? 'Notification Preferences' : 'सूचना प्राथमिकताएं'}
                    </span>
                    <span className="text-[11px] text-slate-400">Manage what you want to receive</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODALS & CONFIRMATION DIALOGS */}
      {/* ========================================================================= */}

      {/* 1. Two-Factor Authentication Modal */}
      {is2faModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIs2faModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <QrCode className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900">
              {twoFactorEnabled
                ? language === 'en'
                  ? 'Disable Two-Factor Authentication'
                  : '2FA निष्क्रिय करें'
                : language === 'en'
                ? 'Setup Two-Factor Authentication'
                : 'टू-फैक्टर ऑथेंटिकेशन सेटअप'}
            </h3>

            <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
              {twoFactorEnabled
                ? language === 'en'
                  ? 'Enter code from your authenticator app to confirm disabling 2FA protection.'
                  : '2FA सुरक्षा हटाने के लिए अपने ऑथेंटिकेटर ऐप से 6 अंकों का कोड दर्ज करें।'
                : language === 'en'
                ? 'Scan this QR code with Google Authenticator, Microsoft Authenticator, or Authy, then enter the 6-digit verification code.'
                : 'Google Authenticator या Authy ऐप से स्कैन करें और 6 अंकों का कोड दर्ज करें।'}
            </p>

            {!twoFactorEnabled && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2 mb-4">
                <div className="w-32 h-32 bg-white border border-slate-300 rounded-xl mx-auto flex items-center justify-center shadow-inner">
                  <QrCode className="w-24 h-24 text-slate-800" />
                </div>
                <div className="font-mono text-[11px] text-slate-600 font-bold bg-white px-3 py-1.5 rounded-lg border border-slate-200 inline-block">
                  SCRIPTER-AUTH-7X92-K8M4
                </div>
              </div>
            )}

            <form onSubmit={handleVerify2fa} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  {language === 'en' ? '6-Digit TOTP Verification Code' : '6 अंकों का कोड'}
                </label>
                <input
                  type="text"
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  maxLength={6}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-center tracking-widest text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIs2faModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-white font-bold rounded-xl transition-all shadow-sm ${
                    twoFactorEnabled ? 'bg-rose-600 hover:bg-rose-700' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {twoFactorEnabled ? 'Confirm Disable' : 'Verify & Enable'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Avatar Selection Modal */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsAvatarModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              {language === 'en' ? 'Change Profile Avatar' : 'प्रोफ़ाइल फोटो बदलें'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {language === 'en' ? 'Choose a preset avatar or use brand logo' : 'एक पूर्व-निर्धारित अवतार चुनें'}
            </p>

            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                '/assets/aistudio/Square_Scripter_Logo_d7bb9aeb.png',
                '/assets/aistudio/FAVICON_be6b72fd.png'
              ].map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    updateUserProfile({ avatarUrl: url });
                    setIsAvatarModalOpen(false);
                    showToast(language === 'en' ? 'Avatar updated' : 'अवतार बदला गया');
                  }}
                  className="w-16 h-16 rounded-2xl border-2 border-slate-200 hover:border-blue-600 p-1 transition-all overflow-hidden mx-auto"
                >
                  <img src={url} alt="preset" className="w-full h-full object-cover rounded-xl" />
                </button>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Delete Account Confirmation Modal (Danger Zone) */}
      {isDeleteAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-200 relative">
            <button
              onClick={() => setIsDeleteAccountModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900">
              {language === 'en' ? 'Permanently Delete Account?' : 'खाता स्थायी रूप से हटाएं?'}
            </h3>

            <p className="text-xs text-rose-700 mt-1 mb-4 leading-relaxed font-medium">
              {language === 'en'
                ? 'Warning: This action is permanent and cannot be undone. All your projects, generated scripts, business profiles, and unused AI credit balances will be irreversibly erased.'
                : 'चेतावनी: यह क्रिया स्थायी है और इसे वापस नहीं लिया जा सकता। आपके सभी प्रोजेक्ट, स्क्रिप्ट्स, और शेष क्रेडिट स्थायी रूप से नष्ट हो जाएंगे।'}
            </p>

            <div className="space-y-3 text-xs mb-5">
              <label className="block text-slate-700 font-bold">
                {language === 'en' ? 'To confirm deletion, please type "DELETE" below:' : 'पुष्टि के लिए नीचे "DELETE" टाइप करें:'}
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3 py-2 bg-rose-50/50 border border-rose-200 rounded-xl font-mono text-slate-800 font-bold uppercase focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsDeleteAccountModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all text-xs"
              >
                {language === 'en' ? 'Keep My Account' : 'रद्द करें'}
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText.trim().toUpperCase() !== 'DELETE'}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-sm text-xs cursor-pointer disabled:cursor-not-allowed"
              >
                {language === 'en' ? 'Permanently Delete' : 'स्थायी रूप से हटाएं'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Sign Out Confirmation Modal */}
      {isSignOutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 relative text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto mb-3">
              <LogOut className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900">
              {language === 'en' ? 'Sign out of Scripter?' : 'लॉग आउट करना चाहते हैं?'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              {language === 'en'
                ? 'Your active drafts and business profiles will remain securely saved.'
                : 'आपकी सामग्री सुरक्षित रहेगी। आप कभी भी पुनः लॉग इन कर सकते हैं।'}
            </p>

            <div className="flex items-center justify-center gap-3 text-xs">
              <button
                onClick={() => setIsSignOutModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
              >
                {language === 'en' ? 'Cancel' : 'रद्द करें'}
              </button>
              <button
                onClick={handleSignOut}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-sm"
              >
                {language === 'en' ? 'Yes, Sign Out' : 'हाँ, लॉग आउट करें'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
