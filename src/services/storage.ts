import { BusinessProfile, ContentIdea, Project } from '../types';
import { DEMO_BUSINESS_PROFILES, DEMO_CONTENT_IDEAS, DEMO_PROJECTS } from '../data/mockData';

const STORAGE_KEYS = {
  PROJECTS: 'scripter_projects_v2',
  SAVED_IDEAS: 'scripter_saved_ideas_v2',
  PROFILES: 'scripter_business_profiles_v2',
  ACTIVE_PROFILE_ID: 'scripter_active_profile_id_v2',
  DRAFT_SCRIPT: 'scripter_active_script_draft',
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
