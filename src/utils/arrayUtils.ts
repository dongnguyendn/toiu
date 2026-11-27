export function ensureArray(data) {
  if (Array.isArray(data)) return data;
  if (!data) return [];
  if (typeof data === "object") {
    if (Array.isArray(data.tasks)) {
      return data.tasks;
    }
    return Object.values(data);
  }
  return [];
}
