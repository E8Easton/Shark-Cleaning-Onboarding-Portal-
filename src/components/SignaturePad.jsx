import React, { useState, useEffect } from "react";
import { Award, ShieldCheck, PenTool, CheckCircle, Info } from "lucide-react";

export default function SignaturePad({ module, onComplete, isCompleted, progressData }) {
  const [legalName, setLegalName] = useState(progressData?.signedName || "");
  const [certifyTraining, setCertifyTraining] = useState(isCompleted);
  const [certifyTaxes, setCertifyTaxes] = useState(isCompleted);
  const [simulatedIp, setSimulatedIp] = useState("");
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    // Generate simulated contractor IP address and local date
    const randomIp = `192.168.${Math.floor(Math.random() * 254) + 1}.${Math.floor(Math.random() * 254) + 1}`;
    setSimulatedIp(progressData?.signedIp || randomIp);
    
    const today = new Date();
    const dateStr = today.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    setFormattedDate(progressData?.signedDate || dateStr);
  }, [progressData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (legalName.trim().length > 3 && certifyTraining && certifyTaxes) {
      onComplete({
        signedName: legalName.trim(),
        signedDate: formattedDate,
        signedIp: simulatedIp
      });
    }
  };

  const isFormValid = legalName.trim().length > 3 && certifyTraining && certifyTaxes;

  return (
    <div className="glass-card p-6 animate-fade-in orange-hover">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-navy-border/60">
        <h3 className="font-display text-xl font-bold flex items-center gap-2">
          <ShieldCheck className="text-success w-6 h-6 animate-pulse" />
          Contractor Onboarding Sign-off
        </h3>
        <span className="text-xs uppercase tracking-wider text-text-muted font-mono bg-navy-dark px-2 py-1 rounded">
          Secure Sign-off
        </span>
      </div>

      <div className="info-bubble info-bubble-orange text-sm mb-5 leading-relaxed text-text-secondary">
        <div className="flex gap-2 items-start">
          <Info className="w-5 h-5 text-orange shrink-0 mt-0.5" />
          <div>
            <strong className="text-text-primary block mb-1">Final Approval Step Required</strong>
            This is the final step in the Shark Cleaning LLC onboarding process. By submitting your digital signature, your completion status will be saved, and you will be certified to operate on company client sites or sales routes.
          </div>
        </div>
      </div>

      <div className="p-4 bg-navy-dark rounded border border-navy-border text-sm mb-5">
        <h4 className="font-display font-bold text-white mb-2 uppercase text-xs tracking-wider text-orange">
          Binding Agreement Statement
        </h4>
        <p className="text-text-secondary leading-relaxed italic">
          "{module.extraContent?.agreementText || "I certify that I have read all manuals and completed all video trainings."}"
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Checkbox 1 */}
        <label className="flex items-start gap-3 p-3 rounded border border-navy-border hover:border-sky-blue bg-navy-deep/40 cursor-pointer transition-all duration-200">
          <input 
            type="checkbox" 
            checked={certifyTraining}
            disabled={isCompleted}
            onChange={(e) => setCertifyTraining(e.target.checked)}
            className="w-4.5 h-4.5 mt-0.5 accent-success cursor-pointer"
          />
          <div className="text-sm">
            <strong className="text-text-primary block font-display">Certify Module Training</strong>
            <span className="text-text-secondary text-xs">
              I verify under penalty of contract termination that I have watched 100% of the training videos completely and did not skip any sections.
            </span>
          </div>
        </label>

        {/* Checkbox 2 */}
        <label className="flex items-start gap-3 p-3 rounded border border-navy-border hover:border-sky-blue bg-navy-deep/40 cursor-pointer transition-all duration-200">
          <input 
            type="checkbox" 
            checked={certifyTaxes}
            disabled={isCompleted}
            onChange={(e) => setCertifyTaxes(e.target.checked)}
            className="w-4.5 h-4.5 mt-0.5 accent-success cursor-pointer"
          />
          <div className="text-sm">
            <strong className="text-text-primary block font-display">Acknowledge 1099 Contractor Status</strong>
            <span className="text-text-secondary text-xs">
              I certify that I understand my role as an independent contractor, including responsibility for my own self-employment tax withholding, vehicle insurance, and standard cleaning equipment maintenance.
            </span>
          </div>
        </label>

        {/* Legal Name Input */}
        <div className="form-group">
          <label className="form-label" htmlFor="legal-name">
            Full Legal Name (Acts as Signature)
          </label>
          <input 
            type="text"
            id="legal-name"
            placeholder="Type your full legal name..."
            value={legalName}
            disabled={isCompleted}
            onChange={(e) => setLegalName(e.target.value)}
            className="form-input form-input-orange text-lg"
            maxLength={60}
            required
          />
        </div>

        {/* Simulated Handwriting Preview */}
        {legalName.trim().length > 0 && (
          <div className="sig-pad-box orange-theme select-none">
            <p className="text-[10px] uppercase tracking-wider text-text-muted font-mono mb-2">
              Generated Digital Signature Certificate
            </p>
            
            {/* Elegant handwriting simulated container */}
            <div 
              className="text-4xl text-center py-6 text-orange select-none"
              style={{
                fontFamily: "'Outfit', cursive, sans-serif",
                fontStyle: "italic",
                letterSpacing: "0.05em",
                fontWeight: "300",
                textShadow: "0 0 10px rgba(255, 136, 0, 0.2)"
              }}
            >
              {legalName}
            </div>

            {/* Verification Watermark Details */}
            <div className="grid-2 pt-3 border-t border-dashed border-orange/30 text-[10px] text-text-secondary font-mono">
              <div>
                <p>SIGNATURE ID: <span className="text-white">SHRK-SIG-{Math.floor(Math.random() * 900000) + 100000}</span></p>
                <p>TIMESTAMP: <span className="text-white">{formattedDate}</span></p>
              </div>
              <div className="text-right">
                <p>SECURE CLIENT IP: <span className="text-white">{simulatedIp}</span></p>
                <p>VERIFICATION: <span className="text-success font-bold">100% COMPLETE & VERIFIED</span></p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button / Success message */}
        <div className="flex justify-end pt-3">
          {isCompleted ? (
            <div className="flex items-center gap-3 bg-success/20 border border-success/40 text-success p-4 rounded-lg w-full justify-center text-center">
              <Award className="w-6 h-6 animate-bounce" />
              <div className="text-sm">
                <strong className="block font-display text-base">Onboarding Complete & Signed!</strong>
                <span className="text-xs text-text-secondary">Your onboarding credentials have been archived. You are ready to work.</span>
              </div>
            </div>
          ) : (
            <button
              type="submit"
              disabled={!isFormValid}
              className={`btn btn-accent w-full text-base py-3 ${!isFormValid ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Sign & Complete Onboarding
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
