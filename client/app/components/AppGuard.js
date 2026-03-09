"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Only admin can access all pages. Normal user and logout user can only access these pages:
const USER_ALLOWED = [
  "/", "/about", "/contact", "/products", "/products/", "/products/[id]", "/account/login", "/account/logout", "/account/signup", "/cart", "/orders", "/orders/[id]","/checkout","/invoices","invoices/[id]"
];

export default function AppGuard({ children }) {
  const pathname = usePathname();
  useEffect(() => {
    const raw = localStorage.getItem("user");
    const user = raw ? JSON.parse(raw) : null;
    // Admin can access only /admin/* paths
    if (user && user.role === "admin") {
      if (!pathname.startsWith("/admin")) {
        window.location.href = "/admin/products";
        return;
      }
      return;
    }
    // Normal user can only access allowed pages
    const allowed = USER_ALLOWED.some((p) => pathname === p || pathname.startsWith(p + "/"));
    if (!allowed) {
      window.location.href = "/";
    }
  }, [pathname]);
  return children;
}
