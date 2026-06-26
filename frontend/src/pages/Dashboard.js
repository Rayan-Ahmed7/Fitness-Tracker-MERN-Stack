import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Routes, Route, Link } from "react-router-dom";

import WorkoutNutrition from "./WorkoutNutrition";
import AnalyticsPage from "./AnalyticsPage";
import ProfilePage from "./ProfilePage";
import SupportPage from "./SupportPage";
import NotificationAlerts from "./NotificationAlerts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Dashboard() {
  const [loading, setLoading] = useState(false);

  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const [workouts, setWorkouts] = useState([]);
  const [exercise, setExercise] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [duration, setDuration] = useState("");
  const [editId, setEditId] = useState(null);

  const [meals, setMeals] = useState([]);
  const [foodItem, setFoodItem] = useState("");
  const [mealType, setMealType] = useState("Breakfast");
  const [quantity, setQuantity] = useState("");
  const [calories, setCalories] = useState("");
  const [nutritionEditId, setNutritionEditId] = useState(null); 

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    try {
      const resWorkouts = await axios.get("http://localhost:5000/api/workouts", config);
      setWorkouts(resWorkouts.data);

      const resMeals = await axios.get("http://localhost:5000/api/nutrition", config);
      setMeals(resMeals.data);

      const resProfile = await axios.get("http://localhost:5000/api/users/profile", config);
      setProfileName(resProfile.data.name);
      setProfileEmail(resProfile.data.email);
      setProfileImage(resProfile.data.profileImage || "");
    } catch (error) {
      console.log("Error loading data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!profileName || !profileEmail) return alert("Fields cannot be empty");

    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    setLoading(true);
    try {
      await axios.put("http://localhost:5000/api/users/profile", { name: profileName, email: profileEmail }, config);
      alert("Profile Updated Successfully!");
      fetchData();
    } catch (error) {
      alert("Failed to update profile");
    }
    setLoading(false);
  };

  const handleWorkoutSubmit = async () => {
    if (!exercise || !sets || !reps || !duration) return alert("Fill all fields");
    if (Number(sets) <= 0 || Number(reps) <= 0 || Number(duration) <= 0) return alert("Values must be greater than 0");

    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    setLoading(true);
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/workouts/${editId}`, { exercise, sets: Number(sets), reps: Number(reps), duration: Number(duration) }, config);
        alert("Workout updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/workouts", { exercise, sets: Number(sets), reps: Number(reps), duration: Number(duration) }, config);
        alert("Workout added successfully!");
      }
      fetchData();
      clearWorkoutForm();
    } catch (e) { alert("Action Failed"); }
    setLoading(false);
  };

  const deleteWorkout = async (id) => {
    if (window.confirm("Are you sure?")) {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        await axios.delete(`http://localhost:5000/api/workouts/${id}`, config);
        fetchData();
      } catch (e) { alert("Failed to delete"); }
    }
  };

  const clearWorkoutForm = () => {
    setExercise(""); setSets(""); setReps(""); setDuration(""); setEditId(null);
  };

  const handleNutritionSubmit = async () => {
    if (!foodItem || !mealType || !quantity || !calories) return alert("Fill all fields");
    if (Number(calories) <= 0) return alert("Calories must be greater than 0");

    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    setLoading(true);
    try {
      if (nutritionEditId) {
        await axios.put(`http://localhost:5000/api/nutrition/${nutritionEditId}`, { foodItem, mealType, quantity, calories: Number(calories) }, config);
        alert("Meal updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/nutrition", { foodItem, mealType, quantity, calories: Number(calories) }, config);
        alert("Meal logged successfully!");
      }
      fetchData();
      clearNutritionForm();
    } catch (e) { alert("Failed to save meal log"); }
    setLoading(false);
  };

  const deleteMeal = async (id) => {
    if (window.confirm("Are you sure?")) {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      try {
        await axios.delete(`http://localhost:5000/api/nutrition/${id}`, config); 
        fetchData();
      } catch (e) { alert("Failed to delete"); }
    }
  };

  const clearNutritionForm = () => {
    setFoodItem(""); setMealType("Breakfast"); setQuantity(""); setCalories(""); setNutritionEditId(null);
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) { 
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  };
  const downloadCSV = () => {
  const headers = ["Exercise", "Sets", "Reps", "Duration"];

  const rows = workouts.map((workout) => [
    workout.exercise, 
    workout.sets,
    workout.reps,
    workout.duration,
  ]);

  let csvContent =
    headers.join(",") +
    "\n" +
    rows.map((row) => row.join(",")).join("\n"); 

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = "fitness_progress.csv"; 
  link.click(); 
};
const downloadPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Fitness Tracker Progress Report", 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [["Exercise", "Sets", "Reps", "Duration"]],
    body: workouts.map((workout) => [
      workout.exercise,
      workout.sets,
      workout.reps,
      workout.duration + " min",
    ]),
  });

  doc.save("fitness_progress.pdf");
};

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#f4f7f6", paddingBottom: "50px" }}>
      
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm mb-4 py-3">
        <div className="container">
          <Link className="navbar-brand fw-bold fs-4" to="/dashboard">💪 Fitness Tracker</Link>
          
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            {/* Left/Middle Nav Items */}
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-2 ms-4">
              <li className="nav-item">
                <Link className="nav-link text-white fw-bold btn btn-outline-secondary btn-sm border-0 px-3" to="/dashboard">🏋️‍♂️ Track Logs</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white fw-bold btn btn-outline-secondary btn-sm border-0 px-3" to="/dashboard/charts">📊 Progress Chart</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white fw-bold btn btn-outline-secondary btn-sm border-0 px-3" to="/dashboard/support">🛠️ Support</Link>
              </li>
              <li className="nav-item">
  <Link className="nav-link text-white fw-bold" to="/dashboard/alerts">🔔 Alerts</Link>
</li>
            </ul>
            {/* ✨ Right Side Dynamic Profile Section */}
            <div className="d-flex align-items-center">
              <Link to="/dashboard/profile" className="d-flex align-items-center text-decoration-none text-white gap-2 border border-secondary rounded-pill px-3 py-1.5 bg-dark-hover transition-all">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="rounded-circle border border-2 border-primary"
                    style={{ width: "32px", height: "32px", objectFit: "cover" }}
                  />
                ) : (
                  <div 
                    className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold border border-2 border-white"
                    style={{ width: "32px", height: "32px", fontSize: "14px" }}
                  >
                    {profileName ? profileName.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
                <span className="fw-bold small text-light me-1">{profileName || "Profile"}</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="container">
        {/* Analytics Overview Cards */}
        <div className="row mb-4">
          <div className="col-md-4 mb-2">
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white border-start border-primary border-5">
              <h6 className="text-muted text-uppercase small fw-bold mb-1">Workouts Logged</h6>
              <h3 className="fw-bold m-0 text-primary">{workouts.length}</h3>
            </div>
          </div>
          <div className="col-md-4 mb-2">
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white border-start border-warning border-5">
              <h6 className="text-muted text-uppercase small fw-bold mb-1">Total Active Time</h6>
              <h3 className="fw-bold m-0 text-warning">{workouts.reduce((s, w) => s + (w.duration || 0), 0)} <span className="fs-6 text-muted fw-normal">mins</span></h3>
            </div>
          </div>
          <div className="col-md-4 mb-2">
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white border-start border-success border-5">
              <h6 className="text-muted text-uppercase small fw-bold mb-1">Calories Consumed</h6>
              <h3 className="fw-bold m-0 text-success">{meals.reduce((s, m) => s + (m.calories || 0), 0)} <span className="fs-6 text-muted fw-normal">kcal</span></h3>
            </div>
          </div>
        </div>
      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4">
  <div className="d-flex flex-wrap justify-content-between align-items-center">

    <div>
      <h5 className="fw-bold mb-1">📊 Progress Reports</h5>
      <small className="text-muted">
        Download your workout progress anytime
      </small>
    </div>

    <div className="d-flex gap-2 mt-3 mt-md-0">

      <button
        className="btn btn-success px-4 py-2 fw-bold rounded-pill shadow-sm"
        onClick={downloadCSV}
      >
        📄 Export CSV
      </button>

      <button
        className="btn btn-danger px-4 py-2 fw-bold rounded-pill shadow-sm"
        onClick={downloadPDF}
      >
        📕 Export PDF
      </button>

    </div>

  </div>
</div>
        {/* 🔀 DYNAMIC NESTED ROUTES */}
        <Routes>
          <Route path="/" element={
            <WorkoutNutrition 
              workouts={workouts} exercise={exercise} setExercise={setExercise} sets={sets} setSets={setSets} reps={reps} setReps={setReps} duration={duration} setDuration={setDuration} editId={editId} setEditId={setEditId} handleWorkoutSubmit={handleWorkoutSubmit} deleteWorkout={deleteWorkout} clearWorkoutForm={clearWorkoutForm}
              meals={meals} foodItem={foodItem} setFoodItem={setFoodItem} mealType={mealType} setMealType={setMealType} quantity={quantity} setQuantity={setQuantity} calories={calories} setCalories={setCalories} nutritionEditId={nutritionEditId} setNutritionEditId={setNutritionEditId} handleNutritionSubmit={handleNutritionSubmit} deleteMeal={deleteMeal} clearNutritionForm={clearNutritionForm} loading={loading}
            />
          } />
          <Route path="charts" element={<AnalyticsPage meals={meals} workouts={workouts} />} />
          <Route path="profile" element={
            <ProfilePage 
              profileName={profileName} setProfileName={setProfileName} profileEmail={profileEmail} setProfileEmail={setProfileEmail} handleProfileUpdate={handleProfileUpdate} loading={loading} handleLogout={handleLogout} // ✨ Logout pass kiya profile page ko
            />
          } />
          <Route path="support" element={<SupportPage />} />
          <Route path="alerts" element={<NotificationAlerts />} />
        </Routes>

      </div>
    </div>
  );
}

export default Dashboard;