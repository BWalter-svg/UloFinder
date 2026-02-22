import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import supabase from "../api/supabaseClient";
import AppLayout from "./AppLayout";

interface LayoutRouteProps {
  element: React.ReactNode;
  useLayout?: boolean;
}

const LayoutRoute: React.FC<LayoutRouteProps> = ({ element, useLayout = true }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setAuthenticated(true);
        
        // TWEAK: Fetch 'role' instead of 'is_admin'
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("is_verified, role") 
          .eq("id", session.user.id)
          .single();

        if (profile) {
          setIsVerified(profile.is_verified);
          // TWEAK: Check if the role string is exactly 'admin'
          setIsAdmin(profile.role === "admin");
          console.log("User Role:", profile.role, "IsAdmin:", profile.role === "admin");
        } else if (error) {
          console.error("Profile fetch error:", error.message);
        }
      }
      setLoading(false);
    };

    checkStatus();
  }, []);

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading Ulohub...</div>;
  }

  const publicPaths = ["/", "/login", "/signup", "/forgot-password", "/reset-password"];
  const isPublicPath = publicPaths.includes(location.pathname);

  // 1. Redirect to Login if trying to access protected route while logged out
  if (!authenticated && !isPublicPath) {
    return <Navigate to="/login" replace />;
  }

  // 2. SECURITY: Redirect unverified landlords away from "Add Property"
  if (location.pathname === "/landlord/addproperty" && !isVerified) {
    alert("You must be verified to post properties.");
    return <Navigate to="/landlord/dashboard" replace />;
  }

  // 3. ADMIN: Protect the admin approval page
  // TWEAK: Only redirect if it's an admin path AND they aren't an admin
  if (location.pathname.startsWith("/admin") && !isAdmin) {
    console.warn("Unauthorized Admin Access attempt to:", location.pathname);
    return <Navigate to="/landlord/dashboard" replace />;
  }

  return useLayout ? <AppLayout>{element}</AppLayout> : <>{element}</>;
};

export default LayoutRoute;
