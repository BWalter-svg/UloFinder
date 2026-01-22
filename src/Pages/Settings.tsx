import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Bell, Shield, LogOut, Camera, Loader2, CheckCircle } from "lucide-react";
import supabase from "../../api/supabaseClient";
import "./Settings.css";

export default function Settings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile"); // Tab State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    role: "",
    is_verified: false
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      setProfile({
        full_name: data?.full_name || "",
        email: user.email || "",
        phone: data?.phone || "",
        role: data?.role || "landlord",
        is_verified: data?.is_verified || false
      });
    }
    setLoading(false);
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        phone: profile.phone
      })
      .eq("id", user?.id);

    setSaving(false);
    if (!error) alert("Profile updated successfully!");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) return <div className="settings-loader"><Loader2 className="spinner" /></div>;

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Account Settings</h1>
        <p>Manage your profile and platform preferences.</p>
      </div>

      <div className="settings-grid">
        {/* Navigation Sidebar */}
        <aside className="settings-nav">
          <button 
            className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <User size={18} /> Profile
          </button>
          <button 
            className={`nav-item ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <Lock size={18} /> Security
          </button>
          <button 
            className={`nav-item ${activeTab === "notifications" ? "active" : ""}`}
            onClick={() => setActiveTab("notifications")}
          >
            <Bell size={18} /> Notifications
          </button>
          <button className="nav-item logout" onClick={handleLogout}>
            <LogOut size={18} /> Logout
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="settings-content">
          
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <section className="settings-section fade-in">
              <div className="profile-photo-section">
                <div className="avatar-wrapper">
                  <img src={`https://ui-avatars.com/api/?name=${profile.full_name}&background=eff6ff&color=007bff`} alt="Avatar" />
                  <button className="edit-photo"><Camera size={14} /></button>
                </div>
                <div className="profile-badge">
                  <span className={`status-pill ${profile.is_verified ? 'verified' : 'unverified'}`}>
                    <Shield size={12} /> {profile.is_verified ? "Verified Landlord" : "Unverified"}
                  </span>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="settings-form">
                <div className="input-row">
                  <div className="input-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      value={profile.full_name} 
                      onChange={(e) => setProfile({...profile, full_name: e.target.value})} 
                    />
                  </div>
                  <div className="input-group">
                    <label>Email Address</label>
                    <input type="email" value={profile.email} disabled className="disabled-input" />
                  </div>
                </div>

                <div className="input-row">
                  <div className="input-group">
                    <label>Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="+234..." 
                      value={profile.phone} 
                      onChange={(e) => setProfile({...profile, phone: e.target.value})} 
                    />
                  </div>
                  <div className="input-group">
                    <label>Role</label>
                    <input type="text" value={profile.role} disabled className="capitalize disabled-input" />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="save-btn" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <section className="settings-section fade-in">
              <h3>Security Settings</h3>
              <p className="tab-desc">Update your password and manage account security.</p>
              <div className="security-action">
                <button className="outline-btn" onClick={() => navigate("/forgot-password")}>
                  Change Password via Email
                </button>
              </div>
            </section>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <section className="settings-section fade-in">
              <h3>Notifications</h3>
              <p className="tab-desc">Control how you receive alerts from Ulohub.</p>
              
              <div className="notif-list">
                <div className="notif-item">
                  <div>
                    <p className="notif-title">Email Notifications</p>
                    <p className="notif-sub">Receive property inquiries and platform updates.</p>
                  </div>
                  <div className="status-badge">Active</div>
                </div>
                
                <div className="notif-item">
                  <div>
                    <p className="notif-title">Push Notifications</p>
                    <p className="notif-sub">Get instant mobile alerts for new messages.</p>
                  </div>
                  <div className="status-badge disabled">Coming Soon</div>
                </div>
              </div>
            </section>
          )}

        </main>
      </div>
    </div>
  );
}
