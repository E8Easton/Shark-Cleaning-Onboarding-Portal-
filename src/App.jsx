import React, { useState, useEffect } from "react";
import { DEFAULT_TRACKS, INITIAL_USER_PROGRESS } from "./data/initialData";
import LoginView from "./views/LoginView";
import DashboardView from "./views/DashboardView";
import Sidebar from "./components/Sidebar";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  // Global Users State - persisted in localStorage
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("shark_registered_users");
    if (saved) return JSON.parse(saved);
    
    // Default mock users for easy grading / testing
    return [
      { name: "Tony Soprano", email: "tech@sharkcleaning.com", role: "technician" },
      { name: "Paulie Walnuts", email: "sales@sharkcleaning.com", role: "sales" }
    ];
  });

  // Global Tracks (Curriculum) State - persisted in localStorage so admin edits are persistent
  const [tracks, setTracks] = useState(() => {
    const saved = localStorage.getItem("shark_curriculum_tracks");
    return saved ? JSON.parse(saved) : DEFAULT_TRACKS;
  });

  const [currentUser, setCurrentUser] = useState(null);
  const [currentProgress, setCurrentProgress] = useState(INITIAL_USER_PROGRESS);
  const [activeModuleId, setActiveModuleId] = useState("");
  const [viewAdmin, setViewAdmin] = useState(false);

  // Sync users and tracks to local storage
  useEffect(() => {
    localStorage.setItem("shark_registered_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("shark_curriculum_tracks", JSON.stringify(tracks));
  }, [tracks]);

  // Load progress when a user logs in
  const loadUserProgress = (email) => {
    const savedProgress = localStorage.getItem(`shark_progress_${email}`);
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress);
      setCurrentProgress(parsed);
      return parsed;
    } else {
      localStorage.setItem(`shark_progress_${email}`, JSON.stringify(INITIAL_USER_PROGRESS));
      setCurrentProgress(INITIAL_USER_PROGRESS);
      return INITIAL_USER_PROGRESS;
    }
  };

  // Sync current user's progress to local storage when changed
  const saveUserProgress = (updatedProgress) => {
    if (!currentUser || currentUser.role === "admin") return;
    setCurrentProgress(updatedProgress);
    localStorage.setItem(`shark_progress_${currentUser.email}`, JSON.stringify(updatedProgress));
    
    // Update the progress reference inside our users list too for admin view auditing
    setUsers(prev => prev.map(u => {
      if (u.email === currentUser.email) {
        return { ...u, progress: updatedProgress };
      }
      return u;
    }));
  };

  // Handle Recruit Register
  const handleRegister = (newUser) => {
    const exists = users.find(u => u.email === newUser.email);
    if (exists) return false;

    // Register user
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);

    // Set as active user
    setCurrentUser(newUser);
    const initialProg = {
      completedModules: [],
      completedTimes: {},
      isFullyCompleted: false,
      signedName: "",
      signedDate: "",
      signedIp: ""
    };
    
    // Initialize progress file
    setCurrentProgress(initialProg);
    localStorage.setItem(`shark_progress_${newUser.email}`, JSON.stringify(initialProg));

    // Load active track
    const activeTrack = tracks.find(t => t.role === newUser.role);
    if (activeTrack && activeTrack.modules.length > 0) {
      setActiveModuleId(activeTrack.modules[0].id);
    } else {
      setActiveModuleId("");
    }
    setViewAdmin(false);
    return true;
  };

  // Handle Login
  const handleLogin = (email, isAdmin) => {
    if (isAdmin) {
      const adminUser = { name: "Administrator", email: "admin@sharkcleaning.com", role: "admin" };
      setCurrentUser(adminUser);
      setViewAdmin(true);
      setActiveModuleId("");
      return true;
    }

    const matchedUser = users.find(u => u.email === email);
    if (!matchedUser) return false;

    // Set active user
    setCurrentUser(matchedUser);
    const userProg = loadUserProgress(matchedUser.email);

    // Set active module
    const userTrack = tracks.find(t => t.role === matchedUser.role);
    if (userTrack && userTrack.modules.length > 0) {
      // Find the first uncompleted module or default to first
      const firstUncompleted = userTrack.modules.find(m => !userProg.completedModules.includes(m.id));
      setActiveModuleId(firstUncompleted ? firstUncompleted.id : userTrack.modules[0].id);
    } else {
      setActiveModuleId("");
    }
    
    setViewAdmin(false);
    return true;
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentProgress(INITIAL_USER_PROGRESS);
    setActiveModuleId("");
    setViewAdmin(false);
  };

  // Complete a Module
  const handleCompleteModule = (moduleId, extraData = {}) => {
    if (!currentUser || currentUser.role === "admin") return;

    const completedModules = currentProgress.completedModules.includes(moduleId)
      ? currentProgress.completedModules
      : [...currentProgress.completedModules, moduleId];

    const completedTimes = {
      ...currentProgress.completedTimes,
      [moduleId]: new Date().toISOString()
    };

    const updatedProgress = {
      ...currentProgress,
      completedModules,
      completedTimes,
      ...extraData // signedName, signedDate, signedIp, etc.
    };

    saveUserProgress(updatedProgress);
  };

  // ADMIN: Add Track
  const handleAddTrack = (newTrack) => {
    setTracks([...tracks, newTrack]);
  };

  // ADMIN: Delete Track
  const handleDeleteTrack = (trackId) => {
    setTracks(tracks.filter(t => t.id !== trackId));
  };

  // ADMIN: Add Module Step
  const handleAddModule = (trackId, newModule) => {
    setTracks(tracks.map(t => {
      if (t.id === trackId) {
        return {
          ...t,
          modules: [...t.modules, newModule]
        };
      }
      return t;
    }));
  };

  // ADMIN: Delete Module Step
  const handleDeleteModule = (trackId, moduleId) => {
    setTracks(tracks.map(t => {
      if (t.id === trackId) {
        return {
          ...t,
          modules: t.modules.filter(m => m.id !== moduleId)
        };
      }
      return t;
    }));
  };

  // Find active track for logged in recruit
  const activeTrack = currentUser ? (tracks.find(t => t.role === currentUser.role) || tracks[0]) : null;

  // Enrich standard users list with progress from localStorage for Admin audit matrix
  const enrichedUsers = users.map(u => {
    const saved = localStorage.getItem(`shark_progress_${u.email}`);
    return {
      ...u,
      progress: saved ? JSON.parse(saved) : INITIAL_USER_PROGRESS
    };
  });

  return (
    <div className="app-container">
      {currentUser ? (
        <>
          {/* Navigational Sidebar */}
          <Sidebar 
            user={currentUser}
            track={activeTrack}
            activeModuleId={activeModuleId}
            onSelectModule={setActiveModuleId}
            progress={currentProgress}
            onLogout={handleLogout}
            setViewAdmin={setViewAdmin}
            viewAdmin={viewAdmin}
          />
          
          {/* Main Work Space */}
          <main className="main-content">
            {viewAdmin ? (
              <AdminDashboard 
                usersList={enrichedUsers}
                tracks={tracks}
                onAddTrack={handleAddTrack}
                onAddModule={handleAddModule}
                onDeleteModule={handleDeleteModule}
                onDeleteTrack={handleDeleteTrack}
              />
            ) : (
              <DashboardView 
                user={currentUser}
                track={activeTrack}
                activeModuleId={activeModuleId}
                progress={currentProgress}
                onCompleteModule={handleCompleteModule}
                onSetActiveModule={setActiveModuleId}
              />
            )}
          </main>
        </>
      ) : (
        <LoginView 
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}
    </div>
  );
}
