import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Products from "./components/Products";
import Cart from "./components/Cart";
import Payment from "./components/Payment";
import Home from "./components/Home";
import PaymentSuccess from "./components/PaymentSuccess";
import Address from "./components/Address";
import PaymentOptions from "./components/PaymentOptions";
import CardPayment from "./components/CardPayment";
import NetBanking from "./components/NetBanking";
import CODConfirmation from "./components/CODConfirmation";

import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="App">
        {/* Add Premium Background Elements Here */}
        <div className="premium-bg"></div>
        <div className="floating-elements">
          <div 
            className="floating-element" 
            style={{
              width: '100px', 
              height: '100px', 
              top: '20%', 
              left: '10%'
            }}
          ></div>
          <div 
            className="floating-element" 
            style={{
              width: '150px', 
              height: '150px', 
              top: '60%', 
              right: '15%'
            }}
          ></div>
          <div 
            className="floating-element" 
            style={{
              width: '80px', 
              height: '80px', 
              bottom: '30%', 
              left: '20%'
            }}
          ></div>
        </div>
        
        {/* Your Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/address" element={<Address />} />
          <Route path="/payment-options" element={<PaymentOptions />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/card-payment" element={<CardPayment />} />
          <Route path="/netbanking" element={<NetBanking />} />
          <Route path="/cod-confirmation" element={<CODConfirmation />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;