import {
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  deleteDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './config';

export interface ScriptSessionData {
  id?: string;
  title: string;
  hook: string;
  mainBody: string;
  closingCta: string;
  screenplayText?: string;
  lastUpdatedBy: string;
  lastUpdatedByName: string;
  updatedAt: string;
  createdAt?: string;
}

export interface CollaboratorPresence {
  userId: string;
  displayName: string;
  photoURL?: string;
  activeSection: 'hook' | 'mainBody' | 'closingCta' | 'screenplay' | 'idle';
  color: string;
  lastSeen: string;
}

const COLLABORATOR_COLORS = [
  '#2563EB', // Blue
  '#E11D48', // Rose
  '#059669', // Emerald
  '#D97706', // Amber
  '#7C3AED', // Violet
  '#0891B2', // Cyan
];

export const getCollaboratorColor = (userId: string): string => {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLLABORATOR_COLORS.length;
  return COLLABORATOR_COLORS[index];
};

/**
 * Initializes or fetches a collaborative script session
 */
export const initScriptSession = async (
  scriptId: string,
  initialData: Partial<ScriptSessionData>
): Promise<ScriptSessionData> => {
  const path = `scripts/${scriptId}`;
  try {
    const docRef = doc(db, 'scripts', scriptId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      return snap.data() as ScriptSessionData;
    }

    const currentUserId = auth.currentUser?.uid || 'anonymous_creator';
    const currentName = auth.currentUser?.displayName || 'Anonymous Creator';

    const newSession: ScriptSessionData = {
      id: scriptId,
      title: initialData.title || 'Untitled Script',
      hook: initialData.hook || '',
      mainBody: initialData.mainBody || '',
      closingCta: initialData.closingCta || '',
      screenplayText: initialData.screenplayText || '',
      lastUpdatedBy: currentUserId,
      lastUpdatedByName: currentName,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    if (auth.currentUser) {
      await setDoc(docRef, newSession);
    }
    return newSession;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
};

/**
 * Updates collaborative script content with debounce/save
 */
export const syncScriptUpdate = async (
  scriptId: string,
  data: Partial<ScriptSessionData>
): Promise<void> => {
  if (!auth.currentUser) return;
  const path = `scripts/${scriptId}`;
  try {
    const docRef = doc(db, 'scripts', scriptId);
    const payload: Partial<ScriptSessionData> = {
      ...data,
      lastUpdatedBy: auth.currentUser.uid,
      lastUpdatedByName: auth.currentUser.displayName || auth.currentUser.email?.split('@')[0] || 'Team Collaborator',
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

/**
 * Publishes user presence heartbeat in a script session
 */
export const updatePresence = async (
  scriptId: string,
  activeSection: 'hook' | 'mainBody' | 'closingCta' | 'screenplay' | 'idle'
): Promise<void> => {
  if (!auth.currentUser) return;
  const userId = auth.currentUser.uid;
  const path = `scripts/${scriptId}/presence/${userId}`;
  try {
    const presenceRef = doc(db, 'scripts', scriptId, 'presence', userId);
    const presenceData: CollaboratorPresence = {
      userId,
      displayName: auth.currentUser.displayName || auth.currentUser.email?.split('@')[0] || 'Creator',
      photoURL: auth.currentUser.photoURL || undefined,
      activeSection,
      color: getCollaboratorColor(userId),
      lastSeen: new Date().toISOString(),
    };
    await setDoc(presenceRef, presenceData, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

/**
 * Clears user presence when leaving
 */
export const removePresence = async (scriptId: string): Promise<void> => {
  if (!auth.currentUser) return;
  const userId = auth.currentUser.uid;
  const path = `scripts/${scriptId}/presence/${userId}`;
  try {
    const presenceRef = doc(db, 'scripts', scriptId, 'presence', userId);
    await deleteDoc(presenceRef);
  } catch (error) {
    // Non-blocking cleanup
    console.warn('Presence cleanup notice:', error);
  }
};

/**
 * Subscribes to real-time script changes
 */
export const subscribeToScript = (
  scriptId: string,
  onUpdate: (data: ScriptSessionData) => void
): (() => void) => {
  const path = `scripts/${scriptId}`;
  const docRef = doc(db, 'scripts', scriptId);

  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data() as ScriptSessionData);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
};

/**
 * Subscribes to real-time collaborator presences
 */
export const subscribeToPresence = (
  scriptId: string,
  onUpdate: (presences: CollaboratorPresence[]) => void
): (() => void) => {
  const path = `scripts/${scriptId}/presence`;
  const presencesRef = collection(db, 'scripts', scriptId, 'presence');

  return onSnapshot(
    presencesRef,
    (snapshot) => {
      const now = Date.now();
      const list: CollaboratorPresence[] = [];

      snapshot.forEach((docSnap) => {
        const item = docSnap.data() as CollaboratorPresence;
        // Keep only presences updated in the last 45 seconds (active)
        const lastSeenTime = new Date(item.lastSeen).getTime();
        if (now - lastSeenTime < 45000) {
          list.push(item);
        }
      });

      onUpdate(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
};
