import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-icon">🛒</span>
            <span className="logo-text">GoCart</span>
          </div>
          <div className="nav-links">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </div>
        </div>
      </nav>

      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">🚀 Welcome to</div>
          <h1 className="hero-title">
            <span className="gradient-text">GoCart</span> Marketplace
          </h1>
          <p className="hero-subtitle">
            Discover amazing products at unbeatable prices. 
            Shop with confidence and experience seamless shopping like never before.
          </p>
          
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-number">25+</div>
              <div className="stat-label">Premium Products</div>
            </div>
            <div className="stat">
              <div className="stat-number">100%</div>
              <div className="stat-label">Secure Payment</div>
            </div>
            <div className="stat">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Customer Support</div>
            </div>
          </div>

          <div className="cta-buttons">
            <Link to="/products" className="cta-btn primary">
              🛍️ Start Shopping Now
            </Link>
            <Link to="/login" className="cta-btn secondary">
              🔑 Existing Customer
            </Link>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="floating-card card-1">
            <div className="card-icon">📱</div>
            <span>Electronics</span>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">🎮</div>
            <span>Gaming</span>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">🏠</div>
            <span>Home Appliances</span>
          </div>
          <div className="floating-card card-4">
            <div className="card-icon">👟</div>
            <span>Fashion</span>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="features-container">
          <h2 className="features-title">Why Choose GoCart?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>Get your orders delivered within 2-3 business days</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Payment</h3>
              <p>100% secure payment processing with encryption</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💯</div>
              <h3>Quality Assurance</h3>
              <p>All products are verified for quality and authenticity</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📞</div>
              <h3>24/7 Support</h3>
              <p>Round-the-clock customer support service</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;