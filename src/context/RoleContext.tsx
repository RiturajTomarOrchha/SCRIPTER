import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BusinessProfile,
  UserRole,
  UserProfile,
  UserSubscription,
  CreditBalanceInfo,
  CreditOperationType,
  AppNotification,
  PlanTier,
} from '../types';
import {
  getStoredActiveProfileId,
  getStoredBusinessProfiles,
  saveBusinessProfile,
  deleteBusinessProfile,
  setStoredActiveProfileId,
  getUserProfile as getStoredUserProfile,
  saveUserProfile as saveStoredUserProfile,
  getUserSubscription as getStoredUserSubscription,
  updateUserSubscription as updateStoredUserSubscription,
  getCreditBalanceInfo as getStoredCreditBalanceInfo,
  recordCreditUsage,
  addPurchasedCredits,
  getStoredNotifications,
  markNotificationRead as markStoredNotificationRead,
  markAllNotificationsRead as markAllStoredNotificationsRead,
  deleteNotification as deleteStoredNotification,
} from '../services/storage';

interface RoleContextType {
  role: UserRole;
  setRole: (newRole: UserRole) => void;
  isDevMode: boolean;
  setIsDevMode: (active: boolean) => void;
  activeBusinessProfile: BusinessProfile;
  setActiveBusinessProfile: (profile: BusinessProfile) => void;
  businessProfiles: BusinessProfile[];
  addBusinessProfile: (profile: Partial<BusinessProfile> & { name: string }) => BusinessProfile;
  updateBusinessProfile: (profile: BusinessProfile) => void;
  removeBusinessProfile: (id: string) => boolean;
  // Phase 5: User Profile & Subscription
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  subscription: UserSubscription;
  updateSubscription: (planIdOrData: PlanTier | Partial<UserSubscription>, billingCycle?: 'monthly' | 'yearly') => void;
  // Phase 5: Credits & Auditable Ledger
  creditsInfo: CreditBalanceInfo;
  creditsTotal: number;
  creditsUsed: number;
  availableCredits: number;
  useCredits: (amount: number) => void;
  deductCredits: (
    amount: number,
    operationType: CreditOperationType,
    description: string,
    projectId?: string | { businessProfileName?: string },
    projectTitle?: string
  ) => { success: boolean; remaining: number; error?: string };
  buyCredits: (credits: number, priceInr: number, orderId?: string) => void;
  // Phase 5: Notifications Center
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  refreshState: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [role, setRoleState] = useState<UserRole>('user');
  const [isDevMode, setIsDevModeState] = useState<boolean>(() => {
    return import.meta.env.DEV || localStorage.getItem('scripter_dev_mode') === 'true';
  });

  const setIsDevMode = (active: boolean) => {
    setIsDevModeState(active);
    try {
      localStorage.setItem('scripter_dev_mode', String(active));
    } catch (e) {
      // ignore
    }
  };

  // Persistent profiles state
  const [businessProfiles, setBusinessProfiles] = useState<BusinessProfile[]>(() => {
    return getStoredBusinessProfiles();
  });

  const [activeBusinessProfile, setActiveBusinessProfileState] = useState<BusinessProfile>(() => {
    const profiles = getStoredBusinessProfiles();
    const activeId = getStoredActiveProfileId();
    const found = profiles.find((p) => p.id === activeId);
    return found || profiles[0];
  });

  // Phase 5: User Profile State
  const [userProfile, setUserProfileState] = useState<UserProfile>(() => getStoredUserProfile());

  // Phase 5: Subscription State
  const [subscription, setSubscriptionState] = useState<UserSubscription>(() => getStoredUserSubscription());

  // Phase 5: Credits State
  const [creditsInfo, setCreditsInfoState] = useState<CreditBalanceInfo>(() => getStoredCreditBalanceInfo());

  // Phase 5: Notifications State
  const [notifications, setNotificationsState] = useState<AppNotification[]>(() => getStoredNotifications());

  const refreshState = useCallback(() => {
    setUserProfileState(getStoredUserProfile());
    setSubscriptionState(getStoredUserSubscription());
    setCreditsInfoState(getStoredCreditBalanceInfo());
    setNotificationsState(getStoredNotifications());
  }, []);

  const setActiveBusinessProfile = (profile: BusinessProfile) => {
    setActiveBusinessProfileState(profile);
    setStoredActiveProfileId(profile.id);
  };

  const addBusinessProfile = (profileData: Partial<BusinessProfile> & { name: string }): BusinessProfile => {
    const created = saveBusinessProfile(profileData);
    const updated = getStoredBusinessProfiles();
    setBusinessProfiles(updated);
    setActiveBusinessProfile(created);
    return created;
  };

  const updateBusinessProfile = (profile: BusinessProfile) => {
    saveBusinessProfile(profile);
    const updated = getStoredBusinessProfiles();
    setBusinessProfiles(updated);
    if (activeBusinessProfile.id === profile.id) {
      setActiveBusinessProfileState(profile);
    }
  };

  const removeBusinessProfile = (id: string): boolean => {
    const success = deleteBusinessProfile(id);
    if (success) {
      const updated = getStoredBusinessProfiles();
      setBusinessProfiles(updated);
      if (activeBusinessProfile.id === id && updated.length > 0) {
        setActiveBusinessProfile(updated[0]);
      }
      return true;
    }
    return false;
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === 'user') {
      navigate('/user/home');
    } else if (newRole === 'admin') {
      navigate('/admin/dashboard');
    } else if (newRole === 'master-admin') {
      navigate('/master-admin/dashboard');
    }
  };

  const updateUserProfile = (profileData: Partial<UserProfile>) => {
    const updated = saveStoredUserProfile(profileData);
    setUserProfileState(updated);
  };

  const updateSubscription = (
    planIdOrData: PlanTier | Partial<UserSubscription>,
    billingCycle: 'monthly' | 'yearly' = 'monthly'
  ) => {
    const updated = updateStoredUserSubscription(planIdOrData, billingCycle);
    setSubscriptionState(updated);
    refreshState();
  };

  const deductCredits = (
    amount: number,
    operationType: CreditOperationType,
    description: string,
    projectId?: string | { businessProfileName?: string },
    projectTitle?: string
  ) => {
    const result = recordCreditUsage(amount, operationType, description, projectId, projectTitle);
    if (result.success) {
      refreshState();
    }
    return result;
  };

  const useCredits = (amount: number) => {
    deductCredits(amount, 'script_generation', `AI generation (${amount} credits)`);
  };

  const buyCredits = (credits: number, priceInr: number, orderId?: string) => {
    addPurchasedCredits(credits, priceInr, orderId || `ORD_${Date.now()}`);
    refreshState();
  };

  const markNotificationRead = (id: string) => {
    const updated = markStoredNotificationRead(id);
    setNotificationsState(updated);
  };

  const markAllNotificationsRead = () => {
    const updated = markAllStoredNotificationsRead();
    setNotificationsState(updated);
  };

  const deleteNotification = (id: string) => {
    const updated = deleteStoredNotification(id);
    setNotificationsState(updated);
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        isDevMode,
        setIsDevMode,
        activeBusinessProfile,
        setActiveBusinessProfile,
        businessProfiles,
        addBusinessProfile,
        updateBusinessProfile,
        removeBusinessProfile,
        userProfile,
        updateUserProfile,
        subscription,
        updateSubscription,
        creditsInfo,
        creditsTotal: creditsInfo.totalAvailable,
        creditsUsed: creditsInfo.creditsUsed,
        availableCredits: creditsInfo.remainingCredits,
        useCredits,
        deductCredits,
        buyCredits,
        notifications,
        unreadNotificationsCount,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        refreshState,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
