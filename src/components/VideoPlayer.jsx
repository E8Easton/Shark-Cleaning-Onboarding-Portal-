import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, CheckCircle2, Lock, ShieldAlert, FastForward } from "lucide-react";

export default function VideoPlayer({ module, onComplete, isCompleted }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [maxWatchedTime, setMaxWatchedTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [autoUnlocked, setAutoUnlocked] = useState(false);
  const videoInterval = useRef(null);

  // Parse duration string e.g. "5:30" to total seconds
  useEffect(() => {
    if (module) {
      const parts = module.duration.split(":");
      const mins = parseInt(parts[0], 10);
      const secs = parseInt(parts[1], 10);
      const totalSecs = mins * 60 + secs;
      setDuration(totalSecs);
      setCurrentTime(0);
      setMaxWatchedTime(isCompleted ? totalSecs : 0);
      setIsPlaying(false);
      setAutoUnlocked(isCompleted);
    }
  }, [module, isCompleted]);

  // Handle Play/Pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Timer simulation for our simulated video player
  useEffect(() => {
    if (isPlaying) {
      videoInterval.current = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1;
          if (next >= duration) {
            clearInterval(videoInterval.current);
            setIsPlaying(false);
            setAutoUnlocked(true);
            onComplete(); // Trigger completion!
            return duration;
          }
          setMaxWatchedTime((max) => Math.max(max, next));
          return next;
        });
      }, 1000);
    } else {
      clearInterval(videoInterval.current);
    }

    return () => clearInterval(videoInterval.current);
  }, [isPlaying, duration, onComplete]);

  // Scrub handler - prevents scrubbing PAST max watched time
  const handleScrubChange = (e) => {
    const targetVal = parseInt(e.target.value, 10);
    if (targetVal <= maxWatchedTime) {
      setCurrentTime(targetVal);
    } else {
      // Trigger subtle vibration or visual feedback
    }
  };

  // Skip to end for developer testing
  const triggerDevBypass = () => {
    setCurrentTime(duration - 2);
    setMaxWatchedTime(duration - 2);
    setIsPlaying(true);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const progressPercentage = (currentTime / duration) * 100 || 0;
  const maxProgressPercentage = (maxWatchedTime / duration) * 100 || 0;

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-display text-xl font-bold flex items-center gap-2">
          {module.title}
          {isCompleted && <CheckCircle2 className="text-success w-5 h-5" />}
        </h3>
        
        {/* Dev tool helper */}
        {!isCompleted && (
          <button 
            onClick={triggerDevBypass}
            className="btn btn-outline btn-secondary" 
            style={{ padding: "0.25rem 0.6rem", fontSize: "0.75rem", display: "flex", gap: "4px" }}
            title="Fast forward to last 2 seconds for quick grading review"
          >
            <FastForward className="w-3.5 h-3.5 text-orange" />
            <span>Dev Fast Watch</span>
          </button>
        )}
      </div>

      <p className="text-text-secondary text-sm mb-4 leading-relaxed">{module.description}</p>

      {/* High Fidelity Simulated Video Player Frame */}
      <div className="video-wrapper mb-4">
        {/* Animated Background Simulation simulating a training lecture */}
        <div 
          className="absolute inset-0 flex flex-col justify-between p-6 select-none"
          style={{
            background: `radial-gradient(circle at center, rgba(31,162,225,0.15) 0%, rgba(6,14,27,0.95) 100%)`,
          }}
        >
          {/* Top Logo & Watermark */}
          <div className="flex justify-between items-center opacity-75">
            <div className="flex items-center gap-2">
              <div 
                className="w-2.5 h-2.5 rounded-full bg-red-600" 
                style={{
                  backgroundColor: isPlaying ? "#ef4444" : "#94a3b8",
                  boxShadow: isPlaying ? "0 0 8px #ef4444" : "none"
                }}
              />
              <span className="text-xs uppercase tracking-widest text-text-secondary font-mono">
                {isPlaying ? "Live Training Stream" : "Onboarding Paused"}
              </span>
            </div>
            <span className="text-xs font-mono text-text-muted">SHARK_ACADEMY_V.1.0</span>
          </div>

          {/* Core Visual Action Indicator */}
          <div className="flex flex-col items-center justify-center flex-1 gap-3">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center bg-navy-card border border-navy-border cursor-pointer transition-all duration-300"
              style={{
                boxShadow: isPlaying ? "0 0 25px rgba(31,162,225,0.4)" : "none",
                borderColor: isPlaying ? "var(--sky-blue)" : "var(--navy-border)",
              }}
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-sky-blue" />
              ) : (
                <Play className="w-8 h-8 text-orange translate-x-0.5" />
              )}
            </div>
            
            <p className="text-sm font-semibold tracking-wide text-center">
              {isPlaying ? "Watching Equipment & Safety Procedures..." : "Click to Resume Training Video"}
            </p>
            <p className="text-xs text-text-muted max-w-sm text-center">
              *Seek-lock is active. You cannot fast-forward past sections you haven't watched yet.
            </p>
          </div>

          {/* Bottom Player Overlay Bar */}
          <div className="flex flex-col gap-2 p-2 bg-navy-deep/80 rounded-md backdrop-filter blur-sm border border-navy-border/50">
            {/* Range Scrub Bar */}
            <div className="relative w-full h-1 bg-navy-light rounded-full overflow-hidden">
              {/* Max allowed watch limit */}
              <div 
                className="absolute top-0 left-0 h-full bg-navy-border"
                style={{ width: `${maxProgressPercentage}%` }}
              />
              {/* Current track progress */}
              <div 
                className="absolute top-0 left-0 h-full bg-sky-blue transition-all duration-150"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {/* Input Slider for Scrubbing */}
            <input 
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={handleScrubChange}
              className="w-full cursor-pointer opacity-80 hover:opacity-100 accent-sky-blue"
              style={{ height: "4px", margin: "-6px 0" }}
            />

            {/* Times & Status */}
            <div className="flex justify-between items-center text-xs font-mono text-text-secondary">
              <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
              <span className="flex items-center gap-1">
                {isCompleted ? (
                  <span className="text-success flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                  </span>
                ) : (
                  <span className="text-orange flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Locked Forward
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* extra highlights below player (e.g. equipment list, safety corrections) */}
      {module.extraContent && (
        <div className="glass-card p-4 animate-fade-in" style={{ borderLeftWidth: "4px", borderLeftColor: "var(--sky-blue)" }}>
          {module.extraContent.equipmentList && (
            <div>
              <h4 className="font-display font-bold text-sm uppercase tracking-wide text-sky-blue mb-2">Training Equipment Spotlight:</h4>
              <ul className="text-sm space-y-2">
                {module.extraContent.equipmentList.map((eq, i) => (
                  <li key={i}>
                    <strong>⚙️ {eq.name}</strong> — <span className="text-text-secondary">{eq.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {module.extraContent.steps && (
            <div>
              <h4 className="font-display font-bold text-sm uppercase tracking-wide text-sky-blue mb-2">SOP Workflow Steps:</h4>
              <ol className="text-sm space-y-2">
                {module.extraContent.steps.map((st, i) => (
                  <li key={i} className="text-text-secondary">
                    <strong className="text-text-primary">{st.step}</strong>: {st.detail}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {module.extraContent.hazards && (
            <div>
              <h4 className="font-display font-bold text-sm uppercase tracking-wide text-orange mb-2">⚠️ Safety Hazard Corrections:</h4>
              <ul className="text-sm space-y-2">
                {module.extraContent.hazards.map((hz, i) => (
                  <li key={i} className="text-text-secondary">
                    <strong className="text-error">{hz.hazard}</strong>: {hz.correction}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {module.extraContent.tips && (
            <div>
              <h4 className="font-display font-bold text-sm uppercase tracking-wide text-orange mb-2">📈 1099 Profit Maximizers:</h4>
              <ul className="text-sm space-y-2">
                {module.extraContent.tips.map((tp, i) => (
                  <li key={i} className="text-text-secondary">
                    <strong className="text-text-primary">🔹 {tp.title}</strong> — {tp.text}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {module.extraContent.scriptStages && (
            <div>
              <h4 className="font-display font-bold text-sm uppercase tracking-wide text-sky-blue mb-2">🔥 Pitch Breakdown & Scripting:</h4>
              <div className="space-y-3">
                {module.extraContent.scriptStages.map((sc, i) => (
                  <div key={i} className="text-xs bg-navy-dark p-2.5 rounded border border-navy-border/50">
                    <strong className="text-orange uppercase tracking-wide text-[10px] block mb-1">{sc.stage}</strong>
                    <span className="italic text-text-primary">"{sc.detail}"</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
