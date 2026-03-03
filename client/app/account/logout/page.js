"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userInfo");
    }
    // small delay to show message if needed
    const t = setTimeout(() => router.push("/"), 400);
    return () => clearTimeout(t);
  }, [router]);

return (
  <div className="logout-wrapper">
    <div className="logout-card">
      <div className="logout-icon">✓</div>
      <h2 className="logout-title">Signed Out</h2>
      <p className="logout-text">
        You have been successfully signed out.
      </p>
      <div className="logout-loader"></div>
      <p className="logout-redirect">Redirecting to homepage...</p>
    </div>
  </div>
);
}
