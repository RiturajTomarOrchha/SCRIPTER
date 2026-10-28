import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useRole } from '../../context/RoleContext';
import { Project, ProjectMedia, ScriptVersion } from '../../types';
import { getProjects, attachMediaToProject, saveProject } from '../../services/storage';
import {
  Video,
  Play,
  Pause,
  RotateCcw,
  Camera,
  CameraOff,
  Mic,
  MicOff,
  SwitchCamera,
  Download,
  ArrowLeft,
  Settings,
  ChevronDown,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Layers,
  FileText,
  Save,
  Maximize2,
  Minimize2,
  Film,
  X,
  Volume2,
  VolumeX,
  Sliders,
  Type,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle,
  Smartphone,
  Monitor,
  ChevronRight,
  Check,
  Trash2,
  FlipHorizontal,
} from 'lucide-react';

interface TeleprompterPageProps {
  defaultMode?: 'prompter' | 'record';
}

export const TeleprompterPage: React.FC<TeleprompterPageProps> = ({ defaultMode = 'prompter' }) => {
  const { language } = useLanguage();
  const { activeBusinessProfile } = useRole();
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation state passed from Projects, Ideas, or Script Studio
  const navState = (location.state || {}) as {
    projectId?: string;
    scriptText?: string;
    title?: string;
    version?: number;
  };

  // 1. Projects & Script State Management
  const [projects, setProjects] = useState<Project[]>(() => getProjects());
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    navState.projectId || (projects[0]?.id || '')
  );

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  // Helper to construct script text from project versions or fallback
  const getScriptFromVersion = (versionIndex: number): string => {
    if (selectedProject?.scriptVersions && selectedProject.scriptVersions.length > versionIndex) {
      const v = selectedProject.scriptVersions[versionIndex];
      const parts = [v.hook, ...(v.mainContent || []), v.closing].filter(Boolean);
      return parts.join('\n\n');
    }
    return selectedProject?.scriptSnippet || (
      language === 'hi'
        ? 'क्या आपका भी बिजली का बिल हर महीने बढ़ता जा रहा है?\n\nतो इसके लिए एक बढ़िया समाधान है - सोलर पैनल। सोलर पैनल सूरज की रोशनी से बिजली बनाता है, जिससे आप अपने घर या ऑफिस की ज़रूरत का बड़ा हिस्सा खुद ही पूरा कर सकते हैं। इसकी लागत पहले जैसी नहीं रही, क्योंकि सरकार की सब्सिडी और कई योजनाओं से यह अब अधिक किफायती हो गया है।\n\nअगर आप भी बिजली बिल में लंबे समय तक बचत करना चाहते हैं, तो आज ही सोलर पैनल के विकल्पों के बारे में जानकारी लें और अपने घर के लिए सही सिस्टम चुनें। चैनल को फॉलो करें!'
        : 'Are you tired of paying rising electricity bills every single month?\n\nHere is the ideal solution: Rooftop Solar Panels. Solar generates free green electricity from sunlight, covering up to 90% of your power needs with government subsidies under PM Surya Ghar Yojana.\n\nTake the first step toward energy independence today. Calculate your roof savings and subscribe for more creator guides!'
    );
  };

  const [selectedVersionIdx, setSelectedVersionIdx] = useState<number>(0);
  const [scriptContent, setScriptContent] = useState<string>(() => {
    if (navState.scriptText) return navState.scriptText;
    return getScriptFromVersion(0);
  });
  const [initialScriptSnapshot, setInitialScriptSnapshot] = useState<string>(scriptContent);
  const [isEditingScript, setIsEditingScript] = useState<boolean>(false);
  const [unsavedWarningOpen, setUnsavedWarningOpen] = useState<boolean>(false);

  // Sync script when project or version selection changes (unless explicitly overridden by direct nav state)
  useEffect(() => {
    if (selectedProject) {
      if (!navState.scriptText || selectedProjectId !== navState.projectId) {
        const text = getScriptFromVersion(selectedVersionIdx);
        setScriptContent(text);
        setInitialScriptSnapshot(text);
      }
    }
  }, [selectedProjectId, selectedVersionIdx]);

  // Track unsaved script edits
  const hasUnsavedEdits = scriptContent.trim() !== initialScriptSnapshot.trim();

  // 2. Navigation Modes: 'setup' (Pre-flight), 'prompter' (Reader), 'record' (Mobile Camera + Overlay)
  const initialMode = location.pathname.includes('video-recording') ? 'record' : 'setup';
  const [activeMode, setActiveMode] = useState<'setup' | 'prompter' | 'record'>(initialMode);

  // 3. Aspect Ratio Selection (Prompt 8: 9:16 primary for Reels/Shorts, plus 1:1, 4:3, 4:5, 16:9)
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1' | '16:9' | '4:3' | '4:5'>('9:16');

  // 4. Prompter Display Customization
  const [fontSize, setFontSize] = useState<number>(28); // 18px to 48px
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0); // 0.5x to 3.0x
  const [lineSpacing, setLineSpacing] = useState<'relaxed' | 'standard' | 'compact'>('standard');
  const [textColor, setTextColor] = useState<'yellow' | 'white' | 'amber'>('yellow');
  const [mirrorMode, setMirrorMode] = useState<boolean>(false);
  const [eyeLevelGuide, setEyeLevelGuide] = useState<boolean>(true);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(3); // 3, 5, 0 (off)
  const [countdownActive, setCountdownActive] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // 5. In-Record Prompter Overlay Controls (Prompt 8 Section 6)
  const [showPrompterOverlay, setShowPrompterOverlay] = useState<boolean>(true);
  const [overlayOpacity, setOverlayOpacity] = useState<number>(75); // 40%, 65%, 75%, 90%
  const [overlayPosition, setOverlayPosition] = useState<'top' | 'center' | 'full'>('top');
  const [overlayFontSize, setOverlayFontSize] = useState<number>(18);

  // 6. Camera & Audio Hardware State (Standard Web APIs)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [audioLevel, setAudioLevel] = useState<number>(0); // 0 to 100 for live VU meter
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState<string>('');
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState<string>('');

  // 7. Recording Controls State (MediaRecorder)
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingPaused, setRecordingPaused] = useState<boolean>(false);
  const [recordingTimer, setRecordingTimer] = useState<number>(0);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // 8. Post-Recording Review & Confirmation State
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
  const [discardConfirmOpen, setDiscardConfirmOpen] = useState<boolean>(false);

  // DOM & Audio Graph Refs
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const setupPreviewRef = useRef<HTMLVideoElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const overlayScrollRef = useRef<HTMLDivElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const scrollIntervalRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Audio metering refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Text Stats
  const scriptWords = scriptContent.trim().split(/\s+/).filter(Boolean).length;
  const estimatedReadingSeconds = Math.round((scriptWords / 130) * 60);

  // Enumerate input devices
  const refreshDevices = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        setVideoDevices(devices.filter((d) => d.kind === 'videoinput'));
        setAudioDevices(devices.filter((d) => d.kind === 'audioinput'));
      } catch (err) {
        console.warn('enumerateDevices error:', err);
      }
    }
  };

  // Stop camera and microphone tracks safely
  const stopCameraStreams = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    // Clean up Web Audio API meter
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setAudioLevel(0);
  };

  // Initialize Web Audio API Analyser for Live Mic Level Meter
  const setupAudioMeter = (stream: MediaStream) => {
    try {
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) return;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.5;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = ctx;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((avg / 120) * 100));
        setAudioLevel(normalized);
        animFrameRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();
    } catch (err) {
      console.warn('Audio meter setup warning:', err);
    }
  };

  // Start Camera with user constraints
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera and microphone Web APIs are not supported in this browser.');
      }

      // Stop any existing tracks
      stopCameraStreams();

      const constraints: MediaStreamConstraints = {
        video: selectedVideoDeviceId
          ? { deviceId: { exact: selectedVideoDeviceId } }
          : {
              facingMode: facingMode,
              width: { ideal: 1080 },
              height: { ideal: 1920 },
            },
        audio: selectedAudioDeviceId
          ? { deviceId: { exact: selectedAudioDeviceId } }
          : audioEnabled,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);

      // Attach stream to video elements
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play().catch(() => {});
      }
      if (setupPreviewRef.current) {
        setupPreviewRef.current.srcObject = stream;
        setupPreviewRef.current.play().catch(() => {});
      }

      // Initialize live VU audio meter
      setupAudioMeter(stream);

      // Refresh device list
      refreshDevices();
    } catch (err: any) {
      console.warn('Camera access failure:', err);
      let message = 'Unable to connect to camera or microphone.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        message = language === 'en'
          ? 'Camera/microphone access was denied. Please allow permissions in browser address bar (lock icon) to record.'
          : 'कैमरा और माइक की अनुमति अस्वीकार कर दी गई है। कृपया ब्राउज़र एड्रेस बार में लॉक (🔒) आइकन पर क्लिक करके अनुमति दें।';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        message = language === 'en'
          ? 'No camera or microphone hardware found on this device.'
          : 'इस डिवाइस पर कोई कैमरा या माइक्रोफ़ोन हार्डवेयर नहीं मिला।';
      } else if (err.name === 'NotReadableError') {
        message = language === 'en'
          ? 'Camera or microphone is already in use by another browser tab or app.'
          : 'कैमरा या माइक किसी अन्य ऐप या ब्राउज़र टैब द्वारा उपयोग में है।';
      } else if (err.message) {
        message = err.message;
      }
      setCameraError(message);
    }
  };

  // Trigger camera startup when entering 'record' or 'setup' mode
  useEffect(() => {
    if (activeMode === 'record' || activeMode === 'setup') {
      startCamera();
    } else {
      stopCameraStreams();
    }
    return () => {
      stopCameraStreams();
    };
  }, [activeMode, facingMode, selectedVideoDeviceId, selectedAudioDeviceId]);

  // Clean up on component unmount
  useEffect(() => {
    refreshDevices();
    return () => {
      stopCameraStreams();
      if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (recordedVideoUrl && recordedVideoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(recordedVideoUrl);
      }
    };
  }, []);

  // Teleprompter Auto-Scroll Loop
  useEffect(() => {
    if (isScrolling) {
      const step = 2.0 * speedMultiplier * 0.75;
      const interval = window.setInterval(() => {
        // Fullscreen Prompter container
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop += step;
          if (
            scrollContainerRef.current.scrollTop + scrollContainerRef.current.clientHeight >=
            scrollContainerRef.current.scrollHeight - 5
          ) {
            setIsScrolling(false);
          }
        }
        // Floating Recording Overlay Prompter
        if (overlayScrollRef.current) {
          overlayScrollRef.current.scrollTop += step * 0.85;
          if (
            overlayScrollRef.current.scrollTop + overlayScrollRef.current.clientHeight >=
            overlayScrollRef.current.scrollHeight - 5
          ) {
            // Reached end of overlay
          }
        }
      }, 30);

      scrollIntervalRef.current = interval;
      return () => clearInterval(interval);
    } else {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    }
  }, [isScrolling, speedMultiplier]);

  // Recording Timer Loop
  useEffect(() => {
    if (isRecording && !recordingPaused) {
      const interval = window.setInterval(() => {
        setRecordingTimer((prev) => prev + 1);
      }, 1000);
      timerIntervalRef.current = interval;
      return () => clearInterval(interval);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  }, [isRecording, recordingPaused]);

  // Format seconds into MM:SS
  const formatTimer = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Camera Facing Toggle
  const toggleFlipCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  // Pre-roll countdown before take
  const handleInitiateRecording = () => {
    if (countdownSeconds > 0) {
      setCountdownActive(countdownSeconds);
      let count = countdownSeconds;
      const timer = setInterval(() => {
        count -= 1;
        if (count <= 0) {
          clearInterval(timer);
          setCountdownActive(null);
          startActualMediaRecording();
        } else {
          setCountdownActive(count);
        }
      }, 1000);
    } else {
      startActualMediaRecording();
    }
  };

  // Start MediaRecorder with robust browser codec negotiation
  const startActualMediaRecording = () => {
    recordedChunksRef.current = [];

    if (cameraStream) {
      try {
        const supportedTypes = [
          'video/mp4;codecs=avc1,mp4a.40.2',
          'video/mp4',
          'video/webm;codecs=vp9,opus',
          'video/webm;codecs=vp8,opus',
          'video/webm',
        ];
        const selectedMime = supportedTypes.find((t) => MediaRecorder.isTypeSupported(t)) || '';

        const options: MediaRecorderOptions = selectedMime ? { mimeType: selectedMime } : {};
        const recorder = new MediaRecorder(cameraStream, options);

        recorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };

        recorder.onstop = () => {
          const finalBlob = new Blob(recordedChunksRef.current, {
            type: selectedMime || 'video/webm',
          });
          setRecordedBlob(finalBlob);
          const blobUrl = URL.createObjectURL(finalBlob);
          setRecordedVideoUrl(blobUrl);
          setReviewModalOpen(true);
        };

        recorder.start(500); // 500ms chunk intervals
        mediaRecorderRef.current = recorder;
      } catch (err) {
        console.error('MediaRecorder start error:', err);
      }
    } else {
      console.log('Simulating recording stream (testing mode)...');
    }

    setIsRecording(true);
    setRecordingPaused(false);
    setRecordingTimer(0);
    setIsScrolling(true); // Sync prompter scroll automatically with take
  };

  // Pause / Resume Take Recording
  const handleTogglePauseRecording = () => {
    if (!mediaRecorderRef.current) return;
    if (recordingPaused) {
      mediaRecorderRef.current.resume();
      setRecordingPaused(false);
      setIsScrolling(true);
    } else {
      mediaRecorderRef.current.pause();
      setRecordingPaused(true);
      setIsScrolling(false);
    }
  };

  // Stop Recording
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      // Fallback synthetic blob for environments without hardware camera
      const sampleBlob = new Blob(['sample-video-take'], { type: 'video/webm' });
      setRecordedBlob(sampleBlob);
      setRecordedVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
      setReviewModalOpen(true);
    }

    setIsRecording(false);
    setRecordingPaused(false);
    setIsScrolling(false);
  };

  // Reset Prompter Scroll to Top
  const handleResetScroll = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    if (overlayScrollRef.current) {
      overlayScrollRef.current.scrollTop = 0;
    }
    setIsScrolling(false);
  };

  // File Upload fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setRecordedBlob(file);
    setRecordedVideoUrl(url);
    setReviewModalOpen(true);
  };

  // Discard & Retake Confirmation Handler (Prompt 8 Item 8)
  const handleConfirmRetake = () => {
    if (recordedVideoUrl && recordedVideoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(recordedVideoUrl);
    }
    setRecordedBlob(null);
    setRecordedVideoUrl(null);
    setReviewModalOpen(false);
    setDiscardConfirmOpen(false);
    setRecordingTimer(0);
    handleResetScroll();
  };

  // Return to Script Studio with unsaved changes verification
  const handleReturnToScriptStudio = () => {
    if (hasUnsavedEdits) {
      setUnsavedWarningOpen(true);
      return;
    }
    proceedBackToScriptStudio();
  };

  const proceedBackToScriptStudio = () => {
    stopCameraStreams();
    navigate('/user/script-studio', {
      state: {
        projectId: selectedProjectId,
        scriptText: scriptContent,
        prefilledTopic: selectedProject?.title || navState.title,
      },
    });
  };

  // Save modified script back to project
  const handleSaveScriptEdits = () => {
    if (!selectedProjectId) return;
    const existingVer = selectedProject?.scriptVersions || [];
    const newVer: ScriptVersion = {
      version: existingVer.length + 1,
      updatedAt: new Date().toISOString(),
      hook: scriptContent.split('\n\n')[0] || '',
      mainContent: scriptContent.split('\n\n').slice(1, -1),
      closing: scriptContent.split('\n\n').slice(-1)[0] || '',
    };

    saveProject({
      id: selectedProjectId,
      title: selectedProject?.title || 'Project',
      scriptVersions: [newVer, ...existingVer],
      scriptSnippet: newVer.hook,
    });

    setProjects(getProjects());
    setInitialScriptSnapshot(scriptContent);
    setIsEditingScript(false);
  };

  // Accept Recording & Attach to Project -> Open in Video Studio (Prompt 8 Item 8)
  const handleAcceptRecording = () => {
    if (!selectedProjectId) return;

    const finalDuration = recordingTimer > 0 ? recordingTimer : 45;
    const sizeEst = recordedBlob ? `${(recordedBlob.size / (1024 * 1024)).toFixed(1)} MB` : '18.4 MB';

    const result = attachMediaToProject(selectedProjectId, {
      title: `Take ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (${aspectRatio})`,
      url: recordedVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      type: 'recorded',
      duration: finalDuration,
      aspectRatio: aspectRatio,
      recordedAt: new Date().toISOString(),
      resolution: '1080p (Full HD)',
      fileSize: sizeEst,
      mimeType: recordedBlob?.type || 'video/webm',
      trimStart: 0,
      trimEnd: finalDuration,
      thumbnailUrl: '/assets/aistudio/Master_Admin_UI___________6_Visual_Assets_Management_bfd1be4e.png',
    });

    setReviewModalOpen(false);
    setProjects(getProjects());

    // Clean up streams before handoff
    stopCameraStreams();

    // Direct handoff into Video Studio (Panel 5 & 6)
    navigate('/user/video-studio', {
      state: {
        projectId: selectedProjectId,
        mediaId: result?.media.id,
      },
    });
  };

  return (
    <div
      className={`min-h-screen bg-[#070B14] text-white ${
        isFullscreen ? 'fixed inset-0 z-50 p-2 sm:p-4' : 'max-w-7xl mx-auto px-2 sm:px-6 py-3 pb-24 md:pb-12'
      }`}
    >
      {/* 1. TOP HEADER TOOLBAR */}
      <div className="bg-[#0D1527] rounded-3xl p-3 sm:p-4 border border-slate-800 shadow-md mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Back button to Script Studio & Project/Script Selector */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <button
            onClick={handleReturnToScriptStudio}
            className="min-h-[40px] px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700 shrink-0"
            title="Return to Script Studio (Preserves Script)"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400" />
            <span>{language === 'en' ? '← Edit Script' : '← एडिट स्क्रिप्ट'}</span>
          </button>

          {/* Project & Script Title Display */}
          <div className="min-w-0 flex-1 md:flex-initial">
            <div className="flex items-center gap-2">
              <h1 className="text-xs sm:text-base font-bold text-white tracking-tight flex items-center gap-2 truncate">
                <span className="truncate max-w-[150px] sm:max-w-xs md:max-w-sm">
                  {selectedProject?.title || navState.title || 'सोलर पैनल से बिजली बिल कैसे कम करें?'}
                </span>
              </h1>
              {selectedProject?.scriptVersions && selectedProject.scriptVersions.length > 0 && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50 shrink-0">
                  v{selectedProject.scriptVersions[selectedVersionIdx]?.version || 1}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">
              <span>{scriptWords} {language === 'en' ? 'words' : 'शब्द'}</span>
              <span>•</span>
              <span className="text-amber-400 font-mono font-semibold">~{estimatedReadingSeconds}s {language === 'en' ? 'read' : 'वाचन'}</span>
              {hasUnsavedEdits && (
                <>
                  <span>•</span>
                  <span className="text-amber-300 font-medium bg-amber-950/60 px-1.5 py-0.5 rounded text-[10px] border border-amber-800/40">
                    {language === 'en' ? 'Unsaved' : 'असेव्ड'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Center / Right: 3 Mode Tabs [Setup | Teleprompter | Record] & Action Icons */}
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full md:w-auto overflow-x-auto pb-1 sm:pb-0">
          {/* Main 3 Workflow Modes Switcher */}
          <div className="bg-[#0B101D] p-1 rounded-2xl flex items-center gap-1 border border-slate-800 shrink-0">
            {/* 1. Setup Mode */}
            <button
              onClick={() => {
                setActiveMode('setup');
              }}
              className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeMode === 'setup'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Setup' : 'सेटअप'}</span>
            </button>

            {/* 2. Prompter Mode */}
            <button
              onClick={() => {
                setActiveMode('prompter');
                stopCameraStreams();
              }}
              className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeMode === 'prompter'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Prompter' : 'टेलीप्रॉम्प्टर'}</span>
            </button>

            {/* 3. Recording Mode */}
            <button
              onClick={() => {
                setActiveMode('record');
              }}
              className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeMode === 'record'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Record' : 'रिकॉर्ड'}</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Settings Trigger */}
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`min-h-[38px] min-w-[38px] p-2 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center ${
                isSettingsOpen ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title="Prompter & Camera Settings"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="min-h-[38px] min-w-[38px] p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center justify-center"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. MODE 1: SETUP SCREEN (Prompt 8 Item 5: Teleprompter Setup Screen & Pre-flight) */}
      {activeMode === 'setup' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* LEFT COLUMN: Script Preview, Version Selector & Text Layout (7 cols) */}
            <div className="lg:col-span-7 bg-[#0D1527] rounded-3xl p-4 sm:p-5 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-blue-950/60 text-blue-400 border border-blue-800/40">
                    <FileText className="w-4 h-4" />
                  </span>
                  <div>
                    <h2 className="text-sm font-bold text-white">
                      {language === 'en' ? 'Script & Reading Content' : 'स्क्रिप्ट व वाचन सामग्री'}
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      {language === 'en' ? 'Verify and format before recording take' : 'रिकॉर्डिंग शुरू करने से पहले स्क्रिप्ट जांचें'}
                    </p>
                  </div>
                </div>

                {/* Quick Edit Text Button */}
                <button
                  onClick={() => setIsEditingScript(!isEditingScript)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  {isEditingScript
                    ? (language === 'en' ? 'Done' : 'हो गया')
                    : (language === 'en' ? 'Quick Edit' : 'टेक्स्ट एडिट करें')}
                </button>
              </div>

              {/* Version Selector (if project has multiple saved versions) */}
              {selectedProject?.scriptVersions && selectedProject.scriptVersions.length > 1 && (
                <div className="flex items-center gap-2 p-2 rounded-2xl bg-[#090E1A] border border-slate-800 text-xs">
                  <span className="text-slate-400 font-semibold px-1">
                    {language === 'en' ? 'Version:' : 'वर्जन:'}
                  </span>
                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    {selectedProject.scriptVersions.map((v, i) => (
                      <button
                        key={v.version}
                        onClick={() => setSelectedVersionIdx(i)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                          selectedVersionIdx === i
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        v{v.version} ({new Date(v.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Script Text Box / Editor */}
              {isEditingScript ? (
                <div className="space-y-2">
                  <textarea
                    value={scriptContent}
                    onChange={(e) => setScriptContent(e.target.value)}
                    rows={12}
                    className="w-full p-4 rounded-2xl bg-black/80 border border-amber-400/60 text-[#FDE047] text-sm font-medium focus:outline-hidden focus:border-amber-400 leading-relaxed font-sans"
                    placeholder="Enter or paste your script..."
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {scriptWords} words • Paragraphs: {scriptContent.split('\n\n').length}
                    </span>
                    <button
                      onClick={handleSaveScriptEdits}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Save as New Version' : 'नए वर्जन के रूप में सेव करें'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-[#080D18] border border-slate-800/80 max-h-72 overflow-y-auto space-y-3">
                  {scriptContent.split('\n\n').map((para, i) => (
                    <p
                      key={i}
                      className={`text-sm leading-relaxed ${
                        i === 0 ? 'text-amber-300 font-bold' : 'text-slate-200'
                      }`}
                    >
                      {para}
                    </p>
                  ))}
                </div>
              )}

              {/* Text Formatting Controls: Font Size, Speed, Line Spacing, Contrast */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {/* Text Size */}
                <div className="p-2.5 rounded-2xl bg-[#090E1A] border border-slate-800 space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center justify-between">
                    <span>{language === 'en' ? 'Font Size' : 'टेक्स्ट साइज'}</span>
                    <span className="text-amber-400 font-mono">{fontSize}px</span>
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setFontSize((p) => Math.max(18, p - 2))}
                      className="flex-1 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
                    >
                      A-
                    </button>
                    <button
                      onClick={() => setFontSize((p) => Math.min(48, p + 2))}
                      className="flex-1 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
                    >
                      A+
                    </button>
                  </div>
                </div>

                {/* Scroll Speed Multiplier */}
                <div className="p-2.5 rounded-2xl bg-[#090E1A] border border-slate-800 space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center justify-between">
                    <span>{language === 'en' ? 'Speed' : 'गति'}</span>
                    <span className="text-amber-400 font-mono">{speedMultiplier.toFixed(1)}x</span>
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSpeedMultiplier((p) => Math.max(0.5, parseFloat((p - 0.2).toFixed(1))))}
                      className="flex-1 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
                    >
                      -
                    </button>
                    <button
                      onClick={() => setSpeedMultiplier((p) => Math.min(3.0, parseFloat((p + 0.2).toFixed(1))))}
                      className="flex-1 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Line Spacing */}
                <div className="p-2.5 rounded-2xl bg-[#090E1A] border border-slate-800 space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    {language === 'en' ? 'Spacing' : 'लाइन स्पेसिंग'}
                  </label>
                  <select
                    value={lineSpacing}
                    onChange={(e) => setLineSpacing(e.target.value as any)}
                    className="w-full py-1 px-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200"
                  >
                    <option value="compact">Compact (1.4)</option>
                    <option value="standard">Standard (1.8)</option>
                    <option value="relaxed">Relaxed (2.2)</option>
                  </select>
                </div>

                {/* Contrast Palette */}
                <div className="p-2.5 rounded-2xl bg-[#090E1A] border border-slate-800 space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    {language === 'en' ? 'Color' : 'रंग'}
                  </label>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <button
                      onClick={() => setTextColor('yellow')}
                      className={`w-6 h-6 rounded-full bg-[#FDE047] border-2 transition-transform ${
                        textColor === 'yellow' ? 'border-white scale-110 shadow-xs' : 'border-transparent opacity-60'
                      }`}
                      title="High-Contrast Yellow"
                    />
                    <button
                      onClick={() => setTextColor('white')}
                      className={`w-6 h-6 rounded-full bg-white border-2 transition-transform ${
                        textColor === 'white' ? 'border-blue-400 scale-110 shadow-xs' : 'border-transparent opacity-60'
                      }`}
                      title="Crisp White"
                    />
                    <button
                      onClick={() => setTextColor('amber')}
                      className={`w-6 h-6 rounded-full bg-amber-500 border-2 transition-transform ${
                        textColor === 'amber' ? 'border-white scale-110 shadow-xs' : 'border-transparent opacity-60'
                      }`}
                      title="Warm Amber"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Camera & Microphone Pre-flight + Ratio Selection (5 cols) */}
            <div className="lg:col-span-5 bg-[#0D1527] rounded-3xl p-4 sm:p-5 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-red-950/60 text-red-400 border border-red-800/40">
                      <Camera className="w-4 h-4" />
                    </span>
                    <div>
                      <h2 className="text-sm font-bold text-white">
                        {language === 'en' ? 'Hardware & Camera Pre-flight' : 'हार्डवेयर व कैमरा प्रीव्यू'}
                      </h2>
                      <p className="text-[11px] text-slate-400">
                        {language === 'en' ? 'Test mic and camera readiness' : 'माइक और कैमरा की जांच करें'}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    cameraStream
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                      : 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                  }`}>
                    {cameraStream ? '✓ READY' : 'STANDBY'}
                  </span>
                </div>

                {/* Aspect Ratio Selector (Prompt 8: 9:16 primary for Reels/Shorts) */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>{language === 'en' ? 'Output Aspect Ratio' : 'वीडियो अनुपात'}</span>
                    <span className="text-[10px] text-blue-400 font-semibold">9:16 Reels / Shorts Priority</span>
                  </label>

                  <div className="grid grid-cols-5 gap-1.5">
                    {[
                      { id: '9:16', label: '9:16', sub: 'Reels' },
                      { id: '1:1', label: '1:1', sub: 'Square' },
                      { id: '4:5', label: '4:5', sub: 'Post' },
                      { id: '4:3', label: '4:3', sub: 'Standard' },
                      { id: '16:9', label: '16:9', sub: 'Wide' },
                    ].map((r) => (
                      <button
                        key={r.id}
                        onClick={() => setAspectRatio(r.id as any)}
                        className={`p-1.5 rounded-xl text-center border transition-all ${
                          aspectRatio === r.id
                            ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30 font-bold'
                            : 'bg-[#090E1A] text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        <p className="text-xs font-bold">{r.label}</p>
                        <p className="text-[9px] opacity-80">{r.sub}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Camera Preview Test Box */}
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-slate-700/80 shadow-inner flex items-center justify-center">
                  {cameraStream ? (
                    <video
                      ref={setupPreviewRef}
                      autoPlay
                      playsInline
                      muted
                      className={`w-full h-full object-cover ${facingMode === 'user' ? '-scale-x-100' : ''}`}
                    />
                  ) : (
                    <div className="p-4 text-center space-y-2 select-none">
                      <CameraOff className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-xs font-semibold text-slate-400">
                        {cameraError ? cameraError : (language === 'en' ? 'Camera stream standby' : 'कैमरा स्टैंडबाय')}
                      </p>
                      <button
                        onClick={startCamera}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                      >
                        {language === 'en' ? 'Connect Camera' : 'कैमरा कनेक्ट करें'}
                      </button>
                    </div>
                  )}

                  {/* Real-time Audio VU Meter (fluctuating with mic audio) */}
                  <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                    <Mic className={`w-3.5 h-3.5 ${audioLevel > 5 ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden flex gap-0.5 p-0.5">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-red-500 rounded-full transition-all duration-75"
                        style={{ width: `${Math.max(5, audioLevel)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-300">
                      {audioLevel > 5 ? `${audioLevel}%` : 'SILENT'}
                    </span>
                  </div>
                </div>

                {/* Hardware Device Selectors */}
                <div className="space-y-2 text-xs">
                  {/* Camera device */}
                  {videoDevices.length > 0 && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-400 text-[11px] shrink-0">Camera:</span>
                      <select
                        value={selectedVideoDeviceId}
                        onChange={(e) => setSelectedVideoDeviceId(e.target.value)}
                        className="flex-1 py-1 px-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs truncate"
                      >
                        <option value="">Default Camera</option>
                        {videoDevices.map((d, i) => (
                          <option key={d.deviceId || i} value={d.deviceId}>
                            {d.label || `Camera ${i + 1}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Countdown selector & Mirror mode */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                    <span className="text-slate-400 text-[11px]">Countdown Pre-roll:</span>
                    <select
                      value={countdownSeconds}
                      onChange={(e) => setCountdownSeconds(parseInt(e.target.value, 10))}
                      className="py-1 px-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold"
                    >
                      <option value={3}>3 Seconds</option>
                      <option value={5}>5 Seconds</option>
                      <option value={0}>Off (Instant)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* PRIMARY ACTION BUTTONS: Start Recording Take vs Prompter Only */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <button
                  onClick={() => {
                    setActiveMode('record');
                  }}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 active:scale-98 transition-all"
                >
                  <Camera className="w-4 h-4 fill-white" />
                  <span>{language === 'en' ? 'Start Video Recording →' : '🎥 वीडियो रिकॉर्डिंग शुरू करें'}</span>
                </button>

                <button
                  onClick={() => {
                    setActiveMode('prompter');
                    stopCameraStreams();
                  }}
                  className="w-full py-2.5 px-4 rounded-2xl bg-[#131D33] hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700/80 transition-colors"
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>{language === 'en' ? 'Open Prompter Reader Only' : '📜 केवल टेलीप्रॉम्प्टर चलाएं'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. MODE 2: DEDICATED TELEPROMPTER READER (Image 1 & 2 Panel 3) */}
      {activeMode === 'prompter' && (
        <div className="relative bg-[#060A12] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col min-h-[580px] sm:min-h-[640px] animate-in fade-in duration-200">
          {/* Top Sub-Header */}
          <div className="p-3 sm:p-4 border-b border-slate-800/80 bg-[#0B132B]/50 flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-amber-400/90 font-bold flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isScrolling ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
              {isScrolling ? (language === 'en' ? 'SCROLLING ACTIVE' : 'स्क्रॉल चालू है') : (language === 'en' ? 'READY TO READ' : 'पढ़ने के लिए तैयार')}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMirrorMode(!mirrorMode)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                  mirrorMode ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
                title="Mirror Horizontal (for reflection glass rigs)"
              >
                {language === 'en' ? 'Mirror' : 'मिरर'}
              </button>

              <button
                onClick={() => setIsEditingScript(!isEditingScript)}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold px-2.5 py-1 rounded-lg bg-blue-950/40 border border-blue-800/60 transition-colors"
              >
                {isEditingScript
                  ? (language === 'en' ? 'Done' : 'एडिट पूरा')
                  : (language === 'en' ? 'Quick Edit Text' : 'टेक्स्ट एडिट')}
              </button>
            </div>
          </div>

          {/* EYE LEVEL GUIDE MARKER (Prompt 8 Item 6: Prominent focal marker so reader looks at camera) */}
          {eyeLevelGuide && (
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-24 border-y-2 border-amber-400/30 bg-amber-400/5 pointer-events-none z-10 flex items-center justify-between px-4">
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300/80 bg-black/60 px-2.5 py-1 rounded-full border border-amber-400/20 flex items-center gap-1.5">
                <Eye className="w-3 h-3 text-amber-400" />
                <span>Eye Level Guide</span>
              </span>
              <span className="text-[10px] font-medium text-amber-300/80 bg-black/60 px-2.5 py-1 rounded-full border border-amber-400/20">
                आँखों के सामने • पढ़ते समय यहाँ देखें
              </span>
            </div>
          )}

          {/* SCRIPT TEXT SCROLL STAGE */}
          <div
            ref={scrollContainerRef}
            className={`flex-1 overflow-y-auto px-6 sm:px-16 py-36 text-center select-none transition-all ${
              mirrorMode ? '-scale-x-100' : ''
            }`}
          >
            {isEditingScript ? (
              <textarea
                value={scriptContent}
                onChange={(e) => setScriptContent(e.target.value)}
                className="w-full h-96 p-4 rounded-2xl bg-black/90 border border-amber-400 text-amber-200 text-base font-medium focus:outline-hidden resize-none leading-relaxed text-left font-sans"
                placeholder="Enter or paste your script..."
              />
            ) : (
              <div
                style={{
                  fontSize: `${fontSize}px`,
                  lineHeight: lineSpacing === 'compact' ? '1.4' : lineSpacing === 'relaxed' ? '2.2' : '1.8',
                }}
                className={`max-w-3xl mx-auto font-bold tracking-wide transition-all ${
                  textColor === 'yellow'
                    ? 'text-[#FDE047]'
                    : textColor === 'amber'
                    ? 'text-amber-400'
                    : 'text-slate-100'
                }`}
              >
                {scriptContent.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-12">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* BOTTOM DOCK CONTROLS (Exact Layout from Google AI Studio Poster & Screen 8) */}
          <div className="relative z-20 bg-[#0A101D] border-t border-slate-800 p-3 sm:p-5 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
            {/* 1. Text Size (A- / A+) */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1 bg-[#131D33] p-1 rounded-2xl border border-slate-700">
                <button
                  onClick={() => setFontSize((prev) => Math.max(18, prev - 2))}
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-xs flex items-center justify-center transition-colors"
                  title="Decrease Font Size"
                >
                  A-
                </button>
                <span className="w-10 text-center text-xs font-mono font-bold text-slate-300">
                  {fontSize}px
                </span>
                <button
                  onClick={() => setFontSize((prev) => Math.min(48, prev + 2))}
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-xs flex items-center justify-center transition-colors"
                  title="Increase Font Size"
                >
                  A+
                </button>
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400">
                {language === 'en' ? 'Text Size' : 'टेक्स्ट साइज'}
              </span>
            </div>

            {/* 2. Scroll Speed (- / +) */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1 bg-[#131D33] p-1 rounded-2xl border border-slate-700">
                <button
                  onClick={() => setSpeedMultiplier((prev) => Math.max(0.5, parseFloat((prev - 0.2).toFixed(1))))}
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-sm flex items-center justify-center transition-colors"
                  title="Decrease Speed"
                >
                  -
                </button>
                <span className="w-12 text-center text-xs font-mono font-bold text-amber-400">
                  {speedMultiplier.toFixed(1)}x
                </span>
                <button
                  onClick={() => setSpeedMultiplier((prev) => Math.min(3.0, parseFloat((prev + 0.2).toFixed(1))))}
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-sm flex items-center justify-center transition-colors"
                  title="Increase Speed"
                >
                  +
                </button>
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400">
                {language === 'en' ? 'Speed' : 'स्पीड'}
              </span>
            </div>

            {/* 3. Center Glowing Golden Play / Pause Circle (Matching Reference Showcase) */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => setIsScrolling(!isScrolling)}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-95 ${
                  isScrolling
                    ? 'bg-amber-400 text-slate-950 shadow-amber-400/50 ring-4 ring-amber-400/25'
                    : 'bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-amber-500/40 ring-4 ring-amber-400/20'
                }`}
                title={isScrolling ? 'Pause Teleprompter' : 'Play Teleprompter'}
              >
                {isScrolling ? (
                  <Pause className="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
                ) : (
                  <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-current translate-x-0.5" />
                )}
              </button>
              <span className="text-[10px] sm:text-[11px] font-bold text-amber-300 mt-1">
                {isScrolling ? (language === 'en' ? 'Pause' : 'रोकें') : (language === 'en' ? 'Play' : 'शुरू करें')}
              </span>
            </div>

            {/* 4. Mirror Toggle & Reset Group */}
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => setMirrorMode(!mirrorMode)}
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl border flex items-center justify-center transition-colors ${
                    mirrorMode
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xs'
                      : 'bg-[#131D33] hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                  title="Toggle Mirror Reflection"
                >
                  <FlipHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400">
                  {language === 'en' ? 'Mirror' : 'मिरर'}
                </span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={handleResetScroll}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#131D33] hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center transition-colors active:scale-95"
                  title="Reset to Top"
                >
                  <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300" />
                </button>
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400">
                  {language === 'en' ? 'Reset' : 'रीसेट'}
                </span>
              </div>
            </div>

            {/* 5. Switch to Video Recording Action Button */}
            <div className="flex flex-col items-center sm:items-end w-full sm:w-auto">
              <button
                onClick={() => {
                  setActiveMode('record');
                }}
                className="w-full sm:w-auto min-h-[42px] px-4 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 active:scale-98 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all"
              >
                <Camera className="w-4 h-4" />
                <span>{language === 'en' ? 'Start Recording →' : '🎥 वीडियो रिकॉर्ड करें'}</span>
              </button>
              <span className="text-[10px] text-slate-400 mt-1 hidden sm:block">
                {language === 'en' ? 'Camera & Prompter Overlay' : 'कैमरा और ओवरले प्रॉम्प्टर'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODE 3: CAMERA PREVIEW & MOBILE RECORDING (Image 1 & 2 Panel 4) */}
      {activeMode === 'record' && (
        <div className="relative bg-[#060A12] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col items-center justify-center min-h-[580px] sm:min-h-[640px] animate-in fade-in duration-200 p-2 sm:p-4">
          {/* Main Viewport framed strictly to selected Aspect Ratio (9:16 vertical priority) */}
          <div
            className={`relative w-full overflow-hidden transition-all duration-300 flex items-center justify-center bg-black ${
              aspectRatio === '9:16'
                ? 'max-w-[360px] aspect-[9/16] rounded-3xl border-2 border-slate-700 shadow-2xl ring-1 ring-white/10'
                : aspectRatio === '4:3'
                ? 'max-w-2xl aspect-[4/3] rounded-2xl border border-slate-700 shadow-2xl'
                : aspectRatio === '1:1'
                ? 'max-w-md aspect-square rounded-2xl border border-slate-700 shadow-2xl'
                : aspectRatio === '4:5'
                ? 'max-w-sm aspect-[4/5] rounded-2xl border border-slate-700 shadow-2xl'
                : 'max-w-4xl aspect-video rounded-2xl border border-slate-700 shadow-2xl'
            }`}
          >
            {/* Live Camera Feed or Presenter Simulation */}
            {cameraStream ? (
              <video
                ref={videoPreviewRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${facingMode === 'user' ? '-scale-x-100' : ''}`}
              />
            ) : (
              <div className="relative w-full h-full bg-gradient-to-b from-slate-900 via-slate-950 to-black flex flex-col items-center justify-center text-center p-6 select-none">
                <div className="relative mb-3">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-3xl font-bold border-4 border-white/20 shadow-xl">
                    RT
                  </div>
                  {isRecording && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-600 border-2 border-white flex items-center justify-center animate-ping" />
                  )}
                </div>

                <p className="text-sm font-bold text-white">
                  {cameraError ? 'कैमरा अनुमति आवश्यक है' : 'कैमरा प्रीव्यू (सिमुलेशन मोड)'}
                </p>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  {cameraError || 'Browser camera ready. You can record using connected camera or use file import.'}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={startCamera}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
                  >
                    कैमरा पुनः कनेक्ट करें
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    वीडियो फ़ाइल अपलोड करें
                  </button>
                </div>
              </div>
            )}

            {/* EYE LEVEL GUIDE AT TOP OF CAMERA (Prompt 8 Section 6: Right beneath front selfie lens) */}
            <div className="absolute top-12 left-3 right-3 z-20 pointer-events-none flex items-center justify-between border-b border-dashed border-amber-400/40 pb-1">
              <span className="text-[10px] font-bold text-amber-300 bg-black/75 px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1 border border-amber-400/30">
                <Eye className="w-3 h-3 text-amber-400" />
                <span>Eye Level Guide • आँखों के सामने</span>
              </span>
              <span className="text-[9px] text-slate-300 bg-black/60 px-1.5 py-0.5 rounded">
                कैमरा लेंस की ओर देखें
              </span>
            </div>

            {/* Countdown Overlay (3s / 5s) */}
            {countdownActive !== null && (
              <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-xs flex items-center justify-center">
                <div className="text-center animate-pulse space-y-2">
                  <span className="text-8xl sm:text-9xl font-black text-amber-400 font-mono drop-shadow-xl">
                    {countdownActive}
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-white uppercase tracking-widest">
                    {language === 'en' ? 'Get Ready... Action!' : 'तैयार रहें... रिकॉर्डिंग शुरू!'}
                  </p>
                </div>
              </div>
            )}

            {/* FLOATING LEFT: Aspect Ratio Selector Pills (Panel 4 reference) */}
            <div className="absolute top-4 left-3 z-30 flex flex-col gap-1.5">
              {[
                { id: '9:16', label: '9:16', sub: 'Reels/Shorts' },
                { id: '1:1', label: '1:1', sub: 'Square' },
                { id: '16:9', label: '16:9', sub: 'Landscape' },
                { id: '4:3', label: '4:3', sub: 'Standard' },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setAspectRatio(r.id as any)}
                  className={`px-2.5 py-1.5 rounded-xl text-left backdrop-blur-md border transition-all ${
                    aspectRatio === r.id
                      ? 'bg-blue-600/90 text-white border-blue-400 shadow-md shadow-blue-500/30'
                      : 'bg-black/60 text-slate-300 border-white/10 hover:bg-black/80'
                  }`}
                >
                  <p className="text-[11px] font-bold leading-none">{r.label}</p>
                  <p className="text-[9px] text-slate-300/80 mt-0.5">{r.sub}</p>
                </button>
              ))}
            </div>

            {/* FLOATING RIGHT: Semi-transparent Teleprompter Overlay (Prompt 8 Item 6) */}
            {showPrompterOverlay && (
              <div
                style={{
                  backgroundColor: `rgba(0, 0, 0, ${overlayOpacity / 100})`,
                }}
                className={`absolute right-3 z-30 w-52 sm:w-64 backdrop-blur-md rounded-2xl border border-white/20 p-3 flex flex-col justify-between pointer-events-auto transition-all ${
                  overlayPosition === 'top'
                    ? 'top-4 h-64'
                    : overlayPosition === 'center'
                    ? 'top-1/4 h-72'
                    : 'top-4 bottom-20'
                }`}
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-white/15 text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3 text-amber-400" />
                    <span>प्रॉम्प्टर ओवरले</span>
                  </span>
                  <div className="flex items-center gap-1 font-mono text-white/90">
                    <button
                      onClick={() => setSpeedMultiplier((p) => Math.max(0.5, parseFloat((p - 0.2).toFixed(1))))}
                      className="px-1 bg-white/10 rounded hover:bg-white/20"
                    >
                      -
                    </button>
                    <span>{speedMultiplier.toFixed(1)}x</span>
                    <button
                      onClick={() => setSpeedMultiplier((p) => Math.min(3.0, parseFloat((p + 0.2).toFixed(1))))}
                      className="px-1 bg-white/10 rounded hover:bg-white/20"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div
                  ref={overlayScrollRef}
                  className="flex-1 overflow-y-auto py-3 select-none"
                >
                  <div
                    style={{ fontSize: `${overlayFontSize}px`, lineHeight: '1.6' }}
                    className="font-bold text-[#FDE047] space-y-3 drop-shadow-md"
                  >
                    {scriptContent.split('\n\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                {/* Overlay Footer Tools */}
                <div className="pt-1.5 border-t border-white/15 flex items-center justify-between text-[10px] text-slate-300">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setOverlayFontSize((p) => Math.max(14, p - 2))}
                      className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20"
                    >
                      A-
                    </button>
                    <button
                      onClick={() => setOverlayFontSize((p) => Math.min(26, p + 2))}
                      className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20"
                    >
                      A+
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setOverlayPosition((prev) =>
                          prev === 'top' ? 'center' : prev === 'center' ? 'full' : 'top'
                        )
                      }
                      className="text-[9px] text-blue-300 hover:text-white"
                      title="Adjust position"
                    >
                      {overlayPosition}
                    </button>
                    <button
                      onClick={() => setShowPrompterOverlay(false)}
                      className="text-[9px] text-red-300 hover:text-white"
                    >
                      छिपाएं
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Top Indicator: Live REC / Standby Badge & Timer */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
              <div className="flex items-center gap-2 bg-black/80 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/20 text-xs font-mono shadow-lg">
                <span className={`w-2.5 h-2.5 rounded-full ${isRecording ? 'bg-red-500 animate-ping' : 'bg-slate-400'}`} />
                <span className="font-bold text-white">{isRecording ? (recordingPaused ? 'PAUSED' : 'REC') : 'STANDBY'}</span>
                <span className="text-amber-400 font-bold">{formatTimer(recordingTimer)}</span>
              </div>
            </div>
          </div>

          {/* BOTTOM RECORDING DOCK (Exact Layout from Google AI Studio Poster Image 1 & 2 Panel 4) */}
          <div className="w-full max-w-4xl bg-[#0A101D] border-t border-slate-800 p-3 sm:p-4 mt-3 rounded-2xl flex flex-wrap items-center justify-between gap-3">
            {/* 1. Camera Switch / Flip Button */}
            <button
              onClick={toggleFlipCamera}
              className="flex flex-col items-center gap-1 text-slate-300 hover:text-white transition-colors"
              title="Flip Front / Rear Camera"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center border border-slate-700">
                <SwitchCamera className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold">{language === 'en' ? 'Flip Cam' : 'कैमरा स्विच'}</span>
            </button>

            {/* 2. Microphone Toggle Button + VU Meter */}
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="flex flex-col items-center gap-1 text-slate-300 hover:text-white transition-colors"
              title="Toggle Microphone"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                  audioEnabled
                    ? 'bg-slate-800 border-slate-700 text-emerald-400'
                    : 'bg-red-950/40 border-red-800 text-red-400'
                }`}
              >
                {audioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </div>
              <span className="text-[10px] font-semibold">
                {audioEnabled ? (language === 'en' ? 'Mic On' : 'माइक ऑन') : (language === 'en' ? 'Muted' : 'म्यूट')}
              </span>
            </button>

            {/* 3. Center Big Red Record Button & Pause/Resume (Prompt 8 Item 6) */}
            <div className="flex items-center gap-3">
              {isRecording && (
                <button
                  onClick={handleTogglePauseRecording}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
                    recordingPaused
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700'
                  }`}
                  title={recordingPaused ? 'Resume Take' : 'Pause Take'}
                >
                  {recordingPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
                </button>
              )}

              <div className="flex flex-col items-center">
                {!isRecording ? (
                  <button
                    onClick={handleInitiateRecording}
                    className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-600/40 ring-4 ring-red-600/30 active:scale-95 transition-all"
                    title="Start Recording"
                  >
                    <span className="w-6 h-6 rounded-full bg-white shadow-xs" />
                  </button>
                ) : (
                  <button
                    onClick={handleStopRecording}
                    className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg shadow-red-600/40 ring-4 ring-red-600/30 animate-pulse transition-all"
                    title="Stop Recording Take"
                  >
                    <span className="w-6 h-6 rounded-xs bg-white" />
                  </button>
                )}
                <span className="text-[11px] font-bold text-white mt-1">
                  {isRecording ? (language === 'en' ? 'Stop' : 'समाप्त करें') : (language === 'en' ? 'Record' : 'रिकॉर्ड करें')}
                </span>
              </div>
            </div>

            {/* 4. Timer Display with 60-Second Short-Form Progress Cue */}
            <div className="flex flex-col items-center">
              <div className="bg-[#131D33] px-3 py-1.5 rounded-xl border border-slate-700 font-mono text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{formatTimer(recordingTimer)}</span>
                <span className="text-slate-500">/ 01:00</span>
              </div>
              {/* Short-form 60s progress bar for Reels */}
              <div className="w-24 sm:w-28 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1.5 border border-slate-700">
                <div
                  className={`h-full transition-all duration-300 ${
                    recordingTimer > 50 ? 'bg-red-500 animate-pulse' : recordingTimer > 40 ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${Math.min(100, (recordingTimer / 60) * 100)}%` }}
                />
              </div>
              <span className="text-[9px] text-slate-400 mt-0.5">
                {aspectRatio === '9:16' ? 'Reels 60s Limit' : 'Standard'}
              </span>
            </div>

            {/* 5. Teleprompter Overlay Toggle */}
            <button
              onClick={() => setShowPrompterOverlay(!showPrompterOverlay)}
              className="flex flex-col items-center gap-1 text-slate-300 hover:text-white transition-colors"
              title="Toggle Prompter Overlay"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                  showPrompterOverlay ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold">{language === 'en' ? 'Overlay' : 'ओवरले'}</span>
            </button>

            {/* 6. Settings Gear */}
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="flex flex-col items-center gap-1 text-slate-300 hover:text-white transition-colors"
              title="Prompter & Camera Settings"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center border border-slate-700">
                <Settings className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold">{language === 'en' ? 'Settings' : 'सेटिंग्स'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. SETTINGS DRAWER / MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0E1628] rounded-3xl max-w-md w-full p-6 border border-slate-700 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-blue-400" />
                <span>{language === 'en' ? 'Prompter & Camera Settings' : 'प्रॉम्प्टर और कैमरा सेटिंग्स'}</span>
              </h3>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Countdown Duration */}
            <div className="flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-slate-200">Pre-roll Countdown</p>
                <p className="text-[10px] text-slate-400">Countdown timer before take begins</p>
              </div>
              <select
                value={countdownSeconds}
                onChange={(e) => setCountdownSeconds(parseInt(e.target.value, 10))}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white"
              >
                <option value={3}>3 Seconds</option>
                <option value={5}>5 Seconds</option>
                <option value={0}>Off (Instant)</option>
              </select>
            </div>

            {/* Overlay Opacity */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
              <div>
                <p className="font-semibold text-slate-200">Overlay Transparency</p>
                <p className="text-[10px] text-slate-400">Background darkness of prompter HUD</p>
              </div>
              <select
                value={overlayOpacity}
                onChange={(e) => setOverlayOpacity(parseInt(e.target.value, 10))}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white"
              >
                <option value={40}>40% (Light)</option>
                <option value={65}>65% (Medium)</option>
                <option value={75}>75% (Standard)</option>
                <option value={90}>90% (High Contrast)</option>
              </select>
            </div>

            {/* Eye Level Guide Toggle */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
              <div>
                <p className="font-semibold text-slate-200">Eye-Level Guide</p>
                <p className="text-[10px] text-slate-400">Show focal guide near camera lens</p>
              </div>
              <button
                onClick={() => setEyeLevelGuide(!eyeLevelGuide)}
                className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                  eyeLevelGuide ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    eyeLevelGuide ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Mirror Horizontal */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
              <div>
                <p className="font-semibold text-slate-200">Mirror Horizontal</p>
                <p className="text-[10px] text-slate-400">For reflection glass rigs</p>
              </div>
              <button
                onClick={() => setMirrorMode(!mirrorMode)}
                className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                  mirrorMode ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    mirrorMode ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Import Pre-recorded Take */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-200">Import Pre-recorded Take</p>
                <p className="text-[10px] text-slate-400">Upload video from device gallery</p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. UNSAVED CHANGES WARNING DIALOG */}
      {unsavedWarningOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0E1628] rounded-3xl max-w-sm w-full p-6 border border-slate-700 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-sm font-bold text-white">
                {language === 'en' ? 'Unsaved Script Edits' : 'असुरक्षित स्क्रिप्ट बदलाव'}
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {language === 'en'
                ? 'You have edited the script in the teleprompter. Do you want to return to Script Studio with these changes?'
                : 'आपने टेलीप्रॉम्प्टर में स्क्रिप्ट में बदलाव किए हैं। क्या आप इन बदलावों के साथ वापस स्क्रिप्ट स्टूडियो जाना चाहते हैं?'}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setUnsavedWarningOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                {language === 'en' ? 'Cancel' : 'रद्द करें'}
              </button>
              <button
                onClick={proceedBackToScriptStudio}
                className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
              >
                {language === 'en' ? 'Proceed with Edits' : 'बदलावों के साथ जाएं'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. DISCARD & RETAKE CONFIRMATION DIALOG (Prompt 8 Item 8) */}
      {discardConfirmOpen && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0E1628] rounded-3xl max-w-sm w-full p-6 border border-slate-700 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-red-400">
              <Trash2 className="w-6 h-6 shrink-0" />
              <h3 className="text-sm font-bold text-white">
                {language === 'en' ? 'Discard Recording & Retake?' : 'रिकॉर्डिंग हटाएं व दोबारा टेक लें?'}
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {language === 'en'
                ? 'Are you sure you want to discard this recording? The current video take will be permanently removed so you can record fresh.'
                : 'क्या आप इस रिकॉर्डिंग को हटाकर नया टेक लेना चाहते हैं? वर्तमान टेक मिटा दिया जाएगा ताकि आप नया वीडियो रिकॉर्ड कर सकें।'}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDiscardConfirmOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                {language === 'en' ? 'Keep Video' : 'रद्द करें'}
              </button>
              <button
                onClick={handleConfirmRetake}
                className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
              >
                {language === 'en' ? 'Discard & Retake' : 'हटाएं और नया टेक लें'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. POST-RECORDING REVIEW MODAL (Prompt 8 Item 8: Review, Retake & Save) */}
      {reviewModalOpen && recordedVideoUrl && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0E1628] rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-700 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-white">
                  {language === 'en' ? 'Review Your Recording' : 'रिकॉर्डिंग की समीक्षा करें'}
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400">
                {formatTimer(recordingTimer || 45)}
              </span>
            </div>

            {/* Video Playback Player Preview */}
            <div
              className={`rounded-2xl overflow-hidden bg-black mx-auto border border-slate-700 relative ${
                aspectRatio === '9:16' ? 'max-w-[240px] aspect-[9/16]' : 'aspect-video'
              }`}
            >
              <video
                src={recordedVideoUrl}
                controls
                playsInline
                className="w-full h-full object-contain"
              />
            </div>

            {/* Metadata Badges */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Ratio</p>
                <p className="font-bold text-white">{aspectRatio}</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Resolution</p>
                <p className="font-bold text-white">1080p Full HD</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Project</p>
                <p className="font-bold text-white truncate">{selectedProject?.title}</p>
              </div>
            </div>

            {/* Modal Actions: Retake with Confirmation, Download, and Accept -> Video Studio */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setDiscardConfirmOpen(true)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold transition-colors w-full sm:w-auto"
                >
                  {language === 'en' ? 'Retake Take' : 'दोबारा रिकॉर्ड करें'}
                </button>

                <a
                  href={recordedVideoUrl}
                  download={`scripter_take_${Date.now()}.${recordedBlob?.type?.includes('mp4') ? 'mp4' : 'webm'}`}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  title="Download Raw Take to Device"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>

              {/* PRIMARY ACCEPT & OPEN IN VIDEO STUDIO (Direct workflow handoff) */}
              <button
                onClick={handleAcceptRecording}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 transition-all w-full sm:w-auto"
              >
                <Save className="w-4 h-4" />
                <span>{language === 'en' ? 'Open in Video Studio →' : 'स्वीकारें व वीडियो एडिटर खोलें'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input for fallback uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="video/*"
        className="hidden"
      />
    </div>
  );
};
