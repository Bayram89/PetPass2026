import { withApiBase } from "./api-base";

export default async function api(path, init = {}) {
  const res = await fetch(withApiBase(path), {
    credentials: "include",
    ...init,
    headers: {
      ...(init.method !== "GET" && { "Content-Type": "application/json" }),
      ...(init.headers || {}),
    },
  });

  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (!res.ok) throw new Error(await res.text());

  const ct = res.headers.get("content-type") || "";
  if (res.status === 204 || res.status === 201 || !ct.includes("application/json")) return res;

  return res.json();
}
