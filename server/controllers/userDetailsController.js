const UserDetails = require('../models/UserDetails');

// Get user details by user id
exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.params.userId;
    const details = await UserDetails.findOne({ user: userId });
    res.json(details);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add or update address
exports.saveAddress = async (req, res) => {
  try {
    const { userId, address } = req.body;
    let details = await UserDetails.findOne({ user: userId });
    if (!details) {
      details = await UserDetails.create({ user: userId, address });
    } else {
      details.address = address;
      await details.save();
    }
    res.json(details);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a payment method (stripe or cod)
exports.addPaymentMethod = async (req, res) => {
  try {
    const { userId, type, details } = req.body;
    let userDetails = await UserDetails.findOne({ user: userId });
    if (!userDetails) {
      userDetails = await UserDetails.create({ user: userId, paymentMethods: [{ type, details }] });
    } else {
      userDetails.paymentMethods.push({ type, details });
      await userDetails.save();
    }
    res.json(userDetails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all payment methods for a user
exports.getPaymentMethods = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userDetails = await UserDetails.findOne({ user: userId });
    res.json(userDetails ? userDetails.paymentMethods : []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
