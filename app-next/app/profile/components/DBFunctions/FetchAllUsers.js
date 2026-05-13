"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function useFetchAllUsers(enabled) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(Boolean(enabled));
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadUsers() {
      if (!enabled) {
        setUsers([]);
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await api("/api/users");
        if (isMounted) {
          setUsers(Array.isArray(data) ? data : []);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError);
          setUsers([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, [enabled]);

  async function refresh() {
    if (!enabled) {
      setUsers([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await api("/api/users");
      setUsers(Array.isArray(data) ? data : []);
    } catch (fetchError) {
      setError(fetchError);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }

  return { users, isLoading, error, refresh, setUsers };
}
