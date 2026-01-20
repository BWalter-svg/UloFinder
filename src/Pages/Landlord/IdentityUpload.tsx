import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, ChevronLeft, FileText, X, Loader2 } from "lucide-react";
import supabase from "../../api/supabaseClient";

export default function IdentityUpload() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication failed");

      // 1. Create unique path: user_id/timestamp_filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // 2. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('verification-docs')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 3. Update the agent_verification table
      const { error: dbError } = await supabase
        .from('agent_verification')
        .upsert({
          agent_id: user.id,
          id_url: fileName,
          status: 'pending',
          updated_at: new Date().toISOString(),
        });

      if (dbError) throw dbError;

      alert("Documents uploaded successfully!");
      navigate("/landlord/verify");
    } catch (err: any) {
      alert(err.message || "An error occurred during upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="verify-hub-container">
      <div className="back-nav" onClick={() => navigate("/landlord/verify")}>
        <ChevronLeft size={20} /> <span>Back to Hub</span>
      </div>

      <div className="verify-header">
        <h1>Upload Identity</h1>
        <p>Please provide a clear photo of your Government issued ID (NIN, BVN, or Driver's License).</p>
      </div>

      <div 
        className={`upload-zone ${dragActive ? 'active' : ''} ${file ? 'has-file' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => { e.preventDefault(); setFile(e.dataTransfer.files[0]); setDragActive(false); }}
      >
        <input type="file" id="file-input" hidden onChange={handleFileChange} accept="image/*,.pdf" />
        
        {!file ? (
          <label htmlFor="file-input" className="upload-content">
            <div className="upload-icon-circle">
              <Upload size={32} />
            </div>
            <h3>Tap to upload</h3>
            <p>PDF, JPG, or PNG (Max 5MB)</p>
          </label>
        ) : (
          <div className="file-preview">
            <FileText size={40} color="var(--primary-blue)" />
            <div className="file-details">
              <h4>{file.name}</h4>
              <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button className="remove-file" onClick={() => setFile(null)}>
              <X size={20} />
            </button>
          </div>
        )}
      </div>

      <div className="security-lockout">
        <p> Your document is encrypted and stored securely. Only Ulohub admins can view this for verification purposes.</p>
      </div>

      <button 
        className="verify-submit-btn" 
        disabled={!file || uploading} 
        onClick={handleUpload}
      >
        {uploading ? <><Loader2 className="spinner" size={20} /> Uploading...</> : "Submit for Verification"}
      </button>
    </div>
  );
}
