import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useRole } from '../../context/RoleContext';
import { useLanguage } from '../../context/LanguageContext';
import { INITIAL_INDUSTRY_TAXONOMIES } from '../../data/adminMockData';
import {
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  User,
  Phone,
  Mail,
  Camera,
  Briefcase,
  Layers,
  Globe,
  Youtube,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Loader2,
  Check,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const {
    user,
    userProfile,
    isAuthenticated,
    loading: authLoading,
    completeOnboarding,
    saveOnboardingProgress,
  } = useAuth();
  const { addBusinessProfile, updateBusinessProfile, businessProfiles, setActiveBusinessProfile } = useRole();
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();

  // Current Step: 1 (Basic Info) -> 2 (Creator & Business Profile) -> 3 (Social & Contact) -> 4 (Review & Launch)
  const [currentStep, setCurrentStep] = useState<number>(() => userProfile?.onboardingStep || 1);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Fields - Step 1: Basic Information
  const [displayName, setDisplayName] = useState(userProfile?.displayName || user?.displayName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [countryCode, setCountryCode] = useState('+91');
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.photoURL || user?.photoURL || '');

  // Form Fields - Step 2: Creator & Business Profile
  const [creatorType, setCreatorType] = useState(userProfile?.creatorType || 'Solo Creator / YouTuber');
  const [selectedIndustry, setSelectedIndustry] = useState(userProfile?.industry || 'Healthcare & Wellness');
  const [selectedCategory, setSelectedCategory] = useState(userProfile?.category || 'Preventive Health');
  const [organizationName, setOrganizationName] = useState(userProfile?.organizationName || '');
  const [contentGoals, setContentGoals] = useState(userProfile?.contentGoals || 'Grow Audience & Views');
  const [targetAudience, setTargetAudience] = useState(userProfile?.targetAudience || 'General Audience (18-40)');
  const [preferredLanguage, setPreferredLanguage] = useState(userProfile?.preferredLanguage || 'Hindi / English');
  const [preferredTone, setPreferredTone] = useState(userProfile?.preferredTone || 'Educational & Empathetic');
  const [bio, setBio] = useState(userProfile?.bio || '');

  // Form Fields - Step 3: Contact & Social Information
  const [location, setLocation] = useState(userProfile?.location || 'Indore, India');
  const [website, setWebsite] = useState(userProfile?.website || '');
  const [youtube, setYoutube] = useState(userProfile?.socialLinks?.youtube || '');
  const [instagram, setInstagram] = useState(userProfile?.socialLinks?.instagram || '');
  const [twitter, setTwitter] = useState(userProfile?.socialLinks?.twitter || '');
  const [linkedin, setLinkedin] = useState(userProfile?.socialLinks?.linkedin || '');
  const [facebook, setFacebook] = useState(userProfile?.socialLinks?.facebook || '');

  // Dynamic Subcategories from current selected industry
  const currentIndustryObj = INITIAL_INDUSTRY_TAXONOMIES.find((ind) => ind.nameEn === selectedIndustry) || INITIAL_INDUSTRY_TAXONOMIES[0];

  useEffect(() => {
    if (userProfile) {
      if (userProfile.displayName && !displayName) setDisplayName(userProfile.displayName);
      if (userProfile.phone && !phone) setPhone(userProfile.phone);
      if (userProfile.photoURL && !avatarUrl) setAvatarUrl(userProfile.photoURL);
      if (userProfile.creatorType) setCreatorType(userProfile.creatorType);
      if (userProfile.industry) setSelectedIndustry(userProfile.industry);
      if (userProfile.category) setSelectedCategory(userProfile.category);
      if (userProfile.organizationName) setOrganizationName(userProfile.organizationName);
      if (userProfile.contentGoals) setContentGoals(userProfile.contentGoals);
      if (userProfile.targetAudience) setTargetAudience(userProfile.targetAudience);
      if (userProfile.preferredLanguage) setPreferredLanguage(userProfile.preferredLanguage);
      if (userProfile.preferredTone) setPreferredTone(userProfile.preferredTone);
      if (userProfile.bio) setBio(userProfile.bio);
      if (userProfile.location) setLocation(userProfile.location);
      if (userProfile.website) setWebsite(userProfile.website);
      if (userProfile.onboardingStep && currentStep === 1) setCurrentStep(userProfile.onboardingStep);
    }
  }, [userProfile]);

  // When industry changes, default to its first subcategory if current category not in list
  const handleIndustryChange = (industryName: string) => {
    setSelectedIndustry(industryName);
    const ind = INITIAL_INDUSTRY_TAXONOMIES.find((i) => i.nameEn === industryName);
    if (ind && ind.categories && ind.categories.length > 0) {
      if (!ind.categories.includes(selectedCategory)) {
        setSelectedCategory(ind.categories[0]);
      }
    }
  };

  // If not authenticated and not loading, redirect to login
  if (!authLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If already authenticated and onboarding is completed, redirect to /user/home
  if (!authLoading && isAuthenticated && userProfile?.onboardingCompleted) {
    return <Navigate to="/user/home" replace />;
  }

  // Pre-set creator personas
  const CREATOR_PERSONAS = [
    { id: 'Solo Creator / YouTuber', labelEn: 'Solo Creator / YouTuber', labelHi: 'सोलो क्रिएटर / यूट्यूबर', desc: 'Indie creators, vloggers & short-form video producers' },
    { id: 'Brand & Business Owner', labelEn: 'Brand & Business Owner', labelHi: 'ब्रांड व बिजनेस ओनर', desc: 'SMB founders, service providers & commercial brands' },
    { id: 'Educator & Course Coach', labelEn: 'Educator & Course Coach', labelHi: 'शिक्षक व कोच', desc: 'Teachers, test prep mentors & skill trainers' },
    { id: 'Agency & Production Team', labelEn: 'Agency & Production Team', labelHi: 'एजेंसी व प्रोडक्शन टीम', desc: 'Digital marketing agencies & client scriptwriters' },
    { id: 'Freelance Scriptwriter', labelEn: 'Freelance Scriptwriter', labelHi: 'फ्रीलांस स्क्रिप्ट राइटर', desc: 'Professional ghostwriters and content strategists' },
  ];

  const CONTENT_GOALS = [
    'Grow Audience & Subscribers',
    'Generate B2B / Client Leads',
    'Educate & Build Authority',
    'Promote Local Business Services',
    'Monetize Courses & Digital Products',
  ];

  const TONE_OPTIONS = [
    'Educational & Empathetic',
    'Energetic & Inspiring',
    'Authoritative & Professional',
    'Conversational & Casual',
    'Humorous & Relatable',
  ];

  const LANGUAGE_OPTIONS = ['Hindi', 'English', 'Hindi / English (Bilingual)'];

  // Step 1 Validation
  const validateStep1 = () => {
    setErrorMsg(null);
    if (!displayName.trim()) {
      setErrorMsg(language === 'en' ? 'Please enter your full name.' : 'कृपया अपना पूरा नाम दर्ज करें।');
      return false;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      setErrorMsg(
        language === 'en'
          ? 'Please enter a valid mobile number (at least 8-10 digits).'
          : 'कृपया एक मान्य मोबाइल नंबर दर्ज करें।'
      );
      return false;
    }
    return true;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    setErrorMsg(null);
    if (!selectedIndustry) {
      setErrorMsg(language === 'en' ? 'Please select your primary industry.' : 'कृपया अपना प्राथमिक उद्योग चुनें।');
      return false;
    }
    if (!selectedCategory) {
      setErrorMsg(language === 'en' ? 'Please select a content category.' : 'कृपया एक सामग्री श्रेणी चुनें।');
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
      // Auto-save partial progress
      saveOnboardingProgress({
        displayName: displayName.trim(),
        phone: `${countryCode} ${phone.trim()}`,
        photoURL: avatarUrl || user?.photoURL || '',
        onboardingStep: 2,
      }).catch(() => {});
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 2) {
      if (!validateStep2()) return;
      saveOnboardingProgress({
        creatorType,
        industry: selectedIndustry,
        category: selectedCategory,
        organizationName: organizationName.trim() || `${displayName.trim()}'s Studio`,
        contentGoals,
        targetAudience,
        preferredLanguage,
        preferredTone,
        bio: bio.trim(),
        onboardingStep: 3,
      }).catch(() => {});
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 3) {
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Final Complete Submission
  const handleSubmitProfile = async () => {
    setErrorMsg(null);
    setIsSaving(true);
    try {
      const fullMobile = phone.startsWith('+') ? phone : `${countryCode} ${phone.trim()}`;
      const finalOrgName = organizationName.trim() || `${displayName.trim()}'s Studio`;

      const creatorData = {
        displayName: displayName.trim(),
        phone: fullMobile,
        photoURL: avatarUrl || user?.photoURL || '',
        creatorType,
        industry: selectedIndustry,
        category: selectedCategory,
        organizationName: finalOrgName,
        contentGoals,
        targetAudience,
        preferredLanguage,
        preferredTone,
        bio: bio.trim(),
        location: location.trim(),
        website: website.trim(),
        socialLinks: {
          youtube: youtube.trim(),
          instagram: instagram.trim(),
          twitter: twitter.trim(),
          linkedin: linkedin.trim(),
          facebook: facebook.trim(),
          website: website.trim(),
        },
      };

      // 1. Save profile to Firestore /users/{uid} & mark onboarding completed
      await completeOnboarding(creatorData);

      // 2. Synchronize primary business profile in Scripter
      if (businessProfiles.length > 0) {
        const primary = businessProfiles[0];
        updateBusinessProfile({
          ...primary,
          name: finalOrgName,
          industry: selectedIndustry,
          category: selectedCategory,
          targetAudience,
          preferredTone,
          preferredLanguage,
          tagline: bio.trim() || undefined,
        });
      } else {
        const created = addBusinessProfile({
          name: finalOrgName,
          industry: selectedIndustry,
          category: selectedCategory,
          targetAudience,
          preferredTone,
          preferredLanguage,
          tagline: bio.trim() || undefined,
        });
        setActiveBusinessProfile(created);
      }

      // 3. Navigate straight to User Dashboard
      navigate('/user/home', { replace: true });
    } catch (err: any) {
      console.warn('Failed to complete onboarding:', err);
      setErrorMsg(
        err.message ||
          (language === 'en'
            ? 'Failed to save creator profile. Please try again.'
            : 'क्रिएटर प्रोफ़ाइल सहेजने में विफल। कृपया पुन: प्रयास करें।')
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-blue-600/20 via-indigo-600/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 right-10 w-[500px] h-[300px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* 1. TOP HEADER WITH LOGO & STEP TRACKER */}
      <header className="relative w-full z-30 shrink-0 bg-[#0B132B]/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/assets/aistudio/HEADER_LOGO_f8b18f40.png"
            alt="Scripter"
            className="h-7 sm:h-8 w-auto object-contain bg-white px-2 py-0.5 rounded-lg"
          />
          <div className="hidden sm:block h-4 w-px bg-slate-700" />
          <span className="hidden sm:inline-block text-xs font-bold text-slate-300 uppercase tracking-wider">
            {language === 'en' ? 'Creator Registration' : 'क्रिएटर पंजीकरण'}
          </span>
        </div>

        {/* Language switch & User badge */}
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] text-slate-400 hidden md:inline-block">
            {user?.email}
          </span>
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold border border-slate-700 flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
          >
            <span>🌐</span>
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN ONBOARDING FORM CONTAINER */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10 flex flex-col justify-center">
        {/* Progress Bar & Step Tabs */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2 px-1">
            <span>
              {language === 'en' ? `Step ${currentStep} of 4` : `चरण ${currentStep} / 4`}
            </span>
            <span className="text-amber-400 font-medium text-[11px] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>1,200 Free Welcome AI Credits</span>
            </span>
          </div>

          {/* Progress Segments */}
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((stepNum) => (
              <div
                key={stepNum}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentStep >= stepNum ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>

          {/* Step Title Header */}
          <div className="mt-4 text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {currentStep === 1 && (language === 'en' ? '1. Basic Information' : '1. बुनियादी जानकारी')}
              {currentStep === 2 && (language === 'en' ? '2. Creator & Business Niche' : '2. क्रिएटर और बिजनेस श्रेणी')}
              {currentStep === 3 && (language === 'en' ? '3. Contact & Social Channels' : '3. संपर्क और सोशल मीडिया')}
              {currentStep === 4 && (language === 'en' ? '4. Review & Activate Account' : '4. समीक्षा और खाता सक्रियण')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {currentStep === 1 &&
                (language === 'en'
                  ? 'Confirm your name, verified Google identity, and primary contact phone.'
                  : 'अपना नाम, सत्यापित Google पहचान और प्राथमिक संपर्क फोन दर्ज करें।')}
              {currentStep === 2 &&
                (language === 'en'
                  ? 'Select your content persona, industry taxonomy, and preferred script tone.'
                  : 'अपनी क्रिएटर श्रेणी, उद्योग और पसंदीदा स्क्रिप्ट टोन चुनें।')}
              {currentStep === 3 &&
                (language === 'en'
                  ? 'Add your location and social channel handles for script brand kits.'
                  : 'स्क्रिप्ट ब्रांड किट के लिए अपना स्थान और सोशल चैनल लिंक जोड़ें।')}
              {currentStep === 4 &&
                (language === 'en'
                  ? 'Confirm your details and launch directly into Scripter Creator Studio.'
                  : 'अपने विवरण की पुष्टि करें और सीधे स्क्रिपटर क्रिएटर स्टूडियो में प्रवेश करें।')}
            </p>
          </div>
        </div>

        {/* Error Alert Box if any */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="flex-1">{errorMsg}</span>
          </div>
        )}

        {/* FORM STEP 1: BASIC INFORMATION */}
        {currentStep === 1 && (
          <div className="space-y-4 sm:space-y-5 bg-[#0B132B]/80 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
            {/* Avatar Row */}
            <div className="flex items-center gap-4 pb-2 border-b border-slate-800/80">
              <div className="relative">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName || 'Creator'}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/40 shadow-lg"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-lg">
                    {displayName ? displayName[0].toUpperCase() : 'C'}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 p-1 bg-blue-600 rounded-lg text-white shadow-xs">
                  <Camera className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  {language === 'en' ? 'Profile Photo' : 'प्रोफ़ाइल फोटो'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {language === 'en'
                    ? 'Synced from your Google account. You can customize it later.'
                    : 'आपके Google खाते से समन्वयित। आप इसे बाद में बदल सकते हैं।'}
                </p>
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>{language === 'en' ? 'Full Name' : 'पूरा नाम'}</span>
                <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={language === 'en' ? 'e.g. Rituraj Tomar' : 'उदा. ऋतुराज तोमर'}
                className="w-full px-3.5 py-3 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white text-xs sm:text-sm font-medium transition-all"
              />
            </div>

            {/* Email Address (Google Verified - Read-Only) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>{language === 'en' ? 'Email Address' : 'ईमेल पता'}</span>
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Google Verified</span>
                </span>
              </label>
              <div className="w-full px-3.5 py-3 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-400 text-xs sm:text-sm font-mono flex items-center justify-between">
                <span>{user?.email || userProfile?.email || 'authenticated@gmail.com'}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  Primary
                </span>
              </div>
            </div>

            {/* Mobile Number with Country Code */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>{language === 'en' ? 'Mobile / WhatsApp Number' : 'मोबाइल / व्हाट्सएप नंबर'}</span>
                <span className="text-rose-400">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-24 px-2.5 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs sm:text-sm font-medium focus:border-blue-500 shrink-0"
                >
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+971">🇦🇪 +971</option>
                  <option value="+65">🇸🇬 +65</option>
                  <option value="+61">🇦🇺 +61</option>
                </select>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98765 43210"
                  className="flex-1 px-3.5 py-3 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white text-xs sm:text-sm font-medium transition-all"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                {language === 'en'
                  ? 'Used strictly for account security and export notifications.'
                  : 'केवल खाता सुरक्षा और वीडियो एक्सपोर्ट सूचनाओं के लिए उपयोग किया जाता है।'}
              </p>
            </div>
          </div>
        )}

        {/* FORM STEP 2: CREATOR & BUSINESS PROFILE */}
        {currentStep === 2 && (
          <div className="space-y-4 sm:space-y-5 bg-[#0B132B]/80 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
            {/* Creator Classification / Persona */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                <span>{language === 'en' ? 'Creator Category / Role' : 'क्रिएटर श्रेणी / प्रकार'}</span>
                <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CREATOR_PERSONAS.map((persona) => {
                  const isSelected = creatorType === persona.id;
                  return (
                    <button
                      key={persona.id}
                      type="button"
                      onClick={() => setCreatorType(persona.id)}
                      className={`text-left p-3 rounded-xl border text-xs transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-500 text-white shadow-xs'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span>{language === 'en' ? persona.labelEn : persona.labelHi}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-snug">{persona.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Industry Taxonomy Selection (Shared with Platform) */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  <span>{language === 'en' ? 'Primary Industry Domain' : 'मुख्य उद्योग क्षेत्र'}</span>
                  <span className="text-rose-400">*</span>
                </span>
                <span className="text-[11px] text-slate-400">
                  {INITIAL_INDUSTRY_TAXONOMIES.length} {language === 'en' ? 'Industries' : 'उद्योग उपलब्ध'}
                </span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {INITIAL_INDUSTRY_TAXONOMIES.map((ind) => {
                  const isSelected = selectedIndustry === ind.nameEn;
                  return (
                    <button
                      key={ind.id}
                      type="button"
                      onClick={() => handleIndustryChange(ind.nameEn)}
                      className={`p-2.5 rounded-xl border text-xs text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 border-blue-500 text-white font-bold shadow-md shadow-blue-600/30'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <p className="truncate font-semibold">{language === 'en' ? ind.nameEn : ind.nameHi}</p>
                      <p className="text-[10px] text-slate-300/80 truncate mt-0.5">
                        {ind.categories.length} {language === 'en' ? 'Subtopics' : 'विषय'}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Content Subcategory Chips */}
            {currentIndustryObj && currentIndustryObj.categories && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200">
                  {language === 'en'
                    ? `Specific ${selectedIndustry} Niche:`
                    : `${selectedIndustry} की विशिष्ट उप-श्रेणी:`}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {currentIndustryObj.categories.map((subcat) => {
                    const isSelected = selectedCategory === subcat;
                    return (
                      <button
                        key={subcat}
                        type="button"
                        onClick={() => setSelectedCategory(subcat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                            : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {subcat}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Channel / Organization Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200">
                {language === 'en' ? 'Channel / Business Name' : 'चैनल या व्यवसाय का नाम'}
              </label>
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder={language === 'en' ? 'e.g. TechSparks India or Wellness With Neha' : 'उदा. टेकस्पार्क्स इंडिया'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-blue-500 text-white text-xs sm:text-sm font-medium"
              />
            </div>

            {/* Content Goals & Target Audience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200">
                  {language === 'en' ? 'Primary Goal' : 'मुख्य उद्देश्य'}
                </label>
                <select
                  value={contentGoals}
                  onChange={(e) => setContentGoals(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs font-medium focus:border-blue-500"
                >
                  {CONTENT_GOALS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200">
                  {language === 'en' ? 'Preferred Delivery Tone' : 'पसंदीदा टोन'}
                </label>
                <select
                  value={preferredTone}
                  onChange={(e) => setPreferredTone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs font-medium focus:border-blue-500"
                >
                  {TONE_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Language & Bio */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200">
                {language === 'en' ? 'Preferred Script Language' : 'स्क्रिप्ट की भाषा'}
              </label>
              <div className="flex gap-2">
                {LANGUAGE_OPTIONS.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setPreferredLanguage(lang)}
                    className={`flex-1 py-2 px-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      preferredLanguage === lang
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200">
                {language === 'en' ? 'Short Creator Bio' : 'संक्षिप्त क्रिएटर परिचय'}
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                placeholder={
                  language === 'en'
                    ? '1-2 lines on the type of video content you want to create.'
                    : 'आप किस प्रकार का वीडियो कंटेंट बनाना चाहते हैं, इस बारे में 1-2 लाइनें।'
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-blue-500 text-white text-xs sm:text-sm font-medium resize-none"
              />
            </div>
          </div>
        )}

        {/* FORM STEP 3: CONTACT & SOCIAL CHANNELS */}
        {currentStep === 3 && (
          <div className="space-y-4 sm:space-y-5 bg-[#0B132B]/80 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>{language === 'en' ? 'City / Location' : 'शहर / स्थान'}</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Mumbai, Maharashtra or Indore, MP"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-blue-500 text-white text-xs sm:text-sm font-medium"
              />
            </div>

            {/* Official Website */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200">
                {language === 'en' ? 'Website / Portfolio Link' : 'वेबसाइट / पोर्टफोलियो लिंक'}
              </label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://scripter.app or https://mychannel.in"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-blue-500 text-white text-xs sm:text-sm font-medium"
              />
            </div>

            {/* Social Media Links */}
            <div className="space-y-3 pt-2 border-t border-slate-800/80">
              <p className="text-xs font-bold text-slate-200">
                {language === 'en' ? 'Creator Social Handles (Optional)' : 'सोशल मीडिया हैंडल्स (वैकल्पिक)'}
              </p>

              {/* YouTube */}
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center shrink-0 border border-red-500/30">
                  <Youtube className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  placeholder="https://youtube.com/@yourchannel"
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs font-medium focus:border-blue-500"
                />
              </div>

              {/* Instagram */}
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-pink-600/20 text-pink-400 flex items-center justify-center shrink-0 border border-pink-500/30">
                  <Instagram className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/yourhandle"
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs font-medium focus:border-blue-500"
                />
              </div>

              {/* Twitter / X */}
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-slate-700/30 text-slate-200 flex items-center justify-center shrink-0 border border-slate-700">
                  <Twitter className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="https://x.com/yourhandle"
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs font-medium focus:border-blue-500"
                />
              </div>

              {/* LinkedIn */}
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
                  <Linkedin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs font-medium focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* FORM STEP 4: REVIEW & LAUNCH */}
        {currentStep === 4 && (
          <div className="space-y-5 bg-[#0B132B]/80 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
            {/* Creator Identity Summary */}
            <div className="flex items-center gap-3.5 pb-4 border-b border-slate-800">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500 shadow-md"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                  {displayName ? displayName[0].toUpperCase() : 'C'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-white truncate">{displayName}</h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 font-bold border border-blue-500/30">
                    USER
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                <p className="text-[11px] text-amber-300 font-medium mt-0.5">{creatorType}</p>
              </div>
            </div>

            {/* Profile Matrix Details */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-500">Industry & Niche</p>
                <p className="font-bold text-white truncate">{selectedIndustry}</p>
                <p className="text-[11px] text-blue-400 truncate">{selectedCategory}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-500">Channel / Brand</p>
                <p className="font-bold text-white truncate">{organizationName || `${displayName}'s Studio`}</p>
                <p className="text-[11px] text-slate-400 truncate">{location || 'India'}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-500">Language & Tone</p>
                <p className="font-bold text-white truncate">{preferredLanguage}</p>
                <p className="text-[11px] text-slate-400 truncate">{preferredTone}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
                <p className="text-[10px] uppercase font-bold text-slate-500">Primary Goal</p>
                <p className="font-bold text-white truncate">{contentGoals}</p>
                <p className="text-[11px] text-slate-400 truncate">{phone || 'Contact Saved'}</p>
              </div>
            </div>

            {/* AI Welcome Credits Activation Notice */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-blue-500/10 to-indigo-500/15 border border-amber-500/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm shrink-0 shadow-md">
                <Zap className="w-5 h-5 fill-slate-950 text-slate-950" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-amber-300">
                  {language === 'en' ? '1,200 Free Welcome AI Credits' : '1,200 फ्री वेलकम AI क्रेडिट्स'}
                </p>
                <p className="text-[11px] text-slate-300">
                  {language === 'en'
                    ? 'Ready to generate full video scripts, teleprompter telecasts, and hook ideas.'
                    : 'स्क्रिप्ट, टेलीप्रॉम्प्टर और हुक विचार तैयार करने के लिए तैयार।'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3. NAVIGATION CONTROLS & SAVE PROFILE BUTTON */}
        <div className="mt-6 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isSaving}
              className="px-4 sm:px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'en' ? 'Back' : 'पीछे'}</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 sm:px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all cursor-pointer ml-auto"
            >
              <span>{language === 'en' ? 'Continue' : 'आगे बढ़ें'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitProfile}
              disabled={isSaving}
              className="px-8 sm:px-10 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm flex items-center gap-2.5 shadow-xl shadow-blue-600/40 transition-all cursor-pointer disabled:opacity-60 ml-auto"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{language === 'en' ? 'Saving Profile...' : 'प्रोफ़ाइल सहेजा जा रहा है...'}</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{language === 'en' ? 'Save Profile & Continue' : 'प्रोफ़ाइल सहेजें और शुरू करें'}</span>
                </>
              )}
            </button>
          )}
        </div>
      </main>

      {/* 4. FOOTER */}
      <footer className="w-full py-4 px-4 text-center text-slate-500 text-xs shrink-0 border-t border-slate-900 bg-[#070D1E]">
        <span>Powered by </span>
        <strong className="text-slate-300">Scripter</strong>
        <span> • Complete Content Creation</span>
      </footer>
    </div>
  );
};
