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
  const [companyName, setCompanyName] = useState<string | null>(null);
  const location = useLocation();

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

        // Fetch ONLY the company name now
        const { data: profile } = await supabase
          .from("profiles")
          .select("company_name")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          setCompanyName(profile.company_name);
          console.log("🏢 Landlord Identity:", profile.company_name || "No Company Name set");
        }
      } catch (err) {
        console.error("LayoutRoute Error:", err);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [location.pathname]);

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading Ulohub...</div>;
  }

  const publicPaths = ["/", "/login", "/signup", "/forgot-password", "/reset-password"];
  const isPublicPath = publicPaths.includes(location.pathname);

  // 1. AUTH GUARD: Not logged in? Go to login.
  if (!authenticated && !isPublicPath) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. COMPANY GUARD: Can't add property without a Company Name
  if (location.pathname === "/landlord/addproperty" && !companyName) {
    alert("Abeg, update your Company Name in your profile before posting a property!");
    return <Navigate to="/landlord/dashboard" replace />;
  }

  return useLayout ? <AppLayout>{element}</AppLayout> : <>{element}</>;
};

export default LayoutRoute;
