import {
  BusinessProfile,
  PlatformMetrics,
  Project,
  UserProfile,
  ContentIdea,
  BrandKit,
  ContentTemplate,
  SocialExportPreset,
  AppNotification,
  CreditLedgerEntry,
  CreditTopupPackage,
  SubscriptionPlan,
  UserSubscription,
  PaymentTransaction,
  InvoiceItem,
  UserPreferences,
} from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr_001',
  name: 'Rituraj Tomar',
  email: 'riturajtomarorchha@gmail.com',
  phone: '+91 98765 43210',
  bio: 'Digital content creator & health educator producing short-form video explainers for vernacular audiences across India.',
  avatarUrl: '/assets/aistudio/Square_Scripter_Logo_d7bb9aeb.png',
  role: 'user',
  currentPlan: 'Pro',
  creditsTotal: 1200,
  creditsUsed: 850,
  monthlyAllowance: 1000,
  purchasedCredits: 200,
  activeBusinessProfileId: 'bp_health',
  legalEntityName: 'Rituraj Tomar',
  billingAddress: 'Ward No. 4, Tikamgarh Road, Orchha, Madhya Pradesh - 472246',
  stateOfSupply: 'Madhya Pradesh (23)',
  gstin: '23AAAAA0000A1Z5',
  location: 'Orchha, Madhya Pradesh, India',
  memberSince: '12 Mar 2024',
  twoFactorEnabled: false,
  createdAt: '2024-01-15T10:00:00Z',
};

export const DEMO_BUSINESS_PROFILES: BusinessProfile[] = [
  {
    id: 'bp_health',
    name: 'Health & Wellness',
    industry: 'Healthcare & Wellness',
    category: 'Doctors, Clinics, Fitness',
    targetAudience: 'Patients & Health Seekers',
    preferredTone: 'Educational & Empathetic',
    preferredLanguage: 'Hindi / English',
    isPrimary: true,
    projectsCount: 14,
    iconName: 'HeartPulse',
    tagline: 'Simple health tips & daily lifestyle advice',
  },
  {
    id: 'bp_media',
    name: 'Media & Entertainment',
    industry: 'News & Media',
    category: 'Current Affairs, News, Reels',
    targetAudience: 'General Digital Audience',
    preferredTone: 'Conversational & Engaging',
    preferredLanguage: 'Hindi',
    isPrimary: false,
    projectsCount: 22,
    iconName: 'Tv',
    tagline: 'Fast news commentary & trending topic explainers',
  },
  {
    id: 'bp_education',
    name: 'Education & Coaching',
    industry: 'Education & Training',
    category: 'Coaching, Teachers, Institutes',
    targetAudience: 'Students & Lifelong Learners',
    preferredTone: 'Professional & Instructive',
    preferredLanguage: 'Hinglish',
    isPrimary: false,
    projectsCount: 9,
    iconName: 'GraduationCap',
    tagline: 'Step-by-step learning modules & tutorials',
  },
  {
    id: 'bp_tech',
    name: 'IT & Technology',
    industry: 'Tech & Software',
    category: 'Software, IT Services, Startups',
    targetAudience: 'Developers & Tech Enthusiasts',
    preferredTone: 'Informative & Crisp',
    preferredLanguage: 'English',
    isPrimary: false,
    projectsCount: 7,
    iconName: 'Cpu',
    tagline: 'Tech reviews, product launches, & software tips',
  },
  {
    id: 'bp_food',
    name: 'Food & Beverage',
    industry: 'Hospitality',
    category: 'Restaurants, Cafes, Recipes',
    targetAudience: 'Foodies & Home Cooks',
    preferredTone: 'Warm & Enthusiastic',
    preferredLanguage: 'Hindi',
    isPrimary: false,
    projectsCount: 5,
    iconName: 'Utensils',
    tagline: 'Quick recipe reels & restaurant spotlights',
  },
  {
    id: 'bp_realestate',
    name: 'Real Estate & Properties',
    industry: 'Real Estate',
    category: 'Agents, Builders, Architecture',
    targetAudience: 'Home Buyers & Property Investors',
    preferredTone: 'Trustworthy & Premium',
    preferredLanguage: 'Hindi / English',
    isPrimary: false,
    projectsCount: 3,
    iconName: 'Building',
    tagline: 'Property showcases, area reviews & market analysis',
  },
];

export const DEMO_PROJECTS: Project[] = [
  {
    id: 'proj_01',
    title: 'Diabetes Control 3 Simple Daily Habits',
    titleHi: 'डायबिटीज कंट्रोल के 3 आसान तरीके',
    industry: 'Healthcare & Wellness',
    category: 'Health Awareness',
    status: 'in_progress',
    updatedAt: '2026-10-27T10:15:00',
    timeAgo: '2 hours ago',
    format: 'reel',
    duration: '45s',
    scriptSnippet: 'क्या आपका शुगर लेवल बार-बार बढ़ता है? आज जानिए 3 साधारण उपाय जो आपकी दिनचर्या बदल देंगे...',
    isDemo: true,
    businessProfileId: 'bp_health',
    scriptVersions: [
      {
        version: 2,
        updatedAt: '2026-10-27T10:15:00',
        hook: 'क्या आपका ब्लड शुगर लेवल डाइट कंट्रोल के बाद भी बढ़ता है? आज जानिए डॉक्टर द्वारा प्रमाणित 3 आसान आदतें!',
        mainContent: [
          '1. सुबह खाली पेट 1 गिलास गुनगुने पानी में मेथी दाना का पानी पिएं।',
          '2. भोजन के ठीक बाद 15 मिनट की वॉक (100 कदम) जरूर करें।',
          '3. डिनर में रिफाइंड कार्ब्स हटाकर हाई-फाइबर हरी पत्तेदार सब्जियां शामिल करें।'
        ],
        closing: 'इन 3 आदतों को 21 दिन अपनाएं और फर्क महसूस करें। वीडियो को सेव करें और अपने परिवार से शेयर करें!'
      },
      {
        version: 1,
        updatedAt: '2026-10-26T14:30:00',
        hook: 'डायबिटीज से बचना है तो यह वीडियो पूरा देखें!',
        mainContent: [
          'मेथी पानी सुबह पिएं।',
          'रोजाना 20 मिनट टहलें।',
          'मीठा और तली चीजें कम खाएं।'
        ],
        closing: 'स्वस्थ रहें, खुश रहें। फॉलो करना न भूलें!'
      }
    ],
    scenes: [
      {
        sceneNumber: 1,
        timeRange: '0-5s',
        description: 'Person checking blood glucose meter with worried look',
        descriptionHi: 'मीटर पर ब्लड शुगर चेक करते हुए चिंतित व्यक्ति',
        imageUrl: '/assets/aistudio/Master_Admin_UI___________1_Dashboard_65597d51.png',
        selected: true
      },
      {
        sceneNumber: 2,
        timeRange: '5-20s',
        description: 'Fresh fenugreek seeds in glass of warm water & healthy meal plate',
        descriptionHi: 'गुनगुने पानी में मेथी दाना और हरी सलाद की प्लेट',
        imageUrl: '/assets/aistudio/Master_Admin_UI___________6_Visual_Assets_Management_bfd1be4e.png',
        selected: true
      },
      {
        sceneNumber: 3,
        timeRange: '20-35s',
        description: 'Person walking briskly in morning sunlight in park',
        descriptionHi: 'पार्क में सुबह की धूप में टहलता हुआ स्वस्थ व्यक्ति',
        imageUrl: '/assets/aistudio/Master_Admin_UI___________5_Template_Library_Management_086512f2.png',
        selected: true
      },
      {
        sceneNumber: 4,
        timeRange: '35-45s',
        description: 'Smiling doctor giving thumbs up with follow button graphic',
        descriptionHi: 'डॉक्टर मुस्कुराते हुए थम्स अप करते हुए',
        imageUrl: '/assets/aistudio/Square_Scripter_Logo_d7bb9aeb.png',
        selected: true
      }
    ],
    notes: 'Approved by clinical advisory team. Ready for teleprompter recording.',
    media: [
      {
        id: 'media_demo_01',
        title: 'Take 1 - Natural Light Kitchen',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        type: 'recorded',
        duration: 42,
        aspectRatio: '9:16',
        recordedAt: '2026-10-26T14:45:00',
        resolution: '1080p (Full HD)',
        fileSize: '24.8 MB',
        mimeType: 'video/mp4',
        trimStart: 0,
        trimEnd: 42,
        thumbnailUrl: '/assets/aistudio/Master_Admin_UI___________6_Visual_Assets_Management_bfd1be4e.png'
      }
    ],
    activeMediaId: 'media_demo_01',
    studioDraft: {
      aspectRatio: '9:16',
      trimStart: 0,
      trimEnd: 42,
      showSubtitles: true,
      subtitleStyle: 'highlight',
      showLogoWatermark: true,
      watermarkText: 'Scripter Creator',
      backgroundMusic: true,
      musicVolume: 35,
      selectedClipIndex: 0,
      appliedAiSuggestions: ['Remove 3 silent pauses (1.2s)', 'Auto-generate captions'],
      updatedAt: '2026-10-26T15:10:00'
    }
  },
  {
    id: 'proj_02',
    title: 'Orchha Heritage & History Reel',
    titleHi: 'ओरछा का ऐतिहासिक वैभव और रहस्य',
    industry: 'News & Media',
    category: 'Travel & Culture',
    status: 'completed',
    updatedAt: '2026-10-26T16:30:00',
    timeAgo: 'Yesterday',
    format: 'short',
    duration: '60s',
    scriptSnippet: 'बुंदेलखंड की धरती पर बसा ओरछा, जहाँ आज भी राम राजा के रूप में पूजे जाते हैं...',
    isDemo: true,
    businessProfileId: 'bp_media',
    scriptVersions: [
      {
        version: 1,
        updatedAt: '2026-10-26T16:30:00',
        hook: 'भारत का एकमात्र ऐसा शहर जहां भगवान राम को राजा के रूप में गार्ड ऑफ ऑनर दिया जाता है!',
        mainContent: [
          '1. बेतवा नदी के तट पर बसा ओरछा 16वीं शताब्दी में बुंदेला राजा रुद्र प्रताप सिंह द्वारा बसाया गया था।',
          '2. रामराजा मंदिर दुनिया का इकलौता मंदिर है जहां राम जी को सशस्त्र सलामी मिलती है।',
          '3. जहांगीर महल और चतुर्भुज मंदिर की वास्तुकला आज भी पर्यटकों को हैरान कर देती है।'
        ],
        closing: 'क्या आप कभी ओरछा गए हैं? कमेंट में बताएं और ऐसी ऐतिहासिक धरोहरों के लिए फॉलो करें!'
      }
    ],
    scenes: [
      {
        sceneNumber: 1,
        timeRange: '0-10s',
        description: 'Cinematic aerial drone shot of Orchha Fort and Betwa river at sunset',
        descriptionHi: 'ओरछा किले और बेतवा नदी का मनमोहक हवाई दृश्य',
        imageUrl: '/assets/aistudio/Master_Admin_UI___________6_Visual_Assets_Management_bfd1be4e.png',
        selected: true
      }
    ]
  },
  {
    id: 'proj_03',
    title: 'Morning Yoga Routine for Mental Peace',
    titleHi: 'मानसिक शांति के लिए 5 मिनट योगासन',
    industry: 'Healthcare & Wellness',
    category: 'Fitness & Mindfulness',
    status: 'draft',
    updatedAt: '2026-10-25T11:00:00',
    timeAgo: '2 days ago',
    format: 'reel',
    duration: '30s',
    scriptSnippet: 'सुबह उठते ही अगर तनाव महसूस होता है, तो इन 3 आसनों से दिन की शुरुआत करें...',
    isDemo: true,
    businessProfileId: 'bp_health',
  },
  {
    id: 'proj_04',
    title: 'Diwali Festive Video Campaign',
    titleHi: 'त्योहार स्पेशल वीडियो अभियान',
    industry: 'News & Media',
    category: 'Festive Special',
    status: 'completed',
    updatedAt: '2026-10-24T09:20:00',
    timeAgo: '3 days ago',
    format: 'short',
    duration: '60s',
    scriptSnippet: 'रोशनी और उमंग के इस पावन पर्व पर अपनों के साथ साझा करें खुशियों का नया पैगाम...',
    isDemo: true,
    businessProfileId: 'bp_media',
  },
];

export const DEMO_PLATFORM_METRICS: PlatformMetrics = {
  totalUsers: 12842,
  usersGrowthMonthly: 12,
  businessProfiles: 4980,
  profilesGrowthMonthly: 18,
  totalProjects: 38542,
  projectsGrowthMonthly: 26,
  totalAiRequests: 542380,
  aiRequestsGrowthMonthly: 32,
  totalRevenueInr: 824630,
  revenueGrowthMonthly: 28,
  isDemoData: true,
};

export const DEMO_RECENT_ADMIN_USERS = [
  {
    name: 'Amit Sharma',
    email: 'amit.sharma@gmail.com',
    industry: 'Education & Coaching',
    joinedDate: '31 Oct 2026',
    status: 'Active',
    plan: 'Pro',
  },
  {
    name: 'Priya Verma',
    email: 'priya.verma@gmail.com',
    industry: 'Business & Marketing',
    joinedDate: '31 Oct 2026',
    status: 'Active',
    plan: 'Business',
  },
  {
    name: 'Rahul Yadav',
    email: 'rahul.yadav@gmail.com',
    industry: 'IT & Technology',
    joinedDate: '30 Oct 2026',
    status: 'Active',
    plan: 'Free',
  },
  {
    name: 'Neha Singh',
    email: 'neha.singh@gmail.com',
    industry: 'Healthcare & Wellness',
    joinedDate: '30 Oct 2026',
    status: 'Active',
    plan: 'Pro',
  },
  {
    name: 'Suresh Patel',
    email: 'suresh.patel@gmail.com',
    industry: 'Food & Recipe',
    joinedDate: '29 Oct 2026',
    status: 'Active',
    plan: 'Business',
  },
];

export const DEMO_TOP_TEMPLATES = [
  { rank: 1, name: 'YouTube Video Script', nameHi: 'यूट्यूब वीडियो स्क्रिप्ट', uses: 3842, category: 'Education' },
  { rank: 2, name: 'Instagram Reel Script', nameHi: 'इंस्टाग्राम रील स्क्रिप्ट', uses: 2976, category: 'Marketing' },
  { rank: 3, name: 'Blog to Video Explainer', nameHi: 'ब्लॉग आर्टिकल वीडियो', uses: 1824, category: 'Technology' },
  { rank: 4, name: 'Interview & Podcast Script', nameHi: 'इंटरव्यू स्क्रिप्ट', uses: 1562, category: 'Media' },
  { rank: 5, name: 'Product Review Reel', nameHi: 'प्रोडक्ट रिव्यू स्क्रिप्ट', uses: 1348, category: 'E-Commerce' },
];

export const DEMO_CONTENT_IDEAS: ContentIdea[] = [
  {
    id: 'idea_solar_01',
    title: 'How to Reduce Electricity Bill with Solar Panels',
    titleHi: 'सोलर पैनल से बिजली बिल कैसे कम करें?',
    industry: 'Real Estate',
    category: 'कृषि / सौर',
    format: 'Short (15-30s)',
    duration: 'Reels (60 सेकंड)',
    relevance: 'High',
    relevanceLabel: 'उच्च',
    viewCount: '2.4M views',
    targetAudience: 'Homeowners, Business Owners & Small Factory Owners',
    engagementPotential: 'Viral',
    usageCount: '1.2K उपयोग',
    tags: ['#SolarEnergy', '#SaveElectricity', '#GreenEnergy', '#GovernmentSubsidy'],
    imageUrl: '/assets/aistudio/Master_Admin_UI___________9_Payments___Billing_Management_7414dccf.png',
    summary: 'Explains how rooftop solar panels can reduce residential and commercial electricity bills by up to 90%, including government subsidies under PM Surya Ghar Yojana.',
    summaryHi: 'सोलर पैनल लगाने से घर और व्यवसाय दोनों में बिजली बिल को काफी हद तक कम किया जा सकता है। सरकार की कई योजनाओं से इसकी लागत भी घटती है।',
    keyPoints: [
      'How does a solar panel system work? (Photovoltaic cells convert sunlight to electricity)',
      'What system capacity is optimal for standard households? (2-3 kW system covers typical needs)',
      'Costs, subsidies, and government schemes (PM Surya Ghar provides up to ₹78,000 direct subsidy)',
      'Estimated savings on monthly electricity bills (reduce bills by 80% to 90%)',
      'Crucial maintenance and installation factors (roof angle, certified inverter, 25-year warranty)'
    ],
    keyPointsHi: [
      'सोलर पैनल कैसे काम करता है? (फोटोवोल्टिक सेल सूरज की धूप से सीधी बिजली बनाते हैं)',
      'घर के लिए सही सिस्टम कितना होना चाहिए? (2 से 3 किलोवाट का सिस्टम सामान्य घर के लिए उपयुक्त है)',
      'लागत, सब्सिडी और सरकारी योजनाएं (पीएम सूर्य घर योजना से सीधे खाते में ₹78,000 तक की सब्सिडी)',
      'बिजली बिल में संभावित बचत (हर महीने बिल में 80% से 90% तक की भारी बचत)',
      'किन बातों का ध्यान रखना ज़रूरी है? (छत की दिशा, इन्वर्टर की गुणवत्ता और 25 साल की वारंटी)'
    ],
    suggestedHooks: [
      {
        type: 'Question',
        hook: 'Are you frustrated with surging electricity bills every single month?',
        hookHi: 'क्या आपका भी बिजली का बिल हर महीने बढ़ता जा रहा है?'
      },
      {
        type: 'Shocking Fact',
        hook: 'One-time investment, and your electricity is virtually free for 25 years!',
        hookHi: 'सिर्फ एक बार का निवेश, और 25 साल तक बिजली के बिल से पूरी तरह आजादी!'
      },
      {
        type: 'Government Subsidy',
        hook: 'The government is depositing up to ₹78,000 subsidy directly into bank accounts for rooftop solar.',
        hookHi: 'सरकार दे रही है सोलर पैनल लगाने पर ₹78,000 की सीधी सब्सिडी, जानिए कैसे!'
      }
    ],
    suggestedAngles: [
      {
        angle: 'Budget Savings Focus',
        angleHi: 'बजट और मासिक बचत दृष्टिकोण',
        targetAudience: 'Middle-class families and small shops'
      },
      {
        angle: 'Govt Subsidy Step-by-Step',
        angleHi: 'सरकारी योजना व सब्सिडी की आसान प्रक्रिया',
        targetAudience: 'Homeowners looking for quick financial clarity'
      },
      {
        angle: 'Technical Reliability & Lifespan',
        angleHi: 'तकनीकी मजबूती और 25 साल की वारंटी',
        targetAudience: 'Informed buyers comparing solar brands'
      }
    ],
    outline: [
      'Hook (0-5s): Are you frustrated with surging electricity bills every single month?',
      'Core Points (5-45s): Solar panels provide an immediate, eco-friendly solution that cuts electricity expenses by 80-90% while earning government subsidies.',
      'Call to Action (45-60s): If you are considering rooftop solar, check the link below to calculate your estimated savings today!'
    ],
    outlineHi: [
      'हुक (0-5 सेकंड): क्या आपका भी बिजली का बिल हर महीने बढ़ता जा रहा है?',
      'मुख्य भाग (5-50 सेकंड): तो इसके लिए एक बढ़िया समाधान है - सोलर पैनल। सोलर पैनल सूरज की रोशनी से बिजली बनाता है, जिससे आप अपने घर या ऑफिस की ज़रूरत का बड़ा हिस्सा खुद ही पूरा कर सकते हैं। इसकी लागत पहले जैसी नहीं रही, क्योंकि सरकार की सब्सिडी और कई योजनाओं से यह अब अधिक किफायती हो गया है।',
      'समापन और CTA (50-60 सेकंड): अगर आप भी बिजली बिल में लंबे समय तक बचत करना चाहते हैं, तो आज ही सोलर पैनल के विकल्पों के बारे में जानकारी लें और अपने घर के लिए सही सिस्टम चुनें। ऐसा ही और उपयोगी कंटेंट पाने के लिए हमारे चैनल को फॉलो करें!'
    ],
    sources: [
      { name: 'नवभारत टाइम्स — घर पर सोलर पैनल लगाने की सरकारी योजना...', url: 'https://navbharattimes.indiatimes.com', date: '27 Oct 2026', verified: true },
      { name: 'अमर उजाला — सोलर पैनल: लागत, सब्सिडी और फायदे...', url: 'https://www.amarujala.com', date: '26 Oct 2026', verified: true },
      { name: 'PIB (भारत सरकार) — रूफटॉप सोलर योजना — आधिकारिक जानकारी', url: 'https://pib.gov.in', date: '25 Oct 2026', verified: true },
      { name: 'PM Surya Ghar Muft Bijli Yojana Portal', url: 'https://pmsuryaghar.gov.in', date: 'Oct 2026', verified: true },
      { name: 'Ministry of New & Renewable Energy (MNRE)', url: 'https://mnre.gov.in', date: 'Sep 2026', verified: true }
    ],
    isTrending: true,
    sourceAttributionType: 'public_research',
    businessProfileId: 'bp_realestate'
  },
  {
    id: 'idea_reels_content_01',
    title: '5 Best Content Ideas for Reels',
    titleHi: 'Reels के लिए 5 बेहतरीन कंटेंट आइडिया',
    industry: 'News & Media',
    category: 'बिज़नेस',
    format: 'Short (15-30s)',
    duration: '15-30 sec',
    relevance: 'High',
    relevanceLabel: 'उच्च',
    viewCount: '2.4M views',
    targetAudience: 'Digital Creators, Social Media Managers & Influencers',
    engagementPotential: 'Viral',
    usageCount: '2.4M views',
    tags: ['#Social Media', '#Reels', '#Content Creation', '#Digital Marketing'],
    imageUrl: '/assets/aistudio/Master_Admin_UI___________1_-_Notifications___Alerts_Management_e6446e8c.png',
    summary: 'Short-form vertical video is currently the most impactful medium for creators. Here are 5 battle-tested content formats that consistently drive reach and retention.',
    summaryHi: 'आज के डिजिटल दौर में शॉर्ट वीडियो यानी रील्स सबसे प्रभावी माध्यम बन चुके हैं। यह विषय उन क्रिएटर्स के लिए खास है जो कम समय में ज्यादा दर्शकों तक पहुंचना चाहते हैं।',
    keyPoints: [
      'Average duration of 15–30 seconds yields the highest viewer completion and retention.',
      'Trending audio tracks and niche-specific hashtags significantly enhance algorithmic distribution.',
      'Integrating storytelling, emotion, and tangible takeaways turns passive scrollers into followers.',
      'The first 3 seconds decide whether a viewer stays or swipes away.',
      'A clear, low-friction Call to Action (CTA) multiplies comment velocity.'
    ],
    keyPointsHi: [
      'रील्स की औसत लंबाई 15–30 सेकंड सबसे ज्यादा प्रभावी होती है।',
      'ट्रेंडिंग ऑडियो और हैशटैग्स से रीच तेजी से बढ़ती है।',
      'कंटेंट में कहानी, इमोशन और वैल्यू जरूरी है।',
      'शुरुआती 3 सेकंड का हुक 80% दर्शकों को रोक कर रखता है।',
      'स्पष्ट और सरल कॉल टू एक्शन (CTA) से दर्शक कमेंट और फॉलो करते हैं।'
    ],
    suggestedHooks: [
      {
        type: 'Question',
        hook: 'Do you want your Instagram reels to reach hundreds of thousands of people organically?',
        hookHi: 'क्या आप भी चाहते हैं कि आपकी रील्स लाखों लोगों तक पहुंचे?'
      },
      {
        type: 'Mistake Avoidance',
        hook: '90% of creators make this fatal mistake in their first 3 seconds!',
        hookHi: '90% क्रिएटर्स अपनी रील के पहले 3 सेकंड में यह गलती करते हैं!'
      },
      {
        type: 'Direct Value',
        hook: 'Here are 5 content ideas that will make your reels impossible to scroll past.',
        hookHi: 'तो चलिए जानते हैं 5 ऐसे कंटेंट आइडिया जो आपकी रील्स को बना सकते हैं वायरल!'
      }
    ],
    suggestedAngles: [
      {
        angle: 'Behind the Scenes & Work in Progress',
        angleHi: 'Behind the Scenes — अपने काम की झलक दिखाएं',
        targetAudience: 'Creators and craftspeople building trust'
      },
      {
        angle: 'Bite-Sized Problem Solving',
        angleHi: 'Quick Tips — अपने एक्सपर्टीज से छोटे और उपयोगी टिप्स दें',
        targetAudience: 'Educators, coaches, and professionals'
      },
      {
        angle: 'Relatable Storytelling',
        angleHi: 'Customer Story & Day in My Life — सच्ची कहानी व अनुभव साझा करें',
        targetAudience: 'General social audience looking for authentic connection'
      }
    ],
    outline: [
      'Hook (0-5s): Do you want your reels to reach hundreds of thousands of people? Here are 5 content ideas to make your videos viral!',
      'Main Content (5-50s): 1. Behind the scenes. 2. Quick industry tips. 3. Trend challenge twist. 4. Customer case study. 5. Day in my life vlog.',
      'CTA (50-60s): Which idea will you try in your next reel? Save this video and comment below!'
    ],
    outlineHi: [
      '1. Hook (0-5 सेकंड): क्या आप भी चाहते हैं कि आपकी रील्स लाखों लोगों तक पहुंचे? तो चलिए जानते हैं 5 ऐसे कंटेंट आइडिया जो आपकी रील्स को बना सकते हैं वायरल!',
      '2. Main Content (5-50 सेकंड): 1. Behind the Scenes - अपने काम की झलक दिखाएं। 2. Quick Tips - अपने एक्सपर्टीज से छोटे टिप्स दें। 3. Trend Challenge - चल रहे ट्रेंड्स में शामिल हों। 4. Customer Story - अपने क्लाइंट्स की सफलता बताएं। 5. Day in My Life - अपनी दिनचर्या या यात्रा दिखाएं।',
      '3. CTA (50-60 सेकंड): तो देर किस बात की? आज ही इन आइडियाज में से एक चुनें और अपनी अगली रील बनाएं! अगर मदद चाहिए तो मुझे फॉलो करें और कमेंट में बताएं।'
    ],
    sources: [
      { name: 'Social Media Today — Reels Trends 2024', url: 'https://www.socialmediatoday.com', date: '12 Oct 2024', verified: true },
      { name: 'HubSpot — Short Form Video Guide', url: 'https://blog.hubspot.com', date: '08 Oct 2024', verified: true },
      { name: 'YouTube Creator Academy', url: 'https://creatoracademy.youtube.com', date: '05 Oct 2024', verified: true }
    ],
    isTrending: true,
    sourceAttributionType: 'public_research',
    businessProfileId: 'bp_media'
  },
  {
    id: 'idea_smb_marketing_01',
    title: 'Digital Marketing Tips for Small Businesses',
    titleHi: 'Small Business के लिए Digital Marketing Tips',
    industry: 'Business Consulting',
    category: 'बिजनेस',
    format: 'Short (15-30s)',
    duration: 'Reels (60 सेकंड)',
    relevance: 'High',
    relevanceLabel: 'उच्च',
    viewCount: '1.5M views',
    targetAudience: 'Shop Owners, Local Services, Entrepreneurs',
    engagementPotential: 'Trending',
    usageCount: '1.5M views',
    tags: ['#Business', '#Marketing', '#SMBGrowth', '#LocalBusiness'],
    imageUrl: '/assets/aistudio/Master_Admin_UI___________2_User_Management_23b83c9a.png',
    summary: 'Practical zero-budget marketing tactics for small businesses: Google My Business local SEO, WhatsApp broadcast retention, and hyper-local reels.',
    summaryHi: 'छोटे व्यापारों के लिए बिना ज्यादा खर्च किए डिजिटल मार्केटिंग के 3 असरदार उपाय: गूगल बिजनेस प्रोफाइल, व्हाट्सएप ब्रॉडकास्ट और लोकल रील्स।',
    keyPoints: [
      'Optimizing Google My Business profile drives up to 40% more walk-in store visitors.',
      'Short videos showcasing product making or customer delight outperform static discount banners.',
      'WhatsApp status and customer groups generate 5x repeat purchases without ad spend.'
    ],
    keyPointsHi: [
      'गूगल माय बिजनेस पर सही फोटो व रिव्यू डालने से स्थानीय ग्राहक 40% तक बढ़ते हैं।',
      'प्रोडक्ट की मेकिंग या ग्राहकों की खुशी का छोटा वीडियो बैनर विज्ञापनों से ज्यादा बिकता है।',
      'व्हाट्सएप स्टेटस से बिना किसी अतिरिक्त खर्च के पुराने ग्राहकों से दोबारा ऑर्डर आते हैं।'
    ],
    outline: [
      'Hook (0-5s): Are you spending money on ads with zero results? Here is how small shops get customers for free.',
      'Core Points (5-45s): 1. Update Google Maps listing. 2. Post daily 30-sec product reels. 3. Build a VIP WhatsApp loyalty list.',
      'Call to Action (45-60s): Which of these does your business use? Comment your shop city below!'
    ],
    outlineHi: [
      'हुक (0-5 सेकंड): क्या आप भी विज्ञापन में पैसे बर्बाद कर रहे हैं? जानिए छोटे बिजनेस के लिए 3 मुफ्त और असरदार मार्केटिंग तरीके!',
      'मुख्य बात (5-45 सेकंड): 1. अपनी गूगल लिस्टिंग को अपडेट रखें। 2. हर दिन अपने काम का छोटा वीडियो शेयर करें। 3. पुराने ग्राहकों के लिए स्पेशल व्हाट्सएप ऑफर बनाएं।',
      'निष्कर्ष और CTA (45-60 सेकंड): अपने बिजनेस को बड़ा करने के लिए इस वीडियो को सेव करें और हमारे पेज को फॉलो करें!'
    ],
    sources: [
      { name: 'Google Small Business Insights', url: 'https://smallbusiness.withgoogle.com', date: '2026', verified: true },
      { name: 'Federation of Small Businesses Survey', url: 'https://fsb.org.uk', date: '2026', verified: true }
    ],
    isTrending: false,
    sourceAttributionType: 'public_research',
    businessProfileId: 'bp_business'
  },
  {
    id: 'idea_mental_health_01',
    title: 'Mental Health in Daily Life',
    titleHi: 'मानसिक स्वास्थ्य और रोज़मर्रा की ज़िंदगी',
    industry: 'Healthcare & Wellness',
    category: 'स्वास्थ्य',
    format: 'Short (15-30s)',
    duration: 'Shorts 45 सेकंड',
    relevance: 'High',
    relevanceLabel: 'उच्च',
    viewCount: '980K views',
    targetAudience: 'Working Professionals, Students, Stressed Individuals',
    engagementPotential: 'Trending',
    usageCount: '980K views',
    tags: ['#Health', '#Lifestyle', '#MentalHealth', '#Mindfulness'],
    imageUrl: '/assets/aistudio/Master_Admin_UI___________17_-_Feedback_Analytics_f27c3e1e.png',
    summary: 'Practical everyday habits to overcome stress, anxiety, and digital burnout through mindful breathing, screen boundaries, and physical movement.',
    summaryHi: 'दौड़भाग भरी जिंदगी में मानसिक शांति, तनाव से राहत और सुकून भरी नींद के लिए 3 वैज्ञानिक व आसान दैनिक आदतें।',
    keyPoints: [
      '10 minutes of morning daylight exposure regulates serotonin and sleep cycles.',
      'The 4-7-8 breathing method physically downregulates acute stress within 60 seconds.',
      'Stopping social media scrolling 45 minutes before sleep restores deep REM rest.'
    ],
    keyPointsHi: [
      'सुबह 10 मिनट हल्की धूप लेने से दिमाग में सेरोटोनिन बढ़ता है और मन शांत रहता है।',
      '4-7-8 सांस लेने का नियम 60 सेकंड में घबराहट और चिंता को कम कर देता है।',
      'सोने से 45 मिनट पहले फोन बंद रखने से तनावमुक्त गहरी नींद आती है।'
    ],
    outline: [
      'Hook (0-5s): Feeling overwhelmed and constantly exhausted? Your brain needs this 60-second reset.',
      'Core Points (5-35s): 1. Morning sunlight before screens. 2. 4-7-8 box breathing. 3. Nighttime digital curfew.',
      'Call to Action (35-45s): Share this with someone who needs mental peace today. Take care of yourself!'
    ],
    outlineHi: [
      'हुक (0-5 सेकंड): क्या आप भी हर वक्त तनाव और थकान महसूस करते हैं? जानिए दिमाग को तुरंत शांत करने का 60 सेकंड का फॉर्मूला!',
      'मुख्य बात (5-35 सेकंड): 1. सुबह उठते ही फोन देखने के बजाय 5 मिनट धूप में बैठें। 2. जब भी चिंता हो, 4 सेकंड सांस लें, 7 सेकंड रोकें और 8 सेकंड में छोड़ें। 3. रात को सोने से पहले स्क्रीन से दूरी बनाएं।',
      'निष्कर्ष और CTA (35-45 सेकंड): इस वीडियो को अपने दोस्तों से शेयर करें ताकि वो भी मानसिक रूप से स्वस्थ रह सकें। स्वस्थ रहें, मुस्कुराते रहें!'
    ],
    sources: [
      { name: 'National Institute of Mental Health (NIMH)', url: 'https://nimh.nih.gov', date: '2026', verified: true },
      { name: 'World Health Organization (WHO) Mind Wellness Advisory', url: 'https://who.int', date: '2026', verified: true }
    ],
    isTrending: false,
    sourceAttributionType: 'public_research',
    businessProfileId: 'bp_health'
  },
  {
    id: 'idea_nep_news_01',
    title: 'What are the Big Changes in the New Education Policy?',
    titleHi: 'नई शिक्षा नीति में क्या हैं बड़े बदलाव?',
    industry: 'Education & Training',
    category: 'शिक्षा',
    format: 'Short (15-30s)',
    duration: 'Reels 60 सेकंड',
    relevance: 'Trending',
    relevanceLabel: 'ट्रेंडिंग',
    viewCount: 'आज - 2.4M views',
    targetAudience: 'Parents, Students, Educators, Policy Enthusiasts',
    engagementPotential: 'Viral',
    usageCount: '2.4M views',
    tags: ['#Education', '#Policy', '#NEP2026', '#Students'],
    imageUrl: '/assets/aistudio/Master_Admin_UI___________4_Industry_Categories_Management_c2759e0a.png',
    summary: 'A fast, verified breakdown of recent structural updates in schools and colleges: 5+3+3+4 framework, regional language options, and practical skill learning.',
    summaryHi: 'स्कूलों और कॉलेजों में हुए ताज़ा बड़े बदलाव: 5+3+3+4 पैटर्न, मातृभाषा में पढ़ाई, वोकेशनल ट्रेनिंग और बोर्ड परीक्षाओं का नया स्वरूप।',
    keyPoints: [
      'The 10+2 system is completely transformed into the foundational 5+3+3+4 structure.',
      'Early education emphasizes experiential and activity-based learning over rote memorization.',
      'Multiple entry and exit points in undergraduate degrees allow students to resume studies without losing credits.'
    ],
    keyPointsHi: [
      'पुराना 10+2 सिस्टम अब पूरी तरह 5+3+3+4 के नए फॉर्मेट में बदल चुका है।',
      'कक्षा 6 से ही कोडिंग और वोकेशनल स्किल्स (व्यावहारिक हुनर) की पढ़ाई अनिवार्य की गई है।',
      'कॉलेज में मल्टीपल एंट्री-एग्जिट सिस्टम लागू होने से साल खराब होने का डर खत्म हो गया है।'
    ],
    outline: [
      'Hook (0-5s): Huge educational transformation in India! Here is what every parent and student must know today.',
      'Core Points (5-45s): 1. Foundational stage changes. 2. Skill learning from class 6. 3. Flexible college credit bank.',
      'Call to Action (45-60s): What do you think about these changes? Share your thoughts below and subscribe for verified updates!'
    ],
    outlineHi: [
      'हुक (0-5 सेकंड): क्या आपको पता है कि देश की शिक्षा प्रणाली में कौन से बड़े बदलाव लागू हो चुके हैं? जानिए 3 सबसे महत्वपूर्ण बातें!',
      'मुख्य बात (5-45 सेकंड): 1. रटने के बजाय प्रैक्टिकल हुनर सिखाने पर जोर। 2. कक्षा 6 से ही वोकेशनल ट्रेनिंग की शुरुआत। 3. कॉलेज की पढ़ाई में ब्रेक लेने पर भी क्रेडिट सुरक्षित रहने की सुविधा।',
      'निष्कर्ष और CTA (45-60 सेकंड): यह जानकारी सभी माता-पिता और छात्रों तक पहुंचाएं। वीडियो को शेयर करें!'
    ],
    sources: [
      { name: 'Ministry of Education (शिक्षा मंत्रालय भारत सरकार)', url: 'https://education.gov.in', date: '28 Oct 2026', verified: true },
      { name: 'University Grants Commission (UGC) Gazette', url: 'https://ugc.gov.in', date: '27 Oct 2026', verified: true }
    ],
    isTrending: true,
    isTimelyNews: true,
    sourceAttributionType: 'verified_news',
    businessProfileId: 'bp_education'
  },
  {
    id: 'idea_stock_market_01',
    title: 'Signs of Bullish Rally in Stock Market Today',
    titleHi: 'शेयर बाज़ार में आज तेज़ी के संकेत',
    industry: 'Business & Finance',
    category: 'बिज़नेस',
    format: 'Short (15-30s)',
    duration: 'Reels 45 सेकंड',
    relevance: 'Trending',
    relevanceLabel: 'ट्रेंडिंग',
    viewCount: 'आज - 1.8M views',
    targetAudience: 'Investors, Traders, Finance Followers',
    engagementPotential: 'Viral',
    usageCount: '1.8M views',
    tags: ['#Finance', '#StockMarket', '#Nifty', '#Sensex'],
    imageUrl: '/assets/aistudio/Master_Admin_UI___________14_-_Usage___AI_Credits_Management_3ee78b27.png',
    summary: 'Key market triggers driving today\'s index rally: foreign institutional inflows, manufacturing index highs, and strong festive quarter corporate earnings.',
    summaryHi: 'शेयर बाजार में आज की तेजी के 3 प्रमुख कारण: विदेशी निवेशकों की मजबूत खरीदारी, ऑटो व बैंकिंग सेक्टर में उछाल और सकारात्मक तिमाही नतीजे।',
    keyPoints: [
      'Nifty and Sensex opened higher driven by robust FII institutional buying in early trade.',
      'Banking and capital goods sectors led sectoral gainers with over 1.8% intraday surges.',
      'Retail investors are advised to adhere to strict risk management rather than chasing breakout peaks.'
    ],
    keyPointsHi: [
      'निफ्टी और सेंसेक्स में विदेशी संस्थागत निवेशकों (FII) की ताज़ा खरीदारी से उछाल देखा गया।',
      'बैंकिंग और ऑटो सेक्टर ने बाज़ार की रैली का नेतृत्व किया।',
      'छोटे निवेशकों को सलाह है कि बिना स्टॉपलॉस और रिसर्च के ट्रेडिंग न करें।'
    ],
    outline: [
      'Hook (0-5s): Green wave across Dalal Street today! Why is the stock market rallying so aggressively?',
      'Core Points (5-35s): 1. Foreign institutional buying. 2. Banking index performance. 3. Strong quarterly corporate outlook.',
      'Call to Action (35-45s): Are you invested in this rally? Tell us your favorite sector in the comments!'
    ],
    outlineHi: [
      'हुक (0-5 सेकंड): बाज़ार में आज चौतरफा हरियाली! जानिए किन 3 कारणों से शेयर बाजार में आई है जबर्दस्त तेजी!',
      'मुख्य बात (5-35 सेकंड): 1. विदेशी संस्थागत निवेशकों की भारी खरीदारी। 2. बैंकिंग और आईटी शेयरों में तेजी। 3. कंपनियों के बेहतरीन वित्तीय परिणाम।',
      'निष्कर्ष और CTA (35-45 सेकंड): अपनी निवेश यात्रा को समझदारी से आगे बढ़ाएं। वीडियो को सेव करें और फाइनेंस अपडेट्स के लिए फॉलो करें!'
    ],
    sources: [
      { name: 'National Stock Exchange (NSE India Market Feed)', url: 'https://nseindia.com', date: '28 Oct 2026', verified: true },
      { name: 'BSE Market Bulletin', url: 'https://bseindia.com', date: '28 Oct 2026', verified: true }
    ],
    isTrending: true,
    isTimelyNews: true,
    sourceAttributionType: 'verified_news',
    businessProfileId: 'bp_business'
  },
  {
    id: 'idea_weather_mp_01',
    title: 'How will the weather be in Madhya Pradesh today?',
    titleHi: 'मध्य प्रदेश में आज कैसा रहेगा मौसम?',
    industry: 'News & Media',
    category: 'मौसम',
    format: 'Short (15-30s)',
    duration: 'Video 1 मिनट',
    relevance: 'Trending',
    relevanceLabel: 'मौसम अपडेट',
    viewCount: 'आज - 1.2M views',
    targetAudience: 'MP Citizens, Farmers, Commuters, Travelers',
    engagementPotential: 'Trending',
    usageCount: '1.2M views',
    tags: ['#Weather', '#MP', '#Bhopal', '#Indore'],
    imageUrl: '/assets/aistudio/Master_Admin_UI___________18_-_Support_Tickets_Management_bea7e05e.png',
    summary: 'Statewide meteorological bulletin for MP: morning chill in northern districts, clear skies in central regions, and agricultural advice for Rabi sowing.',
    summaryHi: 'मौसम विभाग की ताज़ा रिपोर्ट: ग्वालियर-चंबल अंचल में सुबह ठंड की दस्तक, भोपाल-इंदौर में साफ मौसम और किसानों के लिए रबी फसलों की ज़रूरी सलाह।',
    keyPoints: [
      'Night temperatures dipped by 2 to 3 degrees across northern and eastern MP districts.',
      'Day temperatures remain pleasant with minimal rain probability across Bhopal, Indore, and Jabalpur.',
      'Agricultural advisory recommends timely soil preparation for wheat and mustard cultivation.'
    ],
    keyPointsHi: [
      'ग्वालियर, रीवा और चंबल संभाग में रात के तापमान में 2 से 3 डिग्री की गिरावट दर्ज की गई है।',
      'भोपाल, इंदौर और नर्मदापुरम में दिन में खिली धूप रहेगी, बारिश का कोई अनुमान नहीं है।',
      'किसानों के लिए गेहूं व सरसों की बुवाई के संबंध में विशेष मौसम निर्देश जारी किए गए हैं।'
    ],
    outline: [
      'Hook (0-5s): Changing weather across Madhya Pradesh today! Here is your quick district weather bulletin.',
      'Core Points (5-35s): 1. Temperature drops in Gwalior-Chambal. 2. Clear sunny skies in Indore and Bhopal. 3. Advisory for Rabi farmers.',
      'Call to Action (35-45s): Which district are you watching from? Comment your city weather below!'
    ],
    outlineHi: [
      'हुक (0-5 सेकंड): मध्य प्रदेश में मौसम ने ली करवट! जानिए आज आपके जिले में कैसा रहेगा तापमान!',
      'मुख्य बात (5-35 सेकंड): 1. उत्तरी जिलों में सुबह हल्की ठंडक की शुरुआत। 2. भोपाल और इंदौर में खिली धूप के साथ मौसम सुहावना रहेगा। 3. रबी फसलों की बुवाई के लिए मौसम पूरी तरह अनुकूल है।',
      'निष्कर्ष और CTA (35-45 सेकंड): अपने शहर का मौसम जानने के लिए कमेंट में अपने जिले का नाम लिखें और वीडियो शेयर करें!'
    ],
    sources: [
      { name: 'India Meteorological Department (IMD Bhopal Centre)', url: 'https://mausam.imd.gov.in', date: '28 Oct 2026', verified: true },
      { name: 'MP State Disaster & Weather Monitoring Centre', url: 'https://mp.gov.in', date: '28 Oct 2026', verified: true }
    ],
    isTrending: true,
    isTimelyNews: true,
    sourceAttributionType: 'verified_news',
    businessProfileId: 'bp_media'
  },
  {
    id: 'idea_orchha_01',
    title: '5 Big Reasons Why Orchha Tourism is Booming',
    titleHi: 'MP के पर्यटन स्थलों पर एक खास वीडियो',
    industry: 'Hospitality',
    category: 'यात्रा',
    format: 'Medium (30-60s)',
    duration: 'Reels 90 सेकंड',
    relevance: 'High',
    relevanceLabel: 'उच्च',
    viewCount: '856K views',
    targetAudience: 'Travel Enthusiasts, History Buffs & Weekend Explorers',
    engagementPotential: 'Trending',
    usageCount: '856 उपयोग',
    tags: ['#Tourism', '#MPTourism', '#TravelGuide', '#Heritage'],
    imageUrl: '/assets/aistudio/Master_Admin_UI___________18_-_Support_Tickets_Management_bea7e05e.png',
    summary: 'Showcases Orchha\'s historical palaces, Raja Ram Temple reverence, Betwa river rafting, heritage homestays, and UNESCO tentative heritage status.',
    summaryHi: 'ओरछा के भव्य महल, रामराजा मंदिर की अनूठी परंपरा, बेतवा नदी में रिवर राफ्टिंग, हेरिटेज स्टे और ऐतिहासिक धरोहर के 5 प्रमुख कारण।',
    keyPoints: [
      'Raja Ram Temple is the only location in the world where Lord Ram receives an official state guard of honor.',
      'Betwa river features picturesque stone cenotaphs (chhatris) and thrilling soft-water rafting.',
      'Jahangir Mahal blends Mughal and Rajput palace architecture seamlessly.'
    ],
    keyPointsHi: [
      'रामराजा मंदिर दुनिया का एकमात्र ऐसा स्थान है जहाँ भगवान राम को सशस्त्र पुलिस द्वारा गार्ड ऑफ ऑनर दिया जाता है।',
      'बेतवा नदी के किनारे ऐतिहासिक छतरियां और रिवर राफ्टिंग का अद्भुत संगम देखने को मिलता है।',
      'जहांगीर महल और चतुर्भुज मंदिर राजपूत व मुग़ल वास्तुकला की बेमिसाल मिसाल हैं।'
    ],
    outline: [
      'Hook (0-5s): Did you know about the only town in India where Lord Ram is worshipped as a living king?',
      'Core Points (5-40s): 1. Raja Ram Temple guard of honor. 2. Jahangir Mahal architectural marvel. 3. Betwa rafting & cenotaphs.',
      'Call to Action (40-60s): Plan your next weekend getaway to Orchha! Save this video and share with your travel buddies.'
    ],
    outlineHi: [
      'हुक (0-5 सेकंड): क्या आप भारत के एकमात्र ऐसे शहर के बारे में जानते हैं जहां भगवान राम को राजा के रूप में गार्ड ऑफ ऑनर दिया जाता है?',
      'मुख्य बात (5-45 सेकंड): ओरछा पर्यटन तेजी से बढ़ रहा है—1. रामराजा सरकार का अनोखा दरबार, 2. जहांगीर महल व चतुर्भुज मंदिर, 3. बेतवा नदी की सुंदर छतरियां और रिवर राफ्टिंग।',
      'निष्कर्ष और CTA (45-60 सेकंड): अगर आप इतिहास और प्राकृतिक सुंदरता के शौकीन हैं तो ओरछा जरूर आएं। वीडियो सेव करें और दोस्तों से शेयर करें!'
    ],
    sources: [
      { name: 'Madhya Pradesh Tourism Board', url: 'https://mptourism.com', date: 'Oct 2026', verified: true },
      { name: 'Archaeological Survey of India (ASI)', url: 'https://asi.nic.in', date: 'Aug 2026', verified: true }
    ],
    isTrending: true,
    sourceAttributionType: 'public_research',
    businessProfileId: 'bp_food'
  },
  {
    id: 'idea_immunity_trending_01',
    title: 'Simple Home Remedies to Boost Immunity Fast',
    titleHi: 'इम्युनिटी बढ़ाने के 5 आसान उपाय',
    industry: 'Healthcare & Wellness',
    category: 'स्वास्थ्य',
    format: 'Short (15-30s)',
    duration: 'Shorts 45 सेकंड',
    relevance: 'High',
    relevanceLabel: 'उच्च',
    viewCount: '2.4K उपयोग',
    targetAudience: 'Families, Senior Citizens, Working Professionals',
    engagementPotential: 'Viral',
    usageCount: '2.4K उपयोग',
    tags: ['#Health', '#Immunity', '#Ayurveda', '#Wellness'],
    imageUrl: '/assets/aistudio/Master_Admin_UI___________16_-_Feedback_Management_65370e7a.png',
    summary: '3 natural Indian kitchen essentials to boost your daily immune response: Amla, Tulsi-Ginger Kadha, and turmeric with black pepper.',
    summaryHi: 'रसोई में मौजूद आंवला, तुलसी-अदरक का काढ़ा और हल्दी-काली मिर्च के नियमित सेवन से मजबूत इम्यूनिटी पाने के 5 आसान उपाय।',
    keyPoints: [
      'Raw Amla provides 20x more Vitamin C than oranges and elevates white blood cell activity.',
      'Piperine in black pepper increases curcumin absorption from turmeric by up to 2000%.',
      'Steaming with Ajwain or Tulsi clears respiratory pathways within minutes.'
    ],
    keyPointsHi: [
      'कच्चा आंवला संतरे से 20 गुना ज्यादा विटामिन सी देता है जो संक्रमण से लड़ने में मदद करता है।',
      'हल्दी के साथ एक चुटकी काली मिर्च मिलाने से करक्यूमिन का अवशोषण 2000% तक बढ़ जाता है।',
      'तुलसी और अदरक का ताजा काढ़ा मौसमी फ्लू और गले की खराश से तुरंत राहत देता है।'
    ],
    outline: [
      'Hook (0-5s): Tired of catching a cold every season? Fix your immunity with 3 natural kitchen ingredients!',
      'Core Points (5-20s): 1. Fresh Amla juice on empty stomach. 2. Curcumin-rich Haldi Doodh with black pepper. 3. 20 mins morning sunlight.',
      'Call to Action (20-30s): Which one do you practice daily? Tell us in the comments and follow for daily health tips!'
    ],
    outlineHi: [
      'हुक (0-5 सेकंड): मौसम बदलते ही क्या आप भी बार-बार बीमार पड़ जाते हैं? अपनी इम्यूनिटी को प्राकृतिक रूप से मजबूत बनाएं!',
      'मुख्य बात (5-25 सेकंड): 1. सुबह खाली पेट आंवला रस। 2. रात में हल्दी और चुटकी भर काली मिर्च वाला गुनगुना दूध। 3. 20 मिनट सुबह की ताजी धूप।',
      'निष्कर्ष और CTA (25-30 सेकंड): इन आसान घरेलू उपायों को अपनाएं और स्वस्थ रहें। अपनी राय कमेंट में बताएं और वीडियो शेयर करें!'
    ],
    sources: [
      { name: 'Ministry of Ayush Guidelines', url: 'https://ayush.gov.in', date: 'Oct 2026', verified: true },
      { name: 'ICMR Nutrition Advisory', url: 'https://icmr.gov.in', date: 'Sep 2026', verified: true }
    ],
    isTrending: true,
    sourceAttributionType: 'public_research',
    businessProfileId: 'bp_health'
  },
  {
    id: 'idea_local_news_01',
    title: 'How to Make Local News Content Go Viral?',
    titleHi: 'लोकल न्यूज़ को वायरल कैसे बनाएं?',
    industry: 'News & Media',
    category: 'करेंट ट्रेंड्स',
    format: 'Short (15-30s)',
    duration: 'Video 2 मिनट',
    targetAudience: 'Local Journalists, Digital Creators, Community Reporters',
    engagementPotential: 'Viral',
    usageCount: '932 उपयोग',
    isIndustryRecommendation: true,
    tags: ['#LocalNews', '#Journalism', '#CivicIssues', '#CommunityNews'],
    imageUrl: '/assets/aistudio/Master_Admin_UI___________1_-_Notifications___Alerts_Management_e6446e8c.png',
    summary: 'Mastering hyper-local storytelling: strong civic hook in first 3 seconds, local landmark b-roll, and community call to action.',
    summaryHi: 'स्थानीय मुद्दों को डिजिटल ऑडियंस तक पहुंचाने के नियम: पहले 3 सेकंड में स्थानीय सवाल, लोकेशन फुटेज और नागरिक राय।',
    keyPoints: [
      'Show the physical civic issue (pothole, water leak, hospital queue) within the first 2 seconds.',
      'Always quote local residents and tag responsible administrative authorities.',
      'Maintain balanced, non-sensational factual reporting to build long-term local trust.'
    ],
    keyPointsHi: [
      'पहले 2 सेकंड में समस्या का सीधा वीडियो दिखाएं ताकि स्थानीय लोग तुरंत पहचान सकें।',
      'क्षेत्रीय लोगों की बात शामिल करें और संबंधित प्रशासनिक अधिकारियों को टैग करें।',
      'सनसनीखेज दावों के बजाय तथ्यात्मक रिपोर्टिंग करें ताकि दर्शकों का स्थायी भरोसा बने।'
    ],
    outline: [
      'Hook (0-5s): Local news does not have to be boring! Here is how creators are hitting 100k views on city issues.',
      'Core Points (5-20s): 1. Focus on common problems (traffic, roads, water). 2. Tag local authorities. 3. Ask audience for their city experiences.',
      'Call to Action (20-30s): What local issue needs attention in your city? Tell us in the comments below!'
    ],
    outlineHi: [
      'हुक (0-5 सेकंड): आपके शहर की लोकल खबर भी लाखों लोगों तक पहुंच सकती है अगर आप ये 3 तकनीक अपनाएं!',
      'मुख्य बात (5-25 सेकंड): 1. पहले 3 सेकंड में मुख्य समस्या सीधे दिखाएं। 2. स्थानीय लोगों की राय और सबूत शामिल करें। 3. स्पष्ट और निष्पक्ष भाषा रखें।',
      'निष्कर्ष और CTA (25-30 सेकंड): आपके क्षेत्र में कौन सी समस्या सबसे बड़ी है? कमेंट में बताएं और चैनल को फॉलो करें!'
    ],
    sources: [
      { name: 'Digital Media Trends Report 2026', date: 'Oct 2026', verified: true }
    ],
    businessProfileId: 'bp_media'
  },
  {
    id: 'idea_growth_01',
    title: '10 Proven Tactics to Grow Your Social Media Following',
    titleHi: 'सोशल मीडिया पर ग्रोथ के 10 तरीके',
    industry: 'News & Media',
    category: 'डिजिटल मीडिया',
    format: 'Medium (30-60s)',
    duration: 'Reels 60 सेकंड',
    targetAudience: 'Creators, Small Brands, Freelancers',
    engagementPotential: 'Viral',
    usageCount: '1.8K उपयोग',
    isIndustryRecommendation: true,
    tags: ['#SocialMediaGrowth', '#AudienceBuilding', '#CreatorEconomy'],
    imageUrl: '/assets/aistudio/Scripter_App_Tools_Showcase_819e4ce4.png',
    summary: 'A fast breakdown of algorithm-friendly habits: daily consistency, retention-focused hooks, community reply loops, and repurposing across platforms.',
    summaryHi: 'इंस्टाग्राम और यूट्यूब पर ऑर्गेनिक ग्रोथ के 10 नियम: डेली रील्स, 3-सेकंड हुक, तेज एडिटिंग और दर्शकों के सवालों पर वीडियो बनाना।',
    keyPoints: [
      'Batching content creation on weekends prevents mid-week creator burnout.',
      'Optimizing video caption keywords improves search discovery across Instagram and YouTube.',
      'Replying to comments in the first 60 minutes signals high engagement to the algorithm.'
    ],
    keyPointsHi: [
      'वीकेंड पर एक साथ 4-5 वीडियो का ड्राफ्ट तैयार करने से निरंतरता बनी रहती है।',
      'कैप्शन में प्रासंगिक कीवर्ड्स शामिल करने से सर्च रिजल्ट्स में वीडियो ऊपर आता है।',
      'पहले 1 घंटे में कमेंट्स का जवाब देने से एंगेजमेंट तेजी से बढ़ता है।'
    ],
    outline: [
      'Hook (0-5s): 95% of accounts stay under 1,000 followers because they make this one mistake.',
      'Core Points (5-45s): 1. Retention-first hooks. 2. Clear visual cues. 3. Post at consistent creator hours. 4. Reply to every first-hour comment.',
      'Call to Action (45-60s): Save this checklist for your next month plan. Follow Scripter for daily creator guides!'
    ],
    outlineHi: [
      'हुक (0-5 सेकंड): 90% नए क्रिएटर्स 1000 फॉलोअर्स पर अटक जाते हैं क्योंकि वो यह एक गलती करते हैं!',
      'मुख्य बात (5-45 सेकंड): 1. पहले 3 सेकंड में विजुअल हुक दें। 2. हर हफ्ते कम से कम 5 रील्स कंसिस्टेंटली पोस्ट करें। 3. कमेंट्स में बातचीत बढ़ाएं।',
      'निष्कर्ष और CTA (45-60 सेकंड): इस गाइड को अभी सेव कर लें और उन दोस्तों को भेजें जो सोशल मीडिया पर बढ़ना चाहते हैं!'
    ],
    sources: [
      { name: 'Social Media Algorithm Study 2026', date: 'Sep 2026', verified: true }
    ],
    businessProfileId: 'bp_media'
  },
  {
    id: 'idea_interview_01',
    title: 'How to Prepare for Media & Job Interviews with Confidence',
    titleHi: 'इंटरव्यू की तैयारी कैसे करें?',
    industry: 'Education & Training',
    category: 'मीडिया ट्रेनिंग',
    format: 'Short (15-30s)',
    duration: 'Video 3 मिनट',
    targetAudience: 'Job Seekers, Students, Aspiring Broadcasters',
    engagementPotential: 'High',
    usageCount: '764 उपयोग',
    isIndustryRecommendation: true,
    tags: ['#InterviewPrep', '#CareerTips', '#CommunicationSkills'],
    imageUrl: '/assets/aistudio/Master_Admin_UI___________2_User_Management_23b83c9a.png',
    summary: 'STAR technique explained simply: Situation, Task, Action, Result. Plus body language and teleprompter practice tips.',
    summaryHi: 'किसी भी इंटरव्यू या ऑन-कैमरा बाइट में आत्मविश्वास से बोलने के 3 नियम: स्पष्ट आवाज, STAR फॉर्मूला और चेहरे पर मुस्कान।',
    keyPoints: [
      'STAR Framework (Situation, Task, Action, Result) ensures concise, high-impact storytelling.',
      'Practicing delivery with a teleprompter trains steady eye-level pacing and eliminates filler words.',
      'Pausing for 2 seconds before answering demonstrates composure and clarity.'
    ],
    keyPointsHi: [
      'STAR फॉर्मूला (स्थिति, काम, आपका कदम, परिणाम) लंबी बात को सटीक और असरदार बनाता है।',
      'टेलीप्रॉम्प्टर के साथ बोलने का अभ्यास करने से नर्वसनेस दूर होती है और आंखों का संपर्क बना रहता है।',
      'सवाल सुनने के बाद 2 सेकंड सोचकर बोलना आत्मविश्वास का प्रतीक होता है।'
    ],
    outline: [
      'Hook (0-5s): Nervous before big interviews? Here is the STAR framework used by top leaders.',
      'Core Points (5-20s): 1. Explain the Situation clearly. 2. Define your specific Task. 3. Detail your Action. 4. Highlight the measurable Result.',
      'Call to Action (20-30s): Practice your answers using Scripter\'s teleprompter today. Best of luck!'
    ],
    outlineHi: [
      'हुक (0-5 सेकंड): इंटरव्यू में अक्सर जवाब भूल जाते हैं? यह STAR तकनीक आपको कभी अटकने नहीं देगी!',
      'मुख्य बात (5-20 सेकंड): 1. स्थिति (Situation) स्पष्ट बताएं। 2. अपना काम (Task) समझाएं। 3. आपने क्या किया (Action) और 4. क्या परिणाम (Result) मिला।',
      'निष्कर्ष और CTA (20-30 सेकंड): वीडियो को सेव करें और इंटरव्यू से पहले दोहराएं। शुभकामनाएं!'
    ],
    sources: [
      { name: 'National Career Service Advisory', url: 'https://ncs.gov.in', date: '2026', verified: true }
    ],
    businessProfileId: 'bp_education'
  },
  {
    id: 'idea_01',
    title: 'How to Boost Immunity Naturally in Winter (30s Reel)',
    titleHi: 'सर्दियों में इम्यूनिटी कैसे बढ़ाएं (30 सेकंड रील)',
    industry: 'Healthcare & Wellness',
    category: 'Preventive Health',
    format: 'Short (15-30s)',
    targetAudience: 'Families, Office Workers & Senior Citizens',
    engagementPotential: 'Viral',
    summary: 'Focuses on 3 clinically backed winter superfoods and habits: warm water with amla/lemon, turmeric golden milk before bed, and 20 mins sunlight exposure.',
    summaryHi: 'सर्दियों में बार-बार सर्दी-जुकाम से बचने के लिए 3 घरेलू और वैज्ञानिक उपाय: आंवला-नींबू पानी, हल्दी वाला दूध, और 20 मिनट धूप।',
    outline: [
      'Hook (0-5s): Is seasonal cough and flu ruining your winter? Stop taking antibiotics randomly!',
      'Core Tips (5-20s): 1. Fresh Amla juice on empty stomach. 2. Curcumin-rich Haldi Doodh with black pepper. 3. 20 mins morning Vitamin D.',
      'Call to Action (20-30s): Which of these 3 do you already do? Comment below and share with loved ones!'
    ],
    outlineHi: [
      'हुक (0-5s): ठंड बढ़ते ही बार-बार सर्दी-जुकाम हो रहा है? अपनी इम्यूनिटी को मजबूत बनाना अब बहुत जरूरी है!',
      'मुख्य सामग्री (5-25s): 1. सुबह गुनगुने पानी में नींबू और शहद। 2. मौसमी फल और हरी सब्जियां। 3. रात में हल्दी वाला दूध। 4. 7 घंटे की पर्याप्त नींद।',
      'समापन (25-30s): इन आसान उपायों को अपनाइए और इस सर्दी खुद को स्वस्थ रखिए। वीडियो को सेव करें!'
    ],
    sources: [
      { name: 'Ministry of Ayush Winter Guidelines', url: 'https://ayush.gov.in', date: 'Oct 2026', verified: true },
      { name: 'Indian Council of Medical Research (ICMR) Dietary Advisory', url: 'https://icmr.gov.in', date: 'Sep 2026', verified: true },
      { name: 'PubMed: Curcumin Absorption with Piperine', url: 'https://ncbi.nlm.nih.gov', date: '2025', verified: true }
    ],
    isTrending: true,
    businessProfileId: 'bp_health'
  },
  {
    id: 'idea_02',
    title: '5 Warning Signs Your Body Needs a Digital Detox',
    titleHi: 'मानसिक शांति और स्क्रीन डिटॉक्स के 5 संकेत',
    industry: 'Healthcare & Wellness',
    category: 'Mental Wellness',
    format: 'Medium (30-60s)',
    targetAudience: 'Youth, Remote Workers, Gamers',
    engagementPotential: 'High',
    summary: 'Identifies eye fatigue, phantom notification syndrome, delayed sleep onset, and mood swings caused by continuous blue-light exposure.',
    summaryHi: 'लगातार मोबाइल स्क्रीन देखने से होने वाली आंखों की थकान, सिरदर्द और नींद की कमी से बचने के व्यावहारिक उपाय।',
    outline: [
      'Hook (0-5s): Do you check your phone within 60 seconds of waking up? Here is what it does to your dopamine.',
      'Warning Signs (5-35s): 1. Phantom vibration feeling. 2. Inability to sleep without doom-scrolling. 3. Brain fog during conversations.',
      'Actionable Fix (35-50s): Try the 20-20-20 rule and no screens 45 minutes before sleep.',
      'Call to Action (50-60s): Tag a friend whose screen time is over 6 hours!'
    ],
    outlineHi: [
      'हुक: सुबह आंख खुलते ही क्या पहला काम फोन देखना होता है?',
      'लक्षण: आंखों में भारीपन, नींद में खलल और बिना वजह चिड़चिड़ापन।',
      'समाधान: 20-20-20 नियम अपनाएं और सोने से 45 मिनट पहले फोन दूर रखें।',
      'समापन: अपने स्क्रीन-लवर दोस्त को यह रील जरूर शेयर करें!'
    ],
    sources: [
      { name: 'American Psychological Association Tech Stress Study', date: 'Aug 2026', verified: true },
      { name: 'National Sleep Foundation Guidelines', date: 'Jul 2026', verified: true }
    ],
    isTrending: false,
    businessProfileId: 'bp_health'
  },
  {
    id: 'idea_03',
    title: 'Top 3 AI Tools That Will Save Creators 10 Hours a Week',
    titleHi: 'कंटेंट क्रिएटर्स के लिए 3 जादुई AI टूल्स',
    industry: 'Tech & Software',
    category: 'AI & Productivity',
    format: 'Short (15-30s)',
    targetAudience: 'Content Creators, Marketers, Freelancers',
    engagementPotential: 'Viral',
    summary: 'A fast-paced review of automated scriptwriting with Scripter, background noise removal, and automated B-roll matching.',
    summaryHi: 'क्रिएटर्स के 10 घंटे बचाने वाले AI टूल्स: ऑटोमेटेड स्क्रिप्टिंग, B-roll जनरेटर और ऑडियो क्लीनअप।',
    outline: [
      'Hook (0-5s): Still spending 4 hours writing one YouTube script? 90% of top creators stopped doing that!',
      'The 3 Tools (5-20s): 1. Scripter for instant hook and outline generation. 2. AI Audio enhancement. 3. One-click teleprompter sync.',
      'Closing (20-30s): Try Scripter today—link in bio. Follow for daily creator hacks!'
    ],
    outlineHi: [
      'हुक: अगर आप अभी भी स्क्रिप्ट लिखने में घंटों लगा रहे हैं, तो ये 3 टूल्स आपके लिए हैं!',
      'टूल्स: 1. स्क्रिप्टर AI स्क्रिप्टिंग इंजन। 2. बैकग्राउंड नॉइज़ रिमूवर। 3. स्मार्ट टेलीप्रॉम्प्टर।',
      'समापन: लिंक बायो में है, अभी ट्राइ करें और पेज फॉलो करें!'
    ],
    sources: [
      { name: 'Creator Economy Benchmark Report', date: 'Oct 2026', verified: true }
    ],
    isTrending: true,
    businessProfileId: 'bp_tech'
  },
  {
    id: 'idea_04',
    title: 'Why Bundelkhand Cuisine is the Hidden Gem of Central India',
    titleHi: 'बुंदेलखंडी खान-पान का असली स्वाद और सेहत का राज',
    industry: 'Hospitality',
    category: 'Local Food & Heritage',
    format: 'Medium (30-60s)',
    targetAudience: 'Food Lovers, Travellers, Families',
    engagementPotential: 'High',
    summary: 'Explores nutritious traditional Bundelkhandi delicacies like Tharra, Baphaule, and Mahua preparations celebrated for rustic nutrition.',
    summaryHi: 'बुंदेलखंड के पारंपरिक व्यंजन—बाफौले, महुआ के पकवान और देशी घी का असली स्वाद जो सेहत के लिए भी वरदान हैं।',
    outline: [
      'Hook (0-8s): Have you ever tasted food steam-cooked inside leaves with zero refined oil?',
      'Delicacies (8-40s): Showcasing Baphaule (lentil dumplings) and seasonal grain rotis with freshly churned ghee.',
      'Closing (40-60s): Which traditional food from your hometown is your favorite? Tell us in the comments!'
    ],
    outlineHi: [
      'हुक: क्या आपने कभी बिना तेल के भाप में पके हुए पारंपरिक बाफौले खाए हैं?',
      'विवरण: दाल और मसालों से बने स्वादिष्ट व्यंजन जो स्वाद में लाजवाब और सुपाच्य हैं।',
      'समापन: अपने शहर की सबसे पसंदीदा पारंपरिक डिश का नाम कमेंट में लिखें!'
    ],
    sources: [
      { name: 'Culinary Heritage of MP Tourism Documentation', date: 'Jun 2026', verified: true }
    ],
    isTrending: true,
    businessProfileId: 'bp_food'
  },
  {
    id: 'idea_05',
    title: 'How to Study for 6 Hours Without Getting Distracted',
    titleHi: 'बिना भटके 6 घंटे पढ़ाई करने की 3 वैज्ञानिक तकनीक',
    industry: 'Education & Training',
    category: 'Study Skills & Exams',
    format: 'Short (15-30s)',
    targetAudience: 'Students preparing for Competitive Exams & Board Exams',
    engagementPotential: 'Trending',
    summary: 'Introduces the Modified Pomodoro Technique (50m study / 10m walk), phone in another room protocol, and active recall questioning.',
    summaryHi: 'एग्जाम की तैयारी में ध्यान केंद्रित रखने के 3 आसान फॉर्मूले: 50-10 पोमोडोरो, फोन आउट ऑफ रूम और एक्टिव रिकॉल।',
    outline: [
      'Hook (0-5s): Studying for 8 hours but retaining only 20%? You are studying the wrong way!',
      '3 Methods (5-22s): 1. Active recall instead of passive reading. 2. 50 mins focus block + 10 mins water break. 3. Zero screens in break.',
      'Closing (22-30s): Save this reel before your next study session and share with your study group!'
    ],
    outlineHi: [
      'हुक: क्या आप 1 घंटे पढ़ते ही बोर हो जाते हैं? जानिए 6 घंटे फोकस का सीक्रेट!',
      'तकनीक: 1. 50 मिनट पढ़ाई + 10 मिनट वॉक। 2. एक्टिव रिकॉल से रिवीजन। 3. स्टडी टेबल से फोन दूर।',
      'समापन: अगली पढ़ाई से पहले यह वीडियो सेव कर लें और दोस्तों से शेयर करें!'
    ],
    sources: [
      { name: 'Cognitive Science Journal: Spaced Repetition & Focus Blocks', date: '2025', verified: true }
    ],
    isTrending: true,
    businessProfileId: 'bp_education'
  },
  {
    id: 'idea_06',
    title: 'First-Time Home Buyer Mistakes to Avoid in 2026',
    titleHi: 'पहला घर खरीदते समय 3 बड़ी गलतियों से बचें',
    industry: 'Real Estate',
    category: 'Property Investment',
    format: 'Medium (30-60s)',
    targetAudience: 'Young Professionals & First-time Investors',
    engagementPotential: 'High',
    summary: 'Addresses hidden maintenance charges, checking RERA registration number before token money, and keeping EMI under 35% of net income.',
    summaryHi: 'घर खरीदते समय RERA नंबर जांचना, छिपे हुए मेंटेनेंस चार्ज और 35% आय नियम का ध्यान रखना क्यों जरूरी है।',
    outline: [
      'Hook (0-7s): Buying your dream home? Do not pay a single rupee until you verify these 3 things!',
      'Checklist (7-45s): 1. Check verified RERA registration on state portal. 2. Calculate carpet area vs super built-up. 3. Total EMI cap at 35%.',
      'Closing (45-60s): Which city are you looking to buy a property in? Comment below for our free buyer guide!'
    ],
    outlineHi: [
      'हुक: अपना सपनों का घर खरीदने से पहले ये 3 बातें नहीं जानीं तो लाखों का नुकसान हो सकता है!',
      'चेकलिस्ट: 1. रेरा (RERA) रजिस्ट्रेशन चेक करें। 2. कारपेट एरिया समझें। 3. ईएमआई 35% से ज्यादा न हो।',
      'समापन: आप किस शहर में घर देख रहे हैं? कमेंट करें!'
    ],
    sources: [
      { name: 'RERA Consumer Protection Guidelines', date: 'May 2026', verified: true }
    ],
    isTrending: false,
    businessProfileId: 'bp_realestate'
  }
];

export const DEMO_BRAND_KITS: BrandKit[] = [
  {
    id: 'bk_health',
    businessProfileId: 'bp_health',
    brandName: 'AyurVeda Clinic & Wellness',
    logoUrl: '/assets/aistudio/Square_Scripter_Logo_d7bb9aeb.png',
    primaryColor: '#059669', // Emerald
    secondaryColor: '#0284C7', // Sky
    accentColor: '#F59E0B', // Amber
    backgroundColor: '#F8FAFC',
    textColor: '#0F172A',
    fontFamily: 'Plus Jakarta Sans',
    watermarkEnabled: true,
    watermarkPosition: 'top-right',
    tagline: 'Natural Healing & Daily Preventive Care',
    updatedAt: '2026-10-27T10:00:00'
  },
  {
    id: 'bk_media',
    businessProfileId: 'bp_media',
    brandName: 'Orchha Today News',
    logoUrl: '/assets/aistudio/Square_Scripter_Logo_d7bb9aeb.png',
    primaryColor: '#DC2626', // Red
    secondaryColor: '#1E293B', // Slate
    accentColor: '#FBBF24', // Amber
    backgroundColor: '#0B132B',
    textColor: '#FFFFFF',
    fontFamily: 'Poppins',
    watermarkEnabled: true,
    watermarkPosition: 'top-right',
    tagline: 'Fast, Authentic & Verified Digital Journalism',
    updatedAt: '2026-10-27T11:00:00'
  },
  {
    id: 'bk_education',
    businessProfileId: 'bp_education',
    brandName: 'Apex Study Academy',
    logoUrl: '/assets/aistudio/Square_Scripter_Logo_d7bb9aeb.png',
    primaryColor: '#2563EB', // Blue
    secondaryColor: '#4F46E5', // Indigo
    accentColor: '#10B981', // Emerald
    backgroundColor: '#F8FAFC',
    textColor: '#1E293B',
    fontFamily: 'Inter',
    watermarkEnabled: true,
    watermarkPosition: 'bottom-right',
    tagline: 'Concept Clarity & Exam Excellence',
    updatedAt: '2026-10-27T11:30:00'
  },
  {
    id: 'bk_tech',
    businessProfileId: 'bp_tech',
    brandName: 'FutureStack Labs',
    logoUrl: '/assets/aistudio/Square_Scripter_Logo_d7bb9aeb.png',
    primaryColor: '#7C3AED', // Purple
    secondaryColor: '#2563EB', // Blue
    accentColor: '#06B6D4', // Cyan
    backgroundColor: '#0F172A',
    textColor: '#F8FAFC',
    fontFamily: 'Plus Jakarta Sans',
    watermarkEnabled: true,
    watermarkPosition: 'top-right',
    tagline: 'Modern Web, AI Architecture & Dev Tools',
    updatedAt: '2026-10-27T12:00:00'
  },
  {
    id: 'bk_food',
    businessProfileId: 'bp_food',
    brandName: 'Zaika Desi Kitchen',
    logoUrl: '/assets/aistudio/Square_Scripter_Logo_d7bb9aeb.png',
    primaryColor: '#EA580C', // Orange
    secondaryColor: '#D97706', // Amber
    accentColor: '#16A34A', // Green
    backgroundColor: '#FFFBEB',
    textColor: '#451A03',
    fontFamily: 'Plus Jakarta Sans',
    watermarkEnabled: true,
    watermarkPosition: 'top-left',
    tagline: 'Ghar Ka Swaad, 30 Second Recipes',
    updatedAt: '2026-10-27T12:30:00'
  },
  {
    id: 'bk_realestate',
    businessProfileId: 'bp_realestate',
    brandName: 'Imperial Real Estate & Homes',
    logoUrl: '/assets/aistudio/Square_Scripter_Logo_d7bb9aeb.png',
    primaryColor: '#1E3A8A', // Deep Navy
    secondaryColor: '#B45309', // Warm Bronze
    accentColor: '#059669', // Emerald
    backgroundColor: '#F8FAFC',
    textColor: '#0F172A',
    fontFamily: 'Plus Jakarta Sans',
    watermarkEnabled: true,
    watermarkPosition: 'top-right',
    tagline: 'Premium Living Spaces & RERA Verified Investments',
    updatedAt: '2026-10-27T13:00:00'
  }
];

export const DEMO_TEMPLATES: ContentTemplate[] = [
  {
    id: 'tpl_health_01',
    title: 'Daily Preventive Health Checklist Reel',
    titleHi: 'दैनिक स्वास्थ्य सुरक्षा चेकलिस्ट रील',
    category: 'Preventive Health',
    industry: 'Healthcare & Wellness',
    format: 'reel',
    aspectRatio: '9:16',
    duration: '30-45s',
    thumbnailUrl: '/assets/aistudio/Master_Admin_UI___________6_Visual_Assets_Management_bfd1be4e.png',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    isPremium: false,
    targetAudience: 'Health Seekers, Working Professionals & Families',
    description: 'Fast-paced, high-retention reel template tailored for doctors and wellness creators to deliver 3 actionable health tips.',
    descriptionHi: 'डॉक्टरों और स्वास्थ्य विशेषज्ञों के लिए 3 सरल और असरदार घरेलू नुस्खे बताने वाला सिद्ध रील टेम्पलेट।',
    scriptOutline: [
      'Hook (0-5s): Stop scrolling if you wake up feeling tired every morning!',
      '3 Points (5-30s): Morning warm water, 20m outdoor sunlight walk, nutrient-rich breakfast.',
      'Closing (30-45s): Follow for daily medical-approved lifestyle tips.'
    ],
    visualAssetsCount: 4,
    visualScenes: [
      {
        sceneNumber: 1,
        timeRange: '0-5s',
        description: 'Tired person waking up in morning light',
        descriptionHi: 'सुबह थकान महसूस करता हुआ व्यक्ति',
        imageUrl: '/assets/aistudio/Master_Admin_UI___________1_Dashboard_65597d51.png',
        selected: true
      },
      {
        sceneNumber: 2,
        timeRange: '5-20s',
        description: 'Fresh warm water with lemon and seeds',
        descriptionHi: 'गुनगुना पानी और प्राकृतिक सामग्री',
        imageUrl: '/assets/aistudio/Master_Admin_UI___________6_Visual_Assets_Management_bfd1be4e.png',
        selected: true
      },
      {
        sceneNumber: 3,
        timeRange: '20-35s',
        description: 'Outdoor walking in park with sunrise',
        descriptionHi: 'पार्क में सुबह की धूप में टहलना',
        imageUrl: '/assets/aistudio/Master_Admin_UI___________5_Template_Library_Management_086512f2.png',
        selected: true
      },
      {
        sceneNumber: 4,
        timeRange: '35-45s',
        description: 'Doctor smiling with follow button badge',
        descriptionHi: 'डॉक्टर का सकारात्मक संदेश व फॉलो बैज',
        imageUrl: '/assets/aistudio/Square_Scripter_Logo_d7bb9aeb.png',
        selected: true
      }
    ],
    recommendedTitleStyle: 'Viral Yellow on Dark Backdrop',
    tags: ['Health', 'Preventive Care', 'Wellness', 'Shorts', 'Reels']
  },
  {
    id: 'tpl_health_02',
    title: 'Clinical Case Explainer & Disease Prevention',
    titleHi: 'रोग निवारण एवं चिकित्सीय परामर्श गाइड',
    category: 'Clinical Advice',
    industry: 'Healthcare & Wellness',
    format: 'long',
    aspectRatio: '16:9',
    duration: '3-5 min',
    thumbnailUrl: '/assets/aistudio/Master_Admin_UI___________5_Template_Library_Management_086512f2.png',
    isPremium: true,
    targetAudience: 'Patients looking for in-depth medical explanations',
    description: 'Structured landscape video template featuring multi-section breakdown, symptom chart overlays, and medical disclaimer.',
    descriptionHi: 'यूट्यूब एवं व्याख्यात्मक वीडियो के लिए विस्तृत मेडिकल गाइड टेम्पलेट।',
    scriptOutline: [
      'Intro & Statistics: Why 1 in 4 adults ignores early symptoms.',
      'Section 1: The physiological mechanism explained simply.',
      'Section 2: Diet, medications, and common mistakes.',
      'Summary & Disclaimer: When to consult your primary physician.'
    ],
    visualAssetsCount: 6,
    visualScenes: [],
    recommendedTitleStyle: 'Clean White with Blue Accent Badge',
    tags: ['Medicine', 'YouTube', 'Healthcare', 'Explainer']
  },
  {
    id: 'tpl_edu_01',
    title: 'Exam Study Hacks & High-Focus Pomodoro',
    titleHi: 'एग्जाम टॉपर्स की 3 गुप्त अध्ययन तकनीक',
    category: 'Study Skills & Exams',
    industry: 'Education & Training',
    format: 'reel',
    aspectRatio: '9:16',
    duration: '30-45s',
    thumbnailUrl: '/assets/aistudio/Master_Admin_UI___________6_Visual_Assets_Management_bfd1be4e.png',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    isPremium: false,
    targetAudience: 'Students preparing for competitive examinations',
    description: 'High-energy educational reel template with bold text callouts and timer countdowns for maximum student retention.',
    descriptionHi: 'छात्रों के लिए आकर्षक और प्रेरणादायक अध्ययन टिप्स रील टेम्पलेट।',
    scriptOutline: [
      'Hook (0-5s): Do not study for 8 hours without knowing this 1 rule!',
      'Points (5-30s): 50-10 Pomodoro, active recall questions, no screen in breaks.',
      'Closing (30-45s): Save this before your next revision session!'
    ],
    visualAssetsCount: 4,
    visualScenes: [],
    recommendedTitleStyle: 'Modern Electric Blue with Yellow Marker',
    tags: ['Education', 'Exams', 'Students', 'Pomodoro']
  },
  {
    id: 'tpl_media_01',
    title: 'Breaking News & Fact-Check Fast Digest',
    titleHi: 'तेज खबरें एवं फैक्ट-चेक बुलेटिन',
    category: 'Current Affairs, News, Reels',
    industry: 'News & Media',
    format: 'reel',
    aspectRatio: '9:16',
    duration: '30-60s',
    thumbnailUrl: '/assets/aistudio/Master_Admin_UI___________1_Dashboard_65597d51.png',
    isPremium: false,
    targetAudience: 'General digital audience seeking verified news fast',
    description: 'Dynamic newsroom template with ticker tape bottom bar, headline overlays, and rapid video transitions.',
    descriptionHi: 'डिजिटल न्यूज़ क्रिएटर्स के लिए तेज़ और प्रामाणिक न्यूज़ बुलेटिन टेम्पलेट।',
    scriptOutline: [
      'Breaking Alert (0-5s): 3 big updates you need to know today.',
      'Bullet Points (5-45s): Story 1 key fact, Story 2 government policy, Story 3 public reaction.',
      'Verification (45-60s): Follow our channel for real-time fact checks.'
    ],
    visualAssetsCount: 5,
    visualScenes: [],
    recommendedTitleStyle: 'Breaking Red Headline with Bold White Text',
    tags: ['News', 'Fact Check', 'Journalism', 'Current Affairs']
  },
  {
    id: 'tpl_tech_01',
    title: 'SaaS & AI Tool Spotlight in 45 Seconds',
    titleHi: 'नया AI टूल रिव्यू और प्रैक्टिकल उपयोग',
    category: 'Software, IT Services, Startups',
    industry: 'Tech & Software',
    format: 'reel',
    aspectRatio: '9:16',
    duration: '30-45s',
    thumbnailUrl: '/assets/aistudio/Master_Admin_UI___________5_Template_Library_Management_086512f2.png',
    isPremium: false,
    targetAudience: 'Developers, Tech Enthusiasts & Productivity Seekers',
    description: 'Sleek dark-mode template with screen recording frame mockup and feature bullet points.',
    descriptionHi: 'टेक रिव्यू एवं सॉफ्टवेयर फीचर्स दिखाने के लिए डार्क-थीम टेम्पलेट।',
    scriptOutline: [
      'Hook (0-5s): This free tool saved me 10 hours of work this week!',
      'Features (5-35s): Live demo of UI, key shortcut, and workflow speedup.',
      'Closing (35-45s): Link in bio to try it out for free.'
    ],
    visualAssetsCount: 4,
    visualScenes: [],
    recommendedTitleStyle: 'Cyber Purple & Neon Cyan Accents',
    tags: ['Tech', 'AI', 'Software', 'Productivity']
  },
  {
    id: 'tpl_realestate_01',
    title: 'Luxury Property Tour & Buyer Walkthrough',
    titleHi: 'प्रीमियम प्रॉपर्टी टूर एवं खरीद गाइड',
    category: 'Agents, Builders, Architecture',
    industry: 'Real Estate',
    format: 'reel',
    aspectRatio: '9:16',
    duration: '45-60s',
    thumbnailUrl: '/assets/aistudio/Master_Admin_UI___________6_Visual_Assets_Management_bfd1be4e.png',
    isPremium: true,
    targetAudience: 'Home Buyers, NRI Investors & Architecture Lovers',
    description: 'Sophisticated architectural showcase template with floorplan callouts, carpet area specs, and verified pricing.',
    descriptionHi: 'प्रॉपर्टी व रियल एस्टेट ब्रोकर्स के लिए लक्ज़री वॉकथ्रू टेम्पलेट।',
    scriptOutline: [
      'Hook (0-5s): Inside this 3BHK luxury apartment in city center!',
      'Tour (5-45s): Master bedroom view, designer Italian kitchen, clubhouse amenities.',
      'Pricing (45-60s): RERA certified. Book your private walkthrough today.'
    ],
    visualAssetsCount: 5,
    visualScenes: [],
    recommendedTitleStyle: 'Royal Gold & Deep Navy',
    tags: ['Real Estate', 'Luxury', 'Interior', 'Home Tour']
  },
  {
    id: 'tpl_food_01',
    title: 'Quick 30-Second Recipe Reel',
    titleHi: '30 सेकंड में आसान रेसिपी वीडियो',
    category: 'Restaurants, Cafes, Recipes',
    industry: 'Hospitality',
    format: 'reel',
    aspectRatio: '9:16',
    duration: '30s',
    thumbnailUrl: '/assets/aistudio/Master_Admin_UI___________6_Visual_Assets_Management_bfd1be4e.png',
    isPremium: false,
    targetAudience: 'Home Cooks, Foodies & College Students',
    description: 'Mouthwatering culinary template with top-down kitchen camera framing and ingredient timing badges.',
    descriptionHi: 'स्वादिष्ट और आसान कुकिंग वीडियो के लिए रेसिपी रील टेम्पलेट।',
    scriptOutline: [
      'Hook (0-4s): Craving a restaurant-style snack in 10 minutes?',
      'Steps (4-24s): Sautéing aromatics, secret spices, flame finish.',
      'CTA (24-30s): Save for tonight dinner and follow for more recipes!'
    ],
    visualAssetsCount: 4,
    visualScenes: [],
    recommendedTitleStyle: 'Warm Terracotta with Sunny Yellow',
    tags: ['Food', 'Recipe', 'Cooking', 'Kitchen']
  }
];

export const SOCIAL_EXPORT_PRESETS: SocialExportPreset[] = [
  {
    id: 'preset_ig_reel',
    name: 'Instagram Reel / Stories',
    platform: 'Instagram',
    type: 'reel',
    aspectRatio: '9:16',
    resolution: '1080x1920 (Full HD)',
    recommendedFps: 30,
    recommendedFormat: 'mp4',
    description: 'Optimized vertical framing for Instagram algorithm, high bitrate, and clear center-safe area for captions.',
    badge: 'Popular'
  },
  {
    id: 'preset_yt_shorts',
    name: 'YouTube Shorts',
    platform: 'YouTube',
    type: 'reel',
    aspectRatio: '9:16',
    resolution: '1080x1920 (Full HD)',
    recommendedFps: 60,
    recommendedFormat: 'mp4',
    description: 'Crisp 60fps vertical format with bottom UI clearance for channel subscribe badge and sound link.',
    badge: 'High Quality'
  },
  {
    id: 'preset_yt_video',
    name: 'YouTube Standard Video',
    platform: 'YouTube',
    type: 'video',
    aspectRatio: '16:9',
    resolution: '1920x1080 (1080p)',
    recommendedFps: 30,
    recommendedFormat: 'mp4',
    description: 'Standard cinematic widescreen layout suitable for tutorials, podcasts, and explainer content.',
    badge: 'Standard'
  },
  {
    id: 'preset_ig_square',
    name: 'Instagram Feed Square',
    platform: 'Instagram',
    type: 'post',
    aspectRatio: '1:1',
    resolution: '1080x1080',
    recommendedFps: 30,
    recommendedFormat: 'mp4',
    description: 'Classic 1:1 square canvas ideal for carousel graphics, quick video tips, and product spotlights.'
  },
  {
    id: 'preset_social_portrait',
    name: 'LinkedIn & Facebook Portrait',
    platform: 'LinkedIn',
    type: 'post',
    aspectRatio: '4:5',
    resolution: '1080x1350',
    recommendedFps: 30,
    recommendedFormat: 'mp4',
    description: 'Maximum feed vertical real-estate on mobile newsfeeds without requiring fullscreen expansion.'
  },
  {
    id: 'preset_yt_thumb',
    name: 'YouTube Thumbnail Graphic',
    platform: 'YouTube',
    type: 'thumbnail',
    aspectRatio: '16:9',
    resolution: '1280x720 (HD PNG)',
    recommendedFps: 0,
    recommendedFormat: 'png',
    description: 'High-contrast thumbnail preset with vibrant text, bold subject cutout space, and readable mobile sizing.',
    badge: 'CTR Boost'
  },
  {
    id: 'preset_podcast_audio',
    name: 'Podcast / Audio Snippet',
    platform: 'General',
    type: 'audio',
    aspectRatio: '1:1',
    resolution: '320 kbps Stereo',
    recommendedFps: 0,
    recommendedFormat: 'mp3',
    description: 'Clean compressed voice audio track for Spotify, Telegram, or WhatsApp voice broadcasts.'
  }
];

export const INITIAL_USER_SUBSCRIPTION: UserSubscription = {
  planId: 'pro',
  planName: 'Pro Creator',
  billingCycle: 'monthly',
  status: 'active',
  currentPeriodStart: '2024-12-01T00:00:00Z',
  currentPeriodEnd: '2025-01-01T00:00:00Z',
  nextRenewalDate: '1 Jan 2025',
  renewalDate: '1 Jan 2025',
  daysUntilRenewal: 12,
  amountInr: 1499,
  amount: 1499,
  cancelAtPeriodEnd: false,
};

export const DEMO_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    tier: 'free',
    name: 'Free Starter',
    nameHi: 'मुफ़्त स्टार्टर',
    tagline: 'Ideal for trying Scripter script generation',
    taglineHi: 'शुरुआत करने के लिए',
    description: 'Ideal for trying Scripter script generation and testing teleprompter features.',
    priceMonthlyInr: 0,
    priceYearlyInr: 0,
    priceMonthly: 0,
    priceYearly: 0,
    monthlyCredits: 100,
    creditsPerMonth: 100,
    businessProfilesLimit: 1,
    businessProfilesAllowed: 1,
    features: [
      '100 AI Credits / month',
      '1 Business Profile',
      'Basic Script Generation',
      'Standard Templates (Watermarked)',
      '720p Video Export',
      'Community Support',
    ],
    featuresHi: [
      '100 AI क्रेडिट / माह',
      '1 बिज़नेस प्रोफाइल',
      'बेसिक स्क्रिप्ट जनरेशन',
      'सीमित टेम्पलेट्स',
      '720p वीडियो एक्सपोर्ट',
      'कम्युनिटी सपोर्ट',
    ],
    buttonLabel: 'Current Plan',
  },
  {
    id: 'pro',
    tier: 'pro',
    name: 'Pro Creator',
    nameHi: 'प्रो क्रिएटर',
    tagline: 'Best for active creators, educators & independent businesses',
    taglineHi: 'कंटेंट क्रिएटर के लिए बेहतरीन',
    description: 'Best for active creators, educators, video makers & growing businesses.',
    priceMonthlyInr: 1499,
    priceYearlyInr: 14388,
    priceMonthly: 1499,
    priceYearly: 14388,
    monthlyCredits: 1000,
    creditsPerMonth: 1000,
    businessProfilesLimit: 5,
    businessProfilesAllowed: 5,
    isPopular: true,
    badge: 'Most Popular / सबसे लोकप्रिय',
    features: [
      '1,000 AI Credits / month',
      '5 Dedicated Business Profiles',
      'All Premium Templates & Visual Packs',
      'Custom Brand Kit & Watermark Removal',
      '1080p Full HD Video Export',
      'AI Teleprompter & Recording',
      'Multi-Platform Caption Generator',
      'Priority Email & Chat Support',
    ],
    featuresHi: [
      '1,000 AI क्रेडिट / माह',
      '5 बिज़नेस प्रोफाइल',
      'सभी प्रीमियम टेम्पलेट्स',
      'कस्टम ब्रांड किट और लोगो',
      'Full HD (1080p) एक्सपोर्ट',
      'टेलीप्रॉम्प्टर और रिकॉर्डिंग',
      'AI कैप्शन और हैशटैग',
      'प्रायोरिटी सपोर्ट',
    ],
    buttonLabel: 'Active Plan',
  },
  {
    id: 'business',
    tier: 'business',
    name: 'Business & Agency',
    nameHi: 'बिज़नेस और एजेंसी',
    tagline: 'For production agencies, marketing teams & media firms',
    taglineHi: 'एजेंसियों और टीमों के लिए',
    description: 'For production agencies, marketing teams, studios & media enterprises.',
    priceMonthlyInr: 3499,
    priceYearlyInr: 33588,
    priceMonthly: 3499,
    priceYearly: 33588,
    monthlyCredits: 2500,
    creditsPerMonth: 2500,
    businessProfilesLimit: 20,
    businessProfilesAllowed: 20,
    features: [
      '2,500 AI Credits / month',
      '20 Business Profiles',
      'Unlimited Brand Kits & Fonts',
      '4K Ultra HD Export Support',
      'Team Collaboration & Roles',
      'Bulk Content Batch Export',
      'Dedicated Account Manager',
      'Direct API Access (Limited)',
    ],
    featuresHi: [
      '2,500 AI क्रेडिट / माह',
      '20 बिज़नेस प्रोफाइल',
      'असीमित ब्रांड किट्स',
      '4K वीडियो एक्सपोर्ट',
      'टीम सहयोग',
      'थोक कंटेंट बैच एक्सपोर्ट',
      'समर्पित अकाउंट मैनेजर',
      'API एक्सेस',
    ],
    buttonLabel: 'Upgrade to Business',
  },
];

export const DEMO_TOPUP_PACKAGES: CreditTopupPackage[] = [
  {
    id: 'pack_100',
    name: 'Starter Boost (100 Credits)',
    credits: 100,
    priceInr: 249,
    price: 249,
    perCreditCost: '₹2.49 per credit',
    label: 'Starter Boost',
    badge: 'Quick Top-up',
    description: 'Best for testing ideas and emergency script needs',
  },
  {
    id: 'pack_500',
    name: 'Creator Pack (500 Credits)',
    credits: 500,
    priceInr: 499,
    price: 499,
    perCreditCost: '₹0.99 per credit',
    isPopular: true,
    bonusCredits: 50,
    badge: 'Most Popular',
    label: 'Creator Favorite',
    description: 'Best for regular daily content creation & reels',
  },
  {
    id: 'pack_1500',
    name: 'Power Creator (1,500 Credits)',
    credits: 1500,
    priceInr: 999,
    price: 999,
    perCreditCost: '₹0.66 per credit',
    bonusCredits: 200,
    badge: 'Best Value',
    label: 'Best Value',
    description: 'For active YouTubers and content filmmakers',
  },
  {
    id: 'pack_5000',
    name: 'Agency Pack (5,000 Credits)',
    credits: 5000,
    priceInr: 1499,
    price: 1499,
    perCreditCost: '₹0.30 per credit',
    bonusCredits: 750,
    badge: 'Team Choice',
    label: 'Agency Pack',
    description: 'For high-volume production & client scripts',
  },
  {
    id: 'pack_10000',
    name: 'Enterprise Pack (10,000 Credits)',
    credits: 10000,
    priceInr: 2499,
    price: 2499,
    perCreditCost: '₹0.25 per credit',
    bonusCredits: 2000,
    badge: 'Max Savings',
    label: 'Power User',
    description: 'Maximum volume at our lowest per-credit rate',
  },
];

export const DEMO_CREDIT_LEDGER: CreditLedgerEntry[] = [
  {
    id: 'led_001',
    operationType: 'script_generation',
    description: 'YouTube Script Generation',
    descriptionHi: 'यूट्यूब स्क्रिप्ट जनरेशन',
    amount: -50,
    balanceAfter: 350,
    timestamp: '2024-12-19T10:30:00Z',
    timeAgo: 'Today, 10:30 AM',
    projectTitle: 'Winter Immunity Boost Guide',
  },
  {
    id: 'led_002',
    operationType: 'caption_generation',
    description: 'Instagram Caption & Hashtags Generation',
    descriptionHi: 'इंस्टाग्राम कैप्शन और हैशटैग',
    amount: -10,
    balanceAfter: 400,
    timestamp: '2024-12-19T09:15:00Z',
    timeAgo: 'Today, 09:15 AM',
    projectTitle: 'Ayurvedic Diet Tips',
  },
  {
    id: 'led_003',
    operationType: 'script_generation',
    description: 'Short Reel Script Generation',
    descriptionHi: 'शॉर्ट रील स्क्रिप्ट',
    amount: -10,
    balanceAfter: 410,
    timestamp: '2024-12-18T16:20:00Z',
    timeAgo: 'Yesterday, 04:20 PM',
    projectTitle: '5 Morning Habits for Energy',
  },
  {
    id: 'led_004',
    operationType: 'thumbnail_generation',
    description: 'YouTube Video Thumbnail Composition',
    descriptionHi: 'यूट्यूब थंबनेल कंपोज़ीशन',
    amount: -15,
    balanceAfter: 420,
    timestamp: '2024-12-17T17:20:00Z',
    timeAgo: '2 days ago',
    projectTitle: 'Digital Marketing in 2025',
  },
  {
    id: 'led_005',
    operationType: 'topic_research',
    description: 'Topic Competitor Analysis & Ideas Research',
    descriptionHi: 'टॉपिक रिसर्च और आइडिया खोज',
    amount: -5,
    balanceAfter: 435,
    timestamp: '2024-12-16T14:10:00Z',
    timeAgo: '3 days ago',
    projectTitle: 'Healthcare Trends Outline',
  },
  {
    id: 'led_006',
    operationType: 'topup_purchase',
    description: 'Purchased Additional Credits Pack (200 Credits)',
    descriptionHi: 'अतिरिक्त क्रेडिट पैक खरीदा (200 क्रेडिट)',
    amount: 200,
    balanceAfter: 440,
    timestamp: '2024-12-15T11:00:00Z',
    timeAgo: '4 days ago',
  },
  {
    id: 'led_007',
    operationType: 'plan_allowance',
    description: 'Monthly Pro Plan Credits Allocation',
    descriptionHi: 'मासिक प्रो प्लान क्रेडिट आवंटन',
    amount: 1000,
    balanceAfter: 1200,
    timestamp: '2024-12-01T00:00:00Z',
    timeAgo: '1 Dec 2024',
  },
];

export const DEMO_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_001',
    type: 'project',
    title: 'Script Generated Successfully',
    titleHi: 'स्क्रिप्ट सफलतापूर्वक तैयार हो गई',
    message: 'Your structured script for "Winter Immunity Boost" is ready to record or edit.',
    messageHi: '"Winter Immunity Boost" के लिए आपकी संरचित स्क्रिप्ट तैयार है।',
    createdAt: '2024-12-28T09:10:00Z',
    timeAgo: '2 min ago',
    isRead: false,
    isImportant: true,
    actionUrl: '/user/projects',
    actionLabel: 'View Script →',
    actionLabelHi: 'स्क्रिप्ट देखें →',
  },
  {
    id: 'notif_002',
    type: 'credits',
    title: 'AI Credits Used',
    titleHi: 'AI क्रेडिट उपयोग किए गए',
    message: '10 credits were deducted for 3-part script generation.',
    messageHi: 'स्क्रिप्ट जनरेशन के लिए 10 क्रेडिट काटे गए।',
    createdAt: '2024-12-28T08:45:00Z',
    timeAgo: '25 min ago',
    isRead: false,
    isImportant: false,
    actionUrl: '/user/credits',
    actionLabel: 'View Balance →',
    actionLabelHi: 'बैलेंस देखें →',
  },
  {
    id: 'notif_003',
    type: 'credits',
    title: 'Low AI Credits Alert',
    titleHi: 'कम AI क्रेडिट अलर्ट',
    message: 'You have only 350 credits remaining in your monthly billing cycle. Top-up anytime.',
    messageHi: 'आपके पास केवल 350 क्रेडिट बचे हैं। कभी भी टॉप-अप करें।',
    createdAt: '2024-12-28T08:10:00Z',
    timeAgo: '1 hour ago',
    isRead: false,
    isImportant: true,
    actionUrl: '/user/credits',
    actionLabel: 'Upgrade Plan →',
    actionLabelHi: 'प्लान अपग्रेड करें →',
  },
  {
    id: 'notif_004',
    type: 'billing',
    title: 'Subscription Update',
    titleHi: 'सब्सक्रिप्शन अपडेट',
    message: 'Your Pro Plan will renew on 1 Jan 2025. You can update your payment method anytime.',
    messageHi: 'आपका प्रो प्लान 1 जनवरी 2025 को नवीनीकृत होगा।',
    createdAt: '2024-12-28T07:30:00Z',
    timeAgo: '1 hour ago',
    isRead: true,
    actionUrl: '/user/subscription',
    actionLabel: 'Manage Plan →',
    actionLabelHi: 'प्लान प्रबंधित करें →',
  },
  {
    id: 'notif_005',
    type: 'feature',
    title: 'New Template Available',
    titleHi: 'नया टेम्पलेट उपलब्ध है',
    message: 'Try our new Medical & Wellness Instagram Reel pack with pre-styled Hindi subtitles.',
    messageHi: 'हमारे नए मेडिकल और वेलनेस इंस्टाग्राम रील पैक को आजमाएं।',
    createdAt: '2024-12-28T06:00:00Z',
    timeAgo: '3 hours ago',
    isRead: false,
    actionUrl: '/user/templates',
    actionLabel: 'Explore Templates →',
    actionLabelHi: 'टेम्पलेट्स देखें →',
  },
  {
    id: 'notif_006',
    type: 'billing',
    title: 'Payment Successful',
    titleHi: 'भुगतान सफल रहा',
    message: 'Your monthly subscription payment of ₹1,499 was successfully processed.',
    messageHi: 'आपका ₹1,499 का मासिक सब्सक्रिप्शन भुगतान सफलतापूर्वक पूरा हुआ।',
    createdAt: '2024-12-27T10:00:00Z',
    timeAgo: '1 day ago',
    isRead: true,
    actionUrl: '/user/billing',
    actionLabel: 'View Receipt →',
    actionLabelHi: 'रसीद देखें →',
  },
  {
    id: 'notif_007',
    type: 'feature',
    title: 'Feature Update: Video Studio & Canvas',
    titleHi: 'फीचर अपडेट: वीडियो और थंबनेल स्टूडियो',
    message: 'HTML5 canvas thumbnail generation with Brand Kit sync is now active.',
    messageHi: 'ब्रांड किट सिंक के साथ थंबनेल स्टूडियो अब सक्रिय है।',
    createdAt: '2024-12-26T12:00:00Z',
    timeAgo: '2 days ago',
    isRead: true,
    actionUrl: '/user/thumbnail-studio',
    actionLabel: 'Try Studio →',
    actionLabelHi: 'स्टूडियो आज़माएं →',
  },
  {
    id: 'notif_008',
    type: 'security',
    title: 'Account Security: New Login',
    titleHi: 'खाता सुरक्षा: नया लॉगिन',
    message: 'New login detected from Chrome on Windows in Madhya Pradesh, India.',
    messageHi: 'मध्य प्रदेश, भारत में क्रोम ब्राउज़र से नया लॉगिन देखा गया।',
    createdAt: '2024-12-25T15:30:00Z',
    timeAgo: '3 days ago',
    isRead: true,
    isImportant: true,
    actionUrl: '/user/settings',
    actionLabel: 'Review Activity →',
    actionLabelHi: 'गतिविधि देखें →',
  },
  {
    id: 'notif_009',
    type: 'system',
    title: 'Welcome to Scripter!',
    titleHi: 'स्क्रिप्टर में आपका स्वागत है!',
    message: 'Start transforming your business knowledge into high-impact video scripts today.',
    messageHi: 'आज ही अपने विचारों को प्रभावशाली वीडियो में बदलना शुरू करें।',
    createdAt: '2024-12-20T00:00:00Z',
    timeAgo: '1 week ago',
    isRead: true,
    actionUrl: '/user/home',
    actionLabel: 'Get Started →',
    actionLabelHi: 'शुरू करें →',
  },
];

export const DEMO_PAYMENT_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'tx_105',
    orderId: 'ORDER_SCR_20241215',
    invoiceNumber: 'INV-20241215',
    description: 'Top-Up Pack: 1,500 Additional AI Credits',
    amountInr: 845.76,
    amount: 998,
    taxInr: 152.24,
    totalPaidInr: 998,
    date: '15 Dec 2024, 02:45 PM',
    status: 'successful',
    paymentMethod: 'UPI',
    planOrPackName: 'Additional Credits (1,500)',
    receiptUrl: '#',
  },
  {
    id: 'tx_104',
    orderId: 'ORDER_SCR_20241201',
    invoiceNumber: 'INV-20241201',
    description: 'Pro Plan Subscription (Monthly)',
    amountInr: 846.61,
    amount: 999,
    taxInr: 152.39,
    totalPaidInr: 999,
    date: '1 Dec 2024, 10:15 AM',
    status: 'successful',
    paymentMethod: 'UPI',
    planOrPackName: 'Pro Plan (Monthly)',
    receiptUrl: '#',
  },
  {
    id: 'tx_103b',
    orderId: 'ORDER_SCR_20241128',
    invoiceNumber: 'INV-UNAVAILABLE',
    description: 'Business Plan Upgrade (Yearly)',
    amountInr: 25422.88,
    amount: 29999,
    taxInr: 4576.12,
    totalPaidInr: 29999,
    date: '28 Nov 2024, 04:30 PM',
    status: 'failed',
    paymentMethod: 'Card',
    planOrPackName: 'Business Plan (Yearly)',
    receiptUrl: '#',
  },
  {
    id: 'tx_103',
    orderId: 'ORDER_SCR_20241101',
    invoiceNumber: 'INV-20241101',
    description: 'Pro Plan Subscription (Monthly)',
    amountInr: 846.61,
    amount: 999,
    taxInr: 152.39,
    totalPaidInr: 999,
    date: '1 Nov 2024, 09:00 AM',
    status: 'successful',
    paymentMethod: 'Card',
    planOrPackName: 'Pro Plan (Monthly)',
    receiptUrl: '#',
  },
  {
    id: 'tx_102b',
    orderId: 'ORDER_SCR_20241022',
    invoiceNumber: 'INV-20241022-REF',
    description: '100 Credits Top-up Pack (Duplicate Reversal)',
    amountInr: 211.02,
    amount: 249,
    taxInr: 37.98,
    totalPaidInr: 249,
    date: '22 Oct 2024, 11:20 AM',
    status: 'refunded',
    paymentMethod: 'UPI',
    planOrPackName: 'Additional Credits (100)',
    receiptUrl: '#',
  },
  {
    id: 'tx_102',
    orderId: 'ORDER_SCR_20241015',
    invoiceNumber: 'INV-20241015',
    description: 'Top-Up Pack: 500 Additional AI Credits',
    amountInr: 422.88,
    amount: 499,
    taxInr: 76.12,
    totalPaidInr: 499,
    date: '15 Oct 2024, 06:12 PM',
    status: 'successful',
    paymentMethod: 'UPI',
    planOrPackName: 'Additional Credits (500)',
    receiptUrl: '#',
  },
  {
    id: 'tx_101',
    orderId: 'ORDER_SCR_20241001',
    invoiceNumber: 'INV-20241001',
    description: 'Pro Plan Subscription (Monthly)',
    amountInr: 846.61,
    amount: 999,
    taxInr: 152.39,
    totalPaidInr: 999,
    date: '1 Oct 2024, 08:30 AM',
    status: 'successful',
    paymentMethod: 'NetBanking',
    planOrPackName: 'Pro Plan (Monthly)',
    receiptUrl: '#',
  },
];

export const DEMO_INVOICES: InvoiceItem[] = [
  {
    id: 'inv_105',
    invoiceNumber: 'INV-20241215',
    date: '15 Dec 2024',
    amountInr: 998,
    amount: 998,
    planName: '1,500 Top-Up Credits Pack',
    description: '1,500 Top-Up AI Credits Pack',
    status: 'paid',
    period: 'One-Time Top-up',
    downloadUrl: '#',
  },
  {
    id: 'inv_104',
    invoiceNumber: 'INV-20241201',
    date: '1 Dec 2024',
    amountInr: 999,
    amount: 999,
    planName: 'Pro Plan (Monthly)',
    description: 'Pro Plan Subscription (Monthly) - Dec 2024',
    status: 'paid',
    period: '01 Dec 2024 - 01 Jan 2025',
    downloadUrl: '#',
  },
  {
    id: 'inv_103',
    invoiceNumber: 'INV-20241101',
    date: '1 Nov 2024',
    amountInr: 999,
    amount: 999,
    planName: 'Pro Plan (Monthly)',
    description: 'Pro Plan Subscription (Monthly) - Nov 2024',
    status: 'paid',
    period: '01 Nov 2024 - 01 Dec 2024',
    downloadUrl: '#',
  },
  {
    id: 'inv_102',
    invoiceNumber: 'INV-20241015',
    date: '15 Oct 2024',
    amountInr: 499,
    amount: 499,
    planName: '500 Top-Up Credits Pack',
    description: '500 Top-Up AI Credits Pack',
    status: 'paid',
    period: 'One-Time Top-up',
    downloadUrl: '#',
  },
  {
    id: 'inv_101',
    invoiceNumber: 'INV-20241001',
    date: '1 Oct 2024',
    amountInr: 1499,
    amount: 1499,
    planName: 'Pro Plan (Monthly)',
    description: 'Pro Plan Subscription (Monthly) - Oct 2024',
    status: 'paid',
    period: '01 Oct 2024 - 01 Nov 2024',
    downloadUrl: '#',
  },
];

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  language: 'en',
  theme: 'light',
  defaultVideoFormat: '9:16',
  defaultExportResolution: '1080p',
  autoSaveDrafts: true,
  emailNotifications: true,
  inAppNotifications: true,
  creditThresholdAlerts: true,
  promotionalUpdates: false,
};

