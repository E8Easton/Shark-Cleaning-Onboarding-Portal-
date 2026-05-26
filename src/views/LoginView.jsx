import React, { useState } from "react";
import { User, ShieldAlert, ArrowRight, Wrench, Megaphone, Shield } from "lucide-react";
import logoImg from "../assets/logo.png";
import LoginBackground from "../components/LoginBackground";
import InputWithIcon from "../components/InputWithIcon";

const ROLES = {
  technician: {
    label: "Technician",
    sub: "Window cleaning & field training",
    icon: Wrench,
    theme: "sky",
  },
  sales: {
    label: "Door-to-Door Sales",
    sub: "Sales scripts & route training",
    icon: Megaphone,
    theme: "orange",
  },
  admin: {
    label: "Admin / Owner",
    sub: "Edit content & view completions",
    icon: Shield,
    theme: "navy",
  },
};

export default function LoginView({ onEnterTrainee, onEnterAdmin, extraTracks = [] }) {
  const [pendingRole, setPendingRole] = useState(null);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRoleClick = (role) => {
    setError("");
    if (role === "admin") {
      onEnterAdmin();
      return;
    }
    setPendingRole(role);
    setName("");
  };

  const handleNameSubmit = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || trimmed.length < 2) {
      setError("Please enter your full name to start training.");
      return;
    }
    setError("");
    setLoading(true);
    await onEnterTrainee(pendingRole, trimmed);
    setLoading(false);
  };

  const goBack = () => {
    setPendingRole(null);
    setName("");
    setError("");
  };

  const pendingLabel =
    ROLES[pendingRole]?.label ||
    extraTracks.find((t) => t.role === pendingRole)?.title ||
    "Training";

  return (
    <div className="login-scene w-full">
      <LoginBackground />

      <div className="relative z-10 w-full max-w-lg space-y-6 animate-fade-in px-2">
        <div className="text-center space-y-3">
          <img
            src={logoImg}
            alt="Shark Cleaning LLC"
            className="mx-auto brand-logo-img pulse-glow"
            style={{ maxHeight: 150 }}
          />
          <h1 className="font-display font-extrabold text-white text-3xl tracking-tight uppercase">
            Shark Cleaning
          </h1>
          <p className="text-orange text-xs tracking-[0.2em] font-mono uppercase font-bold">
            Training Portal
          </p>
        </div>

        {!pendingRole ? (
          <div className="space-y-3">
            <p className="text-center text-sm text-text-secondary">
              Choose how you&apos;re joining today
            </p>

            {extraTracks.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleRoleClick(t.role)}
                className="w-full glass-card p-5 flex items-center gap-4 text-left transition-all hover:scale-[1.01] orange-hover"
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-orange/15 text-orange">
                  <Megaphone className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-white text-lg">{t.title}</p>
                  <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">{t.description}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-text-muted shrink-0" />
              </button>
            ))}

            {(["technician", "sales", "admin"]).map((roleKey) => {
              const r = ROLES[roleKey];
              const Icon = r.icon;
              const isAdmin = roleKey === "admin";
              if (roleKey !== "admin" && extraTracks.some((t) => t.role === roleKey)) return null;
              return (
                <button
                  key={roleKey}
                  type="button"
                  onClick={() => handleRoleClick(roleKey)}
                  className={`w-full glass-card p-5 flex items-center gap-4 text-left transition-all hover:scale-[1.01] ${
                    isAdmin ? "orange-hover border-navy-light/50" : r.theme === "orange" ? "orange-hover" : ""
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
                      isAdmin
                        ? "bg-navy-light/40 text-orange border border-navy-border"
                        : r.theme === "orange"
                          ? "bg-orange/15 text-orange"
                          : "bg-sky-blue/15 text-sky-blue"
                    }`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-white text-lg">{r.label}</p>
                    <p className="text-xs text-text-secondary mt-0.5">{r.sub}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-text-muted shrink-0" />
                </button>
              );
            })}
          </div>
        ) : (
          <div className="glass-card p-6 orange-hover space-y-4">
            <button
              type="button"
              onClick={goBack}
              className="text-xs text-text-secondary hover:text-white transition-colors"
            >
              ← Back to role selection
            </button>

            <div className="text-center pb-1">
              <p className="text-[10px] font-mono uppercase tracking-wider text-orange">
                {pendingLabel} track
              </p>
              <h2 className="font-display text-xl font-bold text-white mt-1">
                Enter your name to begin
              </h2>
              <p className="text-xs text-text-secondary mt-1">
                We&apos;ll save your progress under this name so you can pick up where you left off.
              </p>
            </div>

            {error && (
              <div className="flex gap-2 items-start bg-red-500/10 border border-red-500/30 p-3 rounded-lg text-xs text-red-400">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleNameSubmit} className="space-y-4">
              <div className="form-group mb-0">
                <label className="form-label" htmlFor="trainee-name">
                  Full name
                </label>
                <InputWithIcon
                  icon={User}
                  type="text"
                  id="trainee-name"
                  placeholder="John Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  inputClassName="form-input-orange"
                  large
                  autoFocus
                  required
                  minLength={2}
                  autoComplete="name"
                />
              </div>
              <button
                type="submit"
                className={`btn w-full py-3 ${pendingRole === "sales" ? "btn-accent" : "btn-primary"}`}
                disabled={loading}
              >
                {loading ? "Starting…" : "Start training"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
