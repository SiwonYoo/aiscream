export const INSTALL_ID_KEY = 'aiscream_install_id';

function makeId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `iid_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export function getOrCreateInstallId(): string {
  if (typeof window === 'undefined') return '';
  const existing = localStorage.getItem(INSTALL_ID_KEY);
  if (existing) return existing;

  const id = makeId();
  localStorage.setItem(INSTALL_ID_KEY, id);
  return id;
}
