import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../api/supabaseClient";
import "./LandlordProperties.css";

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  description?: string;
  image_urls?: string[];
}

const LandlordProperties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("owner_id", user.id);

    if (error) {
      console.error(error);
      alert("Failed to fetch properties");
      setLoading(false);
      return;
    }

    setProperties(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;

    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) {
      console.error(error);
      alert("Delete failed: " + error.message);
      return;
    }

    alert("Property deleted successfully");
    fetchProperties();
  };

  const handleEdit = (id: string) => {
    navigate(`/landlord/edit-property/${id}`);
  };

  if (loading) return <div className="loading-text">Loading properties...</div>;

  return (
    <div className="properties-container">
      {properties.length === 0 && !loading && (
        <div className="empty-state">You haven’t added any properties yet.</div>
      )}

      {properties.map((prop) => (
        <div key={prop.id} className="property-card">
          {prop.image_urls && prop.image_urls.length > 0 && (
            <img
              src={prop.image_urls[0]}
              alt={prop.title}
              className="property-image"
            />
          )}

          <div className="property-details">
            <h3 className="property-title">{prop.title}</h3>
            <p className="property-location">{prop.location}</p>
            <p className="property-price">₦{prop.price}</p>

            {prop.description && (
              <p className="property-description">{prop.description}</p>
            )}

            {/* 🌍 LIVE MAP PREVIEW */}
            <div style={{ marginTop: "10px" }}>
              <iframe
                width="100%"
                height="150"
                style={{
                  border: 0,
                  borderRadius: "12px",
                  marginTop: "8px",
                }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  prop.location
                )}&output=embed`}
              />
            </div>

            <div className="property-buttons">
              <button className="edit-btn" onClick={() => handleEdit(prop.id)}>
                Edit
              </button>
              <button className="delete-btn" onClick={() => handleDelete(prop.id)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LandlordProperties;