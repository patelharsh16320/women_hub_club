import Link from "next/link";

export default function Header() {
  return (
    <header className="main-header">
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">

          {/* Logo */}
          <Link href="/" className="navbar-brand brand-logo">
            👩‍🦰 Women Hub
            <span className="brand-tagline">
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

          {/* Menu */}
          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav ms-auto align-items-lg-center">

              <li className="nav-item">
                <Link href="/" className="nav-link">Home</Link>
              </li>

              <li className="nav-item">
                <Link href="/about" className="nav-link">About</Link>
              </li>

              <li className="nav-item">
                <Link href="/products" className="nav-link">Shop</Link>
              </li>

              <li className="nav-item">
                <Link href="/cart" className="nav-link cart-link">
                  🛒 Cart
                </Link>
              </li>

              <li className="nav-item">
                <Link href="/contact" className="btn contact-btn">
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