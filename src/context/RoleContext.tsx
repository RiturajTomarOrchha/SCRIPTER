import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BusinessProfile, UserRole } from '../types';
import {
  getStoredActiveProfileId,
  getStoredBusinessProfiles,
  saveBusinessProfile,
  deleteBusinessProfile,
  setStoredActiveProfileId,
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
  creditsTotal: number;
  creditsUsed: number;
  useCredits: (amount: number) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [role, setRoleState] = useState<UserRole>('user');
  const [isDevMode, setIsDevMode] = useState<boolean>(true);
  
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

  const [creditsTotal] = useState<number>(1000);
  const [creditsUsed, setCreditsUsed] = useState<number>(() => {
    const stored = localStorage.getItem('scripter_credits_used');
    return stored ? parseInt(stored, 10) : 850;
  });

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

  const useCredits = (amount: number) => {
    setCreditsUsed((prev) => {
      const next = Math.min(creditsTotal, prev + amount);
      localStorage.setItem('scripter_credits_used', next.toString());
      return next;
    });
  };

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
        creditsTotal,
        creditsUsed,
        useCredits,
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
