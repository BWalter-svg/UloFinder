import React from "react";
import Card from "../../Components/UI/Card";

const Maintenance: React.FC = () => {
  const dummy = [
    { id: 1, title: "Leaking tap", status: "Pending", date: "2025-01-03" },
    { id: 2, title: "Broken socket", status: "In Progress", date: "2025-01-04" },
  ];

  return (
    <div className="p-6 mt-20">
      <h1 className="text-2xl font-bold text-sky-600 mb-4">Maintenance Requests</h1>

      <div className="grid gap-6">
        {dummy.map((item) => (
          <Card key={item.id}>
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="text-gray-500">{item.date}</p>

            <p
              className={`mt-2 font-medium ${
                item.status === "Pending"
                  ? "text-red-500"
                  : item.status === "In Progress"
                  ? "text-yellow-500"
                  : "text-green-500"
              }`}
            >
              {item.status}
            </p>

            <button className="mt-3 text-sky-600 hover:underline">
              View Details
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Maintenance;
