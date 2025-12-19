import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../api/supabaseClient";
import { FiHome, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Inline error boundary
class VacantUnitsErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError)
      return <p style={{ textAlign: "center", marginTop: 50 }}>Something went wrong while loading vacant units.</p>;
    return this.props.children;
  }
}

const VacantUnitsContent: React.FC = () => {
  const navigate = useNavigate();
  const [houses, setHouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHouse, setSelectedHouse] = useState<any>(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    let channel: any;

    const fetchVacantUnits = async () => {
      setLoading(true);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (!user || userError) return navigate("/login");

      try {
        const { data: allHouses, error: housesError } = await supabase
          .from("houses")
          .select("*")
          .eq("landlord_id", user.id);
        if (housesError) throw housesError;

        const { data: requests, error: requestsError } = await supabase
          .from("rental_requests")
          .select("*");
        if (requestsError) throw requestsError;

        const vacant = (allHouses || []).filter(house =>
          !requests.some(r =>
            String(r.property_id) === String(house.id) &&
            ["pending", "approved"].includes(r.status.toLowerCase())
          )
        );

        setHouses(vacant);
      } catch (err: any) {
        console.error("Error fetching houses:", err.message || err);
        setHouses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVacantUnits();

    // Supabase v2 real-time subscription
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      channel = supabase
        .channel("houses-channel")
        .on(
          "postgres_changes",
          { schema: "public", table: "houses", event: "*" },
          () => fetchVacantUnits()
        )
        .subscribe();
    })();

    return () => {
      if (channel) channel.unsubscribe();
    };
  }, [navigate]);

  const handlePrevPhoto = () => {
    if (!selectedHouse?.photos?.length) return;
    setPhotoIndex(prev => (prev === 0 ? selectedHouse.photos.length - 1 : prev - 1));
  };

  const handleNextPhoto = () => {
    if (!selectedHouse?.photos?.length) return;
    setPhotoIndex(prev => (prev === selectedHouse.photos.length - 1 ? 0 : prev + 1));
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: 50 }}>Loading vacant units...</p>;
  if (!houses.length) return <p style={{ textAlign: "center", marginTop: 50 }}>No vacant units at the moment.</p>;

  return (
    <div>
      <h1>Vacant Units</h1>
      <div>
        {houses.map(house => (
          <div
            key={house.id}
            style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}
            onClick={() => { setSelectedHouse(house); setPhotoIndex(0); }}
          >
            <h2>{house.name || "Unnamed House"}</h2>
            <p>{house.location || "No location info"}</p>
            <p>Status: Vacant</p>
            <button onClick={(e) => { e.stopPropagation(); navigate(`/landlord/edit-property/${house.id}`); }}>
              Edit Property
            </button>
          </div>
        ))}
      </div>

      {selectedHouse && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex", justifyContent: "center", alignItems: "center"
          }}
          onClick={() => setSelectedHouse(null)}
        >
          <div
            style={{ backgroundColor: "#fff", padding: 20, position: "relative" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={{ position: "absolute", top: 10, right: 10 }}
              onClick={() => setSelectedHouse(null)}
            >
              <FiX />
            </button>

            <h2>{selectedHouse.name || "Unnamed House"}</h2>
            <p><strong>Location:</strong> {selectedHouse.location || "No location info"}</p>
            <p><strong>Bedrooms:</strong> {selectedHouse.bedrooms || "-"}</p>
            <p><strong>Bathrooms:</strong> {selectedHouse.bathrooms || "-"}</p>
            <p><strong>Rent:</strong> ${selectedHouse.rent || "-"}</p>
            <p><strong>Status:</strong> Vacant</p>

            {selectedHouse.photos && selectedHouse.photos.length > 0 && (
              <div>
                <button onClick={handlePrevPhoto}><FiChevronLeft /></button>
                <img
                  src={selectedHouse.photos[photoIndex]}
                  alt={`House ${photoIndex + 1}`}
                  style={{ width: 200, height: 150, objectFit: "cover" }}
                />
                <button onClick={handleNextPhoto}><FiChevronRight /></button>
              </div>
            )}

            <button onClick={() => navigate(`/landlord/edit-property/${selectedHouse.id}`)}>
              Edit Property
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const VacantUnits: React.FC = () => (
  <VacantUnitsErrorBoundary>
    <VacantUnitsContent />
  </VacantUnitsErrorBoundary>
);

export default VacantUnits;