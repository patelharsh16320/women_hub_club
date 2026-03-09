"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

/* Chart Component */
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

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    if (ctx) {
      chartInstanceRef.current = new ChartJS.Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: title,
              data,
              backgroundColor: ["#ff6b9a", "#6bc5ff", "#ffc46b"],
              borderRadius: 8,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
        },
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [ChartJS, data, labels]);

  return <canvas ref={chartRef} height={120} />;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    categories: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);

      try {
        const API =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        const [users, products, categories] = await Promise.all([
          fetch(`${API}/users`).then((r) => r.json()),
          fetch(`${API}/products`).then((r) => r.json()),
          fetch(`${API}/categories`).then((r) => r.json()),
        ]);

        setStats({
          users: Array.isArray(users)
            ? users.length
            : users.users?.length || 0,

          products: Array.isArray(products)
            ? products.length
            : products.products?.length || 0,

          categories: Array.isArray(categories)
            ? categories.length
            : categories.categories?.length || 0,
        });
      } catch {
        setStats({ users: 0, products: 0, categories: 0 });
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard ">

      <h1 className="dashboard-title mb-4">Admin Dashboard</h1>

      {loading ? (
        <p>Loading site stats...</p>
      ) : (
        <div className="row mb-5 text-dark">

          <div className="col-md-4">
            <div className="stat-card stat-users text-center">
              <h5>Total Users</h5>
              <p className="stat-number text-danger">{stats.users}</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="stat-card stat-products text-center">
              <h5>Total Products</h5>
              <p className="stat-number text-primary">{stats.products}</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="stat-card stat-categories text-center">
              <h5>Total Categories</h5>
              <p className="stat-number text-warning">{stats.categories}</p>
            </div>
          </div>

        </div>
      )}

      <div className="chart-card">
        <h4 className="fw-bold mb-4">Site Overview</h4>

        <Chart
          data={[stats.users, stats.products, stats.categories]}
          labels={["Users", "Products", "Categories"]}
          title="SiteStats"
        />
      </div>

    </div>
  );
}