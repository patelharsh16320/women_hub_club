"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getInvoices } from "@/services/invoiceService";

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => { const load = async () => { try { setLoading(true); const data = await getInvoices(); setInvoices(data || []); } catch (err) { console.error(err); alert('Failed to load invoices'); } finally { setLoading(false); } }; load(); }, []);

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Invoices</h1>
                <Link href="/invoices/create" className="btn btn-dark">Create Invoice</Link>
            </div>

            {loading && <p>Loading...</p>}

            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 text-left">#</th>
                            <th className="p-2 text-left">Customer</th>
                            <th className="p-2 text-left">Total</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((inv) => (
                            <tr key={inv._id} className="border-t">
                                <td className="p-2">{inv._id}</td>
                                <td className="p-2">{inv.customerName} <br /><small className="text-muted">{inv.customerEmail}</small></td>
                                <td className="p-2">₹ {inv.total}</td>
                                <td className="p-2 text-center"><Link href={`/invoices/${inv._id}`} className="btn btn-sm btn-outline">View</Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
