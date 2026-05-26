import React from "react";
import { LogOut, CheckCircle2, Lock, Shield, LayoutDashboard } from "lucide-react";
import logoImg from "../assets/logo.png";

export default function Sidebar({
  user,
  track,
  activeModuleId,
  onSelectModule,
  progress,
  onLogout,
  isAdmin,
  viewAdmin,
  setViewAdmin,
}) {
  if (!user) return null;

  const totalModules = track?.modules?.length || 0;
  const completedCount = progress?.completedModules?.length || 0;
  const percentComplete = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  const isModuleUnlocked = (moduleIndex) => {
    if (moduleIndex === 0) return true;
    const prevModule = track.modules[moduleIndex - 1];
    return progress.completedModules.includes(prevModule.id);
  };

  const roleLabel =
    user.role === "admin"
      ? "Admin / Owner"
      : user.role === "sales"
        ? "Door-to-Door Sales"
        : "Technician";

  return (
    <aside className="w-80 min-h-screen bg-navy-dark border-r border-navy-border flex flex-col shrink-0">
      <div className="p-5 flex flex-col gap-4 border-b border-navy-border/60">
        <div className="flex items-center gap-3">
          <img src={logoImg} alt="Shark Cleaning" className="brand-logo-img" style={{ maxHeight: 56 }} />
          <div>
            <h1 className="font-display font-extrabold text-white text-base leading-tight uppercase">
              Shark Cleaning
            </h1>
            <span className="text-orange text-[9px] tracking-widest font-mono uppercase font-bold">
              Training Portal
            </span>
          </div>
        </div>

        <div className="bg-navy-card border border-navy-border/50 rounded-lg p-3">
          <p className="text-xs text-text-secondary">{isAdmin ? "Signed in as" : "Trainee"}</p>
          <h3 className="font-display font-bold text-white text-sm truncate">{user.name}</h3>
          <span
            className={`badge text-[9px] mt-1 inline-block ${
              user.role === "admin"
                ? "bg-orange/15 text-orange"
                : user.role === "sales"
                  ? "bg-orange/15 text-orange"
                  : "bg-sky-blue/15 text-sky-blue"
            }`}
          >
            {roleLabel}
          </span>

          {!isAdmin && (
            <div className="flex items-center justify-between mt-3">
              <span className="text-[10px] text-text-muted font-mono">{percentComplete}% complete</span>
              <div className="relative w-10 h-10">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="18" fill="transparent" stroke="var(--color-navy-light)" strokeWidth="4" />
                  <circle
                    cx="24" cy="24" r="18" fill="transparent"
                    stroke="var(--color-orange)" strokeWidth="4"
                    strokeDasharray={2 * Math.PI * 18}
                    strokeDashoffset={2 * Math.PI * 18 * (1 - percentComplete / 100)}
                  />
                </svg>
              </div>
            </div>
          )}

          {isAdmin && (
            <button
              type="button"
              onClick={() => setViewAdmin(!viewAdmin)}
              className={`w-full mt-3 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                viewAdmin ? "bg-orange/15 text-orange border-orange" : "bg-navy-deep text-text-secondary border-navy-border hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              {viewAdmin ? "Close admin" : "Admin dashboard"}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        {isAdmin ? (
          <div className="p-4 text-center space-y-2">
            <Shield className="w-8 h-8 text-orange mx-auto opacity-80" />
            <p className="text-xs text-text-secondary leading-relaxed">
              Use the admin dashboard to add steps, edit videos & page text, and see who finished onboarding.
            </p>
          </div>
        ) : track ? (
          track.modules.map((mod, idx) => {
            const isCompleted = progress.completedModules.includes(mod.id);
            const isUnlocked = isModuleUnlocked(idx);
            const isActive = activeModuleId === mod.id;

            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => isUnlocked && onSelectModule(mod.id)}
                disabled={!isUnlocked}
                className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-all ${
                  isActive
                    ? "bg-navy-light border border-sky-blue text-white"
                    : isUnlocked
                      ? "hover:bg-navy-card/60 text-text-primary"
                      : "opacity-40 cursor-not-allowed"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border text-xs font-mono font-bold ${
                    isCompleted
                      ? "bg-success border-success text-white"
                      : isActive
                        ? "border-sky-blue text-sky-blue"
                        : "border-navy-border text-text-muted"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-mono text-text-secondary uppercase block">
                    {mod.type}
                    {mod.duration ? ` • ${mod.duration}` : ""}
                  </span>
                  <span className="text-xs font-medium truncate block">
                    {mod.title.replace(/^\d+\.\s*/, "")}
                  </span>
                </div>
                {!isUnlocked && <Lock className="w-3.5 h-3.5 text-text-muted shrink-0" />}
              </button>
            );
          })
        ) : (
          <p className="text-xs text-text-secondary p-3">No training track.</p>
        )}
      </div>

      <div className="p-4 border-t border-navy-border/60">
        <button type="button" onClick={onLogout} className="btn btn-secondary w-full text-xs">
          <LogOut className="w-4 h-4" /> Back to home
        </button>
      </div>
    </aside>
  );
}
