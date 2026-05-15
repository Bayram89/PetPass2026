const rawApiBase = process.env.NEXT_PUBLIC_API_URL || "";

export const apiBaseUrl = rawApiBase.replace(/\/$/, "");

export function withApiBase(path) {
  if (!apiBaseUrl) return path;
  if (/^https?:\/\//.test(path)) return path;
  return `${apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
