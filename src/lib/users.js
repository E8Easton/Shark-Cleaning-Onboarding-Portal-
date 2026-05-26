export function makeUserId(name, role) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${role}-${slug || "trainee"}`;
}

export function isTraineeFullyComplete(progress, track) {
  if (!track?.modules?.length || !progress) return false;
  const allModulesDone = track.modules.every((m) =>
    progress.completedModules.includes(m.id)
  );
  const agreementModule = track.modules.find((m) => m.type === "agreement");
  const signed = Boolean(progress.signedName?.trim());
  if (agreementModule) {
    return allModulesDone && signed;
  }
  return allModulesDone;
}
