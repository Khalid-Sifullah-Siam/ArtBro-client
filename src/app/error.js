"use client";

import { AppShell } from "@/components/AppShell";

export default function Error({ error, reset }) {
  return (
    <AppShell>
      <section className="container grid min-h-[70vh] place-items-center py-12">
        <div className="card max-w-lg p-6 text-center">
          <h1 className="text-3xl font-black text-slate-950">Something went wrong.</h1>
          <p className="mt-3 text-slate-600">{error?.message || "Reload and try again."}</p>
          <button className="btn btn-primary mt-5" onClick={reset}>Reload</button>
        </div>
      </section>
    </AppShell>
  );
}
