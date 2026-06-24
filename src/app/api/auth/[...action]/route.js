import { cookies } from "next/headers";

const BACKEND_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const TOKEN_COOKIE = "arthub_token";
const USER_COOKIE = "arthub_user";

function cookieOptions({ expires } = {}) {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(expires ? { expires } : {}),
  };
}

function userCookieOptions({ expires } = {}) {
  return {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(expires ? { expires } : {}),
  };
}

function getAction(request) {
  const path = new URL(request.url).pathname;
  const marker = "/api/auth/";
  const index = path.indexOf(marker);
  if (index === -1) return "";
  return path.slice(index + marker.length).replace(/^\/+|\/+$/g, "");
}

async function callBackend(path, { method = "GET", token, body } = {}) {
  const response = await fetch(`${BACKEND_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const error = new Error(data.message || "Authentication request failed");
    error.status = response.status;
    throw error;
  }

  return data;
}

async function setAuthCookies({ token, user }) {
  const jar = await cookies();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  jar.set(TOKEN_COOKIE, token, cookieOptions({ expires: expiresAt }));
  jar.set(USER_COOKIE, JSON.stringify(user || {}), userCookieOptions({ expires: expiresAt }));
}

async function clearAuthCookies() {
  const jar = await cookies();
  const expiresAt = new Date(0);
  jar.set(TOKEN_COOKIE, "", cookieOptions({ expires: expiresAt }));
  jar.set(USER_COOKIE, "", userCookieOptions({ expires: expiresAt }));
}

function authResponse(payload, status = 200) {
  return Response.json(payload, { status });
}

function toSessionPayload(token, user) {
  if (!token || !user) {
    return { token: "", user: null, session: null };
  }
  return {
    token,
    user,
    session: {
      token,
      userId: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  };
}

export async function POST(request) {
  const action = getAction(request);

  try {
    if (["login", "register", "google"].includes(action)) {
      const body = await request.json();
      const data = await callBackend(`/api/auth/${action}`, { method: "POST", body });
      await setAuthCookies({ token: data.token, user: data.user });
      return authResponse({ user: data.user, session: toSessionPayload(data.token, data.user).session });
    }

    if (action === "sign-in/email") {
      const body = await request.json();
      const data = await callBackend("/api/auth/login", {
        method: "POST",
        body: {
          email: body.email,
          password: body.password,
        },
      });
      await setAuthCookies({ token: data.token, user: data.user });
      return authResponse(toSessionPayload(data.token, data.user));
    }

    if (action === "sign-up/email") {
      const body = await request.json();
      const data = await callBackend("/api/auth/register", {
        method: "POST",
        body: {
          name: body.name,
          email: body.email,
          password: body.password,
          confirmPassword: body.password,
          role: body.role || "user",
          photoURL: body.image || "",
        },
      });
      await setAuthCookies({ token: data.token, user: data.user });
      return authResponse(toSessionPayload(data.token, data.user));
    }

    if (action === "logout" || action === "sign-out") {
      await clearAuthCookies();
      return authResponse({ ok: true, success: true });
    }

    return authResponse({ message: "Not found" }, 404);
  } catch (error) {
    return authResponse({ message: error.message || "Authentication failed" }, error.status || 500);
  }
}

export async function GET(request) {
  const action = getAction(request);

  try {
    if (!["session", "me", "get-session"].includes(action)) {
      return authResponse({ message: "Not found" }, 404);
    }

    const jar = await cookies();
    const token = jar.get(TOKEN_COOKIE)?.value || "";
    const cachedUser = jar.get(USER_COOKIE)?.value || "";

    if (!token) {
      return authResponse(toSessionPayload("", null));
    }

    const data = await callBackend("/api/auth/me", { token });
    await setAuthCookies({ token, user: data.user });
    const user = data.user || (cachedUser ? JSON.parse(cachedUser) : null);

    return authResponse(toSessionPayload(token, user));
  } catch (_error) {
    await clearAuthCookies();
    return authResponse(toSessionPayload("", null), 401);
  }
}
