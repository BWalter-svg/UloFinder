import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import supabase from "../api/supabaseClient";
import AppLayout from "./AppLayout";

interface LayoutRouteProps {
  element: React.ReactNode;
  useLayout?: boolean; // default true
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
        // Fetch profile to check verification and admin status
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_verified, is_admin")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          setIsVerified(profile.is_verified);
          setIsAdmin(profile.is_admin);
        }
      }
      setLoading(false);
    };

    checkStatus();
  }, []);

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading Ulohub...</div>;
  }

  // 1. Redirect to Login if trying to access protected route while logged out
  const publicPaths = ["/", "/login", "/signup", "/forgot-password", "/reset-password"];
  if (!authenticated && !publicPaths.includes(location.pathname)) {
    return <Navigate to="/login" replace />;
  }

  // 2. SECURITY: Redirect unverified landlords away from "Add Property"
  if (location.pathname === "/landlord/addproperty" && !isVerified) {
    alert("You must be verified to post properties.");
    return <Navigate to="/landlord/verify" replace />;
  }

  // 3. ADMIN: Protect the admin approval page
  if (location.pathname.startsWith("/admin") && !isAdmin) {
    return <Navigate to="/landlord/dashboard" replace />;
  }

  return useLayout ? <AppLayout>{element}</AppLayout> : <>{element}</>;
};

export default LayoutRoute;
