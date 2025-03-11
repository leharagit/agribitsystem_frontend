import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.scss"; // Styling file

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    userEmail: "",
    password: "",
    phoneNumber: "",
    userRole: "",
    location: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  // ✅ Validation function
  const validateForm = () => {
    let newErrors: { [key: string]: string } = {};

    if (!user.name.trim()) newErrors.name = "Full name is required";

    if (!user.userEmail.trim()) {
      newErrors.userEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.userEmail)) {
      newErrors.userEmail = "Invalid email format";
    }

    if (!user.password.trim()) {
      newErrors.password = "Password is required";
    } else if (user.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!user.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(user.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be exactly 10 digits";
    }

    if (!user.userRole) newErrors.userRole = "Please select a role";

    if (!user.location.trim()) newErrors.location = "Location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error when user types
  };

  // ✅ Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await axios.post("http://localhost:8080/user/register", user, {
        headers: { "Content-Type": "application/json" },
      });
      navigate("/login");
    } catch (err: any) {
      setErrorMessage(err.response?.data || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <h1>Register</h1>

        <label>Full Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter your full name"
          value={user.name}
          onChange={handleChange}
        />
        {errors.name && <p className="error">{errors.name}</p>}

        <label>Email</label>
        <input
          type="email"
          name="userEmail"
          placeholder="Enter your email"
          value={user.userEmail}
          onChange={handleChange}
        />
        {errors.userEmail && <p className="error">{errors.userEmail}</p>}

        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={user.password}
          onChange={handleChange}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <label>Phone Number</label>
        <input
          type="text"
          name="phoneNumber"
          maxLength={10} 
          placeholder="Enter your phone number"
          value={user.phoneNumber}
          onChange={handleChange}
        />
        {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}

        <label>Role</label>
        <select name="userRole" value={user.userRole} onChange={handleChange}>
          <option value="">Select Role</option>
          <option value="Farmer">Farmer</option>
          <option value="Buyer">Buyer</option>
          <option value="Admin">Admin</option>
        </select>
        {errors.userRole && <p className="error">{errors.userRole}</p>}

        <label>Location</label>
        <input
          type="text"
          name="location"
          placeholder="Enter your location"
          value={user.location}
          onChange={handleChange}
        />
        {errors.location && <p className="error">{errors.location}</p>}

        <button type="submit">Register</button>
        {errorMessage && <p className="error">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default Register;





