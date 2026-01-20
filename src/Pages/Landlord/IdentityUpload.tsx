import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, ChevronLeft, FileText, X, Loader2, CheckCircle } from "lucide-react";
import supabase from "../../api/supabaseClient";
import confetti from "canvas-confetti"; // Install this: npm install canvas-confetti

export default function IdentityUpload() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // Success state

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

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // 1. Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from('verification-docs')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Update Table (Renamed to landlord_verification)
      const { error: dbError } = await supabase
        .from('landlord_verification') 
        .upsert({
          landlord_id: user.id, // Renamed key
          id_url: fileName,
          status: 'pending',
          updated_at: new Date().toISOString(),
        });

      if (dbError) throw dbError;

      // 3. Trigger Success!
      setIsSuccess(true);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#007bff', '#28a745', '#ffffff']
      });

    } catch (err: any) {
      alert(err.message || "An error occurred during upload");
    } finally {
      setUploading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="success-screen">
        <div className="success-card">
          <div className="check-animation">
            <CheckCircle size={100} color="#28a745" strokeWidth={1.5} />
          </div>
          <h1>Perfect!</h1>
          <p>Your identity documents have been submitted securely. Our team will review them within 24 hours.</p>
          <button onClick={() => navigate("/landlord/dashboard")} className="done-btn">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="verify-hub-container">
      <div className="back-nav" onClick={() => navigate("/landlord/verify")}>
        <ChevronLeft size={20} /> <span>Back to Hub</span>
      </div>

      <div className="verify-header">
        <h1>Upload Identity</h1>
        <p>Please provide a clear photo of your Government issued ID.</p>
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
            <FileText size={40} color="#007bff" />
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
