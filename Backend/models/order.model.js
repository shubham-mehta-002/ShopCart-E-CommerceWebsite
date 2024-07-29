const mongoose = require("mongoose");

const paymentMethods = ["card", "cash"];

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    billingName:{
      type:String
    },
    email:{
      type:String
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 0,
        },
        color: {
          type: String,
        },
        colorCode: {
          type: String,
        },
        size: {
          type: String,
        },
        status: {
          type: String,
          default: "pending",
          enum:["pending","delivered","received","dispatched","cancelled"]
        },
      },
    ],
    phoneNumber: {
      type: String,
      required: true,
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pinCode: {
        type: String,
        required: true,
      },
    },
    paymentMethod: {
      type: String,
      lowercase:true,
      enum: paymentMethods,
      required: true,
    },
    totalAmount: {
      type: Number,
    },
    paymentStatus: {
      type: String,
      default: "pending",
      enum:["pending","fulfilled"]
    },
    totalItems: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
