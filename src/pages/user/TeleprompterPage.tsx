import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useRole } from '../../context/RoleContext';
import { Project, ProjectMedia } from '../../types';
import { getProjects, attachMediaToProject } from '../../services/storage';
import {
  Video,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Rewind,
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
  Sliders,
  Type
} from 'lucide-react';

interface TeleprompterPageProps {
  defaultMode?: 'prompter' | 'record';
}

export const TeleprompterPage: React.FC<TeleprompterPageProps> = ({ defaultMode = 'prompter' }) => {
  const { language } = useLanguage();
  const { activeBusinessProfile } = useRole();
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation state passed from Projects or Script Studio
  const navState = (location.state || {}) as {
    projectId?: string;
    scriptText?: string;
    title?: string;
  };

  // 1. Projects and Script State
  const [projects, setProjects] = useState<Project[]>(() => getProjects());
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    navState.projectId || (projects[0]?.id || '')
  );

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  // Script text to scroll
  const getInitialScript = (): string => {
    if (navState.scriptText) return navState.scriptText;
    if (selectedProject?.scriptVersions && selectedProject.scriptVersions.length > 0) {
      const v = selectedProject.scriptVersions[0];
      return `${v.hook}\n\n${v.mainContent.join('\n\n')}\n\n${v.closing}`;
    }
    return selectedProject?.scriptSnippet || 'नमस्कार दोस्तों! आज हम बात करने वाले हैं कि कैसे आप अपने मोबाइल से बेहतर वीडियो कंटेंट बना सकते हैं और अपने ब्रांड को तेजी से बढ़ा सकते हैं।';
  };

  const [scriptContent, setScriptContent] = useState<string>(getInitialScript);
  const [isEditingScript, setIsEditingScript] = useState<boolean>(false);

  // Sync script if user selects different project and no direct state override
  useEffect(() => {
    if (!navState.scriptText && selectedProject) {
      if (selectedProject.scriptVersions && selectedProject.scriptVersions.length > 0) {
        const v = selectedProject.scriptVersions[0];
        setScriptContent(`${v.hook}\n\n${v.mainContent.join('\n\n')}\n\n${v.closing}`);
      } else if (selectedProject.scriptSnippet) {
        setScriptContent(selectedProject.scriptSnippet);
      }
    }
  }, [selectedProjectId]);

  // 2. Mode State: 'prompter' (teleprompter only) vs 'record' (camera + teleprompter overlay)
  const initialMode = location.pathname.includes('video-recording') ? 'record' : defaultMode;
  const [activeMode, setActiveMode] = useState<'prompter' | 'record'>(initialMode);

  // Aspect Ratio for Video Recording (Panel 4)
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1' | '16:9' | '4:3'>('9:16');
  const [showPrompterOverlay, setShowPrompterOverlay] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // 3. Teleprompter Controls State
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(2); // 1 to 5
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0); // 0.8x, 1.0x, 1.5x, 2.0x
  const [fontSize, setFontSize] = useState<number>(28); // px
  const [textColor, setTextColor] = useState<'yellow' | 'white' | 'amber'>('yellow');
  const [themeMode, setThemeMode] = useState<'dark' | 'light' | 'minimal'>('dark');
  const [mirrorMode, setMirrorMode] = useState<boolean>(false);
  const [showCountdown, setShowCountdown] = useState<boolean>(true);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(3);
  const [countdownActive, setCountdownActive] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // 4. Camera & Recording State
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingPaused, setRecordingPaused] = useState<boolean>(false);
  const [recordingTimer, setRecordingTimer] = useState<number>(0);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);

  // 5. Post-recording review
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);

  // DOM Refs
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const overlayScrollRef = useRef<HTMLDivElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const scrollIntervalRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera media tracks helper
  const stopCameraStreams = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => {
        track.stop();
      });
      setCameraStream(null);
    }
  };

  // Clean up streams on unmount
  useEffect(() => {
    return () => {
      stopCameraStreams();
      if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (recordedVideoUrl && recordedVideoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(recordedVideoUrl);
      }
    };
  }, []);

  // Initialize Camera when in 'record' mode
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera recording API is not supported in this browser environment.');
      }

      // Stop existing tracks first
      if (cameraStream) {
        cameraStream.getTracks().forEach((t) => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: audioEnabled,
      });

      setCameraStream(stream);
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      let message = 'Unable to access camera or microphone.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        message = 'Camera permission was denied. Please allow camera and mic permissions in browser settings, or use preview simulation / file upload.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        message = 'No camera or microphone device found on this system.';
      } else if (err.message) {
        message = err.message;
      }
      setCameraError(message);
    }
  };

  // Re-start camera when facingMode or audio settings change in record mode
  useEffect(() => {
    if (activeMode === 'record') {
      startCamera();
    } else {
      stopCameraStreams();
    }
  }, [activeMode, facingMode]);

  // Teleprompter Auto-Scroll Loop (supports both full view & recording overlay)
  useEffect(() => {
    if (isScrolling) {
      const step = scrollSpeed * speedMultiplier * 0.75;

      const interval = window.setInterval(() => {
        // Main Prompter container scroll
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop += step;
          if (scrollContainerRef.current.scrollTop + scrollContainerRef.current.clientHeight >= scrollContainerRef.current.scrollHeight) {
            setIsScrolling(false);
          }
        }
        // Floating recording overlay prompter scroll
        if (overlayScrollRef.current) {
          overlayScrollRef.current.scrollTop += step * 0.85;
          if (overlayScrollRef.current.scrollTop + overlayScrollRef.current.clientHeight >= overlayScrollRef.current.scrollHeight) {
            // overlay loop or end
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
  }, [isScrolling, scrollSpeed, speedMultiplier]);

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

  // Format seconds to MM:SS
  const formatTimer = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Flip Camera Front / Back
  const toggleFlipCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  // Start Countdown then Start Recording & Auto-Scroll
  const handleInitiateRecording = () => {
    if (showCountdown && countdownSeconds > 0) {
      setCountdownActive(countdownSeconds);
      let current = countdownSeconds;
      const countInterval = setInterval(() => {
        current -= 1;
        if (current <= 0) {
          clearInterval(countInterval);
          setCountdownActive(null);
          startActualRecording();
        } else {
          setCountdownActive(current);
        }
      }, 1000);
    } else {
      startActualRecording();
    }
  };

  // Actual MediaRecorder start
  const startActualRecording = () => {
    recordedChunksRef.current = [];

    // If stream is active, use native MediaRecorder
    if (cameraStream) {
      try {
        const mimeTypes = [
          'video/webm;codecs=vp9,opus',
          'video/webm',
          'video/mp4',
        ];
        const selectedMime = mimeTypes.find((m) => MediaRecorder.isTypeSupported(m)) || '';

        const recorder = new MediaRecorder(cameraStream, selectedMime ? { mimeType: selectedMime } : undefined);

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
          const url = URL.createObjectURL(finalBlob);
          setRecordedVideoUrl(url);
          setReviewModalOpen(true);
        };

        recorder.start(500); // 500ms chunks
        mediaRecorderRef.current = recorder;
      } catch (err) {
        console.error('Failed to start MediaRecorder:', err);
      }
    } else {
      console.log('Simulating take recording without active camera hardware...');
    }

    setIsRecording(true);
    setRecordingPaused(false);
    setRecordingTimer(0);
    setIsScrolling(true); // Automatically start scrolling with recording!
  };

  // Stop Recording
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      // Fallback synthetic video blob creation for browser verification
      const sampleBlob = new Blob(['sample-recorded-video-stream'], { type: 'video/webm' });
      setRecordedBlob(sampleBlob);
      // Use fallback poster preview or sample stream
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

  // Return to Script Studio with preserved state
  const handleReturnToScriptStudio = () => {
    stopCameraStreams();
    navigate('/user/script-studio', {
      state: {
        projectId: selectedProjectId,
        scriptText: scriptContent,
        prefilledTopic: selectedProject?.title || navState.title,
      },
    });
  };

  // Accept Recording & Attach to Project -> Open in Video Studio (Panel 5 & 6)
  const handleAcceptRecording = () => {
    if (!selectedProjectId) return;

    const durationEst = recordingTimer > 0 ? recordingTimer : 45;
    const mediaSizeEst = recordedBlob ? `${(recordedBlob.size / (1024 * 1024)).toFixed(1)} MB` : '19.4 MB';

    const result = attachMediaToProject(selectedProjectId, {
      title: `Take ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (${aspectRatio})`,
      url: recordedVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      type: 'recorded',
      duration: durationEst,
      aspectRatio: aspectRatio,
      recordedAt: new Date().toISOString(),
      resolution: '1080p (Full HD)',
      fileSize: mediaSizeEst,
      mimeType: recordedBlob?.type || 'video/webm',
      trimStart: 0,
      trimEnd: durationEst,
      thumbnailUrl: '/assets/aistudio/Master_Admin_UI___________6_Visual_Assets_Management_bfd1be4e.png',
    });

    setReviewModalOpen(false);
    setProjects(getProjects());

    // Navigate to Video Studio with the project and media reference
    navigate('/user/video-studio', {
      state: {
        projectId: selectedProjectId,
        mediaId: result?.media.id,
      },
    });
  };

  return (
    <div className={`min-h-screen bg-[#070B14] text-white ${isFullscreen ? 'fixed inset-0 z-50 p-2 sm:p-4' : 'max-w-7xl mx-auto px-2 sm:px-6 py-3 pb-24 md:pb-12'}`}>
      {/* 1. Header Toolbar (Poster 3 Screen 3 & 4) */}
      <div className="bg-[#0D1527] rounded-3xl p-3 sm:p-4 border border-slate-800 shadow-md mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Back to Script Studio with preserved edits */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleReturnToScriptStudio}
            className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
            title="Return to Script Studio (Preserves Script)"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400" />
            <span>{language === 'en' ? '← Edit Script' : '← एडिट स्क्रिप्ट'}</span>
          </button>

          {/* Centered Script / Project Title */}
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span className="truncate max-w-[220px] sm:max-w-md">
                {selectedProject?.title || 'सोलर पैनल से बिजली बिल कैसे कम करें?'}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50">
                {activeMode === 'prompter' ? 'प्रॉम्प्टर मोड' : 'रिकॉर्डिंग मोड'}
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              {language === 'en' ? 'Project:' : 'प्रोजेक्ट:'} {selectedProject?.title} • {selectedProject?.category}
            </p>
          </div>
        </div>

        {/* Center / Right: Mode Switcher & Settings */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {/* Mode Tabs: Teleprompter (Panel 3) vs Video Recording (Panel 4) */}
          <div className="bg-[#0B101D] p-1 rounded-2xl flex items-center gap-1 border border-slate-800">
            <button
              onClick={() => {
                setActiveMode('prompter');
                stopCameraStreams();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeMode === 'prompter'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Teleprompter' : 'टेलीप्रॉम्प्टर'}</span>
            </button>

            <button
              onClick={() => {
                setActiveMode('record');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeMode === 'record'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Video Recording' : 'वीडियो रिकॉर्डिंग'}</span>
            </button>
          </div>

          {/* Settings Trigger */}
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`p-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
              isSettingsOpen ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Teleprompter & Camera Settings"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'en' ? 'Settings' : 'सेटिंग्स'}</span>
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. MAIN STAGE */}
      {activeMode === 'prompter' ? (
        /* ================= PANEL 3: TELEPROMPTER ONLY ================= */
        <div className="relative bg-[#060A12] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col min-h-[580px] sm:min-h-[640px]">
          {/* Top Sub-Header */}
          <div className="p-3 sm:p-4 border-b border-slate-800/80 bg-[#0B132B]/50 flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-amber-400/90 font-bold flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isScrolling ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
              {isScrolling ? (language === 'en' ? 'SCROLLING ACTIVE' : 'स्क्रॉल चालू है') : (language === 'en' ? 'READY TO READ' : 'पढ़ने के लिए तैयार')}
            </span>

            <button
              onClick={() => setIsEditingScript(!isEditingScript)}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold px-2.5 py-1 rounded-lg bg-blue-950/40 border border-blue-800/60 transition-colors"
            >
              {isEditingScript
                ? (language === 'en' ? 'Done Editing' : 'एडिट पूरा हुआ')
                : (language === 'en' ? 'Quick Edit Text' : 'टेक्स्ट एडिट करें')}
            </button>
          </div>

          {/* Eye Level Guide Marker (Horizontal focal guide line) */}
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-24 border-y-2 border-amber-400/30 bg-amber-400/5 pointer-events-none z-10 flex items-center justify-between px-4">
            <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300/80 bg-black/60 px-2 py-0.5 rounded border border-amber-400/20">
              ◀ Eye Level Guide
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300/80 bg-black/60 px-2 py-0.5 rounded border border-amber-400/20">
              आँखों के सामने ▶
            </span>
          </div>

          {/* Script Text Stage (Deep Black background with high-contrast yellow typography matching Panel 3) */}
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
                  lineHeight: '1.8',
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

          {/* PANEL 3 BOTTOM DOCK CONTROLS (Exact Layout from Infographic) */}
          <div className="relative z-20 bg-[#0A101D] border-t border-slate-800 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
            {/* 1. Text Size (A- / A+) */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1 bg-[#131D33] p-1 rounded-2xl border border-slate-700">
                <button
                  onClick={() => setFontSize((prev) => Math.max(18, prev - 2))}
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center transition-colors"
                  title="Decrease Font Size"
                >
                  A-
                </button>
                <span className="w-10 text-center text-xs font-mono font-bold text-slate-300">
                  {fontSize}px
                </span>
                <button
                  onClick={() => setFontSize((prev) => Math.min(46, prev + 2))}
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center transition-colors"
                  title="Increase Font Size"
                >
                  A+
                </button>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                {language === 'en' ? 'Text Size' : 'टेक्स्ट साइज'}
              </span>
            </div>

            {/* 2. Scroll Speed (- / +) */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1 bg-[#131D33] p-1 rounded-2xl border border-slate-700">
                <button
                  onClick={() => setSpeedMultiplier((prev) => Math.max(0.5, parseFloat((prev - 0.2).toFixed(1))))}
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center transition-colors"
                  title="Decrease Speed"
                >
                  -
                </button>
                <span className="w-12 text-center text-xs font-mono font-bold text-amber-400">
                  {speedMultiplier.toFixed(1)}x
                </span>
                <button
                  onClick={() => setSpeedMultiplier((prev) => Math.min(3.0, parseFloat((prev + 0.2).toFixed(1))))}
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center transition-colors"
                  title="Increase Speed"
                >
                  +
                </button>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">
                {language === 'en' ? 'Scroll Speed' : 'स्क्रोल स्पीड'}
              </span>
            </div>

            {/* 3. Center Glowing Play / Pause Circle */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => setIsScrolling(!isScrolling)}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl active:scale-95 ${
                  isScrolling
                    ? 'bg-amber-400 text-slate-950 shadow-amber-400/40 ring-4 ring-amber-400/20'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/40 ring-4 ring-blue-600/20'
                }`}
                title={isScrolling ? 'Pause Teleprompter' : 'Play Teleprompter'}
              >
                {isScrolling ? (
                  <Pause className="w-7 h-7 fill-current" />
                ) : (
                  <Play className="w-7 h-7 fill-current translate-x-0.5" />
                )}
              </button>
              <span className="text-[11px] font-bold text-slate-300 mt-1">
                {isScrolling ? (language === 'en' ? 'Pause' : 'रोकें') : (language === 'en' ? 'Play' : 'शुरू करें')}
              </span>
            </div>

            {/* 4. Reset Button */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={handleResetScroll}
                className="w-12 h-11 rounded-2xl bg-[#131D33] hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center transition-colors"
                title="Reset to Top"
              >
                <RotateCcw className="w-5 h-5 text-slate-300" />
              </button>
              <span className="text-[11px] font-semibold text-slate-400">
                {language === 'en' ? 'Reset' : 'रीसेट'}
              </span>
            </div>

            {/* 5. Switch to Video Recording Action Button */}
            <div className="flex flex-col items-end">
              <button
                onClick={() => {
                  setActiveMode('record');
                }}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all"
              >
                <Camera className="w-4 h-4" />
                <span>{language === 'en' ? 'Start Recording →' : '🎥 वीडियो रिकॉर्ड करें'}</span>
              </button>
              <span className="text-[10px] text-slate-400 mt-1">
                {language === 'en' ? 'Camera & Prompter Overlay' : 'कैमरा और ओवरले प्रॉम्प्टर'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* ================= PANEL 4: VIDEO RECORDING ================= */
        <div className="relative bg-[#060A12] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col items-center justify-center min-h-[580px] sm:min-h-[640px]">
          {/* Main Video Viewport framed to selected Aspect Ratio */}
          <div
            className={`relative w-full overflow-hidden transition-all duration-300 flex items-center justify-center bg-black ${
              aspectRatio === '9:16'
                ? 'max-w-[360px] aspect-[9/16] rounded-2xl sm:rounded-3xl border border-slate-700 shadow-2xl'
                : aspectRatio === '4:3'
                ? 'max-w-2xl aspect-[4/3] rounded-2xl border border-slate-700 shadow-2xl'
                : aspectRatio === '1:1'
                ? 'max-w-md aspect-square rounded-2xl border border-slate-700 shadow-2xl'
                : 'max-w-4xl aspect-video rounded-2xl border border-slate-700 shadow-2xl'
            }`}
          >
            {/* Live Camera Feed or Fallback Presenter Preview */}
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
                {/* Simulated Presenter Avatar Graphic */}
                <div className="relative mb-3">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-3xl font-bold border-4 border-white/20 shadow-xl">
                    RT
                  </div>
                  {isRecording && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-600 border-2 border-white flex items-center justify-center animate-ping" />
                  )}
                </div>

                <p className="text-sm font-bold text-white">
                  {cameraError ? 'कैमरा अनुमति आवश्यक है' : 'कैमरा प्रीव्यू (सिमुलेशन)'}
                </p>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  {cameraError || 'Browser camera ready. You can record using connected camera or use file import.'}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={startCamera}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
                  >
                    कैमरा कनेक्ट करें
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

            {/* Countdown Overlay (3s / 5s) */}
            {countdownActive !== null && (
              <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-xs flex items-center justify-center">
                <div className="text-center animate-pulse">
                  <span className="text-7xl sm:text-8xl font-black text-amber-400 font-mono">
                    {countdownActive}
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-white uppercase tracking-widest mt-2">
                    {language === 'en' ? 'Ready to record...' : 'रिकॉर्डिंग शुरू होने वाली है...'}
                  </p>
                </div>
              </div>
            )}

            {/* FLOATING LEFT: Aspect Ratio Selector Pills (Exact Panel 4 reference) */}
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

            {/* FLOATING RIGHT: Semi-transparent Teleprompter Overlay (Exact Panel 4 reference) */}
            {showPrompterOverlay && (
              <div className="absolute top-4 right-3 bottom-20 z-30 w-52 sm:w-60 bg-black/65 backdrop-blur-md rounded-2xl border border-white/15 p-3 flex flex-col justify-between pointer-events-auto">
                <div className="flex items-center justify-between pb-1.5 border-b border-white/10 text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                  <span>प्रॉम्प्टर ओवरले</span>
                  <span className="font-mono text-white/80">{speedMultiplier}x</span>
                </div>

                <div
                  ref={overlayScrollRef}
                  className="flex-1 overflow-y-auto py-4 select-none"
                >
                  <div className="text-xs sm:text-sm font-bold text-[#FDE047] leading-relaxed space-y-4">
                    {scriptContent.split('\n\n').map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </div>

                <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Eye Level Guide</span>
                  <button
                    onClick={() => setShowPrompterOverlay(false)}
                    className="hover:text-white"
                  >
                    छिपाएं
                  </button>
                </div>
              </div>
            )}

            {/* Top Indicator inside Video: Live Rec Badge */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
              <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-xs font-mono">
                <span className={`w-2.5 h-2.5 rounded-full ${isRecording ? 'bg-red-500 animate-ping' : 'bg-slate-400'}`} />
                <span className="font-bold text-white">{isRecording ? 'REC' : 'STANDBY'}</span>
                <span className="text-amber-400 font-bold">{formatTimer(recordingTimer)}</span>
              </div>
            </div>
          </div>

          {/* PANEL 4 BOTTOM RECORDING DOCK (Exact Layout from Infographic) */}
          <div className="w-full max-w-4xl bg-[#0A101D] border-t border-slate-800 p-3 sm:p-4 mt-3 rounded-2xl flex flex-wrap items-center justify-between gap-3">
            {/* 1. Camera Switch Button */}
            <button
              onClick={toggleFlipCamera}
              className="flex flex-col items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center border border-slate-700">
                <SwitchCamera className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold">{language === 'en' ? 'Flip Cam' : 'कैमरा स्विच'}</span>
            </button>

            {/* 2. Microphone Toggle Button */}
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="flex flex-col items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                audioEnabled ? 'bg-slate-800 border-slate-700 text-emerald-400' : 'bg-red-950/40 border-red-800 text-red-400'
              }`}>
                {audioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </div>
              <span className="text-[10px] font-semibold">{audioEnabled ? (language === 'en' ? 'Mic On' : 'माइक ऑन') : (language === 'en' ? 'Mic Off' : 'माइक म्यूट')}</span>
            </button>

            {/* 3. Center Big Red Record Button */}
            <div className="flex flex-col items-center">
              {!isRecording ? (
                <button
                  onClick={handleInitiateRecording}
                  className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-600/40 ring-4 ring-red-600/30 active:scale-95 transition-all"
                  title="Start Recording"
                >
                  <span className="w-6 h-6 rounded-full bg-white" />
                </button>
              ) : (
                <button
                  onClick={handleStopRecording}
                  className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg shadow-red-600/40 ring-4 ring-red-600/30 animate-pulse transition-all"
                  title="Stop Recording"
                >
                  <span className="w-6 h-6 rounded-xs bg-white" />
                </button>
              )}
              <span className="text-[11px] font-bold text-white mt-1">
                {isRecording ? (language === 'en' ? 'Stop' : 'समाप्त करें') : (language === 'en' ? 'Record' : 'रिकॉर्ड करें')}
              </span>
            </div>

            {/* 4. Timer Display (00:00 / 01:00) */}
            <div className="flex flex-col items-center">
              <div className="bg-[#131D33] px-3 py-1.5 rounded-xl border border-slate-700 font-mono text-xs font-bold text-amber-400">
                {formatTimer(recordingTimer)} <span className="text-slate-500">/ 01:00</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1">
                {aspectRatio === '9:16' ? 'Reels Max 60s' : 'Standard'}
              </span>
            </div>

            {/* 5. Teleprompter Overlay Toggle */}
            <button
              onClick={() => setShowPrompterOverlay(!showPrompterOverlay)}
              className="flex flex-col items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                showPrompterOverlay ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}>
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold">{language === 'en' ? 'Prompter' : 'टेलीप्रॉम्प्टर'}</span>
            </button>

            {/* 6. Settings Gear */}
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="flex flex-col items-center gap-1 text-slate-300 hover:text-white transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center border border-slate-700">
                <Settings className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold">{language === 'en' ? 'Settings' : 'सेटिंग्स'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Settings Modal / Drawer (Shared for prompter and recording) */}
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

            {/* Pre-roll Countdown */}
            <div className="flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-slate-200">Pre-roll Countdown</p>
                <p className="text-[10px] text-slate-400">Countdown before recording starts</p>
              </div>
              <select
                value={countdownSeconds}
                onChange={(e) => setCountdownSeconds(parseInt(e.target.value, 10))}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-white"
              >
                <option value={3}>3 Seconds</option>
                <option value={5}>5 Seconds</option>
                <option value={0}>Instant (Off)</option>
              </select>
            </div>

            {/* Mirror Mode */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
              <div>
                <p className="font-semibold text-slate-200">Mirror Horizontal</p>
                <p className="text-[10px] text-slate-400">For teleprompter glass reflection rigs</p>
              </div>
              <button
                onClick={() => setMirrorMode(!mirrorMode)}
                className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                  mirrorMode ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  mirrorMode ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Hidden Video File Input */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-200">Import Pre-recorded Take</p>
                <p className="text-[10px] text-slate-400">Upload video from gallery or disk</p>
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

      {/* Hidden File Input for fallback uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="video/*"
        className="hidden"
      />

      {/* 4. POST-RECORDING REVIEW MODAL (Handoff to Video Studio) */}
      {reviewModalOpen && recordedVideoUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
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

            {/* Video Playback Preview */}
            <div className={`rounded-2xl overflow-hidden bg-black mx-auto border border-slate-700 relative ${
              aspectRatio === '9:16' ? 'max-w-[240px] aspect-[9/16]' : 'aspect-video'
            }`}>
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

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setReviewModalOpen(false);
                    setRecordedVideoUrl(null);
                    setRecordedBlob(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold transition-colors w-full sm:w-auto"
                >
                  {language === 'en' ? 'Retake Video' : 'दोबारा रिकॉर्ड करें'}
                </button>
                <a
                  href={recordedVideoUrl}
                  download={`scripter_recording_${Date.now()}.webm`}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  title="Download Raw Recording to Device"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>

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
    </div>
  );
};
