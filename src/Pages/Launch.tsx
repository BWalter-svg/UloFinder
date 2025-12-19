import React, { useState, useEffect } from "react";

const Launch: React.FC = () => {
  const [daysLeft, setDaysLeft] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const LAUNCH_DATE = new Date("2025-01-31T00:00:00");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = LAUNCH_DATE.getTime() - now.getTime();
      setDaysLeft(Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbzGDcaEvQXRH0hp2OAuPYgSUKthEsHMPXAZrXMzFojnREsmo1q6jwvF_foHsO46-wmY/exec",
        {
          method: "POST",
          body: JSON.stringify({ name, email }),
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await res.json();
      if (data.status === "success") {
        setSuccess(true);
        setName("");
        setEmail("");
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "42px", fontWeight: "bold", color: "#0284c7" }}>
        ULOHUB is Launching Soon
      </h1>
      <p style={{ fontSize: "20px", marginTop: "10px" }}>
        Your new home-finding experience begins in…
      </p>

      <h2
        style={{
          marginTop: "20px",
          fontSize: "60px",
          fontWeight: "900",
          color: "#0ea5e9",
        }}
      >
        {daysLeft} Days
      </h2>

      <p style={{ marginTop: "20px", fontSize: "18px" }}>
        Join the waitlist to be part of the first users.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          marginTop: "25px",
          width: "100%",
          maxWidth: "420px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "10px",
            padding: "14px",
            background: "#0ea5e9",
            color: "white",
            borderRadius: "10px",
            fontSize: "18px",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Joining..." : "Join Waitlist"}
        </button>

        {success && (
          <p style={{ color: "green", fontWeight: "bold" }}>
            You're on the list! 🎉
          </p>
        )}
      </form>
    </div>
  );
};

export default Launch;
