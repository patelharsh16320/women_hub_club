const mongoose = require("mongoose");

const paymentMethodSchema = new mongoose.Schema({
  type: { type: String, enum: ["stripe", "cod"], required: true },
  details: { type: Object }, // for stripe: card info, for cod: empty or notes
  createdAt: { type: Date, default: Date.now }
});

const userDetailsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  address: { type: String },
  paymentMethods: [paymentMethodSchema]
}, { timestamps: true });

module.exports = mongoose.model("UserDetails", userDetailsSchema);
