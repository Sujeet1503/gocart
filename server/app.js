const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const morgan = require("morgan");
const QRCode = require("qrcode");
const dotenv = require("dotenv");
dotenv.config();

// Import models
const { User } = require("./model/User");
const { Product } = require("./model/Product");
const { Cart } = require("./model/Cart");
const { Order } = require("./model/Order");

// Import routes
const cartRoutes = require("./routes/cart");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/gocart")
.then(() => {
  console.log("DB connected");
  autoSeed(); // ✅ Auto-seed after connection
})
.catch(err => console.log("DB not connected", err));

// Auto-seed function
const autoSeed = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('🌱 No products found. Seeding database...');
      const { seedDB } = require('./seed');
      await seedDB();
      console.log('✅ Database seeded successfully!');
    } else {
      console.log(`✅ Database already has ${productCount} products`);
    }
  } catch (error) {
    console.log('❌ Seeding failed:', error);
  }
};

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use("/cart", cartRoutes);

// ✅ FIXED: Products endpoint - return only products array
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products); // ✅ Send only products array
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});

// Register user
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: "Missing fields" });

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = bcrypt.hashSync(password, 10);
        const token = jwt.sign({ email }, "supersecret", { expiresIn: "365d" });

        await User.create({ name, email, password: hashedPassword, token, role: "user" });
        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});

// Login user
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Email and password required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not registered" });

        const isPasswordCorrect = bcrypt.compareSync(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid password" });

        res.status(200).json({
            id: user._id,
            name: user.name,
            token: user.token,
            email: user.email,
            role: user.role
        });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});

// Add product
app.post('/add-product', async (req, res) => {
    try {
        const { name, image, price, description, stock, brand } = req.body;
        const { token } = req.headers;
        const decoded = jwt.verify(token, "supersecret");
        const user = await User.findOne({ email: decoded.email });

        const product = await Product.create({ name, image, price, description, stock, brand, user: user._id });
        res.status(201).json({ message: "Product added", product });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});

// Cart Routes (now moved to separate file)

// Get cart
app.get('/cart', async (req, res) => {
    try {
        const { token } = req.headers;
        const decoded = jwt.verify(token, "supersecret");
        const user = await User.findOne({ email: decoded.email }).populate({
            path: 'cart',
            populate: { path: 'products', model: 'Product' }
        });

        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "Cart fetched", cart: user.cart });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});

app.post('/cart/add', async (req, res) => {
    try {
        const { products } = req.body;
        const { token } = req.headers;
        const decoded = jwt.verify(token, "supersecret");
        const user = await User.findOne({ email: decoded.email });

        let cart;
        if (user.cart) {
            cart = await Cart.findById(user.cart).populate("products");
            const existingIds = cart.products.map(p => p._id.toString());
            for (let pid of products) {
                if (!existingIds.includes(pid)) cart.products.push(pid);
            }
        } else {
            cart = await Cart.create({ products, total: 0 });
            user.cart = cart._id;
            await user.save();
        }

        // Update total
        const productDocs = await Product.find({ _id: { $in: cart.products } });
        cart.total = productDocs.reduce((sum, p) => sum + p.price, 0);
        await cart.save();

        res.status(201).json({ message: "Cart updated", cart });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});

app.delete('/cart/product/delete', async (req, res) => {
    try {
        const { productID } = req.body;
        const { token } = req.headers;
        const decoded = jwt.verify(token, "supersecret");
        const user = await User.findOne({ email: decoded.email }).populate("cart");
        const cart = await Cart.findById(user.cart).populate("products");

        const idx = cart.products.findIndex(p => p._id.toString() === productID);
        if (idx === -1) return res.status(404).json({ message: "Product not in cart" });

        cart.products.splice(idx, 1);
        const productDocs = await Product.find({ _id: { $in: cart.products } });
        cart.total = productDocs.reduce((sum, p) => sum + p.price, 0);
        await cart.save();

        res.status(200).json({ message: "Product removed", cart });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err });
    }
});

// NEW ROUTES FOR ADDRESS AND ORDERS

// Save address
app.post('/address/save', async (req, res) => {
  try {
    const { address } = req.body;
    const { token } = req.headers;
    
    const decoded = jwt.verify(token, "supersecret");
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add new address
    user.addresses.push(address);
    await user.save();

    res.status(200).json({ 
      message: "Address saved successfully", 
      addresses: user.addresses 
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get user addresses
app.get('/addresses', async (req, res) => {
  try {
    const { token } = req.headers;
    const decoded = jwt.verify(token, "supersecret");
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ addresses: user.addresses });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Create order
app.post('/order/create', async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    const { token } = req.headers;
    
    const decoded = jwt.verify(token, "supersecret");
    const user = await User.findOne({ email: decoded.email })
      .populate({
        path: "cart",
        populate: { path: "products", model: "Product" }
      });

    if (!user || !user.cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cart = user.cart;
    
    // Calculate totals
    const subtotal = cart.total;
    const tax = subtotal * 0.18;
    const total = subtotal + tax;

    // Create order
    const order = new Order({
      user: user._id,
      products: cart.products.map(product => ({
        product: product._id,
        quantity: 1,
        price: product.price
      })),
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod,
      subtotal: subtotal,
      tax: tax,
      total: total,
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    });

    await order.save();

    // Clear cart after order creation
    await Cart.findByIdAndDelete(cart._id);
    user.cart = null;
    await user.save();

    res.status(201).json({ 
      message: "Order created successfully", 
      order: order 
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get user orders
app.get('/orders', async (req, res) => {
  try {
    const { token } = req.headers;
    const decoded = jwt.verify(token, "supersecret");
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const orders = await Order.find({ user: user._id })
      .populate("products.product")
      .sort({ orderDate: -1 });

    res.status(200).json({ orders: orders });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update payment status
app.put('/order/payment-status', async (req, res) => {
  try {
    const { orderId, paymentStatus } = req.body;
    const { token } = req.headers;
    
    const decoded = jwt.verify(token, "supersecret");
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const order = await Order.findOne({ _id: orderId, user: user._id });
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.paymentStatus = paymentStatus;
    
    if (paymentStatus === "completed") {
      order.orderStatus = "confirmed";
    }
    
    await order.save();

    res.status(200).json({ 
      message: "Payment status updated", 
      order: order 
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Enhanced Payment route
app.post("/payment", async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    
    if (paymentMethod === "cod") {
      // For Cash on Delivery, no QR needed
      return res.status(200).json({ 
        message: "Cash on Delivery selected", 
        paymentMethod: "cod",
        amount: amount 
      });
    }
    
    // For UPI payments, generate QR
    const upiId = process.env.UPI_ID || "8495982390@ybl";
    const upiName = "GoCart";
    const upiLink = `upi://pay?pa=${upiId}&pn=${upiName}&am=${amount}&cu=INR`;
    const qrImage = await QRCode.toDataURL(upiLink);

    res.status(200).json({ 
      message: "Payment QR Generated", 
      amount, 
      upiLink, 
      qrImage,
      paymentMethod: "upi"
    });
  } catch (err) {
    res.status(500).json({ message: "Payment QR Error", error: err.message });
  }
});

// Clear cart after payment
app.delete('/cart/clear', async (req, res) => {
  try {
    const { token } = req.headers;
    const decoded = jwt.verify(token, "supersecret");
    const user = await User.findOne({ email: decoded.email });

    if (user.cart) {
      await Cart.findByIdAndDelete(user.cart);
      user.cart = null;
      await user.save();
    }

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

// ✅ Manual seed endpoint for testing
app.get('/run-seed', async (req, res) => {
  try {
    const { seedDB } = require('./seed');
    await seedDB();
    res.json({ message: 'Database seeded successfully!' });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));