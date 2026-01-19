import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Signup.css"; // Ensure this contains the tweaked CSS from earlier
import { Home, User } from "lucide-react";
import supabase from "../../api/supabaseClient";
import logo from "../../assets/ulohub.jpg";
export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role) return alert("Please select whether you are a Landlord or Tenant");
    if (!passwordsMatch) return alert("Passwords do not match");

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;

      await supabase.from("profiles").insert([
        { id: data.user?.id, email, role },
      ]);

      navigate(`/onboarding/${role}`);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <img src={logo} alt="Ulohub Logo" className="signup-logo" />
        <h2 className="signup-title">Create Account</h2>
        <p className="signup-subtitle">Join the Ulohub community today</p>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="e.g. name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {confirmPassword.length > 0 && (
              <p style={{
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  color: passwordsMatch ? "#28a745" : "#dc3545",
                  marginTop: "-10px",
                  paddingLeft: "4px"
                }}>
                {passwordsMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
              </p>
            )}
          </div>

          <div className="role-section">
            <p>I am a...</p>
            <div className="role-buttons">
              <button
                type="button"
                className={`role-btn ${role === "landlord" ? "active" : ""}`}
                onClick={() => setRole("landlord")}
              >
                <Home size={20} color={role === "landlord" ? "#007bff" : "#666"} />
                <span>Landlord</span>
              </button>

              <button
                type="button"
                className={`role-btn ${role === "tenant" ? "active" : ""}`}
                onClick={() => setRole("tenant")}
              >
                <User size={20} color={role === "tenant" ? "#007bff" : "#666"} />
                <span>Tenant</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="signup-submit"
            disabled={loading || !passwordsMatch}
          >
            {loading ? "Creating account..." : "Continue"}
          </button>
        </form>

        <p className="login-text">
          Already have an account?{" "}
          <span className="login-link" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}


