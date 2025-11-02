import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const PaymentOptions = () => {
  const [selectedMethod, setSelectedMethod] = useState("");
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartTotal = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await axios.get("http://localhost:8080/cart", {
            headers: { token },
          });
          setCartTotal(res.data.cart?.total || 0);
        } catch (err) {
          console.log("Error fetching cart total:", err);
        }
      }
    };
    fetchCartTotal();
  }, []);

  const paymentMethods = [
    {
      id: "upi",
      name: "UPI Payment",
      icon: "📱",
      description: "Fast & secure UPI payment",
      popular: true
    },
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: "💳",
      description: "Pay with your card securely",
      popular: false
    },
    {
      id: "netbanking",
      name: "Net Banking",
      icon: "🏦",
      description: "Transfer from your bank",
      popular: false
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      icon: "💰",
      description: "Pay when you receive",
      popular: true
    }
  ];

  const handlePaymentSelection = (methodId) => {
    setSelectedMethod(methodId);
  };

  const proceedToPayment = () => {
    if (!selectedMethod) {
      alert("Please select a payment method");
      return;
    }

    setLoading(true);
    
    // Navigate to specific payment page based on selection
    setTimeout(() => {
      setLoading(false);
      if (selectedMethod === "upi") {
        navigate("/payment");
      } else if (selectedMethod === "card") {
        navigate("/card-payment");
      } else if (selectedMethod === "cod") {
        navigate("/cod-confirmation");
      } else {
        navigate("/netbanking");
      }
    }, 1000);
  };

  return (
    <div className="payment-options-container">
      <div className="payment-header">
        <h1>💳 Choose Payment Method</h1>
        <p>Select your preferred way to pay</p>
      </div>

      <div className="payment-main">
        <div className="payment-methods-section">
          <div className="methods-grid">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`method-card ${selectedMethod === method.id ? "selected" : ""}`}
                onClick={() => handlePaymentSelection(method.id)}
              >
                <div className="method-header">
                  <div className="method-icon">{method.icon}</div>
                  <div className="method-info">
                    <h3>{method.name}</h3>
                    <p>{method.description}</p>
                  </div>
                  {method.popular && (
                    <div className="popular-badge">Popular</div>
                  )}
                </div>
                <div className="method-selector">
                  <div className={`radio-btn ${selectedMethod === method.id ? "active" : ""}`}>
                    {selectedMethod === method.id && "✓"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="payment-security">
            <h4>🔒 Your payment is secure with us</h4>
            <div className="security-features">
              <div className="security-item">
                <span className="security-icon">🛡️</span>
                <span>256-bit SSL Encryption</span>
              </div>
              <div className="security-item">
                <span className="security-icon">🔐</span>
                <span>PCI DSS Compliant</span>
              </div>
              <div className="security-item">
                <span className="security-icon">💰</span>
                <span>100% Payment Protection</span>
              </div>
            </div>
          </div>
        </div>

        <div className="order-summary-section">
          <div className="summary-card">
            <h3>📦 Order Summary</h3>
            
            <div className="summary-items">
              <div className="summary-item">
                <span>Items Total:</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="summary-item">
                <span>Delivery:</span>
                <span className="free">FREE</span>
              </div>
              <div className="summary-item">
                <span>Tax (18%):</span>
                <span>₹{(cartTotal * 0.18).toFixed(2)}</span>
              </div>
            </div>

            <div className="summary-total">
              <span>Total Amount:</span>
              <span className="total-amount">₹{(cartTotal * 1.18).toFixed(2)}</span>
            </div>

            <div className="selected-method">
              {selectedMethod && (
                <>
                  <h4>Selected Method:</h4>
                  <div className="selected-method-display">
                    <span className="method-icon">
                      {paymentMethods.find(m => m.id === selectedMethod)?.icon}
                    </span>
                    <span>{paymentMethods.find(m => m.id === selectedMethod)?.name}</span>
                  </div>
                </>
              )}
            </div>

            <div className="payment-actions">
              <button
                onClick={proceedToPayment}
                className="proceed-btn"
                disabled={!selectedMethod || loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Processing...
                  </>
                ) : (
                  `Pay ₹${(cartTotal * 1.18).toFixed(2)}`
                )}
              </button>
              
              <Link to="/address" className="back-link">
                ← Back to Address
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptions;