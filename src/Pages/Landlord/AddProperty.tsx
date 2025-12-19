import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../api/supabaseClient";
import "./AddProperty.css";

const AddProperty: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleAddProperty = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be logged in to add a property.");
      return;
    }

    let image_url = null;

    if (imageFile) {
      setUploading(true);
      try {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `property-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("property-images")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { publicUrl } = supabase.storage
          .from("property-images")
          .getPublicUrl(filePath);

        image_url = publicUrl;
      } catch (err: any) {
        console.error(err);
        alert("Image upload failed: " + err.message);
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    try {
      const { error } = await supabase.from("properties").insert({
        title,
        location,
        price,
        description,
        image_url,
        owner_id: user.id,
      });

      if (error) throw error;

      alert("Property added successfully!");
      navigate("/landlord/dashboard");
    } catch (err: any) {
      console.error(err);
      alert("Failed to add property: " + err.message);
    }
  };

  return (
    <div className="add-property-container">
      <h2 className="add-property-title">Add New Property</h2>

      <div className="flex flex-col gap-3">
        <input
          type="text"
          className="add-property-input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          className="add-property-input"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          type="number"
          className="add-property-input"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />

        <textarea
          className="add-property-textarea"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          className="add-property-file"
          onChange={(e) =>
            setImageFile(e.target.files ? e.target.files[0] : null)
          }
        />

        <button
          onClick={handleAddProperty}
          disabled={uploading}
          className="add-property-btn"
        >
          {uploading ? "Uploading..." : "Add Property"}
        </button>
      </div>
    </div>
  );
};

export default AddProperty;