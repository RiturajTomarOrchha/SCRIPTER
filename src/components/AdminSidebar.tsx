import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { useLanguage } from '../context/LanguageContext';
import { ADMIN_NAV_ITEMS, MASTER_ADMIN_NAV_GROUPS } from '../config/navigation';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Building2,
  Library,
  Image,
  Cpu,
  Crown,
  CreditCard,
  Sliders,
  ShieldAlert,
  MessageSquare,
  LifeBuoy,
  UserCheck,
  Settings,
  FileText,
  Bell,
  HelpCircle,
  BarChart3,
  ExternalLink,
  X,
  Sparkles,
  Shield,
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Users,
  Briefcase,
  Building2,
  Library,
  Image,
  Cpu,
  Crown,
  CreditCard,
  Sliders,
  ShieldAlert,
  MessageSquare,
  LifeBuoy,
  UserCheck,
  Settings,
  FileText,
  Bell,
  HelpCircle,
  BarChart3,
};

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const { role, setRole } = useRole();
  const { language } = useLanguage();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0B132B] text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header inside sidebar */}
        <div className="p-4 flex items-center justify-between border-b border-slate-800/80">
          <Link
            to={role === 'master-admin' ? '/master-admin/dashboard' : '/admin/dashboard'}
            className="flex items-center gap-3"
            onClick={onClose}
          >
            <img
              src="/assets/aistudio/Square_Scripter_Logo_d7bb9aeb.png"
              alt="Scripter"
              className="w-9 h-9 object-contain rounded-lg"
            />
            <div>
              <span className="font-bold text-white tracking-tight text-lg leading-tight block">
                Scripter
              </span>
              <span className="text-[10px] text-amber-400 font-medium tracking-wide flex items-center gap-1">
                {role === 'master-admin' ? (
                  <>
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Master Admin</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-3 h-3 text-blue-400" />
                    <span className="text-blue-400">Admin Console</span>
                  </>
                )}
              </span>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {role === 'master-admin' ? (
            // Master Admin Grouped Navigation
            MASTER_ADMIN_NAV_GROUPS.map((group) => (
              <div key={group.groupEn} className="space-y-1">
                <p className="px-3 text-[10px] font-semibold tracking-wider uppercase text-slate-400">
                  {language === 'en' ? group.groupEn : group.groupHi}
                </p>
                {group.items.map((item) => {
                  const Icon = iconMap[item.icon] || LayoutDashboard;
                  return (
                    <NavLink
                      key={item.id}
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">
                        {language === 'en' ? item.labelEn : item.labelHi}
                      </span>
                      {item.isUpcoming && (
                        <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-sm bg-slate-800 text-slate-400 border border-slate-700">
                          {language === 'en' ? 'Soon' : 'जल्द'}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            ))
          ) : (
            // Regular Admin Navigation
            <div className="space-y-1">
              <p className="px-3 text-[10px] font-semibold tracking-wider uppercase text-slate-400">
                {language === 'en' ? 'Administration' : 'प्रशासन'}
              </p>
              {ADMIN_NAV_ITEMS.map((item) => {
                const Icon = iconMap[item.icon] || LayoutDashboard;
                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">
                      {language === 'en' ? item.labelEn : item.labelHi}
                    </span>
                    {item.isUpcoming && (
                      <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-sm bg-slate-800 text-slate-400 border border-slate-700">
                        {language === 'en' ? 'Soon' : 'जल्द'}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Platform switch link & Version tag */}
        <div className="p-4 border-t border-slate-800/80 bg-[#070D1E]/60 space-y-3">
          <button
            onClick={() => {
              setRole('user');
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-200 transition-colors font-medium border border-slate-700/60"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Switch to User Experience' : 'यूज़र ऐप में जाएं'}</span>
          </button>

          <div className="text-center">
            <p className="text-[10px] text-slate-300 font-mono">Scripter v1.0.0</p>
            <p className="text-[9px] text-slate-400">
              {role === 'master-admin' ? 'Master Admin Console' : 'Operations Panel'}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
