"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const USER_ALLOWED = [
  "/", "/about", "/contact", "/products", "/products/", "/products/[id]", "/account/login", "/account/logout", "/account/signup", "/cart", "/orders"
];

export default function Header() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState(null);

  const computeCount = () => {
    try {
      const userRaw = localStorage.getItem("user");
      const userObj = userRaw ? JSON.parse(userRaw) : null;
      const cartKey = userObj && userObj.email ? `cart_${userObj.email}` : "cart";
      const raw = localStorage.getItem(cartKey);
      const cart = raw ? JSON.parse(raw) : [];
      const total = cart.reduce((s, i) => s + (i.qty || 1), 0);
      setCount(total);
    } catch (e) {
      setCount(0);
    }
  };

  const computeUser = () => {
    try {
      const raw = localStorage.getItem("user");
      const parsed = raw ? JSON.parse(raw) : null;
      setUser(parsed);
      console.log("[Header] Current user from localStorage:", parsed);
      // If user is null (logout), set cart count to 0
      if (!parsed) setCount(0);
    } catch {
      setUser(null);
      setCount(0);
      console.log("[Header] No valid user in localStorage");
    }
  };

  useEffect(() => {
    computeCount();
    computeUser();
    // Always log user info on render
    try {
      const raw = localStorage.getItem("user");
      const parsed = raw ? JSON.parse(raw) : null;
      console.log("[Header] User from localStorage:", parsed);
    } catch {
      console.log("[Header] No valid user in localStorage");
    }
    // update when localStorage changes in other tabs
    const onStorage = (e) => {
      if (e.key && e.key.startsWith("cart")) computeCount();
      if (e.key === "user") {
        computeUser();
        computeCount();
      }
    };
    // custom event from AddToCartButton
    const onCartUpdated = () => computeCount();
    // custom event for user login/logout
    const onUserChanged = () => {
      computeUser();
      computeCount();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("cartUpdated", onCartUpdated);
    window.addEventListener("userChanged", onUserChanged);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("cartUpdated", onCartUpdated);
      window.removeEventListener("userChanged", onUserChanged);
    };
  }, []);

  const handleLogout = () => {
    // Remove all cart keys (cart, cart_{email}) from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key === "cart" || key.startsWith("cart_")) {
        localStorage.removeItem(key);
      }
    });
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("userChanged"));
  };

  return (
    <header className="main-header">
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          {/* Logo */}
          <Link href="/" className="navbar-brand brand-logo">
            👩‍🦰 Women Hub
          </Link>
          {/* Mobile Toggle */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          {/* Navbar Menu */}
          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav ms-auto align-items-lg-center">
              {/* Home, About, Products, Contact always visible */}
              <li className="nav-item">
                <Link href="/" className="nav-link">Home</Link>
              </li>
              <li className="nav-item">
                <Link href="/about" className="nav-link">About</Link>
              </li>
              <li className="nav-item dropdown">
                <button className="nav-link dropdown-toggle btn btn-link" data-bs-toggle="dropdown">Products</button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" href="/products">All Products</Link>
                  </li>
                  {/* Only admin can see create/manage */}
                  {user && user.role === "admin" && (
                    <>
                      <li>
                        <Link className="dropdown-item" href="/products/create">Create Product</Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" href="/products/manage">Manage Products</Link>
                      </li>
                    </>
                  )}
                </ul>
              </li>
              {/* Categories - admin only */}
              {user && user.role === "admin" && (
                <li className="nav-item dropdown">
                  <button className="nav-link dropdown-toggle btn btn-link" data-bs-toggle="dropdown">Categories</button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" href="/categories">All Categories</Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" href="/categories/create">Create Category</Link>
                    </li>
                  </ul>
                </li>
              )}
              {/* Users - admin only */}
              {user && user.role === "admin" && (
                <li className="nav-item dropdown">
                  <button className="nav-link dropdown-toggle btn btn-link" data-bs-toggle="dropdown">Users</button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" href="/users">All Users</Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" href="/users/create">Create User</Link>
                    </li>
                  </ul>
                </li>
              )}
              {/* Orders - only logged in users */}
              {user && (
                <li className="nav-item">
                  <Link href="/orders" className="nav-link">Orders</Link>
                </li>
              )}
              {/* Cart - always visible */}
              <li className="nav-item">
                <Link href="/cart" className="nav-link position-relative">
                  🛒 Cart
                  {count > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {count}
                    </span>
                  )}
                </Link>
              </li>
              {/* Contact always visible */}
              <li className="nav-item ms-lg-2">
                <Link href="/contact" className="btn btn-dark rounded-pill px-3">Contact</Link>
              </li>
              {/* User Auth Buttons */}
              {user ? (
                <>
                  <li className="nav-item ms-lg-2">
                    <span className="nav-link fw-bold text-primary">👤 {user.name}</span>
                  </li>
                  <li className="nav-item ms-lg-2">
                    <button className="btn btn-outline-dark px-3" onClick={handleLogout}>Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item ms-lg-2">
                    <Link href="/account/login" className="btn btn-outline-dark px-3">Login</Link>
                  </li>
                  <li className="nav-item ms-lg-2">
                    <Link href="/account/signup" className="btn btn-dark px-3">Signup</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}