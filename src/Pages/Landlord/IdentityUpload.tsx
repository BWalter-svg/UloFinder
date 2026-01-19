import React, { useState } from "react";
import { Upload, ChevronLeft } from "lucide-react";

export default function IdentityUpload() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="verify-container">
      <div className="verify-card">
        <div className="back-nav">
           <ChevronLeft size={20} /> <span>Back</span>
        </div>
        
        <h2 className="verify-title">Upload Identity</h2>
        <p className="verify-subtitle">Upload a clear photo of your NIN Slip or Driver's License.</p>

        <div className="upload-box">
          <input type="file" id="id-upload" hidden onChange={(e) => setFile(e.target.files![0])} />
          <label htmlFor="id-upload" className="upload-label">
            <Upload size={40} color="var(--primary-blue)" />
            <span>{file ? file.name : "Tap to upload document"}</span>
          </label>
        </div>

        <div className="verification-notice">
          <p> Your data is encrypted and sent directly to government verification servers.</p>
        </div>

        <button className="verify-submit" disabled={!file}>
          Submit for Review
        </button>
      </div>
    </div>
  );
}
