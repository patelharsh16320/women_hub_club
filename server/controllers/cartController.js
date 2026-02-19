const Cart = require("../models/Cart");

exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user });
  res.json(cart);
};

exports.addToCart = async (req, res) => {
  const cart = await Cart.create(req.body);
  res.json(cart);
};
