import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { useLanguage } from '../context/LanguageContext';
import { UserRole } from '../types';
import { ShieldAlert, Crown, ArrowLeft, Lock, Shield } from 'lucide-react';

interface RoleGuardProps {
  requiredRole: 'admin' | 'master-admin';
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ requiredRole, children }) => {
  const { role } = useRole();
  const { language } = useLanguage();
  const navigate = useNavigate();

  // If user has Master Admin role, they have unrestricted access to all control room areas
  if (role === 'master-admin') {
    return <>{children}</>;
  }

  // If page requires Admin and role is Admin, allow access
  if (requiredRole === 'admin' && role === 'admin') {
    return <>{children}</>;
  }

  // Handle unauthorized state
  const isMasterAdminRequired = requiredRole === 'master-admin';

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xl text-center space-y-5 animate-in fade-in">
        <div
          className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg ${
            isMasterAdminRequired
              ? 'bg-gradient-to-tr from-amber-500 to-amber-600 text-white shadow-amber-500/20'
              : 'bg-gradient-to-tr from-rose-500 to-rose-600 text-white shadow-rose-500/20'
          }`}
        >
          {isMasterAdminRequired ? (
            <Crown className="w-8 h-8 fill-white" />
          ) : (
            <ShieldAlert className="w-8 h-8 stroke-[2.2]" />
          )}
        </div>

        <div>
          <span className="px-2.5 py-1 text-[11px] font-mono font-bold uppercase rounded-full bg-slate-100 text-slate-700 tracking-wider">
            HTTP 403 · Access Denied
          </span>
          <h2 className="text-xl font-black text-slate-900 mt-2">
            {isMasterAdminRequired
              ? language === 'en'
                ? 'Master Admin Privileges Required'
                : 'मास्टर एडमिन अनुमति आवश्यक'
              : language === 'en'
              ? 'Administrative Authorization Required'
              : 'प्रशासनिक अनुमति आवश्यक'}
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            {isMasterAdminRequired
              ? language === 'en'
                ? 'This module governs core platform infrastructure, billing parameters, and administrative permissions. Only verified Master Admin accounts may access this section.'
                : 'यह मॉड्यूल मुख्य प्लेटफॉर्म इंफ्रास्ट्रक्चर और एडमिन परमिशन को नियंत्रित करता है। केवल सत्यापित मास्टर एडमिन ही इसे एक्सेस कर सकते हैं।'
              : language === 'en'
              ? 'Your current user account does not have authorization to view internal administrative workspaces. This action has been logged in security audit records.'
              : 'आपके वर्तमान खाते के पास प्रशासनिक कार्यक्षेत्र देखने की अनुमति नहीं है। यह प्रयास सुरक्षा ऑडिट में दर्ज कर लिया गया है।'}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <button
            onClick={() => {
              if (role === 'admin') {
                navigate('/admin/dashboard');
              } else {
                navigate('/user/home');
              }
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>
              {role === 'admin'
                ? language === 'en'
                  ? 'Return to Admin Console'
                  : 'एडमिन कंसोल पर लौटें'
                : language === 'en'
                ? 'Return to Creator Home'
                : 'क्रिएटर होम पर लौटें'}
            </span>
          </button>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <Lock className="w-3.5 h-3.5" />
          <span>Role-Based Access Control (RBAC) Active</span>
        </div>
      </div>
    </div>
  );
};
