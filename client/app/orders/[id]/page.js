"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getOrderById } from "@/services/orderService";

export default function OrderDetailPage() {
  const { id } = useParams(); // ✅ correct way
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  if (!id) return;

  getOrderById(id)
    .then((data) => {
      console.log("API Response:", data);

      // If API returns array
      const orderData = Array.isArray(data) ? data[0] : data;

      setOrder(orderData);
    })
    .catch((err) => {
      console.error("Order fetch error:", err);
      setOrder(null);
    })
    .finally(() => setLoading(false));
}, [id]);

  if (loading) return <div className="container py-5">Loading...</div>;
  if (!order) return <div className="container py-5">Order not found</div>;


  // Support both 'items' and 'orderItems' for compatibility
  const items = order.items && order.items.length > 0
    ? order.items
    : order.orderItems && order.orderItems.length > 0
    ? order.orderItems.map(i => ({
        ...i,
        name: i.product?.name || i.product?._id || i.product || 'Product',
        price: i.product?.price || i.price || 0
      }))
    : [];

return (
  <div className="container py-5">
    <div className="card shadow-sm border-0 order-card">
      <div className="card-body p-4">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0 fw-bold text-dark">
            Order #{order._id}
          </h4>
          <span className={`badge px-3 py-2 ${
            order.status === "processing"
              ? "bg-warning text-dark"
              : order.status === "completed"
              ? "bg-success"
              : "bg-secondary"
          }`}>
            {order.status}
          </span>
        </div>

        {/* Order Info */}
        <div className="row mb-4">
          <div className="col-md-6">
            <p className="mb-1">
              <strong>Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>
            <p className="mb-1">
              <strong>Payment:</strong>{" "}
              {order.isPaid ? "Paid" : "Unpaid"}
            </p>
          </div>

          <div className="col-md-6 text-md-end">
            <p className="mb-1">
              <strong>Shipping Address:</strong>
            </p>
            <p className="mb-0">{order.shippingAddress}</p>
          </div>
        </div>

        {/* Items Table */}

        <div className="table-responsive">
          <table className="table align-middle">
            <thead className="table-light">
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th className="text-end">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{item.name || item.product?.name || item.product?._id || item.product || 'Product'}</td>
                  <td>{item.qty}</td>
                  <td>₹ {item.price}</td>
                  <td className="text-end">
                    ₹ {(item.qty * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        {/* Grand Total */}
        <div className="text-end mt-4">
          <h5 className="fw-bold text-dark">
            Grand Total: ₹ {order.total || order.totalPrice || 0}
          </h5>
        </div>

      </div>
    </div>
  </div>
);
}