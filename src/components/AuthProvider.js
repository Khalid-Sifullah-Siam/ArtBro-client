"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authClient } from "@/lib/auth-client";

const AuthContext = createContext(null);

async function authRequest(path, { method = "GET", body } = {}) {
  const response = await fetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
    credentials: "include",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) {
    throw new Error(data.message || "Authentication request failed");
  }
  return data;
}

function unwrapResult(result) {
  if (result?.error) {
    throw new Error(result.error.message || "Authentication request failed");
  }
  return result?.data ?? result;
}

function mapSession(sessionData) {
  return {
    token: sessionData?.session?.token || sessionData?.token || "",
    user: sessionData?.user || null,
  };
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    authClient.getSession()
      .then((result) => {
        const data = unwrapResult(result);
        const session = mapSession(data);
        setToken(session.token);
        setUser(session.user);
      })
      .catch(() => {
        setToken("");
        setUser(null);
      })
      .finally(() => setReady(true));
  }, []);

  async function login(payload) {
    const signInResult = await authClient.signIn.email({
      email: payload.email,
      password: payload.password,
    });
    const signInData = unwrapResult(signInResult);
    const sessionResult = await authClient.getSession();
    const sessionData = unwrapResult(sessionResult);
    const session = mapSession(sessionData);
    setToken(session.token);
    setUser(session.user || signInData?.user || null);
    return session.user || signInData?.user || null;
  }

  async function register(payload) {
    const signUpResult = await authClient.signUp.email({
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: payload.role || "user",
    });
    const signUpData = unwrapResult(signUpResult);
    const sessionResult = await authClient.getSession();
    const sessionData = unwrapResult(sessionResult);
    const session = mapSession(sessionData);
    setToken(session.token);
    setUser(session.user || signUpData?.user || null);
    return session.user || signUpData?.user || null;
  }

  async function googleLogin(payload) {
    const data = await authRequest("/api/auth/google", { method: "POST", body: payload });
    const session = await authRequest("/api/auth/session");
    setToken(session.token || "");
    setUser(data.user || session.user || null);
    return data.user;
  }

  async function logout() {
    try {
      const result = await authClient.signOut();
      unwrapResult(result);
    } catch (_error) {
      // Clear client state even if logout request fails.
    }
    setToken("");
    setUser(null);
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
