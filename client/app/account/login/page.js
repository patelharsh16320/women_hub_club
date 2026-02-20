"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAPI } from "../../../../services/api";

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
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Sign in</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={submit}>
        <label className="block mb-2">
          <span className="text-sm">Email</span>
          <input
            type="email"
            className="w-full border rounded px-3 py-2 mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="block mb-4">
          <span className="text-sm">Password</span>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
