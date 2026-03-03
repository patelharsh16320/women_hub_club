"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAPI } from "../../../services/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await fetchAPI("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("userInfo", JSON.stringify(user));
      }

      router.push("/");
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="login-wrapper">
    <div className="login-card">
      <h2 className="login-title">Welcome Back</h2>
      <p className="login-subtitle">Sign in to continue</p>

      {error && <div className="login-error">{error}</div>}

      <form onSubmit={submit} className="login-form">
        
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading} className="login-btn">
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="login-footer">
          Don’t have an account? <a href="/account/signup">Create one</a>
        </p>

      </form>
    </div>
  </div>
);
}
