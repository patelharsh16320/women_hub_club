"use client";

import { useEffect, useState } from "react";
import { getOrders } from "@/services/orderService";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OrdersPage() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = (() => { try { return JSON.parse(localStorage.getItem('user')); } catch { return null; } })();
    if (!user) {
      router.push('/account/login');
      return;
    }
    setCheckingAuth(false);
    const load = async () => {
      setLoading(true);
      try {
        const data = await getOrders(user._id);
        setOrders(data || []);
      } catch (err) {
        alert("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  if (checkingAuth) return null;
  return (
    <div className="orders-page container py-5">
      <h1 className="mb-4">My Orders</h1>
      {loading && <div>Loading...</div>}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Status</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
              <td>{order.status || 'inprogress'}</td>
              <td>₹ {order.total || order.totalPrice || 0}</td>
              <td>
                <Link href={`/orders/${order._id}`} className="btn btn-sm btn-outline-dark">
                  View
                </Link>
              </td>
            </tr>
          ))}
          {!loading && orders.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center text-muted">No orders found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
