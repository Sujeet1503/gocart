import React from "react";
import { Link } from "react-router-dom";

const PaymentSuccess = () => {
  return (
    <div className="payment-success">
      <div className="success-container">
        <div className="success-icon">✅</div>
        <h2>Payment Successful! 🎉</h2>
        <p>Thank you for your purchase. Your order has been placed successfully.</p>
        <div className="success-actions">
          <Link to="/products" className="cta-btn primary">
            Continue Shopping
          </Link>
          <Link to="/" className="cta-btn secondary">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;