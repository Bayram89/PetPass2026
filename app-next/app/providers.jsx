"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { withApiBase } from "@/lib/api-base";

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
      });
    } finally {
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
