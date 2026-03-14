const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      default: "Erbil",
      trim: true,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },

    addressType: {
      type: String,
      default: "",
      trim: true,
    },

    buildingName: {
      type: String,
      default: "",
      trim: true,
    },

    apartmentNumber: {
      type: String,
      default: "",
      trim: true,
    },

    floor: {
      type: String,
      default: "",
      trim: true,
    },

    street: {
      type: String,
      default: "",
      trim: true,
    },

    additionalDirections: {
      type: String,
      default: "",
      trim: true,
    },

    lat: {
      type: Number,
      default: null,
    },

    lng: {
      type: Number,
      default: null,
    },

    googleMapsLink: {
      type: String,
      default: "",
      trim: true,
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "fib"],
      default: "cash",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "cancelled"],
      default: "pending",
    },

    fibSenderPhone: {
      type: String,
      default: "",
      trim: true,
    },

    fibTransactionId: {
      type: String,
      default: "",
      trim: true,
    },

    fibReference: {
      type: String,
      default: "",
      trim: true,
    },

    fibPaymentId: {
      type: String,
      default: "",
      trim: true,
    },

    fibPaymentUrl: {
      type: String,
      default: "",
      trim: true,
    },

    fibQrCode: {
      type: String,
      default: "",
      trim: true,
    },

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "on-the-way",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    statusTimeline: {
      pendingAt: {
        type: Date,
        default: Date.now,
      },
      confirmedAt: {
        type: Date,
        default: null,
      },
      preparingAt: {
        type: Date,
        default: null,
      },
      onTheWayAt: {
        type: Date,
        default: null,
      },
      deliveredAt: {
        type: Date,
        default: null,
      },
      cancelledAt: {
        type: Date,
        default: null,
      },
    },

    orderItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        name: {
          type: String,
          required: true,
          trim: true,
        },

        imageUrl: {
          type: String,
          default: "",
          trim: true,
        },

        price: {
          type: Number,
          required: true,
        },

        qty: {
          type: Number,
          required: true,
          default: 1,
        },

        weight: {
          type: String,
          default: "",
          trim: true,
        },
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);