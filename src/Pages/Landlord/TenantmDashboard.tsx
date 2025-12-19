import React, { useEffect, useState } from "react";
import supabase from "../../api/supabaseClient";
import ChatBox from "./ChatBox"; // adjust path if needed
import "./TenantmDashboard.css";

type RequestItem = {
  id: string;
  status: string;
  created_at: string;
  conversation_id?: string;
  properties: {
    title: string;
    location: string;
    price: number;
  };
  landlord: {
    id: string;
    email: string;
  };
};

const TenantDashboard: React.FC = () => {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setRequests([]);
      setLoading(false);
      return;
    }

    // Fetch rental requests for this tenant
    const { data: rentalData, error: rentalError } = await supabase
      .from("rental_requests")
      .select("*")
      .eq("tenant_id", user.id)
      .order("created_at", { ascending: false });

    if (rentalError) {
      console.error("Fetch rental requests error:", rentalError);
      setLoading(false);
      return;
    }

    if (!rentalData || rentalData.length === 0) {
      setRequests([]);
      setLoading(false);
      return;
    }

    // Fetch properties
    const propertyIds = rentalData.map((r: any) => r.property_id);
    const { data: propertiesData } = await supabase
      .from("properties")
      .select("id, title, location, price, owner_id")
      .in("id", propertyIds);

    // Fetch landlords
    const landlordIds = propertiesData?.map(p => p.owner_id) || [];
    const { data: landlordsData } = await supabase
      .from("auth.users")
      .select("id, email")
      .in("id", landlordIds);

    // Merge
    const mergedRequests: RequestItem[] = rentalData.map((r: any) => {
      const property = propertiesData?.find(p => p.id === r.property_id) || {
        title: "Unknown",
        location: "Unknown",
        price: 0,
        owner_id: "",
      };
      const landlord = landlordsData?.find(l => l.id === property.owner_id) || {
        id: "",
        email: "Unknown",
      };
      return {
        id: r.id,
        status: r.status,
        created_at: r.created_at,
        conversation_id: r.conversation_id,
        properties: property,
        landlord,
      };
    });

    setRequests(mergedRequests);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Your Rental Requests</h1>

      {loading && <p>Loading...</p>}
      {!loading && requests.length === 0 && <p>You have no rental requests yet.</p>}

      <div className="requests-list">
        {requests.map((r) => (
          <div
            key={r.id}
            className={`request-card ${r.status === "accepted" ? "accepted" : ""}`}
          >
            {r.status === "accepted" && <span className="accepted-badge">Accepted ✅</span>}

            <h3>{r.properties.title}</h3>
            <p>{r.properties.location}</p>
            <p>₦{r.properties.price.toLocaleString()}</p>
            <p><b>Landlord:</b> {r.landlord.email}</p>
            <p><b>Status:</b> {r.status}</p>
            <p><b>Date:</b> {new Date(r.created_at).toLocaleString()}</p>

            {/* Show ChatBox only if request is accepted */}
            {r.status === "accepted" && r.conversation_id && (
              <div className="chat-container">
                <ChatBox conversationId={r.conversation_id} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TenantDashboard;
