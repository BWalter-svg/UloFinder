import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiHome, FiPlusCircle, FiPieChart, FiActivity } from "react-icons/fi";
import supabase from "../../api/supabaseClient";
import "./landlord.css";

const LandlordDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    properties: 0,
    vacantUnits: 0,
  });
  const [loading, setLoading] = useState(true);

  // Dynamic greeting based on Nigerian time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (!user || userError) return navigate("/login");

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(profileData);

      const { data: properties } = await supabase
        .from("houses")
        .select("*")
        .eq("owner_id", user.id);

      const vacantUnits = properties?.filter(p => p.is_available).length || 0;

      setStats({
        properties: properties?.length || 0,
        vacantUnits,
      });

      setLoading(false);
    };

    loadData();
  }, [navigate]);

  const cards = [
    { 
      title: "My Properties", 
      count: stats.properties, 
      icon: <FiHome />, 
      route: "/landlord/properties",
      subtitle: "View your listings"
    },
    { 
      title: "Add New", 
      icon: <FiPlusCircle />, 
      route: "/landlord/addproperty",
      subtitle: "List a new house" 
    },
    { 
      title: "Availability", 
      count: stats.vacantUnits, 
      icon: <FiPieChart />, 
      route: "/landlord/vacant-units",
      subtitle: "Vacant units"
    },
  ];

  if (loading) {
    return (
      <div className="dashboard-wrapper">
        <div className="loading-state">
          <FiActivity className="spinner" />
          <p>Fetching your portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard">
        {/* Modern Header */}
        <div className="dashboard-header">
          <div className="header-text">
            <h1 className="dashboard-title">
               Dashboard
            </h1>
            <p className="dashboard-subtitle">
              {greeting}, {profile?.full_name?.split(' ')[0] || 'Landlord'}
            </p>
          </div>
          <div className="status-pill-header">
             <span className="pulse"></span> Live Updates
          </div>
        </div>

        {/* Improved Cards Section */}
        <div className="cards-container">
          {cards.map((card, index) => (
            <div key={index} className="card" onClick={() => card.route && navigate(card.route)}>
              <div className="icon-circle">{card.icon}</div>
              <div className="card-content">
                <p className="card-subtitle-small">{card.subtitle}</p>
                <h2 className="card-title">{card.title}</h2>
                {card.count !== undefined ? (
                  <p className="card-count">{card.count}</p>
                ) : (
                  <div className="card-cta">Get Started</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-footer">
          UloHub © 2026 • Real Estate Simplified
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard;
