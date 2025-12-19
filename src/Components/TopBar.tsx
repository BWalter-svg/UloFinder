// src/Components/TopBar.tsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiSettings } from "react-icons/fi";

const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide TopBar on login/signup
  const hideTopBar = ["/login", "/signup"].includes(location.pathname);
  if (hideTopBar) return null;

  return (
    <div
      style={{
        width: "100%",
        height: "60px",
        backgroundColor: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1.5rem",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        position: "fixed",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo left */}
      <div
        style={{
          fontWeight: "bold",
          fontSize: "1.3rem",
          cursor: "pointer",
          color: "#0ea5e9", // blue logo
        }}
        onClick={() => navigate("/dashboard")}
      >
        ULOHUB
      </div>

      {/* Icons right */}
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <FiSettings
          size={24}
          onClick={() => navigate("/settings")}
          style={{
            cursor: "pointer",
            transition: "0.2s",
            color: "#0a66dd",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#459bff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#0a66dd")}
        />
      </div>
    </div>
  );
};

export default TopBar;