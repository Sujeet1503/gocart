import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Address = () => {
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    addressType: "home"
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Save address to localStorage (in real app, send to backend)
    localStorage.setItem("shippingAddress", JSON.stringify(address));
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate("/payment-options");
    }, 1000);
  };

  return (
    <div className="address-container">
      <div className="address-header">
        <h1>📦 Shipping Address</h1>
        <p>Where should we deliver your order?</p>
      </div>

      <div className="address-main">
        <div className="address-form-section">
          <form onSubmit={handleSubmit} className="address-form">
            <div className="form-row">
              <div className="form-group">
                <label>👤 Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={address.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="form-group">
                <label>📞 Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={address.phone}
                  onChange={handleChange}
                  placeholder="Enter 10-digit mobile number"
                  pattern="[0-9]{10}"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>🏠 Street Address *</label>
              <textarea
                name="street"
                value={address.street}
                onChange={handleChange}
                placeholder="House/Building number, street, area"
                rows="3"
                required
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>🏙️ City *</label>
                <input
                  type="text"
                  name="city"
                  value={address.city}
                  onChange={handleChange}
                  placeholder="Enter your city"
                  required
                />
              </div>
              <div className="form-group">
                <label>📍 State *</label>
                <input
                  type="text"
                  name="state"
                  value={address.state}
                  onChange={handleChange}
                  placeholder="Enter your state"
                  required
                />
              </div>
              <div className="form-group">
                <label>📮 PIN Code *</label>
                <input
                  type="text"
                  name="pincode"
                  value={address.pincode}
                  onChange={handleChange}
                  placeholder="6-digit PIN code"
                  pattern="[0-9]{6}"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>🗺️ Landmark (Optional)</label>
              <input
                type="text"
                name="landmark"
                value={address.landmark}
                onChange={handleChange}
                placeholder="Nearby landmark for easy delivery"
              />
            </div>

            <div className="address-type-section">
              <label>🏷️ Address Type</label>
              <div className="address-type-options">
                <label className="type-option">
                  <input
                    type="radio"
                    name="addressType"
                    value="home"
                    checked={address.addressType === "home"}
                    onChange={handleChange}
                  />
                  <span className="type-icon">🏠</span>
                  <span>Home</span>
                </label>
                <label className="type-option">
                  <input
                    type="radio"
                    name="addressType"
                    value="work"
                    checked={address.addressType === "work"}
                    onChange={handleChange}
                  />
                  <span className="type-icon">💼</span>
                  <span>Work</span>
                </label>
                <label className="type-option">
                  <input
                    type="radio"
                    name="addressType"
                    value="other"
                    checked={address.addressType === "other"}
                    onChange={handleChange}
                  />
                  <span className="type-icon">📍</span>
                  <span>Other</span>
                </label>
              </div>
            </div>

            <div className="address-actions">
              <Link to="/cart" className="back-btn">
                ← Back to Cart
              </Link>
              <button type="submit" className="continue-btn" disabled={loading}>
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Processing...
                  </>
                ) : (
                  "🚚 Continue to Payment"
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="address-preview">
          <div className="preview-card">
            <h3>📍 Delivery Summary</h3>
            <div className="preview-item">
              <span className="preview-label">Name:</span>
              <span className="preview-value">{address.fullName || "Not provided"}</span>
            </div>
            <div className="preview-item">
              <span className="preview-label">Phone:</span>
              <span className="preview-value">{address.phone || "Not provided"}</span>
            </div>
            <div className="preview-item">
              <span className="preview-label">Address:</span>
              <span className="preview-value">
                {address.street ? `${address.street}, ${address.city}` : "Not provided"}
              </span>
            </div>
            <div className="preview-security">
              <div className="security-badge">🔒 Secure Checkout</div>
              <div className="security-badge">🚚 Free Delivery</div>
              <div className="security-badge">📧 Email Confirmation</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Address;