import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyGigs.scss";
import axios from "axios";

const MyGigs = () => {
  const [projects, setProjects] = useState([]); // Ensure type safety here
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Ensure proper typing

  const navigate = useNavigate();

  // Fetch farmer's projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/products");
        setProjects(response.data);
      } catch (err) {
        setError("Failed to load projects. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await axios.delete(`http://localhost:8080/api/products/${id}`);
        setProjects((prev) => prev.filter((project) => project.productId !== id));
      } catch (err) {
        alert("Failed to delete project. Please try again.");
      }
    }
  };

  return (
    <div className="my-gigs">
      <div className="container">
        <h1>My Projects</h1>
        <button className="add-new" onClick={() => navigate("/add")}>
          Add New Project
        </button>
        {loading ? (
          <p>Loading projects...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : projects.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Start Bid Price</th>
                <th>Buy Now Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.productId}>
                  <td>{project.name}</td>
                  <td>{project.category}</td>
                  <td>${project.startBidPrice}</td>
                  <td>${project.buyNowPrice}</td>
                  <td>{project.status}</td>
                  <td>
                    <button onClick={() => navigate(`/orders/${project.productId}`)}>
                      View Bids
                    </button>
                    <button onClick={() => navigate(`/edit/${project.productId}`)}>Edit</button>
                    <button onClick={() => handleDelete(project.productId)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No projects found. Click "Add New Project" to create one.</p>
        )}
      </div>
    </div>
  );
};

export default MyGigs;











