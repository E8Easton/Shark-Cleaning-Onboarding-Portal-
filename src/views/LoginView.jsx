import React, { useState } from "react";
import { KeyRound, Mail, User, ShieldAlert, Award, ArrowRight, UserPlus, LogIn } from "lucide-react";
import logoImg from "../assets/logo.png";

export default function LoginView({ onLogin, onRegister }) {
  const [activeTab, setActiveTab] = useState("login"); // "login" | "register" | "admin"
  
  // Fields for standard Login/Register
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("technician"); // "technician" | "sales"

  // Admin login details
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const [error, setError] = useState("");

  const handleRecruitLogin = (e) => {
    e.preventDefault();
    setError("");
    if (!email) return;

    const success = onLogin(email.trim().toLowerCase(), false);
    if (!success) {
      setError("Email not registered yet. Please click the 'Register' tab to create your profile first.");
    }
  };

  const handleRecruitRegister = (e) => {
    e.preventDefault();
    setError("");
    if (!email || !name) return;

    const success = onRegister({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: role
    });

    if (!success) {
      setError("This email address is already registered. Please sign in under the 'Sign In' tab.");
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setError("");
    if (!adminEmail || !adminPassword) return;

    if (adminEmail.trim().toLowerCase() === "admin@sharkcleaning.com" && adminPassword === "admin123") {
      onLogin("admin@sharkcleaning.com", true);
    } else {
      setError("Invalid administrative credentials. Please verify your admin credentials and try again.");
    }
  };

  return (
    <div className="min-vh-100 flex items-center justify-center p-4" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="w-full max-w-md animate-fade-in space-y-6">
        
        {/* Core Header Logo / Brand */}
        <div className="text-center space-y-2">
          <img 
            src={logoImg} 
            alt="Shark Cleaning LLC logo" 
            className="mx-auto brand-logo-img pulse-glow"
            style={{ maxHeight: "150px", width: "auto" }}
          />
          <h1 className="font-display font-extrabold text-white text-3xl tracking-tight uppercase mt-4">
            Shark Cleaning
          </h1>
          <p className="text-orange text-xs tracking-widest font-mono uppercase font-black">
            Contractor Training & Onboarding
          </p>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div className="glass-card p-1.5 flex gap-1 rounded-xl">
          <button
            onClick={() => { setActiveTab("login"); setError(""); }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold font-display flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "login" 
                ? "bg-sky-blue text-white shadow-sm" 
                : "text-text-secondary hover:text-white"
            }`}
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </button>
          
          <button
            onClick={() => { setActiveTab("register"); setError(""); }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold font-display flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "register" 
                ? "bg-orange text-white shadow-sm" 
                : "text-text-secondary hover:text-white"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Register
          </button>

          <button
            onClick={() => { setActiveTab("admin"); setError(""); }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold font-display flex items-center justify-center gap-1.5 transition-all ${
              activeTab === "admin" 
                ? "bg-navy-light text-white shadow-sm border border-navy-border/50" 
                : "text-text-secondary hover:text-white"
            }`}
          >
            <KeyRound className="w-4 h-4" />
            Admin
          </button>
        </div>

        {/* Forms Container */}
        <div className="glass-card p-6 orange-hover">
          {error && (
            <div className="flex gap-2 items-start bg-red-500/10 border border-red-500/30 p-3 rounded-lg text-xs text-red-400 mb-4 animate-fade-in">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form 1: Candidate Sign-In */}
          {activeTab === "login" && (
            <form onSubmit={handleRecruitLogin} className="space-y-4">
              <div className="form-group">
                <label className="form-label" htmlFor="email-input">
                  Enter your registered onboarding email
                </label>
                <div className="relative">
                  <input 
                    type="email"
                    id="email-input"
                    placeholder="e.g. recruit@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input pl-10"
                    required
                  />
                  <Mail className="w-4 h-4 text-text-muted absolute left-3 top-3.5" />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full py-3 mt-2">
                Begin Training Onboarding <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Form 2: Candidate Register */}
          {activeTab === "register" && (
            <form onSubmit={handleRecruitRegister} className="space-y-4">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-name">
                  Full Legal Name
                </label>
                <div className="relative">
                  <input 
                    type="text"
                    id="reg-name"
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input form-input-orange pl-10"
                    required
                  />
                  <User className="w-4 h-4 text-text-muted absolute left-3 top-3.5" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-email">
                  Onboarding Email Address
                </label>
                <div className="relative">
                  <input 
                    type="email"
                    id="reg-email"
                    placeholder="e.g. john.doe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input form-input-orange pl-10"
                    required
                  />
                  <Mail className="w-4 h-4 text-text-muted absolute left-3 top-3.5" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Select your active role</label>
                <div className="grid-2 mt-1">
                  <label className={`p-3 rounded-lg border text-center cursor-pointer transition-all ${
                    role === "technician" 
                      ? "border-sky-blue bg-sky-blue/10 text-white font-semibold" 
                      : "border-navy-border text-text-secondary hover:border-navy-light"
                  }`}>
                    <input 
                      type="radio" 
                      name="role" 
                      value="technician" 
                      checked={role === "technician"}
                      onChange={() => setRole("technician")}
                      className="hidden"
                    />
                    🛠️ Service Technician
                  </label>
                  
                  <label className={`p-3 rounded-lg border text-center cursor-pointer transition-all ${
                    role === "sales" 
                      ? "border-orange bg-orange/10 text-white font-semibold" 
                      : "border-navy-border text-text-secondary hover:border-navy-light"
                  }`}>
                    <input 
                      type="radio" 
                      name="role" 
                      value="sales" 
                      checked={role === "sales"}
                      onChange={() => setRole("sales")}
                      className="hidden"
                    />
                    💼 D2D Sales Rep
                  </label>
                </div>
              </div>

              <button type="submit" className="btn btn-accent w-full py-3 mt-2">
                Register & Start Training <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Form 3: Administrator Sign-In */}
          {activeTab === "admin" && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="form-group">
                <label className="form-label" htmlFor="admin-email">
                  Admin Email
                </label>
                <div className="relative">
                  <input 
                    type="email"
                    id="admin-email"
                    placeholder="admin@sharkcleaning.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="form-input pl-10"
                    required
                  />
                  <Mail className="w-4 h-4 text-text-muted absolute left-3 top-3.5" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="admin-password">
                  Security Password
                </label>
                <div className="relative">
                  <input 
                    type="password"
                    id="admin-password"
                    placeholder="••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="form-input pl-10"
                    required
                  />
                  <KeyRound className="w-4 h-4 text-text-muted absolute left-3 top-3.5" />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full py-3 mt-2" style={{ background: "linear-gradient(135deg, var(--navy-light) 0%, var(--navy-border) 100%)", borderColor: "var(--navy-border)" }}>
                Secure Login <KeyRound className="w-4 h-4" />
              </button>
              
              <div className="text-[10px] text-text-muted text-center pt-2">
                *Default testing credentials: <span className="text-text-secondary">admin@sharkcleaning.com / admin123</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
