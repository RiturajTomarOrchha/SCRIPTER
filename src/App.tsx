import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { RoleProvider, useRole } from './context/RoleContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AdminSidebar } from './components/AdminSidebar';
import { UserSidebar } from './components/UserSidebar';
import { UserHome } from './pages/user/UserHome';
import { IdeasPage } from './pages/user/IdeasPage';
import { ScriptStudioPage } from './pages/user/ScriptStudioPage';
import { ProjectsPage } from './pages/user/ProjectsPage';
import { BusinessProfilesPage } from './pages/user/BusinessProfilesPage';
import { TeleprompterPage } from './pages/user/TeleprompterPage';
import { VideoStudioPage } from './pages/user/VideoStudioPage';
import { TemplatesPage } from './pages/user/TemplatesPage';
import { BrandKitPage } from './pages/user/BrandKitPage';
import { ThumbnailStudioPage } from './pages/user/ThumbnailStudioPage';
import { NotificationsPage } from './pages/user/NotificationsPage';
import { CreditsUsagePage } from './pages/user/CreditsUsagePage';
import { SubscriptionPlansPage } from './pages/user/SubscriptionPlansPage';
import { BillingPaymentsPage } from './pages/user/BillingPaymentsPage';
import { AccountSettingsPage } from './pages/user/AccountSettingsPage';
import { UserProfilePage } from './pages/user/UserProfilePage';
import { HelpSupportPage } from './pages/user/HelpSupportPage';
import { AdminHome } from './pages/admin/AdminHome';
import { MasterAdminHome } from './pages/master-admin/MasterAdminHome';
import { RoleGuard } from './components/RoleGuard';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminBusinessProfilesPage } from './pages/admin/AdminBusinessProfilesPage';
import { AdminIndustriesPage } from './pages/admin/AdminIndustriesPage';
import { AdminTemplatesPage } from './pages/admin/AdminTemplatesPage';
import { AdminVisualAssetsPage } from './pages/admin/AdminVisualAssetsPage';
import { AdminModerationPage } from './pages/admin/AdminModerationPage';
import { AdminTicketsPage } from './pages/admin/AdminTicketsPage';
import { AdminFeedbackPage } from './pages/admin/AdminFeedbackPage';
import { AdminNotificationsPage } from './pages/admin/AdminNotificationsPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminHelpPage } from './pages/admin/AdminHelpPage';

import { MasterAdminAiProvidersPage } from './pages/master-admin/MasterAdminAiProvidersPage';
import { MasterAdminPlansPage } from './pages/master-admin/MasterAdminPlansPage';
import { MasterAdminBillingPage } from './pages/master-admin/MasterAdminBillingPage';
import { MasterAdminAdminsPage } from './pages/master-admin/MasterAdminAdminsPage';
import { MasterAdminSystemPage } from './pages/master-admin/MasterAdminSystemPage';
import { MasterAdminLogsPage } from './pages/master-admin/MasterAdminLogsPage';
import { MasterAdminContentSettingsPage } from './pages/master-admin/MasterAdminContentSettingsPage';

import { ComingSoonPage } from './pages/shared/ComingSoonPage';
import { NotFoundPage } from './pages/shared/NotFoundPage';
import { AuthPage } from './pages/auth/AuthPage';

/**
 * Shell Layout dynamically adapting between User experience and Admin consoles
 */
const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role } = useRole();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isAdminArea = !isAuthPage && (role === 'admin' || role === 'master-admin' || location.pathname.startsWith('/admin') || location.pathname.startsWith('/master-admin'));
  const isFullscreenTeleprompter = location.pathname === '/user/teleprompter' && location.search.includes('fullscreen=true');
  const isTeleprompterPage = location.pathname.startsWith('/user/teleprompter') || location.pathname.startsWith('/user/video-recording');

  return (
    <div className={`${isAuthPage ? 'h-screen h-[100dvh] overflow-hidden' : 'min-h-screen'} flex flex-col bg-[#F8FAFC] dark:bg-[#070D1E] text-slate-900 dark:text-slate-100 selection:bg-blue-100 selection:text-blue-900 transition-colors`}>
      {/* Shared Header across all perspectives (hidden on AuthPage and Fullscreen Teleprompter) */}
      {!isFullscreenTeleprompter && !isAuthPage && (
        <Header
          showSidebarToggle={true}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />
      )}

      {/* Main viewport with responsive sidebar for Admin / Master Admin and Creator User */}
      <div className={`flex-1 flex flex-row ${isAuthPage ? 'h-full overflow-hidden' : ''}`}>
        {!isAuthPage && (isAdminArea ? (
          <AdminSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        ) : (
          !isFullscreenTeleprompter && (
            <UserSidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />
          )
        ))}

        <main className={`flex-1 transition-all duration-300 w-full ${isAuthPage ? 'h-full overflow-hidden' : !isAdminArea && !isFullscreenTeleprompter ? 'lg:pl-64' : isAdminArea ? 'lg:pl-72' : ''}`}>
          {children}
        </main>
      </div>

      {/* User Mobile Bottom Navigation (hidden on auth, admin, and teleprompter/recording for immersion) */}
      {!isAuthPage && !isAdminArea && !isTeleprompterPage && <MobileBottomNav />}
    </div>
  );
};

/**
 * Smart Root Router: Directs new/unauthenticated users to the Primary Welcome/Login Screen,
 * and authenticated creators directly to their User Dashboard.
 */
const RootRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-[#070D1E] flex items-center justify-center text-white">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  return isAuthenticated ? <Navigate to="/user/home" replace /> : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <RoleProvider>
              <AppShell>
              <Routes>
                {/* Authentication & Welcome Routes */}
                <Route path="/login" element={<AuthPage />} />
                <Route path="/register" element={<AuthPage />} />

                {/* Root Route: Shows Primary Welcome Screen if logged out, or Dashboard if logged in */}
                <Route path="/" element={<RootRoute />} />

                {/* User Experience Routes (Phase 2 Connected) */}
                <Route path="/user/home" element={<UserHome />} />
                <Route path="/user/ideas" element={<IdeasPage />} />
                <Route path="/user/research" element={<IdeasPage />} />
                <Route path="/user/create" element={<ScriptStudioPage />} />
                <Route path="/user/script-studio" element={<ScriptStudioPage />} />
                <Route path="/user/projects" element={<ProjectsPage />} />
                <Route path="/user/business-profiles" element={<BusinessProfilesPage />} />
                <Route path="/user/profile" element={<UserProfilePage />} />
                <Route path="/user/settings" element={<AccountSettingsPage />} />
                <Route path="/user/teleprompter" element={<TeleprompterPage defaultMode="prompter" />} />
                <Route path="/user/video-recording" element={<TeleprompterPage defaultMode="record" />} />
                <Route path="/user/video-studio" element={<VideoStudioPage />} />
                <Route path="/user/export" element={<VideoStudioPage />} />
                <Route path="/user/library" element={<ProjectsPage />} />
                <Route path="/user/templates" element={<TemplatesPage />} />
                <Route path="/user/brand-kit" element={<BrandKitPage />} />
                <Route path="/user/thumbnail-studio" element={<ThumbnailStudioPage />} />
                <Route path="/user/notifications" element={<NotificationsPage />} />
                <Route path="/user/credits" element={<CreditsUsagePage />} />
                <Route path="/user/subscription" element={<SubscriptionPlansPage />} />
                <Route path="/user/plans" element={<SubscriptionPlansPage />} />
                <Route path="/user/billing" element={<BillingPaymentsPage />} />
                <Route path="/user/payments" element={<BillingPaymentsPage />} />
                <Route path="/user/help" element={<HelpSupportPage />} />

              {/* Admin Routes (RBAC Protected: Admin or Master Admin) */}
              <Route path="/admin/dashboard" element={<RoleGuard requiredRole="admin"><AdminHome /></RoleGuard>} />
              <Route path="/admin/users" element={<RoleGuard requiredRole="admin"><AdminUsersPage /></RoleGuard>} />
              <Route path="/admin/business-profiles" element={<RoleGuard requiredRole="admin"><AdminBusinessProfilesPage /></RoleGuard>} />
              <Route path="/admin/industries" element={<RoleGuard requiredRole="admin"><AdminIndustriesPage /></RoleGuard>} />
              <Route path="/admin/templates" element={<RoleGuard requiredRole="admin"><AdminTemplatesPage /></RoleGuard>} />
              <Route path="/admin/assets" element={<RoleGuard requiredRole="admin"><AdminVisualAssetsPage /></RoleGuard>} />
              <Route path="/admin/moderation" element={<RoleGuard requiredRole="admin"><AdminModerationPage /></RoleGuard>} />
              <Route path="/admin/feedback" element={<RoleGuard requiredRole="admin"><AdminFeedbackPage /></RoleGuard>} />
              <Route path="/admin/tickets" element={<RoleGuard requiredRole="admin"><AdminTicketsPage /></RoleGuard>} />
              <Route path="/admin/notifications" element={<RoleGuard requiredRole="admin"><AdminNotificationsPage /></RoleGuard>} />
              <Route path="/admin/reports" element={<RoleGuard requiredRole="admin"><AdminReportsPage /></RoleGuard>} />
              <Route path="/admin/settings" element={<RoleGuard requiredRole="admin"><AdminSettingsPage /></RoleGuard>} />
              <Route path="/admin/help" element={<RoleGuard requiredRole="admin"><AdminHelpPage /></RoleGuard>} />

              {/* Master Admin Routes (RBAC Protected: Master Admin Only) */}
              <Route path="/master-admin/dashboard" element={<RoleGuard requiredRole="master-admin"><MasterAdminHome /></RoleGuard>} />
              <Route path="/master-admin/users" element={<RoleGuard requiredRole="master-admin"><AdminUsersPage isMasterAdmin /></RoleGuard>} />
              <Route path="/master-admin/business-profiles" element={<RoleGuard requiredRole="master-admin"><AdminBusinessProfilesPage isMasterAdmin /></RoleGuard>} />
              <Route path="/master-admin/industries" element={<RoleGuard requiredRole="master-admin"><AdminIndustriesPage isMasterAdmin /></RoleGuard>} />
              <Route path="/master-admin/templates" element={<RoleGuard requiredRole="master-admin"><AdminTemplatesPage isMasterAdmin /></RoleGuard>} />
              <Route path="/master-admin/assets" element={<RoleGuard requiredRole="master-admin"><AdminVisualAssetsPage isMasterAdmin /></RoleGuard>} />
              <Route path="/master-admin/ai-providers" element={<RoleGuard requiredRole="master-admin"><MasterAdminAiProvidersPage /></RoleGuard>} />
              <Route path="/master-admin/plans" element={<RoleGuard requiredRole="master-admin"><MasterAdminPlansPage /></RoleGuard>} />
              <Route path="/master-admin/billing" element={<RoleGuard requiredRole="master-admin"><MasterAdminBillingPage /></RoleGuard>} />
              <Route path="/master-admin/content-settings" element={<RoleGuard requiredRole="master-admin"><MasterAdminContentSettingsPage /></RoleGuard>} />
              <Route path="/master-admin/notifications" element={<RoleGuard requiredRole="master-admin"><AdminNotificationsPage isMasterAdmin /></RoleGuard>} />
              <Route path="/master-admin/analytics" element={<RoleGuard requiredRole="master-admin"><AdminReportsPage isMasterAdmin /></RoleGuard>} />
              <Route path="/master-admin/moderation" element={<RoleGuard requiredRole="master-admin"><AdminModerationPage isMasterAdmin /></RoleGuard>} />
              <Route path="/master-admin/feedback" element={<RoleGuard requiredRole="master-admin"><AdminFeedbackPage isMasterAdmin /></RoleGuard>} />
              <Route path="/master-admin/tickets" element={<RoleGuard requiredRole="master-admin"><AdminTicketsPage isMasterAdmin /></RoleGuard>} />
              <Route path="/master-admin/admins" element={<RoleGuard requiredRole="master-admin"><MasterAdminAdminsPage /></RoleGuard>} />
              <Route path="/master-admin/system" element={<RoleGuard requiredRole="master-admin"><MasterAdminSystemPage /></RoleGuard>} />
              <Route path="/master-admin/logs" element={<RoleGuard requiredRole="master-admin"><MasterAdminLogsPage /></RoleGuard>} />
              <Route path="/master-admin/help" element={<RoleGuard requiredRole="master-admin"><AdminHelpPage isMasterAdmin /></RoleGuard>} />

              {/* Universal 404 Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            </AppShell>
          </RoleProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </BrowserRouter>
  );
}
