import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Onboarding.css";

const OnboardingTenant: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const next = () => setStep(step + 1);
  const finish = () => navigate("/tenant/dashboard");

  return (
    <div className="onboard-container">
      <div className="onboard-card">
        <img src="/ulohub.jpg" alt="Ulohub Logo" className="onboard-logo" />

        {step === 1 && (
          <>
            <h2 className="onboard-title">Your Profile</h2>
            <p className="onboard-desc">Set up your personal details.</p>

            <input className="onboard-input" placeholder="Full Name" />
            <input className="onboard-input" placeholder="Preferred Location" />

            <button className="onboard-btn" onClick={next}>Next</button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="onboard-title">Your Preferences</h2>
            <p className="onboard-desc">What kind of home do you want?</p>

            <input className="onboard-input" placeholder="Budget Range" />
            <input className="onboard-input" placeholder="House Type" />

            <button className="onboard-btn" onClick={next}>Next</button>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="onboard-title">You're Ready</h2>
            <p className="onboard-desc">Let’s find you a home.</p>

            <button className="onboard-btn" onClick={finish}>Continue to Dashboard</button>
          </>
        )}
      </div>
    </div>
  );
};

export default OnboardingTenant;
