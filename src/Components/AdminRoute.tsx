import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import supabase from "../api/supabaseClient";
import { Loader2 } from "lucide-react";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      setIsAdmin(profile?.role === "admin");
      setLoading(false);
    }
    checkAdmin();
  }, []);

  if (loading) return <div className="admin-loader"><Loader2 className="spinner" /></div>;

  if (!isAdmin) {
    // If not admin, kick them to their dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
