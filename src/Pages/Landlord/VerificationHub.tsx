import React from "react";
import { CheckCircle, ShieldCheck, FileText, Camera, MapPin } from "lucide-react";
import "./Verification.css";

export default function VerificationHub() {
  const steps = [
    { id: 1, title: "Identity Check", desc: "NIN or BVN Verification", icon: <ShieldCheck />, status: "completed" },
    { id: 2, title: "Face Match", desc: "Take a live selfie", icon: <Camera />, status: "pending" },
    { id: 3, title: "Business Proof", desc: "CAC or Association Docs", icon: <FileText />, status: "locked" },
    { id: 4, title: "Office Address", desc: "Physical location check", icon: <MapPin />, status: "locked" },
  ];

  return (
    <div className="verify-container">
      <div className="verify-card">
        <h2 className="verify-title">Get Verified</h2>
        <p className="verify-subtitle">Complete these steps to start posting houses on Ulohub.</p>

        <div className="steps-list">
          {steps.map((step) => (
            <div key={step.id} className={`step-item ${step.status}`}>
              <div className="step-icon">{step.icon}</div>
              <div className="step-info">
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
              <div className="step-status">
                {step.status === "completed" ? <CheckCircle className="text-success" /> : null}
              </div>
            </div>
          ))}
        </div>

        <button className="verify-submit">Continue to Next Step</button>
      </div>
    </div>
  );
}
