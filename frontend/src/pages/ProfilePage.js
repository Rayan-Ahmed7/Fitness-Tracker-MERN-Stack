import React, { useState } from "react";

// ✨ `handleLogout` prop ko yahan list mein add kiya
function ProfilePage({ profileName, setProfileName, profileEmail, setProfileEmail, handleProfileUpdate, loading, handleLogout }) {
  const [age, setAge] = useState(localStorage.getItem("user_age") || "24");
  const [weight, setWeight] = useState(localStorage.getItem("user_weight") || "70");
  const [height, setHeight] = useState(localStorage.getItem("user_height") || "175");
  const [gender, setGender] = useState(localStorage.getItem("user_gender") || "Male");
  
  const defaultAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix";
  
  const [selectedAvatar, setSelectedAvatar] = useState(
    localStorage.getItem("user_avatar") || defaultAvatar
  );

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size is too large! Please upload an image under 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const localFormSubmit = (e) => {
    localStorage.setItem("user_age", age);
    localStorage.setItem("user_weight", weight);
    localStorage.setItem("user_height", height);
    localStorage.setItem("user_gender", gender);
    localStorage.setItem("user_avatar", selectedAvatar);
    handleProfileUpdate(e);
  };

  // ⚠️ DELETE ACCOUNT HANDLER
  const handleDeleteAccount = () => {
    if (window.confirm("❗ WARNING: Are you absolutely sure you want to delete your account? This action is permanent and cannot be undone.")) {
      if (window.confirm("Double confirmation: Delete all logged workouts, nutrition records, and user configuration files?")) {
        // Clear all storage metrics
        localStorage.clear();
        alert("Your profile and session variables have been securely erased.");
        window.location.href = "/";
      }
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card shadow border-0 rounded-4 p-4 bg-white">
          <div className="text-center mb-4">
            <h4 className="fw-bold text-dark mb-1">👤 Personal Profile Setup</h4>
            <p className="text-muted small">Update your bio, profile image, and fitness metrics</p>
          </div>

          {/* 🖼️ PROFILE PICTURE UPLOAD SECTION */}
          <div className="text-center mb-4 bg-light p-4 rounded-4 border">
            <label className="form-label d-block small fw-bold text-secondary mb-2">Profile Picture</label>
            
            <div className="position-relative d-inline-block mb-3">
              <img 
                src={selectedAvatar} 
                alt="Profile Avatar" 
                className="rounded-circle border border-primary border-3 bg-white p-1 shadow-sm" 
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
              />
            </div>

            <div className="mx-auto" style={{ maxWidth: "250px" }}>
              <input 
                type="file" 
                id="profileFileInput" 
                accept="image/*" 
                className="d-none" 
                onChange={handleImageChange} 
              />
              <label 
                htmlFor="profileFileInput" 
                className="btn btn-outline-primary btn-sm fw-bold px-3 py-2 w-100 shadow-sm"
                style={{ borderRadius: "8px", cursor: "pointer" }}
              >
                📁 Choose Custom Photo
              </label>
              <small className="text-muted d-block mt-1" style={{ fontSize: "11px" }}>Supports PNG, JPG (Max 2MB)</small>
            </div>
          </div>

          {/* PROFILE UPDATE FORM */}
          <form onSubmit={localFormSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-bold text-secondary">Full Name</label>
              <input 
                type="text" 
                className="form-control bg-light border-0 py-2" 
                style={{ borderRadius: "8px" }} 
                value={profileName} 
                onChange={(e) => setProfileName(e.target.value)} 
                required 
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-secondary">Email Address</label>
              <input 
                type="email" 
                className="form-control bg-light border-0 py-2" 
                style={{ borderRadius: "8px" }} 
                value={profileEmail} 
                onChange={(e) => setProfileEmail(e.target.value)} 
                required 
              />
            </div>

            {/* 📏 BASIC FITNESS INFO FIELDS */}
            <div className="row">
              <div className="col-6 mb-3">
                <label className="form-label small fw-bold text-secondary">Age (Years)</label>
                <input 
                  type="number" 
                  className="form-control bg-light border-0 py-2" 
                  style={{ borderRadius: "8px" }} 
                  value={age} 
                  onChange={(e) => setAge(e.target.value)} 
                />
              </div>
              <div className="col-6 mb-3">
                <label className="form-label small fw-bold text-secondary">Gender</label>
                <select 
                  className="form-select bg-light border-0 py-2" 
                  style={{ borderRadius: "8px" }} 
                  value={gender} 
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-6">
                <label className="form-label small fw-bold text-secondary">Weight (kg)</label>
                <input 
                  type="number" 
                  className="form-control bg-light border-0 py-2" 
                  style={{ borderRadius: "8px" }} 
                  value={weight} 
                  onChange={(e) => setWeight(e.target.value)} 
                />
              </div>
              <div className="col-6">
                <label className="form-label small fw-bold text-secondary">Height (cm)</label>
                <input 
                  type="number" 
                  className="form-control bg-light border-0 py-2" 
                  style={{ borderRadius: "8px" }} 
                  value={height} 
                  onChange={(e) => setHeight(e.target.value)} 
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-lg w-100 fw-bold py-2.5 text-uppercase shadow-sm mb-3" 
              style={{ borderRadius: "8px", fontSize: "14px" }} 
              disabled={loading}
            >
              {loading ? "Updating..." : "Save Profile Details"}
            </button>
          </form>

          {/* ✨ DANGER & ACCOUNT MANAGEMENT ZONE */}
          <hr className="my-4" />
          
          <div className="bg-light p-3 rounded-4 border border-dashed text-center">
            <h6 className="fw-bold text-secondary small mb-3">🔒 Account Actions</h6>
            <div className="d-flex justify-content-center gap-2">
              <button 
                type="button" 
                className="btn btn-outline-secondary btn-sm fw-bold px-3" 
                style={{ borderRadius: "6px" }}
                onClick={handleLogout}
              >
                🚪 Logout
              </button>
              <button 
                type="button" 
                className="btn btn-danger btn-sm fw-bold px-3" 
                style={{ borderRadius: "6px" }}
                onClick={handleDeleteAccount}
              >
                🗑️ Delete Account
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProfilePage;