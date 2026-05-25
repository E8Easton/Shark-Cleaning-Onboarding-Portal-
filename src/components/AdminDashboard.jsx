import React, { useState } from "react";
import { Users, BookOpen, PlusCircle, CheckCircle, ShieldAlert, Trash2, Edit3, Award, Clock, Calendar, Video, FileText, CheckSquare } from "lucide-react";

export default function AdminDashboard({ 
  usersList = [], 
  tracks = [], 
  onAddTrack, 
  onAddModule, 
  onDeleteModule, 
  onDeleteTrack 
}) {
  const [activeTab, setActiveTab] = useState("users"); // "users" | "courses"
  
  // States for adding a new track
  const [newTrackTitle, setNewTrackTitle] = useState("");
  const [newTrackRole, setNewTrackRole] = useState("manager");
  const [newTrackDesc, setNewTrackDesc] = useState("");
  const [showAddTrackForm, setShowAddTrackForm] = useState(false);

  // States for adding a new module
  const [selectedTrackId, setSelectedTrackId] = useState(tracks[0]?.id || "");
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleType, setModuleType] = useState("video");
  const [moduleDesc, setModuleDesc] = useState("");
  const [moduleUrl, setModuleUrl] = useState("");
  const [moduleDuration, setModuleDuration] = useState("");
  const [showAddModuleForm, setShowAddModuleForm] = useState(false);

  const handleCreateTrack = (e) => {
    e.preventDefault();
    if (!newTrackTitle || !newTrackDesc) return;
    
    const trackId = newTrackTitle.toLowerCase().replace(/[^a-z0-9]/g, "-");
    onAddTrack({
      id: trackId,
      title: newTrackTitle,
      role: newTrackRole,
      description: newTrackDesc,
      modules: []
    });

    setNewTrackTitle("");
    setNewTrackDesc("");
    setShowAddTrackForm(false);
    setSelectedTrackId(trackId);
  };

  const handleCreateModule = (e) => {
    e.preventDefault();
    if (!moduleTitle || !moduleDesc) return;

    const modId = moduleTitle.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Math.floor(Math.random() * 1000);
    const newModule = {
      id: modId,
      title: moduleTitle,
      type: moduleType,
      description: moduleDesc,
      videoUrl: moduleType === "video" ? (moduleUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ") : "",
      duration: moduleType === "video" ? (moduleDuration || "5:00") : "",
      extraContent: moduleType === "manual" ? {
        title: `${moduleTitle} Handbook`,
        sections: [
          { heading: "1. Core Operations", text: "Fill in your custom operations manual instructions here in the admin panel." },
          { heading: "2. Standards & Reviews", text: "Enter standard operating instructions, metrics, and safety checks." }
        ]
      } : moduleType === "agreement" ? {
        agreementText: `By signing below, I certify that I have read and agree to all terms of the ${moduleTitle}.`
      } : {}
    };

    onAddModule(selectedTrackId, newModule);

    setModuleTitle("");
    setModuleDesc("");
    setModuleUrl("");
    setModuleDuration("");
    setShowAddModuleForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="pb-3 border-b border-navy-border/60">
        <h2 className="font-display text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
          <Award className="text-orange w-7 h-7" /> Shark Academy Administration Console
        </h2>
        <p className="text-xs text-text-secondary mt-1">
          Review contractor onboarding metrics, inspect e-signatures, and configure learning modules dynamically.
        </p>
      </div>

      {/* Admin Tab Controller */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("users")}
          className={`btn ${activeTab === "users" ? "btn-primary" : "btn-secondary"} text-xs flex items-center gap-1`}
        >
          <Users className="w-4 h-4" />
          Onboarding Contractors ({usersList.length})
        </button>
        <button
          onClick={() => setActiveTab("courses")}
          className={`btn ${activeTab === "courses" ? "btn-primary" : "btn-secondary"} text-xs flex items-center gap-1`}
        >
          <BookOpen className="w-4 h-4" />
          Manage Video Tracks ({tracks.length})
        </button>
      </div>

      {/* View 1: Onboarding User Progress Grid */}
      {activeTab === "users" && (
        <div className="glass-card p-6 space-y-4">
          <h3 className="font-display text-base font-bold text-white mb-2">Registered Candidates & Sign-off Audits</h3>
          {usersList.length === 0 ? (
            <p className="text-sm text-text-secondary">No candidates have registered yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-navy-border text-text-secondary font-mono">
                    <th className="py-3 px-2">Contractor Name</th>
                    <th className="py-3 px-2">Role</th>
                    <th className="py-3 px-2">Email</th>
                    <th className="py-3 px-2">Onboarding Progress</th>
                    <th className="py-3 px-2">Agreement Signature</th>
                    <th className="py-3 px-2">Secure IP Address</th>
                    <th className="py-3 px-2 text-right">Sign-off Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-border/30">
                  {usersList.map((usr) => {
                    const trackData = tracks.find(t => t.role === usr.role) || tracks[0];
                    const totalModules = trackData ? trackData.modules.length : 0;
                    const progress = usr.progress || { completedModules: [] };
                    const completedCount = progress.completedModules.length;
                    const isFullySigned = progress.signedName?.length > 0;

                    return (
                      <tr key={usr.email} className="hover:bg-navy-light/10 transition-colors">
                        <td className="py-3 px-2 font-bold text-white">{usr.name}</td>
                        <td className="py-3 px-2">
                          <span className={`badge text-[9px] ${
                            usr.role === "sales" ? "bg-orange/15 text-orange" : 
                            usr.role === "admin" ? "bg-red-500/10 text-red-400" : "bg-sky-blue/15 text-sky-blue"
                          }`}>
                            {usr.role}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-text-secondary font-mono">{usr.email}</td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-white font-semibold">
                              {completedCount}/{totalModules}
                            </span>
                            <div className="w-20 bg-navy-dark h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-success h-full" 
                                style={{ width: `${(completedCount / totalModules) * 100 || 0}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          {isFullySigned ? (
                            <span 
                              className="text-orange font-bold font-mono text-[11px]" 
                              style={{ fontFamily: "'Outfit', cursive", fontStyle: "italic" }}
                            >
                              ✍️ {progress.signedName}
                            </span>
                          ) : (
                            <span className="text-text-muted italic flex items-center gap-1 text-[10px]">
                              <Clock className="w-3.5 h-3.5" /> In Progress
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-2 font-mono text-text-secondary">{progress.signedIp || "N/A"}</td>
                        <td className="py-3 px-2 text-right font-mono text-[10px] text-text-secondary">
                          {progress.signedDate || "Pending Completion"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* View 2: Dynamic Course Manager */}
      {activeTab === "courses" && (
        <div className="space-y-6">
          {/* Controls Row */}
          <div className="flex justify-between items-center bg-navy-card border border-navy-border p-4 rounded-lg">
            <div>
              <h4 className="font-display font-bold text-white text-sm">Configure Training Curriculums</h4>
              <p className="text-xs text-text-secondary">Configure step-by-step guides, safety tutorials, or custom role paths.</p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddTrackForm(!showAddTrackForm)}
                className="btn btn-outline text-xs"
              >
                + Create Track Section
              </button>
              <button
                onClick={() => setShowAddModuleForm(!showAddModuleForm)}
                className="btn btn-accent text-xs"
                disabled={tracks.length === 0}
              >
                + Add Module Step
              </button>
            </div>
          </div>

          {/* Form: Create Track Section */}
          {showAddTrackForm && (
            <form onSubmit={handleCreateTrack} className="glass-card p-5 bg-sky-blue/5 border-sky-blue animate-fade-in space-y-4">
              <h4 className="font-display font-bold text-sm text-sky-blue uppercase">Create New Onboarding Section Track</h4>
              
              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">Track Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Manager Training" 
                    value={newTrackTitle}
                    onChange={(e) => setNewTrackTitle(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Target Role Filter</label>
                  <select 
                    value={newTrackRole} 
                    onChange={(e) => setNewTrackRole(e.target.value)}
                    className="form-input"
                  >
                    <option value="technician">Technician Role</option>
                    <option value="sales">Sales Rep Role</option>
                    <option value="manager">Manager / Supervisor</option>
                    <option value="leader">Section Leader</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Short Description</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Onboarding modules for team leads..." 
                    value={newTrackDesc}
                    onChange={(e) => setNewTrackDesc(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddTrackForm(false)} className="btn btn-outline btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary text-xs">
                  Create Section Track
                </button>
              </div>
            </form>
          )}

          {/* Form: Add Module Step */}
          {showAddModuleForm && (
            <form onSubmit={handleCreateModule} className="glass-card p-5 bg-orange/5 border-orange animate-fade-in space-y-4">
              <h4 className="font-display font-bold text-sm text-orange uppercase">Add Training Module / Document Step</h4>
              
              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">Select Target Track</label>
                  <select 
                    value={selectedTrackId}
                    onChange={(e) => setSelectedTrackId(e.target.value)}
                    className="form-input"
                  >
                    {tracks.map(t => (
                      <option key={t.id} value={t.id}>{t.title} ({t.role})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Module Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 5. Advanced Glass Scrubbing" 
                    value={moduleTitle}
                    onChange={(e) => setModuleTitle(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Module Action Type</label>
                  <select 
                    value={moduleType}
                    onChange={(e) => setModuleType(e.target.value)}
                    className="form-input"
                  >
                    <option value="video">Video Training (Completion Locked)</option>
                    <option value="manual">Text Operations Manual (Scroll Locked)</option>
                    <option value="agreement">Contractor Legal Agreement Sign-off</option>
                    <option value="sales-tracking">D2D Sales Tracking Dashboard</option>
                  </select>
                </div>
              </div>

              {moduleType === "video" && (
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">YouTube/Vimeo Embed URL</label>
                    <input 
                      type="url" 
                      placeholder="e.g. https://www.youtube.com/embed/dQw4w9WgXcQ"
                      value={moduleUrl}
                      onChange={(e) => setModuleUrl(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Video Play Duration (e.g. MM:SS)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 5:45"
                      value={moduleDuration}
                      onChange={(e) => setModuleDuration(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Module Learning Summary Description</label>
                <textarea 
                  placeholder="Explain exactly what the hire will learn or sign in this step..."
                  value={moduleDesc}
                  onChange={(e) => setModuleDesc(e.target.value)}
                  className="form-input"
                  rows={2}
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddModuleForm(false)} className="btn btn-outline btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn btn-accent text-xs">
                  Add Step to Curriculum
                </button>
              </div>
            </form>
          )}

          {/* Active Track Cards */}
          <div className="space-y-4">
            {tracks.map((track) => (
              <div key={track.id} className="glass-card p-5 space-y-4">
                <div className="flex justify-between items-start pb-3 border-b border-navy-border/55">
                  <div>
                    <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                      {track.title}
                      <span className="badge text-[9px] bg-sky-blue/10 text-sky-blue">{track.role}</span>
                    </h3>
                    <p className="text-xs text-text-secondary mt-0.5">{track.description}</p>
                  </div>
                  
                  <button 
                    onClick={() => onDeleteTrack(track.id)}
                    className="p-1.5 rounded hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors"
                    title="Remove this track section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {track.modules.length === 0 ? (
                  <p className="text-xs text-text-muted italic">No module steps loaded into this track. Add steps above!</p>
                ) : (
                  <div className="space-y-2">
                    {track.modules.map((mod, index) => (
                      <div 
                        key={mod.id} 
                        className="bg-navy-dark border border-navy-border/50 p-3 rounded flex items-center justify-between text-xs hover:border-sky-blue/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-text-secondary bg-navy-card w-5 h-5 rounded-full flex items-center justify-center border border-navy-border">
                            {index + 1}
                          </span>
                          
                          {mod.type === "video" && <Video className="w-4 h-4 text-sky-blue" />}
                          {mod.type === "manual" && <FileText className="w-4 h-4 text-orange" />}
                          {mod.type === "agreement" && <CheckSquare className="w-4 h-4 text-success" />}
                          
                          <div>
                            <span className="font-semibold text-white block">{mod.title}</span>
                            <span className="text-[10px] text-text-secondary">
                              Type: <span className="uppercase text-text-primary">{mod.type}</span> 
                              {mod.duration && ` • Duration: ${mod.duration}`}
                            </span>
                          </div>
                        </div>

                        <button 
                          onClick={() => onDeleteModule(track.id, mod.id)}
                          className="p-1 rounded hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors"
                          title="Delete module step"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
