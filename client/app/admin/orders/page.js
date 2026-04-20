"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getOrders } from "@/services/orderService";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // getOrders without userId returns all orders (admin)
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
                <th>Order ID</th>
                <th>User</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td>{o._id}</td>
                  <td>{o.user ? `${o.user.name} (${o.user.email})` : "-"}</td>
                  <td>{new Date(o.createdAt).toLocaleString()}</td>
                  <td>{o.status || "inprogress"}</td>
                  <td>₹ {o.total || o.totalPrice || 0}</td>
                  <td>
                    <Link href={`/orders/${o._id}`} className="btn btn-sm btn-outline-dark">
                      View
                    </Link>
                  </td>
                </tr>
              ))}

              {!loading && orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-muted">No orders found</td>
                </tr>
              )}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
