import Link from "next/link";
import { AppShell, CategoryLinks } from "@/components/AppShell";
import { ArtworkCard } from "@/components/ArtworkCard";
import { HomeHero } from "@/components/HomeHero";
import { Reveal, StaggerGrid, StaggerItem } from "@/components/Motion";
import { API_URL, assetFallback, fetchWithTimeout } from "@/lib/api";
/* eslint-disable @next/next/no-img-element */

async function getHomeData() {
  try {
    const [featuredRes, artistsRes] = await Promise.all([
      fetchWithTimeout(`${API_URL}/api/artworks/featured?limit=6`, { cache: "no-store" }, 3500),
      fetchWithTimeout(`${API_URL}/api/artworks/top-artists?limit=3`, { cache: "no-store" }, 3500),
    ]);
    const [featured, artists] = await Promise.all([featuredRes.json(), artistsRes.json()]);
    return { artworks: featured.items || [], artists: artists.items || [] };
  } catch {
    return { artworks: [], artists: [] };
  }
}

export default async function Home() {
  const { artworks, artists } = await getHomeData();

  return (
    <AppShell>
      <HomeHero />

      <section className="container py-14">
        <Reveal className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="font-bold uppercase tracking-[0.14em] text-teal-700">Fresh from artists</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">Featured Artworks</h2>
          </div>
          <Link className="font-black text-teal-800" href="/browse">View all</Link>
        </Reveal>
        {artworks.length ? (
          <StaggerGrid className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {artworks.map((artwork, index) => <ArtworkCard key={artwork._id} artwork={artwork} index={index} />)}
          </StaggerGrid>
        ) : (
          <StaggerGrid className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <StaggerItem key={index}>
                <div className="card overflow-hidden">
                  <img src={assetFallback(index)} alt="Sample artwork" className="aspect-[4/3] w-full object-cover object-[center_25%]" />
                  <div className="p-4">
                    <h3 className="font-black">Artwork collection</h3>
                    <p className="mt-1 text-sm text-slate-600">Connect the backend to load live art.</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        )}
      </section>

      <section className="border-y border-slate-200 bg-white py-14">
        <div className="container grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <p className="font-bold uppercase tracking-[0.14em] text-amber-700">Collector paths</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">Art Categories</h2>
            <p className="mt-3 text-slate-600">Jump into the medium that fits your space, style, or collection plan.</p>
          </Reveal>
          <Reveal delay={0.12}><CategoryLinks /></Reveal>
        </div>
      </section>

      <section className="container py-14">
        <Reveal><h2 className="text-3xl font-black text-slate-950">Top Artists</h2></Reveal>
        <StaggerGrid className="mt-6 grid gap-4 md:grid-cols-3">
          {(artists.length ? artists : [{ name: "New artists", sales: 0 }, { name: "Fresh voices", sales: 0 }, { name: "Studio picks", sales: 0 }]).map((artist, index) => (
            <StaggerItem key={artist.artistId || artist.name}>
              <div className="card flex items-center gap-4 p-5">
                <img src={artist.photoURL || assetFallback(index + 1)} alt={artist.name} className="h-16 w-16 rounded-full object-cover" />
                <div>
                  <h3 className="font-black text-slate-950">{artist.name}</h3>
                  <p className="text-sm text-slate-600">{artist.sales || 0} sale(s)</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>
    </AppShell>
  );
}
