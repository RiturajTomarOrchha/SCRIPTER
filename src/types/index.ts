export type UserRole = 'user' | 'admin' | 'master-admin';

export type Language = 'en' | 'hi';

export interface BusinessProfile {
  id: string;
  name: string;
  industry: string;
  category: string;
  targetAudience: string;
  preferredTone: string;
  preferredLanguage: string;
  isPrimary?: boolean;
  projectsCount: number;
  iconName: string;
  tagline?: string;
}

export type ProjectStatus = 'draft' | 'in_progress' | 'completed' | 'archived';

export interface Project {
  id: string;
  title: string;
  titleHi?: string;
  industry: string;
  category: string;
  status: ProjectStatus;
  updatedAt: string;
  timeAgo: string;
  format: 'short' | 'long' | 'reel' | 'article';
  duration?: string;
  scriptSnippet?: string;
  isDemo?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  currentPlan: 'Free' | 'Pro' | 'Business' | 'Enterprise';
  creditsTotal: number;
  creditsUsed: number;
  activeBusinessProfileId: string;
}

export interface PlatformMetrics {
  totalUsers: number;
  usersGrowthMonthly: number;
  businessProfiles: number;
  profilesGrowthMonthly: number;
  totalProjects: number;
  projectsGrowthMonthly: number;
  totalAiRequests: number;
  aiRequestsGrowthMonthly: number;
  totalRevenueInr: number;
  revenueGrowthMonthly: number;
  isDemoData: boolean;
}

export interface NavItem {
  id: string;
  labelEn: string;
  labelHi: string;
  path: string;
  icon: string;
  badge?: string;
  isUpcoming?: boolean;
  descriptionEn?: string;
  descriptionHi?: string;
}
