"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/components/AuthProvider";
import { Notice } from "@/components/Notice";
import { GoogleButton } from "@/components/GoogleButton";

export default function LoginPage() {
  return (
    <AppShell>
      <LoginContent />
    </AppShell>
  );
}

function LoginContent() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = await login(form);
      if (user.role === "user") {
        router.push("/");
      } else {
        router.push(`/dashboard/${user.role}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container grid min-h-[70vh] place-items-center py-12">
      <form onSubmit={submit} className="card grid w-full max-w-md gap-4 p-6">
        <div>
          <h1 className="text-3xl font-black text-slate-950">Login</h1>
          <p className="mt-2 text-sm text-slate-600">Continue to purchase art, comment, or manage your studio.</p>
        </div>
        {error && <Notice type="error">{error}</Notice>}
        <label className="label">Email<input className="field" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
        <label className="label">Password<input className="field" type="password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>
        <button className="btn btn-primary" disabled={loading}>{loading ? "Signing in..." : "Login"}</button>
        <div className="grid gap-3 border-t border-slate-200 pt-4">
          <p className="text-center text-sm font-bold text-slate-500">Or continue with Google</p>
          <GoogleButton />
        </div>
        <p className="text-center text-sm text-slate-600">New here? <Link className="font-black text-teal-800" href="/register">Create an account</Link></p>
      </form>
    </section>
  );
}
