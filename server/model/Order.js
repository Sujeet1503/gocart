const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, default: 1 },
    price: Number
  }],
  shippingAddress: {
    fullName: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    landmark: String,
    addressType: String
  },
  paymentMethod: {
    type: String,
    enum: ["upi", "card", "netbanking", "cod"],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending"
  },
  orderStatus: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
    default: "pending"
  },
  subtotal: Number,
  tax: Number,
  total: Number,
  orderDate: { type: Date, default: Date.now },
  deliveryDate: Date
}, {
  timestamps: true
});

const Order = mongoose.model("Order", orderSchema);
module.exports = { Order };