"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAPI } from "../../../services/api";
import { toastMessage } from "../../../utils/toastMessage";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetchAPI("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // 👇 Adjust based on your API response structure
      const userData = {
        name: response.user?.name || response.name,
        email: response.user?.email || response.email,
        _id: response.user?._id || response._id, // ensure user id is stored
        role: response.user?.role || response.role || 'user' // store role
      };

      localStorage.setItem("user", JSON.stringify(userData));

      // notify header
      window.dispatchEvent(new Event("userChanged"));

      toastMessage.success("Login successful!");

      // Redirect based on role
      if (userData.role === 'admin') {
        window.location.href = 'http://localhost:3000/admin';
      } else {
        window.location.href = 'http://localhost:3000/';
      }
    } catch (err) {
  setError(err.message || "Invalid credentials");
  toastMessage.error(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="auth-wrapper">
    <div className="auth-card">
      
      <div className="auth-header text-center">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your account</p>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <form onSubmit={submit} className="auth-form">

        <div className="mb-3">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-control custom-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3" style={{ position: "relative" }}>
          <label className="form-label">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            className="form-control custom-input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            style={{
              position: "absolute",
              right: 10,
              top: 35,
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer"
            }}
            tabIndex={-1}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <button
          className="btn btn-dark w-100 auth-btn"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div className="text-center mt-3 small text-dark">
          Don’t have an account?{" "}
          <a href="/account/signup" className="auth-link">
            Create one
          </a>
        </div>

      </form>
    </div>
  </div>
);
}