export default function Loading() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50">
      <div className="grid justify-items-center gap-4">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-slate-200 border-t-teal-700" />
        <p className="font-black text-teal-800">Loading ArtHub</p>
      </div>
    </div>
  );
}
