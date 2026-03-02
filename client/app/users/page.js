"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAPI } from "../../services/api";

export default function UsersListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchAPI("/users");
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (err) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetchAPI(`/users/${id}`, { method: "DELETE" });
      setUsers((s) => s.filter((u) => u._id !== id && u.id !== id));
    } catch (err) {
      alert(err.message || "Delete failed");
    }
  };

  return (
    <div className="users-page container py-5">
      <div className="users-header">
        <h1 className="text-2xl font-bold">Users</h1>
        <Link href="/users/create" className="btn btn-dark create-btn">
          + Create User
        </Link>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="users-card">
        <table className="users-table">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id || u.id} className="border-t">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role || "user"}</td>
                <td className="p-2 text-center">
                  <Link
                    href={`/users/${u._id || u.id}`}
                    className="btn btn-sm btn-outline-dark me-2"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(u._id || u.id)}
                    className="btn btn-sm btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
