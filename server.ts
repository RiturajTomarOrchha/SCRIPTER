import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Health and AI status check
app.get('/api/health', (_req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY);
  res.json({
    status: 'ok',
    geminiConfigured: hasKey,
    environment: process.env.NODE_ENV || 'development',
  });
});

// Server-side Gemini Script Generation
app.post('/api/generate-script', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey === 'YOUR_KEY_HERE') {
    return res.json({
      isLiveAi: false,
      message: 'Gemini API key not configured on server. Using client domain templates.',
    });
  }

  const {
    topic,
    durationSeconds = 45,
    videoType = 'short',
    language = 'en',
    tone = 'Engaging',
    businessProfile,
    additionalInstructions = '',
  } = req.body;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are Scripter AI, a viral video scriptwriting engine tailored for content creators.
Topic: ${topic}
Video Duration: ${durationSeconds} seconds (${videoType})
Language: ${language === 'hi' ? 'Hindi (Devanagari script)' : language === 'hinglish' ? 'Hinglish (Hindi written in English alphabet)' : 'English'}
Tone: ${tone}
Industry: ${businessProfile?.name || 'General Creator'}
Additional Instructions: ${additionalInstructions || 'None'}

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

    const text = response.text?.trim() || '{}';
    const parsed = JSON.parse(text);

    return res.json({
      hook: parsed.hook,
      mainContent: parsed.mainContent || [],
      closing: parsed.closing,
      voiceTips: parsed.voiceTips || [],
      isLiveAi: true,
      providerNote: 'Generated live with Gemini 2.5 Flash on server',
    });
  } catch (error: any) {
    console.warn('Server Gemini generateContent error:', error?.message);
    return res.status(200).json({
      isLiveAi: false,
      error: error?.message || 'Server AI generation error',
    });
  }
});

// Server-side Gemini Caption & Hashtag Generation
app.post('/api/generate-captions', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey === 'YOUR_KEY_HERE') {
    return res.json({
      isLiveAi: false,
      message: 'Gemini API key not configured on server. Using client domain templates.',
    });
  }

  const {
    topic,
    platform = 'instagram',
    language = 'en',
    businessProfile,
    tone = 'Engaging & Viral',
    scriptSnippet = '',
  } = req.body;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are a social media copywriter specialized in viral short-form video captions.
Topic: ${topic}
Platform: ${platform}
Language: ${language === 'hi' ? 'Hindi (Devanagari script)' : language === 'hinglish' ? 'Hinglish' : 'English'}
Industry: ${businessProfile?.name || 'Creator'}
Tone: ${tone}
Script Context: ${scriptSnippet || 'None'}

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

    const text = response.text?.trim() || '{}';
    const parsed = JSON.parse(text);

    return res.json({
      caption: parsed.caption,
      hashtags: parsed.hashtags || [],
      callToAction: parsed.callToAction || '',
      shortDescription: parsed.shortDescription || '',
      isLiveAi: true,
      providerNote: 'Generated live with Gemini 2.5 Flash on server',
    });
  } catch (error: any) {
    console.warn('Server Gemini generate-captions error:', error?.message);
    return res.status(200).json({
      isLiveAi: false,
      error: error?.message || 'Server AI generation error',
    });
  }
});

// Server-side Gemini Topic Intelligence & In-depth Research
app.post('/api/generate-research', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey === 'YOUR_KEY_HERE') {
    return res.json({
      isLiveAi: false,
      message: 'Gemini API key not configured on server. Using client domain templates.',
    });
  }

  const {
    topic,
    industry = 'General',
    language = 'hi',
    businessProfile,
  } = req.body;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are Scripter AI Research Intelligence, an expert fact-checker, researcher, and trend analyst for short-form video creators.
Topic: ${topic}
Industry: ${industry} (${businessProfile?.name || 'Creator'})
Language: ${language === 'hi' ? 'Hindi (Devanagari script)' : 'English'}

Provide an objective, structured research brief in valid JSON:
{
  "summary": "Concise 2-3 sentence overview explaining why this topic is relevant right now",
  "summaryHi": "संक्षिप्त 2-3 वाक्यों का शोध सारांश (हिंदी)",
  "keyPoints": ["5 verified factual bullet points with actionable data, verified numbers, and insights"],
  "keyPointsHi": ["5 मुख्य शोध बिंदु (हिंदी)"],
  "sources": [
    {"name": "Reputable source name (e.g. Government portal, Industry Report, News)", "url": "https://...", "date": "Current Date", "verified": true}
  ],
  "suggestedHooks": [
    {"type": "Question", "hook": "Attention-grabbing question", "hookHi": "आकर्षक प्रश्न हुक"},
    {"type": "Shocking Fact", "hook": "Surprising fact hook", "hookHi": "चौंकाने वाला तथ्य हुक"},
    {"type": "Direct Value", "hook": "Actionable takeaway hook", "hookHi": "सीधा मूल्य हुक"}
  ],
  "suggestedAngles": [
    {"angle": "Angle 1 title", "angleHi": "दृष्टिकोण 1", "targetAudience": "Target audience description"}
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '{}';
    const parsed = JSON.parse(text);

    return res.json({
      ...parsed,
      isLiveAi: true,
      providerNote: 'Generated live with Gemini 2.5 Flash on server',
    });
  } catch (error: any) {
    console.warn('Server Gemini generate-research error:', error?.message);
    return res.status(200).json({
      isLiveAi: false,
      error: error?.message || 'Server research generation error',
    });
  }
});

// Google Search Grounding for Real-Time News & Current Events
app.post('/api/search-news', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  const {
    topic = '',
    industry = 'General',
    language = 'en',
    query = '',
  } = req.body;

  const searchQuery = query || topic || 'Latest digital creator and technology trends';

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey === 'YOUR_KEY_HERE') {
    return res.json({
      isLiveAi: false,
      message: 'Gemini API key not configured. Using domain news intelligence.',
      searchQuery,
      headline: `Latest Industry Insights: ${searchQuery}`,
      summary: `Current trending developments in ${industry} show strong audience interest in practical how-tos, breaking updates, and cost-benefit breakdowns.`,
      keyDevelopments: [
        `High engagement observed for rapid 30-60s explainers addressing ${searchQuery}.`,
        'Audience retention peaks when hook mentions tangible outcomes in the first 3 seconds.',
        'Creators adopting dual-language (Hinglish/English) reporting 2.4x higher reach in India tier-1 & tier-2 cities.',
      ],
      creatorAngles: [
        'Breaking News & What it means for everyday people',
        'Top 3 Common Mistakes everyone is making right now',
        'Step-by-step tutorial or action checklist',
        'Future prediction / Trend analysis for this year',
      ],
      recommendedHooks: [
        `Stop scrolling: did you hear what just happened with ${searchQuery}?`,
        `If you work in ${industry}, you need to know this immediately.`,
        `Here is the 30-second breakdown that nobody else is talking about.`,
      ],
      sources: [
        { title: 'Google News Search', url: `https://news.google.com/search?q=${encodeURIComponent(searchQuery)}` },
        { title: 'Industry Trend Radar', url: 'https://trends.google.com' },
      ],
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are a real-time investigative researcher and viral video strategist.
Query / Topic: "${searchQuery}"
Industry: ${industry}
Language: ${language === 'hi' ? 'Hindi (Devanagari script)' : language === 'hinglish' ? 'Hinglish (Hindi words in English alphabet)' : 'English'}

Conduct a real-time web search using the Google Search tool to find current news, recent announcements, statistics, and public sentiment on this subject.
Provide your response structured clearly with:
- Summary of the latest breaking news / current events
- 4 Key facts or recent developments with dates/context
- 4 High-impact content angles for YouTube Shorts / Reels creators
- 3 Viral video opening hooks`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text?.trim() || '';

    // Extract grounding metadata chunks and search queries
    const candidate = response.candidates?.[0];
    const groundingChunks = (candidate as any)?.groundingMetadata?.groundingChunks || [];
    const webSearchQueries = (candidate as any)?.groundingMetadata?.webSearchQueries || [];

    const sources = groundingChunks
      .filter((chunk: any) => chunk?.web?.uri)
      .map((chunk: any) => ({
        title: chunk.web.title || 'Source Citation',
        url: chunk.web.uri,
      }))
      .filter((item: any, index: number, self: any[]) =>
        index === self.findIndex((t: any) => t.url === item.url)
      )
      .slice(0, 6);

    return res.json({
      isLiveAi: true,
      searchQuery,
      content: text,
      sources,
      webSearchQueries,
      providerNote: 'Grounded live with Google Search API via Gemini on server',
    });
  } catch (error: any) {
    console.warn('Server Google Search grounding error:', error?.message);
    return res.json({
      isLiveAi: false,
      error: error?.message || 'Search grounding error',
      searchQuery,
      headline: `Current Updates on ${searchQuery}`,
      summary: `Explore trending perspectives on ${searchQuery} to craft high-retention video hooks.`,
      keyDevelopments: [
        'Audiences respond strongly to verified figures and fast fact-checking.',
        'Video hooks citing a recent event retain 42% more viewers beyond 5 seconds.',
      ],
      creatorAngles: ['Breaking Insight', 'Contrarian Take', 'Practical Guide'],
      recommendedHooks: [`Wait, did you hear about ${searchQuery}?`],
      sources: [
        { title: 'Google News Search', url: `https://news.google.com/search?q=${encodeURIComponent(searchQuery)}` },
      ],
    });
  }
});


// Vite dev server middleware or static serving
async function bootstrap() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
        allowedHosts: true as const,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Scripter server ready at http://0.0.0.0:${PORT}`);
  });
}

bootstrap();
