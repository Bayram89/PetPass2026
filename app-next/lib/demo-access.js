import { withApiBase } from "./api-base";
import { setAuthToken } from "./auth-token";

export const DEMO_ADMIN_EMAIL = "demo@petpass.com";
export const DEMO_ADMIN_PASSWORD = "Demo123";

export async function signInAsDemoAdmin() {
  const response = await fetch(withApiBase("/auth/demo-login"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: DEMO_ADMIN_EMAIL,
      password: DEMO_ADMIN_PASSWORD,
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload?.error || "Failed to sign in with the demo admin account.");
  }

  if (payload?.token) {
    setAuthToken(payload.token);
  }

  return payload;
}
