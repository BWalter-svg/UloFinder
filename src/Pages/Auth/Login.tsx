import React, { useState } from "react";
import "./Login.css";
import logo from "../../assets/ulohub.jpg";
<img src={logo} alt="Rent Radar Logo" className="login-logo" />



export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={logo} alt="Ulohub Logo" className="login-logo" />

        <h2 className="login-title"> Oya Let's Get Going!</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <label>Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />

          <button type="submit">Login</button>

          <p className="signup-text">
            Don't have an account?
            <a href="/signup" className="signup-link">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
