import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import supabase from "../api/supabaseClient";
import { Loader2 } from "lucide-react";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          console.log("AdminRoute: No user found", authError);
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("AdminRoute: Profile fetch error", profileError);
          setIsAdmin(false);
        } else {
          console.log("AdminRoute: Found role ->", profile?.role);
          // Check if it's EXACTLY 'admin' (case sensitive)
          setIsAdmin(profile?.role === "admin");
        }
      } catch (err) {
        console.error("AdminRoute: Unexpected error", err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }
    checkAdmin();
  }, []);

  // While checking, show the loader
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <Loader2 className="animate-spin" size={48} />
        <p>Checking permissions...</p>
      </div>
    );
  }

  // If the check finished and isAdmin is still not true, redirect
  if (isAdmin !== true) {
    console.log("AdminRoute: Redirecting to landing because isAdmin is", isAdmin);
    return <Navigate to="/" replace />; 
  }

  return <>{children}</>;
}
