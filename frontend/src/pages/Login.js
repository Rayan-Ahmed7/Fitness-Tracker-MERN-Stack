import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👀 Aankh ke liye state
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Invalid Email or Password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="d-flex justify-content-center align-items-center" 
      style={{ minHeight: "100vh", backgroundColor: "#f4f7f6" }}
    >
      <div className="card shadow-lg p-5 border-0 rounded-4" style={{ width: "100%", maxWidth: "420px" }}>
        
        {/* Logo ya Brand Name Icon */}
        <div className="text-center mb-4">
          <div 
            className="bg-primary text-white d-inline-block rounded-circle shadow-sm mb-2" 
            style={{ width: "60px", height: "60px", lineHeight: "60px", fontSize: "24px" }}
          >
            💪
          </div>
          <h3 className="fw-bold text-dark m-0">Welcome Back</h3>
          <p className="text-muted small">Login to track your fitness goals</p>
        </div>

        {/* Form Elements */}
        <form onSubmit={loginUser}>
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

          <div className="mb-4">
            <label className="form-label small fw-semibold text-secondary">Password</label>
            {/* Input Group taake aankh field ke andar fit ho jaye */}
            <div className="input-group" style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"} // dynamic type changing
                placeholder="••••••••"
                className="form-control form-control-lg fs-6 bg-light border-0 py-2.5 shadow-none"
                style={{ borderRadius: "8px", paddingRight: "45px" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
             
<button
  type="button"
  className="btn border-0 position-absolute end-0 top-50 translate-middle-y text-secondary me-2"
  style={{ zIndex: 5, background: "transparent", padding: "0 10px" }} // Added explicit transparent padding alignment
  onClick={() => setShowPassword(!showPassword)}
>
  <i className={`bi ${showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"}`} style={{ fontSize: "1.2rem" }}></i>
</button>
            </div>
          </div>

          {/* Login Button with Loading State */}
          <button
            type="submit"
            className="btn btn-primary btn-lg w-100 fw-bold text-uppercase py-2.5 shadow-sm"
            style={{ borderRadius: "8px", fontSize: "14px", letterSpacing: "0.5px" }}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : null}
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>

        {/* Register Redirect Link */}
        <div className="text-center mt-4">
          <p className="text-muted small mb-0">
            Don't have an account?{" "}
            <span 
              className="text-primary fw-semibold" 
              style={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => navigate("/register")}
            >
              Register here
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Login;