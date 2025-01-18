import React, { useState, useEffect } from "react";
import "./Orders.scss";

const Orders = () => {
  const [bids, setBids] = useState([]); // State to hold bid data
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    // Fetch bids from the backend
    const fetchBids = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/bids"); // Replace with your backend URL
        if (!response.ok) {
          throw new Error("Failed to fetch bids");
        }
        const data = await response.json();
        setBids(data); // Set the fetched data to state
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, []); // Empty dependency array ensures this runs only once on component mount

  if (loading) {
    return <div>Loading...</div>; // Display a loading message while fetching data
  }

  if (error) {
    return <div>Error: {error}</div>; // Display an error message if an error occurred
  }

  return (
    <div>
      <h1>Bids List</h1>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product ID</th>
            <th>User ID</th>
            <th>Bid Amount</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {bids.map((bid) => (
            <tr key={bid.id}>
              <td>{bid.id}</td>
              <td>{bid.productId}</td>
              <td>{bid.userId}</td>
              <td>{bid.bidAmount}</td>
              <td>{bid.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;






