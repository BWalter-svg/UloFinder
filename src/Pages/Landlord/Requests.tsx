import React, { useEffect, useState } from "react";
import supabase from "../../api/supabaseClient";
import ChatBox from "./ChatBox"; // go up two levels
 // make sure this points to your ChatBox component
import "./LandlordRequests.css";

type RequestItem = {
  id: string;
  status: string;
  created_at: string;
  conversation_id?: string; // added conversation_id
  properties: {
    title: string;
    location: string;
    price: number;
  };
  tenant: {
    id: string;
    email: string;
  };
};

const LandlordRequests: React.FC = () => {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageInputs, setMessageInputs] = useState<Record<string, string>>({});

  const fetchRequests = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setRequests([]);
      setLoading(false);
      return;
    }

    // 1️⃣ Fetch rental requests
    const { data: rentalData, error: rentalError } = await supabase
      .from("rental_requests")
      .select("*")
      .eq("landlord_id", user.id)
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

    // 2️⃣ Fetch properties
    const propertyIds = rentalData.map((r: any) => r.property_id);
    const { data: propertiesData } = await supabase
      .from("properties")
      .select("id, title, location, price")
      .in("id", propertyIds);

    // 3️⃣ Fetch tenants
    const tenantIds = rentalData.map((r: any) => r.tenant_id);
    const { data: tenantsData } = await supabase
      .from("tenants")
      .select("id, email")
      .in("id", tenantIds);

    // 4️⃣ Merge
    const mergedRequests: RequestItem[] = rentalData.map((r: any) => ({
      id: r.id,
      status: r.status,
      conversation_id: r.conversation_id,
      created_at: r.created_at,
      properties: propertiesData?.find(p => p.id === r.property_id) || { title: "Unknown", location: "Unknown", price: 0 },
      tenant: tenantsData?.find(t => t.id === r.tenant_id) || { id: "", email: "Unknown" },
    }));

    setRequests(mergedRequests);
    setLoading(false);
  };

  // Accept & optionally send first message via RPC
  const acceptRequest = async (requestId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const messageText = messageInputs[requestId] || null;

    const { error } = await supabase.rpc("accept_rental_request_with_chat", {
      p_request_id: requestId,
      p_sender_id: user.id,
      p_message_text: messageText
    });

    if (error) {
      alert("Failed to accept request: " + error.message);
    } else {
      setMessageInputs(prev => ({ ...prev, [requestId]: "" }));
      fetchRequests();
    }
  };

  const rejectRequest = async (requestId: string) => {
    const { error } = await supabase
      .from("rental_requests")
      .update({ status: "rejected" })
      .eq("id", requestId);

    if (error) alert("Failed to reject request: " + error.message);
    else fetchRequests();
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Rental Requests</h1>

      {loading && <p>Loading...</p>}
      {!loading && requests.length === 0 && <p>No rental requests yet.</p>}

      <div className="requests-list">
        {requests.map((r) => (
          <div key={r.id} className="request-card">
            <h3>{r.properties.title}</h3>
            <p>{r.properties.location}</p>
            <p>₦{r.properties.price.toLocaleString()}</p>
            <p><b>Tenant:</b> {r.tenant.email}</p>
            <p><b>Status:</b> {r.status}</p>
            <p><b>Date:</b> {new Date(r.created_at).toLocaleString()}</p>

            {r.status === "pending" && (
              <div className="request-actions">
                <input
                  type="text"
                  placeholder="Message tenant..."
                  value={messageInputs[r.id] || ""}
                  onChange={e =>
                    setMessageInputs(prev => ({ ...prev, [r.id]: e.target.value }))
                  }
                  className="message-input"
                />
                <button onClick={() => acceptRequest(r.id)} className="accept-btn">
                  Accept & Send
                </button>
                <button onClick={() => rejectRequest(r.id)} className="reject-btn">
                  Reject
                </button>
              </div>
            )}

            {/* ✅ ChatBox for accepted requests */}
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

export default LandlordRequests;
