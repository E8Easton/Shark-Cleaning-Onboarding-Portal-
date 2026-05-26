/** Comma-separated owner emails that can open Content Studio */
export function getOwnerEmails() {
  const raw = import.meta.env.VITE_OWNER_EMAILS || "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

const BOOTSTRAP_OWNER_KEY = "shark_portal_owner";

export function registerBootstrapOwner(email) {
  if (!email || getOwnerEmails().length > 0) return;
  if (!localStorage.getItem(BOOTSTRAP_OWNER_KEY)) {
    localStorage.setItem(BOOTSTRAP_OWNER_KEY, email.trim().toLowerCase());
  }
}

export function getOwnerDomain() {
  return (import.meta.env.VITE_OWNER_DOMAIN || "").trim().toLowerCase();
}

export function isOwnerEmail(email) {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  const owners = getOwnerEmails();
  if (owners.length > 0 && owners.includes(normalized)) return true;

  const domain = getOwnerDomain();
  if (domain && normalized.endsWith(`@${domain}`)) return true;

  if (owners.length > 0) return false;

  const bootstrap = localStorage.getItem(BOOTSTRAP_OWNER_KEY);
  return bootstrap === normalized;
}

export function isSupabaseConfigured() {
  return Boolean(
    import.meta.env.VITE_SUPABASE_URL &&
      import.meta.env.VITE_SUPABASE_ANON_KEY
  );
}
