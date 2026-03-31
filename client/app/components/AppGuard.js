"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Only admin can access all pages. Normal user and logout user can only access these pages:
const USER_ALLOWED = [
  "/", "/about", "/contact", "/products", "/products/", "/products/[id]", "/account/login", "/account/logout", "/account/signup", "/cart", "/orders", "/orders/[id]","/checkout","/invoices","invoices/[id]"
];

const EDITOR_ALLOWED = [
  "/", "/about"
];

const AUTHOR_ALLOWED = [
  "/", "/cart", "/contact", "/products"
];

export default function AppGuard({ children }) {
  const pathname = usePathname();
  useEffect(() => {
    const raw = localStorage.getItem("user");
    const user = raw ? JSON.parse(raw) : null;

    // Admin can access all pages
    if (user && user.role && user.role === "admin") {
      return;
    }

    // Editor access
    if (user && user.role && user.role === "editor") {
      const allowed = EDITOR_ALLOWED.some((p) => pathname === p || pathname.startsWith(p + "/"));
      if (!allowed) {
        window.location.href = "/";
      }
      return;
    }

    // Author access
    if (user && user.role && user.role === "author") {
      const allowed = AUTHOR_ALLOWED.some((p) => pathname === p || pathname.startsWith(p + "/"));
      if (!allowed) {
        window.location.href = "/";
      }
      return;
    }

    // User or not logged in
    const allowed = USER_ALLOWED.some((p) => pathname === p || pathname.startsWith(p + "/"));
    if (!allowed) {
      window.location.href = "/";
    }
  }, [pathname]);
  return children;
}
