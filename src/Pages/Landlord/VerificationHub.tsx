import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Camera, FileText, CheckCircle2, ChevronRight, AlertCircle } from "lucide-react";
import supabase from "../../api/supabaseClient";
import "./Verification.css";

export default function VerificationHub() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getStatus() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("agent_verification")
          .select("*")
          .eq("agent_id", user.id)
          .single();
        setStatus(data);
      }
      setLoading(false);
    }
    getStatus();
  }, []);

  if (loading) return <div className="verify-loader">Loading your status...</div>;

  return (
    <div className="verify-hub-container">
      <div className="verify-header">
        <h1>Trust & Safety</h1>
        <p>Complete your verification to unlock property listing features.</p>
      </div>

      <div className="verify-status-card">
        <div className="status-icon-wrap">
          {status?.status === 'approved' ? <ShieldCheck color="#10b981" size={40} /> : <AlertCircle color="#f59e0b" size={40} />}
        </div>
        <div className="status-text">
          <h3>Status: <span className={`badge ${status?.status || 'unverified'}`}>{status?.status || 'Not Started'}</span></h3>
          <p>{status?.status === 'approved' ? "You are a verified Ulohub Agent." : "Follow the steps below to get verified."}</p>
        </div>
      </div>

      <div className="steps-container">
        {/* STEP 1: IDENTITY */}
        <div className="step-card" onClick={() => !status && navigate("/landlord/verify/identity")}>
          <div className="step-icon-main"><FileText /></div>
          <div className="step-body">
            <h4>Identity Verification</h4>
            <p>Upload your NIN, BVN or Driver's License.</p>
          </div>
          <div className="step-action">
            {status?.id_url ? <CheckCircle2 color="#10b981" /> : <ChevronRight />}
          </div>
        </div>

        {/* STEP 2: LIVENESS (LOCKED UNTIL STEP 1 DONE) */}
        <div className={`step-card ${!status?.id_url ? 'locked' : ''}`}>
          <div className="step-icon-main"><Camera /></div>
          <div className="step-body">
            <h4>Live Selfie Match</h4>
            <p>Verify your face against your ID document.</p>
          </div>
          <div className="step-action">
             <ChevronRight />
          </div>
        </div>
      </div>

      {status?.status === 'pending' && (
        <div className="pending-notice">
          <p> Your documents are currently being reviewed by our team. This usually takes 24 hours.</p>
        </div>
      )}
    </div>
  );
}
