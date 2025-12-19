import React, { useState, useEffect } from "react";
import ProfileForm from "../../Components/UI/ProfileForm";
import supabase from "../../api/supabaseClient";

const LandlordProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch landlord profile safely
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Not signed in");

      const { data, error } = await supabase
        .from("landlords")
        .select("*")
        .eq("id", user.id)
        .maybeSingle(); // returns null if no profile

      console.log("Supabase fetch:", { data, error }); // 👈 debug

      if (error) throw error;

      setProfile(data); // can be null for new user
    } catch (err: any) {
      console.error("Failed to fetch profile:", err.message);
      setProfile(null);
    }
    setLoading(false);
  };

  // Fetch on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Landlord Profile</h1>
        <p>{profile ? "Update your profile details below." : "Create your profile below."}</p>
      </div>

      <div className="profile-wrapper">
        {loading ? (
          <p>Loading profile...</p>
        ) : (
          <ProfileForm profile={profile} refreshProfile={fetchProfile} />
        )}
      </div>
    </div>
  );
};

export default LandlordProfile;