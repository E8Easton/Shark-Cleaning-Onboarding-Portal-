import React, { useState, useRef, useEffect } from "react";
import { ScrollText, CheckCircle2, ShieldAlert, ArrowDown } from "lucide-react";

export default function ManualViewer({ module, onComplete, isCompleted }) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(isCompleted);
  const [accepted, setAccepted] = useState(isCompleted);
  const scrollRef = useRef(null);

  // Reset scroll and acceptance states when module changes
  useEffect(() => {
    setHasScrolledToBottom(isCompleted);
    setAccepted(isCompleted);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [module, isCompleted]);

  // Track scrolling to the bottom
  const handleScroll = () => {
    if (isCompleted) return;
    const element = scrollRef.current;
    if (element) {
      // Calculate how close the user is to the bottom (within a tolerance of 10px)
      const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 10;
      if (isAtBottom) {
        setHasScrolledToBottom(true);
      }
    }
  };

  const handleAcknowledge = () => {
    if (hasScrolledToBottom && accepted) {
      onComplete();
    }
  };

  const manualData = module.extraContent || { title: "Operations Manual", sections: [] };

  return (
    <div className="glass-card p-6 animate-fade-in orange-hover">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-navy-border/60">
        <h3 className="font-display text-xl font-bold flex items-center gap-2">
          <ScrollText className="text-orange w-5.5 h-5.5" />
          {manualData.title}
        </h3>
        <span className="text-xs uppercase tracking-wider text-text-muted font-mono">
          Ref: SHARK_OP_MANUAL_2026
        </span>
      </div>

      <p className="text-text-secondary text-sm mb-4 leading-relaxed">
        {module.description} Please read all sections below. You must scroll completely to the bottom of the viewer to unlock the acknowledgment checkbox.
      </p>

      {/* Scroll Box Container */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="agreement-scroll-container mb-4"
        style={{ scrollBehavior: "smooth" }}
      >
        <div className="space-y-6">
          <div className="text-center pb-4 border-b border-navy-border/30">
            <h2 className="font-display text-2xl font-black text-white tracking-tight uppercase">
              Shark Cleaning LLC
            </h2>
            <p className="text-sky-blue text-xs tracking-widest font-mono uppercase mt-1">
              Contractor & Staff Operations Handbook
            </p>
          </div>

          {manualData.sections.map((sec, idx) => (
            <div key={idx} className="space-y-2">
              <h4 className="font-display text-base font-bold text-white flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange" />
                {sec.heading}
              </h4>
              <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line pl-3.5">
                {sec.text}
              </p>
            </div>
          ))}

          <div className="p-4 bg-navy-deep/80 rounded border border-navy-border/50 text-center mt-6">
            <p className="text-xs text-text-secondary italic">
              --- End of Operational Document. Thank you for maintaining Shark Cleaning excellence. ---
            </p>
          </div>
        </div>
      </div>

      {/* Scroll indicator if not at bottom yet */}
      {!hasScrolledToBottom && (
        <div className="flex justify-center items-center gap-2 text-xs text-orange bg-orange/10 p-2.5 rounded border border-orange/20 mb-4 animate-pulse">
          <ArrowDown className="w-4 h-4" />
          <span>Scroll down completely inside the document box to unlock acceptance</span>
        </div>
      )}

      {/* Acceptance checklist */}
      <div className="space-y-4">
        <label 
          className={`flex items-start gap-3 p-3 rounded border transition-all duration-200 cursor-pointer ${
            !hasScrolledToBottom ? "opacity-50 cursor-not-allowed border-navy-border" : 
            accepted ? "border-success bg-success/5" : "border-navy-border hover:border-sky-blue"
          }`}
        >
          <input 
            type="checkbox" 
            checked={accepted}
            disabled={!hasScrolledToBottom}
            onChange={(e) => setAccepted(e.target.checked)}
            className="w-4.5 h-4.5 mt-0.5 accent-success cursor-pointer"
          />
          <div className="text-sm">
            <strong className="text-text-primary block font-display">I certify that I have read and agree to all guidelines</strong>
            <span className="text-text-secondary text-xs">
              I acknowledge that I understand the standards of conduct, safety mandates, and 1099 terms outlined in this handbook.
            </span>
          </div>
        </label>

        <div className="flex justify-end">
          {isCompleted ? (
            <div className="flex items-center gap-2 text-success font-semibold text-sm bg-success/15 px-4 py-2.5 rounded border border-success/30">
              <CheckCircle2 className="w-4 h-4" /> Completed & Accepted
            </div>
          ) : (
            <button
              onClick={handleAcknowledge}
              disabled={!hasScrolledToBottom || !accepted}
              className={`btn btn-accent ${(!hasScrolledToBottom || !accepted) ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Confirm Acknowledgment & Unlock Next Step
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
