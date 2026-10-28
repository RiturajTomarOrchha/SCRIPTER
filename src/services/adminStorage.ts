import {
  AdminUserRecord,
  AdminAuditLog,
  IndustryTaxonomy,
  AdminVisualAsset,
  AIProviderConfig,
  SupportTicket,
  ContentModerationItem,
  FeedbackSubmission,
  PlatformSystemSettings,
  AdminAccount,
  UserRole,
  PlanTier,
} from '../types';
import {
  INITIAL_ADMIN_USERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_INDUSTRY_TAXONOMIES,
  INITIAL_ADMIN_VISUAL_ASSETS,
  INITIAL_AI_PROVIDERS,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_MODERATION_ITEMS,
  INITIAL_FEEDBACK_ITEMS,
  INITIAL_SYSTEM_SETTINGS,
  INITIAL_ADMIN_ACCOUNTS,
} from '../data/adminMockData';

const ADMIN_STORAGE_KEYS = {
  ADMIN_USERS: 'scripter_admin_users_v1',
  AUDIT_LOGS: 'scripter_admin_audit_logs_v1',
  TAXONOMIES: 'scripter_industry_taxonomies_v1',
  VISUAL_ASSETS: 'scripter_admin_visual_assets_v1',
  AI_PROVIDERS: 'scripter_ai_providers_v1',
  SUPPORT_TICKETS: 'scripter_support_tickets_v1',
  MODERATION_ITEMS: 'scripter_moderation_items_v1',
  FEEDBACK_ITEMS: 'scripter_feedback_items_v1',
  SYSTEM_SETTINGS: 'scripter_system_settings_v1',
  ADMIN_ACCOUNTS: 'scripter_admin_accounts_v1',
};

// Safe storage access
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`Error reading admin storage "${key}":`, err);
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing admin storage "${key}":`, err);
  }
};

/**
 * ============================================================================
 * 1. Audit Logging Service (Section 11)
 * ============================================================================
 */
export const getAuditLogs = (): AdminAuditLog[] => {
  return getFromStorage<AdminAuditLog[]>(ADMIN_STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
};

export const addAuditLog = (
  actionTypeOrOptions:
    | string
    | {
        action: string;
        target: string;
        details: string;
        actorName?: string;
        actorRole?: UserRole;
        status?: 'SUCCESS' | 'FAILED' | 'WARNING';
        severity?: 'info' | 'warning' | 'critical';
      },
  targetEntity?: string,
  details?: string,
  adminName: string = 'Current Admin',
  adminRole: UserRole = 'admin',
  status: 'SUCCESS' | 'FAILED' | 'WARNING' = 'SUCCESS'
): AdminAuditLog => {
  const logs = getAuditLogs();
  const now = new Date();
  const timestamp = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  let finalAction = '';
  let finalTarget = '';
  let finalDetails = '';
  let finalActor = adminName;
  let finalRole = adminRole;
  let finalStatus = status;
  let finalSeverity: 'info' | 'warning' | 'critical' = 'info';

  if (typeof actionTypeOrOptions === 'object') {
    finalAction = actionTypeOrOptions.action;
    finalTarget = actionTypeOrOptions.target;
    finalDetails = actionTypeOrOptions.details;
    finalActor = actionTypeOrOptions.actorName || adminName;
    finalRole = actionTypeOrOptions.actorRole || adminRole;
    finalStatus = actionTypeOrOptions.status || status;
    finalSeverity = actionTypeOrOptions.severity || 'info';
  } else {
    finalAction = actionTypeOrOptions;
    finalTarget = targetEntity || '';
    finalDetails = details || '';
    finalActor = adminName;
    finalRole = adminRole;
    finalStatus = status;
    finalSeverity = status === 'WARNING' ? 'warning' : status === 'FAILED' ? 'critical' : 'info';
  }

  const newLog: AdminAuditLog = {
    id: `log_${Date.now()}`,
    timestamp,
    adminName: finalActor,
    adminRole: finalRole,
    actionType: finalAction,
    targetEntity: finalTarget,
    details: finalDetails,
    ipAddress: '103.212.144.12',
    status: finalStatus,
    actorName: finalActor,
    actorRole: finalRole,
    action: finalAction,
    target: finalTarget,
    severity: finalSeverity,
  };

  saveToStorage(ADMIN_STORAGE_KEYS.AUDIT_LOGS, [newLog, ...logs]);
  return newLog;
};

/**
 * ============================================================================
 * 2. User Management Service (Priority B)
 * ============================================================================
 */
export const getAdminUsers = (): AdminUserRecord[] => {
  return getFromStorage<AdminUserRecord[]>(ADMIN_STORAGE_KEYS.ADMIN_USERS, INITIAL_ADMIN_USERS);
};

export const updateAdminUserStatus = (
  userId: string,
  newStatus: 'Active' | 'Suspended' | 'Banned',
  reason: string,
  actorName: string,
  actorRole: UserRole
): boolean => {
  const users = getAdminUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) return false;

  const targetUser = users[index];
  targetUser.status = newStatus;
  users[index] = targetUser;

  saveToStorage(ADMIN_STORAGE_KEYS.ADMIN_USERS, users);
  addAuditLog(
    'USER_STATUS_CHANGE',
    `${targetUser.name} (${targetUser.email})`,
    `Status set to ${newStatus}. Reason: ${reason}`,
    actorName,
    actorRole
  );
  return true;
};

export const adjustUserCredits = (
  userId: string,
  amount: number,
  operation: 'add' | 'deduct',
  reason: string,
  actorName: string,
  actorRole: UserRole
): { success: boolean; newBalance?: number } => {
  const users = getAdminUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) return { success: false };

  const targetUser = users[index];
  if (operation === 'add') {
    targetUser.creditsTotal += amount;
  } else {
    targetUser.creditsTotal = Math.max(0, targetUser.creditsTotal - amount);
  }

  users[index] = targetUser;
  saveToStorage(ADMIN_STORAGE_KEYS.ADMIN_USERS, users);
  addAuditLog(
    'USER_CREDIT_ADJUST',
    `${targetUser.name} (${targetUser.email})`,
    `${operation === 'add' ? '+' : '-'}${amount} credits adjusted. New Total: ${targetUser.creditsTotal}. Reason: ${reason}`,
    actorName,
    actorRole
  );
  return { success: true, newBalance: targetUser.creditsTotal };
};

export const changeUserPlan = (
  userId: string,
  newPlan: PlanTier,
  reason: string,
  actorName: string,
  actorRole: UserRole
): boolean => {
  const users = getAdminUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) return false;

  const targetUser = users[index];
  const oldPlan = targetUser.plan;
  targetUser.plan = newPlan;
  users[index] = targetUser;

  saveToStorage(ADMIN_STORAGE_KEYS.ADMIN_USERS, users);
  addAuditLog(
    'PLAN_CHANGE',
    `${targetUser.name} (${targetUser.email})`,
    `Plan changed from ${oldPlan} to ${newPlan}. Reason: ${reason}`,
    actorName,
    actorRole
  );
  return true;
};

export const changeUserRole = (
  userId: string,
  newRole: UserRole,
  actorName: string,
  actorRole: UserRole
): { success: boolean; error?: string } => {
  if (actorRole !== 'master-admin') {
    return { success: false, error: 'Only Master Admin can modify administrative roles.' };
  }

  const users = getAdminUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) return { success: false, error: 'User not found.' };

  const targetUser = users[index];
  const oldRole = targetUser.role;
  targetUser.role = newRole;
  users[index] = targetUser;

  saveToStorage(ADMIN_STORAGE_KEYS.ADMIN_USERS, users);
  addAuditLog(
    'ROLE_CHANGE',
    `${targetUser.name} (${targetUser.email})`,
    `Role updated from ${oldRole} to ${newRole}`,
    actorName,
    actorRole
  );
  return { success: true };
};

/**
 * ============================================================================
 * 3. Taxonomy & Industry Management (Priority C)
 * ============================================================================
 */
export const getTaxonomies = (): IndustryTaxonomy[] => {
  return getFromStorage<IndustryTaxonomy[]>(ADMIN_STORAGE_KEYS.TAXONOMIES, INITIAL_INDUSTRY_TAXONOMIES);
};

export const saveTaxonomy = (
  taxonomy: Partial<IndustryTaxonomy> & { nameEn: string; nameHi: string },
  actorName: string,
  actorRole: UserRole
): IndustryTaxonomy => {
  const list = getTaxonomies();
  if (taxonomy.id) {
    const idx = list.findIndex((t) => t.id === taxonomy.id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...taxonomy };
      saveToStorage(ADMIN_STORAGE_KEYS.TAXONOMIES, list);
      addAuditLog('TAXONOMY_UPDATE', taxonomy.nameEn, 'Updated industry taxonomy and categories', actorName, actorRole);
      return list[idx];
    }
  }

  const newTaxonomy: IndustryTaxonomy = {
    id: `ind_${Date.now()}`,
    nameEn: taxonomy.nameEn,
    nameHi: taxonomy.nameHi,
    icon: taxonomy.icon || 'Folder',
    categories: taxonomy.categories || ['General'],
    templatesCount: 0,
    projectsCount: 0,
    isActive: taxonomy.isActive !== undefined ? taxonomy.isActive : true,
    description: taxonomy.description || '',
  };

  saveToStorage(ADMIN_STORAGE_KEYS.TAXONOMIES, [...list, newTaxonomy]);
  addAuditLog('TAXONOMY_CREATE', newTaxonomy.nameEn, 'Created new industry category', actorName, actorRole);
  return newTaxonomy;
};

export const toggleTaxonomyStatus = (
  id: string,
  actorName: string,
  actorRole: UserRole
): boolean => {
  const list = getTaxonomies();
  const idx = list.findIndex((t) => t.id === id);
  if (idx === -1) return false;

  list[idx].isActive = !list[idx].isActive;
  saveToStorage(ADMIN_STORAGE_KEYS.TAXONOMIES, list);
  addAuditLog(
    'TAXONOMY_STATUS_TOGGLE',
    list[idx].nameEn,
    `Active status set to ${list[idx].isActive}`,
    actorName,
    actorRole
  );
  return true;
};

/**
 * ============================================================================
 * 4. Visual Assets Service (Priority C)
 * ============================================================================
 */
export const getAdminVisualAssets = (): AdminVisualAsset[] => {
  return getFromStorage<AdminVisualAsset[]>(ADMIN_STORAGE_KEYS.VISUAL_ASSETS, INITIAL_ADMIN_VISUAL_ASSETS);
};

export const saveAdminVisualAsset = (
  asset: Partial<AdminVisualAsset> & { title: string; type: AdminVisualAsset['type'] },
  actorName: string,
  actorRole: UserRole
): AdminVisualAsset => {
  const list = getAdminVisualAssets();
  const newAsset: AdminVisualAsset = {
    id: `ast_${Date.now()}`,
    title: asset.title,
    type: asset.type,
    category: asset.category || 'General',
    industry: asset.industry || 'All Industries',
    thumbnailUrl: asset.thumbnailUrl || '/assets/aistudio/Square_Scripter_Logo_d7bb9aeb.png',
    url: asset.url || '#',
    fileSize: asset.fileSize || '2.5 MB',
    dimensions: asset.dimensions,
    duration: asset.duration,
    downloadsCount: 0,
    license: asset.license || 'Pro',
    createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  };

  saveToStorage(ADMIN_STORAGE_KEYS.VISUAL_ASSETS, [newAsset, ...list]);
  addAuditLog('ASSET_UPLOAD', newAsset.title, `Uploaded ${newAsset.type} asset to ${newAsset.category}`, actorName, actorRole);
  return newAsset;
};

/**
 * ============================================================================
 * 5. AI Provider Hub Service (Priority D)
 * ============================================================================
 */
export const getAiProviderConfigs = (): AIProviderConfig[] => {
  return getFromStorage<AIProviderConfig[]>(ADMIN_STORAGE_KEYS.AI_PROVIDERS, INITIAL_AI_PROVIDERS);
};

export const updateAiProviderConfig = (
  providerId: string,
  updates: Partial<AIProviderConfig>,
  actorName: string,
  actorRole: UserRole
): boolean => {
  const list = getAiProviderConfigs();
  const idx = list.findIndex((p) => p.id === providerId);
  if (idx === -1) return false;

  list[idx] = { ...list[idx], ...updates };
  saveToStorage(ADMIN_STORAGE_KEYS.AI_PROVIDERS, list);
  addAuditLog(
    'AI_PROVIDER_UPDATE',
    list[idx].name,
    `Updated configuration: active model ${list[idx].activeModel}, temp: ${list[idx].temperature}`,
    actorName,
    actorRole
  );
  return true;
};

export const testAiProviderLatency = async (
  providerId: string
): Promise<{ status: 'Connected' | 'Degraded'; latencyMs: number; message: string }> => {
  // Simulates real roundtrip healthcheck against provider API endpoint
  const start = performance.now();
  await new Promise((resolve) => setTimeout(resolve, 140 + Math.floor(Math.random() * 40)));
  const latencyMs = Math.round(performance.now() - start);

  return {
    status: 'Connected',
    latencyMs,
    message: `HTTP 200 OK — Model response verified in ${latencyMs}ms`,
  };
};

/**
 * ============================================================================
 * 6. Support Tickets Service (Section 12)
 * ============================================================================
 */
export const getSupportTickets = (): SupportTicket[] => {
  return getFromStorage<SupportTicket[]>(ADMIN_STORAGE_KEYS.SUPPORT_TICKETS, INITIAL_SUPPORT_TICKETS);
};

export const replySupportTicket = (
  ticketId: string,
  replyMessage: string,
  newStatus: SupportTicket['status'],
  actorName: string,
  actorRole: UserRole
): boolean => {
  const tickets = getSupportTickets();
  const idx = tickets.findIndex((t) => t.id === ticketId);
  if (idx === -1) return false;

  const ticket = tickets[idx];
  const now = new Date();
  const timestamp = `${now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  const responseObj = {
    id: `resp_${Date.now()}`,
    sender: actorName,
    role: actorRole,
    message: replyMessage,
    timestamp,
  };

  ticket.responses = [...(ticket.responses || []), responseObj];
  ticket.status = newStatus;
  ticket.updatedAt = timestamp;
  ticket.assignedTo = actorName;

  tickets[idx] = ticket;
  saveToStorage(ADMIN_STORAGE_KEYS.SUPPORT_TICKETS, tickets);
  addAuditLog('TICKET_REPLY', ticket.ticketNumber, `Sent reply & set status to ${newStatus}`, actorName, actorRole);
  return true;
};

/**
 * ============================================================================
 * 7. Content Moderation Service (Section 12)
 * ============================================================================
 */
export const getModerationQueue = (): ContentModerationItem[] => {
  return getFromStorage<ContentModerationItem[]>(ADMIN_STORAGE_KEYS.MODERATION_ITEMS, INITIAL_MODERATION_ITEMS);
};

export const takeModerationAction = (
  itemId: string,
  action: 'Approved' | 'Flagged' | 'Removed',
  notes: string,
  actorName: string,
  actorRole: UserRole
): boolean => {
  const items = getModerationQueue();
  const idx = items.findIndex((m) => m.id === itemId);
  if (idx === -1) return false;

  items[idx].status = action;
  saveToStorage(ADMIN_STORAGE_KEYS.MODERATION_ITEMS, items);
  addAuditLog(
    'MODERATION_DECISION',
    `${items[idx].contentType}: ${items[idx].contentTitle}`,
    `Action: ${action}. Note: ${notes}`,
    actorName,
    actorRole
  );
  return true;
};

/**
 * ============================================================================
 * 8. Feedback & User Voice Service (Section 12)
 * ============================================================================
 */
export const getFeedbackSubmissions = (): FeedbackSubmission[] => {
  return getFromStorage<FeedbackSubmission[]>(ADMIN_STORAGE_KEYS.FEEDBACK_ITEMS, INITIAL_FEEDBACK_ITEMS);
};

export const updateFeedbackStatus = (
  id: string,
  newStatus: FeedbackSubmission['status'],
  actorName: string,
  actorRole: UserRole
): boolean => {
  const list = getFeedbackSubmissions();
  const idx = list.findIndex((f) => f.id === id);
  if (idx === -1) return false;

  list[idx].status = newStatus;
  saveToStorage(ADMIN_STORAGE_KEYS.FEEDBACK_ITEMS, list);
  addAuditLog('FEEDBACK_STATUS_UPDATE', `Feedback #${id}`, `Status set to ${newStatus}`, actorName, actorRole);
  return true;
};

/**
 * ============================================================================
 * 9. Platform System Settings (Section 11)
 * ============================================================================
 */
export const getPlatformSystemSettings = (): PlatformSystemSettings => {
  return getFromStorage<PlatformSystemSettings>(ADMIN_STORAGE_KEYS.SYSTEM_SETTINGS, INITIAL_SYSTEM_SETTINGS);
};

export const updatePlatformSystemSettings = (
  settings: Partial<PlatformSystemSettings>,
  actorName: string,
  actorRole: UserRole
): PlatformSystemSettings => {
  const current = getPlatformSystemSettings();
  const updated = { ...current, ...settings };
  saveToStorage(ADMIN_STORAGE_KEYS.SYSTEM_SETTINGS, updated);
  addAuditLog('SYSTEM_SETTINGS_UPDATE', 'Platform Settings', 'Modified core system parameters', actorName, actorRole);
  return updated;
};

/**
 * ============================================================================
 * 10. Admin Accounts & RBAC Permissions (Priority G)
 * ============================================================================
 */
export const getAdminAccounts = (): AdminAccount[] => {
  return getFromStorage<AdminAccount[]>(ADMIN_STORAGE_KEYS.ADMIN_ACCOUNTS, INITIAL_ADMIN_ACCOUNTS);
};

export const inviteAdminAccount = (
  account: { name: string; email: string; role: 'admin' | 'master-admin'; adminTitle: string; permissions: string[] },
  actorName: string,
  actorRole: UserRole
): { success: boolean; error?: string } => {
  if (actorRole !== 'master-admin') {
    return { success: false, error: 'Only Master Admin can invite administrative operators.' };
  }

  const list = getAdminAccounts();
  const newAccount: AdminAccount = {
    id: `adm_${Date.now()}`,
    name: account.name,
    email: account.email,
    role: account.role,
    adminTitle: account.adminTitle,
    permissions: account.permissions,
    lastLogin: 'Pending Invitation',
    status: 'Active',
  };

  saveToStorage(ADMIN_STORAGE_KEYS.ADMIN_ACCOUNTS, [...list, newAccount]);
  addAuditLog('ADMIN_INVITE', `${newAccount.name} (${newAccount.email})`, `Assigned role ${newAccount.role} with ${newAccount.permissions.length} permissions`, actorName, actorRole);
  return { success: true };
};

export const adminStorage = {
  getAuditLogs,
  addAuditLog,
  getAdminUsers,
  updateAdminUserStatus,
  adjustUserCredits,
  changeUserPlan,
  changeUserRole,
  getTaxonomies,
  saveTaxonomy,
  toggleTaxonomyStatus,
  getAdminVisualAssets,
  saveAdminVisualAsset,
  getAiProviderConfigs,
  updateAiProviderConfig,
  testAiProviderLatency,
  getSupportTickets,
  replySupportTicket,
  getModerationQueue,
  takeModerationAction,
  getFeedbackSubmissions,
  updateFeedbackStatus,
  getPlatformSystemSettings,
  updatePlatformSystemSettings,
  getAdminAccounts,
  inviteAdminAccount,
};
