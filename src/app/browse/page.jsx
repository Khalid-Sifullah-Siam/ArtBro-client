"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ArtworkCard } from "@/components/ArtworkCard";
import { Notice } from "@/components/Notice";
import { StaggerGrid } from "@/components/Motion";
import { apiFetch, categories } from "@/lib/api";

export default function BrowsePage() {
  const params = useSearchParams();
  const [filters, setFilters] = useState({
    search: "",
    category: params.get("category") || "",
    artistId: params.get("artistId") || "",
    minPrice: "",
    maxPrice: "",
    sort: "newest",
    page: 1,
  });
  const [data, setData] = useState({ items: [], totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const query = useMemo(() => {
    const search = new URLSearchParams({ limit: "12", page: String(filters.page), sort: filters.sort });
    ["search", "category", "artistId", "minPrice", "maxPrice"].forEach((key) => {
      if (filters[key]) search.set(key, filters[key]);
    });
    return search.toString();
  }, [filters]);

  useEffect(() => {
    setLoading(true);
    setError("");
    apiFetch(`/api/artworks?${query}`)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [query]);

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value, page: key === "page" ? value : 1 }));
  }

  return (
    <AppShell>
      <section className="border-b border-slate-200 bg-white py-10">
        <div className="container">
          <h1 className="text-4xl font-black text-slate-950">Browse Artworks</h1>
          <p className="mt-3 max-w-2xl text-slate-600">Search by title or artist, filter by medium and price, then open any artwork for details.</p>
        </div>
      </section>

      <section className="container py-8">
        <div className="card grid gap-3 p-4 md:grid-cols-[1.3fr_1fr_1fr_1fr_1fr]">
          <input className="field" placeholder="Search title or artist" value={filters.search} onChange={(event) => updateFilter("search", event.target.value)} />
          <select className="field" value={filters.category} onChange={(event) => updateFilter("category", event.target.value)}>
            <option value="">All categories</option>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
          <input className="field" type="number" min="0" placeholder="Min price" value={filters.minPrice} onChange={(event) => updateFilter("minPrice", event.target.value)} />
          <input className="field" type="number" min="0" placeholder="Max price" value={filters.maxPrice} onChange={(event) => updateFilter("maxPrice", event.target.value)} />
          <select className="field" value={filters.sort} onChange={(event) => updateFilter("sort", event.target.value)}>
            <option value="newest">Newest</option>
            <option value="price-low">Price low-high</option>
            <option value="price-high">Price high-low</option>
            <option value="title">Title</option>
          </select>
        </div>

        {error && <div className="mt-5"><Notice type="error">{error}</Notice></div>}

        {loading ? (
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => <div key={index} className="skeleton aspect-[4/5] rounded-lg" />)}
          </div>
        ) : data.items.length ? (
          <>
            <p className="mt-6 text-sm font-bold text-slate-600">{data.total} artwork(s) found</p>
            <StaggerGrid key={query} className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {data.items.map((artwork, index) => <ArtworkCard key={artwork._id} artwork={artwork} index={index} />)}
            </StaggerGrid>
            <div className="mt-8 flex justify-center gap-2">
              <button className="btn btn-secondary" disabled={filters.page <= 1} onClick={() => updateFilter("page", filters.page - 1)}>Previous</button>
              <span className="grid min-h-10 place-items-center px-3 font-black">Page {filters.page} of {data.totalPages}</span>
              <button className="btn btn-secondary" disabled={filters.page >= data.totalPages} onClick={() => updateFilter("page", filters.page + 1)}>Next</button>
            </div>
          </>
        ) : (
          <div className="mt-8"><Notice>No artworks match those filters.</Notice></div>
        )}
      </section>
    </AppShell>
  );
}
