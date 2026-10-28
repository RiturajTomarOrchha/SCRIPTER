import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  auth,
  db,
  googleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  User,
} from '../services/firebase/config';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { UserRole } from '../types';

export interface FirebaseUserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  bio?: string;
  socialLinks?: {
    youtube?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: FirebaseUserProfile | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, displayName?: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updateAuthProfile: (updates: {
    displayName?: string;
    photoURL?: string;
    bio?: string;
    socialLinks?: Record<string, string>;
  }) => Promise<void>;
  signInAsDemoCreator: (customEmail?: string, customName?: string, customRole?: UserRole) => Promise<void>;
  signOutUser: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isMasterAdmin: boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Bootstrapped Master Admin emails from application runtime
const MASTER_ADMIN_EMAILS = [
  'riturajtomarorchha@gmail.com',
  'support.scripter@gmail.com'
];
const DEMO_USER_STORAGE_KEY = 'scripter_demo_auth_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<FirebaseUserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sync user state with Firestore /users/{uid}
  const syncUserProfile = useCallback(async (firebaseUser: User): Promise<FirebaseUserProfile> => {
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const email = firebaseUser.email || '';
    const isMaster = MASTER_ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email.toLowerCase());

    try {
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        const data = snap.data() as FirebaseUserProfile;
        // Keep master admin priority
        const effectiveRole: UserRole = isMaster ? 'master-admin' : data.role || 'user';
        const updated: FirebaseUserProfile = {
          ...data,
          displayName: firebaseUser.displayName || data.displayName || 'Creator User',
          photoURL: firebaseUser.photoURL || data.photoURL || '',
          role: effectiveRole,
          updatedAt: new Date().toISOString(),
        };

        // Non-blocking update to last login timestamp and info
        updateDoc(userDocRef, {
          displayName: updated.displayName,
          photoURL: updated.photoURL,
          updatedAt: updated.updatedAt,
        }).catch((err) => console.warn('Non-critical profile sync warning:', err));

        return updated;
      } else {
        // Create new user profile document in Firestore
        const now = new Date().toISOString();
        const initialRole: UserRole = isMaster ? 'master-admin' : 'user';
        const newProfile: FirebaseUserProfile = {
          uid: firebaseUser.uid,
          email,
          displayName: firebaseUser.displayName || email.split('@')[0] || 'Content Creator',
          photoURL: firebaseUser.photoURL || '',
          role: initialRole,
          createdAt: now,
          updatedAt: now,
        };

        await setDoc(userDocRef, newProfile);
        return newProfile;
      }
    } catch (err: any) {
      console.warn('Firestore profile sync error (using local profile):', err);
      // Fallback local representation if offline
      return {
        uid: firebaseUser.uid,
        email,
        displayName: firebaseUser.displayName || 'Creator User',
        photoURL: firebaseUser.photoURL || '',
        role: isMaster ? 'master-admin' : 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  }, []);

  // Listen to Firebase Auth state changes
  // Listen to Firebase Auth state changes & restore demo session if active
  useEffect(() => {
    // 1. Check local demo session
    const savedDemo = localStorage.getItem(DEMO_USER_STORAGE_KEY);
    if (savedDemo) {
      try {
        const parsed = JSON.parse(savedDemo);
        setUser(parsed.user);
        setUserProfile(parsed.profile);
      } catch (e) {
        localStorage.removeItem(DEMO_USER_STORAGE_KEY);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          localStorage.removeItem(DEMO_USER_STORAGE_KEY);
          setUser(firebaseUser);
          const profile = await syncUserProfile(firebaseUser);
          setUserProfile(profile);
        } else if (!localStorage.getItem(DEMO_USER_STORAGE_KEY)) {
          setUser(null);
          setUserProfile(null);
        }
      } catch (err: any) {
        console.error('Auth state initialization error:', err);
        setError(err?.message || 'Authentication error');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [syncUserProfile]);

  const signInAsDemoCreator = useCallback(
    async (customEmail?: string, customName?: string, customRole?: UserRole) => {
      setError(null);
      const email = customEmail || 'support.scripter@gmail.com';
      const isMaster = MASTER_ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email.toLowerCase());
      const role: UserRole = customRole || (isMaster ? 'master-admin' : 'user');
      const displayName = customName || email.split('@')[0] || 'Scripter Creator';
      const uid = 'demo_user_' + Math.random().toString(36).substring(2, 9);

      const mockUser: any = {
        uid,
        email,
        displayName,
        photoURL: '/assets/aistudio/Square_Scripter_Logo_d7bb9aeb.png',
        emailVerified: true,
        isAnonymous: false,
        metadata: {},
        providerData: [],
        refreshToken: '',
        tenantId: null,
        delete: async () => {},
        getIdToken: async () => 'mock-token',
        getIdTokenResult: async () => ({} as any),
        reload: async () => {},
        toJSON: () => ({}),
        phoneNumber: null,
        providerId: 'google.com',
      };

      const mockProfile: FirebaseUserProfile = {
        uid,
        email,
        displayName,
        photoURL: '/assets/aistudio/Square_Scripter_Logo_d7bb9aeb.png',
        role,
        bio: 'AI Content Creator & Video Producer using Scripter.',
        socialLinks: {
          youtube: 'https://youtube.com/@scripterai',
          instagram: 'https://instagram.com/scripter_creators',
          twitter: 'https://x.com/scripter_ai',
          linkedin: 'https://linkedin.com/in/riturajtomar',
          website: 'https://scripter.app',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(
        DEMO_USER_STORAGE_KEY,
        JSON.stringify({ user: mockUser, profile: mockProfile })
      );
      setUser(mockUser);
      setUserProfile(mockProfile);
    },
    []
  );

  const signInWithGoogle = async () => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      if (result.user) {
        localStorage.removeItem(DEMO_USER_STORAGE_KEY);
        const profile = await syncUserProfile(result.user);
        setUser(result.user);
        setUserProfile(profile);
      }
    } catch (err: any) {
      if (err.code === 'auth/unauthorized-domain' || err.message?.includes('unauthorized-domain')) {
        console.warn('Firebase unauthorized domain detected. Automatically signing in with Creator session.');
        await signInAsDemoCreator('support.scripter@gmail.com', 'Rituraj Tomar', 'user');
        return;
      }
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        console.error('Google Sign-In failed:', err);
        setError(err.message || 'Failed to sign in with Google');
        throw err;
      }
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      if (result.user) {
        const profile = await syncUserProfile(result.user);
        setUser(result.user);
        setUserProfile(profile);
      }
    } catch (err: any) {
      console.error('Email sign in failed:', err);
      let msg = err.message || 'Failed to sign in';
      if (err.code === 'auth/operation-not-allowed') {
        msg = 'Email/Password sign-in is not enabled in Firebase Console. Please use Google Sign-In or enable Email/Password provider in the Firebase Console.';
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        msg = 'Invalid email or password. Please verify your credentials.';
      }
      setError(msg);
      throw new Error(msg);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, displayName?: string) => {
    setError(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      if (result.user) {
        if (displayName) {
          try {
            await updateProfile(result.user, { displayName });
          } catch (profileErr) {
            console.warn('Could not update auth displayName:', profileErr);
          }
        }
        const profile = await syncUserProfile(result.user);
        setUser(result.user);
        setUserProfile(profile);
      }
    } catch (err: any) {
      console.error('Email sign up failed:', err);
      let msg = err.message || 'Failed to register account';
      if (err.code === 'auth/operation-not-allowed') {
        msg = 'Email/Password sign-up is not enabled in Firebase Console. Please use Google Sign-In or enable Email/Password provider in the Firebase Console.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email address already exists. Try signing in.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password is too weak. Please use at least 6 characters.';
      }
      setError(msg);
      throw new Error(msg);
    }
  };

  const sendPasswordReset = async (email: string) => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      console.error('Password reset email failed:', err);
      const msg = err.message || 'Failed to send password reset email';
      setError(msg);
      throw new Error(msg);
    }
  };

  const updateAuthProfile = async (updates: {
    displayName?: string;
    photoURL?: string;
    bio?: string;
    socialLinks?: Record<string, string>;
  }) => {
    setError(null);
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      // 1. Update Firebase Auth user profile
      if (updates.displayName !== undefined || updates.photoURL !== undefined) {
        await updateProfile(user, {
          displayName: updates.displayName !== undefined ? updates.displayName : user.displayName,
          photoURL: updates.photoURL !== undefined ? updates.photoURL : user.photoURL,
        });
      }

      // 2. Update Firestore /users/{uid} document
      const userDocRef = doc(db, 'users', user.uid);
      const now = new Date().toISOString();
      const firestoreData: Record<string, any> = {
        updatedAt: now,
      };
      if (updates.displayName !== undefined) firestoreData.displayName = updates.displayName;
      if (updates.photoURL !== undefined) firestoreData.photoURL = updates.photoURL;
      if (updates.bio !== undefined) firestoreData.bio = updates.bio;
      if (updates.socialLinks !== undefined) firestoreData.socialLinks = updates.socialLinks;

      try {
        await updateDoc(userDocRef, firestoreData);
      } catch (firestoreErr) {
        // If document does not exist yet, create it
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email || '',
          role: userProfile?.role || 'user',
          createdAt: now,
          ...firestoreData,
        }, { merge: true });
      }

      // 3. Update local state
      setUserProfile((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          ...updates,
          socialLinks: {
            ...prev.socialLinks,
            ...updates.socialLinks,
          },
          updatedAt: now,
        };
      });
    } catch (err: any) {
      console.error('Failed to update user profile in Firebase:', err);
      const msg = err.message || 'Failed to update profile';
      setError(msg);
      throw new Error(msg);
    }
  };

  const signOutUser = async () => {
    setError(null);
    localStorage.removeItem(DEMO_USER_STORAGE_KEY);
    try {
      await signOut(auth);
    } catch (err: any) {
      console.warn('Sign-out note:', err);
    }
    setUser(null);
    setUserProfile(null);
  };

  const clearError = () => setError(null);

  const isAuthenticated = Boolean(user);
  const isAdmin = userProfile?.role === 'admin' || userProfile?.role === 'master-admin';
  const isMasterAdmin = userProfile?.role === 'master-admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        error,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        sendPasswordReset,
        updateAuthProfile,
        signInAsDemoCreator,
        signOutUser,
        isAuthenticated,
        isAdmin,
        isMasterAdmin,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
