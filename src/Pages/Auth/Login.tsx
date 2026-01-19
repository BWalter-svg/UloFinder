import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../api/supabaseClient";
import "./Auth.css";
import logo from "../../assets/ulohub.jpg";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Fetch user role from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user?.id)
        .single();

      if (profileError) throw profileError;

      const role = profileData?.role;
      if (role === "landlord") navigate("/landlord/dashboard");
      else if (role === "tenant") navigate("/tenant/dashboard");
      else navigate("/"); // fallback
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src={logo} alt="Ulohub" className="auth-logo" />
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Log in to manage your Ulohub account</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>Password</label>
              <span 
                className="forgot-link" 
                onClick={() => navigate("/forgot-password")}
                style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary-blue)', cursor: 'pointer' }}
              >
                Forgot?
              </span>
            </div>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="switch-text">
          Don't have an account?{" "}
          <span className="switch-link" onClick={() => navigate("/signup")}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}


