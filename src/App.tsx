import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { RoleProvider, useRole } from './context/RoleContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AdminSidebar } from './components/AdminSidebar';
import { UserSidebar } from './components/UserSidebar';
import { RoleGuard } from './components/RoleGuard';

// Primary User Flow (Immediate load)
import { UserHome } from './pages/user/UserHome';
import { AuthPage } from './pages/auth/AuthPage';
import { OnboardingPage } from './pages/auth/OnboardingPage';

// Lazy Loaded Secondary User Pages
const IdeasPage = lazy(() => import('./pages/user/IdeasPage').then(m => ({ default: m.IdeasPage })));
const ScriptStudioPage = lazy(() => import('./pages/user/ScriptStudioPage').then(m => ({ default: m.ScriptStudioPage })));
const ProjectsPage = lazy(() => import('./pages/user/ProjectsPage').then(m => ({ default: m.ProjectsPage })));
const BusinessProfilesPage = lazy(() => import('./pages/user/BusinessProfilesPage').then(m => ({ default: m.BusinessProfilesPage })));
const TeleprompterPage = lazy(() => import('./pages/user/TeleprompterPage').then(m => ({ default: m.TeleprompterPage })));
const VideoStudioPage = lazy(() => import('./pages/user/VideoStudioPage').then(m => ({ default: m.VideoStudioPage })));
const TemplatesPage = lazy(() => import('./pages/user/TemplatesPage').then(m => ({ default: m.TemplatesPage })));
const BrandKitPage = lazy(() => import('./pages/user/BrandKitPage').then(m => ({ default: m.BrandKitPage })));
const ThumbnailStudioPage = lazy(() => import('./pages/user/ThumbnailStudioPage').then(m => ({ default: m.ThumbnailStudioPage })));
const NotificationsPage = lazy(() => import('./pages/user/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const CreditsUsagePage = lazy(() => import('./pages/user/CreditsUsagePage').then(m => ({ default: m.CreditsUsagePage })));
const SubscriptionPlansPage = lazy(() => import('./pages/user/SubscriptionPlansPage').then(m => ({ default: m.SubscriptionPlansPage })));
const BillingPaymentsPage = lazy(() => import('./pages/user/BillingPaymentsPage').then(m => ({ default: m.BillingPaymentsPage })));
const AccountSettingsPage = lazy(() => import('./pages/user/AccountSettingsPage').then(m => ({ default: m.AccountSettingsPage })));
const UserProfilePage = lazy(() => import('./pages/user/UserProfilePage').then(m => ({ default: m.UserProfilePage })));
const HelpSupportPage = lazy(() => import('./pages/user/HelpSupportPage').then(m => ({ default: m.HelpSupportPage })));

// Lazy Loaded Admin Pages
const AdminHome = lazy(() => import('./pages/admin/AdminHome').then(m => ({ default: m.AdminHome })));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage').then(m => ({ default: m.AdminUsersPage })));
const AdminBusinessProfilesPage = lazy(() => import('./pages/admin/AdminBusinessProfilesPage').then(m => ({ default: m.AdminBusinessProfilesPage })));
const AdminIndustriesPage = lazy(() => import('./pages/admin/AdminIndustriesPage').then(m => ({ default: m.AdminIndustriesPage })));
const AdminTemplatesPage = lazy(() => import('./pages/admin/AdminTemplatesPage').then(m => ({ default: m.AdminTemplatesPage })));
const AdminVisualAssetsPage = lazy(() => import('./pages/admin/AdminVisualAssetsPage').then(m => ({ default: m.AdminVisualAssetsPage })));
const AdminModerationPage = lazy(() => import('./pages/admin/AdminModerationPage').then(m => ({ default: m.AdminModerationPage })));
const AdminTicketsPage = lazy(() => import('./pages/admin/AdminTicketsPage').then(m => ({ default: m.AdminTicketsPage })));
const AdminFeedbackPage = lazy(() => import('./pages/admin/AdminFeedbackPage').then(m => ({ default: m.AdminFeedbackPage })));
const AdminNotificationsPage = lazy(() => import('./pages/admin/AdminNotificationsPage').then(m => ({ default: m.AdminNotificationsPage })));
const AdminReportsPage = lazy(() => import('./pages/admin/AdminReportsPage').then(m => ({ default: m.AdminReportsPage })));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage').then(m => ({ default: m.AdminSettingsPage })));
const AdminHelpPage = lazy(() => import('./pages/admin/AdminHelpPage').then(m => ({ default: m.AdminHelpPage })));

// Lazy Loaded Master Admin Pages
const MasterAdminHome = lazy(() => import('./pages/master-admin/MasterAdminHome').then(m => ({ default: m.MasterAdminHome })));
const MasterAdminAiProvidersPage = lazy(() => import('./pages/master-admin/MasterAdminAiProvidersPage').then(m => ({ default: m.MasterAdminAiProvidersPage })));
const MasterAdminPlansPage = lazy(() => import('./pages/master-admin/MasterAdminPlansPage').then(m => ({ default: m.MasterAdminPlansPage })));
const MasterAdminBillingPage = lazy(() => import('./pages/master-admin/MasterAdminBillingPage').then(m => ({ default: m.MasterAdminBillingPage })));
const MasterAdminAdminsPage = lazy(() => import('./pages/master-admin/MasterAdminAdminsPage').then(m => ({ default: m.MasterAdminAdminsPage })));
const MasterAdminSystemPage = lazy(() => import('./pages/master-admin/MasterAdminSystemPage').then(m => ({ default: m.MasterAdminSystemPage })));
const MasterAdminLogsPage = lazy(() => import('./pages/master-admin/MasterAdminLogsPage').then(m => ({ default: m.MasterAdminLogsPage })));
const MasterAdminContentSettingsPage = lazy(() => import('./pages/master-admin/MasterAdminContentSettingsPage').then(m => ({ default: m.MasterAdminContentSettingsPage })));

const ComingSoonPage = lazy(() => import('./pages/shared/ComingSoonPage').then(m => ({ default: m.ComingSoonPage })));
const NotFoundPage = lazy(() => import('./pages/shared/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

/**
 * Shell Layout dynamically adapting between User experience and Admin consoles
 */
const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role } = useRole();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/onboarding';
  const isAdminArea =
    !isAuthPage &&
    (role === 'admin' ||
      role === 'master-admin' ||
      location.pathname.startsWith('/admin') ||
      location.pathname.startsWith('/master-admin'));
  const isFullscreenTeleprompter =
    location.pathname === '/user/teleprompter' && location.search.includes('fullscreen=true');
  const isTeleprompterPage =
    location.pathname.startsWith('/user/teleprompter') || location.pathname.startsWith('/user/video-recording');

  return (
    <div
      className={`${
        isAuthPage ? 'min-h-screen bg-[#070D1E]' : 'min-h-screen'
      } flex flex-col bg-[#F8FAFC] dark:bg-[#070D1E] text-slate-900 dark:text-slate-100 selection:bg-blue-100 selection:text-blue-900 transition-colors`}
    >
      {/* Shared Header across all perspectives (hidden on Auth/Onboarding and Fullscreen Teleprompter) */}
      {!isFullscreenTeleprompter && !isAuthPage && (
        <Header
          showSidebarToggle={true}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />
      )}

      {/* Main viewport with responsive sidebar for Admin / Master Admin and Creator User */}
      <div className={`flex-1 flex flex-row ${isAuthPage ? 'w-full' : ''}`}>
        {!isAuthPage &&
          (isAdminArea ? (
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

        <main
          className={`flex-1 transition-all duration-300 w-full ${
            isAuthPage
              ? 'w-full'
              : !isAdminArea && !isFullscreenTeleprompter
              ? 'lg:pl-64'
              : isAdminArea
              ? 'lg:pl-72'
              : ''
          }`}
        >
          {children}
        </main>
      </div>

      {/* User Mobile Bottom Navigation (hidden on auth, admin, and teleprompter/recording for immersion) */}
      {!isAuthPage && !isAdminArea && !isTeleprompterPage && <MobileBottomNav />}
    </div>
  );
};

/**
 * Smart Root Router: Directs new/unauthenticated users to the Welcome/Login Screen,
 * new Google registrants to Onboarding, and completed creators directly to their User Dashboard.
 */
const RootRoute: React.FC = () => {
  const { isAuthenticated, loading, userProfile } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-[#070D1E] flex items-center justify-center text-white">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (userProfile && userProfile.onboardingCompleted === false) {
    return <Navigate to="/onboarding" replace />;
  }
  return <Navigate to="/user/home" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <RoleProvider>
              <AppShell>
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center min-h-[60vh]">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  }
                >
                  <Routes>
                    {/* Authentication & Welcome Routes */}
                    <Route path="/login" element={<AuthPage />} />
                    <Route path="/register" element={<AuthPage />} />
                    <Route path="/onboarding" element={<OnboardingPage />} />

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
                </Suspense>
              </AppShell>
          </RoleProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </BrowserRouter>
  );
}
