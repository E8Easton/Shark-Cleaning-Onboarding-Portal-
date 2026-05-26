import { DEFAULT_TRACKS } from "../data/initialData";

/**
 * Re-inserts any default curriculum steps that were deleted,
 * while keeping admin edits to existing steps and custom-added steps.
 */
export function mergeTracksWithDefaults(savedTracks) {
  if (!Array.isArray(savedTracks) || savedTracks.length === 0) {
    return DEFAULT_TRACKS;
  }

  return savedTracks.map((saved) => {
    const defaults = DEFAULT_TRACKS.find((d) => d.id === saved.id);
    if (!defaults) return saved;

    const savedById = new Map(saved.modules.map((m) => [m.id, m]));
    const defaultIds = new Set(defaults.modules.map((m) => m.id));

    const merged = defaults.modules.map(
      (defMod) => savedById.get(defMod.id) ?? defMod
    );

    const customOnly = saved.modules.filter((m) => !defaultIds.has(m.id));

    return {
      ...saved,
      title: saved.title || defaults.title,
      description: saved.description || defaults.description,
      modules: [...merged, ...customOnly],
    };
  });
}

/** Ensures technician + sales default tracks exist even if storage was wiped */
export function ensureCoreTracks(tracks) {
  const ids = new Set(tracks.map((t) => t.id));
  const missing = DEFAULT_TRACKS.filter((d) => !ids.has(d.id));
  return missing.length ? [...tracks, ...missing] : tracks;
}
