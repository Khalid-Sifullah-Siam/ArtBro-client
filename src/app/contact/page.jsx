import { AppShell } from "@/components/AppShell";

export default function ContactPage() {
  return (
    <AppShell>
      <section className="container py-14">
        <div className="card max-w-2xl p-6">
          <h1 className="text-3xl font-black text-slate-950">Contact</h1>
          <p className="mt-3 leading-7 text-slate-700">For artwork, order, or artist account questions, contact ArtHub support at support@arthub.example.</p>
        </div>
      </section>
    </AppShell>
  );
}
