import React, { useEffect, useState } from "react";
import { Check, X, ExternalLink, ShieldCheck, Loader2 } from "lucide-react";
import supabase from "../../api/supabaseClient";

export default function AdminVerification() {
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  async function fetchPendingUsers() {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("verification_status", "pending")
      .order("submitted_at", { ascending: true });

    if (data) setPendingUsers(data);
    setLoading(false);
  }

  const handleAction = async (userId: string, status: 'verified' | 'unverified') => {
    setProcessingId(userId);
    const { error } = await supabase
      .from("profiles")
      .update({ 
        verification_status: status,
        is_verified: status === 'verified' ? true : false 
      })
      .eq("id", userId);

    if (!error) {
      setPendingUsers(prev => prev.filter(user => user.id !== userId));
    }
    setProcessingId(null);
  };

  const getSignedUrl = async (path: string) => {
    // Since the bucket is private, we generate a temporary link (valid for 60s)
    const { data, error } = await supabase.storage
      .from("landlord-ids")
      .createSignedUrl(path, 60);
    
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
    if (error) alert("Could not open file: " + error.message);
  };

  if (loading) return <div className="admin-loader"><Loader2 className="spinner" /></div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1><ShieldCheck /> Verification Queue</h1>
        <p>{pendingUsers.length} landlords waiting for approval</p>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Document</th>
              <th>Submitted At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.map((user) => (
              <tr key={user.id}>
                <td><strong>{user.full_name}</strong></td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => getSignedUrl(user.id_document_url)} className="view-link">
                    View ID <ExternalLink size={14} />
                  </button>
                </td>
                <td>{new Date(user.submitted_at).toLocaleDateString()}</td>
                <td className="actions-cell">
                  <button 
                    className="approve-btn"
                    onClick={() => handleAction(user.id, 'verified')}
                    disabled={processingId === user.id}
                  >
                    <Check size={18} /> Approve
                  </button>
                  <button 
                    className="reject-btn"
                    onClick={() => handleAction(user.id, 'unverified')}
                    disabled={processingId === user.id}
                  >
                    <X size={18} /> Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pendingUsers.length === 0 && (
          <div className="empty-state">No pending verifications. Grab a coffee! ☕</div>
        )}
      </div>
    </div>
  );
}