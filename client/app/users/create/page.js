"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAPI } from "../../../services/api";
import Link from "next/link";

export default function CreateUserPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {

      const user = await fetchAPI("/users", {
        method: "POST",
        body: JSON.stringify({ name, email, password, role: "user" }),
      });

      // go back to users list
      router.push("/users");
    } catch (err) {
      setError(err.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-user-page container py-5">
      <h2 className="text-2xl font-bold mb-4">Create User</h2>
      {error && <p className="form-error">{error}</p>}
        <Link href="/users" className="btn btn-dark create-btn">
          + Back to Users
        </Link>
      <form onSubmit={submit} className="create-user-card">
        <div className="mb-3">
          <label className="block text-sm">Name</label>
          <input className="w-full border px-2 py-1" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input type="email" className="w-full border px-2 py-1" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input type="password" className="w-full border px-2 py-1" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>


        <div>
          <button type="submit" className="btn btn-dark w-full" disabled={loading}>
            {loading ? "Creating..." : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}
