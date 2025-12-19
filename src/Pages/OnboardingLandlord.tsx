import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Onboarding.css";
const OnboardingLandlord: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const next = () => setStep(step + 1);
  const finish = () => navigate("/landlord/dashboard");

  return (
    <div className="onboard-container">
      <div className="onboard-card">
        <img src="/ulohub.jpg" alt="Ulohub Logo" className="onboard-logo" />

        {step === 1 && (
          <>
            <h2 className="onboard-title">Your Profile</h2>
            <p className="onboard-desc">Tell us about yourself.</p>

            <input className="onboard-input" placeholder="Full Name" />
            <input className="onboard-input" placeholder="Business Name" />

            <button className="onboard-btn" onClick={next}>Next</button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="onboard-title">Add Your First Property</h2>
            <p className="onboard-desc">Start by listing one property.</p>

            <input className="onboard-input" placeholder="Property Name" />
            <input className="onboard-input" placeholder="Location" />

            <button className="onboard-btn" onClick={next}>Next</button>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="onboard-title">Almost Done</h2>
            <p className="onboard-desc">Review and continue.</p>

            <button className="onboard-btn" onClick={finish}>Continue to Dashboard</button>
          </>
        )}
      </div>
    </div>
  );
};

export default OnboardingLandlord;
