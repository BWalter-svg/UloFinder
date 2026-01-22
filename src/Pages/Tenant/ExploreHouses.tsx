import React, { useEffect, useState } from "react";
import { FiSearch, FiMapPin, FiInfo, FiCheckCircle, FiLoader } from "react-icons/fi";
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
    // Note: Using your existing "properties" table name
    let query = supabase.from("properties").select("*");
    
    if (search) {
      query = query.ilike("location", `%${search}%`);
    }

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
    const delayDebounceFn = setTimeout(() => {
      fetchProperties();
    }, 500); // Debounce search to save Supabase calls

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const handleRequest = async (propertyId: string, landlordId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Please log in to make a request.");

    const { error } = await supabase.from("rental_requests").insert({
      property_id: propertyId,
      tenant_id: user.id,
      landlord_id: landlordId,
      status: "pending",
    });

    if (error) alert(error.message);
    else setMyRequests((prev) => [...prev, propertyId]);
  };

  return (
    <div className="explore-container">
      {/* Premium Search Header */}
      <header className="explore-hero">
        <div className="hero-content">
          <h1>Find your next home</h1>
          <p>Browse verified properties across Nigeria</p>
          <div className="search-bar-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Enter location (e.g. Lekki, Lagos)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="explore-main">
        <div className="results-header">
          <h2>{properties.length} Properties found</h2>
        </div>

        {loading ? (
          <div className="explore-loader">
            <FiLoader className="spinner" />
            <p>Scanning the market...</p>
          </div>
        ) : (
          <div className="properties-grid">
            {properties.map((p) => (
              <div key={p.id} className="property-card">
                <div className="image-container">
                  <img 
                    src={p.image_url?.[0] || "https://images.unsplash.com/photo-1568605114967-8130f3a36994"} 
                    alt={p.title} 
                  />
                  <div className="price-tag">₦{p.price.toLocaleString()}</div>
                </div>

                <div className="property-info">
                  <h3 className="property-title">{p.title}</h3>
                  <p className="property-location">
                    <FiMapPin size={14} /> {p.location}
                  </p>
                  
                  <div className="property-meta">
                     <p className="property-desc">
                       {p.description ? `${p.description.slice(0, 70)}...` : "No description available."}
                     </p>
                  </div>

                  {myRequests.includes(p.id) ? (
                    <button className="book-btn requested" disabled>
                      <FiCheckCircle /> Requested
                    </button>
                  ) : (
                    <button
                      className="book-btn"
                      onClick={() => handleRequest(p.id, p.owner_id)}
                    >
                      View Details & Request
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ExploreHouses;
