"use client";

import Link from "next/link";

const adminLinks = [
  { href: "/admin", label: "Admin Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/products/create", label: "Create Product" },
  { href: "/admin/products/manage", label: "Manage Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/categories/create", label: "Create Category" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/users/create", label: "Create User" },
];

export default function AdminLayout({ children }) {
  return (
    <div className="admin-dashboard d-flex" style={{ minHeight: "100vh" }}>
      {/* Sticky Sidebar */}
      <aside
        className="sidebar bg-light p-4"
        style={{ minWidth: 220, position: "sticky", top: 0, height: "100vh" }}
      >
        {/* <h3 className="fw-bold mb-4">Admin Menu</h3> */}
        <ul className="nav flex-column">
          {adminLinks.map((l) => (
            <li key={l.href} className="nav-item mb-2">
              <Link href={l.href} className="nav-link">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      {/* Main Content */}
      <main className="flex-grow-1 p-5">{children}</main>
    </div>
  );
}
