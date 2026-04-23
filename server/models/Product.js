const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: Number,
    image: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },
    countInStock: Number,

    // NEW (recommended)
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);