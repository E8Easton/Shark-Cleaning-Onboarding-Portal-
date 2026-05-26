import React, { useState } from "react";
import { Film, PlusCircle, Save, Trash2, Video, FileText, CheckSquare, ClipboardList } from "lucide-react";

const TYPE_ICONS = {
  video: Video,
  manual: FileText,
  agreement: CheckSquare,
  "sales-tracking": ClipboardList,
};

export default function ContentStudio({
  tracks,
  onSaveTracks,
  onAddModule,
  onDeleteModule,
  onUpdateModule,
}) {
  const [selectedTrackId, setSelectedTrackId] = useState(tracks[0]?.id || "");
  const [editingId, setEditingId] = useState(null);
  const [savedFlash, setSavedFlash] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("video");
  const [newDesc, setNewDesc] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newDuration, setNewDuration] = useState("5:00");

  const track = tracks.find((t) => t.id === selectedTrackId) || tracks[0];
  const editingModule = track?.modules.find((m) => m.id === editingId);

  const flashSaved = () => {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!track || !newTitle.trim()) return;
    const modId = `${track.id}-${Date.now()}`;
    const mod = {
      id: modId,
      title: newTitle.trim(),
      type: newType,
      description: newDesc.trim() || "Training module",
      videoUrl: newType === "video" ? newUrl.trim() : "",
      duration: newType === "video" ? newDuration || "5:00" : "",
      extraContent:
        newType === "manual"
          ? {
              title: `${newTitle} Handbook`,
              sections: [
                { heading: "Section 1", text: "Add your manual content in Content Studio or edit this later." },
              ],
            }
          : newType === "agreement"
            ? {
                agreementText: `By signing, I agree to all terms in ${newTitle}.`,
              }
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
    onUpdateModule(track.id, editingModule.id, {
      title: form.get("title"),
      description: form.get("description"),
      videoUrl: form.get("videoUrl"),
      duration: form.get("duration"),
    });
    setEditingId(null);
    flashSaved();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b border-navy-border/60">
        <div>
          <h2 className="font-display text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Film className="text-orange w-7 h-7" />
            Content Studio
          </h2>
          <p className="text-sm text-text-secondary mt-1 max-w-xl">
            Add your onboarding videos, update YouTube links, and organize training steps for technicians and sales reps.
          </p>
        </div>
        {savedFlash && (
          <span className="badge badge-agreement flex items-center gap-1">
            <Save className="w-3 h-3" /> Saved
          </span>
        )}
      </div>

      <div className="glass-card p-4 flex flex-wrap gap-3 items-center">
        <label className="text-xs text-text-secondary font-medium">Training track</label>
        <select
          value={selectedTrackId}
          onChange={(e) => {
            setSelectedTrackId(e.target.value);
            setEditingId(null);
          }}
          className="form-input max-w-xs"
        >
          {tracks.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title} ({t.role})
            </option>
          ))}
        </select>
        <button type="button" className="btn btn-primary text-xs ml-auto" onClick={() => { onSaveTracks(tracks); flashSaved(); }}>
          <Save className="w-4 h-4" /> Sync curriculum
        </button>
      </div>

      {/* Add module */}
      <form onSubmit={handleAdd} className="glass-card p-5 orange-hover space-y-4 border border-orange/20">
        <h3 className="font-display font-bold text-orange uppercase text-sm flex items-center gap-2">
          <PlusCircle className="w-4 h-4" /> Add training step
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="form-group mb-0">
            <label className="form-label">Step title</label>
            <input className="form-input" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. 9. Customer Walkthrough" required />
          </div>
          <div className="form-group mb-0">
            <label className="form-label">Type</label>
            <select className="form-input" value={newType} onChange={(e) => setNewType(e.target.value)}>
              <option value="video">Video training</option>
              <option value="manual">Operations manual</option>
              <option value="agreement">Agreement sign-off</option>
              <option value="sales-tracking">Sales tracker</option>
            </select>
          </div>
          {newType === "video" && (
            <>
              <div className="form-group mb-0">
                <label className="form-label">YouTube / video URL</label>
                <input className="form-input" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://www.youtube.com/embed/..." />
              </div>
              <div className="form-group mb-0">
                <label className="form-label">Duration (MM:SS)</label>
                <input className="form-input" value={newDuration} onChange={(e) => setNewDuration(e.target.value)} placeholder="8:30" />
              </div>
            </>
          )}
        </div>
        <div className="form-group mb-0">
          <label className="form-label">Description</label>
          <textarea className="form-input" rows={2} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="What will recruits learn in this step?" />
        </div>
        <button type="submit" className="btn btn-accent text-sm">
          <PlusCircle className="w-4 h-4" /> Add to {track?.title}
        </button>
      </form>

      {/* Module list */}
      <div className="space-y-3">
        {track?.modules.map((mod, index) => {
          const Icon = TYPE_ICONS[mod.type] || Video;
          const isEditing = editingId === mod.id;
          return (
            <div key={mod.id} className="glass-card p-4">
              {isEditing ? (
                <form onSubmit={handleSaveEdit} className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="form-group mb-0">
                      <label className="form-label">Title</label>
                      <input name="title" className="form-input" defaultValue={mod.title} required />
                    </div>
                    {mod.type === "video" && (
                      <>
                        <div className="form-group mb-0">
                          <label className="form-label">Video URL (YouTube embed or .mp4)</label>
                          <input name="videoUrl" className="form-input" defaultValue={mod.videoUrl || ""} />
                        </div>
                        <div className="form-group mb-0">
                          <label className="form-label">Duration</label>
                          <input name="duration" className="form-input" defaultValue={mod.duration || "5:00"} />
                        </div>
                      </>
                    )}
                  </div>
                  <div className="form-group mb-0">
                    <label className="form-label">Description</label>
                    <textarea name="description" className="form-input" rows={2} defaultValue={mod.description} />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button type="button" className="btn btn-outline text-xs" onClick={() => setEditingId(null)}>Cancel</button>
                    <button type="submit" className="btn btn-primary text-xs">Save changes</button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-wrap items-center gap-3 justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-full bg-navy-dark border border-navy-border flex items-center justify-center text-xs font-mono text-text-secondary shrink-0">
                      {index + 1}
                    </span>
                    <Icon className="w-4 h-4 text-sky-blue shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">{mod.title}</p>
                      <p className="text-[10px] text-text-secondary uppercase">
                        {mod.type}
                        {mod.duration ? ` • ${mod.duration}` : ""}
                        {mod.videoUrl ? " • video linked" : mod.type === "video" ? " • no video yet" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className="btn btn-outline text-xs py-1.5 px-3" onClick={() => setEditingId(mod.id)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400"
                      onClick={() => onDeleteModule(track.id, mod.id)}
                      title="Remove step"
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
  );
}
