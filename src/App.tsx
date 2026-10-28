import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { RoleProvider, useRole } from './context/RoleContext';
import { LanguageProvider } from './context/LanguageContext';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AdminSidebar } from './components/AdminSidebar';
import { UserHome } from './pages/user/UserHome';
import { IdeasPage } from './pages/user/IdeasPage';
import { ScriptStudioPage } from './pages/user/ScriptStudioPage';
import { ProjectsPage } from './pages/user/ProjectsPage';
import { BusinessProfilesPage } from './pages/user/BusinessProfilesPage';
import { TeleprompterPage } from './pages/user/TeleprompterPage';
import { VideoStudioPage } from './pages/user/VideoStudioPage';
import { AdminHome } from './pages/admin/AdminHome';
import { MasterAdminHome } from './pages/master-admin/MasterAdminHome';
import { ComingSoonPage } from './pages/shared/ComingSoonPage';
import { NotFoundPage } from './pages/shared/NotFoundPage';

/**
 * Shell Layout dynamically adapting between User experience and Admin consoles
 */
const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role } = useRole();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isAdminArea = role === 'admin' || role === 'master-admin' || location.pathname.startsWith('/admin') || location.pathname.startsWith('/master-admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Shared Header across all perspectives */}
      <Header
        showSidebarToggle={isAdminArea}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Main viewport with responsive sidebar for Admin / Master Admin */}
      <div className="flex-1 flex flex-row">
        {isAdminArea && (
          <AdminSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}

        <main className={`flex-1 transition-all duration-300 w-full ${isAdminArea ? 'lg:pl-72' : ''}`}>
          {children}
        </main>
      </div>

      {/* User Mobile Bottom Navigation (only shown for user role on mobile) */}
      {!isAdminArea && <MobileBottomNav />}
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <RoleProvider>
          <AppShell>
            <Routes>
              {/* Default redirect to User Home on root */}
              <Route path="/" element={<Navigate to="/user/home" replace />} />

              {/* User Experience Routes (Phase 2 Connected) */}
              <Route path="/user/home" element={<UserHome />} />
              <Route path="/user/ideas" element={<IdeasPage />} />
              <Route path="/user/research" element={<IdeasPage />} />
              <Route path="/user/create" element={<ScriptStudioPage />} />
              <Route path="/user/script-studio" element={<ScriptStudioPage />} />
              <Route path="/user/projects" element={<ProjectsPage />} />
              <Route path="/user/business-profiles" element={<BusinessProfilesPage />} />
              <Route path="/user/profile" element={<ComingSoonPage featureName="User Profile & Settings" category="Account Management" />} />
              <Route path="/user/teleprompter" element={<TeleprompterPage defaultMode="prompter" />} />
              <Route path="/user/video-recording" element={<TeleprompterPage defaultMode="record" />} />
              <Route path="/user/video-studio" element={<VideoStudioPage />} />
              <Route path="/user/export" element={<VideoStudioPage />} />
              <Route path="/user/library" element={<ComingSoonPage featureName="Saved Content & Library" category="Asset Management" />} />
              <Route path="/user/templates" element={<ComingSoonPage featureName="Templates & Visual Packs" category="Creative Assets" />} />
              <Route path="/user/notifications" element={<ComingSoonPage featureName="Notifications & Alerts" category="Activity" />} />
              <Route path="/user/credits" element={<ComingSoonPage featureName="AI Credits & Usage" category="Billing & Usage" />} />
              <Route path="/user/subscription" element={<ComingSoonPage featureName="Subscription & Plans" category="Billing" />} />
              <Route path="/user/settings" element={<ComingSoonPage featureName="Account Settings" category="Preferences" />} />
              <Route path="/user/help" element={<ComingSoonPage featureName="Help & Support" category="Customer Support" />} />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminHome />} />
              <Route path="/admin/users" element={<ComingSoonPage featureName="User Management" category="Operations" />} />
              <Route path="/admin/business-profiles" element={<ComingSoonPage featureName="Business Profile Management" category="Operations" />} />
              <Route path="/admin/industries" element={<ComingSoonPage featureName="Industry & Category Management" category="Taxonomy" />} />
              <Route path="/admin/templates" element={<ComingSoonPage featureName="Template Library" category="Content Operations" />} />
              <Route path="/admin/assets" element={<ComingSoonPage featureName="Visual Assets" category="Media Operations" />} />
              <Route path="/admin/moderation" element={<ComingSoonPage featureName="Content Moderation" category="Trust & Safety" />} />
              <Route path="/admin/feedback" element={<ComingSoonPage featureName="Feedback Management" category="User Voice" />} />
              <Route path="/admin/tickets" element={<ComingSoonPage featureName="Support Tickets" category="Support" />} />
              <Route path="/admin/notifications" element={<ComingSoonPage featureName="Notifications & Alerts" category="Communications" />} />
              <Route path="/admin/reports" element={<ComingSoonPage featureName="Usage Reports" category="Analytics" />} />
              <Route path="/admin/settings" element={<ComingSoonPage featureName="Admin Settings" category="Configuration" />} />
              <Route path="/admin/help" element={<ComingSoonPage featureName="Help & Documentation" category="Support" />} />

              {/* Master Admin Routes */}
              <Route path="/master-admin/dashboard" element={<MasterAdminHome />} />
              <Route path="/master-admin/users" element={<ComingSoonPage featureName="User Management" category="Executive Governance" />} />
              <Route path="/master-admin/business-profiles" element={<ComingSoonPage featureName="Business Profiles" category="Executive Governance" />} />
              <Route path="/master-admin/industries" element={<ComingSoonPage featureName="Industry & Categories" category="Platform Taxonomy" />} />
              <Route path="/master-admin/templates" element={<ComingSoonPage featureName="Template Library" category="Platform Assets" />} />
              <Route path="/master-admin/assets" element={<ComingSoonPage featureName="Visual Assets" category="Media Architecture" />} />
              <Route path="/master-admin/ai-providers" element={<ComingSoonPage featureName="AI Provider Hub" category="Infrastructure" />} />
              <Route path="/master-admin/plans" element={<ComingSoonPage featureName="Plans & Credits" category="Monetization" />} />
              <Route path="/master-admin/billing" element={<ComingSoonPage featureName="Payments & Billing" category="Financial Operations" />} />
              <Route path="/master-admin/content-settings" element={<ComingSoonPage featureName="Content & Research Settings" category="AI Engine" />} />
              <Route path="/master-admin/notifications" element={<ComingSoonPage featureName="Notifications & Alerts" category="Communications" />} />
              <Route path="/master-admin/analytics" element={<ComingSoonPage featureName="Usage Analytics & Reports" category="Executive Analytics" />} />
              <Route path="/master-admin/moderation" element={<ComingSoonPage featureName="Content Moderation" category="Trust & Safety" />} />
              <Route path="/master-admin/feedback" element={<ComingSoonPage featureName="Feedback Management" category="Platform Insights" />} />
              <Route path="/master-admin/tickets" element={<ComingSoonPage featureName="Support Tickets" category="Executive Escalations" />} />
              <Route path="/master-admin/admins" element={<ComingSoonPage featureName="Admin Management & Permissions" category="Security & RBAC" />} />
              <Route path="/master-admin/system" element={<ComingSoonPage featureName="System Settings" category="System Configuration" />} />
              <Route path="/master-admin/logs" element={<ComingSoonPage featureName="Security & Audit Logs" category="Compliance" />} />
              <Route path="/master-admin/help" element={<ComingSoonPage featureName="Help & Documentation" category="Support" />} />

              {/* Universal 404 Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AppShell>
        </RoleProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
