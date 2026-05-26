import React, { useState, useEffect } from "react";
import {
  Users,
  Film,
  PlusCircle,
  Save,
  Trash2,
  Video,
  FileText,
  CheckSquare,
  ClipboardList,
  CheckCircle2,
  Clock,
  Award,
  RotateCcw,
  Layers,
} from "lucide-react";
import { loadProgress } from "../lib/storage";
import { isTraineeFullyComplete } from "../lib/users";
import { loadDeletedSteps, pushDeletedStep, removeDeletedStep, saveDeletedSteps } from "../lib/deletedSteps";

const TYPE_ICONS = {
  video: Video,
  manual: FileText,
  agreement: CheckSquare,
  "sales-tracking": ClipboardList,
};

export default function AdminPanel({
  users = [],
  tracks = [],
  onSaveTracks,
  onAddTrack,
  onDeleteTrack,
  onAddModule,
  onDeleteModule,
  onUpdateModule,
  onRestoreDefaultSteps,
}) {
  const [tab, setTab] = useState("completions");
  const [selectedTrackId, setSelectedTrackId] = useState(tracks[0]?.id || "");
  const [editingId, setEditingId] = useState(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const [progressMap, setProgressMap] = useState({});
  const [deletedSteps, setDeletedSteps] = useState(() => loadDeletedSteps());
  const [showAddTrack, setShowAddTrack] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("video");
  const [newDesc, setNewDesc] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newDuration, setNewDuration] = useState("5:00");

  const [trackTitle, setTrackTitle] = useState("");
  const [trackRole, setTrackRole] = useState("");
  const [trackDesc, setTrackDesc] = useState("");

  const track = tracks.find((t) => t.id === selectedTrackId) || tracks[0];
  const editingModule = track?.modules.find((m) => m.id === editingId);
  const trainees = users.filter((u) => u.role !== "admin");

  useEffect(() => {
    (async () => {
      const list = users.filter((u) => u.role !== "admin");
      const map = {};
      for (const u of list) {
        map[u.id] = (await loadProgress(u.id)) || { completedModules: [] };
      }
      setProgressMap(map);
    })();
  }, [users]);

  const flashSaved = () => {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  const handleDeleteStep = (trackId, mod, index) => {
    const label = mod.title.replace(/^\d+\.\s*/, "");
    if (!window.confirm(`Delete step "${label}"?\n\nYou can restore it right away from Recently deleted below.`)) {
      return;
    }
    const entry = {
      trackId,
      trackTitle: track?.title || "Track",
      module: mod,
      index,
    };
    const nextTrash = pushDeletedStep(entry);
    setDeletedSteps(nextTrash);
    onDeleteModule(trackId, mod.id);
    if (editingId === mod.id) setEditingId(null);
    flashSaved();
  };

  const handleRestoreStep = (entry) => {
    onAddModule(entry.trackId, entry.module, entry.index);
    const nextTrash = removeDeletedStep(entry.module.id);
    setDeletedSteps(nextTrash);
    setSelectedTrackId(entry.trackId);
    flashSaved();
  };

  const handleCreateTrack = (e) => {
    e.preventDefault();
    if (!trackTitle.trim() || !trackRole.trim()) return;
    const roleSlug = trackRole.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const id = roleSlug || `track-${Date.now()}`;
    if (tracks.some((t) => t.id === id || t.role === roleSlug)) {
      window.alert("A track with this role ID already exists. Use a different role name.");
      return;
    }
    onAddTrack({
      id,
      title: trackTitle.trim(),
      role: roleSlug,
      description: trackDesc.trim() || "Custom training path",
      modules: [],
    });
    setSelectedTrackId(id);
    setTrackTitle("");
    setTrackRole("");
    setTrackDesc("");
    setShowAddTrack(false);
    flashSaved();
  };

  const handleRestoreAllDefaults = () => {
    if (!window.confirm("Restore any missing default steps for Technician and Sales tracks? Your edits to existing steps are kept.")) {
      return;
    }
    onRestoreDefaultSteps();
    saveDeletedSteps([]);
    setDeletedSteps([]);
    flashSaved();
  };

  const handleRemoveTrack = () => {
    if (!track) return;
    if (["technician", "sales"].includes(track.id)) {
      window.alert("The default Technician and Sales tracks cannot be removed.");
      return;
    }
    if (!window.confirm(`Remove entire track "${track.title}"? All its steps will be deleted.`)) return;
    onDeleteTrack(track.id);
    setSelectedTrackId(tracks.find((t) => t.id !== track.id)?.id || "");
    flashSaved();
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!track || !newTitle.trim()) return;
    const stepNum = track.modules.length + 1;
    const mod = {
      id: `${track.id}-${Date.now()}`,
      title: newTitle.trim().match(/^\d+\./) ? newTitle.trim() : `${stepNum}. ${newTitle.trim()}`,
      type: newType,
      description: newDesc.trim() || "Training module",
      videoUrl: newType === "video" ? newUrl.trim() : "",
      duration: newType === "video" ? newDuration || "5:00" : "",
      extraContent:
        newType === "manual"
          ? {
              title: `${newTitle} Handbook`,
              sections: [{ heading: "Section 1", text: "Edit this section in Admin → Edit Content." }],
            }
          : newType === "agreement"
            ? { agreementText: `By signing, I agree to all terms in ${newTitle}.` }
            : {},
    };
    onAddModule(track.id, mod);
    setNewTitle("");
    setNewDesc("");
    setNewUrl("");
    setNewDuration("5:00");
    flashSaved();
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!track || !editingModule) return;
    const form = new FormData(e.target);
    const updates = {
      title: form.get("title"),
      description: form.get("description"),
      videoUrl: form.get("videoUrl") ?? editingModule.videoUrl,
      duration: form.get("duration") ?? editingModule.duration,
    };

    if (editingModule.type === "manual") {
      updates.extraContent = {
        title: form.get("manualTitle") || editingModule.extraContent?.title,
        sections: parseManualSections(form.get("manualSections")),
      };
    }
    if (editingModule.type === "agreement") {
      updates.extraContent = {
        agreementText: form.get("agreementText") || editingModule.extraContent?.agreementText,
      };
    }

    onUpdateModule(track.id, editingModule.id, updates);
    setEditingId(null);
    flashSaved();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-navy-border/60">
        <div>
          <h2 className="font-display text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Award className="text-orange w-7 h-7" />
            Admin Dashboard
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            See who finished onboarding and edit every training step, video, and page text.
          </p>
        </div>
        {savedFlash && (
          <span className="badge badge-agreement flex items-center gap-1">
            <Save className="w-3 h-3" /> Saved
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTab("completions")}
          className={`btn text-xs ${tab === "completions" ? "btn-primary" : "btn-secondary"}`}
        >
          <Users className="w-4 h-4" />
          Completions ({trainees.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("content")}
          className={`btn text-xs ${tab === "content" ? "btn-accent" : "btn-secondary"}`}
        >
          <Film className="w-4 h-4" />
          Edit training content
        </button>
      </div>

      {tab === "completions" && (
        <div className="glass-card p-6 overflow-x-auto">
          <h3 className="font-display font-bold text-white mb-4">Trainee progress</h3>
          {trainees.length === 0 ? (
            <p className="text-sm text-text-secondary">No trainees have started yet. They appear here after entering their name.</p>
          ) : (
            <table className="w-full text-left text-xs min-w-[640px]">
              <thead>
                <tr className="border-b border-navy-border text-text-secondary font-mono uppercase text-[10px]">
                  <th className="py-3 pr-3">Name</th>
                  <th className="py-3 pr-3">Role</th>
                  <th className="py-3 pr-3">Progress</th>
                  <th className="py-3 pr-3">Status</th>
                  <th className="py-3 pr-3">Signature</th>
                  <th className="py-3 text-right">Started</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-border/30">
                {trainees.map((u) => {
                  const userTrack = tracks.find((t) => t.role === u.role);
                  const total = userTrack?.modules?.length || 0;
                  const progress = progressMap[u.id] || { completedModules: [] };
                  const done = progress.completedModules?.length || 0;
                  const complete = isTraineeFullyComplete(progress, userTrack);
                  return (
                    <tr key={u.id} className="hover:bg-navy-light/10">
                      <td className="py-3 pr-3 font-bold text-white">{u.name}</td>
                      <td className="py-3 pr-3">
                        <span className={`badge text-[9px] ${u.role === "sales" ? "bg-orange/15 text-orange" : "bg-sky-blue/15 text-sky-blue"}`}>
                          {u.role === "sales" ? "Sales" : "Technician"}
                        </span>
                      </td>
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-white">{done}/{total}</span>
                          <div className="w-24 h-1.5 bg-navy-dark rounded-full overflow-hidden">
                            <div className="bg-success h-full" style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-3">
                        {complete ? (
                          <span className="text-success font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Fully done
                          </span>
                        ) : (
                          <span className="text-text-muted flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> In progress
                          </span>
                        )}
                      </td>
                      <td className="py-3 pr-3 text-orange font-mono text-[11px]">
                        {progress.signedName ? `✍ ${progress.signedName}` : "—"}
                      </td>
                      <td className="py-3 text-right text-text-muted font-mono text-[10px]">
                        {u.startedAt ? new Date(u.startedAt).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === "content" && (
        <div className="space-y-6">
          <div className="glass-card p-4 space-y-4">
            <div className="flex flex-wrap gap-3 items-center">
              <label className="text-xs text-text-secondary font-medium">Edit track</label>
              <select
                value={selectedTrackId}
                onChange={(e) => { setSelectedTrackId(e.target.value); setEditingId(null); }}
                className="form-input max-w-md flex-1 min-w-[200px]"
              >
                {tracks.map((t) => (
                  <option key={t.id} value={t.id}>{t.title} ({t.role})</option>
                ))}
              </select>
              <button type="button" className="btn btn-outline text-xs" onClick={() => setShowAddTrack(!showAddTrack)}>
                <Layers className="w-4 h-4" /> Add new track
              </button>
              <button type="button" className="btn btn-primary text-xs" onClick={() => { onSaveTracks(tracks); flashSaved(); }}>
                <Save className="w-4 h-4" /> Save all
              </button>
              <button type="button" className="btn btn-outline text-xs" onClick={handleRestoreAllDefaults} title="Brings back any deleted default training steps">
                <RotateCcw className="w-4 h-4" /> Restore missing steps
              </button>
            </div>

            {showAddTrack && (
              <form onSubmit={handleCreateTrack} className="p-4 rounded-lg border border-sky-blue/30 bg-sky-blue/5 space-y-3">
                <p className="text-xs font-bold text-sky-blue uppercase">New training track</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="form-group mb-0">
                    <label className="form-label">Track name</label>
                    <input className="form-input" value={trackTitle} onChange={(e) => setTrackTitle(e.target.value)} placeholder="e.g. Supervisor Training" required />
                  </div>
                  <div className="form-group mb-0">
                    <label className="form-label">Role ID (for login button)</label>
                    <input className="form-input" value={trackRole} onChange={(e) => setTrackRole(e.target.value)} placeholder="e.g. supervisor" required />
                  </div>
                  <div className="form-group mb-0">
                    <label className="form-label">Short description</label>
                    <input className="form-input" value={trackDesc} onChange={(e) => setTrackDesc(e.target.value)} placeholder="Shown on home screen" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="btn btn-primary text-xs">Create track</button>
                  <button type="button" className="btn btn-outline text-xs" onClick={() => setShowAddTrack(false)}>Cancel</button>
                </div>
              </form>
            )}

            {track && !["technician", "sales"].includes(track.id) && (
              <button type="button" onClick={handleRemoveTrack} className="text-xs text-red-400 hover:text-red-300">
                Delete this entire track
              </button>
            )}
          </div>

          {deletedSteps.length > 0 && (
            <div className="glass-card p-4 border border-orange/30 bg-orange/5 space-y-3">
              <h4 className="font-display font-bold text-sm text-orange flex items-center gap-2">
                <RotateCcw className="w-4 h-4" /> Recently deleted — restore a step
              </h4>
              <ul className="space-y-2">
                {deletedSteps.map((entry) => (
                  <li key={`${entry.module.id}-${entry.deletedAt}`} className="flex flex-wrap items-center justify-between gap-2 text-sm bg-navy-dark/60 p-2.5 rounded-lg border border-navy-border/50">
                    <span className="text-text-secondary">
                      <strong className="text-white">{entry.module.title}</strong>
                      <span className="text-[10px] block">{entry.trackTitle} • was step {(entry.index ?? 0) + 1}</span>
                    </span>
                    <button type="button" className="btn btn-accent text-xs py-1.5" onClick={() => handleRestoreStep(entry)}>
                      <RotateCcw className="w-3.5 h-3.5" /> Restore
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleAdd} className="glass-card p-5 border border-orange/20 space-y-4">
            <h3 className="font-display font-bold text-orange uppercase text-sm flex items-center gap-2">
              <PlusCircle className="w-4 h-4" /> Add step (8, 9, 10…)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="form-group mb-0">
                <label className="form-label">Step title</label>
                <input className="form-input" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Customer walkthrough" required />
              </div>
              <div className="form-group mb-0">
                <label className="form-label">Type</label>
                <select className="form-input" value={newType} onChange={(e) => setNewType(e.target.value)}>
                  <option value="video">Video</option>
                  <option value="manual">Manual / text page</option>
                  <option value="agreement">Agreement sign-off</option>
                  <option value="sales-tracking">Sales tracker</option>
                </select>
              </div>
              {newType === "video" && (
                <>
                  <div className="form-group mb-0">
                    <label className="form-label">YouTube embed URL</label>
                    <input className="form-input" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://www.youtube.com/embed/..." />
                  </div>
                  <div className="form-group mb-0">
                    <label className="form-label">Duration (MM:SS)</label>
                    <input className="form-input" value={newDuration} onChange={(e) => setNewDuration(e.target.value)} />
                  </div>
                </>
              )}
            </div>
            <div className="form-group mb-0">
              <label className="form-label">Page description (shown above content)</label>
              <textarea className="form-input" rows={2} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-accent text-sm">
              <PlusCircle className="w-4 h-4" /> Add step to {track?.title}
            </button>
          </form>

          <div className="space-y-3">
            {track?.modules.map((mod, index) => {
              const Icon = TYPE_ICONS[mod.type] || Video;
              const isEditing = editingId === mod.id;
              return (
                <div key={mod.id} className="glass-card p-4">
                  {isEditing ? (
                    <form onSubmit={handleSaveEdit} className="space-y-3">
                      <p className="text-xs text-orange font-mono uppercase">Editing step {index + 1}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="form-group mb-0">
                          <label className="form-label">Title</label>
                          <input name="title" className="form-input" defaultValue={mod.title} required />
                        </div>
                        <div className="form-group mb-0">
                          <label className="form-label">Description (page intro text)</label>
                          <textarea name="description" className="form-input" rows={2} defaultValue={mod.description} />
                        </div>
                        {mod.type === "video" && (
                          <>
                            <div className="form-group mb-0">
                              <label className="form-label">Video URL</label>
                              <input name="videoUrl" className="form-input" defaultValue={mod.videoUrl || ""} />
                            </div>
                            <div className="form-group mb-0">
                              <label className="form-label">Duration</label>
                              <input name="duration" className="form-input" defaultValue={mod.duration || "5:00"} />
                            </div>
                          </>
                        )}
                        {mod.type === "manual" && (
                          <>
                            <div className="form-group mb-0 md:col-span-2">
                              <label className="form-label">Manual title</label>
                              <input name="manualTitle" className="form-input" defaultValue={mod.extraContent?.title || ""} />
                            </div>
                            <div className="form-group mb-0 md:col-span-2">
                              <label className="form-label">Manual sections (one per line: Heading | paragraph text)</label>
                              <textarea
                                name="manualSections"
                                className="form-input font-mono text-xs"
                                rows={6}
                                defaultValue={formatManualSections(mod.extraContent?.sections)}
                              />
                            </div>
                          </>
                        )}
                        {mod.type === "agreement" && (
                          <div className="form-group mb-0 md:col-span-2">
                            <label className="form-label">Agreement text</label>
                            <textarea name="agreementText" className="form-input" rows={4} defaultValue={mod.extraContent?.agreementText || ""} />
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button type="button" className="btn btn-outline text-xs" onClick={() => setEditingId(null)}>Cancel</button>
                        <button type="submit" className="btn btn-primary text-xs">Save</button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-wrap items-center gap-3 justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-8 h-8 rounded-full bg-navy-dark border border-navy-border flex items-center justify-center text-sm font-bold text-white shrink-0">
                          {index + 1}
                        </span>
                        <Icon className="w-4 h-4 text-sky-blue shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold text-white">{mod.title}</p>
                          <p className="text-[10px] text-text-secondary line-clamp-1">{mod.description}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button type="button" className="btn btn-outline text-xs" onClick={() => setEditingId(mod.id)}>Edit</button>
                        <button
                          type="button"
                          className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400"
                          onClick={() => handleDeleteStep(track.id, mod, index)}
                          title="Delete step (can restore after)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function formatManualSections(sections = []) {
  return sections.map((s) => `${s.heading} | ${s.text}`).join("\n");
}

function parseManualSections(raw) {
  if (!raw?.trim()) return [{ heading: "Section 1", text: "Add content here." }];
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const pipe = line.indexOf("|");
      if (pipe === -1) return { heading: line, text: "" };
      return {
        heading: line.slice(0, pipe).trim(),
        text: line.slice(pipe + 1).trim(),
      };
    });
}
