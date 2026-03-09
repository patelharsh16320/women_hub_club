"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

// Simple chart with Chart.js (client only)
const Chart = ({ data, labels, title }) => {
  const [ChartJS, setChartJS] = useState(null);
  const chartRef = React.useRef();
  const chartInstanceRef = React.useRef();

  useEffect(() => {
    import("chart.js/auto").then((mod) => setChartJS(mod));
  }, []);

  useEffect(() => {
    if (!ChartJS) return;
    const ctx = chartRef.current;
    // Destroy previous chart instance if exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
    if (ctx) {
      chartInstanceRef.current = new ChartJS.Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [{ label: title, data, backgroundColor: "#007bff" }],
        },
        options: { responsive: true, plugins: { legend: { display: false } } },
      });
    }
    // Cleanup on unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line
  }, [ChartJS, data, labels]);
  return <canvas ref={chartRef} id={title} height={120} />;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, products: 0, categories: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const [users, products, categories] = await Promise.all([
          fetch(`${API}/users`).then((r) => r.json()),
          fetch(`${API}/products`).then((r) => r.json()),
          fetch(`${API}/categories`).then((r) => r.json()),
        ]);
        setStats({
          users: Array.isArray(users) ? users.length : users.users?.length || 0,
          products: Array.isArray(products) ? products.length : products.products?.length || 0,
          categories: Array.isArray(categories) ? categories.length : categories.categories?.length || 0,
        });
      } catch {
        setStats({ users: 0, prsoducts: 0, categories: 0 });
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const adminLinks = [
    { href: "/admin/products", label: "Products" },
    { href: "/admin/products/create", label: "Create Product" },
    { href: "/admin/products/manage", label: "Manage Products" },
    { href: "/admin/categories", label: "Categories" },
    { href: "/admin/categories/create", label: "Create Category" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/users/create", label: "Create User" },
  ];

  return (
    <>
      <h1 className="fw-bold mb-4">Admin Dashboard</h1>
      {loading ? (
        <p>Loading site stats...</p>
      ) : (
        <div className="row mb-5">
          <div className="col-md-4">
            <div className="card shadow-sm mb-4">
              <div className="card-body text-center">
                <h4 className="fw-bold">Total Users</h4>
                <p className="display-5 fw-bold text-primary">{stats.users}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm mb-4">
              <div className="card-body text-center">
                <h4 className="fw-bold">Total Products</h4>
                <p className="display-5 fw-bold text-success">{stats.products}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm mb-4">
              <div className="card-body text-center">
                <h4 className="fw-bold">Total Categories</h4>
                <p className="display-5 fw-bold text-warning">{stats.categories}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Chart */}
      <div className="mb-5">
        <h3 className="fw-bold mb-3">Site Overview</h3>
        <Chart
          data={[stats.users, stats.products, stats.categories]}
          labels={["Users", "Products", "Categories"]}
          title="SiteStats"
        />
      </div>
    </>
  );
}