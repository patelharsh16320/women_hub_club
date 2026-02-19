"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 shadow">
      <Link href="/" className="text-xl font-bold">
        Women Hub
      </Link>

      <div className="flex gap-6">
        <Link href="/products">Products</Link>
        <Link href="/cart">Cart</Link>
        <Link href="/account">Account</Link>
      </div>
    </nav>
  );
}
