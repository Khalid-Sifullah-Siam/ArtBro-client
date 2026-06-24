"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { Notice } from "./Notice";

export function GoogleButton({ role = "user" }) {
  const router = useRouter();
  const { googleLogin } = useAuth();
  const buttonRef = useRef(null);
  const [error, setError] = useState("");
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId || !buttonRef.current) return;

    function handleCredential(response) {
      googleLogin({
        credential: response.credential,
        role,
      }).then((user) => {
        if (user.role === "user") {
          router.push("/");
        } else {
          router.push(`/dashboard/${user.role}`);
        }
      }).catch((err) => setError(err.message));
    }

    function renderButton() {
      window.google.accounts.id.initialize({ client_id: clientId, callback: handleCredential });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        text: "signin_with",
        width: 320,
      });
    }

    if (window.google?.accounts?.id) {
      renderButton();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client?hl=en";
    script.async = true;
    script.defer = true;
    script.onload = renderButton;
    script.onerror = () => setError("Google login script failed to load.");
    document.head.appendChild(script);
  }, [clientId, googleLogin, role, router]);

  if (!clientId) {
    return <Notice>NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured yet.</Notice>;
  }

  return (
    <div className="grid justify-items-center gap-3">
      <div ref={buttonRef} />
      {error && <Notice type="error">{error}</Notice>}
    </div>
  );
}
