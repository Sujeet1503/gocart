import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await axios.post("http://localhost:8080/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.id);
      localStorage.setItem("userName", res.data.name);

      navigate("/products");
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-bg-animation">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="back-home">
            ← Back to Home
          </Link>
          <div className="auth-logo">
            <span className="logo-icon">🛒</span>
            <span className="logo-text">GoCart</span>
          </div>
          <h2 className="auth-title">Welcome Back!</h2>
          <p className="auth-subtitle">Sign in to your account to continue shopping</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              📧 Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              🔒 Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <button 
            type="submit" 
            className="auth-btn primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Signing In...
              </>
            ) : (
              "🔑 Sign In"
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>New to GoCart?</span>
        </div>

        <Link to="/register" className="auth-btn secondary">
          📝 Create New Account
        </Link>

        <div className="auth-features">
          <div className="auth-feature">
            <span className="feature-icon">🚀</span>
            <span>Fast Checkout</span>
          </div>
          <div className="auth-feature">
            <span className="feature-icon">🔒</span>
            <span>Secure Login</span>
          </div>
          <div className="auth-feature">
            <span className="feature-icon">💫</span>
            <span>Personalized Experience</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;