import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Orders.scss";

const Orders = () => {
  const [bids, setBids] = useState([]); // State to hold bid data
  const [maxTotalAmountBid, setMaxTotalAmountBid] = useState(null); // State to hold max total amount bid for a product
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors

  const productId = "5"; // Replace with dynamic product ID if needed

  useEffect(() => {
    const fetchBidsAndMaxBid = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/bids/product/${productId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch bids for the product");
        }
        const data = await response.json();
        setBids(data);

        const maxBidResponse = await fetch(`http://localhost:8080/api/bids/max-total/${productId}`);
        if (!maxBidResponse.ok) {
          throw new Error("Failed to fetch max total amount bid for the product");
        }
        const maxBidData = await maxBidResponse.json();
        setMaxTotalAmountBid(maxBidData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBidsAndMaxBid();
  }, [productId]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger text-center mt-4">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  return (
    <div className="orders d-flex justify-content-center align-items-center">
      <div className="container shadow-lg rounded p-4 bg-white">
        <div className="title">
          <h1>Bids List</h1>
          <button className="btn btn-success">Export Data</button>
        </div>
        {maxTotalAmountBid && (
          <div className="alert alert-info text-center">
            <h4>Max Total Amount Bid for Product ID: {productId}</h4>
            <p>
              <strong>User Phone Number:</strong> {maxTotalAmountBid.productId},{" "}
              <strong>User ID:</strong> {maxTotalAmountBid.userId},{" "}
              <strong>Total Amount:</strong> {maxTotalAmountBid.totalAmount}
            </p>
          </div>
        )}
        <div className="table-responsive">
          <table className="table table-hover table-striped">
            <thead className="table-dark">
              <tr>
                <th>Product ID</th>
                <th>User ID</th>
                <th>Bid Amount</th>
                <th>Quantity</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((bid) => (
                <tr key={bid.id}>
                  <td>{bid.productId}</td>
                  <td>{bid.userId}</td>
                  <td>${bid.bidAmount}</td>
                  <td>{bid.quantity}</td>
                  <td>${bid.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;








