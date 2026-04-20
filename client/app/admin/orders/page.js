"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getOrders } from "@/services/orderService";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [appliedFilters, setAppliedFilters] = useState(null);

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

      Filters
      <div className="card mb-3 p-3">
        <form className="row g-2 align-items-end" onSubmit={(e)=>{ e.preventDefault(); setAppliedFilters({ name: nameFilter, status: statusFilter, minPrice, maxPrice, dateFrom, dateTo }); }}>
          <div className="col-md-3">
            <label className="form-label small mb-1">User name / email</label>
            <input className="form-control" placeholder="Search name or email" value={nameFilter} onChange={(e)=>setNameFilter(e.target.value)} />
          </div>

          <div className="col-md-2">
            <label className="form-label small mb-1">Status</label>
            <select className="form-select" value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
              <option value="">All status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label small mb-1">Min price</label>
            <input className="form-control" placeholder="Min" value={minPrice} onChange={(e)=>setMinPrice(e.target.value)} type="number" />
          </div>

          <div className="col-md-2">
            <label className="form-label small mb-1">Max price</label>
            <input className="form-control" placeholder="Max" value={maxPrice} onChange={(e)=>setMaxPrice(e.target.value)} type="number" />
          </div>

          {/* <div className="col-md-3">
            <label className="form-label small mb-1">Date range</label>
            <div className="d-flex gap-2">
              <input type="date" className="form-control" value={dateFrom} onChange={(e)=>setDateFrom(e.target.value)} />
              <input type="date" className="form-control" value={dateTo} onChange={(e)=>setDateTo(e.target.value)} />
            </div>
          </div> */}

          <div className="col-12 d-flex gap-2">
            <button type="submit" className="btn btn-sm btn-dark">Apply</button>
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => { setNameFilter(''); setStatusFilter(''); setMinPrice(''); setMaxPrice(''); setDateFrom(''); setDateTo(''); setAppliedFilters(null); }}>Clear</button>
            <div className="ms-auto text-muted small">{appliedFilters ? 'Filters applied' : 'No filters applied'}</div>
          </div>
        </form>
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
              {orders
                .filter((o) => {
                  const f = appliedFilters || { name: '', status: '', minPrice: '', maxPrice: '', dateFrom: '', dateTo: '' };
                  const nameFilterLocal = f.name || '';
                  const statusFilterLocal = f.status || '';
                  const minPriceLocal = f.minPrice || '';
                  const maxPriceLocal = f.maxPrice || '';
                  const dateFromLocal = f.dateFrom || '';
                  const dateToLocal = f.dateTo || '';
                  // If no applied filters, show all
                  if (!appliedFilters) return true;
                  // Name filter
                  if (nameFilterLocal) {
                    const uname = (o.user && (o.user.name || o.user.email)) || '';
                    if (!uname.toLowerCase().includes(nameFilterLocal.toLowerCase())) return false;
                  }
                  // Status filter
                  if (statusFilterLocal) {
                    if ((o.status || 'inprogress').toLowerCase() !== statusFilterLocal.toLowerCase()) return false;
                  }
                  // Price filter
                  const price = Number(o.total || o.totalPrice || 0);
                  if (minPriceLocal !== '' && !isNaN(Number(minPriceLocal)) && price < Number(minPriceLocal)) return false;
                  if (maxPriceLocal !== '' && !isNaN(Number(maxPriceLocal)) && price > Number(maxPriceLocal)) return false;
                  // Date filter
                  if (dateFromLocal) {
                    const from = new Date(dateFromLocal);
                    const od = new Date(o.createdAt);
                    if (od < from) return false;
                  }
                  if (dateToLocal) {
                    const to = new Date(dateToLocal);
                    const od = new Date(o.createdAt);
                    // include the dateTo day fully
                    to.setHours(23,59,59,999);
                    if (od > to) return false;
                  }
                  return true;
                })
                .map((o) => (
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
