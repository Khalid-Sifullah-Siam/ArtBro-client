import { AppShell } from "@/components/AppShell";

export default function PrivacyPage() {
  return (
    <AppShell>
      <section className="container py-14">
        <div className="card max-w-3xl p-6">
          <h1 className="text-3xl font-black text-slate-950">Privacy Policy</h1>
          <p className="mt-3 leading-7 text-slate-700">ArtHub stores account, artwork, comment, and transaction data needed to run the marketplace. Payment card data is handled by Stripe checkout.</p>
        </div>
      </section>
    </AppShell>
  );
}
