import { GoogleGenAI } from '@google/genai';
import { BusinessProfile } from '../types';

export interface ScriptGenerationParams {
  topic: string;
  videoType: 'short' | 'medium' | 'long' | 'custom';
  durationSeconds: number;
  language: 'hi' | 'en' | 'hinglish';
  tone: string;
  additionalInstructions?: string;
  businessProfile?: BusinessProfile;
}

export interface GeneratedScriptResult {
  hook: string;
  mainContent: string[];
  closing: string;
  scenes: Array<{
    sceneNumber: number;
    timeRange: string;
    description: string;
    descriptionHi: string;
    imageUrl: string;
  }>;
  voiceTips: string[];
  isLiveAi: boolean;
  providerNote: string;
}

const getApiKey = (): string | undefined => {
  return (
    import.meta.env.VITE_GEMINI_API_KEY ||
    (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY)
  );
};

export const isGeminiConfigured = (): boolean => {
  const key = getApiKey();
  return Boolean(key && key !== 'MY_GEMINI_API_KEY' && key !== 'YOUR_KEY_HERE');
};

/**
 * High-quality domain fallback template generator
 * Ensures zero broken user experience when no live API key is present
 */
const generateFallbackScript = (params: ScriptGenerationParams): GeneratedScriptResult => {
  const { topic, language, tone, businessProfile } = params;
  const isHindi = language === 'hi' || language === 'hinglish';
  const industry = businessProfile?.name || 'Healthcare & Wellness';

  let hook = '';
  let mainContent: string[] = [];
  let closing = '';

  if (isHindi) {
    hook = `${topic} — ठंड या मौसम बदलते ही क्या आप भी इस समस्या से परेशान हैं? जानिए 3 सबसे असरदार तरीके!`;
    mainContent = [
      '1. सुबह की शुरुआत: खाली पेट 1 गिलास गुनगुना पानी पिएं और शरीर को प्राकृतिक डिटॉक्स दें।',
      '2. आहार में बदलाव: मौसमी फल, हरी पत्तेदार सब्जियां और प्रोटीन से भरपूर हल्का भोजन लें।',
      '3. दैनिक नियम: रोजाना 20-30 मिनट हल्की धूप में टहलें और रात को सोने से पहले स्क्रीन से दूरी बनाएं।'
    ];
    closing = `अगर आप भी स्वस्थ और ऊर्जावान रहना चाहते हैं, तो इन आसान टिप्स को जरूर आजमाएं। वीडियो को सेव करें और अपने परिवार से शेयर करें!`;
  } else {
    hook = `Struggling with ${topic}? Here are the 3 science-backed rules that work every single time!`;
    mainContent = [
      '1. Morning Foundation: Hydrate with warm water and essential minerals before your first caffeine intake.',
      '2. Smart Daily Habit: Prioritize nutrient-dense whole foods and take brisk 15-minute walks after meals.',
      '3. Consistent Recovery: Allow your body 7-8 hours of uninterrupted rest to reset your nervous system.'
    ];
    closing = `Save this guide for your daily routine. Which of these 3 habits will you start tomorrow? Let us know in the comments!`;
  }

  const scenes = [
    {
      sceneNumber: 1,
      timeRange: '0-5s',
      description: `Opening hook visual showing relatable challenge regarding ${topic}`,
      descriptionHi: 'समस्या को उजागर करता हुआ मुख्य दृश्य (Hook)',
      imageUrl: '/assets/aistudio/Master_Admin_UI___________1_Dashboard_65597d51.png',
    },
    {
      sceneNumber: 2,
      timeRange: '5-15s',
      description: 'Step 1 demonstration with close-up product/lifestyle shot',
      descriptionHi: 'पहले उपाय का क्लोज़-अप एवं स्पष्ट प्रदर्शन',
      imageUrl: '/assets/aistudio/Master_Admin_UI___________6_Visual_Assets_Management_bfd1be4e.png',
    },
    {
      sceneNumber: 3,
      timeRange: '15-25s',
      description: 'Step 2 habit showcase in bright, professional environment',
      descriptionHi: 'दूसरे उपाय का आकर्षक और सकारात्मक दृश्य',
      imageUrl: '/assets/aistudio/Master_Admin_UI___________5_Template_Library_Management_086512f2.png',
    },
    {
      sceneNumber: 4,
      timeRange: '25-30s',
      description: 'Clear Call-To-Action screen with creator smiling and follow badge',
      descriptionHi: 'समापन स्क्रीन: कॉल टू एक्शन एवं फॉलो करने का संदेश',
      imageUrl: '/assets/aistudio/Square_Scripter_Logo_d7bb9aeb.png',
    },
  ];

  const voiceTips = [
    'धीमी और स्पष्ट गति में बोलें (Speak at a calm, deliberate pace).',
    'मुख्य बिंदुओं पर हल्का ज़ोर दें (Emphasize the 3 key takeaways).',
    'प्राकृतिक और संवादात्मक शैली रखें (Maintain conversational eye contact).',
    'कैमरे के लेंस की ओर देखकर बोलें (Look right into the camera lens, not screen).',
    '30 सेकंड में समाप्त करने का अभ्यास करें (Rehearse within the 30-45s duration).'
  ];

  return {
    hook,
    mainContent,
    closing,
    scenes,
    voiceTips,
    isLiveAi: false,
    providerNote: 'Generated via Scripter Domain Content Engine (Demo Mode). Add VITE_GEMINI_API_KEY for live Gemini 2.5 inference.',
  };
};

/**
 * Main Script Generation Service
 */
export const generateScriptWithAi = async (
  params: ScriptGenerationParams
): Promise<GeneratedScriptResult> => {
  const apiKey = getApiKey();

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey === 'YOUR_KEY_HERE') {
    // Return high quality structured fallback
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateFallbackScript(params));
      }, 1500); // realistic pleasant animation timing
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are Scripter AI, a viral video scriptwriting engine tailored for content creators.
Topic: ${params.topic}
Video Duration: ${params.durationSeconds} seconds (${params.videoType})
Language: ${params.language === 'hi' ? 'Hindi (Devanagari script)' : params.language === 'hinglish' ? 'Hinglish (Hindi written in English alphabet)' : 'English'}
Tone: ${params.tone}
Industry: ${params.businessProfile?.name || 'General Creator'}
Additional Instructions: ${params.additionalInstructions || 'None'}

Generate a structured script with:
1. Hook (captures attention in 0-5 seconds)
2. Main Content (bullet points with timestamps)
3. Closing (call to action, save & share)
Format your response as a valid JSON object matching:
{
  "hook": "string",
  "mainContent": ["point 1", "point 2", "point 3"],
  "closing": "string",
  "voiceTips": ["tip 1", "tip 2", "tip 3"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '';
    const parsed = JSON.parse(text);

    return {
      hook: parsed.hook,
      mainContent: parsed.mainContent || [],
      closing: parsed.closing,
      scenes: generateFallbackScript(params).scenes,
      voiceTips: parsed.voiceTips || generateFallbackScript(params).voiceTips,
      isLiveAi: true,
      providerNote: 'Generated live with Gemini 2.5 Flash',
    };
  } catch (error) {
    console.warn('Gemini API call failed, gracefully falling back to domain template:', error);
    return generateFallbackScript(params);
  }
};

/**
 * Phase 4: AI Social Captions & Hashtags Generator
 */
export interface CaptionGenerationParams {
  topic: string;
  scriptSnippet?: string;
  platform: 'instagram' | 'youtube' | 'facebook' | 'linkedin' | 'twitter';
  tone?: string;
  language: 'hi' | 'en' | 'hinglish';
  businessProfile?: BusinessProfile;
}

export interface GeneratedCaptionResult {
  caption: string;
  hashtags: string[];
  callToAction: string;
  shortDescription: string;
  isLiveAi: boolean;
  providerNote: string;
}

const generateFallbackCaptions = (params: CaptionGenerationParams): GeneratedCaptionResult => {
  const { topic, platform, language, businessProfile } = params;
  const isHindi = language === 'hi' || language === 'hinglish';
  const brand = businessProfile?.name || 'Scripter Creator';

  let caption = '';
  let hashtags: string[] = [];
  let callToAction = '';
  let shortDescription = '';

  if (platform === 'instagram') {
    caption = isHindi
      ? `🚨 ${topic} — क्या आप भी इस आम गलती को दोहरा रहे हैं?\n\nआज के वीडियो में हमने 3 आसान और असरदार कदम साझा किए हैं जिन्हें अपनाकर आप तुरंत सकारात्मक बदलाव देख सकते हैं।\n\n📌 1. सही समय पर शुरुआत\n📌 2. दैनिक निरंतरता और अनुशासन\n📌 3. सही मार्गदर्शन\n\nवीडियो को बाद के लिए SAVE कर लें और अपने दोस्तों से SHARE करें! 👇`
      : `🚨 Stop scrolling if you deal with ${topic}!\n\nHere are 3 game-changing habits you can start implementing today for maximum impact.\n\n✨ Step 1: Morning foundation & hydration\n✨ Step 2: Consistent 20-minute daily routine\n✨ Step 3: Prioritize recovery & sleep\n\n💾 SAVE this post for your daily reference & SHARE with someone who needs this! 👇`;

    hashtags = [
      '#ContentCreator', '#ViralReels', '#TrendingReels', '#DailyTips',
      '#Inspiration', '#SelfImprovement', '#HindiReels', '#LearnOnInstagram',
      '#HealthyHabits', '#CreatorEconomy', '#ScripterAI'
    ];
    callToAction = isHindi ? 'फॉलो करें और कमेंट में बताएं आपका अनुभव!' : 'Double tap if this helped & follow for daily insights!';
    shortDescription = isHindi ? `${topic} के 3 आसान उपाय` : `3 essential steps to master ${topic}`;
  } else if (platform === 'youtube') {
    caption = isHindi
      ? `इस वीडियो में हमने विस्तार से समझाया है कि ${topic} को कैसे आसानी से समझें और अपनी जीवनशैली में अपनाएं।\n\n⏱️ टाइमस्टैम्प्स:\n0:00 - मुख्य समस्या (Hook)\n0:15 - पहला उपाय\n0:35 - दूसरा उपाय\n0:50 - निष्कर्ष एवं सलाह\n\nचैनल को SUBSCRIBE करें और घंटी 🔔 दबाना न भूलें!`
      : `In this video, we break down actionable steps to conquer ${topic} with practical routines.\n\n⏱️ Timestamps:\n0:00 - The Core Problem\n0:15 - Step 1: Foundation\n0:35 - Step 2: Daily Execution\n0:50 - Key Takeaway\n\nSubscribe to the channel for more evidence-based creator guides!`;

    hashtags = ['#Shorts', '#YouTubeShorts', '#Tutorial', '#HindiExplainers', '#TrendingVideo'];
    callToAction = isHindi ? 'चैनल को सब्सक्राइब करें और वीडियो को लाइक करें!' : 'Hit Subscribe and turn on bell notifications!';
    shortDescription = `${topic} — Complete Video Guide`;
  } else if (platform === 'linkedin') {
    caption = `How top professionals approach ${topic} in 2026.\n\nMost people focus on short-term hacks. But high performers know that sustainable progress boils down to 3 fundamentals:\n\n1. Systems over motivation.\n2. Daily disciplined execution.\n3. Transparent feedback loops.\n\nWhat is your primary focus this quarter? Let us connect in the comments.`;
    hashtags = ['#Productivity', '#Leadership', '#GrowthMindset', '#ProfessionalDevelopment'];
    callToAction = 'Join the conversation in the comments below.';
    shortDescription = `Executive perspective on ${topic}`;
  } else {
    caption = isHindi
      ? `⚡ ${topic} के बारे में ये 3 बातें आपको जरूर पता होनी चाहिए! सेव करें और दोस्तों से साझा करें।`
      : `⚡ 3 things you must know about ${topic}. Save this thread!`;
    hashtags = ['#Tips', '#Trending', '#QuickGuide'];
    callToAction = 'Retweet & bookmark!';
    shortDescription = `Quick guide on ${topic}`;
  }

  return {
    caption,
    hashtags,
    callToAction,
    shortDescription,
    isLiveAi: false,
    providerNote: 'Generated in Scripter Domain Mode (Demo / Fallback)',
  };
};

export const generateSocialCaptions = async (
  params: CaptionGenerationParams
): Promise<GeneratedCaptionResult> => {
  const apiKey = getApiKey();

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey === 'YOUR_KEY_HERE') {
    return generateFallbackCaptions(params);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are a social media copywriter specialized in viral short-form video captions.
Topic: ${params.topic}
Platform: ${params.platform}
Language: ${params.language === 'hi' ? 'Hindi (Devanagari script)' : params.language === 'hinglish' ? 'Hinglish' : 'English'}
Industry: ${params.businessProfile?.name || 'Creator'}
Tone: ${params.tone || 'Engaging & Viral'}
Script Context: ${params.scriptSnippet || 'None'}

Generate a platform-optimized social media post with:
1. "caption": full formatted caption text with emojis and clean line breaks
2. "hashtags": array of 10-15 relevant hashtags
3. "callToAction": compelling 1-line CTA
4. "shortDescription": concise 1-sentence SEO summary

Respond ONLY with valid JSON matching:
{
  "caption": "string",
  "hashtags": ["#tag1", "#tag2"],
  "callToAction": "string",
  "shortDescription": "string"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '';
    const parsed = JSON.parse(text);

    return {
      caption: parsed.caption,
      hashtags: parsed.hashtags || [],
      callToAction: parsed.callToAction || '',
      shortDescription: parsed.shortDescription || '',
      isLiveAi: true,
      providerNote: 'Generated live with Gemini 2.5 Flash',
    };
  } catch (error) {
    console.warn('Gemini caption generation failed, using domain fallback:', error);
    return generateFallbackCaptions(params);
  }
};

