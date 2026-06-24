"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/components/AuthProvider";
import { Notice } from "@/components/Notice";
import { apiFetch } from "@/lib/api";
import { getRoleRedirectPath } from "@/lib/roleRedirect";

export default function GoogleCallbackPage() {
  return (
    <AppShell>
      <GoogleCallbackContent />
    </AppShell>
  );
}

function GoogleCallbackContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { ready, user, setUser } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ready || !user) return;

    const selectedRole = params.get("role") === "artist" ? "artist" : "user";

    async function finishLogin() {
      try {
        let currentUser = user;

        if (selectedRole === "artist" && user.role === "user") {
          const data = await apiFetch("/api/users/me/registration-role", {
            method: "PATCH",
            body: { role: "artist" },
          });
          currentUser = data.user;
          setUser(currentUser);
        }

        router.replace(getRoleRedirectPath(currentUser.role));
      } catch (callbackError) {
        setError(callbackError.message);
      }
    }

    finishLogin();
  }, [params, ready, router, setUser, user]);

  const displayError = error || (ready && !user ? "Google login could not be completed." : "");

  return (
    <section className="container grid min-h-[65vh] place-items-center py-12">
      <div className="card w-full max-w-md p-6 text-center">
        <h1 className="text-2xl font-black text-slate-950">Completing Google login</h1>
        <div className="mt-4">
          {displayError ? <Notice type="error">{displayError}</Notice> : <Notice>Please wait...</Notice>}
        </div>
      </div>
    </section>
  );
}
