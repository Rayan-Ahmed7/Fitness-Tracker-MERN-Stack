import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Button loader ke liye state
  const [showPassword, setShowPassword] = useState(false); // Aankh toggle karne ke liye new state
  const navigate = useNavigate();

  const registerUser = async (e) => {
    e.preventDefault(); // Page reload hone se rokega

    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/users/register", {
        name,
        email,
        password,
      });

      alert("Registration Successful! Redirecting to login...");
      navigate("/"); // Register hote hi seedha login page par bhej dega
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Registration Failed. Email might already exist.");
    } finally {
      setLoading(false); // Process complete hone par loader off
    }
  };

  return (
    <div 
      className="d-flex justify-content-center align-items-center" 
      style={{ minHeight: "100vh", backgroundColor: "#f4f7f6" }}
    >
      <div className="card shadow-lg p-5 border-0 rounded-4" style={{ width: "100%", maxWidth: "440px" }}>
        
        {/* Header Section */}
        <div className="text-center mb-4">
          <div 
            className="bg-success text-white d-inline-block rounded-circle shadow-sm mb-2" 
            style={{ width: "60px", height: "60px", lineHeight: "60px", fontSize: "24px" }}
          >
            🚀
          </div>
          <h3 className="fw-bold text-dark m-0">Create Account</h3>
          <p className="text-muted small">Join us today and start tracking your fitness</p>
        </div>

        {/* Register Form */}
        <form onSubmit={registerUser}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="form-control form-control-lg fs-6 bg-light border-0 py-2.5 shadow-none"
              style={{ borderRadius: "8px" }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-semibold text-secondary">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              className="form-control form-control-lg fs-6 bg-light border-0 py-2.5 shadow-none"
              style={{ borderRadius: "8px" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Section with Eye Icon */}
          <div className="mb-4">
            <label className="form-label small fw-semibold text-secondary">Password</label>
            <div className="position-relative">
              <input
                type={showPassword ? "text" : "password"} // State ke mutabik text ya password change hoga
                placeholder="••••••••"
                className="form-control form-control-lg fs-6 bg-light border-0 py-2.5 shadow-none pe-5" // Right padding di taake eye icon text par overlap na ho
                style={{ borderRadius: "8px" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {/* Eye Icon Button */}
              <span 
                className="position-absolute end-0 top-50 translate-middle-y me-3" 
                style={{ cursor: "pointer", zIndex: 10 }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <i className="bi bi-eye-slash-fill fs-5 text-secondary"></i> // Password show hone par cut wali aankh
                ) : (
                  <i className="bi bi-eye-fill fs-5 text-secondary"></i> // Password hide hone par normal aankh
                )}
              </span>
            </div>
          </div>

          {/* Submit Button with Spinner */}
          <button
            type="submit"
            className="btn btn-success btn-lg w-100 fw-bold text-uppercase py-2.5 shadow-sm"
            style={{ borderRadius: "8px", fontSize: "14px", letterSpacing: "0.5px" }}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : null}
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        {/* Login Redirect */}
        <div className="text-center mt-4">
          <p className="text-muted small mb-0">
            Already have an account?{" "}
            <span 
              className="text-primary fw-semibold" 
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => navigate("/")}
            >
              Login here
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Register;