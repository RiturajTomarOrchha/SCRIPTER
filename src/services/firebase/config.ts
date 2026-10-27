/**
 * Scripter Firebase Configuration & Service Layer
 * 
 * Provides safe initialization for Firebase Authentication & Cloud Firestore.
 * If credentials are not present in environment variables, the app runs gracefully
 * in clearly labeled Development / Demo mode.
 */

export interface FirebaseStatus {
  isConfigured: boolean;
  statusText: string;
  projectId?: string;
  authProvider: 'Google' | 'None';
  mode: 'production' | 'demo';
}

const firebaseEnv = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if actual configuration has been provided (not placeholders)
export const isFirebaseConfigured = (): boolean => {
  return Boolean(
    firebaseEnv.apiKey &&
    firebaseEnv.apiKey !== 'YOUR_FIREBASE_API_KEY' &&
    firebaseEnv.projectId &&
    firebaseEnv.projectId !== 'YOUR_PROJECT_ID'
  );
};

export const getFirebaseStatus = (): FirebaseStatus => {
  const configured = isFirebaseConfigured();
  if (configured) {
    return {
      isConfigured: true,
      statusText: 'Firebase Initialized & Connected',
      projectId: firebaseEnv.projectId,
      authProvider: 'Google',
      mode: 'production',
    };
  }

  return {
    isConfigured: false,
    statusText: 'Demo Mode (No Firebase Credentials in .env)',
    authProvider: 'Google',
    mode: 'demo',
  };
};

/**
 * Extensible structure for future Firebase Auth user representation
 */
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
  role: 'user' | 'admin' | 'master-admin';
}
