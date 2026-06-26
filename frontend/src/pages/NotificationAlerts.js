import React, { useState, useEffect } from "react";

function NotificationAlerts() {
  const [reminders, setReminders] = useState(
    JSON.parse(localStorage.getItem("fitness_reminders")) || []
  );
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Workout");
  const [time, setTime] = useState("");
  const [liveAlert, setLiveAlert] = useState(null);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // ⏱️ BACKGROUND TIMER WITH AUTO-DELETE LOGIC
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${hours}:${minutes}`;
      
      let triggeredIds = [];

      reminders.forEach((reminder) => {
        if (reminder.time === currentTime) {
          
          // 1. Desktop Notification
          if ("Notification" in window && Notification.permission === "granted") {
            try {
              new Notification(`💪 Fitness Alert: ${reminder.type}`, {
                body: `Time for your scheduled ${reminder.title}!`,
                icon: "https://cdn-icons-png.flaticon.com/512/3652/3652191.png"
              });
            } catch (err) {
              console.log("Desktop notification failed, using screen fallback");
            }
          }

          // 2. In-App Banner Popup
          setLiveAlert({
            type: reminder.type,
            title: reminder.title
          });
          
          // Store ID to delete it later
          triggeredIds.push(reminder.id);
        }
      });

      // ✨ If any reminder is triggered, delete it instantly from state and localStorage
      if (triggeredIds.length > 0) {
        setReminders(prev => {
          const filtered = prev.filter(r => !triggeredIds.includes(r.id));
          localStorage.setItem("fitness_reminders", JSON.stringify(filtered));
          return filtered;
        });
      }

    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [reminders]);

  const handleAddReminder = (e) => {
    e.preventDefault();
    if (!title || !time) return alert("Please fill all fields");

    const newReminder = {
      id: Date.now(),
      title,
      type,
      time
    };

    const updated = [...reminders, newReminder];
    setReminders(updated);
    localStorage.setItem("fitness_reminders", JSON.stringify(updated));
    
    setTitle("");
    setTime("");
    alert("🚀 Reminder alert configured successfully!");
  };

  const deleteReminder = (id) => {
    const updated = reminders.filter(r => r.id !== id);
    setReminders(updated);
    localStorage.setItem("fitness_reminders", JSON.stringify(updated));
  };

  const isDark = localStorage.getItem("theme_mode") === "dark";

  return (
    <div className="row justify-content-center py-2 position-relative">
      
      {liveAlert && (
        <div 
          className="position-fixed top-0 start-50 translate-middle-x mt-4 p-3 shadow-lg rounded-4 border-start border-primary border-5 bg-white text-dark text-center" 
          style={{ zIndex: 9999, width: "350px" }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="fw-bold m-0">⏰ Live Alert: {liveAlert.type}</h6>
            <button className="btn-close small" onClick={() => setLiveAlert(null)}></button>
          </div>
          <p className="small text-muted mt-2 mb-0">
            Bhai! It's time for your scheduled <b>{liveAlert.title}</b>. Stay active!
          </p>
        </div>
      )}

      <div className="col-lg-10">
        <div className="mb-4">
          <h3 className={`fw-bold mb-1 ${isDark ? "text-white" : "text-dark"}`}>⏰ Notifications & Alerts</h3>
          <p className="text-muted small">Set custom interval reminders for workouts, target calories, or water intake intervals.</p>
        </div>

        <div className="row g-4">
          <div className="col-md-5">
            <div className={`card shadow border-0 rounded-4 p-4 ${isDark ? "bg-dark text-white" : "bg-white"}`}>
              <h5 className="fw-bold mb-3 small text-uppercase text-primary">Set New Alert</h5>
              <form onSubmit={handleAddReminder}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">Alert Title</label>
                  <input 
                    type="text" 
                    className="form-control bg-light border-0 py-2"
                    placeholder="e.g., Evening Leg Day"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-secondary">Reminder Type</label>
                  <select 
                    className="form-select bg-light border-0 py-2"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="Workout">🏋️‍♂️ Workout Session</option>
                    <option value="Meal Time">🍎 Meal / Nutrition Log</option>
                    <option value="Water Intake">💧 Water Reminder</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold text-secondary">Select Trigger Time</label>
                  <input 
                    type="time" 
                    className="form-control bg-light border-0 py-2"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100 fw-bold rounded-3">
                  🔔 Activate Alert
                </button>
              </form>
            </div>
          </div>

          <div className="col-md-7">
            <div className={`card shadow border-0 rounded-4 p-4 ${isDark ? "bg-dark text-white" : "bg-white"}`}>
              <h5 className="fw-bold mb-3 small text-uppercase text-success">Active Fitness Schedules</h5>
              
              {reminders.length === 0 ? (
                <div className="text-center py-4 text-muted small">
                  No reminders scheduled yet. Set one on the left panel!
                </div>
              ) : (
                <div className="table-responsive">
                  <table className={`table align-middle ${isDark ? "table-dark" : ""}`}>
                    <thead>
                      <tr className="small text-muted">
                        <th>Type</th>
                        <th>Title</th>
                        <th>Scheduled Time</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reminders.map((reminder) => (
                        <tr key={reminder.id} className="small">
                          <td>
                            <span className="badge bg-secondary-subtle text-dark fw-bold px-2 py-1 rounded-2">
                              {reminder.type}
                            </span>
                          </td>
                          <td className="fw-semibold">{reminder.title}</td>
                          <td className="fw-bold text-primary">⏱️ {reminder.time}</td>
                          <td className="text-end">
                            <button 
                              className="btn btn-sm btn-outline-danger border-0"
                              onClick={() => deleteReminder(reminder.id)}
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationAlerts;