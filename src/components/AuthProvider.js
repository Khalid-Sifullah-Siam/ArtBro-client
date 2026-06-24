"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  getCurrentSession,
  signInWithEmail,
  signInWithGoogle,
  signOut,
  signUpWithEmail,
} from "@/lib/auth-api";

const AuthContext = createContext(null);

function normalizeUser(user) {
  if (!user) return null;
  return {
    ...user,
    _id: user._id || user.id,
  };
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getCurrentSession()
      .then((session) => {
        if (session?.user) {
          setToken("session");
          setUser(normalizeUser(session.user));
        }
      })
      .finally(() => setReady(true));
  }, []);

  function persist(nextUser) {
    setToken("session");
    setUser(normalizeUser(nextUser));
  }

  async function login(payload) {
    const data = await signInWithEmail(payload.email, payload.password);
    persist(data.user);
    return normalizeUser(data.user);
  }

  async function register(payload) {
    if (payload.password !== payload.confirmPassword) {
      throw new Error("Passwords do not match");
    }
    const data = await signUpWithEmail(payload);
    persist(data.user);
    return normalizeUser(data.user);
  }

  async function googleLogin(role) {
    const data = await signInWithGoogle(role);

    if (!data.url) {
      throw new Error("Google login could not be started");
    }

    window.location.assign(data.url);
  }

  async function logout() {
    try {
      await signOut();
    } catch {
      // Clear local login data even if the server is unavailable.
    }
    setToken("");
    setUser(null);
  }

  const value = { ready, token, user, login, register, googleLogin, logout, setUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
