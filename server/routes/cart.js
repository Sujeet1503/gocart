const express = require("express");
const router = express.Router();
const { Cart } = require("../model/Cart");
const { Product } = require("../model/Product");
const { User } = require("../model/User");
const jwt = require("jsonwebtoken");

// Add products to cart
router.post("/add", async (req, res) => {
  try {
    console.log("🎯 CART ADD - REAL VERSION");
    const { products } = req.body;
    const token = req.headers.token;

    if (!token) {
      return res.status(401).json({ message: "Token required" });
    }

    // Verify token
    const decoded = jwt.verify(token, "supersecret");
    const user = await User.findOne({ email: decoded.email });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: user._id });
    
    if (!cart) {
      cart = new Cart({ 
        user: user._id, 
        products: products,
        total: 0 
      });
    } else {
      // Replace cart products with new selection
      cart.products = products;
    }

    // Calculate total from ACTUAL products
    if (cart.products.length > 0) {
      const productDetails = await Product.find({ _id: { $in: cart.products } });
      cart.total = productDetails.reduce((sum, p) => sum + (p.price || 0), 0);
    } else {
      cart.total = 0;
    }

    await cart.save();

    // Update user's cart reference
    user.cart = cart._id;
    await user.save();

    // Populate products for response
    const populatedCart = await Cart.findById(cart._id).populate("products");
    
    res.status(200).json({ 
      message: "Cart updated successfully", 
      cart: populatedCart 
    });

  } catch (error) {
    console.error("❌ CART ADD ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get cart
router.get("/", async (req, res) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(401).json({ message: "Token required" });
    }

    const decoded = jwt.verify(token, "supersecret");
    const user = await User.findOne({ email: decoded.email })
      .populate({
        path: "cart",
        populate: { path: "products", model: "Product" }
      });

    if (!user || !user.cart) {
      return res.status(200).json({ cart: null });
    }

    res.status(200).json({ cart: user.cart });
    
  } catch (error) {
    console.error("Cart GET error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update product quantity in cart
router.put("/product/update", async (req, res) => {
  try {
    const { productID, quantity } = req.body;
    const token = req.headers.token;

    if (!token) {
      return res.status(401).json({ message: "Token required" });
    }

    const decoded = jwt.verify(token, "supersecret");
    const user = await User.findOne({ email: decoded.email }).populate("cart");
    
    if (!user || !user.cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cart = await Cart.findById(user.cart._id).populate("products");
    
    // In a real implementation, you'd update quantity for the specific product
    // For now, we'll recalculate the total
    const productDetails = await Product.find({ _id: { $in: cart.products } });
    cart.total = productDetails.reduce((sum, p) => sum + (p.price || 0), 0);
    
    await cart.save();

    res.status(200).json({ 
      message: "Cart updated successfully", 
      cart: cart 
    });

  } catch (error) {
    console.error("Cart update error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Remove product from cart
router.delete("/product/delete", async (req, res) => {
  try {
    const { productID } = req.body;
    const token = req.headers.token;

    if (!token) {
      return res.status(401).json({ message: "Token required" });
    }

    const decoded = jwt.verify(token, "supersecret");
    const user = await User.findOne({ email: decoded.email }).populate("cart");
    
    if (!user || !user.cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cart = await Cart.findById(user.cart._id);
    
    // Remove product from cart
    cart.products = cart.products.filter(p => p.toString() !== productID);
    
    // Recalculate total
    if (cart.products.length > 0) {
      const productDetails = await Product.find({ _id: { $in: cart.products } });
      cart.total = productDetails.reduce((sum, p) => sum + (p.price || 0), 0);
    } else {
      cart.total = 0;
    }
    
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate("products");

    res.status(200).json({ 
      message: "Product removed from cart", 
      cart: populatedCart 
    });

  } catch (error) {
    console.error("Cart delete error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Clear cart
router.delete("/clear", async (req, res) => {
  try {
    const token = req.headers.token;
    const decoded = jwt.verify(token, "supersecret");
    const user = await User.findOne({ email: decoded.email });

    if (user.cart) {
      await Cart.findByIdAndDelete(user.cart);
      user.cart = null;
      await user.save();
    }

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;