const TRASH_KEY = "shark_deleted_steps";
const MAX_ITEMS = 15;

export function loadDeletedSteps() {
  try {
    const raw = localStorage.getItem(TRASH_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveDeletedSteps(items) {
  localStorage.setItem(TRASH_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
}

export function pushDeletedStep(entry) {
  const list = loadDeletedSteps();
  const next = [{ ...entry, deletedAt: Date.now() }, ...list.filter((e) => e.module?.id !== entry.module?.id)];
  saveDeletedSteps(next);
  return next;
}

export function removeDeletedStep(moduleId) {
  const next = loadDeletedSteps().filter((e) => e.module?.id !== moduleId);
  saveDeletedSteps(next);
  return next;
}
