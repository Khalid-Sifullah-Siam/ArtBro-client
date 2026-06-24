"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
/* eslint-disable @next/next/no-img-element */

const slides = [
  "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&w=1800&q=85",
  "https://images.unsplash.com/photo-1577720643272-265f09367456?auto=format&fit=crop&w=1800&q=85",
  "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&w=1800&q=85",
];

export function HomeHero() {
  const rootRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    const context = gsap.context(() => {
      const images = gsap.utils.toArray(".hero-artwork");
      gsap.set(images, { autoAlpha: 0, scale: 1.08 });
      gsap.set(images[0], { autoAlpha: 0.48 });

      const timeline = gsap.timeline({ repeat: -1 });
      images.forEach((image, index) => {
        const nextImage = images[(index + 1) % images.length];
        timeline
          .to(image, { scale: 1, duration: 4.2, ease: "none" })
          .to(image, { autoAlpha: 0, duration: 1.1, ease: "power2.inOut" }, "-=1.1")
          .fromTo(
            nextImage,
            { autoAlpha: 0, scale: 1.08 },
            { autoAlpha: 0.48, scale: 1.06, duration: 1.1, ease: "power2.inOut" },
            "<"
          );
      });

      gsap.from("[data-hero-copy] > *", {
        y: 34,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: "power3.out",
      });
    }, rootRef);

    return () => context.revert();
  }, [reduceMotion]);

  function moveArtwork(event) {
    if (reduceMotion || !rootRef.current) return;
    const bounds = rootRef.current.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 16;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 10;
    gsap.to(rootRef.current.querySelectorAll(".hero-artwork"), {
      x,
      y,
      duration: 1.2,
      ease: "power3.out",
      overwrite: "auto",
    });
  }

  return (
    <section
      ref={rootRef}
      className="relative min-h-[74vh] overflow-hidden bg-slate-950 text-white"
      onPointerMove={moveArtwork}
    >
      {slides.map((src, index) => (
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden="true"
          className={`hero-artwork absolute -inset-4 h-[calc(100%+32px)] w-[calc(100%+32px)] object-contain ${
            reduceMotion && index === 0 ? "opacity-45" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 to-slate-950/10" />
      <div className="container relative grid min-h-[74vh] content-center gap-8 py-20">
        <div data-hero-copy className="max-w-2xl">
          <p className="mb-4 font-black uppercase tracking-[0.18em] text-amber-300">Curated original artwork</p>
          <h1 className="text-5xl font-black leading-tight sm:text-6xl">Discover & Buy Original Art</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-100">
            Find paintings, digital pieces, sculptures, and mixed media work from emerging artists. Buy directly, track purchases, and support the maker behind each piece.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <motion.div whileHover={reduceMotion ? undefined : { y: -3 }} whileTap={{ scale: 0.98 }}>
              <Link className="btn btn-primary" href="/browse">Browse Artworks</Link>
            </motion.div>
            <motion.div whileHover={reduceMotion ? undefined : { y: -3 }} whileTap={{ scale: 0.98 }}>
              <Link className="btn btn-secondary" href="/register">Join ArtHub</Link>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 h-10 w-px -translate-x-1/2 overflow-hidden bg-white/25">
        <motion.span
          className="block h-1/2 w-full bg-amber-300"
          animate={reduceMotion ? undefined : { y: [-20, 40] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </section>
  );
}
