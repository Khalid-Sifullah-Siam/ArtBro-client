"use client";
/* eslint-disable react-hooks/set-state-in-effect, @next/next/no-img-element */

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/components/AuthProvider";
import { Notice } from "@/components/Notice";
import { apiFetch, assetFallback, dateLabel, money } from "@/lib/api";

export default function ArtworkDetailsPage() {
  return (
    <AppShell>
      <ArtworkDetailsContent />
    </AppShell>
  );
}

function ArtworkDetailsContent() {
  const { id } = useParams();
  const router = useRouter();
  const { token, user, ready } = useAuth();
  const [artwork, setArtwork] = useState(null);
  const [comments, setComments] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [comment, setComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState("");
  const [editingComment, setEditingComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiFetch(`/api/artworks/${id}`),
      apiFetch(`/api/artworks/${id}/comments`),
    ])
      .then(([artworkData, commentData]) => {
        setArtwork(artworkData.artwork);
        setComments(commentData.items || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!ready || !token || !user) {
      setPurchases([]);
      return;
    }
    apiFetch("/api/transactions/me/purchases", { token })
      .then((data) => setPurchases(data.items || []))
      .catch(() => setPurchases([]));
  }, [ready, token, user]);

  async function buyArtwork() {
    if (!user) return router.push("/login");
    setNotice("");
    try {
      const data = await apiFetch(`/api/payments/artworks/${id}/checkout`, { token, method: "POST" });
      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
    }
  }

  async function submitComment(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    try {
      const data = await apiFetch(`/api/artworks/${id}/comments`, { token, method: "POST", body: { comment } });
      setComments([data.comment, ...comments]);
      setComment("");
      setNotice("Comment posted.");
    } catch (err) {
      setError(err.message);
    }
  }

  function startEditComment(item) {
    setEditingCommentId(item._id);
    setEditingComment(item.comment || "");
  }

  async function updateComment(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    try {
      const data = await apiFetch(`/api/comments/${editingCommentId}`, {
        token,
        method: "PATCH",
        body: { comment: editingComment },
      });
      setComments(comments.map((item) => item._id === editingCommentId ? data.comment : item));
      setEditingCommentId("");
      setEditingComment("");
      setNotice("Comment updated.");
    } catch (err) {
      setError(err.message);
    }
  }

  async function removeArtwork() {
    if (!confirm("Delete this artwork?")) return;
    await apiFetch(`/api/artworks/${id}`, { token, method: "DELETE" });
    router.push("/dashboard");
  }

  async function removeComment(commentId) {
    await apiFetch(`/api/comments/${commentId}`, { token, method: "DELETE" });
    setComments(comments.filter((item) => item._id !== commentId));
  }

  const ownsArtwork = user && artwork && String(user._id) === String(artwork.artistId);
  const hasPurchased = purchases.some((item) => String(item.artworkId) === String(id));
  const canComment = Boolean(user && hasPurchased && !ownsArtwork);

  return (
      <section className="container py-10">
        {loading ? (
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="skeleton aspect-[4/3] rounded-lg" />
            <div className="skeleton min-h-96 rounded-lg" />
          </div>
        ) : error && !artwork ? (
          <Notice type="error">{error}</Notice>
        ) : artwork ? (
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <img src={artwork.imageUrl || assetFallback(1)} alt={artwork.title} className="max-h-[680px] w-full object-contain" />
            </div>
            <div className="grid content-start gap-5">
              {error && <Notice type="error">{error}</Notice>}
              {notice && <Notice>{notice}</Notice>}
              <div>
                <p className="font-bold uppercase tracking-[0.14em] text-teal-700">{artwork.category}</p>
                <h1 className="mt-2 text-4xl font-black text-slate-950">{artwork.title}</h1>
                <p className="mt-3 text-slate-600">By <Link className="font-black text-teal-800" href={`/browse?artistId=${artwork.artistId}`}>{artwork.artistName}</Link></p>
              </div>
              <p className="text-3xl font-black text-teal-800">{money(artwork.price)}</p>
              <p className="leading-8 text-slate-700">{artwork.description}</p>
              <p className="text-sm font-bold text-slate-500">Uploaded {dateLabel(artwork.createdAt)}</p>
              {ownsArtwork ? (
                <div className="flex flex-wrap gap-3">
                  <Link className="btn btn-secondary" href="/dashboard">Edit in dashboard</Link>
                  <button className="btn btn-danger" onClick={removeArtwork}>Delete</button>
                </div>
              ) : (
                <button className="btn btn-primary w-fit" onClick={buyArtwork} disabled={ownsArtwork}>Buy Now</button>
              )}

              <section className="card p-5">
                <h2 className="text-xl font-black text-slate-950">Comments</h2>
                {canComment ? (
                  <form onSubmit={submitComment} className="mt-4 grid gap-3">
                    <textarea className="field min-h-24" required value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Share your thoughts after purchase" />
                    <button className="btn btn-primary w-fit">Post Comment</button>
                  </form>
                ) : user ? (
                  <p className="mt-3 text-sm text-slate-600">Purchase this artwork to leave a comment.</p>
                ) : (
                  <p className="mt-3 text-sm text-slate-600">Login to comment after purchasing this artwork.</p>
                )}
                <div className="mt-5 grid gap-3">
                  {comments.length ? comments.map((item) => (
                    <div key={item._id} className="rounded-lg border border-slate-200 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-black text-slate-900">{item.userName}</p>
                        {user && (user.role === "admin" || String(user._id) === String(item.userId)) && (
                          <div className="flex gap-3">
                            {String(user._id) === String(item.userId) && (
                              <button className="text-sm font-black text-teal-800" onClick={() => startEditComment(item)}>Edit</button>
                            )}
                            <button className="text-sm font-black text-red-700" onClick={() => removeComment(item._id)}>Delete</button>
                          </div>
                        )}
                      </div>
                      {editingCommentId === item._id ? (
                        <form onSubmit={updateComment} className="mt-3 grid gap-2">
                          <textarea className="field min-h-20" required value={editingComment} onChange={(event) => setEditingComment(event.target.value)} />
                          <div className="flex gap-2">
                            <button className="btn btn-primary w-fit">Save</button>
                            <button className="btn btn-secondary w-fit" type="button" onClick={() => { setEditingCommentId(""); setEditingComment(""); }}>Cancel</button>
                          </div>
                        </form>
                      ) : (
                        <p className="mt-1 text-sm leading-6 text-slate-700">{item.comment}</p>
                      )}
                    </div>
                  )) : <p className="text-sm text-slate-600">No comments yet.</p>}
                </div>
              </section>
            </div>
          </div>
        ) : null}
      </section>
  );
}
