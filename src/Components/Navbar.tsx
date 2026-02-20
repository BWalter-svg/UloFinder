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
  FiShield, 
} from "react-icons/fi";
import supabase from "./../api/supabaseClient";

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMore, setShowMore] = useState(false);
  const [hoveredMore, setHoveredMore] = useState<number | null>(null);
  const [role, setRole] = useState<"tenant" | "landlord" | "admin" | null>(null);

  const hideNav = ["/", "/login", "/signup"].includes(location.pathname);

  useEffect(() => {
    const fetchRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        
        setRole(profile?.role || "tenant");
      }
    };
    fetchRole();
  }, []);

  if (hideNav) return null;

  // Navigation logic based on role
  const navItems = [
    {
      icon: FiHome,
      path: role === "landlord" ? "/landlord/dashboard" : "/tenant/dashboard",
      label: "Home",
    },
    {
      icon: FiClipboard,
      path: role === "landlord" ? "/landlord/properties" : "/tenant/current-property",
      label: role === "landlord" ? "Units" : "Rentals",
    },
    {
      icon: FiMessageSquare,
      path: "/messages",
      label: "Messages",
    },
    {
      icon: FiUser,
      // FIXED: Added the ":" and fallback path to resolve Vercel build error
      path: role === "landlord" ? "/landlord/profile" : "/tenant/dashboard", 
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
    ...(role === "admin" ? [{
      icon: FiShield,
      label: "Verify Landlords",
      action: () => navigate("/admin/verify"),
      color: "#facc15" 
    }] : []),
    {
      icon: FiHelpCircle,
      label: "Help",
      action: () => navigate("/help")
    },
    {
      icon: FiLogOut,
      label: "Logout",
      action: async () => {
        await supabase.auth.signOut();
        navigate("/login");
      },
    },
  ];

  const isActive = (itemPath: string) =>
    location.pathname === itemPath || (itemPath !== "#" && location.pathname.startsWith(itemPath));

  return (
    <>
      {showMore && (
        <div 
          onClick={() => setShowMore(false)} 
          style={{ position: 'fixed', inset: 0, zIndex: 1000 }} 
        />
      )}

      <div
        style={{
          position: "fixed",
          bottom: showMore ? 80 : -300, 
          right: 16,
          width: 180,
          backgroundColor: "#0369a1", 
          borderRadius: "16px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
          display: "flex",
          flexDirection: "column",
          padding: "0.75rem 0",
          transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          zIndex: 1001,
        }}
      >
        {moreItems.map((item: any, idx) => (
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
              gap: 12,
              padding: "0.75rem 1.25rem",
              cursor: "pointer",
              color: item.color || (hoveredMore === idx ? "#bae6fd" : "#fff"),
              backgroundColor: hoveredMore === idx ? "rgba(255,255,255,0.1)" : "transparent",
              transition: "0.2s",
            }}
          >
            <item.icon size={20} />
            <span style={{ fontWeight: 500 }}>{item.label}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          width: "100%",
          height: "70px",
          backgroundColor: "#ffffff",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          position: "fixed",
          bottom: 0,
          zIndex: 1000,
          borderTop: "1px solid #f1f5f9",
          paddingBottom: "env(safe-area-inset-bottom)", 
        }}
      >
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const active = isActive(item.path);
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
                color: active ? "#0ea5e9" : "#94a3b8",
                transition: "0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: active ? "scale(1.1)" : "scale(1)",
              }}
            >
              <Icon size={active ? 24 : 22} />
              <span style={{ 
                fontSize: "0.7rem", 
                marginTop: 4, 
                fontWeight: active ? 700 : 500 
              }}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default BottomNav;
