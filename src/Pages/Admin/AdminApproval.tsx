import React, { useEffect, useState } from "react";
import supabase from "../../api/supabaseClient";
import { Check, X, ExternalLink, ShieldAlert } from "lucide-react";
import "./Admin.css";

export default function AdminApproval() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  async function fetchPendingRequests() {
    const { data, error } = await supabase
      .from("agent_verification")
      .select(`*, profiles(full_name, email)`)
      .eq("status", "pending");

    if (!error) setRequests(data);
    setLoading(false);
  }

  async function handleAction(id: string, agentId: string, action: 'approved' | 'rejected') {
    // 1. Update verification table
    await supabase.from("agent_verification").update({ status: action }).eq("id", id);
    
    // 2. If approved, update the profile table to give them posting rights
    if (action === 'approved') {
      await supabase.from("profiles").update({ is_verified: true }).eq("id", agentId);
    }

    setRequests(requests.filter(r => r.id !== id));
    alert(`Agent ${action} successfully!`);
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <ShieldAlert size={28} />
        <h2>Verification Queue</h2>
      </header>

      {requests.length === 0 ? (
        <p className="empty-msg">No pending requests. You're all caught up!</p>
      ) : (
        <div className="request-grid">
          {requests.map((req) => (
            <div key={req.id} className="request-card">
              <div className="req-info">
                <h4>{req.profiles.full_name}</h4>
                <p>{req.profiles.email}</p>
                <span className="req-date">Submitted: {new Date(req.submitted_at).toLocaleDateString()}</span>
              </div>
              
              <div className="req-actions">
                <a href={`${supabase.storage.from('verification-docs').getPublicUrl(req.id_url).data.publicUrl}`} 
                   target="_blank" rel="noreferrer" className="view-btn">
                  View Document <ExternalLink size={14} />
                </a>
                <div className="btn-group">
                  <button onClick={() => handleAction(req.id, req.agent_id, 'approved')} className="approve-btn">
                    <Check size={18} /> Approve
                  </button>
                  <button onClick={() => handleAction(req.id, req.agent_id, 'rejected')} className="reject-btn">
                    <X size={18} /> Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}