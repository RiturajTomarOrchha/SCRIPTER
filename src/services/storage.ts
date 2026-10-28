import {
  BusinessProfile,
  ContentIdea,
  Project,
  BrandKit,
  ContentTemplate,
  GraphicThumbnail,
  SocialCaptionSet,
  SocialExportPreset,
  AppNotification,
  CreditLedgerEntry,
  CreditBalanceInfo,
  CreditOperationType,
  UserSubscription,
  SubscriptionPlan,
  PaymentTransaction,
  InvoiceItem,
  UserProfile,
  UserPreferences,
  PlanTier,
} from '../types';
import {
  DEMO_BUSINESS_PROFILES,
  DEMO_CONTENT_IDEAS,
  DEMO_PROJECTS,
  DEMO_BRAND_KITS,
  DEMO_TEMPLATES,
  SOCIAL_EXPORT_PRESETS,
  DEMO_NOTIFICATIONS,
  DEMO_SUBSCRIPTION_PLANS,
  DEMO_TOPUP_PACKAGES,
  DEMO_CREDIT_LEDGER,
  DEMO_PAYMENT_TRANSACTIONS,
  DEMO_INVOICES,
  DEFAULT_USER_PREFERENCES,
  INITIAL_USER_SUBSCRIPTION,
  INITIAL_USER_PROFILE,
} from '../data/mockData';

const STORAGE_KEYS = {
  PROJECTS: 'scripter_projects_v2',
  SAVED_IDEAS: 'scripter_saved_ideas_v2',
  PROFILES: 'scripter_business_profiles_v2',
  ACTIVE_PROFILE_ID: 'scripter_active_profile_id_v2',
  DRAFT_SCRIPT: 'scripter_active_script_draft',
  BRAND_KITS: 'scripter_brand_kits_v1',
  TEMPLATES: 'scripter_templates_v1',
  THUMBNAILS: 'scripter_thumbnails_v1',
  NOTIFICATIONS: 'scripter_notifications_v1',
  CREDIT_LEDGER: 'scripter_credit_ledger_v1',
  USER_SUBSCRIPTION: 'scripter_user_subscription_v1',
  PURCHASED_CREDITS: 'scripter_purchased_credits_v1',
  CREDITS_USED: 'scripter_credits_used',
  PAYMENT_TRANSACTIONS: 'scripter_payment_transactions_v1',
  INVOICES: 'scripter_invoices_v1',
  USER_PROFILE: 'scripter_user_profile_v1',
  USER_PREFERENCES: 'scripter_user_preferences_v1',
};

// Safe localStorage helper
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`Error reading from localStorage key "${key}":`, err);
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error saving to localStorage key "${key}":`, err);
  }
};

/**
 * Projects API
 */
export const getProjects = (): Project[] => {
  const stored = getFromStorage<Project[]>(STORAGE_KEYS.PROJECTS, []);
  if (stored.length === 0) {
    // Initialize with demo projects
    saveToStorage(STORAGE_KEYS.PROJECTS, DEMO_PROJECTS);
    return DEMO_PROJECTS;
  }
  return stored;
};

export const getProjectById = (id: string): Project | undefined => {
  const projects = getProjects();
  return projects.find((p) => p.id === id);
};

export const saveProject = (projectData: Partial<Project> & { title: string }): Project => {
  const projects = getProjects();
  const now = new Date().toISOString();

  if (projectData.id) {
    // Update existing
    const index = projects.findIndex((p) => p.id === projectData.id);
    if (index !== -1) {
      const existing = projects[index];
      const updated: Project = {
        ...existing,
        ...projectData,
        updatedAt: now,
        timeAgo: 'Just now',
      };
      projects[index] = updated;
      saveToStorage(STORAGE_KEYS.PROJECTS, projects);
      return updated;
    }
  }

  // Create new project
  const newProject: Project = {
    id: `proj_${Date.now()}`,
    title: projectData.title,
    titleHi: projectData.titleHi,
    industry: projectData.industry || 'Healthcare & Wellness',
    category: projectData.category || 'General Content',
    status: projectData.status || 'draft',
    updatedAt: now,
    timeAgo: 'Just now',
    format: projectData.format || 'short',
    duration: projectData.duration || '30s',
    scriptSnippet: projectData.scriptSnippet || '',
    isDemo: false,
    businessProfileId: projectData.businessProfileId,
    scriptVersions: projectData.scriptVersions || [],
    scenes: projectData.scenes || [],
    notes: projectData.notes || '',
    media: projectData.media || [],
    activeMediaId: projectData.activeMediaId,
    studioDraft: projectData.studioDraft,
    exports: projectData.exports || [],
    thumbnails: projectData.thumbnails || [],
    captions: projectData.captions || [],
    appliedTemplateId: projectData.appliedTemplateId,
    appliedBrandKitId: projectData.appliedBrandKitId,
  };

  const updatedProjects = [newProject, ...projects];
  saveToStorage(STORAGE_KEYS.PROJECTS, updatedProjects);
  return newProject;
};

export const duplicateProject = (id: string): Project | undefined => {
  const projects = getProjects();
  const source = projects.find((p) => p.id === id);
  if (!source) return undefined;

  const duplicated: Project = {
    ...source,
    id: `proj_${Date.now()}`,
    title: `${source.title} (Copy)`,
    titleHi: source.titleHi ? `${source.titleHi} (प्रतिलिपि)` : undefined,
    status: 'draft',
    updatedAt: new Date().toISOString(),
    timeAgo: 'Just now',
    isDemo: false,
  };

  const updated = [duplicated, ...projects];
  saveToStorage(STORAGE_KEYS.PROJECTS, updated);
  return duplicated;
};

export const deleteProject = (id: string): boolean => {
  const projects = getProjects();
  const filtered = projects.filter((p) => p.id !== id);
  if (filtered.length !== projects.length) {
    saveToStorage(STORAGE_KEYS.PROJECTS, filtered);
    return true;
  }
  return false;
};

export const updateProjectStatus = (projectId: string, status: import('../types').ProjectStatus): Project | undefined => {
  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === projectId);
  if (index === -1) return undefined;

  const updated: Project = {
    ...projects[index],
    status,
    updatedAt: new Date().toISOString(),
    timeAgo: 'Just now',
  };
  projects[index] = updated;
  saveToStorage(STORAGE_KEYS.PROJECTS, projects);
  return updated;
};

export const renameProject = (projectId: string, title: string, titleHi?: string): Project | undefined => {
  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === projectId);
  if (index === -1) return undefined;

  const updated: Project = {
    ...projects[index],
    title,
    titleHi: titleHi !== undefined ? titleHi : projects[index].titleHi,
    updatedAt: new Date().toISOString(),
    timeAgo: 'Just now',
  };
  projects[index] = updated;
  saveToStorage(STORAGE_KEYS.PROJECTS, projects);
  return updated;
};

export const restoreProjectScriptVersion = (projectId: string, versionNumber: number): Project | undefined => {
  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === projectId);
  if (index === -1) return undefined;

  const project = projects[index];
  const targetVer = project.scriptVersions?.find((v) => v.version === versionNumber);
  if (!targetVer) return undefined;

  const nextVerNum = (project.scriptVersions?.length || 0) + 1;
  const restoredVersion: import('../types').ScriptVersion = {
    version: nextVerNum,
    updatedAt: new Date().toISOString(),
    hook: targetVer.hook,
    mainContent: [...targetVer.mainContent],
    closing: targetVer.closing,
  };

  const updatedVersions = [restoredVersion, ...(project.scriptVersions || [])];
  const updated: Project = {
    ...project,
    scriptSnippet: targetVer.hook,
    scriptVersions: updatedVersions,
    updatedAt: new Date().toISOString(),
    timeAgo: 'Just now',
  };
  projects[index] = updated;
  saveToStorage(STORAGE_KEYS.PROJECTS, projects);
  return updated;
};

/**
 * Phase 3 Media & Studio Persistence
 */
export const attachMediaToProject = (
  projectId: string,
  mediaData: Omit<import('../types').ProjectMedia, 'id'>
): { project: Project; media: import('../types').ProjectMedia } | undefined => {
  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === projectId);
  if (index === -1) return undefined;

  const newMedia: import('../types').ProjectMedia = {
    ...mediaData,
    id: `media_${Date.now()}`,
  };

  const existingMedia = projects[index].media || [];
  const updatedProject: Project = {
    ...projects[index],
    media: [newMedia, ...existingMedia],
    activeMediaId: newMedia.id,
    updatedAt: new Date().toISOString(),
    timeAgo: 'Just now',
    status: projects[index].status === 'draft' ? 'in_progress' : projects[index].status,
  };

  projects[index] = updatedProject;
  saveToStorage(STORAGE_KEYS.PROJECTS, projects);
  return { project: updatedProject, media: newMedia };
};

export const updateProjectMedia = (
  projectId: string,
  mediaId: string,
  updates: Partial<import('../types').ProjectMedia>
): Project | undefined => {
  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === projectId);
  if (index === -1) return undefined;

  const mediaList = projects[index].media || [];
  const mediaIdx = mediaList.findIndex((m) => m.id === mediaId);
  if (mediaIdx === -1) return undefined;

  mediaList[mediaIdx] = { ...mediaList[mediaIdx], ...updates };
  const updatedProject: Project = {
    ...projects[index],
    media: [...mediaList],
    updatedAt: new Date().toISOString(),
    timeAgo: 'Just now',
  };

  projects[index] = updatedProject;
  saveToStorage(STORAGE_KEYS.PROJECTS, projects);
  return updatedProject;
};

export const deleteProjectMedia = (projectId: string, mediaId: string): Project | undefined => {
  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === projectId);
  if (index === -1) return undefined;

  const mediaList = (projects[index].media || []).filter((m) => m.id !== mediaId);
  const updatedProject: Project = {
    ...projects[index],
    media: mediaList,
    activeMediaId: projects[index].activeMediaId === mediaId ? (mediaList[0]?.id || undefined) : projects[index].activeMediaId,
    updatedAt: new Date().toISOString(),
    timeAgo: 'Just now',
  };

  projects[index] = updatedProject;
  saveToStorage(STORAGE_KEYS.PROJECTS, projects);
  return updatedProject;
};

export const saveStudioDraft = (
  projectId: string,
  draft: import('../types').VideoStudioDraft
): Project | undefined => {
  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === projectId);
  if (index === -1) return undefined;

  const updatedProject: Project = {
    ...projects[index],
    studioDraft: draft,
    updatedAt: new Date().toISOString(),
    timeAgo: 'Just now',
  };

  projects[index] = updatedProject;
  saveToStorage(STORAGE_KEYS.PROJECTS, projects);
  return updatedProject;
};

export const addProjectExport = (
  projectId: string,
  exportData: Omit<import('../types').ExportRecord, 'id' | 'exportedAt'>
): { project: Project; exportRecord: import('../types').ExportRecord } | undefined => {
  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === projectId);
  if (index === -1) return undefined;

  const newExport: import('../types').ExportRecord = {
    ...exportData,
    id: `exp_${Date.now()}`,
    exportedAt: new Date().toISOString(),
  };

  const existingExports = projects[index].exports || [];
  const updatedProject: Project = {
    ...projects[index],
    exports: [newExport, ...existingExports],
    status: 'completed',
    updatedAt: new Date().toISOString(),
    timeAgo: 'Just now',
  };

  projects[index] = updatedProject;
  saveToStorage(STORAGE_KEYS.PROJECTS, projects);
  return { project: updatedProject, exportRecord: newExport };
};

/**
 * Saved Ideas API
 */
export const getSavedIdeaIds = (): string[] => {
  return getFromStorage<string[]>(STORAGE_KEYS.SAVED_IDEAS, ['idea_01', 'idea_03']);
};

export const isIdeaSaved = (id: string): boolean => {
  const saved = getSavedIdeaIds();
  return saved.includes(id);
};

export const toggleSaveIdea = (id: string): boolean => {
  const saved = getSavedIdeaIds();
  const exists = saved.includes(id);
  const updated = exists ? saved.filter((i) => i !== id) : [...saved, id];
  saveToStorage(STORAGE_KEYS.SAVED_IDEAS, updated);
  return !exists;
};

export const getAllIdeas = (): ContentIdea[] => {
  return DEMO_CONTENT_IDEAS;
};

/**
 * Business Profiles API
 */
export const getStoredBusinessProfiles = (): BusinessProfile[] => {
  const stored = getFromStorage<BusinessProfile[]>(STORAGE_KEYS.PROFILES, []);
  if (stored.length === 0) {
    saveToStorage(STORAGE_KEYS.PROFILES, DEMO_BUSINESS_PROFILES);
    return DEMO_BUSINESS_PROFILES;
  }
  return stored;
};

export const saveBusinessProfile = (profileData: Partial<BusinessProfile> & { name: string }): BusinessProfile => {
  const profiles = getStoredBusinessProfiles();

  if (profileData.id) {
    const index = profiles.findIndex((p) => p.id === profileData.id);
    if (index !== -1) {
      const updated: BusinessProfile = {
        ...profiles[index],
        ...profileData,
      };
      profiles[index] = updated;
      saveToStorage(STORAGE_KEYS.PROFILES, profiles);
      return updated;
    }
  }

  const newProfile: BusinessProfile = {
    id: `bp_${Date.now()}`,
    name: profileData.name,
    industry: profileData.industry || 'Healthcare & Wellness',
    category: profileData.category || 'General Services',
    targetAudience: profileData.targetAudience || 'Target Audience',
    preferredTone: profileData.preferredTone || 'Educational & Empathetic',
    preferredLanguage: profileData.preferredLanguage || 'Hindi / English',
    isPrimary: false,
    projectsCount: 0,
    iconName: profileData.iconName || 'Briefcase',
    tagline: profileData.tagline || 'Custom Business Profile for targeted content',
  };

  const updatedList = [...profiles, newProfile];
  saveToStorage(STORAGE_KEYS.PROFILES, updatedList);
  return newProfile;
};

export const deleteBusinessProfile = (id: string): boolean => {
  const profiles = getStoredBusinessProfiles();
  if (profiles.length <= 1) {
    // Keep at least one profile
    return false;
  }
  const filtered = profiles.filter((p) => p.id !== id);
  if (filtered.length !== profiles.length) {
    saveToStorage(STORAGE_KEYS.PROFILES, filtered);
    return true;
  }
  return false;
};

export const getStoredActiveProfileId = (): string => {
  return getFromStorage<string>(STORAGE_KEYS.ACTIVE_PROFILE_ID, 'bp_health');
};

export const setStoredActiveProfileId = (id: string): void => {
  saveToStorage(STORAGE_KEYS.ACTIVE_PROFILE_ID, id);
};

/**
 * Phase 4: Brand Kit API
 */
export const getStoredBrandKits = (): BrandKit[] => {
  const stored = getFromStorage<BrandKit[]>(STORAGE_KEYS.BRAND_KITS, []);
  if (stored.length === 0) {
    saveToStorage(STORAGE_KEYS.BRAND_KITS, DEMO_BRAND_KITS);
    return DEMO_BRAND_KITS;
  }
  return stored;
};

export const getBrandKitForProfile = (profileId: string): BrandKit => {
  const kits = getStoredBrandKits();
  const match = kits.find((k) => k.businessProfileId === profileId);
  if (match) return match;

  // Fallback brand kit
  return {
    id: `bk_${profileId}`,
    businessProfileId: profileId,
    brandName: 'Scripter Brand',
    primaryColor: '#2563EB',
    secondaryColor: '#1E293B',
    accentColor: '#F59E0B',
    backgroundColor: '#F8FAFC',
    textColor: '#0F172A',
    fontFamily: 'Plus Jakarta Sans',
    watermarkEnabled: true,
    watermarkPosition: 'top-right',
    tagline: 'High-Impact Content Creation',
    updatedAt: new Date().toISOString(),
  };
};

export const saveBrandKit = (brandKitData: Partial<BrandKit> & { businessProfileId: string }): BrandKit => {
  const kits = getStoredBrandKits();
  const index = kits.findIndex((k) => k.businessProfileId === brandKitData.businessProfileId);

  const now = new Date().toISOString();
  if (index !== -1) {
    const updated: BrandKit = {
      ...kits[index],
      ...brandKitData,
      updatedAt: now,
    };
    kits[index] = updated;
    saveToStorage(STORAGE_KEYS.BRAND_KITS, kits);
    return updated;
  }

  const newKit: BrandKit = {
    id: `bk_${Date.now()}`,
    businessProfileId: brandKitData.businessProfileId,
    brandName: brandKitData.brandName || 'My Brand Kit',
    logoUrl: brandKitData.logoUrl,
    primaryColor: brandKitData.primaryColor || '#2563EB',
    secondaryColor: brandKitData.secondaryColor || '#1E293B',
    accentColor: brandKitData.accentColor || '#F59E0B',
    backgroundColor: brandKitData.backgroundColor || '#F8FAFC',
    textColor: brandKitData.textColor || '#0F172A',
    fontFamily: brandKitData.fontFamily || 'Plus Jakarta Sans',
    watermarkEnabled: brandKitData.watermarkEnabled ?? true,
    watermarkPosition: brandKitData.watermarkPosition || 'top-right',
    tagline: brandKitData.tagline || '',
    updatedAt: now,
  };

  const updatedList = [...kits, newKit];
  saveToStorage(STORAGE_KEYS.BRAND_KITS, updatedList);
  return newKit;
};

/**
 * Phase 4: Templates API
 */
export const getTemplates = (): ContentTemplate[] => {
  const stored = getFromStorage<ContentTemplate[]>(STORAGE_KEYS.TEMPLATES, []);
  if (stored.length === 0) {
    saveToStorage(STORAGE_KEYS.TEMPLATES, DEMO_TEMPLATES);
    return DEMO_TEMPLATES;
  }
  return stored;
};

export const getTemplateById = (id: string): ContentTemplate | undefined => {
  const templates = getTemplates();
  return templates.find((t) => t.id === id);
};

/**
 * Phase 4: Thumbnails & Graphics API
 */
export const saveProjectThumbnail = (
  projectId: string,
  thumbnailData: Omit<GraphicThumbnail, 'id' | 'createdAt' | 'updatedAt'>
): { project: Project; thumbnail: GraphicThumbnail } | undefined => {
  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === projectId);
  if (index === -1) return undefined;

  const now = new Date().toISOString();
  const newThumbnail: GraphicThumbnail = {
    ...thumbnailData,
    id: `thumb_${Date.now()}`,
    projectId,
    createdAt: now,
    updatedAt: now,
  };

  const existingThumbs = projects[index].thumbnails || [];
  const updatedProject: Project = {
    ...projects[index],
    thumbnails: [newThumbnail, ...existingThumbs],
    updatedAt: now,
    timeAgo: 'Just now',
  };

  projects[index] = updatedProject;
  saveToStorage(STORAGE_KEYS.PROJECTS, projects);
  return { project: updatedProject, thumbnail: newThumbnail };
};

export const deleteProjectThumbnail = (projectId: string, thumbnailId: string): Project | undefined => {
  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === projectId);
  if (index === -1) return undefined;

  const filtered = (projects[index].thumbnails || []).filter((t) => t.id !== thumbnailId);
  const updatedProject: Project = {
    ...projects[index],
    thumbnails: filtered,
    updatedAt: new Date().toISOString(),
    timeAgo: 'Just now',
  };

  projects[index] = updatedProject;
  saveToStorage(STORAGE_KEYS.PROJECTS, projects);
  return updatedProject;
};

/**
 * Phase 4: Social Captions API
 */
export const saveProjectCaptions = (
  projectId: string,
  captionData: Omit<SocialCaptionSet, 'id' | 'createdAt'>
): { project: Project; captions: SocialCaptionSet } | undefined => {
  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === projectId);
  if (index === -1) return undefined;

  const now = new Date().toISOString();
  const newCaptions: SocialCaptionSet = {
    ...captionData,
    id: `cap_${Date.now()}`,
    projectId,
    createdAt: now,
  };

  const existingCaptions = projects[index].captions || [];
  const updatedProject: Project = {
    ...projects[index],
    captions: [newCaptions, ...existingCaptions],
    updatedAt: now,
    timeAgo: 'Just now',
  };

  projects[index] = updatedProject;
  saveToStorage(STORAGE_KEYS.PROJECTS, projects);
  return { project: updatedProject, captions: newCaptions };
};

/**
 * Phase 4: Social Export Presets API
 */
export const getExportPresets = (): SocialExportPreset[] => {
  return SOCIAL_EXPORT_PRESETS;
};

/**
 * ============================================================================
 * Phase 5: Notifications Center API
 * ============================================================================
 */
export const getStoredNotifications = (): AppNotification[] => {
  const stored = getFromStorage<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  if (stored.length === 0) {
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, DEMO_NOTIFICATIONS);
    return DEMO_NOTIFICATIONS;
  }
  return stored;
};

export const markNotificationRead = (id: string): AppNotification[] => {
  const notifs = getStoredNotifications();
  const updated = notifs.map((n) => (n.id === id ? { ...n, isRead: true } : n));
  saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
  return updated;
};

export const markAllNotificationsRead = (): AppNotification[] => {
  const notifs = getStoredNotifications();
  const updated = notifs.map((n) => ({ ...n, isRead: true }));
  saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
  return updated;
};

export const addNotification = (
  notif: Omit<AppNotification, 'id' | 'createdAt' | 'timeAgo' | 'isRead'>
): AppNotification => {
  const notifs = getStoredNotifications();
  const newNotif: AppNotification = {
    ...notif,
    id: `notif_${Date.now()}`,
    createdAt: new Date().toISOString(),
    timeAgo: 'Just now',
    isRead: false,
  };
  const updated = [newNotif, ...notifs];
  saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
  return newNotif;
};

export const deleteNotification = (id: string): AppNotification[] => {
  const notifs = getStoredNotifications();
  const updated = notifs.filter((n) => n.id !== id);
  saveToStorage(STORAGE_KEYS.NOTIFICATIONS, updated);
  return updated;
};

/**
 * ============================================================================
 * Phase 5: AI Credits & Auditable Ledger API
 * ============================================================================
 */
export const getCreditBalanceInfo = (): CreditBalanceInfo => {
  const user = getUserProfile();
  const sub = getUserSubscription();

  const planAllowances: Record<PlanTier, number> = {
    free: 100,
    pro: 1000,
    business: 2500,
  };

  const allowance = planAllowances[sub.planId] || 1000;
  const purchased = getFromStorage<number>(STORAGE_KEYS.PURCHASED_CREDITS, user.purchasedCredits || 200);
  const used = getFromStorage<number>(STORAGE_KEYS.CREDITS_USED, user.creditsUsed || 850);
  const total = allowance + purchased;
  const remaining = Math.max(0, total - used);
  const remainingMonthly = Math.max(0, allowance - used);
  const recentLedger = getCreditLedger();

  return {
    monthlyAllowance: allowance,
    purchasedCredits: purchased,
    totalAvailable: remaining,
    creditsUsed: used,
    remainingCredits: remaining,
    monthlyUsed: used,
    remainingMonthly: remainingMonthly,
    resetDate: '1 Jan 2025',
    resetDaysLeft: 12,
    daysUntilReset: 12,
    recentLedger,
  };
};

export const getCreditLedger = (): CreditLedgerEntry[] => {
  const stored = getFromStorage<CreditLedgerEntry[]>(STORAGE_KEYS.CREDIT_LEDGER, []);
  if (stored.length === 0) {
    saveToStorage(STORAGE_KEYS.CREDIT_LEDGER, DEMO_CREDIT_LEDGER);
    return DEMO_CREDIT_LEDGER;
  }
  return stored;
};

// Deduplication cache for rapid concurrent clicks
let lastDeductionTimestamp = 0;
let lastDeductionSignature = '';

export const recordCreditUsage = (
  amount: number, // positive number representing cost (e.g. 10)
  operationType: CreditOperationType,
  description: string,
  projectId?: string | { businessProfileName?: string },
  projectTitle?: string
): { success: boolean; remaining: number; error?: string } => {
  const now = Date.now();
  const sig = `${operationType}_${description}_${amount}`;
  if (sig === lastDeductionSignature && now - lastDeductionTimestamp < 800) {
    // Duplicate call within 800ms window; return current balance without charging again
    const currentBalance = getCreditBalanceInfo();
    return {
      success: true,
      remaining: currentBalance.remainingCredits,
    };
  }
  lastDeductionTimestamp = now;
  lastDeductionSignature = sig;

  const balance = getCreditBalanceInfo();

  if (balance.remainingCredits < amount) {
    return {
      success: false,
      remaining: balance.remainingCredits,
      error: `Insufficient AI credits. This operation requires ${amount} credits, but you only have ${balance.remainingCredits} credits remaining.`,
    };
  }

  const newUsed = balance.creditsUsed + amount;
  saveToStorage(STORAGE_KEYS.CREDITS_USED, newUsed);

  const newRemaining = balance.totalAvailable - amount;

  const resolvedProjectId = typeof projectId === 'string' ? projectId : undefined;
  const resolvedProfileName = typeof projectId === 'object' ? projectId?.businessProfileName : undefined;

  const ledger = getCreditLedger();
  const newEntry: CreditLedgerEntry = {
    id: `led_${Date.now()}`,
    operationType,
    description,
    amount: -amount,
    balanceAfter: newRemaining,
    timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    timeAgo: 'Just now',
    projectId: resolvedProjectId,
    projectTitle,
    businessProfileName: resolvedProfileName,
  };

  saveToStorage(STORAGE_KEYS.CREDIT_LEDGER, [newEntry, ...ledger]);

  // If remaining credits drop below 200, dispatch a low-balance notification
  if (newRemaining <= 200 && balance.remainingCredits > 200) {
    addNotification({
      type: 'credits',
      title: 'Low AI Credits Alert',
      titleHi: 'कम AI क्रेडिट अलर्ट',
      message: `You have only ${newRemaining} AI credits left in your monthly balance. Top-up credits or upgrade to maintain uninterrupted generation.`,
      messageHi: `आपके पास केवल ${newRemaining} AI क्रेडिट बचे हैं।`,
      actionUrl: '/user/credits',
      actionLabel: 'Top-Up Credits →',
      actionLabelHi: 'क्रेडिट खरीदें →',
      isImportant: true,
    });
  }

  return {
    success: true,
    remaining: newRemaining,
  };
};

export const addPurchasedCredits = (credits: number, priceInr: number, orderId: string): CreditBalanceInfo => {
  const balance = getCreditBalanceInfo();
  const nextPurchased = balance.purchasedCredits + credits;
  saveToStorage(STORAGE_KEYS.PURCHASED_CREDITS, nextPurchased);

  const ledger = getCreditLedger();
  const newEntry: CreditLedgerEntry = {
    id: `led_${Date.now()}`,
    operationType: 'topup_purchase',
    description: `Purchased Top-Up Pack (+${credits} Credits)`,
    descriptionHi: `क्रेडिट पैक खरीदा (+${credits} क्रेडिट)`,
    amount: credits,
    balanceAfter: balance.remainingCredits + credits,
    timestamp: new Date().toISOString(),
    timeAgo: 'Just now',
  };
  saveToStorage(STORAGE_KEYS.CREDIT_LEDGER, [newEntry, ...ledger]);

  addNotification({
    type: 'billing',
    title: 'Credits Added Successfully',
    titleHi: 'क्रेडिट सफलतापूर्वक जोड़े गए',
    message: `${credits} AI credits have been added to your account balance for Order #${orderId}.`,
    messageHi: `${credits} AI क्रेडिट आपके खाते में जोड़ दिए गए हैं।`,
    actionUrl: '/user/credits',
    actionLabel: 'View Balance →',
    actionLabelHi: 'बैलेंस देखें →',
  });

  return getCreditBalanceInfo();
};

/**
 * ============================================================================
 * Phase 5: Subscription Plans API
 * ============================================================================
 */
export const getSubscriptionPlans = (): SubscriptionPlan[] => {
  return DEMO_SUBSCRIPTION_PLANS;
};

export const getUserSubscription = (): UserSubscription => {
  return getFromStorage<UserSubscription>(STORAGE_KEYS.USER_SUBSCRIPTION, INITIAL_USER_SUBSCRIPTION);
};

export const updateUserSubscription = (
  planIdOrData: PlanTier | Partial<UserSubscription>,
  billingCycle: 'monthly' | 'yearly' = 'monthly'
): UserSubscription => {
  const current = getUserSubscription();

  if (typeof planIdOrData === 'object') {
    const updated: UserSubscription = {
      ...current,
      ...planIdOrData,
      renewalDate: planIdOrData.renewalDate || current.renewalDate || current.nextRenewalDate,
      daysUntilRenewal: planIdOrData.daysUntilRenewal ?? current.daysUntilRenewal ?? 12,
      amount: planIdOrData.amount ?? planIdOrData.amountInr ?? current.amount ?? current.amountInr,
      amountInr: planIdOrData.amountInr ?? planIdOrData.amount ?? current.amountInr,
    };
    saveToStorage(STORAGE_KEYS.USER_SUBSCRIPTION, updated);
    return updated;
  }

  const planId = planIdOrData;
  const plans = getSubscriptionPlans();
  const plan = plans.find((p) => p.id === planId) || plans[1];
  const price = billingCycle === 'yearly' ? plan.priceYearlyInr : plan.priceMonthlyInr;

  const now = new Date();
  const renewal = new Date(now.getTime() + (billingCycle === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000);
  const renewalStr = renewal.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const updated: UserSubscription = {
    planId,
    planName: plan.name,
    billingCycle,
    status: 'active',
    currentPeriodStart: now.toISOString(),
    currentPeriodEnd: renewal.toISOString(),
    nextRenewalDate: renewalStr,
    renewalDate: renewalStr,
    daysUntilRenewal: 30,
    amountInr: price,
    amount: price,
    cancelAtPeriodEnd: false,
  };

  saveToStorage(STORAGE_KEYS.USER_SUBSCRIPTION, updated);

  // Update User Profile plan
  const user = getUserProfile();
  saveUserProfile({
    ...user,
    currentPlan: (planId === 'free' ? 'Free' : planId === 'pro' ? 'Pro' : 'Business') as any,
    monthlyAllowance: plan.monthlyCredits,
  });

  addNotification({
    type: 'billing',
    title: `Subscribed to ${plan.name}`,
    titleHi: `${plan.nameHi} प्लान सक्रिय हुआ`,
    message: `Your account is now upgraded to ${plan.name}. Enjoy ${plan.monthlyCredits} monthly AI credits and priority processing.`,
    messageHi: `आपका खाता अब ${plan.nameHi} में अपग्रेड हो गया है।`,
    actionUrl: '/user/subscription',
    actionLabel: 'View Benefits →',
    actionLabelHi: 'लाभ देखें →',
    isImportant: true,
  });

  return updated;
};

export const cancelUserSubscription = (): UserSubscription => {
  const current = getUserSubscription();
  const updated: UserSubscription = {
    ...current,
    cancelAtPeriodEnd: true,
  };
  saveToStorage(STORAGE_KEYS.USER_SUBSCRIPTION, updated);

  addNotification({
    type: 'billing',
    title: 'Subscription Cancellation Scheduled',
    titleHi: 'सब्सक्रिप्शन रद्द करने का अनुरोध दर्ज',
    message: `Your ${current.planName} benefits will remain active until ${current.nextRenewalDate}. No further renewal charges will occur.`,
    messageHi: `आपके प्लान के लाभ ${current.nextRenewalDate} तक सक्रिय रहेंगे।`,
    actionUrl: '/user/subscription',
    actionLabel: 'Manage Plan →',
    actionLabelHi: 'प्रबंधित करें →',
  });

  return updated;
};

/**
 * ============================================================================
 * Phase 5: Payments & Invoices API
 * ============================================================================
 */
export const getPaymentTransactions = (): PaymentTransaction[] => {
  const stored = getFromStorage<PaymentTransaction[]>(STORAGE_KEYS.PAYMENT_TRANSACTIONS, []);
  if (stored.length === 0) {
    saveToStorage(STORAGE_KEYS.PAYMENT_TRANSACTIONS, DEMO_PAYMENT_TRANSACTIONS);
    return DEMO_PAYMENT_TRANSACTIONS;
  }
  return stored;
};

export const getInvoices = (): InvoiceItem[] => {
  const stored = getFromStorage<InvoiceItem[]>(STORAGE_KEYS.INVOICES, []);
  if (stored.length === 0) {
    saveToStorage(STORAGE_KEYS.INVOICES, DEMO_INVOICES);
    return DEMO_INVOICES;
  }
  return stored;
};

export const createPaymentOrder = (
  itemType: 'plan' | 'topup',
  itemId: string,
  basePriceInr: number,
  couponCode?: string
): {
  orderId: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  couponApplied: boolean;
  isTestMode: boolean;
} => {
  let discount = 0;
  if (couponCode && (couponCode.toUpperCase() === 'LAUNCH20' || couponCode.toUpperCase() === 'SCRIPTER20')) {
    discount = Math.round(basePriceInr * 0.2);
  }

  const discountedBase = Math.max(0, basePriceInr - discount);
  // 18% GST calculation
  const tax = Math.round(discountedBase * 0.18);
  const total = discountedBase + tax;
  const orderId = `ORDER_SCR_${Date.now()}`;

  return {
    orderId,
    subtotal: basePriceInr,
    discount,
    tax,
    total,
    couponApplied: discount > 0,
    isTestMode: true, // Transparent test environment indicator
  };
};

export const verifyAndProcessPayment = (
  order: { orderId: string; total: number; itemType: 'plan' | 'topup'; itemId: string; itemName: string },
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Wallet'
): { success: boolean; transaction: PaymentTransaction; invoice: InvoiceItem } => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const invoiceNumber = `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${order.orderId.slice(-4)}`;

  const tax = Math.round((order.total / 1.18) * 0.18);
  const base = order.total - tax;

  const transaction: PaymentTransaction = {
    id: `tx_${Date.now()}`,
    orderId: order.orderId,
    invoiceNumber,
    description: order.itemName,
    amountInr: base,
    amount: order.total,
    taxInr: tax,
    totalPaidInr: order.total,
    date: dateStr,
    status: 'successful',
    paymentMethod,
    planOrPackName: order.itemName,
    receiptUrl: '#',
  };

  const invoice: InvoiceItem = {
    id: `inv_${Date.now()}`,
    invoiceNumber,
    date: dateStr,
    amountInr: order.total,
    amount: order.total,
    planName: order.itemName,
    description: order.itemName,
    status: 'paid',
    period: `${dateStr} - Renewal/Top-up`,
    downloadUrl: '#',
  };

  // Persist transaction & invoice
  const txs = getPaymentTransactions();
  saveToStorage(STORAGE_KEYS.PAYMENT_TRANSACTIONS, [transaction, ...txs]);

  const invoices = getInvoices();
  saveToStorage(STORAGE_KEYS.INVOICES, [invoice, ...invoices]);

  // If top-up, credit the purchased balance
  if (order.itemType === 'topup') {
    const packs = DEMO_TOPUP_PACKAGES;
    const pack = packs.find((p) => p.id === order.itemId);
    const creditsToAdd = pack ? pack.credits + (pack.bonusCredits || 0) : 500;
    addPurchasedCredits(creditsToAdd, order.total, order.orderId);
  } else if (order.itemType === 'plan') {
    updateUserSubscription(order.itemId as PlanTier, 'monthly');
  }

  return { success: true, transaction, invoice };
};

/**
 * ============================================================================
 * Phase 5: Account Profile & Preferences API
 * ============================================================================
 */
export const getUserProfile = (): UserProfile => {
  return getFromStorage<UserProfile>(STORAGE_KEYS.USER_PROFILE, INITIAL_USER_PROFILE);
};

export const saveUserProfile = (profileData: Partial<UserProfile>): UserProfile => {
  const current = getUserProfile();
  const updated: UserProfile = {
    ...current,
    ...profileData,
  };
  saveToStorage(STORAGE_KEYS.USER_PROFILE, updated);
  return updated;
};

export const getUserPreferences = (): UserPreferences => {
  return getFromStorage<UserPreferences>(STORAGE_KEYS.USER_PREFERENCES, DEFAULT_USER_PREFERENCES);
};

export const saveUserPreferences = (prefs: Partial<UserPreferences>): UserPreferences => {
  const current = getUserPreferences();
  const updated: UserPreferences = {
    ...current,
    ...prefs,
  };
  saveToStorage(STORAGE_KEYS.USER_PREFERENCES, updated);
  return updated;
};
