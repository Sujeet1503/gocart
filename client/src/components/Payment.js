import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const [qr, setQr] = useState(null);
  const [amount, setAmount] = useState(0);
  const [paymentDone, setPaymentDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0
  });
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
          const subtotal = cart.total || 0;
          const tax = subtotal * 0.18;
          const total = subtotal + tax;
          
          setAmount(total);
          setOrderSummary({
            subtotal: subtotal,
            shipping: 0, // FREE
            tax: tax,
            total: total
          });
          
          // Generate QR for the total amount
          if (subtotal > 0) {
            const paymentRes = await axios.post(
              "http://localhost:8080/payment",
              { amount: total, paymentMethod: "upi" }
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
    
    // Create order
    const shippingAddress = JSON.parse(localStorage.getItem("shippingAddress") || "{}");
    try {
      await axios.post(
        "http://localhost:8080/order/create",
        { 
          shippingAddress, 
          paymentMethod: "upi" 
        },
        { headers: { token } }
      );
    } catch (err) {
      console.log("Order creation error:", err);
    }
    
    // Redirect to success page after 2 seconds
    setTimeout(() => {
      navigate("/payment-success");
    }, 2000);
  };

  if (loading) {
    return (
      <div className="payment-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading payment details...</p>
        </div>
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
      {/* Animated Background */}
      <div className="payment-bg-animation">
        <div className="payment-shape shape-1"></div>
        <div className="payment-shape shape-2"></div>
        <div className="payment-shape shape-3"></div>
      </div>

      <div className="payment-header">
        <h1>💳 Complete Your Payment</h1>
        <p>Secure and fast payment processing</p>
      </div>

      <div className="payment-content-enhanced">
        <div className="payment-form-section-enhanced">
          <div className="order-summary-card-enhanced">
            <h3>🛒 Order Summary</h3>
            <div className="order-items-list">
              {cartItems.map((item, index) => (
                <div key={index} className="order-item-enhanced">
                  <img 
                    src={item.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=60&h=60&fit=crop"} 
                    alt={item.name} 
                    className="item-image-enhanced"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=60&h=60&fit=crop";
                    }}
                  />
                  <div className="item-details-enhanced">
                    <h4>{item.name}</h4>
                    <p className="item-price">₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-total-enhanced">
              <div className="total-line">
                <span>Subtotal:</span>
                <span>₹{orderSummary.subtotal.toFixed(2)}</span>
              </div>
              <div className="total-line">
                <span>Shipping:</span>
                <span className="free-shipping">FREE</span>
              </div>
              <div className="total-line">
                <span>Tax (18%):</span>
                <span>₹{orderSummary.tax.toFixed(2)}</span>
              </div>
              <div className="total-line grand-total">
                <span>Total Amount:</span>
                <span className="amount">₹{orderSummary.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="payment-methods-section">
            <h3>📱 UPI Payment</h3>
            <div className="method-option active">
              <div className="method-icon">📱</div>
              <div className="method-info">
                <h4>Scan & Pay</h4>
                <p>Scan QR code with any UPI app</p>
              </div>
            </div>
          </div>

          <div className="qr-section-enhanced">
            <h3>📲 Scan to Pay</h3>
            {qr ? (
              <div className="qr-container-enhanced">
                <img src={qr} alt="UPI QR Code" className="qr-code-enhanced" />
                <p className="scan-instruction">
                  Open PhonePe, GPay, Paytm or any UPI app to scan
                </p>
                <div className="upi-apps">
                  <span>📱 PhonePe</span>
                  <span>💳 GPay</span>
                  <span>🛒 Paytm</span>
                  <span>💎 BHIM</span>
                </div>
              </div>
            ) : (
              <div className="no-qr-enhanced">
                <div className="no-qr-icon">📱</div>
                <h4>QR Code Not Available</h4>
                <p>Please try refreshing the page</p>
              </div>
            )}
          </div>

          <div className="payment-actions-enhanced">
            <button 
              onClick={handlePaymentSuccess} 
              className="payment-success-btn-enhanced"
              disabled={!amount}
            >
              ✅ I've Completed Payment
            </button>
            
            <div className="action-buttons-enhanced">
              <button 
                onClick={() => navigate('/payment-options')} 
                className="secondary-btn-enhanced"
              >
                ← Back to Payment Options
              </button>
              <button 
                onClick={() => navigate('/products')} 
                className="secondary-btn-enhanced"
              >
                🛒 Continue Shopping
              </button>
            </div>
          </div>

          <div className="security-features-enhanced">
            <div className="security-badge">🔒 Secure Payment</div>
            <div className="security-badge">⚡ Instant Processing</div>
            <div className="security-badge">📧 Email Receipt</div>
          </div>
        </div>

        <div className="payment-summary-section-enhanced">
          <div className="summary-card-enhanced">
            <div className="summary-header">
              <h3>💡 Payment Tips</h3>
              <div className="secure-badge">
                <span>🛡️</span>
                <span>Secure</span>
              </div>
            </div>

            <div className="payment-tips">
              <div className="tip-item">
                <span className="tip-icon">📱</span>
                <div className="tip-content">
                  <strong>Use Any UPI App</strong>
                  <span>PhonePe, GPay, Paytm, etc.</span>
                </div>
              </div>
              <div className="tip-item">
                <span className="tip-icon">🔒</span>
                <div className="tip-content">
                  <strong>100% Secure</strong>
                  <span>Bank-level encryption</span>
                </div>
              </div>
              <div className="tip-item">
                <span className="tip-icon">⚡</span>
                <div className="tip-content">
                  <strong>Instant Confirmation</strong>
                  <span>Real-time processing</span>
                </div>
              </div>
            </div>

            <div className="support-section">
              <h4>Need Help?</h4>
              <div className="support-contacts">
                <div className="contact-item">
                  <span>📞</span>
                  <span>1800-123-4567</span>
                </div>
                <div className="contact-item">
                  <span>💬</span>
                  <span>Live Chat</span>
                </div>
                <div className="contact-item">
                  <span>📧</span>
                  <span>support@gocart.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;