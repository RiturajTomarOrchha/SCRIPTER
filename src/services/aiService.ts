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
