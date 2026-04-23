"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAPI } from "../../../services/api";
import { toastMessage } from "../../../utils/toastMessage";

const ITEMS_PER_PAGE = 10;

export default function UsersListPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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
  toastMessage.info("Are you sure you want to delete this user?");
  if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await fetchAPI(`/users/${id}`, { method: "DELETE" });
      setUsers((s) => s.filter((u) => u._id !== id && u.id !== id));
      // Adjust page if last item on current page was deleted
      const newTotal = users.length - 1;
      const newTotalPages = Math.ceil(newTotal / ITEMS_PER_PAGE);
      if (currentPage > newTotalPages) setCurrentPage(Math.max(1, newTotalPages));
    } catch (err) {
  toastMessage.error(err.message || "Delete failed");
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = users.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Generate page numbers with ellipsis logic
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="users-page container py-5">
      <div className="users-header">
        <h1 className="text-2xl font-bold text-dark">Users</h1>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="users-card">
        <table className="users-table">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Index</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((u, index) => (
              <tr key={u._id || u.id} className="border-t">
                <td className="p-2">{startIndex+index + 1}</td>
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2 text-center">
                  <Link href={`/admin/users/${u._id || u.id}`} className="btn btn-sm btn-outline-dark me-2">Edit</Link>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u._id || u.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {!loading && paginatedUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center px-3 py-3 border-top">
            <p className="text-sm text-gray-500 mb-0">
              Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, users.length)} of {users.length} users
            </p>
            <ul className="pagination mb-0">
              {/* Prev */}
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                  &laquo;
                </button>
              </li>

              {/* Page Numbers */}
              {getPageNumbers().map((page, idx) =>
                page === "..." ? (
                  <li key={`ellipsis-${idx}`} className="page-item disabled">
                    <span className="page-link">…</span>
                  </li>
                ) : (
                  <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                    <button className="page-link" onClick={() => handlePageChange(page)}>
                      {page}
                    </button>
                  </li>
                )
              )}

              {/* Next */}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                  &raquo;
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}