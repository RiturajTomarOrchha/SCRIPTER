import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Brand
    brandTagline: 'Complete Content Creation',
    devMode: 'Dev / Test Mode',

    // Nav
    navHome: 'Home',
    navIdeas: 'Ideas',
    navCreate: 'Create',
    navProjects: 'Projects',
    navProfile: 'Profile',
    navDashboard: 'Dashboard',
    navUserManagement: 'User Management',
    navBusinessProfiles: 'Business Profiles',
    navIndustries: 'Industries & Categories',
    navTemplates: 'Template Library',
    navAssets: 'Visual Assets',
    navAiProviders: 'AI Provider Hub',
    navPlansCredits: 'Plans & Credits',
    navBilling: 'Payments & Billing',
    navContentSettings: 'Content & Research',
    navNotifications: 'Notifications & Alerts',
    navAnalytics: 'Usage Analytics & Reports',
    navModeration: 'Content Moderation',
    navFeedback: 'Feedback Management',
    navTickets: 'Support Tickets',
    navAdminManagement: 'Admin Management',
    navSystemSettings: 'System Settings',
    navSecurityLogs: 'Security & Logs',
    navHelpDocs: 'Help & Documentation',

    // User Home
    welcomeGreeting: 'Welcome back,',
    activeProfile: 'Active Business Profile',
    switchProfile: 'Switch Profile',
    aiCredits: 'AI Credits',
    creditsUsed: 'used',
    creditsLeft: 'left',
    buyCredits: 'Buy Credits',
    createContentHeading: 'Create New Content',
    createNewScript: 'New Script',
    createNewScriptDesc: 'Write script with AI',
    exploreIdeas: 'Explore Ideas',
    exploreIdeasDesc: 'Find fresh topics',
    visualPack: 'Visual Pack',
    visualPackDesc: 'B-roll & visuals',
    production: 'Production',
    productionDesc: 'Record & teleprompter',
    recentProjects: 'Recent Projects',
    viewAllProjects: 'View All Projects',
    noProjectsYet: 'No projects created yet',
    contentJourneyTitle: 'Your Content Journey',
    contentJourneySubtitle: 'Idea to Final Video in 5 Simple Steps',
    stepDiscover: 'Discover',
    stepResearch: 'Research',
    stepScript: 'Script',
    stepRecord: 'Record',
    stepProduce: 'Produce & Export',

    // Admin / Master Admin
    masterAdminTitle: 'Master Admin Dashboard',
    masterAdminSubtitle: 'Platform health, usage analytics, and administrative governance',
    adminDashboardTitle: 'Admin Operations Dashboard',
    adminDashboardSubtitle: 'Operations, content moderation, and user support management',
    totalUsers: 'Total Users',
    activeProfilesCount: 'Active Profiles',
    totalProjectsCount: 'Total Projects',
    totalAiRequests: 'Total AI Requests',
    platformRevenue: 'Platform Revenue',
    demoDataNotice: 'Demo Data',
    thisMonth: 'This Month',
    dateRange: '01 Oct 2026 - 31 Oct 2026',
    platformActivity: 'Platform Activity & Usage Trend',
    recentUsers: 'Recent Registered Users',
    topTemplates: 'Top Templates This Month',
    systemStatus: 'System & Service Status',
    serviceFirebase: 'Firebase Auth & Cloud Firestore',
    serviceAi: 'AI Provider Inference Gateway',
    serviceMedia: 'Media & Asset CDN Storage',

    // Coming Soon
    comingSoonTitle: 'Feature Coming Soon',
    comingSoonSubtitle: 'This module is scheduled for the next development milestone.',
    backToDashboard: 'Back to Dashboard',
    currentStage: 'Milestone 1 Foundation',
  },
  hi: {
    // Brand
    brandTagline: 'आइडिया से वीडियो तक पूरा समाधान',
    devMode: 'टेस्ट / देव मोड',

    // Nav
    navHome: 'होम',
    navIdeas: 'आइडिया',
    navCreate: 'बनाएं',
    navProjects: 'प्रोजेक्ट्स',
    navProfile: 'प्रोफ़ाइल',
    navDashboard: 'डैशबोर्ड',
    navUserManagement: 'उपयोगकर्ता प्रबंधन',
    navBusinessProfiles: 'बिज़नेस प्रोफ़ाइल',
    navIndustries: 'इंडस्ट्री और कैटेगरी',
    navTemplates: 'टेम्पलेट लाइब्रेरी',
    navAssets: 'विज़ुअल एसेट्स',
    navAiProviders: 'AI प्रदाता प्रबंधन',
    navPlansCredits: 'प्लान और क्रेडिट',
    navBilling: 'पेमेंट और बिलिंग',
    navContentSettings: 'कंटेंट सेटिंग्स',
    navNotifications: 'सूचनाएं और अलर्ट',
    navAnalytics: 'उपयोग विश्लेषण और रिपोर्ट्स',
    navModeration: 'कंटेंट मॉडरेशन',
    navFeedback: 'फ़ीडबैक प्रबंधन',
    navTickets: 'सपोर्ट टिकट्स',
    navAdminManagement: 'एडमिन प्रबंधन',
    navSystemSettings: 'सिस्टम सेटिंग्स',
    navSecurityLogs: 'सुरक्षा और लॉग्स',
    navHelpDocs: 'डॉक्यूमेंटेशन और सहायता',

    // User Home
    welcomeGreeting: 'फिर से स्वागत है,',
    activeProfile: 'सक्रिय बिज़नेस प्रोफ़ाइल',
    switchProfile: 'प्रोफ़ाइल बदलें',
    aiCredits: 'AI क्रेडिट',
    creditsUsed: 'उपयोग हुआ',
    creditsLeft: 'शेष',
    buyCredits: 'क्रेडिट खरीदें',
    createContentHeading: 'नया कंटेंट बनाएं',
    createNewScript: 'नई स्क्रिप्ट',
    createNewScriptDesc: 'AI से स्क्रिप्ट लिखें',
    exploreIdeas: 'आइडिया खोजें',
    exploreIdeasDesc: 'नए ट्रेंडिंग विषय',
    visualPack: 'विज़ुअल पैक',
    visualPackDesc: 'B-roll और इमेज',
    production: 'प्रोडक्शन',
    productionDesc: 'टेलीप्रॉम्प्टर और शूट',
    recentProjects: 'हाल के प्रोजेक्ट्स',
    viewAllProjects: 'सभी प्रोजेक्ट देखें',
    noProjectsYet: 'अभी कोई प्रोजेक्ट नहीं है',
    contentJourneyTitle: 'आपकी कंटेंट निर्माण यात्रा',
    contentJourneySubtitle: 'आइडिया से फाइनल वीडियो तक 5 आसान चरण',
    stepDiscover: 'आइडिया खोजें',
    stepResearch: 'रिसर्च',
    stepScript: 'स्क्रिप्ट',
    stepRecord: 'रिकॉर्डिंग',
    stepProduce: 'प्रोडक्शन व एक्सपोर्ट',

    // Admin / Master Admin
    masterAdminTitle: 'मास्टर एडमिन डैशबोर्ड',
    masterAdminSubtitle: 'प्लेटफ़ॉर्म की पूरी स्थिति, उपयोग और प्रबंधन का एक नज़र में अवलोकन',
    adminDashboardTitle: 'एडमिन ऑपरेशन्स डैशबोर्ड',
    adminDashboardSubtitle: 'प्लेटफ़ॉर्म संचालन, मॉडरेशन और सपोर्ट प्रबंधन',
    totalUsers: 'कुल उपयोगकर्ता',
    activeProfilesCount: 'बिज़नेस प्रोफ़ाइल',
    totalProjectsCount: 'कुल प्रोजेक्ट',
    totalAiRequests: 'कुल AI उपयोग',
    platformRevenue: 'कुल राजस्व',
    demoDataNotice: 'डेमो डेटा',
    thisMonth: 'इस महीने',
    dateRange: '01 अक्टूबर 2026 - 31 अक्टूबर 2026',
    platformActivity: 'उपयोग का रुझान एवं गतिविधि',
    recentUsers: 'हाल के पंजीकृत उपयोगकर्ता',
    topTemplates: 'टॉप टेम्पलेट्स (इस महीने)',
    systemStatus: 'सिस्टम एवं सर्विस स्थिति',
    serviceFirebase: 'फ़ायरबेस ऑथ एवं क्लाउड फ़ायरस्टोर',
    serviceAi: 'AI प्रोवाइडर गेटवे',
    serviceMedia: 'मीडिया स्टोरेज CDN',

    // Coming Soon
    comingSoonTitle: 'जल्द आ रहा है (Coming Soon)',
    comingSoonSubtitle: 'यह मॉड्यूल आगामी विकास माइलस्टोन में उपलब्ध कराया जाएगा।',
    backToDashboard: 'डैशबोर्ड पर वापस जाएं',
    currentStage: 'माइलस्टोन 1 फाउंडेशन',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
