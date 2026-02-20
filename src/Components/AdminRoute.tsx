import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import supabase from "../api/supabaseClient";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const [status, setStatus] = useState({
    loading: true,
    isAdmin: false,
    reason: "Initializing"
  });

  useEffect(() => {
    async function checkUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setStatus({ loading: false, isAdmin: false, reason: "No user found" });
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (error || !profile) {
          setStatus({ loading: false, isAdmin: false, reason: "Profile error" });
          return;
        }

        setStatus({ 
          loading: false, 
          isAdmin: profile.role === "admin", 
          reason: profile.role 
        });
      } catch (err) {
        setStatus({ loading: false, isAdmin: false, reason: "System error" });
      }
    }
    checkUser();
  }, []);

  if (status.loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Verifying admin status...</p>
      </div>
    );
  }

  if (!status.isAdmin) {
    console.error("Access Denied. Reason:", status.reason);
    return <Navigate to="/landlord/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
