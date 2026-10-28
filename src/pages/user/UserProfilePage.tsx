import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRole } from '../../context/RoleContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  User,
  Camera,
  Globe,
  Youtube,
  Instagram,
  Twitter,
  Linkedin,
  Check,
  ExternalLink,
  Sparkles,
  Shield,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Save,
  Upload,
  RefreshCw,
  Crown,
  Link as LinkIcon,
  HelpCircle,
  Copy,
  LogOut,
  Facebook,
  Plus,
  Trash2,
} from 'lucide-react';

export interface CustomSocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface SocialLinks {
  youtube: string;
  instagram: string;
  twitter: string;
  facebook: string;
  linkedin: string;
  website: string;
  customLinks?: CustomSocialLink[];
}

export const UserProfilePage: React.FC = () => {
  const { user, userProfile: authProfile, updateAuthProfile, isAuthenticated, signOutUser } = useAuth();
  const { userProfile: localProfile, updateUserProfile, subscription, activeBusinessProfile } = useRole();
  const { language } = useLanguage();
  const navigate = useNavigate();

  // Form State
  const [displayName, setDisplayName] = useState(
    authProfile?.displayName || localProfile?.name || 'Rituraj Tomar'
  );
  const [avatarUrl, setAvatarUrl] = useState(
    authProfile?.photoURL || localProfile?.avatarUrl || ''
  );
  const [bio, setBio] = useState(
    authProfile?.bio ||
      localProfile?.bio ||
      'AI Content Creator & Filmmaker producing viral short-form videos across India.'
  );

  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    youtube: authProfile?.socialLinks?.youtube || 'https://youtube.com/@scripterai',
    instagram: authProfile?.socialLinks?.instagram || 'https://instagram.com/scripter_creators',
    twitter: authProfile?.socialLinks?.twitter || 'https://x.com/scripter_ai',
    facebook: authProfile?.socialLinks?.facebook || 'https://facebook.com/scripter.ai',
    linkedin: authProfile?.socialLinks?.linkedin || 'https://linkedin.com/in/riturajtomar',
    website: authProfile?.socialLinks?.website || 'https://scripter.app',
    customLinks: authProfile?.socialLinks?.customLinks || [
      { id: 'cl_1', platform: 'Telegram Channel', url: 'https://t.me/scripter_creators' }
    ],
  });

  // Avatar Modal State
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [customAvatarInput, setCustomAvatarInput] = useState('');

  // Status State
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Sync state if authProfile updates from Firebase
  useEffect(() => {
    if (authProfile) {
      if (authProfile.displayName) setDisplayName(authProfile.displayName);
      if (authProfile.photoURL) setAvatarUrl(authProfile.photoURL);
      if (authProfile.bio) setBio(authProfile.bio);
      if (authProfile.socialLinks) {
        setSocialLinks((prev) => ({
          ...prev,
          ...authProfile.socialLinks,
          facebook: authProfile.socialLinks?.facebook || prev.facebook,
          customLinks: authProfile.socialLinks?.customLinks || prev.customLinks,
        }));
      }
    }
  }, [authProfile]);

  const handleSocialChange = (channel: keyof SocialLinks, value: string) => {
    setSocialLinks((prev) => ({
      ...prev,
      [channel]: value,
    }));
  };

  const handleAddCustomLink = () => {
    setSocialLinks((prev) => ({
      ...prev,
      customLinks: [
        ...(prev.customLinks || []),
        { id: `link_${Date.now()}`, platform: '', url: '' },
      ],
    }));
  };

  const handleUpdateCustomLink = (id: string, field: 'platform' | 'url', value: string) => {
    setSocialLinks((prev) => ({
      ...prev,
      customLinks: (prev.customLinks || []).map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleRemoveCustomLink = (id: string) => {
    setSocialLinks((prev) => ({
      ...prev,
      customLinks: (prev.customLinks || []).filter((item) => item.id !== id),
    }));
  };

  const handleCopyLink = (url: string, key: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedLink(key);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSaveSuccess(false);

    if (!displayName.trim()) {
      setErrorMessage(
        language === 'en' ? 'Display name cannot be empty.' : 'नाम रिक्त नहीं हो सकता।'
      );
      return;
    }

    setIsSaving(true);
    try {
      // 1. Update Firebase Auth & Firestore if authenticated
      if (isAuthenticated) {
        await updateAuthProfile({
          displayName: displayName.trim(),
          photoURL: avatarUrl.trim(),
          bio: bio.trim(),
          socialLinks: {
            youtube: socialLinks.youtube.trim(),
            instagram: socialLinks.instagram.trim(),
            twitter: socialLinks.twitter.trim(),
            facebook: socialLinks.facebook.trim(),
            linkedin: socialLinks.linkedin.trim(),
            website: socialLinks.website.trim(),
            customLinks: (socialLinks.customLinks || []).filter((l) => l.url.trim()),
          },
        });
      }

      // 2. Sync local storage / RoleContext state
      updateUserProfile({
        name: displayName.trim(),
        avatarUrl: avatarUrl.trim(),
        bio: bio.trim(),
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update profile settings.');
    } finally {
      setIsSaving(false);
    }
  };

  // Avatar Presets
  const presetAvatars = [
    '/assets/aistudio/FAVICON_be6b72fd.png',
    '/assets/aistudio/Square_Scripter_Logo_d7bb9aeb.png',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage(
          language === 'en'
            ? 'Avatar file size should be less than 2MB'
            : 'अवतार फोटो का आकार 2MB से कम होना चाहिए'
        );
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarUrl(event.target.result as string);
          setIsAvatarModalOpen(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6 pb-52 md:pb-24 space-y-6">
      {/* Top Banner / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 fill-blue-500" />
            <span>{language === 'en' ? 'Creator Identity' : 'क्रिएटर पहचान'}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {language === 'en' ? 'Edit Creator Profile' : 'क्रिएटर प्रोफ़ाइल संपादित करें'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'en'
              ? 'Update your public display name, visual avatar, channel bio, and linked social media accounts.'
              : 'अपना नाम, अवतार फोटो, चैनल बायो और सोशल मीडिया लिंक अपडेट करें।'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={async () => {
              try {
                await signOutUser();
              } catch (err) {
                console.error(err);
              }
              navigate('/login');
            }}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 bg-rose-50/70 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-xs font-bold transition-all active:scale-95"
            title="Sign Out of account"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-500" />
            <span>{language === 'en' ? 'Sign Out' : 'लॉग आउट'}</span>
          </button>

          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Save className="w-4 h-4" />}
            <span>
              {isSaving
                ? language === 'en'
                  ? 'Saving...'
                  : 'सुरक्षित हो रहा है...'
                : language === 'en'
                ? 'Save Profile'
                : 'प्रोफ़ाइल सुरक्षित करें'}
            </span>
          </button>
        </div>
      </div>

      {/* Notifications / Alerts */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">
                {language === 'en'
                  ? 'Profile updated successfully!'
                  : 'प्रोफ़ाइल सफलतापूर्वक सुरक्षित हो गई!'}
              </p>
              <p className="text-emerald-700 text-[11px] mt-0.5">
                {language === 'en'
                  ? 'Your display name, avatar, and social handles are synchronized with Firebase.'
                  : 'आपका नाम, अवतार और सोशल हैंडल्स सुरक्षित कर दिए गए हैं।'}
              </p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-emerald-100 rounded-md font-bold text-emerald-800">
            Synced
          </span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <p className="font-medium text-[11px]">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Card 1: Avatar & Basic Information */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-sm font-bold text-slate-900">
              {language === 'en' ? 'Public Identity' : 'सार्वजनिक पहचान'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'en'
                ? 'How your profile appears to audiences, collaborators, and clients.'
                : 'आपकी प्रोफ़ाइल दर्शकों और सहयोगियों को किस तरह दिखाई देगी।'}
            </p>
          </div>

          {/* Avatar Preview & Actions */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-3xl flex items-center justify-center shadow-md overflow-hidden ring-4 ring-slate-100">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-full h-full object-cover"
                    onError={() => setAvatarUrl('')}
                  />
                ) : (
                  <span>
                    {displayName
                      ? displayName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()
                      : 'RT'}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(true)}
                className="absolute -bottom-2 -right-2 p-2 bg-white text-slate-700 hover:text-blue-600 rounded-xl shadow-md border border-slate-200 hover:bg-slate-50 transition-all active:scale-90"
                title="Change Avatar"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 space-y-3 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h4 className="text-lg font-black text-slate-900">{displayName}</h4>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80 inline-flex items-center gap-1">
                  <Crown className="w-3 h-3 text-blue-600 fill-blue-500" />
                  <span>{subscription?.planName || 'Pro Creator'}</span>
                </span>
                {isAuthenticated && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 inline-flex items-center gap-1">
                    <Shield className="w-3 h-3 text-emerald-600" />
                    <span>Verified</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500">
                {user?.email || authProfile?.email || localProfile?.email || 'riturajtomarorchha@gmail.com'}
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  {language === 'en' ? 'Change Avatar' : 'अवतार बदलें'}
                </button>
                {user?.photoURL && avatarUrl !== user.photoURL && (
                  <button
                    type="button"
                    onClick={() => setAvatarUrl(user.photoURL || '')}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors"
                  >
                    {language === 'en' ? 'Reset to Google Photo' : 'Google फ़ोटो पर रीसेट करें'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Form Fields: Display Name & Bio */}
          <div className="grid grid-cols-1 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {language === 'en' ? 'Display Name' : 'प्रदर्शित नाम'}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Rituraj Tomar"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {language === 'en'
                  ? 'This name will appear on your scripts, video watermark tags, and exports.'
                  : 'यह नाम आपकी स्क्रिप्ट और वीडियो एक्सपोर्ट्स पर दिखाई देगा।'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {language === 'en' ? 'Creator Bio / Channel Tagline' : 'क्रिएटर बायो / टैगलाइन'}
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder={
                  language === 'en'
                    ? 'Tell your audience about your channel, content niche, and mission...'
                    : 'अपने चैनल और कंटेंट के बारे में संक्षिप्त जानकारी लिखें...'
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium leading-relaxed"
              />
              <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                <span>
                  {language === 'en'
                    ? 'Used by AI to fine-tune script tones and brand voice.'
                    : 'AI इसका उपयोग स्क्रिप्ट टोन तय करने में करेगा।'}
                </span>
                <span>{bio.length}/500</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Linked Social Media Accounts */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {language === 'en' ? 'Linked Social Media Accounts' : 'जुड़े सोशल मीडिया खाते'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'en'
                  ? 'Connect your publishing channels for 1-click captions, hashtags, and video distribution.'
                  : 'वीडियो वितरण और हैशटैग जेनरेशन के लिए अपने सोशल चैनल जोड़ें।'}
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              5 Channels
            </span>
          </div>

          <div className="space-y-4">
            {/* YouTube */}
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-red-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <Youtube className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">YouTube Channel</span>
                    <span className="text-[10px] text-slate-400">Shorts, Video Outlines & Scripts</span>
                  </div>
                </div>
                {socialLinks.youtube && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(socialLinks.youtube, 'yt')}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
                      title="Copy URL"
                    >
                      {copiedLink === 'yt' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-200/60 transition-colors"
                      title="Visit Channel"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
              <input
                type="url"
                value={socialLinks.youtube}
                onChange={(e) => handleSocialChange('youtube', e.target.value)}
                placeholder="https://youtube.com/@yourchannel"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-mono"
              />
            </div>

            {/* Instagram */}
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-pink-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-50 via-pink-50 to-purple-50 text-pink-600 flex items-center justify-center shrink-0 border border-pink-100">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Instagram Profile</span>
                    <span className="text-[10px] text-slate-400">Viral Reels & Stories</span>
                  </div>
                </div>
                {socialLinks.instagram && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(socialLinks.instagram, 'ig')}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
                      title="Copy URL"
                    >
                      {copiedLink === 'ig' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-400 hover:text-pink-600 rounded-lg hover:bg-slate-200/60 transition-colors"
                      title="Visit Profile"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
              <input
                type="url"
                value={socialLinks.instagram}
                onChange={(e) => handleSocialChange('instagram', e.target.value)}
                placeholder="https://instagram.com/yourhandle"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all font-mono"
              />
            </div>

            {/* Twitter / X */}
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-400 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center shrink-0">
                    <Twitter className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">X (Twitter) Handle</span>
                    <span className="text-[10px] text-slate-400">Threads, Video Hooks & Commentary</span>
                  </div>
                </div>
                {socialLinks.twitter && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(socialLinks.twitter, 'tw')}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
                      title="Copy URL"
                    >
                      {copiedLink === 'tw' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition-colors"
                      title="Visit Profile"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
              <input
                type="url"
                value={socialLinks.twitter}
                onChange={(e) => handleSocialChange('twitter', e.target.value)}
                placeholder="https://x.com/yourhandle"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-500/20 focus:border-slate-700 transition-all font-mono"
              />
            </div>

            {/* Facebook */}
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-blue-400 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Facebook className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      {language === 'en' ? 'Facebook Page / Profile' : 'फेसबुक पेज / प्रोफ़ाइल'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {language === 'en' ? 'Meta Page, Community Group or Profile' : 'मेटा पेज, कम्युनिटी या प्रोफ़ाइल'}
                    </span>
                  </div>
                </div>
                {socialLinks.facebook && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(socialLinks.facebook, 'fb')}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
                      title="Copy URL"
                    >
                      {copiedLink === 'fb' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-200/60 transition-colors"
                      title="Visit Facebook"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
              <input
                type="url"
                value={socialLinks.facebook}
                onChange={(e) => handleSocialChange('facebook', e.target.value)}
                placeholder="https://facebook.com/yourpage"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-mono"
              />
            </div>

            {/* LinkedIn */}
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-blue-400 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <Linkedin className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">LinkedIn Profile</span>
                    <span className="text-[10px] text-slate-400">Professional Thought Leadership</span>
                  </div>
                </div>
                {socialLinks.linkedin && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(socialLinks.linkedin, 'li')}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
                      title="Copy URL"
                    >
                      {copiedLink === 'li' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-400 hover:text-blue-700 rounded-lg hover:bg-slate-200/60 transition-colors"
                      title="Visit Profile"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
              <input
                type="url"
                value={socialLinks.linkedin}
                onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/yourprofile"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-mono"
              />
            </div>

            {/* Website / Portfolio */}
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-emerald-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Creator Website / Portfolio</span>
                    <span className="text-[10px] text-slate-400">Landing Page, Store & Media Kit</span>
                  </div>
                </div>
                {socialLinks.website && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(socialLinks.website, 'web')}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
                      title="Copy URL"
                    >
                      {copiedLink === 'web' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-400 hover:text-emerald-700 rounded-lg hover:bg-slate-200/60 transition-colors"
                      title="Visit Site"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
              <input
                type="url"
                value={socialLinks.website}
                onChange={(e) => handleSocialChange('website', e.target.value)}
                placeholder="https://yourbrand.com"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-mono"
              />
            </div>

            {/* Dynamic Custom Social / Website Links */}
            {(socialLinks.customLinks || []).map((item, index) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-200/80 hover:border-indigo-300 transition-colors space-y-2 animate-in fade-in"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                      <LinkIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-900">
                      {item.platform || (language === 'en' ? `Custom Link #${index + 1}` : `कस्टम लिंक #${index + 1}`)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {item.url && (
                      <a
                        href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-100/60 transition-colors"
                        title="Visit Link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomLink(item.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-100 transition-colors"
                      title={language === 'en' ? 'Remove link' : 'हटाएं'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={item.platform}
                    onChange={(e) => handleUpdateCustomLink(item.id, 'platform', e.target.value)}
                    placeholder={language === 'en' ? 'Platform Name (e.g. Telegram, Threads)' : 'प्लेटफ़ॉर्म (उदा. Telegram, Threads)'}
                    className="sm:col-span-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                  <input
                    type="url"
                    value={item.url}
                    onChange={(e) => handleUpdateCustomLink(item.id, 'url', e.target.value)}
                    placeholder="https://..."
                    className="sm:col-span-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono"
                  />
                </div>
              </div>
            ))}

            {/* Add Custom Social / Website Link Button */}
            <button
              type="button"
              onClick={handleAddCustomLink}
              className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl border-2 border-dashed border-blue-300 dark:border-blue-700/60 bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-100/50 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold transition-all active:scale-98"
            >
              <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>
                {language === 'en'
                  ? '+ Add Custom Social / Website Link (Threads, Telegram, WhatsApp...)'
                  : '+ कस्टम सोशल या वेबसाइट लिंक जोड़ें (Threads, Telegram, WhatsApp...)'}
              </span>
            </button>
          </div>
        </div>

        {/* Action Button Footer with safe clearance above mobile bottom nav */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-6 pb-6">
          <button
            type="button"
            onClick={async () => {
              try {
                await signOutUser();
              } catch (err) {
                console.error(err);
              }
              navigate('/login');
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl border-2 border-rose-300 dark:border-rose-800/80 bg-rose-50/80 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 text-sm font-bold transition-all active:scale-98 min-h-[48px]"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            <span>{language === 'en' ? 'Sign Out / Log Out' : 'साइन आउट / लॉग आउट'}</span>
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-600/30 transition-all active:scale-98 disabled:opacity-50 w-full sm:w-auto min-h-[48px]"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <Save className="w-4 h-4" />}
            <span>
              {isSaving
                ? language === 'en'
                  ? 'Saving Changes...'
                  : 'सुरक्षित हो रहा है...'
                : language === 'en'
                ? 'Save Profile & Socials'
                : 'प्रोफ़ाइल एवं सोशल सुरक्षित करें'}
            </span>
          </button>
        </div>

        {/* Generous clearance block specifically for mobile to guarantee zero clipping behind the fixed bottom nav bar */}
        <div className="h-28 md:hidden pointer-events-none" aria-hidden="true" />
      </form>

      {/* Avatar Selection Modal */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'en' ? 'Select Profile Avatar' : 'प्रोफ़ाइल फोटो चुनें'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'en'
                    ? 'Upload an image, pick a preset avatar, or enter a URL.'
                    : 'फ़ोटो अपलोड करें, पूर्व-निर्धारित अवतार चुनें या URL दर्ज करें।'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Presets Grid */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                {language === 'en' ? 'Preset Creator Avatars' : 'पूर्व-निर्धारित अवतार'}
              </label>
              <div className="grid grid-cols-6 gap-2">
                {presetAvatars.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setAvatarUrl(url);
                      setIsAvatarModalOpen(false);
                    }}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all p-0.5 ${
                      avatarUrl === url
                        ? 'border-blue-600 scale-105 shadow-sm'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover rounded-lg" />
                  </button>
                ))}
              </div>
            </div>

            {/* File Upload Option */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                {language === 'en' ? 'Upload Custom Picture' : 'कस्टम फ़ोटो अपलोड करें'}
              </label>
              <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-2xl cursor-pointer text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 transition-all">
                <Upload className="w-4 h-4" />
                <span>{language === 'en' ? 'Choose Image File (JPG, PNG)' : 'छवि फ़ाइल चुनें'}</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* URL Input Option */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {language === 'en' ? 'Or Enter Image URL' : 'या छवि URL दर्ज करें'}
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={customAvatarInput}
                  onChange={(e) => setCustomAvatarInput(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customAvatarInput.trim()) {
                      setAvatarUrl(customAvatarInput.trim());
                      setIsAvatarModalOpen(false);
                      setCustomAvatarInput('');
                    }
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
