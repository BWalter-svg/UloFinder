import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, User, Mail, Lock, UserCircle } from "lucide-react";
import supabase from "../../api/supabaseClient";
import logo from "../../assets/ulohub.jpg";
import "./Signup.css";

export default function Signup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState(""); // Fixes the "Optional" name bug
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return alert("Please select whether you are a Landlord or Tenant");
    if (!passwordsMatch) return alert("Passwords do not match");

    try {
      setLoading(true);

      // 1. Create the Auth User
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // 2. Insert the Profile (Connecting the Full Name here)
        const { error: profileError } = await supabase.from("profiles").insert([
          { 
            id: data.user.id, 
            email, 
            role, 
            full_name: fullName // This ensures the name isn't "Optional"
          },
        ]);

        if (profileError) throw profileError;

        // 3. Success!
        alert("Account created successfully!");
        navigate(`/onboarding/${role}`);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <img src={logo} alt="Ulohub" className="signup-logo" />
          <h2>Create Account</h2>
          <p>Join thousands of users on Ulohub</p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          {/* Full Name Input */}
          <div className="input-group">
            <label><UserCircle size={16} /> Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          {/* Email Input */}
          <div className="input-group">
            <label><Mail size={16} /> Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-grid">
            {/* Password */}
            <div className="input-group">
              <label><Lock size={16} /> Password</label>
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {/* Confirm Password */}
            <div className="input-group">
              <label><Lock size={16} /> Confirm</label>
              <input
                type="password"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Role Selection */}
          <div className="role-selector">
            <p>Register as a:</p>
            <div className="role-options">
              <div 
                className={`role-box ${role === "landlord" ? "active" : ""}`}
                onClick={() => setRole("landlord")}
              >
                <Home size={24} />
                <span>Landlord</span>
              </div>
              <div 
                className={`role-box ${role === "tenant" ? "active" : ""}`}
                onClick={() => setRole("tenant")}
              >
                <User size={24} />
                <span>Tenant</span>
              </div>
            </div>
          </div>

          <button type="submit" className="signup-btn" disabled={loading || !passwordsMatch}>
            {loading ? "Processing..." : "Create Account"}
          </button>
        </form>

        <p className="footer-text">
          Already have an account? <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}
