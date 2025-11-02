const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  token: String,
  role: { type: String, default: "user" },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
  addresses: [{
    fullName: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    landmark: String,
    addressType: { type: String, default: "home" },
    isDefault: { type: Boolean, default: false }
  }]
});

const User = mongoose.model("User", UserSchema);
module.exports = { User };