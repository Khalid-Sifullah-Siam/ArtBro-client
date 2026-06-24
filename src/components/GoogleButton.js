"use client";

import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { Notice } from "./Notice";

export function GoogleButton({ role = "user" }) {
  const { googleLogin } = useAuth();
  const [error, setError] = useState("");

  async function startGoogleLogin() {
    setError("");

    try {
      await googleLogin(role);
    } catch (loginError) {
      setError(loginError.message);
    }
  }

  return (
    <div className="grid w-full justify-items-center gap-3">
      <button
        type="button"
        className="btn w-full border border-slate-300 bg-white text-slate-800"
        onClick={startGoogleLogin}
      >
        Continue with Google
      </button>
      {error && <Notice type="error">{error}</Notice>}
    </div>
  );
}
