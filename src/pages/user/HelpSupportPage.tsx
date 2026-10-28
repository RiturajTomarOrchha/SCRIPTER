import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Mail,
  Lightbulb,
  PlayCircle,
  ExternalLink,
  CheckCircle2,
  X,
  FileQuestion,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const HelpSupportPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState('Question about AI Credits');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const faqs = [
    {
      q: language === 'en' ? 'How do Scripter AI Credits work?' : 'स्क्रिप्टर एआई क्रेडिट्स कैसे काम करते हैं?',
      a: language === 'en'
        ? 'Credits are the fuel for AI generation across Scripter. Generating a long-form YouTube script costs 10 credits, short reels cost 5 credits, topic research costs 5 credits, and graphic thumbnail packs cost 15 credits. Teleprompter, recording, and exports do not consume credits.'
        : 'क्रेडिट्स एआई जेनरेशन के लिए उपयोग होते हैं। यूट्यूब स्क्रिप्ट के लिए 10 क्रेडिट, रील्स के लिए 5 क्रेडिट, रिसर्च के लिए 5 क्रेडिट और थंबनेल के लिए 15 क्रेडिट लगते हैं। टेलीप्रॉम्प्टर और रिकॉर्डिंग पूरी तरह मुफ़्त हैं।'
    },
    {
      q: language === 'en' ? 'What is the difference between Monthly Allowance and Top-up Credits?' : 'मासिक कोटे और टॉप-अप क्रेडिट में क्या अंतर है?',
      a: language === 'en'
        ? 'Your monthly allowance is granted on the first day of your billing cycle according to your plan (e.g. 1,000 credits for Pro Plan). Top-up packs purchased separately never expire while your plan remains active and carry over indefinitely.'
        : 'मासिक कोटा हर बिलिंग चक्र पर रीसेट होता है (जैसे प्रो प्लान के लिए 1,000 क्रेडिट)। खरीदे गए टॉप-अप क्रेडिट कभी समाप्त नहीं होते और हमेशा बने रहते हैं।'
    },
    {
      q: language === 'en' ? 'How does the Teleprompter and Voice Sync work?' : 'टेलीप्रॉम्प्टर और वॉयस सिंक कैसे काम करता है?',
      a: language === 'en'
        ? 'Scripter includes a built-in voice-adaptive teleprompter. You can record using your webcam or phone camera directly in the browser. You can control scroll speed, font size, mirror mode, and countdown timers.'
        : 'स्क्रिप्टर में वॉयस-अडैप्टिव टेलीप्रॉम्प्टर शामिल है। आप सीधे ब्राउज़र में वेबकैम से रिकॉर्ड कर सकते हैं और स्पीड व फ़ॉन्ट आकार नियंत्रित कर सकते हैं।'
    },
    {
      q: language === 'en' ? 'Can I download GST-compliant tax invoices for business expenses?' : 'क्या मुझे बिज़नेस खर्च के लिए जीएसटी चालान मिलेगा?',
      a: language === 'en'
        ? 'Yes! All payments include 18% GST with full tax breakdown. You can view, print, or download official PDF tax invoices directly from the Payments & Billing tab.'
        : 'हाँ! सभी भुगतानों में 18% जीएसटी का पूरा विवरण होता है। आप पेमेंट्स व बिलिंग टैब से सीधे टैक्स चालान डाउनलोड कर सकते हैं।'
    },
    {
      q: language === 'en' ? 'How do I cancel or upgrade my subscription plan?' : 'सब्सक्रिप्शन प्लान कैसे बदलें या रद्द करें?',
      a: language === 'en'
        ? 'You can switch between Free, Pro, and Business tiers anytime from the Subscription Plans page. If you cancel, your current paid benefits will remain active until the end of your billing cycle.'
        : 'आप कभी भी सब्सक्रिप्शन पेज से प्लान अपग्रेड या बदल सकते हैं। रद्द करने पर वर्तमान अवधि समाप्त होने तक सभी लाभ सक्रिय रहते हैं।'
    }
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendSupportMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setIsContactModalOpen(false);
      setContactMessage('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 lg:pb-12">
      {/* Header Bar */}
      <div className="bg-white border-b border-slate-200/80 sticky top-16 z-20 backdrop-blur-md bg-white/90">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-blue-600" />
            <span>{language === 'en' ? 'Help & Support Center' : 'सहायता और संपर्क केंद्र'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'en'
              ? 'Find quick answers, watch tutorial guides, or contact our support engineering team.'
              : 'सामान्य प्रश्न देखें, वीडियो ट्यूटोरियल देखें या हमारी सपोर्ट टीम से संपर्क करें।'}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'en'
                ? 'Search answers, credit policies, or video export tips...'
                : 'क्रेडिट नीति, वीडियो टिप्स या प्रश्न खोजें...'
            }
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm shadow-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Quick Help Channels Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onClick={() => {
              setContactSubject('Live Chat Assistance');
              setIsContactModalOpen(true);
            }}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {language === 'en' ? 'Live Support Chat' : 'लाइव चैट सहायता'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'en' ? 'Chat with our AI Assistant or creator specialist' : 'विशेषज्ञ से तुरंत चैट करें'}
            </p>
            <span className="text-xs font-semibold text-blue-600 mt-3 inline-flex items-center gap-1">
              <span>{language === 'en' ? 'Start Chat' : 'चैट शुरू करें'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div
            onClick={() => {
              setContactSubject('Email Support Ticket');
              setIsContactModalOpen(true);
            }}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
              {language === 'en' ? 'Email Support' : 'ईमेल सहायता'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              support@scripter.app (Average response under 2 hours)
            </p>
            <span className="text-xs font-semibold text-emerald-600 mt-3 inline-flex items-center gap-1">
              <span>{language === 'en' ? 'Send Email' : 'ईमेल भेजें'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div
            onClick={() => {
              setContactSubject('Feature Request / Suggestion');
              setIsContactModalOpen(true);
            }}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
              {language === 'en' ? 'Request a Feature' : 'नया फ़ीचर सुझाएं'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'en' ? 'Suggest templates, AI models, or video studio tools' : 'टेम्पलेट्स या नए टूल्स का सुझाव दें'}
            </p>
            <span className="text-xs font-semibold text-purple-600 mt-3 inline-flex items-center gap-1">
              <span>{language === 'en' ? 'Submit Idea' : 'सुझाव भेजें'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Video Tutorials Section */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-blue-600" />
                <span>{language === 'en' ? 'Video Tutorials & Guides' : 'वीडियो ट्यूटोरियल्स'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'en'
                  ? 'Master script writing, teleprompter recording, and social exports.'
                  : 'स्क्रिप्ट निर्माण और टेलीप्रॉम्प्टर के त्वरित वीडियो गाइड।'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              onClick={() => navigate('/user/create')}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-200 hover:shadow-md transition-all"
            >
              <div className="aspect-video bg-gradient-to-tr from-blue-900 to-indigo-700 flex items-center justify-center text-white relative">
                <PlayCircle className="w-10 h-10 group-hover:scale-110 transition-transform" />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 text-[10px] font-bold rounded">
                  3:45
                </span>
              </div>
              <div className="p-3 bg-white">
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  AI Script Generation & Teleprompter
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Step-by-step complete creator workflow</p>
              </div>
            </div>

            <div
              onClick={() => navigate('/user/templates')}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-200 hover:shadow-md transition-all"
            >
              <div className="aspect-video bg-gradient-to-tr from-purple-900 to-rose-700 flex items-center justify-center text-white relative">
                <PlayCircle className="w-10 h-10 group-hover:scale-110 transition-transform" />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 text-[10px] font-bold rounded">
                  2:30
                </span>
              </div>
              <div className="p-3 bg-white">
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                  Instagram Reels & Viral Hook Formulas
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Using high-converting templates</p>
              </div>
            </div>

            <div
              onClick={() => navigate('/user/credits')}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-200 hover:shadow-md transition-all"
            >
              <div className="aspect-video bg-gradient-to-tr from-amber-900 to-orange-700 flex items-center justify-center text-white relative">
                <PlayCircle className="w-10 h-10 group-hover:scale-110 transition-transform" />
                <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 text-[10px] font-bold rounded">
                  4:10
                </span>
              </div>
              <div className="p-3 bg-white">
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                  AI Credits, Top-ups & Subscriptions
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Maximizing your monthly allowance</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900">
              {language === 'en' ? 'Frequently Asked Questions' : 'अक्सर पूछे जाने वाले सवाल (FAQs)'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'en'
                ? 'Answers to the most common questions regarding Scripter.'
                : 'स्क्रिप्टर से जुड़े मुख्य सवालों के जवाब।'}
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="py-4">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left gap-3 group"
                  >
                    <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 group-hover:text-slate-600" />
                    )}
                  </button>
                  {isOpen && (
                    <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Contact / Ticket Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setIsContactModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {contactSubmitted ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Message Received!</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Ticket #SUP-{Date.now().toString().slice(-5)} has been logged. Our creator support engineers will reply to your account email shortly.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {contactSubject}
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  We are here to assist your creative production workflow.
                </p>

                <form onSubmit={handleSendSupportMessage} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Topic / Subject</label>
                    <input
                      type="text"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Message / Details</label>
                    <textarea
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Describe what you need help with..."
                      required
                      rows={4}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
