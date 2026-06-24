"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { assetFallback, money } from "@/lib/api";
/* eslint-disable @next/next/no-img-element */

export function ArtworkCard({ artwork, index = 0 }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="h-full"
      variants={{
        hidden: { opacity: 0, y: 22 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
      }}
      whileHover={reduceMotion ? undefined : { y: -7 }}
      whileTap={reduceMotion ? undefined : { scale: 0.985 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <Link href={`/artworks/${artwork._id}`} className="card group block h-full overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <div className="aspect-[4/3] overflow-hidden bg-slate-200">
        <img
          src={artwork.imageUrl || assetFallback(index)}
          alt={artwork.title}
          className="h-full w-full object-cover object-[center_25%] transition duration-500 ease-out group-hover:scale-105"
        />
      </div>
      <div className="grid gap-2 p-4">
        <h3 className="line-clamp-2 min-h-12 text-base font-black text-slate-950">{artwork.title}</h3>
        <p className="truncate text-sm text-slate-600">{artwork.artistName || "Independent artist"}</p>
        <p className="font-black text-teal-800">{money(artwork.price)}</p>
      </div>
      </Link>
    </motion.div>
  );
}
