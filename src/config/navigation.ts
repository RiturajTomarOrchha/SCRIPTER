import { NavItem } from '../types';

export const USER_BOTTOM_NAV_ITEMS: NavItem[] = [
  { id: 'home', labelEn: 'Home', labelHi: 'होम', path: '/user/home', icon: 'Home' },
  { id: 'ideas', labelEn: 'Ideas', labelHi: 'आइडिया', path: '/user/ideas', icon: 'Lightbulb' },
  { id: 'create', labelEn: 'Create', labelHi: 'बनाएं', path: '/user/create', icon: 'Plus' },
  { id: 'projects', labelEn: 'Projects', labelHi: 'प्रोजेक्ट्स', path: '/user/projects', icon: 'FolderKanban' },
  { id: 'profile', labelEn: 'Profile', labelHi: 'प्रोफ़ाइल', path: '/user/profile', icon: 'User' },
];

export const USER_ALL_DESTINATIONS: NavItem[] = [
  { id: 'home', labelEn: 'Home', labelHi: 'होम', path: '/user/home', icon: 'Home' },
  { id: 'ideas', labelEn: 'Ideas & Trending Topics', labelHi: 'आइडिया और ट्रेंडिंग टॉपिक्स', path: '/user/ideas', icon: 'Lightbulb' },
  { id: 'research', labelEn: 'Research & Outlines', labelHi: 'रिसर्च और आउटलाइन्स', path: '/user/research', icon: 'Search' },
  { id: 'script-studio', labelEn: 'Script Studio', labelHi: 'स्क्रिप्ट स्टूडियो', path: '/user/script-studio', icon: 'FileText' },
  { id: 'teleprompter', labelEn: 'Teleprompter', labelHi: 'टेलीप्रॉम्प्टर', path: '/user/teleprompter', icon: 'Mic' },
  { id: 'video-recording', labelEn: 'Video Recording', labelHi: 'वीडियो रिकॉर्डिंग', path: '/user/video-recording', icon: 'Video' },
  { id: 'video-studio', labelEn: 'Video Studio / Editor', labelHi: 'वीडियो स्टूडियो / एडिटर', path: '/user/video-studio', icon: 'Film' },
  { id: 'projects', labelEn: 'Projects', labelHi: 'प्रोजेक्ट्स', path: '/user/projects', icon: 'FolderKanban' },
  { id: 'library', labelEn: 'Saved Content / Library', labelHi: 'लाइब्रेरी और सेव्ड कंटेंट', path: '/user/library', icon: 'BookmarkCheck' },
  { id: 'templates', labelEn: 'Templates & Visual Packs', labelHi: 'टेम्पलेट्स और विज़ुअल पैक', path: '/user/templates', icon: 'Layers' },
  { id: 'business-profiles', labelEn: 'Business Profiles', labelHi: 'बिज़नेस प्रोफ़ाइल', path: '/user/business-profiles', icon: 'Briefcase' },
  { id: 'notifications', labelEn: 'Notifications', labelHi: 'सूचनाएं', path: '/user/notifications', icon: 'Bell' },
  { id: 'credits', labelEn: 'Usage & AI Credits', labelHi: 'उपयोग और AI क्रेडिट', path: '/user/credits', icon: 'Sparkles' },
  { id: 'subscription', labelEn: 'Subscription & Plans', labelHi: 'सब्सक्रिप्शन और प्लान', path: '/user/subscription', icon: 'Crown' },
  { id: 'settings', labelEn: 'Settings', labelHi: 'सेटिंग्स', path: '/user/settings', icon: 'Settings' },
  { id: 'help', labelEn: 'Help & Support', labelHi: 'सहायता और सपोर्ट', path: '/user/help', icon: 'HelpCircle' },
];

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', labelEn: 'Dashboard', labelHi: 'डैशबोर्ड', path: '/admin/dashboard', icon: 'LayoutDashboard' },
  { id: 'users', labelEn: 'User Management', labelHi: 'उपयोगकर्ता प्रबंधन', path: '/admin/users', icon: 'Users' },
  { id: 'business-profiles', labelEn: 'Business Profile Management', labelHi: 'बिज़नेस प्रोफ़ाइल', path: '/admin/business-profiles', icon: 'Briefcase' },
  { id: 'industries', labelEn: 'Industry & Category Management', labelHi: 'इंडस्ट्री और कैटेगरी', path: '/admin/industries', icon: 'Building2' },
  { id: 'templates', labelEn: 'Template Library', labelHi: 'टेम्पलेट लाइब्रेरी', path: '/admin/templates', icon: 'Library' },
  { id: 'assets', labelEn: 'Visual Assets', labelHi: 'विज़ुअल एसेट्स', path: '/admin/assets', icon: 'Image' },
  { id: 'moderation', labelEn: 'Content Moderation', labelHi: 'कंटेंट मॉडरेशन', path: '/admin/moderation', icon: 'ShieldAlert' },
  { id: 'feedback', labelEn: 'Feedback Management', labelHi: 'फ़ीडबैक प्रबंधन', path: '/admin/feedback', icon: 'MessageSquare' },
  { id: 'tickets', labelEn: 'Support Tickets', labelHi: 'सपोर्ट टिकट्स', path: '/admin/tickets', icon: 'LifeBuoy' },
  { id: 'notifications', labelEn: 'Notifications & Alerts', labelHi: 'सूचनाएं और अलर्ट', path: '/admin/notifications', icon: 'Bell' },
  { id: 'reports', labelEn: 'Usage Reports', labelHi: 'उपयोग रिपोर्ट्स', path: '/admin/reports', icon: 'BarChart3' },
  { id: 'settings', labelEn: 'Settings', labelHi: 'सेटिंग्स', path: '/admin/settings', icon: 'Settings' },
  { id: 'help', labelEn: 'Help & Documentation', labelHi: 'डॉक्यूमेंटेशन', path: '/admin/help', icon: 'HelpCircle' },
];

export const MASTER_ADMIN_NAV_GROUPS: { groupEn: string; groupHi: string; items: NavItem[] }[] = [
  {
    groupEn: 'Core',
    groupHi: 'मुख्य',
    items: [
      { id: 'dashboard', labelEn: 'Dashboard', labelHi: 'डैशबोर्ड', path: '/master-admin/dashboard', icon: 'LayoutDashboard' },
      { id: 'analytics', labelEn: 'Usage Analytics & Reports', labelHi: 'उपयोग विश्लेषण और रिपोर्ट्स', path: '/master-admin/analytics', icon: 'BarChart3' },
    ],
  },
  {
    groupEn: 'Platform Management',
    groupHi: 'प्लेटफ़ॉर्म प्रबंधन',
    items: [
      { id: 'users', labelEn: 'User Management', labelHi: 'उपयोगकर्ता प्रबंधन', path: '/master-admin/users', icon: 'Users' },
      { id: 'business-profiles', labelEn: 'Business Profiles', labelHi: 'बिज़नेस प्रोफ़ाइल', path: '/master-admin/business-profiles', icon: 'Briefcase' },
      { id: 'industries', labelEn: 'Industry & Categories', labelHi: 'इंडस्ट्री और कैटेगरी', path: '/master-admin/industries', icon: 'Building2' },
      { id: 'templates', labelEn: 'Template Library', labelHi: 'टेम्पलेट लाइब्रेरी', path: '/master-admin/templates', icon: 'Library' },
      { id: 'assets', labelEn: 'Visual Assets', labelHi: 'विज़ुअल एसेट्स', path: '/master-admin/assets', icon: 'Image' },
    ],
  },
  {
    groupEn: 'AI & Monetization',
    groupHi: 'AI और मोनेटाइजेशन',
    items: [
      { id: 'ai-providers', labelEn: 'AI Provider Hub', labelHi: 'AI प्रदाता प्रबंधन', path: '/master-admin/ai-providers', icon: 'Cpu' },
      { id: 'plans', labelEn: 'Plans & Credits', labelHi: 'प्लान और क्रेडिट', path: '/master-admin/plans', icon: 'Crown' },
      { id: 'billing', labelEn: 'Payments & Billing', labelHi: 'पेमेंट और बिलिंग', path: '/master-admin/billing', icon: 'CreditCard' },
      { id: 'content-settings', labelEn: 'Content & Research Settings', labelHi: 'कंटेंट सेटिंग्स', path: '/master-admin/content-settings', icon: 'Sliders' },
    ],
  },
  {
    groupEn: 'Governance & Security',
    groupHi: 'गवर्नेंस और सुरक्षा',
    items: [
      { id: 'moderation', labelEn: 'Content Moderation', labelHi: 'कंटेंट मॉडरेशन', path: '/master-admin/moderation', icon: 'ShieldAlert' },
      { id: 'feedback', labelEn: 'Feedback Management', labelHi: 'फ़ीडबैक प्रबंधन', path: '/master-admin/feedback', icon: 'MessageSquare' },
      { id: 'tickets', labelEn: 'Support Tickets', labelHi: 'सपोर्ट टिकट्स', path: '/master-admin/tickets', icon: 'LifeBuoy' },
      { id: 'admins', labelEn: 'Admin Management & Permissions', labelHi: 'एडमिन प्रबंधन', path: '/master-admin/admins', icon: 'UserCheck' },
      { id: 'system', labelEn: 'System Settings', labelHi: 'सिस्टम सेटिंग्स', path: '/master-admin/system', icon: 'Settings' },
      { id: 'logs', labelEn: 'Security & Audit Logs', labelHi: 'सुरक्षा और ऑडिट लॉग्स', path: '/master-admin/logs', icon: 'FileText' },
      { id: 'notifications', labelEn: 'Notifications & Alerts', labelHi: 'सूचनाएं और अलर्ट', path: '/master-admin/notifications', icon: 'Bell' },
      { id: 'help', labelEn: 'Help & Documentation', labelHi: 'डॉक्यूमेंटेशन', path: '/master-admin/help', icon: 'HelpCircle' },
    ],
  },
];
