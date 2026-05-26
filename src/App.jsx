import React, { useState, useEffect, useCallback } from "react";
import { DEFAULT_TRACKS, INITIAL_USER_PROGRESS } from "./data/initialData";
import LoginView from "./views/LoginView";
import DashboardView from "./views/DashboardView";
import Sidebar from "./components/Sidebar";
import AdminPanel from "./components/AdminPanel";
import { makeUserId } from "./lib/users";
import { mergeTracksWithDefaults, ensureCoreTracks } from "./lib/restoreDefaults";
import {
  loadTracks,
  saveTracks,
  loadUsers,
  saveUsers,
  loadProgress,
  saveProgress,
} from "./lib/storage";

const ADMIN_USER = {
  id: "admin",
  name: "Admin / Owner",
  role: "admin",
};

export default function App() {
  const [hydrated, setHydrated] = useState(false);
  const [users, setUsers] = useState([]);
  const [tracks, setTracks] = useState(DEFAULT_TRACKS);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentProgress, setCurrentProgress] = useState(INITIAL_USER_PROGRESS);
  const [activeModuleId, setActiveModuleId] = useState("");
  const [viewAdmin, setViewAdmin] = useState(false);

  useEffect(() => {
    (async () => {
      const [loadedUsers, loadedTracks] = await Promise.all([loadUsers(), loadTracks()]);
      setUsers(loadedUsers.filter((u) => u.role !== "admin"));
      const restored = ensureCoreTracks(mergeTracksWithDefaults(loadedTracks));
      setTracks(restored);
      if (JSON.stringify(restored) !== JSON.stringify(loadedTracks)) {
        saveTracks(restored);
      }
      setHydrated(true);
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveUsers(users);
  }, [users, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveTracks(tracks);
  }, [tracks, hydrated]);

  const pickFirstModule = useCallback((track, progress) => {
    if (!track?.modules?.length) return "";
    const firstOpen = track.modules.find((m) => !progress.completedModules.includes(m.id));
    return firstOpen ? firstOpen.id : track.modules[0].id;
  }, []);

  const loadUserProgress = async (userId) => {
    const saved = (await loadProgress(userId)) || { ...INITIAL_USER_PROGRESS };
    setCurrentProgress(saved);
    return saved;
  };

  const saveUserProgress = async (updatedProgress) => {
    if (!currentUser || currentUser.role === "admin") return;
    setCurrentProgress(updatedProgress);
    await saveProgress(currentUser.id, updatedProgress);
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id ? { ...u, progress: updatedProgress } : u
      )
    );
  };

  const handleEnterTrainee = async (role, name) => {
    const id = makeUserId(name, role);
    let user = users.find((u) => u.id === id);

    if (!user) {
      user = {
        id,
        name: name.trim(),
        role,
        startedAt: new Date().toISOString(),
      };
      setUsers((prev) => [...prev, user]);
    }

    setCurrentUser(user);
    const prog = await loadUserProgress(id);
    const activeTrack = tracks.find((t) => t.role === role);
    setActiveModuleId(pickFirstModule(activeTrack, prog));
    setViewAdmin(false);
  };

  const handleEnterAdmin = () => {
    setCurrentUser(ADMIN_USER);
    setCurrentProgress(INITIAL_USER_PROGRESS);
    setActiveModuleId("");
    setViewAdmin(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentProgress(INITIAL_USER_PROGRESS);
    setActiveModuleId("");
    setViewAdmin(false);
  };

  const handleCompleteModule = (moduleId, extraData = {}) => {
    if (!currentUser || currentUser.role === "admin") return;

    const completedModules = currentProgress.completedModules.includes(moduleId)
      ? currentProgress.completedModules
      : [...currentProgress.completedModules, moduleId];

    const updatedProgress = {
      ...currentProgress,
      completedModules,
      completedTimes: {
        ...currentProgress.completedTimes,
        [moduleId]: new Date().toISOString(),
      },
      ...extraData,
    };

    saveUserProgress(updatedProgress);
  };

  const renumberModules = (modules) =>
    modules.map((m, i) => ({
      ...m,
      title: `${i + 1}. ${m.title.replace(/^\d+\.\s*/, "")}`,
    }));

  const handleAddTrack = (newTrack) => {
    setTracks((prev) => [...prev, newTrack]);
  };

  const handleDeleteTrack = (trackId) => {
    setTracks((prev) => prev.filter((t) => t.id !== trackId));
  };

  const handleAddModule = (trackId, newModule, insertAt) => {
    setTracks((prev) =>
      prev.map((t) => {
        if (t.id !== trackId) return t;
        const modules = [...t.modules];
        if (typeof insertAt === "number" && insertAt >= 0) {
          modules.splice(insertAt, 0, newModule);
        } else {
          modules.push(newModule);
        }
        return { ...t, modules: renumberModules(modules) };
      })
    );
  };

  const handleDeleteModule = (trackId, moduleId) => {
    setTracks((prev) =>
      prev.map((t) => {
        if (t.id !== trackId) return t;
        const modules = t.modules.filter((m) => m.id !== moduleId);
        return { ...t, modules: renumberModules(modules) };
      })
    );
  };

  const handleRestoreDefaultSteps = () => {
    setTracks((prev) => {
      const restored = ensureCoreTracks(mergeTracksWithDefaults(prev));
      saveTracks(restored);
      return restored;
    });
  };

  const handleUpdateModule = (trackId, moduleId, updates) => {
    setTracks((prev) =>
      prev.map((t) =>
        t.id === trackId
          ? {
              ...t,
              modules: t.modules.map((m) =>
                m.id === moduleId ? { ...m, ...updates } : m
              ),
            }
          : t
      )
    );
  };

  const activeTrack =
    currentUser && currentUser.role !== "admin"
      ? tracks.find((t) => t.role === currentUser.role) || tracks[0]
      : null;

  const isAdmin = currentUser?.role === "admin";

  if (!hydrated) {
    return (
      <div className="login-scene">
        <p className="text-text-secondary text-sm animate-pulse">Loading portal…</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      {currentUser ? (
        <>
          <Sidebar
            user={currentUser}
            track={activeTrack}
            activeModuleId={activeModuleId}
            onSelectModule={(id) => {
              setActiveModuleId(id);
              setViewAdmin(false);
            }}
            progress={currentProgress}
            onLogout={handleLogout}
            isAdmin={isAdmin}
            viewAdmin={viewAdmin}
            setViewAdmin={setViewAdmin}
          />

          <main className="main-content">
            {isAdmin && viewAdmin ? (
              <AdminPanel
                users={users}
                tracks={tracks}
                onSaveTracks={saveTracks}
                onAddTrack={handleAddTrack}
                onDeleteTrack={handleDeleteTrack}
                onAddModule={handleAddModule}
                onDeleteModule={handleDeleteModule}
                onUpdateModule={handleUpdateModule}
                onRestoreDefaultSteps={handleRestoreDefaultSteps}
              />
            ) : isAdmin ? (
              <div className="glass-card p-8 text-center space-y-4 max-w-lg mx-auto">
                <p className="text-text-secondary text-sm">
                  Open <strong className="text-white">Admin Dashboard</strong> from the sidebar to edit training steps or view who completed onboarding.
                </p>
                <button type="button" className="btn btn-accent" onClick={() => setViewAdmin(true)}>
                  Open Admin Dashboard
                </button>
              </div>
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
          onEnterTrainee={handleEnterTrainee}
          onEnterAdmin={handleEnterAdmin}
          extraTracks={tracks.filter(
            (t) => t.role !== "technician" && t.role !== "sales" && t.role !== "admin"
          )}
        />
      )}
    </div>
  );
}
