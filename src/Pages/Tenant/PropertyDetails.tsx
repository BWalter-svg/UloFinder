import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../../api/supabaseClient";
import "./ExploreHouses.css";

type House = {
  id: string;
  title: string;
  price: number;
  location: string;
  description?: string;
  image_url?: string;
  latitude?: number | null;
  longitude?: number | null;
};

const HouseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [house, setHouse] = useState<House | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("houses").select("*").eq("id", id).single();
      if (error) {
        console.error("house fetch error", error);
      } else {
        setHouse(data as House);
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  const handleBook = async () => {
    setBookingLoading(true);
    try {
      // get current user (supabase v2)
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        // redirect to login if not signed in
        navigate("/login");
        return;
      }

      const { error } = await supabase.from("bookings").insert({
        user_id: user.id,
        house_id: house?.id,
        status: "pending",
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error("booking error", error);
        alert("Booking failed. Try again.");
      } else {
        alert("Booking requested! Check your bookings.");
        navigate("/tenant/dashboard"); // or to a bookings page
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="page-loader">Loading...</div>;
  if (!house) return <div className="page-loader">House not found.</div>;

  return (
    <div className="details-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="details-top">
        <img src={house.image_url || "/placeholder-house.jpg"} alt={house.title} className="details-img" />

        <div className="details-meta">
          <h1 className="details-title">{house.title}</h1>
          <p className="details-location">{house.location}</p>
          <div className="details-price">₦{Number(house.price).toLocaleString()}</div>

          <div className="details-actions">
            <button className="btn-outline" onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}>
              See on map
            </button>

            <button className="btn-primary" onClick={handleBook} disabled={bookingLoading}>
              {bookingLoading ? "Booking..." : "Book Now"}
            </button>
          </div>
        </div>
      </div>

      <div className="details-body">
        <h3>About this place</h3>
        <p>{house.description || "No description provided."}</p>

        <h3>Location</h3>
        <p>{house.location}</p>

        <div className="map-embed">
          <iframe
            title="house-map"
            width="100%"
            height="360"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(house.location)}`}
          />
        </div>
      </div>
    </div>
  );
};

export default HouseDetails;
