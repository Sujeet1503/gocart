import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Products from "./components/Products";
import Cart from "./components/Cart";
import Address from "./components/Address";
import PaymentOptions from "./components/PaymentOptions";
import Payment from "./components/Payment";
import CODConfirmation from "./components/CODConfirmation";
import PaymentSuccess from "./components/PaymentSuccess";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/address" element={<Address />} />
          <Route path="/payment-options" element={<PaymentOptions />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/cod-confirmation" element={<CODConfirmation />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;