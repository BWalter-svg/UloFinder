import React, { useEffect, useState, useRef } from "react";
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
  
  // Use a ref to track if we've already checked the session to prevent flickering
  const hasChecked = useRef(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setAuthenticated(false);
          setLoading(false);
          return;
        }

        setAuthenticated(true);

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("is_verified, role, is_admin")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          setIsVerified(profile.is_verified || false);
          // Standardizing the admin check
          const adminStatus = profile.role === "admin" || profile.is_admin === true;
          setIsAdmin(adminStatus);
          
          console.log("🛡️ Bouncer Stats:", { 
            Role: profile.role, 
            isAdminBool: profile.is_admin, 
            FinalDecision: adminStatus 
          });
        }
      } catch (err) {
        console.error("LayoutRoute Error:", err);
      } finally {
        setLoading(false);
        hasChecked.current = true;
      }
    };

    checkStatus();
  }, [location.pathname]);

  // --- RENDERING LOGIC ---

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading Ulohub...</div>;
  }

  const publicPaths = ["/", "/login", "/signup", "/forgot-password", "/reset-password"];
  const isPublicPath = publicPaths.includes(location.pathname);

  // 1. Not logged in? Go to login.
  if (!authenticated && !isPublicPath) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Admin Protection (More precise check)
  if (location.pathname.startsWith("/admin")) {
    if (!isAdmin) {
      console.warn("Unauthorized Admin Access attempt. Redirecting...");
      return <Navigate to="/landlord/dashboard" replace />;
    }
  }

  // 3. ADMIN: Protect the admin approval page
  if (location.pathname.startsWith("/admin")) {
    // If we are still loading, don't redirect yet!
    if (loading) return null; 

    if (!isAdmin) {
      console.warn("Bouncer says NO. isAdmin state is false.");
      return <Navigate to="/landlord/dashboard" replace />;
    }
    
    console.log("Bouncer says YES. Welcome to the Admin Panel.");
  }

  return useLayout ? <AppLayout>{element}</AppLayout> : <>{element}</>;
};

export default LayoutRoute;

