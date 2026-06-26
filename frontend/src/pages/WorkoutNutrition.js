import React, { useState } from "react";

function WorkoutNutrition({
  workouts = [],
  exercise = "",
  setExercise = () => {},
  sets = "",
  setSets = () => {},
  reps = "",
  setReps = () => {},
  duration = "",
  setDuration = () => {},
  editId = null,
  setEditId = () => {},
  handleWorkoutSubmit = () => {},
  deleteWorkout = () => {},
  clearWorkoutForm = () => {},
  meals = [],
  foodItem = "",
  setFoodItem = () => {},
  mealType = "Breakfast",
  setMealType = () => {},
  quantity = "",
  setQuantity = () => {},
  calories = "",
  setCalories = () => {},
  nutritionEditId = null,
  setNutritionEditId = () => {},
  handleNutritionSubmit = () => {},
  deleteMeal = () => {},
  clearNutritionForm = () => {},
  loading = false
}) {

  const [workoutSearch, setWorkoutSearch] = useState("");
  const [nutritionSearch, setNutritionSearch] = useState("");
  const [mealFilter, setMealFilter] = useState("All");

  const filteredWorkouts = (workouts || []).filter(w => {
    const exerciseName = w?.exercise || w?.title || "";
    return exerciseName.toLowerCase().includes((workoutSearch || "").toLowerCase());
  });

  const filteredMeals = (meals || []).filter(m => {
    const matchesSearch = (m?.foodItem || "").toLowerCase().includes((nutritionSearch || "").toLowerCase());
    const matchesFilter = mealFilter === "All" || m?.mealType === mealFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div className="row">
        {/* WORKOUT SECTION */}
        <div className="col-lg-6 mb-4">
          <div className={`card shadow p-4 border-0 rounded-4 bg-white ${editId ? "border border-warning border-2" : ""}`}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className={`fw-bold m-0 ${editId ? "text-warning" : "text-primary"}`}>{editId ? "📝 Edit Workout" : "➕ Add Workout"}</h4>
              {editId && <button className="btn btn-sm btn-light text-muted" onClick={clearWorkoutForm}>Cancel</button>}
            </div>
            
            <div className="mb-3">
              <label className="form-label small fw-bold text-secondary">Exercise Name</label>
              <input className="form-control bg-light border-0 py-2" style={{ borderRadius: "8px" }} value={exercise} onChange={(e) => setExercise(e.target.value)} placeholder="e.g., Bench Press" />
            </div>
            <div className="row">
              <div className="col-6 mb-3"><label className="form-label small fw-bold text-secondary">Sets</label><input type="number" className="form-control bg-light border-0 py-2" style={{ borderRadius: "8px" }} value={sets} onChange={(e) => setSets(e.target.value)} /></div>
              <div className="col-6 mb-3"><label className="form-label small fw-bold text-secondary">Reps</label><input type="number" className="form-control bg-light border-0 py-2" style={{ borderRadius: "8px" }} value={reps} onChange={(e) => setReps(e.target.value)} /></div>
            </div>
            <div className="mb-4"><label className="form-label small fw-bold text-secondary">Duration (Mins)</label><input type="number" className="form-control bg-light border-0 py-2" style={{ borderRadius: "8px" }} value={duration} onChange={(e) => setDuration(e.target.value)} /></div>
            <button className={`btn btn-lg w-100 fw-bold py-2.5 text-white text-uppercase shadow-sm ${editId ? "btn-warning" : "btn-primary"}`} style={{ borderRadius: "8px" }} onClick={handleWorkoutSubmit} disabled={loading}>
              {editId ? "Save Changes" : "Save Workout"}
            </button>

            {/* 🔍 WORKOUT SEARCH */}
            <h5 className="fw-bold mt-5 mb-3 text-secondary">Workout History</h5>
            <div className="mb-3">
              <input 
                type="text" 
                className="form-control form-control-sm bg-light border" 
                style={{ borderRadius: "6px" }}
                placeholder="🔍 Search workouts by name..." 
                value={workoutSearch}
                onChange={(e) => setWorkoutSearch(e.target.value)}
              />
            </div>

            {filteredWorkouts.length === 0 ? <p className="text-muted small text-center py-2">No routines found.</p> : (
              <div style={{ maxHeight: "250px", overflowY: "auto" }}>
                {filteredWorkouts.map(w => (
                  <div key={w?._id || Math.random()} className="border rounded-3 p-3 mb-2 bg-white d-flex justify-content-between align-items-center shadow-sm">
                    <div>
                      <h6 className="fw-bold text-dark mb-1">{w?.exercise || w?.title || ""}</h6>
                      <small className="text-muted">S: {w?.sets || 0} | R: {w?.reps || 0} | T: {w?.duration || 0}m</small>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-warning py-0 px-2" onClick={() => { setExercise(w?.exercise || w?.title || ""); setSets(w?.sets || ""); setReps(w?.reps || ""); setDuration(w?.duration || ""); setEditId(w?._id); }}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger py-0 px-2" onClick={() => deleteWorkout(w?._id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* NUTRITION SECTION */}
        <div className="col-lg-6 mb-4">
          <div className={`card shadow p-4 border-0 rounded-4 bg-white ${nutritionEditId ? "border border-warning border-2" : ""}`}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className={`fw-bold m-0 ${nutritionEditId ? "text-warning" : "text-success"}`}>{nutritionEditId ? "📝 Edit Meal Log" : "🥗 Log Daily Meal"}</h4>
              {nutritionEditId && <button className="btn btn-sm btn-light text-muted" onClick={clearNutritionForm}>Cancel</button>}
            </div>
            <div className="mb-3"><label className="form-label small fw-bold text-secondary">Food Item</label><input className="form-control bg-light border-0 py-2" style={{ borderRadius: "8px" }} value={foodItem} onChange={(e) => setFoodItem(e.target.value)} placeholder="e.g., Chicken Rice" /></div>
            <div className="mb-3"><label className="form-label small fw-bold text-secondary">Meal Type</label><select className="form-select bg-light border-0 py-2" style={{ borderRadius: "8px" }} value={mealType} onChange={(e) => setMealType(e.target.value)}><option value="Breakfast">Breakfast</option><option value="Lunch">Lunch</option><option value="Dinner">Dinner</option><option value="Snacks">Snacks</option></select></div>
            <div className="row">
              <div className="col-6 mb-4"><label className="form-label small fw-bold text-secondary">Quantity</label><input className="form-control bg-light border-0 py-2" style={{ borderRadius: "8px" }} value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="250g" /></div>
              <div className="col-6 mb-4"><label className="form-label small fw-bold text-secondary">Calories (kcal)</label><input type="number" className="form-control bg-light border-0 py-2" style={{ borderRadius: "8px" }} value={calories} onChange={(e) => setCalories(e.target.value)} /></div>
            </div>
            <button className={`btn btn-lg w-100 fw-bold py-2.5 text-uppercase shadow-sm text-white ${nutritionEditId ? "btn-warning" : "btn-success"}`} style={{ borderRadius: "8px" }} onClick={handleNutritionSubmit} disabled={loading}>Save Meal Log</button>

            {/* 🔍 NUTRITION SEARCH & FILTER */}
            <h5 className="fw-bold mt-5 mb-3 text-secondary">Nutrition Logs</h5>
            <div className="row g-2 mb-3">
              <div className="col-7">
                <input 
                  type="text" 
                  className="form-control form-control-sm bg-light border" 
                  style={{ borderRadius: "6px" }}
                  placeholder="🔍 Search food items..." 
                  value={nutritionSearch}
                  onChange={(e) => setNutritionSearch(e.target.value)}
                />
              </div>
              <div className="col-5">
                <select 
                  className="form-select form-select-sm bg-light border" 
                  style={{ borderRadius: "6px" }}
                  value={mealFilter}
                  onChange={(e) => setMealFilter(e.target.value)}
                >
                  <option value="All">All Meals</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snacks">Snacks</option>
                </select>
              </div>
            </div>

            {filteredMeals.length === 0 ? <p className="text-muted small text-center py-2">No meal logs found.</p> : (
              <div style={{ maxHeight: "250px", overflowY: "auto" }}>
                {filteredMeals.map(m => (
                  <div key={m?._id || Math.random()} className="border rounded-3 p-3 mb-2 bg-white d-flex justify-content-between align-items-center shadow-sm">
                    <div>
                      <h6 className="fw-bold text-dark mb-1">{m?.foodItem} <span className="badge bg-light text-success border ms-1" style={{ fontSize: "10px" }}>{m?.mealType}</span></h6>
                      <small className="text-muted">Qty: {m?.quantity} | {m?.calories} kcal</small>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-warning py-0 px-2" onClick={() => { setFoodItem(m?.foodItem || ""); setMealType(m?.mealType || "Breakfast"); setQuantity(m?.quantity || ""); setCalories(m?.calories || ""); setNutritionEditId(m?._id); }}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger py-0 px-2" onClick={() => deleteMeal(m?._id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkoutNutrition;