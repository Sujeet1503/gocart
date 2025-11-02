import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const CardPayment = () => {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
    saveCard: false
  });
  const [loading, setLoading] = useState(false);
  const [cardType, setCardType] = useState("");
  const navigate = useNavigate();

  const handleCardChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "cardNumber") {
      const formatted = formatCardNumber(value);
      detectCardType(formatted);
      setCardDetails(prev => ({
        ...prev,
        [name]: formatted
      }));
    } else if (name === "expiryDate") {
      const formatted = formatExpiryDate(value);
      setCardDetails(prev => ({
        ...prev,
        [name]: formatted
      }));
    } else {
      setCardDetails(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const detectCardType = (cardNumber) => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    
    if (/^4/.test(cleanNumber)) {
      setCardType("visa");
    } else if (/^5[1-5]/.test(cleanNumber)) {
      setCardType("mastercard");
    } else if (/^3[47]/.test(cleanNumber)) {
      setCardType("amex");
    } else if (/^6(?:011|5)/.test(cleanNumber)) {
      setCardType("discover");
    } else {
      setCardType("");
    }
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
  };

  const formatExpiryDate = (value) => {
    return value.replace(/\//g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
  };

  const handleCardPayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment processing
    setTimeout(async () => {
      try {
        const token = localStorage.getItem("token");
        const shippingAddress = JSON.parse(localStorage.getItem("shippingAddress") || "{}");
        
        // Create order
        await axios.post(
          "http://localhost:8080/order/create",
          { 
            shippingAddress, 
            paymentMethod: "card" 
          },
          { headers: { token } }
        );

        setLoading(false);
        navigate("/payment-success");
      } catch (err) {
        console.log("Payment error:", err);
        setLoading(false);
        alert("Payment failed. Please try again.");
      }
    }, 3000);
  };

  const getCardIcon = () => {
    switch(cardType) {
      case "visa": return "💳";
      case "mastercard": return "🔵";
      case "amex": return "🟡";
      case "discover": return "🔴";
      default: return "💳";
    }
  };

  return (
    <div className="payment-container">
      {/* Animated Background */}
      <div className="payment-bg-animation">
        <div className="payment-shape shape-1"></div>
        <div className="payment-shape shape-2"></div>
        <div className="payment-shape shape-3"></div>
      </div>

      <div className="payment-header">
        <h1>💳 Card Payment</h1>
        <p>Enter your card details securely</p>
      </div>

      <div className="payment-content-enhanced">
        <div className="payment-form-section-enhanced">
          <div className="form-header-card">
            <div className="card-preview">
              <div className="card-chip">💳</div>
              {cardType && (
                <div className="card-type-indicator">
                  <span className="card-icon">{getCardIcon()}</span>
                  <span className="card-type-name">
                    {cardType.charAt(0).toUpperCase() + cardType.slice(1)}
                  </span>
                </div>
              )}
            </div>
            <div className="form-progress">
              <div className="progress-step active">1</div>
              <div className="progress-step">2</div>
              <div className="progress-step">3</div>
            </div>
          </div>

          <form onSubmit={handleCardPayment} className="payment-form-enhanced">
            <div className="form-group-enhanced">
              <label>Card Number *</label>
              <div className="input-with-icon">
                <input
                  type="text"
                  name="cardNumber"
                  value={cardDetails.cardNumber}
                  onChange={handleCardChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  required
                  className={cardType ? `card-input ${cardType}` : "card-input"}
                />
                {cardType && (
                  <span className="input-icon">{getCardIcon()}</span>
                )}
              </div>
            </div>

            <div className="form-row-enhanced">
              <div className="form-group-enhanced">
                <label>Expiry Date *</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={cardDetails.expiryDate}
                  onChange={handleCardChange}
                  placeholder="MM/YY"
                  maxLength="5"
                  required
                />
              </div>
              <div className="form-group-enhanced">
                <label>CVV *</label>
                <div className="cvv-input-container">
                  <input
                    type="text"
                    name="cvv"
                    value={cardDetails.cvv}
                    onChange={handleCardChange}
                    placeholder="123"
                    maxLength="3"
                    required
                  />
                  <span className="cvv-info" title="3-digit code on back of card">ℹ️</span>
                </div>
              </div>
            </div>

            <div className="form-group-enhanced">
              <label>Name on Card *</label>
              <input
                type="text"
                name="nameOnCard"
                value={cardDetails.nameOnCard}
                onChange={handleCardChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-checkbox-enhanced">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="saveCard"
                  checked={cardDetails.saveCard}
                  onChange={handleCardChange}
                />
                <span className="checkmark-enhanced"></span>
                Save this card for faster payments
              </label>
            </div>

            <div className="payment-security-enhanced">
              <div className="security-header">
                <span className="security-icon">🔒</span>
                <span>Secure Payment</span>
              </div>
              <div className="security-features-grid">
                <div className="security-feature">
                  <span>🔐</span>
                  <span>256-bit SSL</span>
                </div>
                <div className="security-feature">
                  <span>🛡️</span>
                  <span>PCI DSS</span>
                </div>
                <div className="security-feature">
                  <span>💰</span>
                  <span>100% Safe</span>
                </div>
              </div>
            </div>

            <div className="payment-actions-enhanced">
              <button type="submit" className="payment-submit-btn-enhanced" disabled={loading}>
                {loading ? (
                  <>
                    <div className="spinner-enhanced"></div>
                    <span>Processing Payment...</span>
                    <div className="payment-pulse"></div>
                  </>
                ) : (
                  <>
                    <span>Pay Securely</span>
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </button>
              
              <Link to="/payment-options" className="back-link-enhanced">
                <span className="back-arrow">←</span>
                Back to Payment Options
              </Link>
            </div>
          </form>
        </div>

        <div className="payment-summary-section-enhanced">
          <div className="summary-card-enhanced">
            <div className="summary-header">
              <h3>🎯 Payment Summary</h3>
              <div className="secure-badge">
                <span>🔒</span>
                <span>Secure</span>
              </div>
            </div>
            
            <div className="accepted-cards-enhanced">
              <h4>We Accept</h4>
              <div className="card-brands">
                <div className="card-brand visa">
                  <span>💳</span>
                  <span>Visa</span>
                </div>
                <div className="card-brand mastercard">
                  <span>🔵</span>
                  <span>Mastercard</span>
                </div>
                <div className="card-brand amex">
                  <span>🟡</span>
                  <span>Amex</span>
                </div>
                <div className="card-brand rupay">
                  <span>🇮🇳</span>
                  <span>RuPay</span>
                </div>
              </div>
            </div>

            <div className="benefits-list">
              <h4>✨ Benefits</h4>
              <div className="benefit-item">
                <span className="benefit-icon">⚡</span>
                <div className="benefit-text">
                  <strong>Instant Processing</strong>
                  <span>Real-time payment confirmation</span>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">🛡️</span>
                <div className="benefit-text">
                  <strong>Zero Fraud Liability</strong>
                  <span>You're protected from fraud</span>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">💎</span>
                <div className="benefit-text">
                  <strong>Reward Points</strong>
                  <span>Earn rewards on every purchase</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPayment;