import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const NetBanking = () => {
  const [selectedBank, setSelectedBank] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();

  const banks = [
    { id: "sbi", name: "State Bank of India", code: "SBI", icon: "🏦", popular: true, gatewayCode: "SBI" },
    { id: "hdfc", name: "HDFC Bank", code: "HDFC", icon: "💳", popular: true, gatewayCode: "HDFC" },
    { id: "icici", name: "ICICI Bank", code: "ICICI", icon: "🔷", popular: true, gatewayCode: "ICICI" },
    { id: "axis", name: "Axis Bank", code: "AXIS", icon: "🎯", popular: false, gatewayCode: "AXIS" },
    { id: "kotak", name: "Kotak Mahindra Bank", code: "KOTAK", icon: "📊", popular: false, gatewayCode: "KOTAK" },
    { id: "pnb", name: "Punjab National Bank", code: "PNB", icon: "🟡", popular: false, gatewayCode: "PNB" },
    { id: "bob", name: "Bank of Baroda", code: "BOB", icon: "📈", popular: false, gatewayCode: "BOB" },
    { id: "canara", name: "Canara Bank", code: "CANARA", icon: "🟠", popular: false, gatewayCode: "CANARA" },
    { id: "union", name: "Union Bank of India", code: "UNION", icon: "🔗", popular: false, gatewayCode: "UNION" },
    { id: "indian", name: "Indian Bank", code: "INDIAN", icon: "🇮🇳", popular: false, gatewayCode: "INDIAN" },
    { id: "yes", name: "YES Bank", code: "YES", icon: "✅", popular: false, gatewayCode: "YES" },
    { id: "idfc", name: "IDFC First Bank", code: "IDFC", icon: "1️⃣", popular: false, gatewayCode: "IDFC" }
  ];

  const filteredBanks = banks.filter(bank =>
    bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bank.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const popularBanks = banks.filter(bank => bank.popular);
  const otherBanks = banks.filter(bank => !bank.popular);

  // Function to simulate bank gateway redirection
  const redirectToBankGateway = async (bankId) => {
    const bank = banks.find(b => b.id === bankId);
    
    try {
      const token = localStorage.getItem("token");
      const shippingAddress = JSON.parse(localStorage.getItem("shippingAddress") || "{}");
      
      // First create the order
      const orderResponse = await axios.post(
        "http://localhost:8080/order/create",
        { 
          shippingAddress, 
          paymentMethod: "netbanking",
          selectedBank: bank.gatewayCode
        },
        { headers: { token } }
      );

      // If order creation is successful, proceed with bank redirect simulation
      if (orderResponse.data.success) {
        setRedirecting(true);
        
        // Simulate bank gateway processing
        setTimeout(() => {
          // For demo purposes, we'll simulate successful payment 80% of the time
          const isSuccess = Math.random() > 0.2;
          
          if (isSuccess) {
            // Update order status to successful
            axios.post(
              "http://localhost:8080/order/update-payment-status",
              {
                orderId: orderResponse.data.orderId,
                status: "success",
                transactionId: `TXN${Date.now()}`
              },
              { headers: { token } }
            ).then(() => {
              navigate("/payment-success");
            });
          } else {
            // Update order status to failed
            axios.post(
              "http://localhost:8080/order/update-payment-status",
              {
                orderId: orderResponse.data.orderId,
                status: "failed",
                error: "Payment declined by bank"
              },
              { headers: { token } }
            ).then(() => {
              alert("Payment failed. Please try again.");
              setRedirecting(false);
              setLoading(false);
            });
          }
        }, 3000);
      }
    } catch (err) {
      console.log("Payment error:", err);
      setLoading(false);
      setRedirecting(false);
      alert("Payment failed. Please try again.");
    }
  };

  const handleNetBanking = async (e) => {
    e.preventDefault();
    if (!selectedBank) {
      alert("Please select a bank");
      return;
    }

    setLoading(true);
    await redirectToBankGateway(selectedBank);
  };

  const getBankColor = (bankId) => {
    const colors = {
      sbi: "#2E8B57",
      hdfc: "#004C8A",
      icici: "#FF6B00",
      axis: "#FF0000",
      kotak: "#800080",
      pnb: "#FFD700",
      bob: "#FF6B00",
      canara: "#FF8C00",
      union: "#0066CC",
      indian: "#FF4500",
      yes: "#00CED1",
      idfc: "#FF69B4"
    };
    return colors[bankId] || "#667eea";
  };

  // Show redirecting overlay
  if (redirecting) {
    const selectedBankData = banks.find(b => b.id === selectedBank);
    return (
      <div className="redirect-overlay">
        <div className="redirect-container">
          <div className="redirect-spinner"></div>
          <h2>Redirecting to {selectedBankData?.name}...</h2>
          <div className="redirect-steps">
            <div className="redirect-step active">
              <span className="step-number">1</span>
              <span>Connecting to secure gateway</span>
            </div>
            <div className="redirect-step">
              <span className="step-number">2</span>
              <span>Redirecting to {selectedBankData?.name}</span>
            </div>
            <div className="redirect-step">
              <span className="step-number">3</span>
              <span>Login & authorize payment</span>
            </div>
          </div>
          <p className="redirect-note">
            Please do not refresh or close this window...
          </p>
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
        <h1>🏦 Net Banking</h1>
        <p>Select your bank for secure payment</p>
      </div>

      <div className="payment-content-enhanced">
        <div className="payment-form-section-enhanced">
          <div className="form-header-netbanking">
            <div className="search-container">
              <div className="search-icon">🔍</div>
              <input
                type="text"
                placeholder="Search for your bank..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input-enhanced"
              />
            </div>
            <div className="banks-count">
              {filteredBanks.length} banks found
            </div>
          </div>

          <form onSubmit={handleNetBanking} className="payment-form-enhanced">
            {!searchTerm && (
              <div className="banks-section">
                <h3 className="section-title">⭐ Popular Banks</h3>
                <div className="banks-grid-popular">
                  {popularBanks.map(bank => (
                    <div
                      key={bank.id}
                      className={`bank-option-popular ${selectedBank === bank.id ? "selected" : ""}`}
                      onClick={() => setSelectedBank(bank.id)}
                      style={{ '--bank-color': getBankColor(bank.id) }}
                    >
                      <div className="bank-icon-large" style={{ backgroundColor: getBankColor(bank.id) }}>
                        {bank.icon}
                      </div>
                      <div className="bank-info-popular">
                        <h4>{bank.name}</h4>
                        <span>{bank.code}</span>
                      </div>
                      <div className="radio-btn-enhanced">
                        {selectedBank === bank.id && "✓"}
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="section-title">🏛️ Other Banks</h3>
              </div>
            )}

            <div className="banks-grid-enhanced">
              {(searchTerm ? filteredBanks : otherBanks).map(bank => (
                <div
                  key={bank.id}
                  className={`bank-option-enhanced ${selectedBank === bank.id ? "selected" : ""}`}
                  onClick={() => setSelectedBank(bank.id)}
                  style={{ '--bank-color': getBankColor(bank.id) }}
                >
                  <div className="bank-icon-enhanced" style={{ backgroundColor: getBankColor(bank.id) }}>
                    {bank.icon}
                  </div>
                  <div className="bank-info-enhanced">
                    <h4>{bank.name}</h4>
                    <span>{bank.code}</span>
                  </div>
                  <div className="radio-btn-enhanced">
                    {selectedBank === bank.id && "✓"}
                  </div>
                </div>
              ))}
            </div>

            {filteredBanks.length === 0 && searchTerm && (
              <div className="no-banks-found">
                <div className="no-banks-icon">🏦</div>
                <h3>No banks found</h3>
                <p>Try searching with different keywords</p>
              </div>
            )}

            <div className="netbanking-info-enhanced">
              <div className="info-header">
                <span className="info-icon">ℹ️</span>
                <h4>How Net Banking Works</h4>
              </div>
              <div className="info-steps">
                <div className="info-step">
                  <span className="step-number">1</span>
                  <span>Select your bank</span>
                </div>
                <div className="info-step">
                  <span className="step-number">2</span>
                  <span>Redirect to secure gateway</span>
                </div>
                <div className="info-step">
                  <span className="step-number">3</span>
                  <span>Login & authorize payment</span>
                </div>
                <div className="info-step">
                  <span className="step-number">4</span>
                  <span>Return to confirmation</span>
                </div>
              </div>
            </div>

            <div className="payment-actions-enhanced">
              <button 
                type="submit" 
                className="payment-submit-btn-enhanced" 
                disabled={!selectedBank || loading}
              >
                {loading ? (
                  <>
                    <div className="spinner-enhanced"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Continue to {banks.find(b => b.id === selectedBank)?.name}</span>
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
              <h3>🔐 Secure Banking</h3>
              <div className="secure-badge">
                <span>🛡️</span>
                <span>Protected</span>
              </div>
            </div>

            {selectedBank && (
              <div className="selected-bank-enhanced">
                <div className="selected-bank-header">
                  <h4>Selected Bank</h4>
                  <div className="bank-status">✅ Ready</div>
                </div>
                <div className="selected-bank-details">
                  <div className="bank-icon-large" style={{ backgroundColor: getBankColor(selectedBank) }}>
                    {banks.find(b => b.id === selectedBank)?.icon}
                  </div>
                  <div className="bank-details">
                    <strong>{banks.find(b => b.id === selectedBank)?.name}</strong>
                    <span>{banks.find(b => b.id === selectedBank)?.code}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="security-features-enhanced">
              <h4>✨ Security Features</h4>
              <div className="security-grid">
                <div className="security-item-enhanced">
                  <span className="security-icon">🔒</span>
                  <div className="security-text">
                    <strong>Bank-Level Security</strong>
                    <span>Your bank's secure gateway</span>
                  </div>
                </div>
                <div className="security-item-enhanced">
                  <span className="security-icon">📱</span>
                  <div className="security-text">
                    <strong>OTP Protected</strong>
                    <span>Two-factor authentication</span>
                  </div>
                </div>
                <div className="security-item-enhanced">
                  <span className="security-icon">⚡</span>
                  <div className="security-text">
                    <strong>Instant Processing</strong>
                    <span>Real-time transaction</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetBanking;