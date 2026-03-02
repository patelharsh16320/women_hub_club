const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String,
  price: Number,
  qty: { type: Number, default: 1 },
});


const invoiceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerName: { type: String },
  customerEmail: { type: String },
  items: [invoiceItemSchema],
  subtotal: { type: Number, required: true },
  shipping: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  paymentMethod: { type: String, default: 'stripe' },
  paymentStatus: { type: String, default: 'unpaid' },
  paymentId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
