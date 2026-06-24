export function Notice({ type = "info", children }) {
  const tone = type === "error" ? "border-red-200 bg-red-50 text-red-800" : "border-teal-200 bg-teal-50 text-teal-900";
  return <div className={`rounded-lg border px-4 py-3 text-sm font-bold ${tone}`}>{children}</div>;
}
