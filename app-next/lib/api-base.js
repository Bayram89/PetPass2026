const rawApiBase = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_DB_ACCESS || "";

export const apiBaseUrl = rawApiBase.replace(/\/$/, "");

export function withApiBase(path) {
  if (!apiBaseUrl) return path;
  if (/^https?:\/\//.test(path)) return path;
  return `${apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
