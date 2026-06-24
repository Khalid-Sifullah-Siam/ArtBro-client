export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
export const REQUEST_TIMEOUT_MS = 6000;

export function assetFallback(index = 0) {
  const images = [
    "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80",
  ];
  return images[index % images.length];
}

export async function fetchWithTimeout(url, options = {}, timeoutMs = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal, credentials: "include" });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("The server is taking too long to respond. Please try again.");
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export async function apiFetch(path, { token, method = "GET", body, headers = {}, timeoutMs } = {}) {
  const response = await fetchWithTimeout(
    `${API_URL}${path}`,
    {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    },
    timeoutMs
  );

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

export async function uploadImage(file) {
  const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!key) {
    throw new Error("NEXT_PUBLIC_IMGBB_API_KEY is missing.");
  }

  const form = new FormData();
  form.append("image", file);
  const response = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
    method: "POST",
    body: form,
  });
  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error?.message || "Image upload failed");
  }
  return data.data.url;
}

export function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));
}

export function dateLabel(value) {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export const categories = ["Painting", "Digital", "Sculpture", "Photography", "Illustration", "Mixed Media"];
