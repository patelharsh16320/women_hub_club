"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: "bi-speedometer2" },
  { href: "/admin/products/manage", label: "All Products", icon: "bi-gear" },
  { href: "/admin/products/create", label: "Create Product", icon: "bi-plus-square" },  
  { href: "/admin/categories", label: "Categories", icon: "bi-tags" },
  { href: "/admin/categories/create", label: "Create Category", icon: "bi-tag" },
  { href: "/admin/users", label: "Users", icon: "bi-people" },
  { href: "/admin/users/create", label: "Create User", icon: "bi-person-plus" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="admin-layout d-flex">
      <aside className="admin-sidebar">
        <ul className="nav flex-column">
          {adminLinks.map((l) => (
            <li key={l.href} className="nav-item">
              <Link
                href={l.href}
                className={`nav-link ${pathname === l.href ? "active" : ""}`}
              >
                <i className={`bi ${l.icon}`}></i>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      <div className="admin-main">
        {/*  <header className="admin-topbar">
          <h5>Admin Dashboard</h5>
        </header> */}

        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}