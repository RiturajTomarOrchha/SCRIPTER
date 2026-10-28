import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import { useLanguage } from '../../context/LanguageContext';
import { Project, ProjectStatus, ExportRecord } from '../../types';
import {
  getProjects,
  deleteProject,
  duplicateProject,
  saveProject,
  deleteProjectThumbnail,
  updateProjectStatus,
  renameProject,
  restoreProjectScriptVersion,
} from '../../services/storage';
import {
  FolderKanban,
  Search,
  Plus,
  Clock,
  ChevronRight,
  MoreVertical,
  Edit,
  Copy,
  Archive,
  Trash2,
  FileText,
  Video,
  Layers,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink,
  Sparkles,
  Film,
  Play,
  Image as ImageIcon,
  Hash,
  Download,
  Check,
  Share2,
  Send,
  Youtube,
  Instagram,
  Facebook,
  Linkedin,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { activeBusinessProfile, businessProfiles } = useRole();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [projectsList, setProjectsList] = useState<Project[]>(() => getProjects());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ProjectStatus>('all');
  const [profileFilter, setProfileFilter] = useState<'all' | string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeProjectTab, setActiveProjectTab] = useState<'script' | 'visuals' | 'media' | 'exports' | 'thumbnails' | 'captions' | 'notes'>('script');
  const [selectedVersionIndex, setSelectedVersionIndex] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [shareToast, setShareToast] = useState<string | null>(null);

  // Rename modal state
  const [renameModalProject, setRenameModalProject] = useState<Project | null>(null);
  const [renameTitle, setRenameTitle] = useState('');
  const [renameTitleHi, setRenameTitleHi] = useState('');

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleShareIntent = (
    platform: 'instagram' | 'youtube' | 'linkedin' | 'twitter' | 'whatsapp' | 'facebook' | 'copy',
    exportItem?: ExportRecord
  ) => {
    const title = exportItem?.title || selectedProject?.title || 'Scripter Content Video';
    const url = exportItem?.downloadUrl && exportItem.downloadUrl.startsWith('http')
      ? exportItem.downloadUrl
      : window.location.origin;

    if (platform === 'copy') {
      navigator.clipboard.writeText(`${title} - ${url}`);
      setShareToast(language === 'en' ? 'Video link copied to clipboard!' : 'वीडियो लिंक कॉपी हो गया!');
      setTimeout(() => setShareToast(null), 2500);
      return;
    }

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${title}: ${url}`)}`, '_blank');
      return;
    }

    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
      return;
    }

    if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
      return;
    }

    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
      return;
    }

    if (platform === 'instagram' || platform === 'youtube') {
      navigator.clipboard.writeText(title);
      setShareToast(
        language === 'en'
          ? `Title copied! Download the video and upload to ${platform === 'instagram' ? 'Instagram Reels' : 'YouTube Shorts'}.`
          : `शीर्षक कॉपी हुआ! वीडियो डाउनलोड करके ${platform === 'instagram' ? 'Instagram Reels' : 'YouTube Shorts'} पर अपलोड करें।`
      );
      setTimeout(() => setShareToast(null), 3500);
    }
  };

  const handleDeleteThumbnail = (thumbId: string) => {
    if (!selectedProject) return;
    deleteProjectThumbnail(selectedProject.id, thumbId);
    reloadProjects();
  };

  // Delete modal state
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [actionMenuProjectId, setActionMenuProjectId] = useState<string | null>(null);

  const reloadProjects = () => {
    const updated = getProjects();
    setProjectsList(updated);
    if (selectedProject) {
      const refreshed = updated.find((p) => p.id === selectedProject.id);
      setSelectedProject(refreshed || null);
    }
  };

  const filteredProjects = useMemo(() => {
    return projectsList.filter((proj) => {
      // Profile filter
      if (profileFilter !== 'all') {
        if (proj.businessProfileId && proj.businessProfileId !== profileFilter) {
          return false;
        }
      }
      // Status filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'draft' && proj.status !== 'draft') return false;
        if (statusFilter === 'in_progress' && proj.status !== 'in_progress') return false;
        if (statusFilter === 'completed' && proj.status !== 'completed') return false;
        if (statusFilter === 'archived' && proj.status !== 'archived') return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle =
          proj.title.toLowerCase().includes(q) ||
          (proj.titleHi && proj.titleHi.toLowerCase().includes(q));
        const matchCategory = proj.category.toLowerCase().includes(q);
        const matchIndustry = proj.industry?.toLowerCase().includes(q);
        return matchTitle || matchCategory || matchIndustry;
      }
      return true;
    });
  }, [projectsList, statusFilter, profileFilter, searchQuery]);

  const handleDelete = () => {
    if (!projectToDelete) return;
    deleteProject(projectToDelete.id);
    setProjectToDelete(null);
    if (selectedProject?.id === projectToDelete.id) {
      setSelectedProject(null);
    }
    reloadProjects();
  };

  const handleDuplicate = (projId: string) => {
    duplicateProject(projId);
    setActionMenuProjectId(null);
    reloadProjects();
  };

  const handleToggleArchive = (proj: Project) => {
    const nextStatus: ProjectStatus = proj.status === 'archived' ? 'in_progress' : 'archived';
    saveProject({ ...proj, status: nextStatus });
    setActionMenuProjectId(null);
    reloadProjects();
  };

  const handleEditInStudio = (proj: Project) => {
    navigate('/user/script-studio', {
      state: {
        projectId: proj.id,
        prefilledTopic: proj.title,
        industry: proj.industry,
        category: proj.category,
      },
    });
  };

  const getProjectProgressStage = (proj: Project) => {
    const hasExports = Boolean(proj.exports && proj.exports.length > 0);
    const hasMedia = Boolean(proj.media && proj.media.length > 0);
    const hasScript = Boolean(proj.scriptSnippet || (proj.scriptVersions && proj.scriptVersions.length > 0));

    if (hasExports) {
      return {
        stage: 'exported',
        step: 4,
        stepLabel: language === 'en' ? 'Step 4/4: Ready to Share' : 'चरण 4/4: शेयर करने के लिए तैयार',
        labelEn: 'View / Share Video',
        labelHi: 'वीडियो देखें / शेयर करें',
        icon: Share2,
        btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs',
        action: () => {
          setSelectedProject(proj);
          setActiveProjectTab('exports');
        },
      };
    }

    if (hasMedia) {
      return {
        stage: 'media',
        step: 3,
        stepLabel: language === 'en' ? 'Step 3/4: Ready to Edit' : 'चरण 3/4: एडिटिंग के लिए तैयार',
        labelEn: 'Edit in Video Studio',
        labelHi: 'वीडियो स्टूडियो में एडिट करें',
        icon: Film,
        btnClass: 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold shadow-xs',
        action: () => {
          navigate('/user/video-studio', {
            state: {
              projectId: proj.id,
              mediaId: proj.activeMediaId || proj.media?.[0]?.id,
            },
          });
        },
      };
    }

    if (hasScript) {
      return {
        stage: 'prompter',
        step: 2,
        stepLabel: language === 'en' ? 'Step 2/4: Ready to Record' : 'चरण 2/4: रिकॉर्डिंग के लिए तैयार',
        labelEn: 'Record in Teleprompter',
        labelHi: 'टेलीप्रॉम्प्टर में रिकॉर्ड करें',
        icon: Video,
        btnClass: 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs',
        action: () => {
          navigate('/user/teleprompter', {
            state: {
              projectId: proj.id,
              title: proj.title,
              scriptText: proj.scriptVersions?.[0]?.hook
                ? [proj.scriptVersions[0].hook, ...(proj.scriptVersions[0].mainContent || []), proj.scriptVersions[0].closing].filter(Boolean).join('\n\n')
                : proj.scriptSnippet,
            },
          });
        },
      };
    }

    return {
      stage: 'script',
      step: 1,
      stepLabel: language === 'en' ? 'Step 1/4: Write Script' : 'चरण 1/4: स्क्रिप्ट लिखें',
      labelEn: 'Write Script in Studio',
      labelHi: 'स्क्रिप्ट स्टूडियो में लिखें',
      icon: Edit,
      btnClass: 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs',
      action: () => {
        navigate('/user/script-studio', {
          state: {
            projectId: proj.id,
            prefilledTopic: proj.title,
            industry: proj.industry,
            category: proj.category,
          },
        });
      },
    };
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      {/* Header bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-100 text-blue-700">
                <FolderKanban className="w-5 h-5 text-blue-600" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {language === 'en' ? 'My Projects & Content Library' : 'मेरे प्रोजेक्ट्स'}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {language === 'en'
                ? `Central workspace for managing scripts, drafts, and production recordings.`
                : 'स्क्रिप्ट, ड्राफ्ट और कंटेंट प्रोजेक्ट्स को व्यवस्थित और प्रबंधित करें।'}
            </p>
          </div>

          <button
            onClick={() => navigate('/user/script-studio')}
            className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-98 text-slate-950 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{language === 'en' ? 'New Project' : 'नया प्रोजेक्ट'}</span>
          </button>
        </div>

        {/* Search, Profile Filter & Status Filters */}
        <div className="mt-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'en'
                  ? 'Search projects by title, category, or industry...'
                  : 'प्रोजेक्ट का नाम, श्रेणी या उद्योग खोजें...'
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Bar: Status Tabs + Business Profile Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            {/* Status Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'all', labelEn: `All (${projectsList.length})`, labelHi: `सभी (${projectsList.length})` },
                { id: 'draft', labelEn: 'Drafts', labelHi: 'ड्राफ्ट' },
                { id: 'in_progress', labelEn: 'In Progress', labelHi: 'प्रगति पर' },
                { id: 'completed', labelEn: 'Ready / Done', labelHi: 'तैयार' },
                { id: 'archived', labelEn: 'Archived', labelHi: 'आर्काइव' },
              ].map((tab) => {
                const isActive = statusFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id as any)}
                    className={`px-3.5 py-1.5 rounded-xl font-semibold shrink-0 transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                    }`}
                  >
                    {language === 'en' ? tab.labelEn : tab.labelHi}
                  </button>
                );
              })}
            </div>

            {/* Profile Selector */}
            <div className="flex items-center gap-2 self-start sm:self-auto text-xs shrink-0">
              <span className="text-slate-400 font-semibold">{language === 'en' ? 'Profile:' : 'प्रोफाइल:'}</span>
              <select
                value={profileFilter}
                onChange={(e) => setProfileFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-semibold text-xs focus:bg-white focus:outline-hidden"
              >
                <option value="all">{language === 'en' ? 'All Profiles' : 'सभी प्रोफाइल्स'}</option>
                {businessProfiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid / List */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
          <FolderKanban className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">
            {language === 'en' ? 'No Projects Found' : 'कोई प्रोजेक्ट नहीं मिला'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {language === 'en'
              ? 'Start your first content script or adjust your search filter.'
              : 'पहला प्रोजेक्ट बनाएं या सर्च फिल्टर बदलें।'}
          </p>
          <button
            onClick={() => navigate('/user/script-studio')}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
          >
            {language === 'en' ? 'Create New Script' : 'नई स्क्रिप्ट बनाएं'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((proj) => {
            const statusConfig =
              ({
                draft: { bg: 'bg-slate-100 text-slate-700', label: 'Draft' },
                in_progress: { bg: 'bg-blue-50 text-blue-700 border border-blue-200', label: 'In Progress' },
                completed: { bg: 'bg-emerald-50 text-emerald-700 border border-emerald-200', label: 'Ready' },
                archived: { bg: 'bg-amber-50 text-amber-700', label: 'Archived' },
              } as Record<ProjectStatus, { bg: string; label: string }>)[proj.status] || {
                bg: 'bg-slate-100 text-slate-700',
                label: 'Draft',
              };

            const versionsCount = proj.scriptVersions?.length || (proj.scriptSnippet ? 1 : 0);
            const mediaCount = proj.media?.length || 0;
            const exportsCount = proj.exports?.length || 0;
            const thumbsCount = proj.thumbnails?.length || 0;

            const progress = getProjectProgressStage(proj);
            const ProgressIcon = progress.icon;

            return (
              <div
                key={proj.id}
                onClick={() => setSelectedProject(proj)}
                className="group bg-white rounded-3xl p-5 border border-slate-200/90 hover:border-blue-400 transition-all hover:shadow-lg cursor-pointer flex flex-col justify-between space-y-4 relative"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${statusConfig.bg}`}>
                        {statusConfig.label}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        {progress.stepLabel}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {proj.isDemo && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                          Demo
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActionMenuProjectId(actionMenuProjectId === proj.id ? null : proj.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        title="Project options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Context menu popup */}
                  {actionMenuProjectId === proj.id && (
                    <div
                      className="absolute right-4 top-12 z-20 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 text-xs text-slate-700 animate-in fade-in zoom-in-95 duration-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => {
                          setActionMenuProjectId(null);
                          setRenameModalProject(proj);
                          setRenameTitle(proj.title);
                          setRenameTitleHi(proj.titleHi || '');
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 font-semibold"
                      >
                        <Edit className="w-3.5 h-3.5 text-blue-600" />
                        <span>Rename Project</span>
                      </button>

                      {/* Quick Status Submenu */}
                      <div className="px-3.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Change Status
                      </div>
                      <div className="grid grid-cols-2 gap-1 px-2.5 pb-1">
                        {(['draft', 'in_progress', 'completed', 'archived'] as ProjectStatus[]).map((st) => (
                          <button
                            key={st}
                            onClick={() => {
                              updateProjectStatus(proj.id, st);
                              setActionMenuProjectId(null);
                              reloadProjects();
                            }}
                            className={`px-2 py-1 rounded text-[10px] font-semibold text-left capitalize transition-colors ${
                              proj.status === st
                                ? 'bg-blue-600 text-white font-bold'
                                : 'hover:bg-slate-100 text-slate-600'
                            }`}
                          >
                            {st.replace('_', ' ')}
                          </button>
                        ))}
                      </div>

                      <div className="my-1 border-t border-slate-100" />

                      <button
                        onClick={() => {
                          setActionMenuProjectId(null);
                          handleEditInStudio(proj);
                        }}
                        className="w-full text-left px-3.5 py-1.5 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Script Studio</span>
                      </button>
                      <button
                        onClick={() => {
                          setActionMenuProjectId(null);
                          navigate('/user/teleprompter', { state: { projectId: proj.id } });
                        }}
                        className="w-full text-left px-3.5 py-1.5 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Teleprompter</span>
                      </button>
                      <button
                        onClick={() => {
                          setActionMenuProjectId(null);
                          navigate('/user/video-studio', { state: { projectId: proj.id } });
                        }}
                        className="w-full text-left px-3.5 py-1.5 hover:bg-amber-50 hover:text-amber-800 flex items-center gap-2"
                      >
                        <Film className="w-3.5 h-3.5" />
                        <span>Video Studio</span>
                      </button>
                      <button
                        onClick={() => handleDuplicate(proj.id)}
                        className="w-full text-left px-3.5 py-1.5 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Duplicate</span>
                      </button>
                      <button
                        onClick={() => handleToggleArchive(proj)}
                        className="w-full text-left px-3.5 py-1.5 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Archive className="w-3.5 h-3.5" />
                        <span>{proj.status === 'archived' ? 'Unarchive' : 'Archive'}</span>
                      </button>
                      <div className="my-1 border-t border-slate-100" />
                      <button
                        onClick={() => {
                          setActionMenuProjectId(null);
                          setProjectToDelete(proj);
                        }}
                        className="w-full text-left px-3.5 py-1.5 text-red-600 hover:bg-red-50 flex items-center gap-2 font-semibold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Project</span>
                      </button>
                    </div>
                  )}

                  {/* Project Title */}
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {language === 'hi' && proj.titleHi ? proj.titleHi : proj.title}
                  </h3>

                  {/* Snippet */}
                  {proj.scriptSnippet && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      "{proj.scriptSnippet}"
                    </p>
                  )}

                  {/* Artifacts Summary Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold">
                      v{versionsCount} Script
                    </span>
                    {mediaCount > 0 && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200/60 flex items-center gap-1">
                        <Video className="w-2.5 h-2.5" />
                        <span>{mediaCount} {mediaCount === 1 ? 'Take' : 'Takes'}</span>
                      </span>
                    )}
                    {exportsCount > 0 && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>{exportsCount} Export{exportsCount === 1 ? '' : 's'}</span>
                      </span>
                    )}
                    {thumbsCount > 0 && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60 flex items-center gap-1">
                        <ImageIcon className="w-2.5 h-2.5" />
                        <span>{thumbsCount}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Actions: Smart Continue Workflow + Time Metadata */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      progress.action();
                    }}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all active:scale-98 ${progress.btnClass}`}
                  >
                    <span className="flex items-center gap-1.5">
                      <ProgressIcon className="w-3.5 h-3.5" />
                      <span>{language === 'en' ? progress.labelEn : progress.labelHi}</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 px-0.5">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{proj.timeAgo}</span>
                      </span>
                      <span>·</span>
                      <span className="font-medium text-slate-500">{proj.format.toUpperCase()}</span>
                    </div>
                    <span className="text-slate-400">{proj.industry}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col justify-between">
            <div>
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 text-xs font-bold">
                    {selectedProject.category}
                  </span>
                  <span className="text-xs text-slate-400">· {selectedProject.duration || '30s'}</span>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Title Header with Rename & Status Controls */}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900 truncate">
                      {language === 'hi' && selectedProject.titleHi
                        ? selectedProject.titleHi
                        : selectedProject.title}
                    </h2>
                    <button
                      onClick={() => {
                        setRenameModalProject(selectedProject);
                        setRenameTitle(selectedProject.title);
                        setRenameTitleHi(selectedProject.titleHi || '');
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors shrink-0"
                      title="Rename project"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Last updated {selectedProject.timeAgo} · {selectedProject.industry} · {selectedProject.category}
                  </p>
                </div>

                {/* Status Switcher */}
                <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
                  <span className="text-[11px] text-slate-400 font-semibold">Status:</span>
                  <select
                    value={selectedProject.status}
                    onChange={(e) => {
                      const newStatus = e.target.value as ProjectStatus;
                      updateProjectStatus(selectedProject.id, newStatus);
                      reloadProjects();
                    }}
                    className="text-xs font-semibold px-2.5 py-1 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:bg-white focus:outline-hidden"
                  >
                    <option value="draft">Draft</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Ready / Done</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Tabs: Script | Visuals | Media | Exports | Thumbnails | Captions | Notes */}
              <div className="flex items-center gap-1.5 mt-4 border-b border-slate-100 pb-2 overflow-x-auto text-nowrap">
                <button
                  onClick={() => setActiveProjectTab('script')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    activeProjectTab === 'script'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Script ({selectedProject.scriptVersions?.length || (selectedProject.scriptSnippet ? 1 : 0)})
                </button>
                <button
                  onClick={() => setActiveProjectTab('visuals')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    activeProjectTab === 'visuals'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Scenes ({selectedProject.scenes?.length || 0})
                </button>
                <button
                  onClick={() => setActiveProjectTab('media')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    activeProjectTab === 'media'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Media & Takes ({selectedProject.media?.length || 0})
                </button>
                <button
                  onClick={() => setActiveProjectTab('exports')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    activeProjectTab === 'exports'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Exports & Videos ({selectedProject.exports?.length || 0})
                </button>
                <button
                  onClick={() => setActiveProjectTab('thumbnails')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    activeProjectTab === 'thumbnails'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Thumbnails ({selectedProject.thumbnails?.length || 0})
                </button>
                <button
                  onClick={() => setActiveProjectTab('captions')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    activeProjectTab === 'captions'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Captions ({selectedProject.captions ? '1' : '0'})
                </button>
                <button
                  onClick={() => setActiveProjectTab('notes')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    activeProjectTab === 'notes'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Notes & Details
                </button>
              </div>

              {/* Tab Content */}
              <div className="mt-4 max-h-60 overflow-y-auto pr-1">
                {activeProjectTab === 'script' && (
                  <div className="space-y-3">
                    {/* Version switcher & restore action */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      {selectedProject.scriptVersions && selectedProject.scriptVersions.length > 1 ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-slate-400 font-semibold">Versions:</span>
                          {selectedProject.scriptVersions.map((v, i) => (
                            <button
                              key={i}
                              onClick={() => setSelectedVersionIndex(i)}
                              className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                                selectedVersionIndex === i
                                  ? 'bg-blue-600 text-white font-bold'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              v{v.version}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-semibold">Current Script</span>
                      )}

                      <div className="flex items-center gap-1.5">
                        {selectedProject.scriptVersions && selectedProject.scriptVersions.length > 1 && (
                          <button
                            onClick={() => {
                              const targetVer = selectedProject.scriptVersions![selectedVersionIndex];
                              restoreProjectScriptVersion(selectedProject.id, targetVer.version);
                              reloadProjects();
                            }}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold flex items-center gap-1 transition-colors"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Restore v{selectedProject.scriptVersions[selectedVersionIndex].version}</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            const proj = selectedProject;
                            setSelectedProject(null);
                            handleEditInStudio(proj);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1 transition-colors"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Edit in Studio</span>
                        </button>
                      </div>
                    </div>

                    {selectedProject.scriptVersions && selectedProject.scriptVersions[selectedVersionIndex] ? (
                      <div className="space-y-2 text-xs">
                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80">
                          <p className="font-bold text-amber-900 text-[11px] uppercase">Hook</p>
                          <p className="text-slate-800 mt-1">
                            "{selectedProject.scriptVersions[selectedVersionIndex].hook}"
                          </p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <p className="font-bold text-slate-700 text-[11px] uppercase">Main Content</p>
                          <ul className="mt-1 space-y-1">
                            {selectedProject.scriptVersions[selectedVersionIndex].mainContent.map((c, idx) => (
                              <li key={idx} className="text-slate-800">
                                • {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/80">
                          <p className="font-bold text-emerald-900 text-[11px] uppercase">Closing</p>
                          <p className="text-slate-800 mt-1">
                            "{selectedProject.scriptVersions[selectedVersionIndex].closing}"
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed">
                        {selectedProject.scriptSnippet || 'No script snippet stored for this draft.'}
                      </div>
                    )}
                  </div>
                )}

                {activeProjectTab === 'visuals' && (
                  <div className="space-y-2">
                    {selectedProject.scenes && selectedProject.scenes.length > 0 ? (
                      selectedProject.scenes.map((s, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-100 text-xs"
                        >
                          <div className="w-12 h-10 rounded-lg bg-slate-200 shrink-0 overflow-hidden">
                            <img src={s.imageUrl} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="font-bold text-blue-700 text-[11px]">
                              Scene {s.sceneNumber} ({s.timeRange})
                            </span>
                            <p className="text-slate-800 leading-snug">
                              {language === 'hi' && s.descriptionHi ? s.descriptionHi : s.description}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 py-4 text-center">
                        No visual storyboard attached to this project.
                      </p>
                    )}
                  </div>
                )}

                {activeProjectTab === 'media' && (
                  <div className="space-y-2">
                    {selectedProject.media && selectedProject.media.length > 0 ? (
                      selectedProject.media.map((med) => (
                        <div
                          key={med.id}
                          className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs gap-3"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-12 h-10 rounded-xl bg-slate-200 overflow-hidden shrink-0">
                              <img
                                src={med.thumbnailUrl || '/assets/aistudio/Master_Admin_UI___________6_Visual_Assets_Management_bfd1be4e.png'}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 truncate">{med.title}</p>
                              <p className="text-[10px] text-slate-500">
                                {med.duration}s · {med.aspectRatio} · {med.resolution || '1080p'} · {med.fileSize || '24.8 MB'}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              const proj = selectedProject;
                              setSelectedProject(null);
                              navigate('/user/video-studio', {
                                state: { projectId: proj.id, mediaId: med.id },
                              });
                            }}
                            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shrink-0 transition-colors shadow-xs"
                          >
                            <Play className="w-3 h-3 fill-white" />
                            <span>Edit in Studio</span>
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <Video className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
                        <p className="text-xs font-semibold text-slate-700">No video takes recorded yet</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Read your script naturally with the in-browser teleprompter and camera.
                        </p>
                        <button
                          onClick={() => {
                            const proj = selectedProject;
                            setSelectedProject(null);
                            navigate('/user/teleprompter', { state: { projectId: proj.id } });
                          }}
                          className="mt-3 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
                        >
                          Launch Teleprompter & Record
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeProjectTab === 'exports' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        Finished Video Exports ({selectedProject.exports?.length || 0})
                      </span>
                      <button
                        onClick={() => {
                          const proj = selectedProject;
                          setSelectedProject(null);
                          navigate('/user/video-studio', { state: { projectId: proj.id } });
                        }}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <Film className="w-3.5 h-3.5" />
                        <span>New Export in Studio</span>
                      </button>
                    </div>

                    {selectedProject.exports && selectedProject.exports.length > 0 ? (
                      <div className="space-y-3">
                        {selectedProject.exports.map((exp) => (
                          <div
                            key={exp.id}
                            className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 flex flex-col space-y-3"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="w-14 h-14 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0 overflow-hidden relative">
                                  <Film className="w-6 h-6 text-slate-400" />
                                  <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[8px] font-mono">
                                    {exp.quality}
                                  </span>
                                </div>
                                <div>
                                  <h4 className="font-bold text-slate-900 text-xs">{exp.title}</h4>
                                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                                    <span className="px-1.5 py-0.5 rounded bg-blue-100/70 text-blue-800 font-bold">{exp.aspectRatio}</span>
                                    <span>·</span>
                                    <span>{exp.format.toUpperCase()}</span>
                                    <span>·</span>
                                    <span>{exp.fileSize}</span>
                                    <span>·</span>
                                    <span>{new Date(exp.exportedAt).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>

                              <a
                                href={exp.downloadUrl}
                                download={`${exp.title.replace(/\s+/g, '_')}_${exp.quality}.mp4`}
                                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Download</span>
                              </a>
                            </div>

                            {/* Social Share Intents Bar */}
                            <div className="pt-2 border-t border-slate-200/60">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                                One-Click Publish & Share
                              </span>
                              <div className="flex flex-wrap items-center gap-1.5">
                                <button
                                  onClick={() => handleShareIntent('instagram', exp)}
                                  className="px-2.5 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 text-[11px] font-bold flex items-center gap-1 transition-colors"
                                >
                                  <Instagram className="w-3 h-3 text-pink-600" />
                                  <span>Instagram</span>
                                </button>
                                <button
                                  onClick={() => handleShareIntent('youtube', exp)}
                                  className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-bold flex items-center gap-1 transition-colors"
                                >
                                  <Youtube className="w-3 h-3 text-red-600" />
                                  <span>Shorts</span>
                                </button>
                                <button
                                  onClick={() => handleShareIntent('linkedin', exp)}
                                  className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold flex items-center gap-1 transition-colors"
                                >
                                  <Linkedin className="w-3 h-3 text-blue-600" />
                                  <span>LinkedIn</span>
                                </button>
                                <button
                                  onClick={() => handleShareIntent('facebook', exp)}
                                  className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold flex items-center gap-1 transition-colors"
                                >
                                  <Facebook className="w-3 h-3 text-indigo-600" />
                                  <span>Facebook</span>
                                </button>
                                <button
                                  onClick={() => handleShareIntent('whatsapp', exp)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold flex items-center gap-1 transition-colors"
                                >
                                  <Send className="w-3 h-3 text-emerald-600" />
                                  <span>WhatsApp</span>
                                </button>
                                <button
                                  onClick={() => handleShareIntent('copy', exp)}
                                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center gap-1 transition-colors"
                                >
                                  <Copy className="w-3 h-3" />
                                  <span>Copy Link</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <Film className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
                        <p className="text-xs font-semibold text-slate-700">No finalized exports yet</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Trim your recordings, configure vertical 9:16 aspect ratio, and render finished MP4 in Video Studio.
                        </p>
                        <button
                          onClick={() => {
                            const proj = selectedProject;
                            setSelectedProject(null);
                            navigate('/user/video-studio', { state: { projectId: proj.id } });
                          }}
                          className="mt-3 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs"
                        >
                          Open in Video Studio
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeProjectTab === 'thumbnails' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Project Thumbnails & Covers</span>
                      <button
                        onClick={() => {
                          const proj = selectedProject;
                          setSelectedProject(null);
                          navigate('/user/thumbnail-studio', { state: { projectId: proj.id } });
                        }}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create Thumbnail</span>
                      </button>
                    </div>

                    {selectedProject.thumbnails && selectedProject.thumbnails.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedProject.thumbnails.map((t) => (
                          <div
                            key={t.id}
                            className="p-3 bg-slate-50 rounded-2xl border border-slate-200/90 flex flex-col justify-between space-y-2 group"
                          >
                            <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center">
                              <img
                                src={t.exportedImageUrl || t.imageUrl || t.backgroundImageUrl || '/assets/aistudio/Square_Scripter_Logo_d7bb9aeb.png'}
                                alt={t.headline}
                                className="w-full h-full object-contain"
                              />
                              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[10px] font-mono font-bold text-white">
                                {t.aspectRatio}
                              </span>
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-xs line-clamp-1">{t.headline}</p>
                              {t.subtitle && (
                                <p className="text-[11px] text-slate-500 line-clamp-1">{t.subtitle}</p>
                              )}
                            </div>
                            <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                              <a
                                href={t.exportedImageUrl || t.imageUrl || '#'}
                                download={`thumbnail_${t.id}.png`}
                                className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold flex items-center gap-1 transition-colors"
                              >
                                <Download className="w-3 h-3" />
                                <span>Download PNG</span>
                              </a>
                              <button
                                onClick={() => handleDeleteThumbnail(t.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Delete Thumbnail"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
                        <p className="text-xs font-semibold text-slate-700">No thumbnails created yet</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Create pixel-perfect YouTube thumbnails and Instagram Reel covers using your Brand Kit.
                        </p>
                        <button
                          onClick={() => {
                            const proj = selectedProject;
                            setSelectedProject(null);
                            navigate('/user/thumbnail-studio', { state: { projectId: proj.id } });
                          }}
                          className="mt-3 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
                        >
                          Open Thumbnail Studio
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeProjectTab === 'captions' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Social Media Captions & Hashtags</span>
                      <button
                        onClick={() => {
                          const proj = selectedProject;
                          setSelectedProject(null);
                          navigate('/user/thumbnail-studio', { state: { projectId: proj.id } });
                        }}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Generate / Edit in Studio</span>
                      </button>
                    </div>

                    {selectedProject.captions && selectedProject.captions.length > 0 ? (
                      <div className="space-y-3">
                        {selectedProject.captions.map((capSet) => (
                          <div
                            key={capSet.id}
                            className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2.5"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                                  {capSet.platform}
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-blue-100/70 text-blue-700 text-[10px] font-semibold">
                                  {capSet.tone} · {capSet.language.toUpperCase()}
                                </span>
                                {capSet.isLiveAi && (
                                  <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-medium">
                                    AI Powered
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => handleCopyText(capSet.caption, capSet.id)}
                                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-700 text-[11px] font-bold flex items-center gap-1 transition-colors"
                              >
                                {copiedKey === capSet.id ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span className="text-emerald-700">Copied</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" />
                                    <span>Copy Caption</span>
                                  </>
                                )}
                              </button>
                            </div>

                            <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{capSet.caption}</p>

                            {capSet.callToAction && (
                              <p className="text-slate-600 italic">
                                <strong>Call to Action:</strong> {capSet.callToAction}
                              </p>
                            )}

                            {capSet.hashtags && capSet.hashtags.length > 0 && (
                              <div className="pt-2 border-t border-slate-200/60 space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                                    <Hash className="w-3 h-3 text-indigo-600" />
                                    <span>Hashtags ({capSet.hashtags.length})</span>
                                  </span>
                                  <button
                                    onClick={() =>
                                      handleCopyText(
                                        capSet.hashtags.map((h: string) => `#${h}`).join(' '),
                                        `hash_${capSet.id}`
                                      )
                                    }
                                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800"
                                  >
                                    {copiedKey === `hash_${capSet.id}` ? 'Copied All!' : 'Copy Hashtags'}
                                  </button>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {capSet.hashtags.map((tag: string, idx: number) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[10px] font-mono"
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <Sparkles className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
                        <p className="text-xs font-semibold text-slate-700">No AI captions generated yet</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Generate viral captions, targeted hashtags, and CTAs tailored for YouTube, Instagram, and LinkedIn.
                        </p>
                        <button
                          onClick={() => {
                            const proj = selectedProject;
                            setSelectedProject(null);
                            navigate('/user/thumbnail-studio', { state: { projectId: proj.id } });
                          }}
                          className="mt-3 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
                        >
                          Generate AI Captions in Studio
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeProjectTab === 'notes' && (
                  <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 space-y-2">
                    <p>
                      <strong>Industry:</strong> {selectedProject.industry}
                    </p>
                    <p>
                      <strong>Category:</strong> {selectedProject.category}
                    </p>
                    <p>
                      <strong>Notes:</strong> {selectedProject.notes || 'No custom notes provided.'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => {
                  const toDelete = selectedProject;
                  setSelectedProject(null);
                  setProjectToDelete(toDelete);
                }}
                className="px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                Delete
              </button>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => {
                    handleDuplicate(selectedProject.id);
                    setSelectedProject(null);
                  }}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Duplicate
                </button>
                <button
                  onClick={() => {
                    const proj = selectedProject;
                    setSelectedProject(null);
                    handleEditInStudio(proj);
                  }}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Script Studio</span>
                </button>
                <button
                  onClick={() => {
                    const proj = selectedProject;
                    setSelectedProject(null);
                    navigate('/user/teleprompter', { state: { projectId: proj.id } });
                  }}
                  className="px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Teleprompter</span>
                </button>
                <button
                  onClick={() => {
                    const proj = selectedProject;
                    setSelectedProject(null);
                    navigate('/user/thumbnail-studio', { state: { projectId: proj.id } });
                  }}
                  className="px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Thumbnails</span>
                </button>
                <button
                  onClick={() => {
                    const proj = selectedProject;
                    setSelectedProject(null);
                    navigate('/user/video-studio', { state: { projectId: proj.id } });
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>Video Studio</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                {language === 'en' ? 'Delete this project?' : 'क्या आप यह प्रोजेक्ट हटाना चाहते हैं?'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'en'
                  ? `"${projectToDelete.title}" and its associated script versions will be permanently removed.`
                  : `"${projectToDelete.title}" और इसके ड्राफ्ट हमेशा के लिए हटा दिए जाएंगे।`}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                {language === 'en' ? 'Cancel' : 'रद्द करें'}
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs"
              >
                {language === 'en' ? 'Delete Permanently' : 'डिलीट करें'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Project Modal */}
      {renameModalProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                  <Edit className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'en' ? 'Rename Project' : 'प्रोजेक्ट का नाम बदलें'}
                </h3>
              </div>
              <button
                onClick={() => setRenameModalProject(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  {language === 'en' ? 'Project Title (English / Primary)' : 'प्रोजेक्ट का शीर्षक'}
                </label>
                <input
                  type="text"
                  value={renameTitle}
                  onChange={(e) => setRenameTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project title..."
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  {language === 'en' ? 'Hindi Title (Optional)' : 'हिंदी शीर्षक (वैकल्पिक)'}
                </label>
                <input
                  type="text"
                  value={renameTitleHi}
                  onChange={(e) => setRenameTitleHi(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs sm:text-sm font-semibold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  placeholder="हिंदी शीर्षक लिखें..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setRenameModalProject(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                {language === 'en' ? 'Cancel' : 'रद्द करें'}
              </button>
              <button
                onClick={() => {
                  if (renameTitle.trim()) {
                    renameProject(renameModalProject.id, renameTitle.trim(), renameTitleHi.trim() || undefined);
                    setRenameModalProject(null);
                    reloadProjects();
                  }
                }}
                disabled={!renameTitle.trim()}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs disabled:opacity-50"
              >
                {language === 'en' ? 'Save Changes' : 'सुरक्षित करें'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification for Social Share / Copy Link */}
      {shareToast && (
        <div className="fixed bottom-20 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{shareToast}</span>
        </div>
      )}
    </div>
  );
};
