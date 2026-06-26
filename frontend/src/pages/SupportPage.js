import React, { useState, useEffect } from "react";

function SupportPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [issueType, setIssueType] = useState("Bug Report");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  // ✨ `success` state ko hata diya kyunke ab hum direct is lock state ko true karte hain
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    const status = localStorage.getItem("user_feedback_submitted");
    if (status === "true") {
      setAlreadySubmitted(true);
    }
  }, []);

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setAlreadySubmitted(true);
      localStorage.setItem("user_feedback_submitted", "true");

      setName("");
      setEmail("");
      setMessage("");
      setLoading(false);
    }, 1000);
  };

  if (alreadySubmitted) {
    return (
      <div className="container py-5 text-center">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow border-0 rounded-4 p-5 bg-white">
              <div className="fs-1 mb-3">✅</div>
              <h4 className="fw-bold text-dark mb-2">Feedback Already Submitted!</h4>
              <p className="text-muted small mb-0">
               Thank you! We have already received your feedback. Our team is actively reviewing it to improve your experience.
                If you need further assistance or have another issue to report, please feel free to reach out to us again later.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-2">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          
          <div className="mb-4">
            <h3 className="fw-bold text-dark mb-1">🛠️ Feedback & Support Hub</h3>
            <p className="text-muted small">Report bugs, request features, or share your fitness tracking experience.</p>
          </div>

          <div className="card shadow border-0 rounded-4 p-4 bg-white">
            <form onSubmit={handleSupportSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold text-secondary">Your Name</label>
                  <input 
                    type="text" 
                    className="form-control bg-light border-0 py-2" 
                    style={{ borderRadius: "8px" }}
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-bold text-secondary">Email Address</label>
                  <input 
                    type="email" 
                    className="form-control bg-light border-0 py-2" 
                    style={{ borderRadius: "8px" }}
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-secondary">Nature of Request</label>
                <select 
                  className="form-select bg-light border-0 py-2" 
                  style={{ borderRadius: "8px" }}
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                >
                  <option value="Bug Report">🐛 Report a Bug / Issue</option>
                  <option value="Feature Request">💡 Suggest a Feature</option>
                  <option value="General Feedback">⭐ General Feedback</option>
                  <option value="Account Help">🔑 Account / Login Assistance</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-secondary">Detailed Message</label>
                <textarea 
                  className="form-control bg-light border-0 py-2" 
                  style={{ borderRadius: "8px" }}
                  rows="5"
                  placeholder="Describe your issue or feedback here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-lg w-100 fw-bold py-2.5 text-uppercase shadow-sm" 
                style={{ borderRadius: "8px", fontSize: "14px" }}
                disabled={loading}
              >
                {loading ? "Submitting Ticket..." : "Submit Support Ticket"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default SupportPage;