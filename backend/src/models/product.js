const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, default: "" },
    description: { type: String, default: "" },
    brand: { type: String, default: "" },
    category: { type: String, default: "General" },
    countInStock: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);