import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useToast } from '../contexts/ToastContext';
import { Plus, Film, Trash2, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const STATUS_ICON = {
  draft: <Clock size={14} className="text-muted" />,
  rendering: <Loader2 size={14} className="text-blue-400 animate-spin" />,
  done: <CheckCircle size={14} className="text-green-400" />,
  error: <AlertCircle size={14} className="text-accent" />,
};

const STATUS_LABEL = {
  draft: 'Draft',
  rendering: 'Rendering…',
  done: 'Done',
  error: 'Error',
};

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  async function createProject(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const project = await api.createProject(newName.trim());
      navigate(`/project/${project.id}`);
    } catch (err) {
      toast(err.message, 'error');
      setCreating(false);
    }
  }

  async function deleteProject(e, id) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Delete this project? This cannot be undone.')) return;
    try {
      await api.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast('Project deleted', 'success');
    } catch (err) {
      toast(err.message, 'error');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Your Projects</h1>
          <p className="text-muted text-sm mt-1">Build and export video slideshows</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowCreate(true)}>
          <Plus size={18} />
          New project
        </button>
      </div>

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="card w-full max-w-sm mx-4">
            <h2 className="text-lg font-semibold mb-4">New project</h2>
            <form onSubmit={createProject} className="space-y-4">
              <div>
                <label className="label">Project name</label>
                <input
                  autoFocus
                  className="input"
                  placeholder="e.g. Top 10 Ancient Wonders"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => { setShowCreate(false); setNewName(''); }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={creating}>
                  {creating ? 'Creating…' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={32} className="animate-spin text-muted" />
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-card border border-border rounded-2xl flex items-center justify-center mb-5">
            <Film size={28} className="text-muted" />
          </div>
          <h2 className="text-lg font-semibold mb-2">No projects yet</h2>
          <p className="text-muted text-sm mb-6">Create your first project to get started</p>
          <button className="btn-primary flex items-center gap-2" onClick={() => setShowCreate(true)}>
            <Plus size={18} />
            New project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/project/${project.id}`}
              className="card hover:border-accent/50 transition-colors group relative"
            >
              {/* Thumbnail placeholder */}
              <div className="w-full aspect-video bg-bg rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {project.images?.[0]?.url ? (
                  <img
                    src={project.images[0].url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Film size={32} className="text-border" />
                )}
              </div>

              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold truncate group-hover:text-accent transition-colors">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    {STATUS_ICON[project.status] || STATUS_ICON.draft}
                    <span className="text-xs text-muted">{STATUS_LABEL[project.status] || 'Draft'}</span>
                    {project.images?.length > 0 && (
                      <span className="text-xs text-muted">· {project.images.length} images</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => deleteProject(e, project.id)}
                  className="opacity-0 group-hover:opacity-100 btn-ghost p-1.5 text-muted hover:text-accent transition-all shrink-0"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
