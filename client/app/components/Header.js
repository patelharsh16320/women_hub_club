"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="main-header">
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">

          {/* Logo */}
          <Link href="/" className="navbar-brand brand-logo">
            👩‍🦰 Women Hub
            <span className="brand-tagline d-block">
              Your trusted platform for women's products
            </span>
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

              <li className="nav-item">
                <Link href="/" className="nav-link">Home</Link>
              </li>

              <li className="nav-item">
                <Link href="/about" className="nav-link">About</Link>
              </li>

              {/* PRODUCTS DROPDOWN */}
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link"
                  data-bs-toggle="dropdown"
                >
                  Products
                </button>

                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" href="/products">
                      All Products
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="/products/create">
                      Create Product
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="/products/manage">
                      Manage Products
                    </Link>
                  </li>
                </ul>
              </li>

              {/* CATEGORIES DROPDOWN */}
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link"
                  data-bs-toggle="dropdown"
                >
                  Categories
                </button>

                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" href="/categories">
                      All Categories
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="/categories/create">
                      Create Category
                    </Link>
                  </li>
                </ul>
              </li>

              {/* USERS DROPDOWN */}
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link"
                  data-bs-toggle="dropdown"
                >
                  Users
                </button>

                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" href="/users">
                      All Users
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="/users/create">
                      Create User
                    </Link>
                  </li>
                </ul>
              </li>

              {/* CART */}
              <li className="nav-item">
                <Link href="/cart" className="nav-link">
                  🛒 Cart
                </Link>
              </li>

              {/* CONTACT BUTTON */}
              <li className="nav-item ms-lg-2">
                <Link href="/contact" className="btn btn-dark rounded-pill px-3">
                  Contact
                </Link>
              </li>

            </ul>
          </div>

        </div>
      </nav>
    </header>
  );
}