"use client";
/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps, @next/next/no-img-element */


import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/components/AuthProvider";
import { Notice } from "@/components/Notice";
import { apiFetch, assetFallback, categories, dateLabel, money, uploadImage } from "@/lib/api";

export default function DashboardPage() {
  return (
    <AppShell>
      <DashboardContent />
    </AppShell>
  );
}

export function DashboardContent({ initialTab = "overview", requiredRole = "" } = {}) {
  const router = useRouter();
  const { token, user, ready, setUser } = useAuth();
  const [tab, setTab] = useState(initialTab);
  const [state, setState] = useState({ purchases: [], sales: [], artworks: [], users: [], transactions: [], analytics: null });
  const [artworkForm, setArtworkForm] = useState({ title: "", description: "", price: "", category: "Painting", imageUrl: "", featured: false });
  const [editingArtwork, setEditingArtwork] = useState(null);
  const [profile, setProfile] = useState({ name: "", photoURL: "", bio: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const availableTabs = user
    ? ["overview", "profile", "purchases", ...(user.role !== "user" ? ["artworks", "sales"] : []), ...(user.role === "admin" ? ["admin"] : [])]
    : [];

  useEffect(() => {
    if (user) setProfile({ name: user.name || "", photoURL: user.photoURL || "", bio: user.bio || "" });
  }, [user]);

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (requiredRole && user.role !== requiredRole) {
      router.replace(`/dashboard/${user.role}`);
    }
  }, [ready, user, requiredRole, router]);

  useEffect(() => {
    if (!token || !user) return;
    refresh();
  }, [token, user?.role]);

  useEffect(() => {
    if (user && availableTabs.length && !availableTabs.includes(tab)) setTab("overview");
  }, [user?.role, tab]);

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const calls = [apiFetch("/api/transactions/me/purchases", { token })];
      if (user.role === "artist") calls.push(apiFetch(`/api/artworks?artistId=${user._id}&limit=50`, { token }));
      if (user.role === "admin") calls.push(apiFetch("/api/artworks?limit=50", { token }));
      if (user.role === "artist" || user.role === "admin") calls.push(apiFetch("/api/transactions/me/sales", { token }));
      if (user.role === "admin") calls.push(apiFetch("/api/users?limit=50", { token }));
      if (user.role === "admin") calls.push(apiFetch("/api/transactions?limit=50", { token }));
      if (user.role === "admin") calls.push(apiFetch("/api/admin/analytics", { token }));
      const result = await Promise.all(calls);
      let index = 0;
      const next = { purchases: result[index++].items || [], sales: [], artworks: [], users: [], transactions: [], analytics: null };
      if (user.role === "artist" || user.role === "admin") next.artworks = result[index++].items || [];
      if (user.role === "artist" || user.role === "admin") next.sales = result[index++].items || [];
      if (user.role === "admin") next.users = result[index++].items || [];
      if (user.role === "admin") next.transactions = result[index++].items || [];
      if (user.role === "admin") next.analytics = result[index++];
      setState(next);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function addArtwork(event) {
    event.preventDefault();
    setNotice("");
    setError("");
    try {
      if (editingArtwork) {
        await apiFetch(`/api/artworks/${editingArtwork._id}`, { token, method: "PUT", body: artworkForm });
      } else {
        await apiFetch("/api/artworks", { token, method: "POST", body: artworkForm });
      }
      setArtworkForm({ title: "", description: "", price: "", category: "Painting", imageUrl: "", featured: false });
      setEditingArtwork(null);
      setNotice(editingArtwork ? "Artwork updated." : "Artwork added.");
      refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteArtwork(id) {
    if (!confirm("Delete artwork?")) return;
    await apiFetch(`/api/artworks/${id}`, { token, method: "DELETE" });
    refresh();
  }

  function startEditArtwork(artwork) {
    setEditingArtwork(artwork);
    setArtworkForm({
      title: artwork.title || "",
      description: artwork.description || "",
      price: artwork.price || "",
      category: artwork.category || "Painting",
      imageUrl: artwork.imageUrl || "",
      featured: Boolean(artwork.featured),
    });
    setTab("artworks");
  }

  async function toggleFeatured(artwork) {
    await apiFetch(`/api/artworks/${artwork._id}`, {
      token,
      method: "PUT",
      body: {
        title: artwork.title,
        description: artwork.description,
        price: artwork.price,
        category: artwork.category,
        imageUrl: artwork.imageUrl,
        featured: !artwork.featured,
      },
    });
    refresh();
  }

  async function updateRole(id, role) {
    await apiFetch(`/api/users/${id}/role`, { token, method: "PATCH", body: { role } });
    refresh();
  }

  async function saveProfile(event) {
    event.preventDefault();
    const data = await apiFetch("/api/users/me", { token, method: "PATCH", body: profile });
    setUser(data.user);
    localStorage.setItem("arthub_user", JSON.stringify(data.user));
    setNotice("Profile updated.");
  }

  async function changePassword(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    try {
      await apiFetch("/api/users/me/password", { token, method: "PATCH", body: passwordForm });
      setPasswordForm({ currentPassword: "", newPassword: "" });
      setNotice("Password changed.");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleImageUpload(event, target) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    setNotice("Uploading image...");
    try {
      const url = await uploadImage(file);
      if (target === "profile") setProfile((current) => ({ ...current, photoURL: url }));
      if (target === "artwork") setArtworkForm((current) => ({ ...current, imageUrl: url }));
      setNotice("Image uploaded.");
    } catch (err) {
      setError(err.message);
      setNotice("");
    }
  }

  async function subscribe(tier) {
    try {
      const data = await apiFetch(`/api/payments/subscriptions/${tier}/checkout`, { token, method: "POST" });
      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
    }
  }

  if (!ready) {
    return <section className="container py-12"><div className="skeleton h-80 rounded-lg" /></section>;
  }

  if (!user) {
    return (
      <section className="container py-12">
        <div className="skeleton h-80 rounded-lg" />
      </section>
    );
  }

  if (requiredRole && user.role !== requiredRole) {
    return <section className="container py-12"><div className="skeleton h-80 rounded-lg" /></section>;
  }

  return (
    <>
      <section className="border-b border-slate-200 bg-white py-8">
        <div className="container flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-bold uppercase tracking-[0.14em] text-teal-700">{user.role} dashboard</p>
            <h1 className="mt-2 text-4xl font-black text-slate-950">Welcome, {user.name}</h1>
          </div>
          <button className="btn btn-secondary" onClick={refresh}>{loading ? "Refreshing..." : "Refresh"}</button>
        </div>
      </section>

      <section className="container py-8">
        <div className="mb-5 flex gap-2 overflow-auto">
          {availableTabs.map((item) => (
            <button key={item} className={`btn ${tab === item ? "btn-primary" : "btn-secondary"}`} onClick={() => setTab(item)}>{item}</button>
          ))}
        </div>
        {notice && <div className="mb-4"><Notice>{notice}</Notice></div>}
        {error && <div className="mb-4"><Notice type="error">{error}</Notice></div>}

        {tab === "overview" && (
          <div className="grid gap-4 md:grid-cols-3">
            <Stat label="Subscription" value={user.subscriptionTier || "free"} />
            <Stat label="Purchases" value={state.purchases.length} />
            <Stat label="Sales" value={state.sales.length} />
            {user.role === "user" && (
              <div className="card grid gap-3 p-5 md:col-span-3">
                <h2 className="text-xl font-black">Subscription Tier Overview</h2>
                <div className="grid gap-3 md:grid-cols-3">
                  <Tier title="Free" limit="3 paintings" price="$0" />
                  <Tier title="Pro" limit="9 paintings" price="$9.99" onClick={() => subscribe("pro")} />
                  <Tier title="Premium" limit="Unlimited" price="$19.99" onClick={() => subscribe("premium")} />
                </div>
              </div>
            )}
            {state.analytics && (
              <>
                <div className="grid gap-4 md:col-span-3 md:grid-cols-4">
                  <Stat label="Total users" value={state.analytics.totals.users} />
                  <Stat label="Artists" value={state.analytics.totals.artists} />
                  <Stat label="Sold" value={state.analytics.totals.artworksSold} />
                  <Stat label="Revenue" value={money(state.analytics.totals.revenue)} />
                </div>
                <AnalyticsCharts analytics={state.analytics} />
              </>
            )}
          </div>
        )}

        {tab === "profile" && (
          <div className="grid gap-5 lg:grid-cols-2">
            <form onSubmit={saveProfile} className="card grid gap-4 p-5">
              <h2 className="text-xl font-black">Profile Management</h2>
              <label className="label">Name<input className="field" value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} /></label>
              <label className="label">Profile picture<input className="field" type="file" accept="image/*" onChange={(event) => handleImageUpload(event, "profile")} /></label>
              <label className="label">Photo URL<input className="field" value={profile.photoURL} onChange={(event) => setProfile({ ...profile, photoURL: event.target.value })} /></label>
              <label className="label">Bio<textarea className="field min-h-28" value={profile.bio} onChange={(event) => setProfile({ ...profile, bio: event.target.value })} /></label>
              <button className="btn btn-primary w-fit">Save Profile</button>
            </form>
            <form onSubmit={changePassword} className="card grid content-start gap-4 p-5">
              <h2 className="text-xl font-black">Change Password</h2>
              <label className="label">Current password<input className="field" type="password" value={passwordForm.currentPassword} onChange={(event) => setPasswordForm({ ...passwordForm, currentPassword: event.target.value })} /></label>
              <label className="label">New password<input className="field" type="password" value={passwordForm.newPassword} onChange={(event) => setPasswordForm({ ...passwordForm, newPassword: event.target.value })} /></label>
              <button className="btn btn-primary w-fit">Change Password</button>
            </form>
          </div>
        )}

        {tab === "purchases" && (
          <div className="grid gap-5">
            <TransactionTable title="Purchase History" items={state.purchases} mode="purchase" />
            <div className="card p-5">
              <h2 className="mb-4 text-xl font-black">Bought Artworks</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {state.purchases.length ? state.purchases.map((item, index) => (
                  <Link key={item._id} className="overflow-hidden rounded-lg border border-slate-200" href={`/artworks/${item.artworkId}`}>
                    <img src={item.artworkImage || assetFallback(index)} alt={item.artworkTitle} className="aspect-[4/3] w-full object-cover" />
                    <p className="p-3 font-black text-slate-900">{item.artworkTitle}</p>
                  </Link>
                )) : <p className="text-slate-600">No bought artworks yet.</p>}
              </div>
            </div>
          </div>
        )}

        {tab === "artworks" && (
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <form onSubmit={addArtwork} className="card grid gap-4 p-5">
              <h2 className="text-xl font-black">{editingArtwork ? "Edit Artwork" : "Add Artwork"}</h2>
              <label className="label">Title<input className="field" required value={artworkForm.title} onChange={(event) => setArtworkForm({ ...artworkForm, title: event.target.value })} /></label>
              <label className="label">Description<textarea className="field min-h-24" required value={artworkForm.description} onChange={(event) => setArtworkForm({ ...artworkForm, description: event.target.value })} /></label>
              <label className="label">Price<input className="field" required type="number" min="1" value={artworkForm.price} onChange={(event) => setArtworkForm({ ...artworkForm, price: event.target.value })} /></label>
              <label className="label">Category<select className="field" value={artworkForm.category} onChange={(event) => setArtworkForm({ ...artworkForm, category: event.target.value })}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
              <label className="label">Upload image<input className="field" type="file" accept="image/*" onChange={(event) => handleImageUpload(event, "artwork")} /></label>
              <label className="label">Image URL<input className="field" required value={artworkForm.imageUrl} onChange={(event) => setArtworkForm({ ...artworkForm, imageUrl: event.target.value })} /></label>
              {user.role === "admin" && (
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                  <input type="checkbox" checked={artworkForm.featured} onChange={(event) => setArtworkForm({ ...artworkForm, featured: event.target.checked })} />
                  Featured artwork
                </label>
              )}
              <div className="flex gap-2">
                <button className="btn btn-primary">{editingArtwork ? "Update Artwork" : "Add Artwork"}</button>
                {editingArtwork && <button className="btn btn-secondary" type="button" onClick={() => { setEditingArtwork(null); setArtworkForm({ title: "", description: "", price: "", category: "Painting", imageUrl: "", featured: false }); }}>Cancel</button>}
              </div>
            </form>
            <div className="card overflow-auto p-5">
              <h2 className="mb-4 text-xl font-black">Manage Artworks</h2>
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead><tr className="border-b"><th className="py-3">Title</th><th>Artist</th><th>Price</th><th>Actions</th></tr></thead>
                <tbody>{state.artworks.map((art) => <tr className="border-b" key={art._id}><td className="py-3"><Link className="font-black text-teal-800" href={`/artworks/${art._id}`}>{art.title}</Link></td><td>{art.artistName}</td><td>{money(art.price)}</td><td className="flex gap-3 py-3"><button className="font-black text-teal-800" onClick={() => startEditArtwork(art)}>Edit</button><button className="font-black text-red-700" onClick={() => deleteArtwork(art._id)}>Delete</button></td></tr>)}</tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "sales" && <TransactionTable title="Sales History" items={state.sales} mode="sale" />}

        {tab === "admin" && (
          <div className="grid gap-5">
            {state.analytics && <AnalyticsCharts analytics={state.analytics} />}
            <div className="card overflow-auto p-5">
              <h2 className="mb-4 text-xl font-black">Manage Users</h2>
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead><tr className="border-b"><th className="py-3">Name</th><th>Email</th><th>Role</th><th>Change role</th></tr></thead>
                <tbody>{state.users.map((item) => <tr className="border-b" key={item._id}><td className="py-3">{item.name}</td><td>{item.email}</td><td>{item.role}</td><td><select className="field max-w-36" value={item.role} onChange={(event) => updateRole(item._id, event.target.value)}><option>user</option><option>artist</option><option>admin</option></select></td></tr>)}</tbody>
              </table>
            </div>
            <ArtworkManagementTable artworks={state.artworks} onEdit={startEditArtwork} onDelete={deleteArtwork} onToggleFeatured={toggleFeatured} admin />
            <TransactionTable title="All Transactions" items={state.transactions} mode="admin" />
          </div>
        )}
      </section>
    </>
  );
}

function Stat({ label, value }) {
  return <div className="card p-5"><p className="text-sm font-bold uppercase tracking-[0.12em] text-slate-500">{label}</p><p className="mt-2 text-3xl font-black text-slate-950">{value}</p></div>;
}

function Tier({ title, limit, price, onClick }) {
  return <div className="rounded-lg border border-slate-200 p-4"><h3 className="font-black">{title}</h3><p className="mt-1 text-sm text-slate-600">{limit}</p><p className="mt-3 text-2xl font-black">{price}</p>{onClick && <button className="btn btn-primary mt-4 w-full" onClick={onClick}>Upgrade</button>}</div>;
}

function ArtworkManagementTable({ artworks, onEdit, onDelete, onToggleFeatured, admin = false }) {
  return (
    <div className="card overflow-auto p-5">
      <h2 className="mb-4 text-xl font-black">{admin ? "Manage All Artworks" : "Manage Artworks"}</h2>
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead><tr className="border-b"><th className="py-3">Title</th><th>Artist</th><th>Price</th>{admin && <th>Featured</th>}<th>Actions</th></tr></thead>
        <tbody>
          {artworks.length ? artworks.map((art) => (
            <tr className="border-b" key={art._id}>
              <td className="py-3"><Link className="font-black text-teal-800" href={`/artworks/${art._id}`}>{art.title}</Link></td>
              <td>{art.artistName}</td>
              <td>{money(art.price)}</td>
              {admin && <td>{art.featured ? "Yes" : "No"}</td>}
              <td className="flex gap-3 py-3">
                <button className="font-black text-teal-800" onClick={() => onEdit(art)}>Edit</button>
                {admin && <button className="font-black text-amber-700" onClick={() => onToggleFeatured(art)}>{art.featured ? "Unfeature" : "Feature"}</button>}
                <button className="font-black text-red-700" onClick={() => onDelete(art._id)}>Delete</button>
              </td>
            </tr>
          )) : <tr><td className="py-4 text-slate-600" colSpan="4">No artworks yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function AnalyticsCharts({ analytics }) {
  const monthly = analytics?.charts?.monthlySales || [];
  const categoriesData = analytics?.charts?.salesByCategory || [];
  const maxRevenue = Math.max(...monthly.map((item) => item.revenue || 0), 1);
  const totalCategory = categoriesData.reduce((sum, item) => sum + Number(item.value || 0), 0);
  let offset = 0;
  const pieStops = categoriesData.length && totalCategory > 0
    ? categoriesData.map((item, index) => {
      const start = offset;
      offset += (Number(item.value || 0) / totalCategory) * 100;
      const color = ["#0f766e", "#d97706", "#2563eb", "#be123c", "#7c3aed", "#475569"][index % 6];
      return `${color} ${start}% ${offset}%`;
    }).join(", ")
    : "#e2e8f0 0% 100%";

  return (
    <div className="grid gap-4 md:col-span-3 lg:grid-cols-2">
      <div className="card p-5">
        <h2 className="text-xl font-black">Sales Chart</h2>
        <div className="mt-5 flex h-56 items-end gap-3 border-b border-l border-slate-200 px-3 pb-3">
          {monthly.length ? monthly.map((item) => (
            <div key={item.month} className="grid flex-1 content-end gap-2 text-center">
              <div className="rounded-t bg-teal-700" style={{ height: `${Math.max(10, ((item.revenue || 0) / maxRevenue) * 180)}px` }} />
              <span className="text-xs font-bold text-slate-500">{item.month}</span>
            </div>
          )) : <p className="self-center text-sm text-slate-600">No sales data yet.</p>}
        </div>
      </div>
      <div className="card p-5">
        <h2 className="text-xl font-black">Artworks by Category</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-[180px_1fr]">
          <div className="aspect-square rounded-full" style={{ background: `conic-gradient(${pieStops})` }} />
          <div className="grid content-center gap-2">
            {categoriesData.length ? categoriesData.map((item, index) => (
              <div key={item.category} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 font-bold text-slate-700">
                  <span className="h-3 w-3 rounded-full" style={{ background: ["#0f766e", "#d97706", "#2563eb", "#be123c", "#7c3aed", "#475569"][index % 6] }} />
                  {item.category}
                </span>
                <span>{item.value}</span>
              </div>
            )) : <p className="text-sm text-slate-600">No category sales yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function TransactionTable({ title, items, mode }) {
  if (mode === "admin") {
    return (
      <div className="card overflow-auto p-5">
        <h2 className="mb-4 text-xl font-black">{title}</h2>
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead><tr className="border-b"><th className="py-3">Transaction ID</th><th>Type</th><th>User / Artist</th><th>Amount</th><th>Date</th></tr></thead>
          <tbody>
            {items.length ? items.map((item) => (
              <tr className="border-b" key={item._id}>
                <td className="py-3 font-mono text-xs">{String(item._id).slice(-10)}</td>
                <td className="font-bold capitalize">{item.type}</td>
                <td>{item.userEmail || item.buyerEmail || item.artistEmail}</td>
                <td>{money(item.amount)}</td>
                <td>{dateLabel(item.createdAt)}</td>
              </tr>
            )) : <tr><td className="py-4 text-slate-600" colSpan="5">No records yet.</td></tr>}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="card overflow-auto p-5">
      <h2 className="mb-4 text-xl font-black">{title}</h2>
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead><tr className="border-b"><th className="py-3">Artwork / Type</th><th>{mode === "sale" ? "Buyer" : "Artist / User"}</th><th>Amount</th><th>Date</th></tr></thead>
        <tbody>
          {items.length ? items.map((item) => (
            <tr className="border-b" key={item._id}>
              <td className="py-3">{item.artworkTitle || item.type}</td>
              <td>{mode === "sale" ? item.buyerName : item.artistName || item.userEmail || item.buyerEmail}</td>
              <td>{money(item.amount)}</td>
              <td>{dateLabel(item.createdAt)}</td>
            </tr>
          )) : <tr><td className="py-4 text-slate-600" colSpan="4">No records yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
