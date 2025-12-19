import React, { useEffect, useState } from "react";
import supabase from "../../api/supabaseClient";
import "./ExploreHouses.css";

type Property = {
  id: string;
  title: string;
  location: string;
  price: number;
  description?: string;
  image_url?: string[];
  owner_id: string;
};

const ExploreHouses: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [myRequests, setMyRequests] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    setLoading(true);
    let query = supabase.from("properties").select("*");
    if (search) query = query.ilike("location", `%${search}%`);
    const { data, error } = await query;
    if (error) console.error(error);
    else setProperties(data as Property[]);
    setLoading(false);
  };

  const fetchMyRequests = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("rental_requests")
      .select("property_id")
      .eq("tenant_id", user.id);

    if (data) setMyRequests(data.map((r) => r.property_id));
  };

  useEffect(() => {
    fetchProperties();
    fetchMyRequests();
  }, [search]);

  const handleRequest = async (propertyId: string, landlordId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("You must be logged in to request a property");
      return;
    }

    const { error } = await supabase.from("rental_requests").insert({
      property_id: propertyId,
      tenant_id: user.id,
      landlord_id: landlordId,
      status: "pending",
    });

    if (error) {
      console.error("Request failed:", error);
      alert("Request failed: " + error.message);
    } else {
      setMyRequests((prev) => [...prev, propertyId]);
    }
  };

  // Combine all property locations for top map
  const topMapLocations = properties.map((p) => encodeURIComponent(p.location)).join("|");

  return (
    <div className="explore-header">
      <h1>Explore Houses</h1>

      <input
        type="text"
        placeholder="Search by location..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {loading && <p>Loading...</p>}

      {/* Top-of-page Google Map showing all properties */}
      {properties.length > 0 && (
        <div className="top-map-frame">
          <iframe
            title="all-properties-map"
            width="100%"
            height="400"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps?q=${topMapLocations}&output=embed`}
          />
        </div>
      )}

      {/* Property Cards */}
      <div className="properties-grid">
        {properties.map((p) => (
          <div key={p.id} className="property-card">
            {p.image_url && p.image_url[0] && (
              <img src={p.image_url[0]} alt={p.title} className="property-image" />
            )}
            <div className="property-details">
              <h3>{p.title}</h3>
              <p>{p.location}</p>
              <p>₦{p.price.toLocaleString()}</p>
              {p.description && <p>{p.description.slice(0, 100)}...</p>}

              {/* Individual property map */}
              <div className="map-frame">
                <iframe
                  title={`map-${p.id}`}
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    p.location
                  )}&output=embed`}
                />
              </div>

              {myRequests.includes(p.id) ? (
                <button className="book-btn requested" disabled>
                  Requested ✓
                </button>
              ) : (
                <button
                  className="book-btn"
                  onClick={() => handleRequest(p.id, p.owner_id)}
                >
                  Request to Rent
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreHouses;