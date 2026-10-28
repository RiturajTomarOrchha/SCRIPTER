import { BusinessProfile, ContentIdea, Project, BrandKit, ContentTemplate, GraphicThumbnail, SocialCaptionSet, SocialExportPreset } from '../types';
import { DEMO_BUSINESS_PROFILES, DEMO_CONTENT_IDEAS, DEMO_PROJECTS, DEMO_BRAND_KITS, DEMO_TEMPLATES, SOCIAL_EXPORT_PRESETS } from '../data/mockData';

const STORAGE_KEYS = {
  PROJECTS: 'scripter_projects_v2',
  SAVED_IDEAS: 'scripter_saved_ideas_v2',
  PROFILES: 'scripter_business_profiles_v2',
  ACTIVE_PROFILE_ID: 'scripter_active_profile_id_v2',
  DRAFT_SCRIPT: 'scripter_active_script_draft',
  BRAND_KITS: 'scripter_brand_kits_v1',
  TEMPLATES: 'scripter_templates_v1',
  THUMBNAILS: 'scripter_thumbnails_v1',
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
