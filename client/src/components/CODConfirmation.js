import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const CODConfirmation = () => {
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const navigate = useNavigate();

  const handleCODPayment = async () => {
    if (!acceptedTerms) {
      alert("Please accept the terms and conditions");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const shippingAddress = JSON.parse(localStorage.getItem("shippingAddress") || "{}");
      
      // Create order with COD payment method
      await axios.post(
        "http://localhost:8080/order/create",
        { 
          shippingAddress, 
          paymentMethod: "cod" 
        },
        { headers: { token } }
      );

      setLoading(false);
      navigate("/payment-success");
    } catch (err) {
      console.log("Order creation error:", err);
      setLoading(false);
      alert("Failed to place order. Please try again.");
    }
  };

  const shippingAddress = JSON.parse(localStorage.getItem("shippingAddress") || "{}");

  return (
    <div className="payment-container">
      {/* Animated Background */}
      <div className="payment-bg-animation">
        <div className="payment-shape shape-1"></div>
        <div className="payment-shape shape-2"></div>
        <div className="payment-shape shape-3"></div>
      </div>

      <div className="payment-header">
        <h1>💰 Cash on Delivery</h1>
        <p>Pay when you receive your order</p>
      </div>

      <div className="payment-content-enhanced">
        <div className="cod-confirmation-section-enhanced">
          <div className="confirmation-card-enhanced">
            {/* Header */}
            <div className="confirmation-header">
              <div className="confirmation-icon-animated">
                <div className="cash-icon">💰</div>
                <div className="pulse-ring"></div>
              </div>
              <div className="confirmation-title">
                <h2>Cash on Delivery Selected</h2>
                <p className="confirmation-subtitle-enhanced">
                  No online payment required. Pay when your order arrives!
                </p>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="order-timeline">
              <div className="timeline-item active">
                <div className="timeline-marker">1</div>
                <div className="timeline-content">
                  <strong>Order Confirmed</strong>
                  <span>We've received your order</span>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker">2</div>
                <div className="timeline-content">
                  <strong>Order Shipped</strong>
                  <span>Preparing for delivery</span>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker">3</div>
                <div className="timeline-content">
                  <strong>Out for Delivery</strong>
                  <span>On its way to you</span>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker">4</div>
                <div className="timeline-content">
                  <strong>Payment & Delivery</strong>
                  <span>Pay when you receive</span>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="delivery-info-section">
              <h3 className="section-title-cod">🚚 Delivery Information</h3>
              <div className="delivery-card">
                <div className="delivery-address">
                  <div className="address-icon">🏠</div>
                  <div className="address-details">
                    <strong>Delivery Address</strong>
                    <p>{shippingAddress.street}</p>
                    <p>{shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}</p>
                    <p>📞 {shippingAddress.phone}</p>
                  </div>
                </div>
                <div className="delivery-time">
                  <div className="time-icon">⏰</div>
                  <div className="time-details">
                    <strong>Estimated Delivery</strong>
                    <p>2-3 Business Days</p>
                    <span className="delivery-badge">Express</span>
                  </div>
                </div>
              </div>
            </div>

            {/* COD Benefits */}
            <div className="cod-benefits-enhanced">
              <h3 className="section-title-cod">🎁 Why Choose COD?</h3>
              <div className="benefits-grid-enhanced">
                <div className="benefit-card">
                  <div className="benefit-icon-enhanced">🔄</div>
                  <div className="benefit-content">
                    <strong>Easy Returns</strong>
                    <p>7-day return policy</p>
                  </div>
                </div>
                <div className="benefit-card">
                  <div className="benefit-icon-enhanced">💰</div>
                  <div className="benefit-content">
                    <strong>No Pre-Payment</strong>
                    <p>Pay only after verification</p>
                  </div>
                </div>
                <div className="benefit-card">
                  <div className="benefit-icon-enhanced">✅</div>
                  <div className="benefit-content">
                    <strong>Product Verification</strong>
                    <p>Check before you pay</p>
                  </div>
                </div>
                <div className="benefit-card">
                  <div className="benefit-icon-enhanced">🛡️</div>
                  <div className="benefit-content">
                    <strong>100% Safe</strong>
                    <p>Zero risk transaction</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Instructions */}
            <div className="instructions-section">
              <h3 className="section-title-cod">📋 Important Instructions</h3>
              <div className="instructions-list">
                <div className="instruction-item">
                  <span className="instruction-icon">💵</span>
                  <span>Please keep exact change ready for the delivery executive</span>
                </div>
                <div className="instruction-item">
                  <span className="instruction-icon">📞</span>
                  <span>Our delivery partner will call you 30 minutes before arrival</span>
                </div>
                <div className="instruction-item">
                  <span className="instruction-icon">📦</span>
                  <span>Inspect the products thoroughly before making payment</span>
                </div>
                <div className="instruction-item">
                  <span className="instruction-icon">🔄</span>
                  <span>You can return products within 7 days if unsatisfied</span>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="terms-section">
              <label className="terms-checkbox">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                <span className="checkmark-cod"></span>
                <span className="terms-text">
                  I agree to the <Link to="/terms" className="terms-link">Terms & Conditions</Link> and 
                  understand that I'll pay the full amount upon delivery
                </span>
              </label>
            </div>

            {/* Confirmation Actions */}
            <div className="confirmation-actions-enhanced">
              <button 
                onClick={handleCODPayment} 
                className="confirm-order-btn-enhanced"
                disabled={!acceptedTerms || loading}
              >
                {loading ? (
                  <>
                    <div className="spinner-enhanced"></div>
                    <span>Placing Your Order...</span>
                  </>
                ) : (
                  <>
                    <span>✅ Confirm COD Order</span>
                    <span className="btn-sparkle">✨</span>
                  </>
                )}
              </button>
              
              <Link to="/payment-options" className="back-link-cod">
                <span className="back-arrow">←</span>
                Change Payment Method
              </Link>
            </div>

            {/* Support Info */}
            <div className="support-info">
              <div className="support-icon">💬</div>
              <div className="support-text">
                <strong>Need help?</strong>
                <span>Call us at 1800-123-4567 or chat with us</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CODConfirmation;