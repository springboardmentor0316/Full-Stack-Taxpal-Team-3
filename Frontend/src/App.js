import { useState } from "react";
import Login from "./pages/Login";
import "./App.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Signup({ goToLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setSuccess("Account created successfully!");
  };

  return (
    <div className="main">
      <div className="left-panel">
        <h1>
          TaxPal{" "}
          <span className="highlight">
            Personal Finance & <br />Tax Estimator For Freelancers
          </span>
        </h1>

        <div className="illustration">
          <img src="/image/illustration1.png" alt="illustration" />
        </div>
      </div>

      <div className="right-panel">
        <h2>Create Account</h2>

        <form className="form" onSubmit={handleSubmit}>
          <div className="row">
            <input placeholder="First Name" />
            <input placeholder="Last Name" />
          </div>

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="password-box">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              autoComplete="new-password"
            />
            <span
              className="eye-icon"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}

          <button type="submit">Create Account</button>

          <p className="login">
            Already have an account?{" "}
            <span onClick={goToLogin}>Login</span>
          </p>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [showSignup, setShowSignup] = useState(false);

  return showSignup ? (
    <Signup goToLogin={() => setShowSignup(false)} />
  ) : (
    <Login goToSignup={() => setShowSignup(true)} />
  );
}

export default App;
