import React from "react";
import { LogOut, CheckCircle2, Lock, Play, ScrollText, ShieldCheck, ClipboardList, Shield } from "lucide-react";
import logoImg from "../assets/logo.png";

export default function Sidebar({ 
  user, 
  track, 
  activeModuleId, 
  onSelectModule, 
  progress, 
  onLogout,
  setViewAdmin,
  viewAdmin
}) {
  if (!user) return null;

  // Calculate completion numbers
  const totalModules = track ? track.modules.length : 0;
  const completedCount = progress ? progress.completedModules.length : 0;
  const percentComplete = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  // Helper to determine module icon
  const getModuleIcon = (type) => {
    switch (type) {
      case "video":
        return <Play className="w-4 h-4" />;
      case "manual":
        return <ScrollText className="w-4 h-4" />;
      case "agreement":
        return <ShieldCheck className="w-4 h-4" />;
      case "sales-tracking":
        return <ClipboardList className="w-4 h-4" />;
      default:
        return <Play className="w-4 h-4" />;
    }
  };

  // Helper to check if a module is unlocked
  const isModuleUnlocked = (moduleIndex) => {
    if (user.role === "admin") return true;
    if (moduleIndex === 0) return true;
    
    // Check if the previous module in the list is completed
    const prevModule = track.modules[moduleIndex - 1];
    return progress.completedModules.includes(prevModule.id);
  };

  return (
    <aside 
      className="w-80 bg-navy-dark border-r border-navy-border flex flex-col justify-between shrink-0 select-none"
      style={{ minHeight: "100vh" }}
    >
      {/* Brand & Progress Card */}
      <div className="p-5 flex flex-col gap-5 border-b border-navy-border/60">
        {/* Brand logo container */}
        <div className="flex items-center gap-3">
          <img 
            src={logoImg} 
            alt="Shark Cleaning LLC Logo" 
            className="brand-logo-img"
            style={{ maxHeight: "65px" }}
          />
          <div>
            <h1 className="font-display font-extrabold text-white text-lg leading-tight uppercase">
              Shark Cleaning
            </h1>
            <span className="text-orange text-[10px] tracking-widest font-mono uppercase font-black block">
              Onboarding Portal
            </span>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-navy-card border border-navy-border/50 rounded-lg p-3 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-text-secondary">Logged in as:</p>
              <h3 className="font-display font-bold text-white text-sm mt-0.5 truncate max-w-[130px]">
                {user.name}
              </h3>
              <span className={`badge text-[9px] mt-1 inline-block ${
                user.role === "admin" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                user.role === "sales" ? "bg-orange/15 text-orange" : "bg-sky-blue/15 text-sky-blue"
              }`}>
                {user.role === "admin" ? "Administrator" : user.role === "sales" ? "Sales Rep" : "Technician"}
              </span>
            </div>

            {/* Circular Progress Ring */}
            {user.role !== "admin" && (
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle 
                    cx="24" cy="24" r="20" 
                    fill="transparent" 
                    stroke="var(--navy-light)" 
                    strokeWidth="3.5" 
                  />
                  <circle 
                    cx="24" cy="24" r="20" 
                    fill="transparent" 
                    stroke="var(--orange)" 
                    strokeWidth="3.5" 
                    strokeDasharray={`${2 * Math.PI * 20}`}
                    strokeDashoffset={`${2 * Math.PI * 20 * (1 - percentComplete / 100)}`}
                    style={{ transition: "stroke-dashoffset 0.5s ease" }}
                  />
                </svg>
                <span className="absolute text-[10px] font-bold text-white font-mono">{percentComplete}%</span>
              </div>
            )}
          </div>

          {/* Quick Admin Navigation Trigger */}
          {user.role === "admin" && (
            <button
              onClick={() => setViewAdmin(!viewAdmin)}
              className={`w-full py-1.5 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                viewAdmin 
                  ? "bg-orange/15 text-orange border-orange" 
                  : "bg-navy-deep text-text-secondary border-navy-border hover:text-white"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              {viewAdmin ? "Switch to Learning Path" : "Access Admin Console"}
            </button>
          )}
        </div>
      </div>

      {/* Navigation Roadmap Step Nodes */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {viewAdmin ? (
          <div className="p-3 text-center space-y-2 animate-fade-in">
            <Shield className="w-8 h-8 text-orange mx-auto opacity-70" />
            <h4 className="font-display text-sm font-bold text-white">Admin Operations</h4>
            <p className="text-[10px] text-text-secondary">You are managing paths, adding videos, and auditing signatures.</p>
          </div>
        ) : track ? (
          track.modules.map((mod, idx) => {
            const isCompleted = progress.completedModules.includes(mod.id);
            const isUnlocked = isModuleUnlocked(idx);
            const isActive = activeModuleId === mod.id;

            return (
              <button
                key={mod.id}
                onClick={() => isUnlocked && onSelectModule(mod.id)}
                disabled={!isUnlocked}
                className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-all duration-200 ${
                  isActive 
                    ? "bg-navy-light border border-sky-blue text-white shadow-sm" 
                    : isUnlocked 
                      ? "hover:bg-navy-card/50 text-text-primary" 
                      : "opacity-40 cursor-not-allowed text-text-muted"
                }`}
              >
                {/* Completion Status Circle */}
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border text-xs font-mono font-bold ${
                    isCompleted 
                      ? "bg-success border-success text-white" 
                      : isActive 
                        ? "border-sky-blue text-sky-blue" 
                        : "border-navy-border text-text-muted bg-navy-deep"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                </div>

                <div className="flex-1 truncate">
                  <span className="text-[10px] font-mono text-text-secondary uppercase tracking-wider block">
                    {mod.type} {mod.duration ? `• ${mod.duration}` : ""}
                  </span>
                  <span className="text-xs font-medium truncate block">
                    {mod.title.replace(/^\d+\.\s*/, "")}
                  </span>
                </div>

                {/* Locked sign */}
                {!isUnlocked && <Lock className="w-3.5 h-3.5 text-text-muted" />}
              </button>
            );
          })
        ) : (
          <p className="text-xs text-text-secondary p-3">No active track assigned.</p>
        )}
      </div>

      {/* Logout Row */}
      <div className="p-4 border-t border-navy-border/60">
        <button
          onClick={onLogout}
          className="w-full btn btn-secondary text-xs flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout from Portal
        </button>
      </div>
    </aside>
  );
}
