import express from "express";
import Order from "../models/order.js";
import Product from "../models/product.js";
import User from "../models/user.js";

const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    const pendingOrders = await Order.countDocuments({
      orderStatus: "pending",
    });

    const deliveredOrders = await Order.countDocuments({
      orderStatus: "delivered",
    });

    const revenueResult = await Order.aggregate([
      {
        $match: { orderStatus: "delivered" },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.json({
      totalOrders,
      totalProducts,
      totalUsers,
      pendingOrders,
      deliveredOrders,
      totalRevenue,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
});

export default router;