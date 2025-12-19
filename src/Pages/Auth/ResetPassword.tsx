import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import supabase from "../../api/supabaseClient";
import "./Auth.css";
import "./Responsive Auth.css"

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // Grab the access token and email from the URL query
  const accessToken = searchParams.get("access_token");
  const email = searchParams.get("email");

  useEffect(() => {
    if (!accessToken || !email) {
      setStatus("Invalid or missing token.");
    }
  }, [accessToken, email]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("");

    if (password !== confirmPassword) {
      setStatus("Passwords do not match.");
      return;
    }

    if (!accessToken || !email) return;

    setLoading(true);
    try {
    
      const { error: resetError } = await supabase.auth.updateUser({
        password,
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (resetError) throw resetError;

    
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;

      
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", loginData.user?.id)
        .single();

      if (profileError) throw profileError;

      const role = profileData?.role;
      setStatus(" Password updated! Redirecting...");

      setTimeout(() => {
        if (role === "landlord") navigate("/landlord/dashboard");
        else if (role === "tenant") navigate("/tenant/dashboard");
        else navigate("/"); // fallback
      }, 1500);

    } catch (err: any) {
      setStatus(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src="/ulohub.jpg" alt="Ulohub Logo" className="auth-logo" />
        <h2 className="auth-title">Reset Password</h2>
        <p className="auth-subtitle">
          Enter a new password below.
        </p>

        <form className="auth-form" onSubmit={handleReset}>
          <label>New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        {status && <p className="switch-text">{status}</p>}

        <p className="switch-text">
          Remembered your password?{" "}
          <span className="switch-link" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
