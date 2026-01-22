import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiHome,
  FiMessageCircle,
  FiCreditCard,
  FiTool,
  FiActivity,
  FiSearch,
  FiClock,
  FiLock,
} from "react-icons/fi";
import supabase from "../../api/supabaseClient";
import "../Landlord/landlord.css"; // Reusing the tushed-up CSS

const TenantDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    rentals: 0,
    messages: 0,
  });

  // Dynamic greeting based on Nigerian time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate("/login");

      // Fetch Profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(profileData);

      // Approved rentals
      const { count: rentalsCount } = await supabase
        .from("rental_requests")
        .select("*", { count: "exact", head: true })
        .eq("tenant_id", user.id)
        .eq("status", "approved");

      // Messages (Where user is the tenant)
      const { count: messagesCount } = await supabase
        .from("conversations")
        .select("*", { count: "exact", head: true })
        .eq("tenant_id", user.id);

      setStats({
        rentals: rentalsCount || 0,
        messages: messagesCount || 0,
      });

      setLoading(false);
    };

    fetchDashboardData();
  }, [navigate]);

  const cards = [
    {
      title: "Explore Houses",
      icon: <FiSearch />,
      subtitle: "FIND A HOME",
      type: "active",
      route: "/tenant/explore-houses",
    },
    {
      title: "My Rentals",
      icon: <FiHome />,
      value: stats.rentals,
      subtitle: "ACTIVE LEASES",
      type: "active",
      route: "/tenant/current-property",
    },
    {
      title: "Messages",
      icon: <FiMessageCircle />,
      value: stats.messages,
      subtitle: "CONVERSATIONS",
      type: "active",
      route: "/messages",
    },
    {
      title: "Payments",
      icon: <FiCreditCard />,
      subtitle: "RENT & RECEIPTS",
      type: "locked",
    },
    {
      title: "Maintenance",
      icon: <FiTool />,
      subtitle: "REPAIR REQUESTS",
      type: "locked",
    },
    {
      title: "Lease Status",
      icon: <FiClock />,
      value: stats.rentals > 0 ? "Active" : "None",
      subtitle: "CURRENT STATUS",
      type: "info",
    },
  ];

  if (loading) {
    return (
      <div className="dashboard-wrapper">
        <div className="loading-state">
          <FiActivity className="spinner" />
          <p>Setting up your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard">
        {/* HEADER */}
        <div className="dashboard-header">
          <div className="header-text">
            <h1 className="dashboard-title">
               Tenant Hub
            </h1>
            <p className="dashboard-subtitle">
              {greeting}, {profile?.full_name?.split(' ')[0] || "Boss"}
            </p>
          </div>
          <div className="status-pill-header">
             <span className="pulse"></span> Active Search
          </div>
        </div>

        {/* CARDS */}
        <div className="cards-container">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`card ${card.type}`}
              onClick={() =>
                card.type === "active" && card.route ? navigate(card.route) : null
              }
            >
              <div className="icon-circle">
                {card.type === "locked" ? <FiLock style={{ opacity: 0.5 }} /> : card.icon}
              </div>

              <div className="card-content">
                <p className="card-subtitle-small">{card.subtitle}</p>
                <h2 className="card-title">{card.title}</h2>

                {card.type === "active" || card.type === "info" ? (
                  <p className="card-count">{card.value ?? "View"}</p>
                ) : (
                  <div className="card-cta locked">Coming Soon</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-footer">UloHub © 2026 • Find your peace</div>
      </div>
    </div>
  );
};

export default TenantDashboard;
