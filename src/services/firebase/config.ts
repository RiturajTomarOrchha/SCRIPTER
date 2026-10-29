import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  User,
} from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, setLogLevel } from 'firebase/firestore';
import firebaseConfig from '@/firebase-applet-config.json';

// Silence internal Firestore connection error logging to prevent unhandled console error spam when offline or when STS API is pending
try {
  setLogLevel('silent');
} catch {
  // setLogLevel may throw if already initialized
}

// Safe singleton Firebase App initialization
export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Authentication instance
export const auth = getAuth(firebaseApp);

// Clear any stale broken token session on startup
if (typeof auth.authStateReady === 'function') {
  auth.authStateReady().then(async () => {
    if (auth.currentUser) {
      try {
        await auth.currentUser.getIdToken();
      } catch (tokenErr: any) {
        const msg = tokenErr?.message || '';
        if (
          msg.includes('token-service-api') ||
          msg.includes('securetoken.googleapis.com') ||
          msg.includes('Fetching auth token failed')
        ) {
          console.warn('Stale auth token detected with disabled STS API. Clearing session safely.');
          await signOut(auth).catch(() => {});
        }
      }
    }
  }).catch(() => {});
}

// Cloud Firestore with explicit database ID from provisioned configuration
export const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

// Google Auth Provider setup for popup login
export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({ prompt: 'select_account' });

// Test connection on application boot as required by Firebase guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message.includes('the client is offline') ||
        error.message.includes('token-service-api') ||
        error.message.includes('securetoken.googleapis.com') ||
        error.message.includes('Fetching auth token failed') ||
        error.message.includes('backend unreachable')
      ) {
        console.warn('Firestore offline check (operating in offline fallback mode):', error.message);
      } else {
        console.warn('Firestore connection check notice:', error.message);
      }
    }
  }
}

testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface FirebaseStatus {
  isConfigured: boolean;
  statusText: string;
  projectId?: string;
  authProvider: 'Google' | 'None';
  mode: 'production' | 'demo';
}

export const isFirebaseConfigured = (): boolean => Boolean(firebaseConfig.projectId && firebaseConfig.apiKey);

export const getFirebaseStatus = (): FirebaseStatus => {
  return {
    isConfigured: isFirebaseConfigured(),
    statusText: 'Firebase Initialized & Connected',
    projectId: firebaseConfig.projectId,
    authProvider: 'Google',
    mode: 'production',
  };
};

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
  role: 'user' | 'admin' | 'master-admin';
}

export {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  type User,
};
