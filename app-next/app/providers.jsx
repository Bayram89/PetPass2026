"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { withApiBase } from "@/lib/api-base";
import { setAuthToken, withAuthHeaders } from "@/lib/auth-token";

const AuthContext = createContext({
  user: null,
  loading: true,
  refresh: async () => {},
  logout: async () => {},
});

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const res = await fetch(withApiBase("/api/me"), {
        credentials: "include",
        cache: "no-store",
        headers: withAuthHeaders(),
      });
      if (!res.ok) throw new Error("not ok");
      const data = await res.json();
      setUser(data.user || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      await fetch(withApiBase("/auth/logout"), {
        method: "POST",
        credentials: "include",
        headers: withAuthHeaders(),
      });
    } finally {
      setAuthToken(null);
      setUser(null);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  return <AuthContext.Provider value={{ user, loading, refresh, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
