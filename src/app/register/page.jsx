"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/components/AuthProvider";
import { Notice } from "@/components/Notice";
import { GoogleButton } from "@/components/GoogleButton";

export default function RegisterPage() {
  return (
    <AppShell>
      <RegisterContent />
    </AppShell>
  );
}

function RegisterContent() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", role: "user" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(form);
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container grid min-h-[70vh] place-items-center py-12">
      <form onSubmit={submit} className="card grid w-full max-w-lg gap-4 p-6">
        <div>
          <h1 className="text-3xl font-black text-slate-950">Create Account</h1>
          <p className="mt-2 text-sm text-slate-600">Join as a buyer or artist. Admin roles are managed by an admin.</p>
        </div>
        {error && <Notice type="error">{error}</Notice>}
        <label className="label">Full name<input className="field" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
        <label className="label">Email<input className="field" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="label">Password<input className="field" type="password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>
          <label className="label">Confirm password<input className="field" type="password" required value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} /></label>
        </div>
        <label className="label">Role<select className="field" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}><option value="user">User / Buyer</option><option value="artist">Artist</option></select></label>
        <button className="btn btn-primary" disabled={loading}>{loading ? "Creating..." : "Register"}</button>
        <div className="grid gap-3 border-t border-slate-200 pt-4 justify-items-center">
          <p className="text-center text-sm font-bold text-slate-500">Or register with Google</p>
          <GoogleButton role={form.role} />
        </div>
        <p className="text-center text-sm text-slate-600">Already registered? <Link className="font-black text-teal-800" href="/login">Login</Link></p>
      </form>
    </section>
  );
}
