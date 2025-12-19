import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiClipboard,
  FiMessageSquare,
  FiUser,
  FiMoreHorizontal,
  FiLogOut,
  FiHelpCircle,
} from "react-icons/fi";
import supabase from "./../api/supabaseClient";

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMore, setShowMore] = useState(false);
  const [hoveredMore, setHoveredMore] = useState<number | null>(null);
  const [role, setRole] = useState<"tenant" | "landlord">("tenant");

  const hideNav = ["/", "/login", "/signup"].includes(location.pathname);
  if (hideNav) return null;

  // Fetch user role from Supabase
  useEffect(() => {
    const fetchRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        setRole(profile?.role === "landlord" ? "landlord" : "tenant");
      }
    };
    fetchRole();
  }, []);

  // Navigation items
  const navItems = [
    {
      icon: FiHome,
      path: role === "tenant" ? "/tenant/dashboard" : "/landlord/dashboard",
      label: "Home",
    },
    {
      icon: FiClipboard,
      path: role === "tenant" ? "/tenant/current-property" : "/landlord/properties",
      label: "Properties",
    },
    {
      icon: FiMessageSquare,
      path: role === "tenant" ? "/messages" : "/messages",
      label: "Messages",
    },
    {
      icon: FiUser,
      path: role === "tenant" ? "/tenant/profile" : "/landlord/profile",
      label: "Profile",
    },
    {
      icon: FiMoreHorizontal,
      path: "#",
      label: "More",
      onClick: () => setShowMore(!showMore),
    },
  ];

  const moreItems = [
    {
      icon: FiLogOut,
      label: "Logout",
      action: async () => {
        await supabase.auth.signOut();
        localStorage.removeItem("role");
        navigate("/login");
      },
    },
    { icon: FiHelpCircle, label: "Help", action: () => navigate("/help") },
  ];

  const isActive = (itemPath: string) =>
    location.pathname === itemPath || location.pathname.startsWith(itemPath + "/");

  return (
    <>
      {/* More floating panel */}
      <div
        style={{
          position: "fixed",
          bottom: showMore ? 60 : -120,
          right: 16,
          width: 160,
          backgroundColor: "#0ea5e9",
          borderRadius: 10,
          boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
          padding: "0.5rem 0",
          transition: "bottom 0.3s ease-in-out",
          zIndex: 1001,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderBottom: "8px solid #0ea5e9",
          }}
        />
        {moreItems.map((item, idx) => (
          <div
            key={idx}
            onClick={() => {
              item.action();
              setShowMore(false);
            }}
            onMouseEnter={() => setHoveredMore(idx)}
            onMouseLeave={() => setHoveredMore(null)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "0.5rem 1rem",
              cursor: "pointer",
              color: hoveredMore === idx ? "#fffb" : "#fff",
              transition: "0.2s",
            }}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Bottom Navbar */}
      <div
        style={{
          width: "100%",
          height: "60px",
          backgroundColor: "#ffffffff",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          position: "fixed",
          bottom: 0,
          zIndex: 1000,
        }}
      >
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              onClick={() => (item.onClick ? item.onClick() : navigate(item.path))}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: isActive(item.path) ? "#0e84e6ff" : "#0ea5e9",
                transition: "0.2s",
              }}
            >
              <Icon size={22} />
              <span style={{ fontSize: "0.65rem", marginTop: 2 }}>{item.label}</span>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default BottomNav;
