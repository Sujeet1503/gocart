import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get("http://localhost:8080/cart", {
          headers: { token },
        });
        setCart(res.data.cart);
        setError("");
      } catch (err) {
        console.log("Cart fetch error:", err.response?.data || err.message);
        setError("Failed to load cart");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchCart();
    } else {
      navigate("/login");
    }
  }, [token, navigate]);

  const removeFromCart = async (productId, productName) => {
    if (!window.confirm(`Remove ${productName} from cart?`)) return;
    
    try {
      await axios.delete("http://localhost:8080/cart/product/delete", {
        headers: { token },
        data: { productID: productId }
      });
      const res = await axios.get("http://localhost:8080/cart", {
        headers: { token },
      });
      setCart(res.data.cart);
    } catch (err) {
      console.log("Remove error:", err.response?.data || err.message);
      setError("Failed to remove item");
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await axios.put("http://localhost:8080/cart/product/update", 
        { productID: productId, quantity: newQuantity },
        { headers: { token } }
      );
      const res = await axios.get("http://localhost:8080/cart", {
        headers: { token },
      });
      setCart(res.data.cart);
    } catch (err) {
      console.log("Update error:", err.response?.data || err.message);
      setError("Failed to update quantity");
    }
  };

  const proceedToAddress = () => {
    navigate("/address");
  };

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading your cart...</p>
    </div>
  );

  if (!cart || !cart.products || cart.products.length === 0) return (
    <div className="empty-cart-enhanced">
      <div className="empty-cart-icon">🛒</div>
      <h2 className="empty-cart-title">Your Cart is Empty</h2>
      <p className="empty-cart-subtitle">Looks like you haven't added any items to your cart yet.</p>
      <Link to="/products" className="continue-shopping-enhanced">
        Start Shopping
      </Link>
    </div>
  );

  return (
    <div className="cart-page">
      <header className="cart-header">
        <h1>Your Shopping Cart</h1>
        <p>Review your items and proceed to checkout</p>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="cart-main">
        <div className="cart-items-section">
          <div className="cart-items-enhanced">
            {cart.products.map((product) => (
              <div key={product._id} className="cart-item-enhanced">
                <div className="item-info">
                  <img 
                    src={product.image || "/placeholder-image.jpg"} 
                    alt={product.name} 
                    className="cart-item-image" 
                  />
                  <div className="cart-item-details">
                    <div className="cart-item-header">
                      <h3 className="cart-item-title">{product.name}</h3>
                      <span className="cart-item-brand">{product.category || "Electronics"}</span>
                    </div>
                    <p className="cart-item-description">
                      {product.description || "High-quality product with excellent features"}
                    </p>
                    <div className="cart-item-meta">
                      <div className="cart-item-price">₹{product.price}</div>
                      <div className="cart-item-actions">
                        <div className="quantity-controls">
                          <button 
                            onClick={() => updateQuantity(product._id, (product.quantity || 1) - 1)}
                            className="quantity-btn"
                            disabled={(product.quantity || 1) <= 1}
                          >
                            -
                          </button>
                          <span className="quantity-display">{product.quantity || 1}</span>
                          <button 
                            onClick={() => updateQuantity(product._id, (product.quantity || 1) + 1)}
                            className="quantity-btn"
                          >
                            +
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(product._id, product.name)}
                          className="remove-btn-enhanced"
                          title="Remove item"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="cart-summary-enhanced">
          <div className="summary-card">
            <h3 className="summary-title">Order Summary</h3>
            
            <div className="summary-items">
              <div className="summary-item">
                <span className="summary-label">Subtotal ({cart.products.length} items):</span>
                <span className="summary-value">₹{cart.subtotal || cart.total}</span>
              </div>
              
              <div className="summary-item">
                <span className="summary-label">Shipping:</span>
                <span className="summary-value free-shipping">FREE</span>
              </div>
              
              <div className="summary-item">
                <span className="summary-label">Tax:</span>
                <span className="summary-value">₹{(cart.total * 0.18).toFixed(2)}</span>
              </div>
            </div>
            
            <div className="summary-total">
              <span className="total-label">Total:</span>
              <span className="total-amount">₹{(cart.total * 1.18).toFixed(2)}</span>
            </div>

            <div className="cart-actions">
              <button 
                onClick={proceedToAddress} 
                className="payment-btn-enhanced"
              >
                🚚 Proceed to Address
              </button>

              <Link to="/products" className="continue-shopping-enhanced">
                ← Continue Shopping
              </Link>
            </div>

            <div className="cart-security">
              <div className="security-badge">🔒 Secure Checkout</div>
              <div className="security-badge">🚚 Free Delivery</div>
              <div className="security-badge">↩️ Easy Returns</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;