"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navigate } from "react-router-dom";

const USER_ALLOWED = [
  "/", "/about", "/contact", "/products", "/products/", "/products/[id]", "/account/login", "/account/logout", "/account/signup", "/cart", "/orders"
];
const ADMIN_ALLOWED = [
  "/admin/*", "/admin/products/create", "/admin/products/manage", "/admin/products/[id]", "/admin/categories", "/admin/categories/create", "/admin/categories/[id]/edit", "/admin/users", "/admin/users/[id]"];

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
    // return <Navigate to="/login" replace />;
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
                  {/* Admin: show only /admin links */}
                  {user && user.role === "admin" ? (
                    <>
                      {/* Dashboard Link */}
                      <li className="nav-item">
                        <Link href="/admin/" className="nav-link">
                          Dashboard
                        </Link>
                      </li>

                      {/* Products Link */}
                      <li className="nav-item">
                        <Link href="/products/" className="nav-link">
                          Products
                        </Link>
                      </li>

                      {/* Categories Dropdown */}
                  {/* <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                    >
                      Categories
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <Link href="/admin/categories/create" className="dropdown-item">
                          Create Category
                        </Link>
                      </li>
                      <li>
                        <Link href="/admin/categories/parent" className="dropdown-item">
                          Create Parent Category
                        </Link>
                      </li>
                      <li>
                        <Link href="/admin/categories/child" className="dropdown-item">
                          Create Child Category
                        </Link>
                      </li>
                      <li>
                        <Link href="/admin/categories" className="dropdown-item">
                          Manage Categories
                        </Link>
                      </li>
                    </ul>
                  </li> */}

                  {/* Users Dropdown */}
                  {/* <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                    >
                      Users
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <Link href="/admin/users" className="dropdown-item">
                          Manage Users
                        </Link>
                      </li>
                    </ul>
                  </li> */}
                 <Link href="/admin/orders" className="dropdown-item">
                          All Orders
                        </Link>
                  {/* Admin Name */}
                  <li className="nav-item ms-lg-2">
                    <span className="nav-link fw-bold text-primary">
                      👤 {user.name}
                    </span>
                  </li>

                  {/* Logout */}
                  <li className="nav-item ms-lg-2">
                    <button
                      className="btn btn-outline-dark px-3"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  {/* Home, About, Products, Contact always visible */}
                  <li className="nav-item">
                    <Link href="/" className="nav-link">Home</Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/about" className="nav-link">About</Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/products" className="nav-link">Products</Link>
                  </li>
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
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}