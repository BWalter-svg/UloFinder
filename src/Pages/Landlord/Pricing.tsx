import React from "react";
import { useNavigate } from "react-router-dom";
import { FiAward, FiTrendingUp, FiBriefcase } from "react-icons/fi";
import "../../App.css";

const Pricing: React.FC = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Free Plan",
      description: "1 property listing with basic features.",
      path: "/pricing/free",
      icon: <FiAward size={28} className="text-sky-500" />,
    },
    {
      title: "Pro Landlord",
      description: "10 listings, rent tracking, and priority support.",
      path: "/pricing/pro",
      icon: <FiTrendingUp size={28} className="text-sky-500" />,
    },
    {
      title: "Business",
      description: "Unlimited listings, full analytics, team access.",
      path: "/pricing/business",
      icon: <FiBriefcase size={28} className="text-sky-500" />,
    },
  ];

  return (
    <div className="page-container mt-20">
      <h1>Pricing Plans</h1>
      <div className="card-grid">
        {cards.map((card, index) => (
          <div
            key={index}
            className="card flex flex-col items-start gap-3 p-4"
            onClick={() => navigate(card.path)}
            style={{ cursor: "pointer" }}
          >
            {card.icon}
            <h2 className="text-lg font-semibold">{card.title}</h2>
            <p className="text-gray-600">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
