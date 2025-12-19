import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiHome,
  FiMessageCircle,
  FiCreditCard,
  FiTool,
  FiTrendingUp,
  FiClock,
  FiLock,
} from "react-icons/fi";
import supabase from "../../api/supabaseClient";
import "../Landlord/landlord.css";

type Profile = {
  full_name: string | null;
};

const TenantDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    rentals: 0,
    messages: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      // Profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      setProfile(profileData);

      // Approved rentals
      const { count: rentalsCount } = await supabase
        .from("rental_requests")
        .select("*", { count: "exact" })
        .eq("tenant_id", user.id)
        .eq("status", "approved");

      // Messages
      const { count: messagesCount } = await supabase
  .from("conversations")
  .select("*", { count: "exact" })
  .or(`tenant_id.eq.${user.id},landlord_id.eq.${user.id}`);

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
    icon: <FiHome />,
    subtitle: "Find available homes",
    type: "active",
    route: "/tenant/explore-houses",
  },
    {
      title: "My Rentals",
      icon: <FiHome />,
      value: stats.rentals,
      subtitle: "Approved properties",
      type: "active",
      route: "/tenant/current-property",
    },
    {
      title: "Messages",
      icon: <FiMessageCircle />,
      value: stats.messages,
      subtitle: "Unread conversations",
      type: "active",
      route: "/messages",
    },
    {
      title: "Payments",
      icon: <FiCreditCard />,
      subtitle: "Rent payments & receipts",
      type: "locked",
    },
    {
      title: "Maintenance",
      icon: <FiTool />,
      subtitle: "Request repairs easily",
      type: "locked",
    },
    {
      title: "Rent Summary",
      icon: <FiTrendingUp />,
      subtitle: "Monthly & yearly overview",
      type: "info",
    },
    {
      title: "Lease Status",
      icon: <FiClock />,
      subtitle: stats.rentals > 0 ? "Active lease" : "No active lease",
      type: "info",
    },
  ];

  if (loading) {
    return (
      <p style={{ textAlign: "center", marginTop: 60 }}>
        Loading your dashboard…
      </p>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard">
        {/* HEADER */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            <FiHome style={{ marginRight: 8 }} />
            Tenant Dashboard
          </h1>
          <p className="dashboard-subtitle">
            Welcome, {profile?.full_name || "Boss"}
          </p>
        </div>

        {/* CARDS */}
        <div className="cards-container">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`card ${card.type}`}
              onClick={() =>
                card.type === "active" && card.route
                  ? navigate(card.route)
                  : null
              }
            >
              <div className="icon-circle">
                {card.type === "locked" ? <FiLock /> : card.icon}
              </div>

              <div className="card-content">
                <h2 className="card-title">{card.title}</h2>

                {card.type === "active" && (
                  <p className="card-count">{card.value}</p>
                )}

                {card.type !== "active" && (
                  <p className="card-subtitle">{card.subtitle}</p>
                )}

                {card.type === "locked" && (
                  <span className="badge">Coming soon</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="dashboard-footer">UloHub © 2025</div>
      </div>
    </div>
  );
};

export default TenantDashboard;