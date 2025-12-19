import React, { useState, useEffect } from "react";
import supabase from "../../api/supabaseClient";
import "../ProfileForm.css";

interface ProfileFormProps {
  profile: any; // can be null
  refreshProfile: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, refreshProfile }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    company_name: "",
  });

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [editing, setEditing] = useState(false);

  // Load profile into form
  useEffect(() => {
    console.log("Profile prop:", profile); // 👈 debug
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        company_name: profile.company_name || "",
      });
      setAvatarUrl(profile.avatar_url || null);
      setEditing(false); // existing profile readonly
    } else {
      setEditing(true); // new profile starts in edit mode
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Upload avatar (landlords only)
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editing) return;

    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarUrl(URL.createObjectURL(file));
    setUploading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");

      const filePath = `${Date.now()}-${file.name}`;


      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { contentType: file.type, upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      if (!data?.publicUrl) throw new Error("Failed to get public URL");

      const { error: updateError } = await supabase
        .from("landlords")
        .update({ avatar_url: data.publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setSuccessMsg("Avatar uploaded successfully!");
      refreshProfile();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to upload avatar");
    }

    setUploading(false);
  };

  // Submit form (create or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");

      if (profile) {
        // UPDATE
        const { error } = await supabase
          .from("landlords")
          .update(formData)
          .eq("id", user.id);
        if (error) throw error;
        setSuccessMsg("Profile updated successfully!");
      } else {
        // CREATE
        const { error } = await supabase
          .from("landlords")
          .insert([{ id: user.id, ...formData }]);
        if (error) throw error;
        setSuccessMsg("Profile created successfully!");
      }

      refreshProfile();
      setEditing(false);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save profile");
    }

    setLoading(false);
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <div className="avatar-section">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="avatar-img" />
        ) : (
          <div className="avatar-placeholder">?</div>
        )}

        {editing && (
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            disabled={uploading}
            className="file-input"
          />
        )}

        {uploading && <p className="uploading-text">Uploading...</p>}
      </div>

      <input
        type="text"
        name="full_name"
        placeholder="Full Name"
        value={formData.full_name}
        onChange={handleChange}
        readOnly={!editing}
        className="form-input"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        readOnly={!editing}
        className="form-input"
      />
      <input
        type="text"
        name="phone"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={handleChange}
        readOnly={!editing}
        className="form-input"
      />
      <input
        type="text"
        name="company_name"
        placeholder="Company Name"
        value={formData.company_name}
        onChange={handleChange}
        readOnly={!editing}
        className="form-input"
      />

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading
          ? "Saving..."
          : editing
          ? profile
            ? "Save Profile"
            : "Create Profile"
          : "Edit Profile"}
      </button>

      {successMsg && <p className="success-msg">{successMsg}</p>}
      {errorMsg && <p className="error-msg">{errorMsg}</p>}
    </form>
  );
};

export default ProfileForm;