const express = require("express")
const router = express.Router()
const Order = require("../models/order")

router.post("/", async (req, res) => {
  try {
    const {
      customerName,
      phone,
      address,
      city,
      notes,
      paymentMethod,
      orderItems,
      totalPrice,
    } = req.body

    const order = await Order.create({
      customerName,
      phone,
      address,
      city,
      notes,
      paymentMethod,
      orderItems: orderItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        imageUrl: item.imageUrl,
        price: item.price,
        qty: item.qty,
      })),
      totalPrice,
      paymentStatus: paymentMethod === "cash" ? "pending" : "paid",
    })

    res.status(201).json(order)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Failed to create order" })
  }
})

module.exports = router