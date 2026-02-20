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
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        
        if (!user) {
          setStatus({ loading: false, isAdmin: false, reason: "No Session Found" });
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (error || !profile) {
          setStatus({ loading: false, isAdmin: false, reason: "No Profile in DB" });
          return;
        }

        const isUserAdmin = profile.role === "admin";
        
        // This alert will tell us EXACTLY what is wrong before the redirect happens
        if (!isUserAdmin) {
          alert(`Access Denied! Your role is: ${profile.role}`);
        }

        setStatus({ 
          loading: false, 
          isAdmin: isUserAdmin, 
          reason: profile.role 
        });
      } catch (err) {
        setStatus({ loading: false, isAdmin: false, reason: "Crash" });
      }
    }
    checkUser();
  }, []);

  if (status.loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="animate-pulse">Verifying Access Rights...</p>
      </div>
    );
  }

  if (!status.isAdmin) {
    // Note: If you end up at the landing page "/", it means your App.tsx is broken.
    // This line sends you to "/landlord/dashboard".
    return <Navigate to="/landlord/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
