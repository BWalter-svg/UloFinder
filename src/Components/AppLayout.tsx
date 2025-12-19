// src/Components/AppLayout.tsx
import React from "react";
import TopBar from "./TopBar";
import FloatingNav from "./Navbar";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* Fixed TopBar */}
      <TopBar />

      {/* Page content container */}
      <div
        style={{
          paddingTop: "60px", // space for TopBar
          paddingBottom: "80px", // space for FloatingNav
          maxWidth: "1200px", // responsive max width
          margin: "0 auto",
          width: "100%",
          minHeight: "calc(100vh - 140px)", // full height minus TopBar+FloatingNav
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>

      {/* Floating bottom nav */}
      <FloatingNav />
    </div>
  );
};

export default AppLayout;