import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import { Home, User } from "lucide-react";
import supabase from "../../api/supabaseClient";
import logo from "./assets/ulohub.jpg"

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return alert("Please select a role");
    if (!passwordsMatch) return alert("Passwords do not match");

    try {
      setLoading(true);

      // Sign up with email and password
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;

      // Save user profile
      await supabase.from("profiles").insert([
        { id: data.user?.id, email, role },
      ]);

      // Redirect to onboarding
      navigate(`/onboarding/${role}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Sign Up</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {/* Live validation message */}
          {confirmPassword.length > 0 && (
            <p
              style={{
                fontSize: "0.85rem",
                color: passwordsMatch ? "green" : "red",
                marginTop: "0.2rem",
              }}
            >
              {passwordsMatch
                ? " Passwords match"
                : " Passwords do not match"}
            </p>
          )}

          <div className="role-section">
            <p>Select Account Type</p>
            <div className="role-buttons">
              <button
                type="button"
                className={`role-btn ${role === "landlord" ? "active" : ""}`}
                onClick={() => setRole("landlord")}
              >
                <Home className="role-icon" /> Landlord
              </button>

              <button
                type="button"
                className={`role-btn ${role === "tenant" ? "active" : ""}`}
                onClick={() => setRole("tenant")}
              >
                <User className="role-icon" /> Tenant
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={loading || !passwordsMatch}
          >
            {loading ? "Creating account..." : "Continue"}
          </button>
        </form>

        <p className="switch-text">
          Already have an account?{" "}
          <span className="switch-link" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

