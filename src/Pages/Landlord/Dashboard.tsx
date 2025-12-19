import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiHome, FiBox, FiUserPlus } from "react-icons/fi";
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

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      // 1. Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (!user || userError) return navigate("/login");

      // 2. Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(profileData);

      // 3. Fetch properties
      const { data: properties } = await supabase
        .from("houses")
        .select("*")
        .eq("owner_id", user.id);

      // 4. Vacant units
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
    { title: "Total Properties", count: stats.properties, icon: <FiHome />, route: "/landlord/properties" },
    { title: "Add Property", icon: <FiUserPlus />, route: "/landlord/addproperty" },
    { title: "Vacant Units", count: stats.vacantUnits, icon: <FiBox />, route: "/landlord/vacant-units" },
  ];

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title"><FiHome style={{ marginRight: 8 }} />Dashboard</h1>
          <p className="dashboard-subtitle">Welcome, {profile?.full_name}</p>
        </div>

        <div className="cards-container">
          {cards.map((card, index) => (
            <div key={index} className="card" onClick={() => card.route && navigate(card.route)}>
              <div className="icon-circle">{card.icon}</div>
              <div className="card-content">
                <h2 className="card-title">{card.title}</h2>
                {card.count !== undefined && <p className="card-count">{card.count}</p>}
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-footer">UloHub © 2025</div>
      </div>
    </div>
  );
};

export default LandlordDashboard;