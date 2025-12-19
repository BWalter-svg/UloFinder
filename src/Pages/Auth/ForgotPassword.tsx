import React, { useState } from "react";
import supabase from "../../api/supabaseClient";
import { FiMail } from "react-icons/fi";
import "./Auth.css";
import "./Responsive Auth.css"

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/reset-password", // update to your app URL
    });

    if (error) {
      setStatus("Something went wrong. Try again.");
      setLoading(false);
      return;
    }

    setStatus("Reset link sent! Check your email ");
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Reset Password</h2>
        <p className="auth-subtitle">
          Enter your email and we’ll send you a reset link.
        </p>

        <form onSubmit={handleReset} className="auth-form">
          <div className="input-group">
            <FiMail className="input-icon" />
            <input
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {status && <p className="auth-status">{status}</p>}

        <p className="auth-link" onClick={() => window.history.back()}>
          ← Back to Login
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;