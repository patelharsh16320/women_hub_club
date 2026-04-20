const Order = require("../models/Order");


exports.createOrder = async (req, res) => {
  const order = await Order.create(req.body);
  res.json(order);
};

// Get all orders for a user (by userId query param)

exports.getOrders = async (req, res) => {
  const userId = req.query.userId;
  let filter = {};
  if (userId) filter.user = userId;
  // Populate user for admin listing
  const orders = await Order.find(filter).populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
};


// Get single order by id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user').populate('orderItems.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


