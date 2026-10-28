import { BusinessProfile, PlatformMetrics, Project, UserProfile, ContentIdea, BrandKit, ContentTemplate, SocialExportPreset } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr_001',
  name: 'Rituraj Tomar',
  email: 'riturajtomarorchha@gmail.com',
  role: 'user',
  currentPlan: 'Pro',
  creditsTotal: 1000,
  creditsUsed: 850,
  activeBusinessProfileId: 'bp_health',
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

