"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getInvoices } from "@/services/invoiceService";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getInvoices();
        setInvoices(data || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load invoices");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="invoice-list-page">

      {/* HEADER */}
      <div className="invoice-list-header">
        <div>
          <h1>Invoices</h1>
          <p className="subtitle">Manage and track customer invoices</p>
        </div>

        <Link href="/invoices/create" className="create-btn">
          + Create Invoice
        </Link>
      </div>

      {/* LOADING */}
      {loading && <div className="loading">Loading invoices...</div>}

      {/* TABLE */}
      <div className="invoice-table-wrapper">
        <table className="invoice-list-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((inv) => (
              <tr key={inv._id}>
                <td className="invoice-id">
                  #{inv._id.slice(-6)}
                </td>

                <td>
                  <div className="customer-cell">
                    <span className="customer-name">
                      {inv.customerName}
                    </span>
                    <span className="customer-email">
                      {inv.customerEmail}
                    </span>
                  </div>
                </td>

                <td className="amount">
                  ₹ {Number(inv.total).toLocaleString("en-IN")}
                </td>

                <td className="actions">
                  <Link
                    href={`/invoices/${inv._id}`}
                    className="view-btn"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}

            {!loading && invoices.length === 0 && (
              <tr>
                <td colSpan="4" className="empty">
                  No invoices found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}