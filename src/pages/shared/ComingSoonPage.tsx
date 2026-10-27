import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  ArrowLeft,
  Sparkles,
  Clock,
  Layers,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface ComingSoonPageProps {
  featureName?: string;
  category?: string;
}

export const ComingSoonPage: React.FC<ComingSoonPageProps> = ({ featureName, category }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useRole();
  const { language, t } = useLanguage();

  // Deduce feature name from path if not explicitly provided
  const derivedName =
    featureName ||
    location.pathname
      .split('/')
      .filter(Boolean)
      .pop()
      ?.replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()) ||
    'Upcoming Module';

  const returnHome = () => {
    if (role === 'master-admin') {
      navigate('/master-admin/dashboard');
    } else if (role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/user/home');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-14 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-6">
        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
        <span>Scripter Roadmap · Milestone 2 & Beyond</span>
      </div>

      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-blue-500/20 mb-6">
        <Clock className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.2]" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        {derivedName}
      </h1>

      <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
        {language === 'en'
          ? `The ${derivedName} module is part of Scripter's phased development pipeline and will be unlocked in an upcoming milestone.`
          : `${derivedName} मॉड्यूल स्क्रिपटर के आगामी विकास चरण के लिए निर्धारित है और अगले माइलस्टोन में सक्रिय होगा।`}
      </p>

      {category && (
        <p className="mt-2 text-xs font-medium text-slate-400">
          Domain Category: <span className="text-slate-600">{category}</span>
        </p>
      )}

      {/* Development Scope Summary Box */}
      <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-5 text-left shadow-xs max-w-lg mx-auto">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 uppercase tracking-wider pb-3 border-b border-slate-100">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>Milestone 1 Foundation Active</span>
        </div>
        <ul className="mt-3 space-y-2.5 text-xs text-slate-600">
          <li className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Application Shell, Header & Routing verified</span>
          </li>
          <li className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Dev Role Switcher (User, Admin, Master Admin) operational</span>
          </li>
          <li className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
            <span>Interactive User & Master Admin dashboards ready</span>
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={returnHome}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('backToDashboard')}</span>
        </button>

        <button
          onClick={() => navigate(-1)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold border border-slate-200 transition-colors"
        >
          <span>Go Back</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
