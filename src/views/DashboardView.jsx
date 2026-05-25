import React from "react";
import { Award, CheckCircle2, ShieldCheck, HelpCircle, ArrowRight, UserCheck } from "lucide-react";
import VideoPlayer from "../components/VideoPlayer";
import ManualViewer from "../components/ManualViewer";
import SignaturePad from "../components/SignaturePad";
import SalesTracker from "../components/SalesTracker";
import { INITIAL_SALES_LOGS } from "../data/initialData";

export default function DashboardView({ 
  user, 
  track, 
  activeModuleId, 
  progress, 
  onCompleteModule,
  onSetActiveModule
}) {
  if (!user || !track) return null;

  const currentModule = track.modules.find(m => m.id === activeModuleId);
  const isCompleted = progress.completedModules.includes(activeModuleId);

  // Find index of next module to prompt user to continue
  const currentIdx = track.modules.findIndex(m => m.id === activeModuleId);
  const nextModule = track.modules[currentIdx + 1];

  const handleModuleComplete = (extraData = {}) => {
    onCompleteModule(activeModuleId, extraData);
  };

  const handleNextStep = () => {
    if (nextModule) {
      onSetActiveModule(nextModule.id);
    }
  };

  // Determine if onboarding is fully complete
  const isFullOnboardingComplete = progress.completedModules.length === track.modules.length && progress.signedName?.length > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="glass-card p-6 bg-gradient-to-r from-navy-card to-navy-dark border-navy-border/60">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <span className="text-xs font-mono text-orange uppercase tracking-wider block">
              Active Learning Route
            </span>
            <h2 className="font-display text-2xl font-black text-white uppercase tracking-tight mt-1">
              {track.title}
            </h2>
            <p className="text-xs text-text-secondary mt-1 max-w-xl">{track.description}</p>
          </div>
          
          <div className="flex items-center gap-2.5 bg-navy-deep/80 border border-navy-border/50 py-2 px-4 rounded-lg">
            <UserCheck className="w-5 h-5 text-sky-blue" />
            <div className="text-xs">
              <span className="text-text-muted block">Contractor Progress:</span>
              <strong className="text-white font-mono">
                {progress.completedModules.length} / {track.modules.length} Steps Done
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Learning Hub Split Layout */}
      {isFullOnboardingComplete ? (
        /* Glorious Onboarding Congratulations Panel */
        <div className="glass-card p-8 border-success/40 bg-success/5 text-center space-y-6 animate-fade-in max-w-2xl mx-auto">
          <div className="w-24 h-24 rounded-full bg-success/15 border border-success/30 flex items-center justify-center mx-auto text-success pulse-glow" style={{ boxShadow: "0 0 35px var(--success-glow)" }}>
            <Award className="w-12 h-12 animate-bounce" />
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-3xl font-black text-white tracking-tight uppercase">
              Congratulations, {user.name}!
            </h2>
            <p className="text-sky-blue text-sm font-semibold tracking-wider font-mono uppercase">
              Shark Cleaning Certified Contractor
            </p>
            <p className="text-text-secondary text-sm max-w-md mx-auto leading-relaxed">
              You have completed 100% of the training videos, read and acknowledged the Operations Handbook, and filed your Contractor Agreement!
            </p>
          </div>

          {/* Secure Digital Onboarding Document Certificate Representation */}
          <div className="glass-card p-6 bg-navy-dark border-dashed border-success/40 max-w-md mx-auto text-left relative overflow-hidden">
            {/* Watermark Logo BG */}
            <div className="absolute right-[-40px] bottom-[-40px] opacity-10 select-none pointer-events-none transform -rotate-12">
              <ShieldCheck className="w-48 h-48 text-success" />
            </div>

            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-orange mb-3 pb-1.5 border-b border-navy-border">
              Secure Credential Certificate
            </h4>
            
            <div className="space-y-2 text-xs font-mono text-text-secondary">
              <p>CONTRACTOR NAME: <span className="text-white font-bold">{progress.signedName}</span></p>
              <p>CERTIFIED ROLE: <span className="text-white uppercase">{user.role}</span></p>
              <p>VERIFIED IP: <span className="text-white">{progress.signedIp}</span></p>
              <p>SIGN-OFF TIMESTAMP: <span className="text-white">{progress.signedDate}</span></p>
              <p className="flex items-center gap-1.5 mt-2 text-success font-bold">
                <CheckCircle2 className="w-4 h-4" /> COMPLIANCE SEAL RECORDED
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-navy-border text-center">
              <span 
                className="text-3xl text-orange inline-block"
                style={{ fontFamily: "'Outfit', cursive", fontStyle: "italic" }}
              >
                {progress.signedName}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <p className="text-xs text-text-muted">
              Your onboarding progress has been filed securely. Your manager will be notified of your completion automatically. Welcome to the Shark Pack!
            </p>
          </div>
        </div>
      ) : currentModule ? (
        /* Active Module Panel */
        <div className="space-y-6">
          {/* Dynamic Component Load */}
          <div>
            {currentModule.type === "video" && (
              <VideoPlayer 
                module={currentModule}
                onComplete={handleModuleComplete}
                isCompleted={isCompleted}
              />
            )}

            {currentModule.type === "manual" && (
              <ManualViewer 
                module={currentModule}
                onComplete={handleModuleComplete}
                isCompleted={isCompleted}
              />
            )}

            {currentModule.type === "agreement" && (
              <SignaturePad 
                module={currentModule}
                onComplete={handleModuleComplete}
                isCompleted={isCompleted}
                progressData={progress}
              />
            )}

            {currentModule.type === "sales-tracking" && (
              <SalesTracker 
                initialLogs={INITIAL_SALES_LOGS}
              />
            )}
          </div>

          {/* Module Success & Continue Controls */}
          {isCompleted && currentModule.type !== "agreement" && currentModule.type !== "sales-tracking" && (
            <div className="glass-card p-4 border-success bg-success/5 flex items-center justify-between flex-wrap gap-3 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success/15 border border-success/30 flex items-center justify-center text-success">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-white">Module Step Complete!</h4>
                  <p className="text-xs text-text-secondary">Progress updated and saved locally.</p>
                </div>
              </div>

              {nextModule ? (
                <button
                  onClick={handleNextStep}
                  className="btn btn-primary text-xs flex items-center gap-1 bg-gradient-to-r from-success to-emerald-600 border-none pulse-glow"
                  style={{ boxShadow: "0 0 10px rgba(16, 185, 129, 0.4)" }}
                >
                  Continue to Next Step <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <span className="text-xs text-text-muted italic">All core training modules completed!</span>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Fallback */
        <div className="glass-card p-8 text-center text-text-muted space-y-2">
          <HelpCircle className="w-12 h-12 text-navy-light mx-auto" />
          <h3 className="font-display text-lg font-bold text-white">Select a Module</h3>
          <p className="text-xs max-w-xs mx-auto">Please pick a module from the onboarding sidebar checklist road-map to begin your training.</p>
        </div>
      )}
    </div>
  );
}
