import React, { useState } from "react";
import { FiMail, FiPhone, FiMessageCircle, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import supabase from "./../api/supabaseClient";
import "./Landlord/landlord.css";

const HelpPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // WhatsApp link
  const waNumber = "2349001234567";
  const waMessage = `Hi UloHub Support, I need help with my account.`;
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const { error: supaError } = await supabase.from("messages").insert([
        {
          sender_id: "system",
          receiver_id: "admin",
          content: `Name: ${form.name}\nEmail: ${form.email}\nMessage: ${form.message}`,
        },
      ]);

      if (supaError) throw supaError;

      setSuccess(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard">
        {/* BACK BUTTON */}
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#0d6efd",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "8px 14px",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            <FiArrowLeft style={{ marginRight: 6 }} /> Back
          </button>
        </div>

        {/* HEADER */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            <FiMessageCircle style={{ marginRight: 8 }} /> Help & Support
          </h1>
          <p className="dashboard-subtitle">
            Need help? Contact our support team instantly.
          </p>
        </div>

        {/* CONTACT INFO */}
        <div className="help-container">
          <div className="contact-info">
            <h2>Contact Info</h2>
            <p>
              <FiMail /> support@ulohub.com
            </p>
            <p>
              <FiPhone /> +234 900 123 4567
            </p>

            <div className="whatsapp-contact">
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                <button className="whatsapp-btn">
                  <FiPhone style={{ marginRight: 8 }} /> Chat on WhatsApp
                </button>
              </a>
            </div>
          </div>

          {/* FORM */}
          <form className="help-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
            {success && (
              <p className="success-msg">Message sent! We'll reply soon.</p>
            )}
            {error && <p className="error-msg">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;