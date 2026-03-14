const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const axios = require("axios");

const sendTelegramMessage = async (message) => {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.log("Telegram token or chat id missing");
      return;
    }

    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text: message,
    });
  } catch (error) {
    console.log("Telegram error:", error.response?.data || error.message);
  }
};

const getStatusTimelineUpdate = (status) => {
  const now = new Date();

  switch (status) {
    case "pending":
      return { pendingAt: now };
    case "confirmed":
      return { confirmedAt: now };
    case "preparing":
      return { preparingAt: now };
    case "on-the-way":
      return { onTheWayAt: now };
    case "delivered":
      return { deliveredAt: now };
    case "cancelled":
      return { cancelledAt: now };
    default:
      return {};
  }
};

// CREATE ORDER
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

      addressType,
      buildingName,
      apartmentNumber,
      floor,
      street,
      additionalDirections,
      lat,
      lng,
      googleMapsLink,

      fibSenderPhone,
      fibTransactionId,
      fibReference,
      fibPaymentId,
      fibPaymentUrl,
      fibQrCode,
      paymentStatus,
    } = req.body;

    const order = await Order.create({
      customerName,
      phone,
      address,
      city,
      notes,
      paymentMethod: paymentMethod || "cash",
      paymentStatus: paymentStatus || "pending",
      orderStatus: "pending",
      orderItems,
      totalPrice,

      addressType,
      buildingName,
      apartmentNumber,
      floor,
      street,
      additionalDirections,
      lat,
      lng,
      googleMapsLink,

      fibSenderPhone: fibSenderPhone || "",
      fibTransactionId: fibTransactionId || "",
      fibReference: fibReference || "",
      fibPaymentId: fibPaymentId || "",
      fibPaymentUrl: fibPaymentUrl || "",
      fibQrCode: fibQrCode || "",

      statusTimeline: {
        pendingAt: new Date(),
        confirmedAt: null,
        preparingAt: null,
        onTheWayAt: null,
        deliveredAt: null,
        cancelledAt: null,
      },
    });

    const itemsText = order.orderItems
      .map(
        (item) =>
          `- ${item.name} x${item.qty} (${item.price} IQD each) = ${
            item.qty * item.price
          } IQD`
      )
      .join("\n");

    const telegramMessage = `🛒 New Order

👤 Name: ${order.customerName}
📞 Phone: ${order.phone}
🏙️ City: ${order.city}
📍 Address: ${order.address || "-"}
🏢 Type: ${order.addressType || "-"}
🏬 Building: ${order.buildingName || "-"}
🏠 Apartment: ${order.apartmentNumber || "-"}
🏢 Floor: ${order.floor || "-"}
🛣️ Street: ${order.street || "-"}
📝 Notes: ${order.notes || "-"}
🪙 Total: ${order.totalPrice} IQD
📦 Status: ${order.orderStatus}

💳 Payment: ${order.paymentMethod}
💰 Payment Status: ${order.paymentStatus}
📱 FIB Sender Phone: ${order.fibSenderPhone || "-"}
🧾 FIB Transaction ID: ${order.fibTransactionId || "-"}
🧾 FIB Reference: ${order.fibReference || "-"}
🧾 FIB Payment ID: ${order.fibPaymentId || "-"}
🔗 FIB Payment URL: ${order.fibPaymentUrl || "-"}

Items:
${itemsText}

🗺️ Map:
${order.googleMapsLink || "No map link"}`;

    await sendTelegramMessage(telegramMessage);

    res.status(201).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to place order" });
  }
});

// GET ALL ORDERS (ADMIN)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// UPDATE ORDER STATUS
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = status;

    if (!order.statusTimeline) {
      order.statusTimeline = {
        pendingAt: order.createdAt || new Date(),
        confirmedAt: null,
        preparingAt: null,
        onTheWayAt: null,
        deliveredAt: null,
        cancelledAt: null,
      };
    }

    const timelineUpdate = getStatusTimelineUpdate(status);
    order.statusTimeline = {
      ...(order.statusTimeline.toObject?.() || order.statusTimeline),
      ...timelineUpdate,
    };

    await order.save();

    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

// UPDATE PAYMENT STATUS
router.put("/:id/payment-status", async (req, res) => {
  try {
    const {
      paymentStatus,
      fibTransactionId,
      fibReference,
      fibSenderPhone,
      fibPaymentId,
      fibPaymentUrl,
      fibQrCode,
    } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.paymentStatus = paymentStatus || order.paymentStatus;

    if (fibTransactionId !== undefined) {
      order.fibTransactionId = fibTransactionId;
    }
    if (fibReference !== undefined) {
      order.fibReference = fibReference;
    }
    if (fibSenderPhone !== undefined) {
      order.fibSenderPhone = fibSenderPhone;
    }
    if (fibPaymentId !== undefined) {
      order.fibPaymentId = fibPaymentId;
    }
    if (fibPaymentUrl !== undefined) {
      order.fibPaymentUrl = fibPaymentUrl;
    }
    if (fibQrCode !== undefined) {
      order.fibQrCode = fibQrCode;
    }

    await order.save();

    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update payment status" });
  }
});

// GET USER ORDERS BY PHONE
router.get("/my-orders/:phone", async (req, res) => {
  try {
    const orders = await Order.find({ phone: req.params.phone }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch user orders" });
  }
});

// GET SINGLE ORDER BY ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch order" });
  }
});

module.exports = router;