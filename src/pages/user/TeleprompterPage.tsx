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
  Film
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
    return selectedProject?.scriptSnippet || 'नमस्कार दोस्तों! आज हम बात करने वाले हैं कि कैसे आप अपने मोबाइल से बेहतर वीडियो कंटेंट बना सकते हैं...';
  };

  const [scriptContent, setScriptContent] = useState<string>(getInitialScript);
  const [isEditingScript, setIsEditingScript] = useState<boolean>(false);

  // Sync script if user selects different project
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
  const [activeMode, setActiveMode] = useState<'prompter' | 'record'>(defaultMode);

  // 3. Teleprompter Controls State
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(2); // 1 to 5
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0); // 0.8x, 1.0x, 1.5x, 2.0x
  const [fontSize, setFontSize] = useState<number>(24); // px
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
  const [videoEnabled, setVideoEnabled] = useState<boolean>(true);

  // 5. Post-recording review
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);

  // DOM Refs
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
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
        message = 'Camera permission was denied. Please allow camera and mic permissions in browser settings, or upload a video file.';
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

  // Teleprompter Auto-Scroll Loop
  useEffect(() => {
    if (isScrolling && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const step = scrollSpeed * speedMultiplier * 0.75;

      const interval = window.setInterval(() => {
        if (container) {
          container.scrollTop += step;
          // Loop check or stop at bottom
          if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
            setIsScrolling(false);
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
    if (showCountdown) {
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
    if (!cameraStream) {
      // If camera not ready, try starting or fallback
      startCamera();
      return;
    }

    recordedChunksRef.current = [];
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
      setIsRecording(true);
      setRecordingPaused(false);
      setRecordingTimer(0);
      setIsScrolling(true); // Automatically start scrolling with recording!
    } catch (err) {
      console.error('Failed to start MediaRecorder:', err);
      alert('Could not start video recording with current browser configuration.');
    }
  };

  // Pause / Resume Recording
  const handlePauseResumeRecording = () => {
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
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingPaused(false);
      setIsScrolling(false);
    }
  };

  // Reset Prompter Scroll to Top
  const handleResetScroll = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    setIsScrolling(false);
  };

  // Jump Back / Forward 10 seconds in script
  const handleJumpScroll = (direction: 'back' | 'forward') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'forward' ? 200 : -200;
      scrollContainerRef.current.scrollTop += offset;
    }
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

  // Accept Recording & Attach to Project
  const handleAcceptRecording = () => {
    if (!selectedProjectId || !recordedVideoUrl) return;

    const durationEst = recordingTimer > 0 ? recordingTimer : 42;
    const mediaSizeEst = recordedBlob ? `${(recordedBlob.size / (1024 * 1024)).toFixed(1)} MB` : '18.4 MB';

    const result = attachMediaToProject(selectedProjectId, {
      title: `Take ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      url: recordedVideoUrl,
      type: 'recorded',
      duration: durationEst,
      aspectRatio: '9:16',
      recordedAt: new Date().toISOString(),
      resolution: '1080p (Full HD)',
      fileSize: mediaSizeEst,
      mimeType: recordedBlob?.type || 'video/webm',
      trimStart: 0,
      trimEnd: durationEst,
      thumbnailUrl: '/assets/aistudio/Master_Admin_UI___________6_Visual_Assets_Management_bfd1be4e.png',
    });

    setReviewModalOpen(false);

    // Refresh projects list
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
    <div className={`min-h-screen ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'max-w-6xl mx-auto px-3 sm:px-6 py-4 pb-24 md:pb-12'}`}>
      {/* 1. Header Toolbar (Poster 1 Screen 1 & Poster 3 Screen 1) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs mb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Back & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/user/projects')}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Back to Projects"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                  <Film className="w-4 h-4 text-blue-600" />
                </span>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  {language === 'en' ? 'Teleprompter & Recording Studio' : 'टेलीप्रॉम्प्टर एवं रिकॉर्डिंग'}
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  Phase 3
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'en'
                  ? 'Read your script naturally while recording in-browser video.'
                  : 'प्राकृतिक रूप से स्क्रिप्ट पढ़ें और उच्च गुणवत्ता वीडियो रिकॉर्ड करें।'}
              </p>
            </div>
          </div>

          {/* Mode Switcher: Teleprompter Only vs Camera + Recording */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 border border-slate-200/70">
              <button
                onClick={() => {
                  setActiveMode('prompter');
                  stopCameraStreams();
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeMode === 'prompter'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Prompter Only' : 'केवल प्रॉम्प्टर'}</span>
              </button>

              <button
                onClick={() => setActiveMode('record')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeMode === 'record'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Camera Recording' : 'कैमरा रिकॉर्डिंग'}</span>
              </button>
            </div>

            {/* Hidden Video File Input for fallback */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="video/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Import pre-recorded video file from device"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'en' ? 'Import Video' : 'वीडियो जोड़ें'}</span>
            </button>
          </div>
        </div>

        {/* Project Selector & Script Selector Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">{language === 'en' ? 'Associated Project:' : 'प्रोजेक्ट:'}</span>
            <div className="relative">
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.category})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditingScript(!isEditingScript)}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold px-2.5 py-1 rounded-lg hover:bg-blue-50 transition-colors"
            >
              {isEditingScript
                ? (language === 'en' ? 'Done Editing' : 'एडिट पूरा हुआ')
                : (language === 'en' ? 'Edit Script Text' : 'स्क्रिप्ट संपादित करें')}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Studio Viewport (Camera / Prompter Frame) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Prompter & Camera Stage (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="relative bg-black rounded-3xl overflow-hidden border border-slate-800 shadow-xl min-h-[460px] sm:min-h-[520px] flex flex-col">
            {/* Camera Viewport when in 'record' mode */}
            {activeMode === 'record' && (
              <div className="absolute inset-0 z-0">
                {cameraStream ? (
                  <video
                    ref={videoPreviewRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${facingMode === 'user' ? '-scale-x-100' : ''}`}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-400 bg-slate-950">
                    <CameraOff className="w-12 h-12 text-slate-600 mb-3" />
                    <p className="text-sm font-semibold text-slate-200">
                      {cameraError || 'Camera is not active or permission was denied.'}
                    </p>
                    <p className="text-xs text-slate-500 max-w-sm mt-1">
                      You can test the teleprompter standalone, allow camera permissions in browser settings, or import a pre-recorded file.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 justify-center">
                      <button
                        onClick={startCamera}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
                      >
                        Retry Camera
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                      >
                        Upload Video File
                      </button>
                    </div>
                  </div>
                )}
                {/* Semi-transparent dark overlay so text is readable over camera */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/80 pointer-events-none" />
              </div>
            )}

            {/* Countdown Overlay (3s / 5s) */}
            {countdownActive !== null && (
              <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-xs flex items-center justify-center">
                <div className="text-center animate-pulse">
                  <span className="text-7xl sm:text-8xl font-black text-amber-400 font-mono">
                    {countdownActive}
                  </span>
                  <p className="text-sm font-bold text-white uppercase tracking-widest mt-3">
                    {language === 'en' ? 'Get Ready to Record...' : 'रिकॉर्डिंग शुरू होने वाली है...'}
                  </p>
                </div>
              </div>
            )}

            {/* Top Indicator Bar inside Prompter */}
            <div className="relative z-10 p-3 sm:p-4 flex items-center justify-between text-white/90">
              <div className="flex items-center gap-2">
                {activeMode === 'record' && (
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-mono">
                    <span className={`w-2.5 h-2.5 rounded-full ${isRecording ? 'bg-red-500 animate-ping' : 'bg-slate-400'}`} />
                    <span className="font-bold">{isRecording ? 'REC' : 'STANDBY'}</span>
                    <span className="text-amber-300 font-bold">{formatTimer(recordingTimer)}</span>
                  </div>
                )}
                <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[11px] font-medium text-slate-300">
                  {selectedProject?.title}
                </span>
              </div>

              {/* Quick Actions (Flip Camera, Fullscreen) */}
              <div className="flex items-center gap-1.5">
                {activeMode === 'record' && (
                  <button
                    onClick={toggleFlipCamera}
                    className="p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white/90 border border-white/10 transition-colors"
                    title="Flip Camera (Front/Back)"
                  >
                    <SwitchCamera className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white/90 border border-white/10 transition-colors"
                  title="Toggle Fullscreen"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Reading Guide Marker / Highlight Frame (Poster 3 Screen 2) */}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-20 border-y-2 border-amber-400/40 bg-amber-400/5 pointer-events-none z-10">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] uppercase tracking-wider font-mono font-bold text-amber-300/80 bg-black/50 px-1.5 py-0.5 rounded">
                Eye Level Guide
              </span>
            </div>

            {/* Scrolling Script Container */}
            <div
              ref={scrollContainerRef}
              className={`relative z-10 flex-1 overflow-y-auto px-6 sm:px-12 py-32 text-center select-none transition-all ${
                mirrorMode ? '-scale-x-100' : ''
              } ${
                themeMode === 'light' && activeMode === 'prompter'
                  ? 'bg-slate-50 text-slate-900'
                  : 'text-white'
              }`}
            >
              {isEditingScript ? (
                <textarea
                  value={scriptContent}
                  onChange={(e) => setScriptContent(e.target.value)}
                  className="w-full h-80 p-4 rounded-2xl bg-black/80 border border-amber-400 text-amber-200 text-sm font-medium focus:outline-hidden resize-none leading-relaxed text-left"
                  placeholder="Enter or paste your script..."
                />
              ) : (
                <div
                  style={{
                    fontSize: `${fontSize}px`,
                    lineHeight: '1.7',
                  }}
                  className={`max-w-2xl mx-auto font-medium transition-all ${
                    textColor === 'yellow'
                      ? 'text-amber-300'
                      : textColor === 'amber'
                      ? 'text-amber-400'
                      : 'text-slate-100'
                  }`}
                >
                  {scriptContent.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-8">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Playback & Scrolling Control Bar (Poster 1 Screen 1 & Poster 3 Screen 2) */}
            <div className="relative z-20 bg-black/80 backdrop-blur-md p-3 sm:p-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              {/* Left: Jump Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleJumpScroll('back')}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Rewind 10s"
                >
                  <Rewind className="w-4 h-4" />
                </button>
                <button
                  onClick={handleResetScroll}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Reset to Top"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleJumpScroll('forward')}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Forward 10s"
                >
                  <FastForward className="w-4 h-4" />
                </button>
              </div>

              {/* Center: Primary Play / Record Button */}
              <div className="flex items-center gap-3">
                {activeMode === 'prompter' ? (
                  <button
                    onClick={() => setIsScrolling(!isScrolling)}
                    className="px-6 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-400/20 transition-all"
                  >
                    {isScrolling ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-slate-950" />}
                    <span>{isScrolling ? 'Pause Scroll' : 'Start Scroll'}</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    {!isRecording ? (
                      <button
                        onClick={handleInitiateRecording}
                        className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all"
                      >
                        <span className="w-3 h-3 rounded-full bg-white" />
                        <span>{language === 'en' ? 'Start Recording' : 'रिकॉर्ड करें'}</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handlePauseResumeRecording}
                          className="px-4 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                        >
                          {recordingPaused ? <Play className="w-3.5 h-3.5 fill-white" /> : <Pause className="w-3.5 h-3.5" />}
                          <span>{recordingPaused ? 'Resume' : 'Pause'}</span>
                        </button>
                        <button
                          onClick={handleStopRecording}
                          className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-red-600/30 transition-all"
                        >
                          <span className="w-2.5 h-2.5 bg-white rounded-xs" />
                          <span>{language === 'en' ? 'Finish & Review' : 'समाप्त करें'}</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Right: Speed Multiplier Chips */}
              <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl">
                {[0.8, 1.0, 1.5, 2.0].map((mult) => (
                  <button
                    key={mult}
                    onClick={() => setSpeedMultiplier(mult)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold transition-colors ${
                      speedMultiplier === mult
                        ? 'bg-amber-400 text-slate-950 shadow-2xs'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {mult.toFixed(1)}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Prompter & Hardware Settings Panel (4 cols) (Poster 1 Screen 1 & Poster 3 Screen 1) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Settings className="w-4 h-4 text-blue-600" />
                <span>{language === 'en' ? 'Teleprompter Settings' : 'प्रॉम्प्टर सेटिंग्स'}</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">v3.0</span>
            </div>

            {/* Reading Speed Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">
                  {language === 'en' ? 'Scroll Speed' : 'स्क्रॉल स्पीड'}
                </span>
                <span className="font-mono text-blue-600 font-bold">
                  {(scrollSpeed * speedMultiplier).toFixed(1)}x
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={0.5}
                value={scrollSpeed}
                onChange={(e) => setScrollSpeed(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            {/* Font Size Adjuster */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">
                  {language === 'en' ? 'Font Size' : 'फ़ॉन्ट साइज'}
                </span>
                <span className="font-mono text-slate-500 font-bold">{fontSize}px</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFontSize((prev) => Math.max(16, prev - 2))}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  A-
                </button>
                <input
                  type="range"
                  min={16}
                  max={40}
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                  className="w-full accent-blue-600"
                />
                <button
                  onClick={() => setFontSize((prev) => Math.min(40, prev + 2))}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Text Color Selection */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-700">
                {language === 'en' ? 'Text Color' : 'टेक्स्ट रंग'}
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'yellow', label: 'Yellow', bg: 'bg-amber-300 text-slate-950' },
                  { id: 'white', label: 'White', bg: 'bg-white border text-slate-800' },
                  { id: 'amber', label: 'Amber', bg: 'bg-amber-500 text-white' },
                ].map((col) => (
                  <button
                    key={col.id}
                    onClick={() => setTextColor(col.id as any)}
                    className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${col.bg} ${
                      textColor === col.id ? 'ring-2 ring-blue-600 ring-offset-1' : 'opacity-80'
                    }`}
                  >
                    {col.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Background Theme */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-700">
                {language === 'en' ? 'Background Style' : 'बैकग्राउंड'}
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'dark', label: 'Dark' },
                  { id: 'light', label: 'Light' },
                  { id: 'minimal', label: 'Minimal' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setThemeMode(m.id as any)}
                    className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      themeMode === m.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mirror Mode Toggle (for teleprompter glass rigs) */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-800">
                  {language === 'en' ? 'Mirror Mode (Flip)' : 'मिरर मोड'}
                </p>
                <p className="text-[11px] text-slate-400">Flip text horizontally for glass rigs</p>
              </div>
              <button
                onClick={() => setMirrorMode(!mirrorMode)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  mirrorMode ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    mirrorMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Countdown Configuration */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-800">
                  {language === 'en' ? 'Pre-roll Countdown' : 'काउंटडाउन टाइमर'}
                </p>
                <p className="text-[11px] text-slate-400">Countdown before recording starts</p>
              </div>
              <select
                value={countdownSeconds}
                onChange={(e) => setCountdownSeconds(parseInt(e.target.value, 10))}
                className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
              >
                <option value={3}>3s</option>
                <option value={5}>5s</option>
                <option value={0}>Off</option>
              </select>
            </div>
          </div>

          {/* Quick Guide Box */}
          <div className="bg-blue-50/70 rounded-3xl p-4 border border-blue-100 text-xs text-blue-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-blue-800">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>{language === 'en' ? 'Creator Pro Tips' : 'क्रिएटर टिप्स'}</span>
            </div>
            <ul className="space-y-1 text-slate-600 text-[11px] list-disc list-inside">
              <li>Position your phone at eye level so you look directly into the lens.</li>
              <li>Use the Eye Level Guide marker to stay aligned while speaking.</li>
              <li>After recording, preview and trim your video in the Video Studio.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Review Recording Modal (Poster 3 Screen 4 & 5) */}
      {reviewModalOpen && recordedVideoUrl && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'en' ? 'Review Your Recording' : 'रिकॉर्डिंग की समीक्षा करें'}
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500">
                {formatTimer(recordingTimer || 42)}
              </span>
            </div>

            {/* Video Playback Preview */}
            <div className="rounded-2xl overflow-hidden bg-black aspect-video border border-slate-800 relative">
              <video
                src={recordedVideoUrl}
                controls
                playsInline
                className="w-full h-full object-contain"
              />
            </div>

            {/* Metadata Badges */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Duration</p>
                <p className="font-bold text-slate-800">{recordingTimer || 42}s</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Format</p>
                <p className="font-bold text-slate-800">1080p MP4/WebM</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Project</p>
                <p className="font-bold text-slate-800 truncate">{selectedProject?.title}</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setReviewModalOpen(false);
                    setRecordedVideoUrl(null);
                    setRecordedBlob(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors w-full sm:w-auto"
                >
                  {language === 'en' ? 'Retake Video' : 'दोबारा रिकॉर्ड करें'}
                </button>
                <a
                  href={recordedVideoUrl}
                  download={`scripter_recording_${Date.now()}.webm`}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  title="Download Raw Recording to Device"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>

              <button
                onClick={handleAcceptRecording}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-colors w-full sm:w-auto"
              >
                <Save className="w-4 h-4" />
                <span>{language === 'en' ? 'Accept & Open in Video Studio' : 'स्वीकारें व वीडियो एडिटर खोलें'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
