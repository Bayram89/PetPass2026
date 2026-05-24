import { withApiBase } from "./api-base";
import { withAuthHeaders } from "./auth-token";

export default async function api(path, init = {}) {
  const res = await fetch(withApiBase(path), {
    credentials: "include",
    ...init,
    headers: {
      ...(init.method !== "GET" && { "Content-Type": "application/json" }),
      ...withAuthHeaders(init.headers || {}),
    },
  });

  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error(await res.text());

  const ct = res.headers.get("content-type") || "";
  if (res.status === 204 || res.status === 201 || !ct.includes("application/json")) return res;

  return res.json();
}
