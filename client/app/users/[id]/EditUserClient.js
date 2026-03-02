"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchAPI } from "../../../services/api";

export default function EditUserClient({ id: propId }) {
  const router = useRouter();
  const p = useParams();
  const id = propId || p?.id;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setError("Missing user id in route");
        return;
      }
      try {
        setLoading(true);
        console.log("Fetching user:", process.env.NEXT_PUBLIC_API_URL, `/users/${id}`);
        const data = await fetchAPI(`/users/${id}`);
        setUser(data);
      } catch (err) {
        console.error("Load user error:", err);
        setError(err.message || "Failed to load user");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const body = { name: user.name, email: user.email };
      // only send password if changed
      if (user.password) body.password = user.password;
      if (user.role) body.role = user.role;

      if (!id) throw new Error("Missing user id");
      console.log("Updating user:", process.env.NEXT_PUBLIC_API_URL, `/users/${id}`, body);
      await fetchAPI(`/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });

      router.push("/users");
    } catch (err) {
      console.error("Update user error:", err);
      setError(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) return <p>Loading...</p>;
  if (error) return (
    <div className="container py-5">
      <h2 className="text-center text-danger">Error</h2>
      <p className="text-center">{error}</p>
    </div>
  );

  return (
    <div className="edit-user-page container py-5">
      <h2 className="text-2xl font-bold mb-4">Edit User</h2>
      {error && <p className="form-error">{error}</p>}
      <form onSubmit={handleSubmit} className="edit-user-card">
        <div className="mb-3">
          <label className="block text-sm">Name</label>
          <input className="w-full border px-2 py-1" value={user?.name || ""} onChange={(e) => setUser({ ...user, name: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input type="email" className="w-full border px-2 py-1" value={user?.email || ""} onChange={(e) => setUser({ ...user, email: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm">Role</label>
          <input className="w-full border px-2 py-1" value={user?.role || ""} onChange={(e) => setUser({ ...user, role: e.target.value })} />
        </div>
        <div>
          <button type="submit" className="btn btn-dark w-full" disabled={loading}>
            {loading ? "Updating..." : "Update User"}
          </button>
        </div>
      </form>
    </div>
  );
}
