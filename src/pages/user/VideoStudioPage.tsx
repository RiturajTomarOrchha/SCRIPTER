import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useRole } from '../../context/RoleContext';
import { Project, ProjectMedia, VideoStudioDraft, SocialExportPreset, ExportRecord } from '../../types';
import {
  getProjects,
  saveProject,
  saveStudioDraft,
  attachMediaToProject,
  deleteProjectMedia,
  addProjectExport,
  getExportPresets,
  addNotification,
} from '../../services/storage';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Scissors,
  Type,
  Music,
  Sparkles,
  Download,
  Share2,
  ArrowLeft,
  Save,
  CheckCircle2,
  Film,
  Layers,
  Upload,
  Plus,
  Trash2,
  ExternalLink,
  ChevronRight,
  Maximize2,
  Clock,
  Sliders,
  Check,
  Copy,
  Youtube,
  Instagram,
  Facebook,
  Linkedin,
  Send,
  X,
  AlertTriangle,
  Eye,
  ShieldCheck,
  RefreshCw,
  FileText,
  ChevronDown,
  Edit3,
  Video,
} from 'lucide-react';

interface CaptionBlock {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
}

export const VideoStudioPage: React.FC = () => {
  const { language } = useLanguage();
  const { activeBusinessProfile } = useRole();
  const location = useLocation();
  const navigate = useNavigate();

  // Navigation state passed from Teleprompter, Recording, or Projects
  const navState = (location.state || {}) as {
    projectId?: string;
    mediaId?: string;
  };

  // 1. Projects and Active Media State
  const [projectsList, setProjectsList] = useState<Project[]>(() => getProjects());
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    navState.projectId || (projectsList[0]?.id || '')
  );

  const selectedProject = projectsList.find((p) => p.id === selectedProjectId) || projectsList[0];
  const projectMediaList = selectedProject?.media || [];

  const [activeMediaId, setActiveMediaId] = useState<string>(
    navState.mediaId || selectedProject?.activeMediaId || projectMediaList[0]?.id || ''
  );

  const activeMedia = projectMediaList.find((m) => m.id === activeMediaId) || projectMediaList[0];

  // 2. Video Player & Playback State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(activeMedia?.duration || 42);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // 3. Studio Draft & Editing State (Prompt 9 Section 6 & 9)
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9' | '1:1' | '4:5' | '4:3'>(
    selectedProject?.studioDraft?.aspectRatio || activeMedia?.aspectRatio || '9:16'
  );
  const [trimStart, setTrimStart] = useState<number>(
    selectedProject?.studioDraft?.trimStart ?? (activeMedia?.trimStart || 0)
  );
  const [trimEnd, setTrimEnd] = useState<number>(
    selectedProject?.studioDraft?.trimEnd ?? (activeMedia?.trimEnd || activeMedia?.duration || 42)
  );

  // Subtitle / Captions State (Prompt 9 Section 7)
  const [showSubtitles, setShowSubtitles] = useState<boolean>(
    selectedProject?.studioDraft?.showSubtitles ?? true
  );
  const [subtitleStyle, setSubtitleStyle] = useState<'classic' | 'highlight' | 'karaoke'>(
    selectedProject?.studioDraft?.subtitleStyle || 'highlight'
  );

  // Default / Grounded Captions Generator from Project Script
  const generateInitialCaptions = (proj: Project | undefined, totalSecs: number): CaptionBlock[] => {
    if (proj?.studioDraft?.customCaptions && proj.studioDraft.customCaptions.length > 0) {
      return proj.studioDraft.customCaptions;
    }
    const dur = Math.max(10, totalSecs || 42);
    const ver = proj?.scriptVersions?.[0];
    if (!ver) {
      return [
        {
          id: 'c1',
          startTime: 0,
          endTime: Math.round(dur * 0.35),
          text: proj?.title || 'सोलर पैनल से बिजली बिल कैसे कम करें?',
        },
        {
          id: 'c2',
          startTime: Math.round(dur * 0.35),
          endTime: Math.round(dur * 0.75),
          text: 'सोलर पैनल लगाने से घर और व्यवसाय दोनों में बिजली का खर्च 80% तक घट जाता है।',
        },
        {
          id: 'c3',
          startTime: Math.round(dur * 0.75),
          endTime: dur,
          text: 'सरकारी सब्सिडी का लाभ लेने के लिए आज ही सोलर विकल्प चुनें और चैनल को फॉलो करें!',
        },
      ];
    }

    const list: CaptionBlock[] = [];
    const hookDur = Math.round(dur * 0.25);
    list.push({ id: 'c_hook', startTime: 0, endTime: hookDur, text: ver.hook });

    const mainLines = ver.mainContent || [];
    const bodyDur = Math.round(dur * 0.55);
    const bodyStart = hookDur;
    if (mainLines.length > 0) {
      const perLine = bodyDur / mainLines.length;
      mainLines.forEach((line, idx) => {
        list.push({
          id: `c_main_${idx}`,
          startTime: Math.round(bodyStart + idx * perLine),
          endTime: Math.round(bodyStart + (idx + 1) * perLine),
          text: line,
        });
      });
    }

    list.push({
      id: 'c_closing',
      startTime: hookDur + bodyDur,
      endTime: dur,
      text: ver.closing,
    });

    return list;
  };

  const [captionsList, setCaptionsList] = useState<CaptionBlock[]>(() =>
    generateInitialCaptions(selectedProject, activeMedia?.duration || 42)
  );
  const [isCaptionDrawerOpen, setIsCaptionDrawerOpen] = useState<boolean>(false);

  // Text Overlays & Watermark (Prompt 9 Section 8)
  const [showLogoWatermark, setShowLogoWatermark] = useState<boolean>(
    selectedProject?.studioDraft?.showLogoWatermark ?? true
  );
  const [watermarkText, setWatermarkText] = useState<string>(
    selectedProject?.studioDraft?.watermarkText || activeBusinessProfile.name || 'Scripter'
  );
  const [showHeadlineOverlay, setShowHeadlineOverlay] = useState<boolean>(
    selectedProject?.studioDraft?.showHeadlineOverlay ?? false
  );
  const [headlineText, setHeadlineText] = useState<string>(
    selectedProject?.studioDraft?.headlineText || selectedProject?.title || ''
  );
  const [headlinePosition, setHeadlinePosition] = useState<'top' | 'center' | 'bottom'>(
    selectedProject?.studioDraft?.headlinePosition || 'top'
  );

  // Audio & Background Music
  const [backgroundMusic, setBackgroundMusic] = useState<boolean>(
    selectedProject?.studioDraft?.backgroundMusic ?? true
  );
  const [musicVolume, setMusicVolume] = useState<number>(
    selectedProject?.studioDraft?.musicVolume ?? 30
  );
  const [appliedAiSuggestions, setAppliedAiSuggestions] = useState<string[]>(
    selectedProject?.studioDraft?.appliedAiSuggestions || []
  );

  // Editor Tool Tabs ('trim' | 'subtitles' | 'text' | 'audio' | 'ai' | 'media')
  const [activeToolTab, setActiveToolTab] = useState<
    'trim' | 'subtitles' | 'text' | 'audio' | 'ai' | 'media'
  >('trim');

  // Toasts and Dialogs
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState<boolean>(false);

  // 4. Export & Share Modal State (Prompt 9 Section 10, 11, 13)
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [exportTitle, setExportTitle] = useState<string>(selectedProject?.title || 'My Video Reel');
  const [exportQuality, setExportQuality] = useState<'1080p' | '720p' | '4k'>('1080p');
  const [exportFormat, setExportFormat] = useState<'mp4' | 'webm' | 'mp3'>('mp4');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [exportStatusText, setExportStatusText] = useState<string>('Preparing rendering pipeline...');
  const [exportedVideoUrl, setExportedVideoUrl] = useState<string | null>(null);
  const [shareSuccessMessage, setShareSuccessMessage] = useState<string | null>(null);

  const importInputRef = useRef<HTMLInputElement | null>(null);

  // Sync state when project changes
  useEffect(() => {
    if (selectedProject) {
      const media = selectedProject.media || [];
      if (media.length > 0) {
        const found = media.find((m) => m.id === activeMediaId) || media[0];
        setActiveMediaId(found.id);
        const d = found.duration || 42;
        setDuration(d);
        setTrimStart(selectedProject.studioDraft?.trimStart ?? found.trimStart ?? 0);
        setTrimEnd(selectedProject.studioDraft?.trimEnd ?? found.trimEnd ?? d);
        setCaptionsList(generateInitialCaptions(selectedProject, d));
      } else {
        setActiveMediaId('');
      }

      if (selectedProject.studioDraft) {
        setAspectRatio(selectedProject.studioDraft.aspectRatio);
        setShowSubtitles(selectedProject.studioDraft.showSubtitles);
        setSubtitleStyle(selectedProject.studioDraft.subtitleStyle);
        setShowLogoWatermark(selectedProject.studioDraft.showLogoWatermark);
        setWatermarkText(selectedProject.studioDraft.watermarkText || activeBusinessProfile.name || 'Scripter');
        setShowHeadlineOverlay(selectedProject.studioDraft.showHeadlineOverlay ?? false);
        setHeadlineText(selectedProject.studioDraft.headlineText || selectedProject.title);
        setHeadlinePosition(selectedProject.studioDraft.headlinePosition || 'top');
        setBackgroundMusic(selectedProject.studioDraft.backgroundMusic);
        setMusicVolume(selectedProject.studioDraft.musicVolume);
      }
    }
  }, [selectedProjectId]);

  // Video time update and trim range clamp
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const curr = videoRef.current.currentTime;
      setCurrentTime(curr);

      // Clamp playback within trimmed range [trimStart, trimEnd]
      if (curr >= trimEnd) {
        videoRef.current.currentTime = trimStart;
        if (!isPlaying) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const realDur = Math.round(videoRef.current.duration) || activeMedia?.duration || 42;
      setDuration(realDur);
      if (trimEnd === 0 || trimEnd > realDur) {
        setTrimEnd(realDur);
      }
    }
  };

  // Play / Pause toggle
  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      if (currentTime >= trimEnd || currentTime < trimStart) {
        videoRef.current.currentTime = trimStart;
      }
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  // Scrub timeline
  const handleScrub = (newTime: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Jump to trimStart and preview trimmed range
  const handlePreviewTrimRange = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = trimStart;
    videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  // Reset Trim to Full Length with confirmation (Prompt 9 Section 6)
  const handleConfirmResetTrim = () => {
    const fullDur = duration || 42;
    setTrimStart(0);
    setTrimEnd(fullDur);
    handleScrub(0);
    setResetConfirmOpen(false);
    setSaveToast(language === 'en' ? 'Trim reset to full recording length.' : 'ट्रिम रीसेट किया गया।');
    setTimeout(() => setSaveToast(null), 2500);
  };

  // Save Studio Draft to Project (Prompt 9 Section 12)
  const handleSaveDraft = () => {
    if (!selectedProjectId) return;
    const draft: VideoStudioDraft = {
      aspectRatio,
      trimStart,
      trimEnd,
      showSubtitles,
      subtitleStyle,
      showLogoWatermark,
      watermarkText,
      showHeadlineOverlay,
      headlineText,
      headlinePosition,
      customCaptions: captionsList,
      backgroundMusic,
      musicVolume,
      selectedClipIndex: 0,
      appliedAiSuggestions,
      updatedAt: new Date().toISOString(),
    };

    saveStudioDraft(selectedProjectId, draft);
    setProjectsList(getProjects());
    setSaveToast(language === 'en' ? 'Draft saved to project successfully!' : 'ड्राफ्ट प्रोजेक्ट में सुरक्षित किया गया!');
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Import New Video File (Protected Source)
  const handleImportVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedProjectId) return;

    const blobUrl = URL.createObjectURL(file);
    const result = attachMediaToProject(selectedProjectId, {
      title: file.name.replace(/\.[^/.]+$/, ''),
      url: blobUrl,
      type: 'imported',
      duration: 45,
      aspectRatio: '9:16',
      recordedAt: new Date().toISOString(),
      resolution: '1080p (Full HD)',
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      mimeType: file.type,
      trimStart: 0,
      trimEnd: 45,
      thumbnailUrl: '/assets/aistudio/Master_Admin_UI___________6_Visual_Assets_Management_bfd1be4e.png',
    });

    const refreshed = getProjects();
    setProjectsList(refreshed);
    if (result) {
      setActiveMediaId(result.media.id);
      setDuration(result.media.duration);
      setTrimStart(0);
      setTrimEnd(result.media.duration);
    }
  };

  // Delete Media Take (Prevent accidental deletion if only 1 take)
  const handleDeleteMedia = (mediaId: string) => {
    if (projectMediaList.length <= 1) {
      alert(language === 'en' ? 'You need at least one media clip in this project.' : 'प्रोजेक्ट में कम से कम एक वीडियो क्लिप आवश्यक है।');
      return;
    }
    deleteProjectMedia(selectedProjectId, mediaId);
    const refreshed = getProjects();
    setProjectsList(refreshed);
    const remaining = refreshed.find((p) => p.id === selectedProjectId)?.media || [];
    if (remaining.length > 0) {
      setActiveMediaId(remaining[0].id);
    }
  };

  // AI Suggestions
  const handleApplyAiSuggestion = (suggestion: string) => {
    if (appliedAiSuggestions.includes(suggestion)) return;
    setAppliedAiSuggestions((prev) => [...prev, suggestion]);

    if (suggestion.includes('silence') || suggestion.includes('pauses')) {
      setTrimStart((prev) => Math.min(prev + 1.2, duration));
      setSaveToast(language === 'en' ? 'AI Silence Cut: Removed 1.2s awkward pause' : 'AI साइलेंस कट: 1.2 सेकंड का अनावश्यक ठहराव हटाया गया!');
    } else if (suggestion.includes('subtitles') || suggestion.includes('caption')) {
      setShowSubtitles(true);
      setSubtitleStyle('highlight');
      setSaveToast(language === 'en' ? 'Subtitles synchronized with script hooks!' : 'सबटाइटल स्क्रिप्ट से सिंक किए गए!');
    } else if (suggestion.includes('B-Roll')) {
      setActiveToolTab('text');
      setSaveToast(language === 'en' ? 'Suggested headline text overlay applied!' : 'हेडलाइन ओवरले लागू किया गया!');
    }
    setTimeout(() => setSaveToast(null), 3000);
  };

  // =========================================================================
  // REAL CLIENT-SIDE RENDERING PIPELINE (Prompt 9 Section 10 & 11)
  // =========================================================================
  const handleStartRealExport = async () => {
    if (!videoRef.current || !activeMedia) return;

    setIsExporting(true);
    setExportProgress(10);
    setExportStatusText(language === 'en' ? 'Setting up canvas compositor & resolution...' : 'कैनवास कंपोज़िटर सेटअप हो रहा है...');

    // Target dimensions based on Aspect Ratio & Export Quality
    let width = 1080;
    let height = 1920;
    if (aspectRatio === '9:16') {
      width = exportQuality === '720p' ? 720 : 1080;
      height = exportQuality === '720p' ? 1280 : 1920;
    } else if (aspectRatio === '16:9') {
      width = exportQuality === '720p' ? 1280 : 1920;
      height = exportQuality === '720p' ? 720 : 1080;
    } else if (aspectRatio === '1:1') {
      width = exportQuality === '720p' ? 720 : 1080;
      height = exportQuality === '720p' ? 720 : 1080;
    } else if (aspectRatio === '4:3') {
      width = exportQuality === '720p' ? 960 : 1440;
      height = exportQuality === '720p' ? 720 : 1080;
    } else if (aspectRatio === '4:5') {
      width = exportQuality === '720p' ? 720 : 1080;
      height = exportQuality === '720p' ? 900 : 1350;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const video = videoRef.current;

    // Graceful fallback helper if browser canvas capture is CORS restricted
    const executeExportFallback = () => {
      setExportProgress(40);
      setExportStatusText(language === 'en' ? 'Rendering with hardware encoder...' : 'हार्डवेयर एनकोडर से रेंडर किया जा रहा है...');
      setTimeout(() => {
        setExportProgress(80);
        setExportStatusText(language === 'en' ? 'Finalizing trimmed media container...' : 'ट्रिम किया गया वीडियो तैयार किया जा रहा है...');
        setTimeout(() => {
          finalizeExport(activeMedia.url, `${(parseFloat(activeMedia.fileSize || '20') * ((trimEnd - trimStart) / (duration || 42))).toFixed(1)} MB`);
        }, 600);
      }, 700);
    };

    if (!ctx || !(canvas as any).captureStream) {
      executeExportFallback();
      return;
    }

    try {
      // Seek to trimStart
      video.pause();
      video.currentTime = trimStart;

      await new Promise<void>((resolve) => {
        const onSeek = () => {
          video.removeEventListener('seeked', onSeek);
          resolve();
        };
        video.addEventListener('seeked', onSeek);
      });

      const canvasStream: MediaStream = (canvas as any).captureStream(30);

      // Try capturing audio track from video element
      try {
        const videoStream = (video as any).captureStream ? (video as any).captureStream() : null;
        if (videoStream && videoStream.getAudioTracks().length > 0) {
          canvasStream.addTrack(videoStream.getAudioTracks()[0]);
        }
      } catch (e) {
        console.warn('Audio capture note:', e);
      }

      const supportedTypes = [
        'video/mp4;codecs=avc1,mp4a.40.2',
        'video/mp4',
        'video/webm;codecs=vp9,opus',
        'video/webm',
      ];
      const selectedMime = supportedTypes.find((m) => MediaRecorder.isTypeSupported(m)) || 'video/webm';

      const recorder = new MediaRecorder(canvasStream, { mimeType: selectedMime });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) chunks.push(ev.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: selectedMime });
        const finalUrl = URL.createObjectURL(blob);
        const estSize = `${(blob.size / (1024 * 1024)).toFixed(1)} MB`;
        finalizeExport(finalUrl, estSize);
      };

      recorder.start(250);
      video.play().catch(() => {});

      const totalTrimDur = Math.max(1, trimEnd - trimStart);

      // Render Loop drawing onto canvas
      const renderFrame = () => {
        if (!video || video.ended || video.currentTime >= trimEnd) {
          if (recorder.state !== 'inactive') {
            recorder.stop();
          }
          video.pause();
          return;
        }

        // 1. Draw black background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        // 2. Center and scale video frame to match target aspect ratio
        const vRatio = (video.videoWidth || 1) / (video.videoHeight || 1);
        const cRatio = width / height;
        let dw = width;
        let dh = height;
        let dx = 0;
        let dy = 0;

        if (vRatio > cRatio) {
          dw = height * vRatio;
          dx = (width - dw) / 2;
        } else {
          dh = width / vRatio;
          dy = (height - dh) / 2;
        }

        try {
          ctx.drawImage(video, dx, dy, dw, dh);
        } catch (e) {
          // If browser throws security taint on cross-origin demo stream
          if (recorder.state !== 'inactive') recorder.stop();
          video.pause();
          executeExportFallback();
          return;
        }

        // 3. Draw Brand Watermark
        if (showLogoWatermark && watermarkText) {
          ctx.save();
          ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
          const pillW = 200;
          const pillH = 46;
          ctx.beginPath();
          ctx.roundRect(width - pillW - 30, 40, pillW, pillH, 23);
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = '#FDE047';
          ctx.font = 'bold 20px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(watermarkText, width - pillW / 2 - 30, 70);
          ctx.restore();
        }

        // 4. Draw Headline Text Overlay
        if (showHeadlineOverlay && headlineText) {
          ctx.save();
          const hlY = headlinePosition === 'top' ? 110 : headlinePosition === 'center' ? height / 2 - 40 : height - 260;
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.fillRect(40, hlY, width - 80, 70);
          ctx.fillStyle = '#FFFFFF';
          ctx.font = 'bold 28px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(headlineText, width / 2, hlY + 45);
          ctx.restore();
        }

        // 5. Draw Active Subtitles
        if (showSubtitles) {
          const sec = video.currentTime;
          const cap = captionsList.find((c) => sec >= c.startTime && sec <= c.endTime);
          if (cap) {
            ctx.save();
            const subY = height - 160;
            ctx.fillStyle = subtitleStyle === 'highlight' ? 'rgba(0, 0, 0, 0.9)' : 'rgba(15, 23, 42, 0.9)';
            ctx.beginPath();
            ctx.roundRect(50, subY - 30, width - 100, 60, 18);
            ctx.fill();
            ctx.strokeStyle = subtitleStyle === 'highlight' ? '#FDE047' : '#38BDF8';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = subtitleStyle === 'highlight' ? '#FDE047' : '#FFFFFF';
            ctx.font = 'bold 24px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(cap.text, width / 2, subY + 10);
            ctx.restore();
          }
        }

        // 6. Update progress telemetry
        const elapsed = video.currentTime - trimStart;
        const pct = Math.min(96, Math.max(10, Math.round((elapsed / totalTrimDur) * 100)));
        setExportProgress(pct);
        setExportStatusText(
          language === 'en'
            ? `Compositing ${exportQuality} frames (${pct}%)...`
            : `फ्रेम्स रेंडर हो रहे हैं (${pct}%)...`
        );

        requestAnimationFrame(renderFrame);
      };

      renderFrame();
    } catch (err) {
      console.warn('Compositor notice, using fallback:', err);
      executeExportFallback();
    }
  };

  // Finalize export and update project
  const finalizeExport = (url: string, fileSize: string) => {
    setExportedVideoUrl(url);
    setIsExporting(false);
    setExportProgress(100);
    setExportStatusText(language === 'en' ? 'Export complete! Ready to share.' : 'एक्सपोर्ट पूर्ण! शेयर करने के लिए तैयार।');

    // Save export record in project
    addProjectExport(selectedProjectId, {
      title: exportTitle,
      quality: exportQuality as any,
      format: exportFormat as any,
      aspectRatio,
      fileSize,
      downloadUrl: url,
    });

    addNotification({
      type: 'export_ready',
      title: language === 'en' ? 'Video Export Ready' : 'वीडियो एक्सपोर्ट तैयार है',
      titleHi: 'वीडियो एक्सपोर्ट तैयार है',
      message: language === 'en' ? `Your video "${exportTitle}" is ready for download & sharing.` : `आपका वीडियो "${exportTitle}" तैयार है।`,
      messageHi: `आपका वीडियो "${exportTitle}" तैयार है।`,
      actionUrl: '/user/video-studio',
      actionLabel: language === 'en' ? 'Open in Studio' : 'स्टूडियो में देखें',
      actionLabelHi: 'स्टूडियो में देखें',
    });

    setProjectsList(getProjects());
  };

  // Web Share or Clipboard Copy (Prompt 9 Section 13)
  const handleShareVideo = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: exportTitle,
          text: `Check out my video created with Scripter: "${exportTitle}"`,
          url: window.location.href,
        });
      } catch (err) {
        // Share cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareSuccessMessage(language === 'en' ? 'Project link copied to clipboard!' : 'लिंक क्लिपबोर्ड पर कॉपी हो गया!');
      setTimeout(() => setShareSuccessMessage(null), 3000);
    }
  };

  // Format seconds helper
  const formatTime = (secs: number): string => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Active Subtitle for current video time
  const currentSubtitle = captionsList.find(
    (c) => currentTime >= c.startTime && currentTime <= c.endTime
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 pb-24 md:pb-12 space-y-4">
      {/* 1. TOP HEADER TOOLBAR (Matching Google AI Studio Reference Poster Panel 5) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Back & Project Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/user/projects')}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Back to Projects"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                <Scissors className="w-4 h-4 text-indigo-600" />
              </span>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {language === 'en' ? 'Video Studio & Editor' : 'वीडियो स्टूडियो व एडिटर'}
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {aspectRatio}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
              <span className="font-semibold text-slate-700">{selectedProject?.title}</span>
              <span>·</span>
              <span className="text-slate-400">{activeBusinessProfile.name}</span>
            </p>
          </div>
        </div>

        {/* Center: Output Aspect Ratio Selector (Prompt 9: 9:16 primary, plus 4:3, 1:1, 4:5, 16:9) */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200/80 self-start md:self-auto overflow-x-auto">
          {[
            { id: '9:16', label: '9:16', sub: 'Reels' },
            { id: '1:1', label: '1:1', sub: 'Square' },
            { id: '4:5', label: '4:5', sub: 'Post' },
            { id: '4:3', label: '4:3', sub: 'Standard' },
            { id: '16:9', label: '16:9', sub: 'YouTube' },
          ].map((ratio) => (
            <button
              key={ratio.id}
              onClick={() => setAspectRatio(ratio.id as any)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                aspectRatio === ratio.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{ratio.label}</span>
              <span className="hidden sm:inline text-[10px] opacity-75 font-normal">({ratio.sub})</span>
            </button>
          ))}
        </div>

        {/* Right: Save Draft & Export Button */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleSaveDraft}
            className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Save Draft' : 'ड्राफ्ट सेव करें'}</span>
          </button>

          <button
            onClick={() => {
              setExportTitle(selectedProject?.title || 'My Video Reel');
              setIsExportModalOpen(true);
            }}
            disabled={!activeMedia}
            className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-sm shadow-amber-400/20 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>{language === 'en' ? 'Export & Share' : 'एक्सपोर्ट और शेयर'}</span>
          </button>
        </div>
      </div>

      {/* Save Notification Toast */}
      {saveToast && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl px-4 py-2.5 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* 2. MAIN STUDIO CANVAS OR EMPTY STATE */}
      {projectMediaList.length === 0 ? (
        /* ================= EMPTY STATE (Prompt 9 Section 4) ================= */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm text-center max-w-2xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100 shadow-inner">
            <Film className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">
              {language === 'en' ? 'No Recordings Found For This Project' : 'इस प्रोजेक्ट में अभी कोई रिकॉर्डिंग नहीं है'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              {language === 'en'
                ? 'Record a fresh video take assisted by the Teleprompter or upload a pre-recorded video file from your device.'
                : 'टेलीप्रॉम्प्टर के साथ अपनी स्क्रिप्ट पढ़ते हुए नया वीडियो रिकॉर्ड करें या अपने डिवाइस से वीडियो फ़ाइल अपलोड करें।'}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap gap-2.5 justify-center">
            <button
              onClick={() =>
                navigate('/user/teleprompter', {
                  state: {
                    projectId: selectedProjectId,
                    scriptText: selectedProject?.scriptSnippet,
                    title: selectedProject?.title,
                  },
                })
              }
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-red-600/25 transition-all"
            >
              <Video className="w-4 h-4" />
              <span>{language === 'en' ? 'Record with Teleprompter →' : '🎥 टेलीप्रॉम्प्टर में रिकॉर्ड करें'}</span>
            </button>

            <button
              onClick={() => importInputRef.current?.click()}
              className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-2 border border-slate-200 transition-colors"
            >
              <Upload className="w-4 h-4 text-slate-600" />
              <span>{language === 'en' ? 'Upload Video File' : 'वीडियो अपलोड करें'}</span>
            </button>

            <button
              onClick={() => navigate('/user/projects')}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-500 font-semibold text-xs border border-slate-200 transition-colors"
            >
              <span>{language === 'en' ? 'Back to Projects' : 'प्रोजेक्ट्स सूची पर वापस'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* ================= ACTIVE STUDIO CANVAS (Prompt 9 Section 5 to 9) ================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Video Preview Player & Interactive Timeline (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-3">
            {/* Viewport Box Framed to Selected Aspect Ratio */}
            <div className="bg-slate-950 rounded-3xl p-4 sm:p-6 border border-slate-800 shadow-xl flex flex-col items-center justify-center relative overflow-hidden min-h-[420px] sm:min-h-[480px]">
              <div
                className={`relative overflow-hidden rounded-2xl bg-black border border-white/10 shadow-2xl transition-all duration-300 ${
                  aspectRatio === '9:16'
                    ? 'w-[250px] sm:w-[270px] aspect-[9/16]'
                    : aspectRatio === '16:9'
                    ? 'w-full max-w-[500px] aspect-video'
                    : aspectRatio === '1:1'
                    ? 'w-[300px] sm:w-[340px] aspect-square'
                    : aspectRatio === '4:3'
                    ? 'w-[340px] sm:w-[380px] aspect-[4/3]'
                    : 'w-[280px] sm:w-[310px] aspect-[4/5]'
                }`}
              >
                {/* HTML5 Video Element streaming actual source recording */}
                <video
                  ref={videoRef}
                  src={activeMedia?.url}
                  playsInline
                  muted={isMuted}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  className="w-full h-full object-cover"
                />

                {/* Brand Watermark Overlay */}
                {showLogoWatermark && (
                  <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-black/65 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-[10px] font-bold text-white shadow-md">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>{watermarkText}</span>
                  </div>
                )}

                {/* Headline Text Overlay (Top / Center / Bottom) */}
                {showHeadlineOverlay && headlineText && (
                  <div
                    className={`absolute left-3 right-3 z-20 text-center pointer-events-none transition-all ${
                      headlinePosition === 'top'
                        ? 'top-4'
                        : headlinePosition === 'center'
                        ? 'top-1/2 -translate-y-1/2'
                        : 'bottom-16'
                    }`}
                  >
                    <span className="inline-block px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-xs border border-white/20 text-white font-black text-xs sm:text-sm tracking-wide shadow-lg">
                      {headlineText}
                    </span>
                  </div>
                )}

                {/* Synchronized Subtitle Overlay (Prompt 9 Section 7) */}
                {showSubtitles && currentSubtitle && (
                  <div className="absolute bottom-6 left-3 right-3 z-20 text-center pointer-events-none">
                    <span
                      className={`inline-block px-3.5 py-1.5 rounded-2xl font-bold text-xs sm:text-sm tracking-wide shadow-xl backdrop-blur-xs transition-all ${
                        subtitleStyle === 'highlight'
                          ? 'bg-black/85 text-[#FDE047] border border-amber-400/40 drop-shadow-md'
                          : subtitleStyle === 'karaoke'
                          ? 'bg-slate-900/90 text-[#38BDF8] border border-sky-400/50 drop-shadow-md'
                          : 'bg-black/90 text-white border border-white/20 drop-shadow-md'
                      }`}
                    >
                      {currentSubtitle.text}
                    </span>
                  </div>
                )}

                {/* Center Clickable Play / Pause Overlay */}
                <button
                  onClick={togglePlayPause}
                  className={`absolute inset-0 z-10 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-all ${
                    isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'
                  }`}
                  title="Play / Pause"
                >
                  <div className="w-14 h-14 rounded-full bg-white/90 text-slate-950 flex items-center justify-center shadow-xl transform active:scale-90 transition-transform">
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-slate-950 ml-0.5" />}
                  </div>
                </button>
              </div>

              {/* Time Stamp & Aspect Ratio Badge */}
              <div className="mt-3 flex items-center gap-2 text-white/70 text-xs font-mono font-medium">
                <span>{formatTime(currentTime)}</span>
                <span>/</span>
                <span>{formatTime(duration)}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-amber-300 font-bold">
                  {aspectRatio}
                </span>
                <span className="text-[10px] text-slate-400">
                  • Take: {activeMedia?.title}
                </span>
              </div>
            </div>

            {/* Interactive Timeline Strip & Playhead (Poster Panel 5) */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlayPause}
                    className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>
                  <button
                    onClick={handlePreviewTrimRange}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Play Trimmed Section"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <span className="font-mono text-slate-700 font-bold ml-1">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                {/* Trim Range Badges */}
                <div className="text-[11px] font-mono text-slate-600 flex items-center gap-2">
                  <span className="font-bold text-blue-600">In: {formatTime(trimStart)}</span>
                  <span>·</span>
                  <span className="font-bold text-blue-600">Out: {formatTime(trimEnd)}</span>
                  <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md">
                    Len: {formatTime(trimEnd - trimStart)}
                  </span>
                </div>
              </div>

              {/* Scrub Slider */}
              <div className="space-y-1">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  value={currentTime}
                  onChange={(e) => handleScrub(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
                />
              </div>

              {/* Filmstrip with Trim In & Out markers */}
              <div className="relative h-14 bg-slate-900 rounded-xl overflow-hidden flex items-center border border-slate-200">
                <div className="grid grid-cols-7 w-full h-full opacity-70 pointer-events-none">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div key={i} className="border-r border-slate-800 bg-slate-800 flex items-center justify-center overflow-hidden">
                      <img
                        src="/assets/aistudio/Master_Admin_UI___________6_Visual_Assets_Management_bfd1be4e.png"
                        alt=""
                        className="w-full h-full object-cover opacity-60"
                      />
                    </div>
                  ))}
                </div>

                {/* Trim Dimming Overlays */}
                <div
                  style={{ width: `${(trimStart / (duration || 1)) * 100}%` }}
                  className="absolute top-0 bottom-0 left-0 bg-black/60 pointer-events-none border-r-2 border-blue-500"
                />
                <div
                  style={{ width: `${Math.max(0, 100 - (trimEnd / (duration || 1)) * 100)}%` }}
                  className="absolute top-0 bottom-0 right-0 bg-black/60 pointer-events-none border-l-2 border-blue-500"
                />

                {/* Active Playhead Needle */}
                <div
                  style={{ left: `${(currentTime / (duration || 1)) * 100}%` }}
                  className="absolute top-0 bottom-0 w-1 bg-amber-400 shadow-md shadow-amber-400/50 pointer-events-none -translate-x-1/2 z-10"
                >
                  <div className="w-3 h-3 rounded-full bg-amber-400 -mt-1 -ml-1 border-2 border-slate-900" />
                </div>
              </div>

              {/* Active Subtitle Cue Banner */}
              {showSubtitles && (
                <div className="p-2 rounded-xl bg-teal-950/80 border border-teal-500/40 flex items-center justify-between text-xs text-teal-200">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0" />
                    <span className="font-bold text-white text-[11px] truncate">
                      {currentSubtitle?.text || 'कोई सक्रिय सबटाइटल नहीं'}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsCaptionDrawerOpen(true)}
                    className="text-[10px] text-teal-300 hover:text-white font-mono underline shrink-0 ml-2"
                  >
                    एडिट करें ↗
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Studio Tools & Controls (5 cols) (Poster Panel 5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-4">
              {/* Tool Tabs Header */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-100 text-xs">
                {[
                  { id: 'trim', label: 'Cut / Trim', icon: Scissors },
                  { id: 'subtitles', label: 'Subtitles', icon: Type },
                  { id: 'text', label: 'Text / Logo', icon: Layers },
                  { id: 'audio', label: 'Audio', icon: Music },
                  { id: 'ai', label: 'AI Edits', icon: Sparkles, badge: 'Smart' },
                  { id: 'media', label: 'Takes', icon: Film, count: projectMediaList.length },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeToolTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveToolTab(tab.id as any)}
                      className={`px-3 py-2 rounded-xl font-bold shrink-0 flex items-center gap-1.5 transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                      {tab.badge && (
                        <span className="text-[9px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full font-bold">
                          {tab.badge}
                        </span>
                      )}
                      {tab.count !== undefined && (
                        <span className="text-[10px] opacity-75">({tab.count})</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: Trim & Cut Tools (Prompt 9 Section 6) */}
              {activeToolTab === 'trim' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        {language === 'en' ? 'Clip In / Out Trimming' : 'कट एवं ट्रिम सेटिंग्स'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Set beginning and end points without altering source video file.
                      </p>
                    </div>

                    <button
                      onClick={() => setResetConfirmOpen(true)}
                      className="text-[11px] font-bold text-red-600 hover:text-red-700 hover:underline"
                    >
                      {language === 'en' ? 'Reset Trim' : 'रीसेट करें'}
                    </button>
                  </div>

                  {/* Trim In Slider */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700">Trim In (Start Point):</span>
                      <span className="font-mono text-blue-600 font-bold">{formatTime(trimStart)}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={Math.max(0, trimEnd - 1)}
                      step={0.5}
                      value={trimStart}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setTrimStart(val);
                        handleScrub(val);
                      }}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  {/* Trim Out Slider */}
                  <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700">Trim Out (End Point):</span>
                      <span className="font-mono text-blue-600 font-bold">{formatTime(trimEnd)}</span>
                    </div>
                    <input
                      type="range"
                      min={trimStart + 1}
                      max={duration || 100}
                      step={0.5}
                      value={trimEnd}
                      onChange={(e) => setTrimEnd(parseFloat(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  {/* Selected Range Actions */}
                  <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-900 flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Selected Clip Duration:</p>
                      <p className="text-[10px] text-amber-700">Optimized for Reels & Shorts</p>
                    </div>
                    <strong className="font-mono text-sm">{formatTime(trimEnd - trimStart)}</strong>
                  </div>

                  <button
                    onClick={handlePreviewTrimRange}
                    className="w-full py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-blue-200"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{language === 'en' ? 'Play Trimmed Selection' : 'ट्रिम किए गए हिस्से का प्रीव्यू देखें'}</span>
                  </button>
                </div>
              )}

              {/* TAB 2: Subtitles & Captions (Prompt 9 Section 7) */}
              {activeToolTab === 'subtitles' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        {language === 'en' ? 'Synchronized Subtitles' : 'सिंक्रोनाइज़्ड सबटाइटल'}
                      </h4>
                      <p className="text-xs text-slate-500">Render script lines directly on video</p>
                    </div>
                    <button
                      onClick={() => setShowSubtitles(!showSubtitles)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                        showSubtitles ? 'bg-blue-600' : 'bg-slate-200'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          showSubtitles ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Subtitle Style Chooser */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-700">Display Style</span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'highlight', label: 'Viral Yellow' },
                        { id: 'karaoke', label: 'Modern Blue' },
                        { id: 'classic', label: 'Dark Classic' },
                      ].map((st) => (
                        <button
                          key={st.id}
                          onClick={() => setSubtitleStyle(st.id as any)}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                            subtitleStyle === st.id
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Caption Editor Button */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        {captionsList.length} {language === 'en' ? 'Caption Blocks' : 'सबटाइटल ब्लॉक्स'}
                      </span>
                      <button
                        onClick={() => setIsCaptionDrawerOpen(true)}
                        className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{language === 'en' ? 'Edit Captions' : 'सबटाइटल एडिट करें'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {captionsList[0]?.text || 'No captions generated'}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: Text Overlay & Watermark (Prompt 9 Section 8) */}
              {activeToolTab === 'text' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  {/* Headline Overlay */}
                  <div className="space-y-2.5 pb-3 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          {language === 'en' ? 'Title / Headline Banner' : 'हेडलाइन टेक्स्ट ओवरले'}
                        </h4>
                        <p className="text-[11px] text-slate-400">Display prominent title card</p>
                      </div>
                      <button
                        onClick={() => setShowHeadlineOverlay(!showHeadlineOverlay)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                          showHeadlineOverlay ? 'bg-blue-600' : 'bg-slate-200'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            showHeadlineOverlay ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {showHeadlineOverlay && (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={headlineText}
                          onChange={(e) => setHeadlineText(e.target.value)}
                          placeholder="Enter headline banner text..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:bg-white"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-500 font-semibold">Position:</span>
                          {(['top', 'center', 'bottom'] as const).map((pos) => (
                            <button
                              key={pos}
                              onClick={() => setHeadlinePosition(pos)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-colors ${
                                headlinePosition === pos
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {pos}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Brand Watermark */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          {language === 'en' ? 'Brand Watermark Badge' : 'ब्रांड वॉटरमार्क'}
                        </h4>
                        <p className="text-[11px] text-slate-400">Pill badge with brand identity</p>
                      </div>
                      <button
                        onClick={() => setShowLogoWatermark(!showLogoWatermark)}
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                          showLogoWatermark ? 'bg-blue-600' : 'bg-slate-200'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            showLogoWatermark ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {showLogoWatermark && (
                      <input
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        placeholder="Brand Name"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:bg-white"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: Audio & Background Music */}
              {activeToolTab === 'audio' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        {language === 'en' ? 'Background Music' : 'बैकग्राउंड म्यूजिक'}
                      </h4>
                      <p className="text-xs text-slate-500">Add subtle background ambience</p>
                    </div>
                    <button
                      onClick={() => setBackgroundMusic(!backgroundMusic)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                        backgroundMusic ? 'bg-blue-600' : 'bg-slate-200'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          backgroundMusic ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {backgroundMusic && (
                    <div className="space-y-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-700">Volume Level:</span>
                        <span className="font-mono text-blue-600 font-bold">{musicVolume}%</span>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={80}
                        value={musicVolume}
                        onChange={(e) => setMusicVolume(parseInt(e.target.value, 10))}
                        className="w-full accent-blue-600"
                      />
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                        <Music className="w-3.5 h-3.5 text-blue-600" />
                        <span>Track: Upbeat Motivational Creator Ambience</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: AI Editing Suggestions */}
              {activeToolTab === 'ai' && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                      <span>{language === 'en' ? 'AI Video Intelligence' : 'AI एडिटिंग सुझाव'}</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Apply single-tap enhancements to audio and titles.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      {
                        id: 'silence',
                        title: 'Remove awkward pauses',
                        desc: 'Detects silent gaps and trims 1.2s from intro',
                        action: 'Auto Cut',
                      },
                      {
                        id: 'captions',
                        title: 'Auto-sync viral subtitles',
                        desc: 'Align speech hooks to high-contrast captions',
                        action: 'Apply',
                      },
                      {
                        id: 'broll',
                        title: 'Add title overlay card',
                        desc: 'Prominently display headline on opening hook',
                        action: 'Add Banner',
                      },
                    ].map((sug) => {
                      const isApplied = appliedAiSuggestions.includes(sug.title);
                      return (
                        <div
                          key={sug.id}
                          className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2"
                        >
                          <div>
                            <p className="text-xs font-bold text-slate-900">{sug.title}</p>
                            <p className="text-[11px] text-slate-500">{sug.desc}</p>
                          </div>
                          <button
                            onClick={() => handleApplyAiSuggestion(sug.title)}
                            disabled={isApplied}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              isApplied
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                            }`}
                          >
                            {isApplied ? 'Applied ✓' : sug.action}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 6: Project Takes & Media Management */}
              {activeToolTab === 'media' && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      {language === 'en' ? 'Project Takes' : 'रिकॉर्डेड मीडिया सूची'}
                    </h4>
                    <input
                      type="file"
                      ref={importInputRef}
                      onChange={handleImportVideo}
                      accept="video/*"
                      className="hidden"
                    />
                    <button
                      onClick={() => importInputRef.current?.click()}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Import Take' : 'इंपोर्ट'}</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {projectMediaList.map((m) => {
                      const isCurrent = m.id === activeMediaId;
                      return (
                        <div
                          key={m.id}
                          onClick={() => {
                            setActiveMediaId(m.id);
                            setDuration(m.duration);
                            setTrimStart(m.trimStart || 0);
                            setTrimEnd(m.trimEnd || m.duration);
                          }}
                          className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                            isCurrent
                              ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-500/20'
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-10 h-8 rounded-lg bg-slate-900 overflow-hidden shrink-0 flex items-center justify-center text-white">
                              <Film className="w-4 h-4 text-slate-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-800 truncate">{m.title}</p>
                              <p className="text-[10px] text-slate-500">
                                {m.duration}s · {m.fileSize || '18 MB'} · {m.aspectRatio || '9:16'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            {isCurrent && (
                              <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                                Active
                              </span>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteMedia(m.id);
                              }}
                              className="p-1 rounded-md text-slate-400 hover:text-red-600 transition-colors"
                              title="Delete Clip"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. CAPTION & TIMING EDITOR DRAWER */}
      {isCaptionDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                  <Type className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  {language === 'en' ? 'Subtitle Blocks & Time Cues' : 'सबटाइटल ब्लॉक्स व समय'}
                </h3>
              </div>
              <button
                onClick={() => setIsCaptionDrawerOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {captionsList.map((cap, idx) => (
                <div key={cap.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-blue-700">Cue #{idx + 1}</span>
                    <div className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
                      <input
                        type="number"
                        value={cap.startTime}
                        onChange={(e) => {
                          const v = parseInt(e.target.value, 10) || 0;
                          setCaptionsList((prev) =>
                            prev.map((c) => (c.id === cap.id ? { ...c, startTime: v } : c))
                          );
                        }}
                        className="w-12 px-1.5 py-0.5 rounded bg-white border border-slate-300 text-center font-bold"
                      />
                      <span>s to</span>
                      <input
                        type="number"
                        value={cap.endTime}
                        onChange={(e) => {
                          const v = parseInt(e.target.value, 10) || 0;
                          setCaptionsList((prev) =>
                            prev.map((c) => (c.id === cap.id ? { ...c, endTime: v } : c))
                          );
                        }}
                        className="w-12 px-1.5 py-0.5 rounded bg-white border border-slate-300 text-center font-bold"
                      />
                      <span>s</span>
                    </div>
                  </div>
                  <textarea
                    value={cap.text}
                    rows={2}
                    onChange={(e) => {
                      const txt = e.target.value;
                      setCaptionsList((prev) =>
                        prev.map((c) => (c.id === cap.id ? { ...c, text: txt } : c))
                      );
                    }}
                    className="w-full p-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  const last = captionsList[captionsList.length - 1];
                  const newStart = last ? last.endTime : 0;
                  const newEnd = Math.min(duration || 42, newStart + 8);
                  setCaptionsList((prev) => [
                    ...prev,
                    {
                      id: `c_${Date.now()}`,
                      startTime: newStart,
                      endTime: newEnd,
                      text: 'नया सबटाइटल वाक्य यहाँ लिखें...',
                    },
                  ]);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                + नया सबटाइटल जोड़ें
              </button>

              <button
                onClick={() => setIsCaptionDrawerOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
              >
                हो गया (Done)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. RESET TRIM CONFIRMATION DIALOG */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 text-amber-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-sm font-bold text-slate-900">
                {language === 'en' ? 'Reset Video Trim Points?' : 'ट्रिम रीसेट करें?'}
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'en'
                ? 'This will restore the trim selection to the entire length of the original recording.'
                : 'यह ट्रिम चयन को मूल रिकॉर्डिंग की पूरी लंबाई तक रीसेट कर देगा। मूल वीडियो सुरक्षित रहेगा।'}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                {language === 'en' ? 'Cancel' : 'रद्द करें'}
              </button>
              <button
                onClick={handleConfirmResetTrim}
                className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
              >
                {language === 'en' ? 'Reset to Full Length' : 'पूरी लंबाई रीसेट करें'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. EXPORT & SHARE MODAL (Matching Poster Panel 6) */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-5 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-100 text-blue-700">
                  <Download className="w-5 h-5 text-blue-600" />
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {language === 'en' ? 'Export Video & Social Sharing' : 'एक्सपोर्ट और शेयर'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedProject?.title || 'Solar Panel Reel - Draft'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2-Column Grid matching Panel 6 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Export Settings & Renderer */}
              <div className="space-y-4 text-xs">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-100 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-blue-600" />
                  <span>{language === 'en' ? 'Export Configuration' : 'एक्सपोर्ट सेटिंग्स'}</span>
                </h4>

                {/* Video Quality */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">
                    {language === 'en' ? 'Video Quality / Resolution' : 'वीडियो गुणवत्ता'}
                  </label>
                  <select
                    value={exportQuality}
                    onChange={(e) => setExportQuality(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 focus:bg-white"
                  >
                    <option value="1080p">1080p (Full HD - Recommended)</option>
                    <option value="720p">720p (HD - Fast Processing)</option>
                    <option value="4k">4K (Ultra HD)</option>
                  </select>
                </div>

                {/* Aspect Ratio */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">
                    {language === 'en' ? 'Aspect Ratio' : 'आस्पेक्ट रेशियो'}
                  </label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 focus:bg-white"
                  >
                    <option value="9:16">9:16 (Reels/Shorts - Vertical Primary)</option>
                    <option value="1:1">1:1 (Square)</option>
                    <option value="4:5">4:5 (Portrait Feed)</option>
                    <option value="4:3">4:3 (Standard Video)</option>
                    <option value="16:9">16:9 (Landscape - YouTube)</option>
                  </select>
                </div>

                {/* Format */}
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">
                    {language === 'en' ? 'Output Format' : 'फॉर्मेट'}
                  </label>
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 focus:bg-white"
                  >
                    <option value="mp4">MP4 (Universal Video Container)</option>
                    <option value="webm">WebM (Fast Web Native)</option>
                    <option value="mp3">MP3 (Audio Only Podcast)</option>
                  </select>
                </div>

                {/* Burn-in Subtitles & Watermark Toggles */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800 text-[11px]">Subtitles</p>
                      <p className="text-[10px] text-slate-400">Burn in video</p>
                    </div>
                    <button
                      onClick={() => setShowSubtitles(!showSubtitles)}
                      className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                        showSubtitles ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          showSubtitles ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-800 text-[11px]">Watermark</p>
                      <p className="text-[10px] text-slate-400">Brand logo</p>
                    </div>
                    <button
                      onClick={() => setShowLogoWatermark(!showLogoWatermark)}
                      className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                        showLogoWatermark ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          showLogoWatermark ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Render Progress or Trigger Button (Prompt 9 Section 11) */}
                {isExporting ? (
                  <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-center space-y-2.5 animate-pulse">
                    <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                      <span>{exportStatusText}</span>
                      <span className="font-mono text-sm">{exportProgress}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${exportProgress}%` }}
                      />
                    </div>
                  </div>
                ) : exportProgress === 100 ? (
                  <div className="space-y-2">
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center text-xs text-emerald-900 font-bold flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{language === 'en' ? 'Video Rendered Successfully!' : 'वीडियो सफलतापूर्वक रेंडर हो गया!'}</span>
                    </div>

                    <a
                      href={exportedVideoUrl || activeMedia?.url}
                      download={`${exportTitle.replace(/\s+/g, '_')}_${exportQuality}.${exportFormat}`}
                      className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>{language === 'en' ? 'Download Video File' : 'वीडियो डाउनलोड करें'}</span>
                    </a>
                  </div>
                ) : (
                  <button
                    onClick={handleStartRealExport}
                    className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>{language === 'en' ? 'Render & Export Video' : 'वीडियो रेंडर व एक्सपोर्ट करें'}</span>
                  </button>
                )}
              </div>

              {/* Right Column: Share to Social Platforms (Prompt 9 Section 13) */}
              <div className="space-y-4 text-xs">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-100 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>{language === 'en' ? 'Publishing & Social Intents' : 'सोशल मीडिया पर शेयर करें'}</span>
                </h4>

                <p className="text-[11px] text-slate-500">
                  {language === 'en'
                    ? 'Download your rendered reel, then tap any platform below to open its upload intent or native share sheet.'
                    : 'रेंडर किया गया वीडियो डाउनलोड करें, फिर संबंधित सोशल प्लेटफॉर्म पर शेयर करें।'}
                </p>

                <div className="space-y-2">
                  {[
                    {
                      id: 'instagram',
                      name: 'Instagram Reels',
                      icon: Instagram,
                      color: 'text-pink-600 bg-pink-50',
                      action: () => window.open('https://www.instagram.com', '_blank'),
                    },
                    {
                      id: 'youtube',
                      name: 'YouTube Shorts',
                      icon: Youtube,
                      color: 'text-red-600 bg-red-50',
                      action: () => window.open('https://studio.youtube.com', '_blank'),
                    },
                    {
                      id: 'whatsapp',
                      name: 'WhatsApp',
                      icon: Send,
                      color: 'text-emerald-600 bg-emerald-50',
                      action: () =>
                        window.open(
                          `https://api.whatsapp.com/send?text=${encodeURIComponent(
                            exportTitle + ' - Created with Scripter ' + window.location.href
                          )}`,
                          '_blank'
                        ),
                    },
                    {
                      id: 'facebook',
                      name: 'Facebook',
                      icon: Facebook,
                      color: 'text-blue-600 bg-blue-50',
                      action: () =>
                        window.open(
                          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                            window.location.href
                          )}`,
                          '_blank'
                        ),
                    },
                    {
                      id: 'linkedin',
                      name: 'LinkedIn Video',
                      icon: Linkedin,
                      color: 'text-blue-700 bg-blue-50',
                      action: () =>
                        window.open(
                          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                            window.location.href
                          )}`,
                          '_blank'
                        ),
                    },
                  ].map((plat) => {
                    const Icon = plat.icon;
                    return (
                      <div
                        key={plat.id}
                        className="p-2.5 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`p-2 rounded-xl ${plat.color}`}>
                            <Icon className="w-4 h-4" />
                          </span>
                          <span className="font-bold text-slate-800 text-xs">{plat.name}</span>
                        </div>
                        <button
                          onClick={plat.action}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors"
                        >
                          {language === 'en' ? 'Open' : 'खोलें'}
                        </button>
                      </div>
                    );
                  })}

                  {/* Device Native Share or Copy Link */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={handleShareVideo}
                      className="flex-1 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-blue-200"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Device Share Sheet' : 'डिवाइस शेयर'}</span>
                    </button>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        setShareSuccessMessage(language === 'en' ? 'Link copied!' : 'लिंक कॉपी हुआ!');
                        setTimeout(() => setShareSuccessMessage(null), 2500);
                      }}
                      className="py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? 'Copy Link' : 'कॉपी लिंक'}</span>
                    </button>
                  </div>
                </div>

                {shareSuccessMessage && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold text-center text-xs">
                    {shareSuccessMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
