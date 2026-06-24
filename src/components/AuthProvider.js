"use client";
/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("arthub_token") || "";
    const savedUser = localStorage.getItem("arthub_user");
    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!token || !ready) return;
    apiFetch("/api/auth/me", { token })
      .then((data) => setUser(data.user))
      .catch(() => logout());
  }, [token, ready]);

  function persist(nextToken, nextUser) {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem("arthub_token", nextToken);
    localStorage.setItem("arthub_user", JSON.stringify(nextUser));
  }

  async function login(payload) {
    const data = await apiFetch("/api/auth/login", { method: "POST", body: payload });
    persist(data.token, data.user);
    return data.user;
  }

  async function register(payload) {
    const data = await apiFetch("/api/auth/register", { method: "POST", body: payload });
    persist(data.token, data.user);
    return data.user;
  }

  async function googleLogin(payload) {
    const data = await apiFetch("/api/auth/google", { method: "POST", body: payload });
    persist(data.token, data.user);
    return data.user;
  }

  function logout() {
    setToken("");
    setUser(null);
    localStorage.removeItem("arthub_token");
    localStorage.removeItem("arthub_user");
  }

  const value = useMemo(
    () => ({ ready, token, user, login, register, googleLogin, logout, setUser }),
    [ready, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
