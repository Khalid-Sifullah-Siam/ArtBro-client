"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/components/AuthProvider";
import { Notice } from "@/components/Notice";
import { apiFetch } from "@/lib/api";

export default function PaymentSuccessPage() {
  return (
    <AppShell>
      <PaymentSuccessContent />
    </AppShell>
  );
}

function PaymentSuccessContent() {
  const params = useSearchParams();
  const { token, ready, user, setUser } = useAuth();
  const [status, setStatus] = useState("Finalizing payment...");
  const [error, setError] = useState("");
  const confirmedSessionRef = useRef("");

  useEffect(() => {
    if (!ready) return;
    if (!token || !user) {
      setError("Login is required to finalize this payment.");
      return;
    }

    const sessionId = params.get("session_id") || params.get("sessionId");
    if (!sessionId) {
      setError("Stripe did not return a checkout session id.");
      return;
    }
    if (confirmedSessionRef.current === sessionId) return;
    confirmedSessionRef.current = sessionId;
    setError("");

    apiFetch(`/api/payments/checkout-sessions/${sessionId}/confirm`, { token, method: "POST" })
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          localStorage.setItem("arthub_user", JSON.stringify(data.user));
        }
        setStatus(data.type === "subscription" ? "Subscription upgraded successfully." : "Purchase recorded successfully.");
      })
      .catch((err) => {
        confirmedSessionRef.current = "";
        setError(err.message);
      });
  }, [params, ready, token, user, setUser]);

  return (
    <section className="container grid min-h-[65vh] place-items-center py-12">
      <div className="card max-w-lg p-6 text-center">
        <h1 className="text-3xl font-black text-slate-950">Payment Success</h1>
        <div className="mt-4">{error ? <Notice type="error">{error}</Notice> : <Notice>{status}</Notice>}</div>
        <div className="mt-5 flex justify-center gap-3">
          <Link className="btn btn-primary" href="/dashboard">Dashboard</Link>
          <Link className="btn btn-secondary" href="/browse">Browse</Link>
        </div>
      </div>
    </section>
  );
}


