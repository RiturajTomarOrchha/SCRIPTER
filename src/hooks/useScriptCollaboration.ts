import { useState, useEffect, useRef, useCallback } from 'react';
import {
  initScriptSession,
  syncScriptUpdate,
  updatePresence,
  removePresence,
  subscribeToScript,
  subscribeToPresence,
  CollaboratorPresence,
  ScriptSessionData,
} from '../services/firebase/collaborationService';
import { auth } from '../services/firebase/config';

interface UseScriptCollaborationOptions {
  scriptId: string;
  topic: string;
  hook: string;
  mainBody: string;
  closingCta: string;
  screenplayText: string;
  onRemoteContentChange: (data: {
    hook?: string;
    mainBody?: string;
    closingCta?: string;
    screenplayText?: string;
    lastEditorName?: string;
  }) => void;
}

export const useScriptCollaboration = ({
  scriptId,
  topic,
  hook,
  mainBody,
  closingCta,
  screenplayText,
  onRemoteContentChange,
}: UseScriptCollaborationOptions) => {
  const [collaborators, setCollaborators] = useState<CollaboratorPresence[]>([]);
  const [currentSection, setCurrentSection] = useState<'hook' | 'mainBody' | 'closingCta' | 'screenplay' | 'idle'>('idle');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastRemoteEditor, setLastRemoteEditor] = useState<string | null>(null);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLocalUpdateRef = useRef<boolean>(false);

  // Sync active section presence
  const handleSectionFocus = useCallback(
    (section: 'hook' | 'mainBody' | 'closingCta' | 'screenplay') => {
      setCurrentSection(section);
      if (scriptId) {
        updatePresence(scriptId, section);
      }
    },
    [scriptId]
  );

  const handleSectionBlur = useCallback(() => {
    setCurrentSection('idle');
    if (scriptId) {
      updatePresence(scriptId, 'idle');
    }
  }, [scriptId]);

  // Push local updates to Firestore with 400ms debounce
  const pushLocalChange = useCallback(
    (updates: {
      hook?: string;
      mainBody?: string;
      closingCta?: string;
      screenplayText?: string;
      title?: string;
    }) => {
      if (!scriptId) return;
      isLocalUpdateRef.current = true;
      setIsSyncing(true);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(async () => {
        try {
          await syncScriptUpdate(scriptId, updates);
        } finally {
          setIsSyncing(false);
          // Allow remote updates again after short interval
          setTimeout(() => {
            isLocalUpdateRef.current = false;
          }, 300);
        }
      }, 400);
    },
    [scriptId]
  );

  // Initialize session and attach real-time listeners
  useEffect(() => {
    if (!scriptId) return;

    let unsubScript: (() => void) | null = null;
    let unsubPresence: (() => void) | null = null;
    let heartbeatInterval: NodeJS.Timeout | null = null;

    const setup = async () => {
      try {
        await initScriptSession(scriptId, {
          title: topic,
          hook,
          mainBody,
          closingCta,
          screenplayText,
        });

        setIsConnected(true);

        // Presence heartbeat
        updatePresence(scriptId, 'idle');
        heartbeatInterval = setInterval(() => {
          updatePresence(scriptId, currentSection);
        }, 15000);

        // Real-time script listener
        unsubScript = subscribeToScript(scriptId, (remoteData) => {
          const currentUserId = auth.currentUser?.uid;
          // If update was made by another collaborator, apply it
          if (remoteData.lastUpdatedBy !== currentUserId) {
            setLastRemoteEditor(remoteData.lastUpdatedByName || 'Team Collaborator');
            onRemoteContentChange({
              hook: remoteData.hook,
              mainBody: remoteData.mainBody,
              closingCta: remoteData.closingCta,
              screenplayText: remoteData.screenplayText,
              lastEditorName: remoteData.lastUpdatedByName,
            });
          }
        });

        // Real-time presence listener
        unsubPresence = subscribeToPresence(scriptId, (presenceList) => {
          setCollaborators(presenceList);
        });
      } catch (err) {
        console.warn('Live collaboration initialization notice:', err);
      }
    };

    setup();

    return () => {
      if (unsubScript) unsubScript();
      if (unsubPresence) unsubPresence();
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      removePresence(scriptId);
    };
  }, [scriptId]);

  // Other collaborators (excluding self)
  const otherCollaborators = collaborators.filter(
    (c) => c.userId !== auth.currentUser?.uid
  );

  // Map collaborators to their active sections
  const presenceBySection = {
    hook: otherCollaborators.filter((c) => c.activeSection === 'hook'),
    mainBody: otherCollaborators.filter((c) => c.activeSection === 'mainBody'),
    closingCta: otherCollaborators.filter((c) => c.activeSection === 'closingCta'),
    screenplay: otherCollaborators.filter((c) => c.activeSection === 'screenplay'),
  };

  return {
    collaborators,
    otherCollaborators,
    presenceBySection,
    currentSection,
    isSyncing,
    isConnected,
    lastRemoteEditor,
    handleSectionFocus,
    handleSectionBlur,
    pushLocalChange,
  };
};
