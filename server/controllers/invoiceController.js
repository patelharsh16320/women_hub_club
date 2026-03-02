const Invoice = require('../models/Invoice');

// Create invoice
exports.createInvoice = async (req, res) => {
  try {

  const { user, customerName, customerEmail, items, subtotal, shipping, total, paymentMethod, paymentStatus, paymentId } = req.body;

    // basic validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Invoice must have at least one item' });
    }
    if (typeof subtotal !== 'number' || typeof total !== 'number') {
      return res.status(400).json({ message: 'Invalid subtotal or total' });
    }

    const invoice = await Invoice.create({
      user,
      customerName,
      customerEmail,
      items,
      subtotal,
      shipping: shipping || 0,
      total,
      paymentMethod: paymentMethod || 'stripe',
      paymentStatus: paymentStatus || 'paid',
      paymentId
    });
    res.status(201).json(invoice);
  } catch (err) {
    console.error('Create Invoice Error:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
