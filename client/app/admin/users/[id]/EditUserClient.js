"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchAPI } from "../../../../services/api";

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
        const data = await fetchAPI(`/users/${id}`);
        setUser(data);
      } catch (err) {
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
      await fetchAPI(`/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
      router.push("/admin/users");
    } catch (err) {
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

  if (!user) return <p>Loading...</p>;

  return (
    <div className="edit-user-page container py-5">
      <h2 className="text-2xl font-bold mb-4">Edit User</h2>
      <button
        type="button"
        className="btn btn-secondary mb-3"
        onClick={() => router.back()}
      >
        &larr; Back
      </button>
      <form onSubmit={handleSubmit} className="edit-user-card">
        <div className="mb-3">
          <label className="block text-sm">Name</label>
          <input className="w-full border px-2 py-1" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input type="email" className="w-full border px-2 py-1" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input
            type="text"
            className="w-full border px-2 py-1"
            value={user.password || ""}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm">Role</label>
          <select
            className="w-full border px-2 py-1"
            value={user.role || "user"}
            onChange={(e) => setUser({ ...user, role: e.target.value })}
            required
          >
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="author">Author</option>
            <option value="user">User</option>
          </select>
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
