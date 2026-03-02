"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createInvoice } from "@/services/invoiceService";

export default function CreateInvoicePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const getCart = () => {
    try { const raw = localStorage.getItem('cart'); return raw ? JSON.parse(raw) : []; } catch { return []; }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const items = getCart();
    if (!items.length) return alert('Cart is empty');
    const subtotal = items.reduce((s,i) => s + (i.price||0)*(i.qty||1), 0);
    const shipping = 0;
    const total = subtotal + shipping;

    try {
      setLoading(true);
      const payload = { customerName: name, customerEmail: email, items: items.map(i=>({ product: i._id, name: i.name, price: i.price, qty: i.qty })), subtotal, shipping, total };
      const res = await createInvoice(payload);
      // clear cart
      localStorage.removeItem('cart');
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: [] } }));
      router.push(`/invoices/${res._id}`);
    } catch (err) {
      console.error('Create invoice error', err);
      alert(err.message || 'Failed to create invoice');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Create Invoice</h2>
      <form onSubmit={handleCreate} className="space-y-3 bg-white p-4 rounded shadow">
        <div>
          <label className="block text-sm">Customer Name</label>
          <input className="w-full border px-2 py-1" value={name} onChange={(e)=>setName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm">Customer Email</label>
          <input type="email" className="w-full border px-2 py-1" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        </div>
        <div>
          <button type="submit" className="btn btn-dark w-full" disabled={loading}>{loading ? 'Creating...' : 'Create Invoice'}</button>
        </div>
      </form>
    </div>
  );
}
