"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AuthProvider, useAuth } from "./AuthProvider";
import { FooterItem, FooterReveal, MotionSections } from "./Motion";
import { categories } from "@/lib/api";

function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const dashboardHref = user ? `/dashboard/${user.role}` : "";
  const links = [
    ["Home", "/"],
    ["Browse Artworks", "/browse"],
  ];
  const dashboardLinks = user ? [
    ["Overview", dashboardHref],
    ["Profile", "/dashboard"],
    ...(user?.role !== "user" ? [["Manage Artworks", "/dashboard/artist"]] : []),
    ...(user?.role === "admin" ? [["Admin", "/dashboard/admin"]] : []),
  ] : [];

  function linkClass(href) {
    const active = href === "/" ? pathname === href : pathname.startsWith(href);
    return `rounded-lg px-3 py-2 text-sm font-bold ${
      active ? "bg-teal-50 text-teal-800" : "text-slate-650 hover:bg-slate-100"
    }`;
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container flex min-h-16 items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-3 font-black text-slate-950">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-teal-700 text-white">A</span>
          <span className="text-xl">ArtHub</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={linkClass(href)}
            >
              {label}
            </Link>
          ))}
          {user && (
            <details className="group relative">
              <summary className={`list-none rounded-lg px-3 py-2 text-sm font-bold ${pathname.startsWith("/dashboard") ? "bg-teal-50 text-teal-800" : "text-slate-650 hover:bg-slate-100"}`}>
                Dashboard
              </summary>
              <div className="absolute right-0 mt-2 grid min-w-48 gap-1 rounded-lg border border-slate-200 bg-white p-2 shadow-xl">
                {dashboardLinks.map(([label, href]) => (
                  <Link key={`${label}-${href}`} href={href} className="rounded-md px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100">
                    {label}
                  </Link>
                ))}
              </div>
            </details>
          )}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden max-w-36 truncate text-sm font-bold text-slate-700 sm:block">{user.name}</span>
              <button className="btn btn-secondary" onClick={logout}>Logout</button>
            </>
          ) : (
            <Link className="btn btn-primary" href="/login">Login</Link>
          )}
          <button className="btn btn-secondary mobile-menu-toggle px-3" type="button" aria-label="Toggle navigation" onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? (
              "X"
            ) : (
              <span className="grid gap-1">
                <span className="block h-0.5 w-5 bg-slate-900" />
                <span className="block h-0.5 w-5 bg-slate-900" />
                <span className="block h-0.5 w-5 bg-slate-900" />
              </span>
            )}
          </button>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.nav
            className="container grid gap-2 overflow-hidden pb-3 md:hidden"
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            {[...links, ...(user ? [["Dashboard", dashboardHref]] : [])].map(([label, href]) => (
              <Link key={href} href={href} className={linkClass(href)} onClick={() => setMenuOpen(false)}>
                {label}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function Footer() {
  const { user } = useAuth();

  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-950 text-white">
      <FooterReveal className="container grid gap-8 py-10 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.2fr]">
        <FooterItem>
          <h2 className="text-xl font-black">ArtHub</h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-300">
            A marketplace for original work, independent artists, and collectors who want something with a human hand behind it.
          </p>
        </FooterItem>
        <FooterItem>
          <h3 className="font-bold">About</h3>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            ArtHub helps collectors discover original pieces while giving artists simple tools to publish, sell, and track their creative work.
          </p>
          <Link className="mt-3 inline-block text-sm font-bold text-teal-200 hover:text-white" href="/about">Learn more</Link>
        </FooterItem>
        <FooterItem>
          <h3 className="font-bold">Quick links</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-300">
            <Link className="w-fit rounded-md border border-white/20 px-3 py-2 font-bold text-white hover:bg-white/10" href="/about">About</Link>
            <Link href="/browse">Browse</Link>
            {user && <Link href={`/dashboard/${user.role}`}>Dashboard</Link>}
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </FooterItem>
        <FooterItem>
          <form className="grid content-start gap-3">
            <h3 className="font-bold">Newsletter</h3>
            <div className="flex gap-2">
              <input className="field min-w-0" placeholder="Email address" type="email" />
              <button className="btn btn-primary" type="button">Join</button>
            </div>
            <div className="flex gap-2">
              {["IG", "FB", "X"].map((label) => (
                <a key={label} className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-sm font-black text-white hover:bg-white/10" href="#" aria-label={label}>
                  {label}
                </a>
              ))}
            </div>
          </form>
        </FooterItem>
      </FooterReveal>
      <div className="border-t border-white/10 py-4 text-center text-sm text-slate-400">
        Copyright {new Date().getFullYear()} ArtHub. All rights reserved.
      </div>
    </footer>
  );
}

export function AppShell({ children }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <AuthProvider>
      <Header />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={pathname}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          <MotionSections>{children}</MotionSections>
        </motion.main>
      </AnimatePresence>
      <Footer />
    </AuthProvider>
  );
}

export function CategoryLinks() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <Link
          key={category}
          href={`/browse?category=${encodeURIComponent(category)}`}
          className="card flex items-center justify-between p-5 font-black text-slate-900 hover:border-teal-700"
        >
          {category}
          <span className="text-teal-700">View</span>
        </Link>
      ))}
    </div>
  );
}
