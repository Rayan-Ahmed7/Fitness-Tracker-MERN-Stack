import React from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, PieChart, Pie, Cell 
} from "recharts";

function AnalyticsPage({ meals = [], workouts = [] }) {
  
  // ==========================================
  // 🥗 1. NUTRITION DATA (Last 7 Meals Calories)
  // ==========================================
  const nutritionBarData = (meals || []).slice(-7).map(m => ({
    name: m?.foodItem?.length > 10 ? m.foodItem.substring(0, 10) + "..." : m?.foodItem || "Meal",
    Calories: Number(m?.calories || 0)
  }));

  // ==========================================
  // 🏋️‍♂️ 2. WORKOUT DATA (Last 7 Workouts Progress)
  // ==========================================
  const workoutLineData = (workouts || []).slice(-7).map((w, index) => ({
    name: w?.exercise?.length > 10 ? w.exercise.substring(0, 10) + "..." : w?.exercise || `Day ${index + 1}`,
    Duration: Number(w?.duration || 0),
    // Lifting Progress logic: Sets x Reps ko volume consider kar rahe hain document purepose ke liye
    Progress: Number(w?.sets || 0) * Number(w?.reps || 0) 
  }));

  // ==========================================
  // 📊 3. MACRONUTRIENT DISTRIBUTION (Pie Chart)
  // ==========================================
  const totalCalories = (meals || []).reduce((sum, m) => sum + Number(m?.calories || 0), 0);
  
  // Dynamic breakdown based on total calories logged
  const macroPieData = [
    { name: "Carbs (g)", value: Math.round((totalCalories * 0.5) / 4) || 40 },
    { name: "Protein (g)", value: Math.round((totalCalories * 0.3) / 4) || 30 },
    { name: "Fats (g)", value: Math.round((totalCalories * 0.2) / 9) || 15 },
  ];

  const PIE_COLORS = ["#198754", "#0dcaf0", "#ffc107"]; // Green, Cyan, Yellow

  return (
    <div className="container-fluid py-2">
      {/* Page Header */}
      <div className="mb-4">
        <h3 className="fw-bold text-dark mb-1">📊 Fitness Analytics Dashboard</h3>
        <p className="text-muted small">Visual tracking of your workout progress and nutritional trends.</p>
      </div>

      <div className="row">
        
        {/* ==================== 🏋️‍♂️ WORKOUT ANALYTICS GRAPH ==================== */}
        <div className="col-lg-8 mb-4">
          <div className="card shadow border-0 rounded-4 p-4 bg-white h-100">
            <h5 className="fw-bold text-secondary mb-3">🏋️‍♂️ Workout History & Lifting Volume</h5>
            {workouts.length === 0 ? (
              <div className="text-center py-5 my-auto">
                <p className="text-muted small">No workout data available. Add routines to see lifting graphs.</p>
              </div>
            ) : (
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={workoutLineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#6c757d" style={{ fontSize: "12px" }} />
                    <YAxis stroke="#6c757d" style={{ fontSize: "12px" }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Duration" stroke="#0d6efd" strokeWidth={3} activeDot={{ r: 8 }} name="Duration (Mins)" />
                    <Line type="monotone" dataKey="Progress" stroke="#fd7e14" strokeWidth={3} name="Lifting Progress (Sets×Reps)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* ==================== 🥗 MACRONUTRIENT DISTRIBUTION ==================== */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow border-0 rounded-4 p-4 bg-white h-100 text-center">
            <h5 className="fw-bold text-secondary mb-1 text-start">🥗 Macro Distribution</h5>
            <p className="text-muted small mb-4 text-start">Estimated breakdown of current logged diet.</p>
            {meals.length === 0 ? (
              <div className="text-center py-5 my-auto">
                <p className="text-muted small">Log meals to view macronutrients chart.</p>
              </div>
            ) : (
              <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: 260 }}>
                <div style={{ width: "100%", height: 200 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={macroPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {macroPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Custom Labels below the Pie */}
                <div className="d-flex gap-3 justify-content-center small mt-2">
                  <span className="fw-semibold" style={{ color: "#198754" }}>● Carbs</span>
                  <span className="fw-semibold" style={{ color: "#0dcaf0" }}>● Protein</span>
                  <span className="fw-semibold" style={{ color: "#ffc107" }}>● Fats</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ==================== 🍏 DIET CALORIE CONSUMPTION BAR CHART ==================== */}
        <div className="col-12 mb-4">
          <div className="card shadow border-0 rounded-4 p-4 bg-white">
            <h5 className="fw-bold text-secondary mb-3">🍏 Recent Calorie Intake Trends</h5>
            {meals.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted small">No meal history found. Please add some meals first!</p>
              </div>
            ) : (
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <BarChart data={nutritionBarData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#6c757d" style={{ fontSize: "12px" }} />
                    <YAxis stroke="#6c757d" style={{ fontSize: "12px" }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Calories" fill="#198754" radius={[6, 6, 0, 0]} name="Calories (kcal)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AnalyticsPage;