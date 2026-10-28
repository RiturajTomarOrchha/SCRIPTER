import { BusinessProfile, PlatformMetrics, Project, UserProfile, ContentIdea } from '../types';

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
