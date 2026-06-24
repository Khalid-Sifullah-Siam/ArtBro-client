import { API_URL, fetchWithTimeout } from "./api";

async function authRequest(path, body) {
  const response = await fetchWithTimeout(`${API_URL}/api/auth${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Authentication failed");
  }

  return data;
}

export function signInWithEmail(email, password) {
  return authRequest("/sign-in/email", { email, password });
}

export function signUpWithEmail(form) {
  return authRequest("/sign-up/email", {
    name: form.name,
    email: form.email,
    password: form.password,
    role: form.role,
    photoURL: "",
  });
}

export function signInWithGoogle(credential, role) {
  return authRequest("/sign-in/social", {
    provider: "google",
    idToken: {
      token: credential,
    },
    additionalData: {
      role,
    },
  });
}

export function signOut() {
  return authRequest("/sign-out");
}

export async function getCurrentSession() {
  const response = await fetchWithTimeout(`${API_URL}/api/auth/get-session`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) return null;
  return response.json();
}
