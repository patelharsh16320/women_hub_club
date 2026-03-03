"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      setUser(raw ? JSON.parse(raw) : null);
    } catch {
      setUser(null);
    }
    const onUserChange = () => {
      try {
        const raw = localStorage.getItem('user');
        setUser(raw ? JSON.parse(raw) : null);
      } catch { setUser(null); }
    };
    window.addEventListener('userChanged', onUserChange);
    return () => window.removeEventListener('userChanged', onUserChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('userChanged'));
    window.location.href = '/account/login';
  };

  return (
    <nav className="flex justify-between items-center p-4 shadow">
      <Link href="/" className="text-xl font-bold">
        Women Hub
      </Link>

      <div className="flex gap-6">
        <Link href="/products">Products</Link>
        <Link href="/cart">Cart</Link>
        <Link href="/account">Account</Link>
        {user ? (
          <button className="btn btn-outline-dark ml-2" onClick={handleLogout}>Logout</button>
        ) : (
          <Link href="/account/signup" className="btn btn-dark ml-2">Signup</Link>
        )}
      </div>
    </nav>
  );
}
