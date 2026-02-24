"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAPI } from "../../../services/api";

export default function EditUserClient({ id }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
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

      await fetchAPI(`/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });

      router.push("/users");
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-md mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Edit User</h2>
      <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 rounded shadow">
        <div>
          <label className="block text-sm">Name</label>
          <input className="w-full border px-2 py-1" value={user?.name || ""} onChange={(e) => setUser({ ...user, name: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input type="email" className="w-full border px-2 py-1" value={user?.email || ""} onChange={(e) => setUser({ ...user, email: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm">Password (leave blank to keep)</label>
          <input type="password" className="w-full border px-2 py-1" value={user?.password || ""} onChange={(e) => setUser({ ...user, password: e.target.value })} />
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
