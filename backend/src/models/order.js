const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, default: "Erbil" },
    notes: { type: String, default: "" },

    paymentMethod: { type: String, enum: ["cash", "fib"], default: "cash" },
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },

    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "on-the-way", "delivered", "cancelled"],
      default: "pending",
    },

    orderItems: [
{
productId: {
type: mongoose.Schema.Types.ObjectId,
ref: "Product",
required: true
},

name: {
type: String,
required: true
},

imageUrl: {
type: String,
default: ""
},

price: {
type: Number,
required: true
},

qty: {
type: Number,
required: true,
default: 1
}
}
],

    totalPrice: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Order", orderSchema)