import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const [qr, setQr] = useState(null);
  const [amount, setAmount] = useState(0);
  const [paymentDone, setPaymentDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const res = await axios.get("http://localhost:8080/cart", {
          headers: { token },
        });
        
        const cart = res.data.cart;
        if (cart && cart.products) {
          setCartItems(cart.products);
          setAmount(cart.total || 0);
          
          // Generate QR for the total amount
          if (cart.total > 0) {
            const paymentRes = await axios.post(
              "http://localhost:8080/payment",
              { amount: cart.total }
            );
            setQr(paymentRes.data.qrImage);
          }
        }
      } catch (err) {
        console.log("Payment fetch error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [token]);

  const handlePaymentSuccess = async () => {
    setPaymentDone(true);
    
    // Clear cart after successful payment
    try {
      await axios.delete("http://localhost:8080/cart/clear", {
        headers: { token }
      });
    } catch (err) {
      console.log("Cart clear error:", err);
    }
    
    // Redirect to success page after 2 seconds
    setTimeout(() => {
      navigate("/payment-success");
    }, 2000);
  };

  if (loading) {
    return (
      <div className="payment-container">
        <div className="loading-spinner">Loading payment details...</div>
      </div>
    );
  }

  if (paymentDone) {
    return (
      <div className="payment-container">
        <div className="payment-success-message">
          <div className="success-animation">✅</div>
          <h2>Payment Successful!</h2>
          <p>Redirecting to order confirmation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h2>Complete Your Payment</h2>
        <p>Secure and fast payment processing</p>
      </div>

      <div className="payment-content">
        {/* Order Summary */}
        <div className="order-summary-card">
          <h3>🛒 Order Summary</h3>
          <div className="order-items">
            {cartItems.map((item, index) => (
              <div key={index} className="order-item">
                <img src={item.image} alt={item.name} className="item-image" />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p className="item-price">₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="order-total">
            <div className="total-line">
              <span>Subtotal:</span>
              <span>₹{amount}</span>
            </div>
            <div className="total-line">
              <span>Shipping:</span>
              <span>FREE</span>
            </div>
            <div className="total-line grand-total">
              <span>Total Amount:</span>
              <span className="amount">₹{amount}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="payment-methods">
          <h3>💳 Payment Method</h3>
          <div className="method-option active">
            <div className="method-icon">📱</div>
            <div className="method-info">
              <h4>UPI Payment</h4>
              <p>Scan QR code with any UPI app</p>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="qr-section">
          <h3>📲 Scan to Pay</h3>
          {qr ? (
            <div className="qr-container">
              <img src={qr} alt="UPI QR Code" className="qr-code" />
              <p className="scan-instruction">Open PhonePe, GPay, Paytm or any UPI app</p>
            </div>
          ) : (
            <div className="no-qr">QR code not available</div>
          )}
        </div>

        {/* Payment Actions */}
        <div className="payment-actions">
          <button 
            onClick={handlePaymentSuccess} 
            className="payment-success-btn"
            disabled={!amount}
          >
            ✅ I've Completed Payment
          </button>
          
          <div className="action-buttons">
            <button 
              onClick={() => navigate('/cart')} 
              className="secondary-btn"
            >
              ← Back to Cart
            </button>
            <button 
              onClick={() => navigate('/products')} 
              className="secondary-btn"
            >
              🛒 Continue Shopping
            </button>
          </div>
        </div>

        {/* Security Features */}
        <div className="security-features">
          <div className="security-badge">🔒 Secure Payment</div>
          <div className="security-badge">🚀 Instant Processing</div>
          <div className="security-badge">📧 Email Receipt</div>
        </div>
      </div>
    </div>
  );
};

export default Payment;