import React, { useState } from "react";
import "./Login.scss";
import axios from "axios"; // Import axios for HTTP requests
import { useNavigate } from "react-router-dom";

function Login() {
  const [userEmail, setUserEmail] = useState(""); // State for email
  const [password, setPassword] = useState(""); // State for password
  const [error, setError] = useState<string | null>(null); // State for error messages
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent form submission
    setIsLoading(true); // Start loading
    setError(null); // Clear previous errors

    try {
      // Make a POST request to the login endpoint
      const res = await axios.post("http://localhost:8080/user/login", {
        userEmail,
        password,
      });

      // Save the returned user data in localStorage
      const userData = res.data;
      localStorage.setItem("currentUser", JSON.stringify(userData));

      // Check user role and navigate accordingly
      const userRole = userData.role;
      switch (userRole) {
        case "Farmer":
          navigate("/add");
          break;
        case "Buyer":
          navigate("/gigs");
          break;
        case "Admin":
          navigate("/admin");
          break;
        default:
          throw new Error("Invalid user role. Please contact support.");
      }
    } catch (err: any) {
      // Handle different types of errors
      if (err.response) {
        setError(err.response.data.message || "Invalid credentials. Please try again.");
      } else if (err.request) {
        setError("Unable to connect to the server. Please check your network.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Sign In</h1>

        <label htmlFor="email">Username or Email</label>
        <input
          name="userEmail"
          type="text"
          placeholder="Enter your email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          name="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {/* Show error message */}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default Login;
