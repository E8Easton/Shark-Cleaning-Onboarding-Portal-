import { DEFAULT_TRACKS } from "../data/initialData";
import { mergeTracksWithDefaults, ensureCoreTracks } from "./restoreDefaults";
import { getSupabase } from "./supabase";
import { isSupabaseConfigured } from "./config";

const LS_TRACKS = "shark_curriculum_tracks";
const LS_USERS = "shark_registered_users";
const progressKey = (email) => `shark_progress_${email}`;
const salesKey = (email) => `shark_sales_logs_${email}`;

async function supabaseGetRow(table, id) {
  const sb = getSupabase();
  const { data, error } = await sb.from(table).select("payload").eq("id", id).maybeSingle();
  if (error) throw error;
  return data?.payload ?? null;
}

async function supabaseUpsertRow(table, id, payload) {
  const sb = getSupabase();
  const { error } = await sb.from(table).upsert(
    { id, payload, updated_at: new Date().toISOString() },
    { onConflict: "id" }
  );
  if (error) throw error;
}

export async function loadTracks() {
  if (isSupabaseConfigured()) {
    try {
      const remote = await supabaseGetRow("portal_data", "tracks");
      if (remote && Array.isArray(remote)) {
        return ensureCoreTracks(mergeTracksWithDefaults(remote));
      }
    } catch (e) {
      console.warn("Supabase tracks load failed, using local cache:", e);
    }
  }
  const saved = localStorage.getItem(LS_TRACKS);
  const raw = saved ? JSON.parse(saved) : DEFAULT_TRACKS;
  const merged = ensureCoreTracks(mergeTracksWithDefaults(raw));
  if (saved && JSON.stringify(merged) !== JSON.stringify(raw)) {
    localStorage.setItem(LS_TRACKS, JSON.stringify(merged));
  }
  return merged;
}

export async function saveTracks(tracks) {
  localStorage.setItem(LS_TRACKS, JSON.stringify(tracks));
  if (isSupabaseConfigured()) {
    try {
      await supabaseUpsertRow("portal_data", "tracks", tracks);
    } catch (e) {
      console.warn("Supabase tracks save failed:", e);
    }
  }
}

export async function loadUsers() {
  if (isSupabaseConfigured()) {
    try {
      const remote = await supabaseGetRow("portal_data", "users");
      if (remote && Array.isArray(remote)) return remote;
    } catch (e) {
      console.warn("Supabase users load failed:", e);
    }
  }
  const saved = localStorage.getItem(LS_USERS);
  if (saved) return JSON.parse(saved);
  return [];
}

export async function saveUsers(users) {
  localStorage.setItem(LS_USERS, JSON.stringify(users));
  if (isSupabaseConfigured()) {
    try {
      await supabaseUpsertRow("portal_data", "users", users);
    } catch (e) {
      console.warn("Supabase users save failed:", e);
    }
  }
}

export function loadProgressLocal(email) {
  const saved = localStorage.getItem(progressKey(email));
  return saved ? JSON.parse(saved) : null;
}

export function saveProgressLocal(email, progress) {
  localStorage.setItem(progressKey(email), JSON.stringify(progress));
}

export async function loadProgress(email) {
  if (isSupabaseConfigured()) {
    try {
      const remote = await supabaseGetRow("user_progress", email);
      if (remote) return remote;
    } catch (e) {
      console.warn("Supabase progress load failed:", e);
    }
  }
  return loadProgressLocal(email);
}

export async function saveProgress(email, progress) {
  saveProgressLocal(email, progress);
  if (isSupabaseConfigured()) {
    try {
      await supabaseUpsertRow("user_progress", email, progress);
    } catch (e) {
      console.warn("Supabase progress save failed:", e);
    }
  }
}

export function loadSalesLogsLocal(email, fallback = []) {
  const saved = localStorage.getItem(salesKey(email));
  return saved ? JSON.parse(saved) : fallback;
}

export function saveSalesLogsLocal(email, logs) {
  localStorage.setItem(salesKey(email), JSON.stringify(logs));
}
