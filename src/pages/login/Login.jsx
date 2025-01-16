import React, { useState } from "react";
import "./Login.scss";
import axios from "axios"; // Import axios for HTTP requests
import { useNavigate } from "react-router-dom";

function Login() {
  const [userEmail, setUserEmail] = useState(""); // Use correct state name for email
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      // Make a POST request to the login endpoint
      const res = await axios.post("http://localhost:8080/user/login", {
        userEmail,
        password,
      });

      // Save the returned user data in localStorage
      localStorage.setItem("currentUser", JSON.stringify(res.data));

      // Redirect to the desired route after successful login
      navigate("/add");
    } catch (err) {
      // Set the error message if login fails
      setError(err.response?.data || "An error occurred while logging in.");
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Sign in</h1>
        <label htmlFor="email">Username or Email</label>
        <input
          name="userEmail"
          type="text"
          placeholder="johndoe"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)} // Use correct state for email
        />

        <label htmlFor="password">Password</label>
        <input
          name="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state
        />

        <button type="submit">Login</button>

        {error && <p className="error">{error}</p>} {/* Show error if exists */}
      </form>
    </div>
  );
}

export default Login;
