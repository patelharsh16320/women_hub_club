"use client";

import { useEffect } from "react";
import { toastMessage } from "../../../utils/toastMessage";
import { useRouter } from "next/navigation";
import { Navigate } from "react-router-dom";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("userChanged"));
    }
  toastMessage.success("Logout successful!");
     const t = setTimeout(() => {
       window.location.href = "http://localhost:3000/account/login";
     }, 400);
  //   return () => clearTimeout(t);
    return <Navigate to="/login" replace />;
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
