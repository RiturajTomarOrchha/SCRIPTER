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

export interface ScriptScene {
  sceneNumber: number;
  timeRange: string;
  description: string;
  descriptionHi?: string;
  imageUrl: string;
  selected?: boolean;
}

export interface ScriptVersion {
  version: number;
  updatedAt: string;
  hook: string;
  mainContent: string[];
  closing: string;
}

export interface ProjectMedia {
  id: string;
  title: string;
  url: string;
  type: 'recorded' | 'imported' | 'sample';
  duration: number; // seconds
  aspectRatio: '9:16' | '16:9' | '1:1' | '4:5' | '4:3';
  recordedAt: string;
  resolution?: string;
  fileSize?: string;
  mimeType?: string;
  trimStart?: number;
  trimEnd?: number;
  thumbnailUrl?: string;
}

export interface VideoStudioDraft {
  aspectRatio: '9:16' | '16:9' | '1:1' | '4:5' | '4:3';
  trimStart: number;
  trimEnd: number;
  showSubtitles: boolean;
  subtitleStyle: 'classic' | 'highlight' | 'karaoke';
  showLogoWatermark: boolean;
  watermarkText?: string;
  backgroundMusic: boolean;
  musicVolume: number;
  selectedClipIndex: number;
  appliedAiSuggestions: string[];
  updatedAt: string;
}

export interface ExportRecord {
  id: string;
  exportedAt: string;
  title: string;
  quality: '1080p' | '720p';
  format: 'mp4' | 'mp3';
  aspectRatio: '9:16' | '16:9' | '1:1' | '4:5' | '4:3';
  fileSize: string;
  downloadUrl: string;
}

export interface BrandKit {
  id: string;
  businessProfileId: string;
  brandName: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  watermarkEnabled: boolean;
  watermarkPosition: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  tagline?: string;
  updatedAt: string;
}

export interface ContentTemplate {
  id: string;
  title: string;
  titleHi: string;
  category: string;
  industry: string;
  format: 'short' | 'long' | 'reel' | 'post';
  aspectRatio: '9:16' | '16:9' | '1:1' | '4:5';
  duration: string;
  thumbnailUrl: string;
  previewVideoUrl?: string;
  isPremium?: boolean;
  targetAudience: string;
  description: string;
  descriptionHi: string;
  scriptOutline: string[];
  visualAssetsCount: number;
  visualScenes: ScriptScene[];
  recommendedTitleStyle?: string;
  tags: string[];
}

export interface GraphicThumbnail {
  id: string;
  projectId?: string;
  title: string;
  headline: string;
  subtitle?: string;
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:5';
  templateId?: string;
  backgroundImageUrl?: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  fontFamily: string;
  fontSize: number;
  textAlignment: 'left' | 'center' | 'right';
  position: 'top' | 'center' | 'bottom';
  showBrandLogo: boolean;
  brandLogoUrl?: string;
  showBadge: boolean;
  badgeText?: string;
  exportedImageUrl?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SocialCaptionSet {
  id: string;
  projectId?: string;
  platform: 'instagram' | 'youtube' | 'facebook' | 'linkedin' | 'twitter';
  tone: string;
  language: 'hi' | 'en' | 'hinglish';
  caption: string;
  hashtags: string[];
  callToAction: string;
  shortDescription: string;
  isLiveAi: boolean;
  providerNote: string;
  createdAt: string;
}

export interface SocialExportPreset {
  id: string;
  name: string;
  platform: 'Instagram' | 'YouTube' | 'Facebook' | 'LinkedIn' | 'TikTok' | 'General';
  type: 'reel' | 'video' | 'post' | 'thumbnail' | 'audio';
  aspectRatio: '9:16' | '16:9' | '1:1' | '4:5';
  resolution: string;
  recommendedFps: number;
  recommendedFormat: 'mp4' | 'png' | 'mp3';
  description: string;
  badge?: string;
}

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
  businessProfileId?: string;
  scriptVersions?: ScriptVersion[];
  scenes?: ScriptScene[];
  notes?: string;
  media?: ProjectMedia[];
  activeMediaId?: string;
  studioDraft?: VideoStudioDraft;
  exports?: ExportRecord[];
  thumbnails?: GraphicThumbnail[];
  captions?: SocialCaptionSet[];
  appliedTemplateId?: string;
  appliedBrandKitId?: string;
}

export interface ContentIdea {
  id: string;
  title: string;
  titleHi: string;
  industry: string;
  category: string;
  format: 'Short (15-30s)' | 'Medium (30-60s)' | 'Long (60-180s)';
  targetAudience: string;
  engagementPotential: 'High' | 'Viral' | 'Trending';
  summary: string;
  summaryHi: string;
  outline: string[];
  outlineHi: string[];
  sources: Array<{ name: string; url?: string; date: string; verified: boolean }>;
  isTrending?: boolean;
  businessProfileId?: string;
  imageUrl?: string;
  usageCount?: string;
  isIndustryRecommendation?: boolean;
  relevance?: 'High' | 'Medium' | 'Trending';
  relevanceLabel?: string;
  duration?: string;
  tags?: string[];
  keyPoints?: string[];
  keyPointsHi?: string[];
  suggestedHooks?: Array<{ type: string; hook: string; hookHi: string }>;
  suggestedAngles?: Array<{ angle: string; angleHi: string; targetAudience: string }>;
  viewCount?: string;
  isTimelyNews?: boolean;
  sourceAttributionType?: 'verified_news' | 'ai_recommendation' | 'public_research';
}

export interface TopicResearchContext {
  summary: string;
  summaryHi?: string;
  keyPoints: string[];
  keyPointsHi?: string[];
  sources: Array<{ name: string; url?: string; date: string; verified: boolean }>;
  suggestedHooks?: Array<{ type: string; hook: string; hookHi: string }>;
  suggestedAngles?: Array<{ angle: string; angleHi: string; targetAudience: string }>;
  selectedAngle?: string;
  selectedHook?: string;
  relevance?: string;
  tags?: string[];
  viewCount?: string;
}

export interface ScriptDraft {
  id?: string;
  topic: string;
  videoType: 'short' | 'medium' | 'long' | 'custom';
  durationSeconds: number;
  language: 'hi' | 'en' | 'hinglish';
  tone: string;
  additionalInstructions?: string;
  hook: string;
  mainContent: string[];
  closing: string;
  visualScenes: ScriptScene[];
  voiceTips: string[];
  teleprompterSpeed: number;
  teleprompterFontSize: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
  role: UserRole;
  currentPlan: 'Free' | 'Pro' | 'Business' | 'Enterprise';
  creditsTotal: number;
  creditsUsed: number;
  monthlyAllowance: number;
  purchasedCredits: number;
  activeBusinessProfileId: string;
  legalEntityName?: string;
  billingAddress?: string;
  gstin?: string;
  stateOfSupply?: string;
  location?: string;
  twoFactorEnabled?: boolean;
  memberSince?: string;
  createdAt?: string;
}

export type NotificationType =
  | 'system'
  | 'credits'
  | 'low_credits'
  | 'project'
  | 'script_ready'
  | 'export_ready'
  | 'billing'
  | 'payment'
  | 'security'
  | 'feature'
  | 'template'
  | 'announcement';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  titleHi?: string;
  message: string;
  messageHi?: string;
  createdAt: string;
  timeAgo: string;
  timestamp?: string;
  isRead: boolean;
  isImportant?: boolean;
  actionUrl?: string;
  actionLabel?: string;
  actionLabelHi?: string;
  metadata?: Record<string, any>;
}

export type CreditOperationType =
  | 'script_generation'
  | 'caption_generation'
  | 'thumbnail_generation'
  | 'topic_research'
  | 'video_ai_suggestions'
  | 'topup_purchase'
  | 'monthly_grant'
  | 'plan_allowance'
  | 'refund';

export interface CreditLedgerEntry {
  id: string;
  operationType: CreditOperationType;
  description: string;
  descriptionHi?: string;
  amount: number;
  balanceAfter: number;
  timestamp: string;
  timeAgo?: string;
  projectId?: string;
  projectTitle?: string;
  businessProfileName?: string;
}

export interface CreditTopupPackage {
  id: string;
  name: string;
  nameHi?: string;
  credits: number;
  priceInr: number;
  price: number;
  perCreditCost: string;
  isPopular?: boolean;
  bonusCredits?: number;
  badge?: string;
  description?: string;
  descriptionHi?: string;
  label?: string;
}

export interface CreditBalanceInfo {
  monthlyAllowance: number;
  purchasedCredits: number;
  totalAvailable: number;
  creditsUsed: number;
  remainingCredits: number;
  monthlyUsed: number;
  remainingMonthly: number;
  resetDate: string;
  resetDaysLeft: number;
  daysUntilReset: number;
  recentLedger: CreditLedgerEntry[];
}

export type PlanTier = 'free' | 'pro' | 'business';

export interface SubscriptionPlan {
  id: PlanTier;
  tier: PlanTier;
  name: string;
  nameHi: string;
  tagline: string;
  taglineHi: string;
  description: string;
  descriptionHi?: string;
  priceMonthlyInr: number;
  priceYearlyInr: number;
  priceMonthly: number;
  priceYearly: number;
  monthlyCredits: number;
  creditsPerMonth: number;
  businessProfilesLimit: number;
  businessProfilesAllowed: number;
  features: string[];
  featuresHi: string[];
  isPopular?: boolean;
  badge?: string;
  buttonLabel: string;
}

export interface UserSubscription {
  planId: PlanTier;
  planName: string;
  billingCycle: 'monthly' | 'yearly';
  status: 'active' | 'past_due' | 'cancelled' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  nextRenewalDate: string;
  renewalDate: string;
  daysUntilRenewal?: number;
  amountInr: number;
  amount: number;
  cancelAtPeriodEnd: boolean;
}

export type PaymentStatus = 'successful' | 'failed' | 'pending' | 'refunded' | 'cancelled';

export interface PaymentTransaction {
  id: string;
  orderId: string;
  invoiceNumber: string;
  description: string;
  amountInr: number;
  amount: number;
  taxInr: number;
  totalPaidInr: number;
  date: string;
  status: PaymentStatus;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Wallet';
  planOrPackName: string;
  receiptUrl?: string;
}

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  date: string;
  amountInr: number;
  amount: number;
  planName: string;
  description: string;
  status: 'paid' | 'unpaid' | 'void';
  period: string;
  pdfDownloadUrl?: string;
  downloadUrl?: string;
}

export interface UserPreferences {
  language: 'en' | 'hi';
  theme: 'light' | 'dark' | 'system';
  defaultVideoFormat: '9:16' | '16:9' | '1:1';
  defaultExportResolution: '1080p' | '720p';
  autoSaveDrafts: boolean;
  emailNotifications: boolean;
  inAppNotifications: boolean;
  creditThresholdAlerts: boolean;
  promotionalUpdates: boolean;
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

/**
 * ============================================================================
 * Master Development Prompt 5: Admin & Master Admin Control Room Types
 * ============================================================================
 */
export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  plan: PlanTier;
  status: 'Active' | 'Suspended' | 'Banned';
  joinedDate: string;
  lastActive: string;
  creditsTotal: number;
  creditsUsed: number;
  businessProfilesCount: number;
  projectsCount: number;
  industry?: string;
  notes?: string;
}

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  adminName: string;
  adminRole: UserRole;
  actionType: string;
  targetEntity: string;
  details: string;
  ipAddress: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
  actorName?: string;
  actorRole?: UserRole;
  action?: string;
  target?: string;
  severity?: 'info' | 'warning' | 'critical';
}

export interface IndustryTaxonomy {
  id: string;
  nameEn: string;
  nameHi: string;
  icon: string;
  categories: string[];
  templatesCount: number;
  projectsCount: number;
  isActive: boolean;
  description: string;
}

export interface AdminVisualAsset {
  id: string;
  title: string;
  type: 'video' | 'image' | 'audio' | 'font' | 'graphic';
  category: string;
  industry: string;
  thumbnailUrl: string;
  url?: string;
  fileSize: string;
  dimensions?: string;
  duration?: string;
  downloadsCount: number;
  license: 'Free' | 'Pro' | 'Commercial' | 'free' | 'pro';
  createdAt: string;
  tags?: string[];
  status?: 'active' | 'archived';
}

export interface AIProviderModel {
  id: string;
  name: string;
  contextWindow: string;
  costPer1kTokens: number;
  status: 'Active' | 'Degraded' | 'Offline';
  latencyMs: number;
}

export interface AIProviderConfig {
  id: string;
  name: string;
  provider: 'Google Gemini' | 'Google Imagen' | 'ElevenLabs' | 'Cloud Vision' | string;
  models: AIProviderModel[];
  activeModel: string;
  temperature: number;
  maxOutputTokens: number;
  status: 'Connected' | 'Configured' | 'Offline' | 'active' | 'degraded' | 'standby' | 'not_configured';
  lastHealthCheck: string;
  isPrimary: boolean;
  defaultModel?: string;
  maxTokens?: number;
  rateLimitRpm?: number;
  latencyMs?: number;
  features?: string[];
}

export interface SupportTicket {
  id: string;
  ticketNumber?: string;
  userId?: string;
  userName: string;
  userEmail: string;
  subject: string;
  description?: string;
  category: 'Billing' | 'AI Script' | 'Video Export' | 'Account' | 'Bug' | string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent' | 'low' | 'medium' | 'high' | 'urgent';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed' | 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  messages?: { id: string; senderName: string; senderRole: string; message: string; timestamp: string }[];
  responses?: { id: string; sender: string; role: string; message: string; timestamp: string }[];
}

export interface ContentModerationItem {
  id: string;
  contentType: 'Script' | 'Thumbnail' | 'Video' | 'Comment' | string;
  contentTitle: string;
  userId?: string;
  userName?: string;
  creatorName?: string;
  creatorEmail?: string;
  reportedReason?: 'Spam' | 'Inappropriate Language' | 'Misinformation' | 'Copyright Concern' | string;
  flagReason?: string;
  riskScore?: number;
  severity?: 'low' | 'medium' | 'critical';
  status: 'Pending Review' | 'Approved' | 'Flagged' | 'Removed' | 'pending' | 'flagged' | 'resolved' | 'dismissed';
  timestamp?: string;
  flaggedAt?: string;
  snippet?: string;
  contentPreview?: string;
}

export interface FeedbackSubmission {
  id: string;
  userName: string;
  userEmail: string;
  category: 'Feature Request' | 'Bug Report' | 'UI/UX' | 'Performance' | 'feature_request' | 'bug_report' | 'compliment' | 'general' | string;
  rating: number;
  comment?: string;
  feedbackText?: string;
  status: 'New' | 'Under Review' | 'Planned' | 'Implemented' | 'new' | 'reviewed' | 'planned';
  date?: string;
  submittedAt?: string;
}

export interface PlatformSystemSettings {
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  userRegistrationOpen?: boolean;
  enforce2faForAdmins: boolean;
  defaultUserTier: PlanTier;
  defaultFreeCredits: number;
  geminiApiKeySet: boolean;
  cashfreeMode: 'sandbox' | 'production';
  rateLimitRequestsPerMin: number;
  maxAiRequestsPerMinute?: number;
  defaultVideoQuality?: '720p' | '1080p' | '4k';
  watermarkEnabledGlobal?: boolean;
  sessionTimeoutHours: number;
  auditRetentionDays: number;
}

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'master-admin';
  adminTitle: string;
  permissions: string[];
  lastLogin: string;
  status: 'Active' | 'Inactive' | 'active' | 'suspended';
}

