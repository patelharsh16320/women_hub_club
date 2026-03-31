"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAPI } from "../../../services/api";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
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
      const user = await fetchAPI("/users", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });

      // store user locally
      if (typeof window !== "undefined") {
        localStorage.setItem("userInfo", JSON.stringify(user));
      }

      router.push("/");
    } catch (err) {
      setError(err.message || "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <h2 className="signup-title">Create Account</h2>

        {error && <div className="signup-error">{error}</div>}

        <form onSubmit={submit} className="signup-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
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
                cursor: "pointer",
              }}
              tabIndex={-1}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button type="submit" disabled={loading} className="signup-btn">
            {loading ? "Creating..." : "Sign Up"}
          </button>
          <p className="login-footer">
            Already have an account? <a href="/account/login">Sign in</a>
          </p>
        </form>
      </div>
    </div>
  );
}
