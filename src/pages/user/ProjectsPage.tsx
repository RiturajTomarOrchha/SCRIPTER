import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import { useLanguage } from '../../context/LanguageContext';
import { Project, ProjectStatus } from '../../types';
import { getProjects, deleteProject, duplicateProject, saveProject } from '../../services/storage';
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
} from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { activeBusinessProfile } = useRole();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [projectsList, setProjectsList] = useState<Project[]>(() => getProjects());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ProjectStatus>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeProjectTab, setActiveProjectTab] = useState<'script' | 'visuals' | 'notes'>('script');
  const [selectedVersionIndex, setSelectedVersionIndex] = useState(0);

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
      // Status filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'draft' && proj.status !== 'draft') return false;
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
        return matchTitle || matchCategory;
      }
      return true;
    });
  }, [projectsList, statusFilter, searchQuery]);

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
        prefilledTopic: proj.title,
        industry: proj.industry,
        category: proj.category,
      },
    });
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

        {/* Search & Status Filters */}
        <div className="mt-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'en'
                  ? 'Search projects by title or category...'
                  : 'प्रोजेक्ट का नाम या श्रेणी खोजें...'
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

          {/* Status Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', labelEn: `All (${projectsList.length})`, labelHi: `सभी (${projectsList.length})` },
              { id: 'draft', labelEn: 'Drafts', labelHi: 'ड्राफ्ट' },
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

            const versionsCount = proj.scriptVersions?.length || 1;

            return (
              <div
                key={proj.id}
                onClick={() => setSelectedProject(proj)}
                className="group bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-blue-400 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between space-y-3 relative"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${statusConfig.bg}`}>
                      {statusConfig.label}
                    </span>

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
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Context menu popup */}
                  {actionMenuProjectId === proj.id && (
                    <div
                      className="absolute right-4 top-12 z-20 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1 text-xs text-slate-700 animate-in fade-in zoom-in-95 duration-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => {
                          setActionMenuProjectId(null);
                          handleEditInStudio(proj);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit in Studio</span>
                      </button>
                      <button
                        onClick={() => handleDuplicate(proj.id)}
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Duplicate</span>
                      </button>
                      <button
                        onClick={() => handleToggleArchive(proj)}
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-2"
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
                        className="w-full text-left px-3 py-1.5 text-red-600 hover:bg-red-50 flex items-center gap-2"
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
                </div>

                {/* Footer Metadata */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{proj.timeAgo}</span>
                    </span>
                    <span>·</span>
                    <span className="font-medium text-slate-500">{proj.format.toUpperCase()}</span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    v{versionsCount}
                  </span>
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

              {/* Title Header */}
              <div className="mt-4">
                <h2 className="text-lg font-bold text-slate-900">
                  {language === 'hi' && selectedProject.titleHi
                    ? selectedProject.titleHi
                    : selectedProject.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Last updated {selectedProject.timeAgo} · {selectedProject.industry}
                </p>
              </div>

              {/* Tabs: Script | Visuals | Notes */}
              <div className="flex items-center gap-2 mt-4 border-b border-slate-100 pb-2">
                <button
                  onClick={() => setActiveProjectTab('script')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeProjectTab === 'script'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Script Text
                </button>
                <button
                  onClick={() => setActiveProjectTab('visuals')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeProjectTab === 'visuals'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Scenes ({selectedProject.scenes?.length || 0})
                </button>
                <button
                  onClick={() => setActiveProjectTab('notes')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
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
                    {/* Version switcher */}
                    {selectedProject.scriptVersions && selectedProject.scriptVersions.length > 1 && (
                      <div className="flex items-center gap-1.5 mb-2">
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
                    )}

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
                Delete Project
              </button>

              <div className="flex items-center gap-2">
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
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Open in Script Studio</span>
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
    </div>
  );
};
