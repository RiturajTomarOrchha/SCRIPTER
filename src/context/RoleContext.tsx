import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { BusinessProfile, UserRole } from '../types';
import { DEMO_BUSINESS_PROFILES } from '../data/mockData';

interface RoleContextType {
  role: UserRole;
  setRole: (newRole: UserRole) => void;
  isDevMode: boolean;
  setIsDevMode: (active: boolean) => void;
  activeBusinessProfile: BusinessProfile;
  setActiveBusinessProfile: (profile: BusinessProfile) => void;
  businessProfiles: BusinessProfile[];
  creditsTotal: number;
  creditsUsed: number;
  useCredits: (amount: number) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [role, setRoleState] = useState<UserRole>('user');
  const [isDevMode, setIsDevMode] = useState<boolean>(true);
  const [businessProfiles] = useState<BusinessProfile[]>(DEMO_BUSINESS_PROFILES);
  const [activeBusinessProfile, setActiveBusinessProfile] = useState<BusinessProfile>(
    DEMO_BUSINESS_PROFILES[0] // Health & Wellness (User choice from Phase 1)
  );
  const [creditsTotal] = useState<number>(1000);
  const [creditsUsed, setCreditsUsed] = useState<number>(850);

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
    setCreditsUsed((prev) => Math.min(creditsTotal, prev + amount));
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
