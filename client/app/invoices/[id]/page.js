import { getInvoiceById } from '@/services/invoiceService';
import PrintButton from "./PrintButton";
export default async function InvoiceDetailPage(props) {
    const params = await props.params;
    const id = params?.id;

    if (!id) {
        return <div className="container py-5"><h2>Invalid invoice id</h2></div>;
    }

    const invoice = await getInvoiceById(id);

    if (!invoice) {
        return <div className="container py-5"><h2>Invoice not found</h2></div>;
    }

    return (
        <div className="invoice-page">
            <div className="invoice-card">

                {/* HEADER */}
                <div className="invoice-header">
                    <div>
                        <h1 className="logo">Women Hub</h1>
                        <p>Maliba, Bardoli, India</p>
                        <p>support@gmail.com</p>
                    </div>

                    <div className="invoice-meta">
                        <h2>INVOICE</h2>
                        <p><strong>ID:</strong> #{invoice._id}</p>
                        <p><strong>Status:</strong> {invoice.status}</p>
                        <p><strong>Payment Method:</strong> {invoice.paymentMethod || 'N/A'}</p>
                        <p><strong>Payment Status:</strong> {invoice.paymentStatus || 'N/A'}</p>
                    </div>
                </div>

                {/* CUSTOMER */}
                <div className="invoice-customer">
                    <h4>Bill To</h4>
                    <p className="customer-name">{invoice.customerName}</p>
                    <p>{invoice.customerEmail}</p>
                    {/* <p>{invoice.customerAddress}</p> */}
                </div>

                {/* ITEMS TABLE */}
                <table className="invoice-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((it) => (
                            <tr key={it._id || it.product}>
                                <td>{it.name}</td>
                                <td>{it.qty}</td>
                                <td>₹ {it.price}</td>
                                <td>₹ {it.qty * it.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* TOTALS */}
                <div className="invoice-summary">
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>₹ {invoice.subtotal}</span>
                    </div>

                    <div className="summary-row">
                        <span>Shipping</span>
                        <span>₹ {invoice.shipping}</span>
                    </div>

                    <div className="summary-row total">
                        <span>Total</span>
                        <span>₹ {invoice.total}</span>
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="invoice-actions">
                    <div className="invoice-actions">
                        <PrintButton />
                    </div>
                </div>

            </div>
        </div>
    );
}