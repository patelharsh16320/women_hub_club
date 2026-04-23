"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getOrders } from "@/services/orderService";

const ITEMS_PER_PAGE = 10;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // getOrders without ordersId returns all orders (admin)
        const data = await getOrders();
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } catch (err) {
        setError(err?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = orders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="admin-orders container py-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">All Orders</h3>
      </div>

      {loading && <p>Loading orders...</p>}
      {error && <p className="text-danger">{error}</p>}

      <div className="card shadow-sm">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Index</th>
                <th>Order ID</th>
                <th>User</th>
                <th>Email</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((o, index) => (
                <tr key={o._id}>
                  <td>{startIndex + index + 1}</td>
                  <td>{o._id}</td>
                  <td>{o.user ? `${o.user.name} ` : "-"}</td>
                  <td>{o.user ? `${o.user.email}` : "-"}</td>
                  <td>{new Date(o.createdAt).toLocaleString()}</td>
                  <td>{o.status || "inprogress"}</td>
                  <td>₹ {o.total || o.totalPrice || 0}</td>
                  <td>
                    <Link
                      href={`/orders/${o._id}`}
                      className="btn btn-sm btn-outline-dark"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}

              {!loading && orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-muted">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center px-3 py-3 border-top">
              <p className="text-sm text-gray-500 mb-0">
                Showing {startIndex + 1}–
                {Math.min(startIndex + ITEMS_PER_PAGE, orders.length)} of{" "}
                {orders.length} orders
              </p>
              <ul className="pagination mb-0">
                {/* Prev */}
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
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
                    <li
                      key={page}
                      className={`page-item ${currentPage === page ? "active" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    </li>
                  ),
                )}

                {/* Next */}
                <li
                  className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    &raquo;
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
