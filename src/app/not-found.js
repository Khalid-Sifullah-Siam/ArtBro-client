import Link from "next/link";
import { AppShell } from "@/components/AppShell";

export default function NotFound() {
  return (
    <AppShell>
      <section className="container grid min-h-[70vh] place-items-center py-12">
        <div className="card max-w-lg p-6 text-center">
          <div className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-amber-100 text-5xl font-black text-amber-700">404</div>
          <h1 className="mt-6 text-3xl font-black text-slate-950">Page Not Found</h1>
          <p className="mt-3 text-slate-600">The page you are looking for is not available.</p>
          <Link className="btn btn-primary mt-5" href="/">Go home</Link>
        </div>
      </section>
    </AppShell>
  );
}
