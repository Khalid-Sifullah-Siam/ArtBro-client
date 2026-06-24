import { AppShell } from "@/components/AppShell";

export default function AboutPage() {
  return (
    <AppShell>
      <section className="container py-14">
        <div className="card max-w-3xl p-6">
          <h1 className="text-3xl font-black text-slate-950">About ArtHub</h1>
          <p className="mt-3 leading-7 text-slate-700">ArtHub connects collectors with independent artists through artwork discovery, secure checkout, artist dashboards, and role-based marketplace management.</p>
        </div>

      </section>
    </AppShell> 
  );
}
