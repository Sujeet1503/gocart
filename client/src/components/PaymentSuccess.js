import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PaymentSuccess = () => {
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // Simulate order details - in real app, you'd fetch this from your backend
    const shippingAddress = JSON.parse(localStorage.getItem("shippingAddress") || "{}");
    const cartTotal = localStorage.getItem("cartTotal") || "0";
    const tax = (parseFloat(cartTotal) * 0.18).toFixed(2);
    const total = (parseFloat(cartTotal) + parseFloat(tax)).toFixed(2);
    
    setOrderDetails({
      orderId: `GO${Date.now()}`,
      orderDate: new Date().toLocaleDateString(),
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      total: total,
      shippingAddress: shippingAddress
    });

    // Clear cart from localStorage
    localStorage.removeItem("cartTotal");
  }, []);

  // Generate confetti effect
  useEffect(() => {
    const createConfetti = () => {
      const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
      const container = document.querySelector('.confetti-container');
      
      for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDelay = Math.random() * 5 + 's';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        container.appendChild(confetti);
      }
    };

    createConfetti();
  }, []);

  return (
    <div className="payment-success-container">
      {/* Confetti Animation */}
      <div className="confetti-container"></div>
      
      {/* Animated Background */}
      <div className="payment-bg-animation">
        <div className="payment-shape shape-1"></div>
        <div className="payment-shape shape-2"></div>
        <div className="payment-shape shape-3"></div>
      </div>

      <div className="success-card-enhanced">
        <div className="success-icon-container">
          <div className="success-icon-enhanced">🎉</div>
          <div className="success-badge">Success!</div>
        </div>

        <h1 className="success-title-enhanced">Payment Successful!</h1>
        <p className="success-message-enhanced">
          Thank you for your purchase! Your order has been confirmed and will be shipped soon.
        </p>

        {orderDetails && (
          <div className="order-details-success">
            <div className="detail-row">
              <span className="detail-label">Order ID:</span>
              <span className="detail-value">{orderDetails.orderId}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Order Date:</span>
              <span className="detail-value">{orderDetails.orderDate}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Estimated Delivery:</span>
              <span className="detail-value">{orderDetails.deliveryDate}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Total Amount:</span>
              <span className="detail-value total">₹{orderDetails.total}</span>
            </div>
          </div>
        )}

        <div className="success-features">
          <div className="success-feature">
            <div className="feature-icon">📧</div>
            <div className="feature-text">Email Confirmation Sent</div>
          </div>
          <div className="success-feature">
            <div className="feature-icon">🚚</div>
            <div className="feature-text">Free Shipping</div>
          </div>
          <div className="success-feature">
            <div className="feature-icon">🔒</div>
            <div className="feature-text">Secure Payment</div>
          </div>
          <div className="success-feature">
            <div className="feature-icon">📦</div>
            <div className="feature-text">Fast Delivery</div>
          </div>
        </div>

        <div className="success-actions-enhanced">
          <Link to="/products" className="success-btn-enhanced primary">
            🛍️ Continue Shopping
          </Link>
          <Link to="/" className="success-btn-enhanced secondary">
            🏠 Go to Home
          </Link>
        </div>

        <div className="customer-support">
          <h4>Need Help?</h4>
          <p>Contact our customer support team for any questions about your order.</p>
          <div className="support-contacts">
            <div className="contact-item">
              <span>📞</span>
              <span>1800-123-4567</span>
            </div>
            <div className="contact-item">
              <span>📧</span>
              <span>support@gocart.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;