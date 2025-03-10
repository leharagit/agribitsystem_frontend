import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Orders.scss";

interface Bid {
  id: string;
  productId: string;
  productName: string; // ✅ Added product name
  userId: string;
  bidAmount: number;
  quantity: number;
  totalAmount: number;
}

interface MaxTotalAmountBid {
  productId: string;
  productName: string; // ✅ Added product name
  userId: string;
  totalAmount: number;
}

const Orders: React.FC = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [maxTotalAmountBid, setMaxTotalAmountBid] = useState<MaxTotalAmountBid | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { productId } = useParams();

  useEffect(() => {
    const fetchBidsAndMaxBid = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/bids/product/${productId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch bids for the product");
        }
        const data: Bid[] = await response.json();
        setBids(data);

        const maxBidResponse = await fetch(`http://localhost:8080/api/bids/max-total/${productId}`);
        if (!maxBidResponse.ok) {
          throw new Error("Failed to fetch max total amount bid for the product");
        }
        const maxBidData: MaxTotalAmountBid = await maxBidResponse.json();
        setMaxTotalAmountBid(maxBidData);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchBidsAndMaxBid();
    }
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
        <div className="title d-flex justify-content-between align-items-center">
          <h1>Bids List for Product ID: {productId}</h1>
        </div>

        {/* Display the highest bid information */}
        {maxTotalAmountBid && (
          <div className="alert alert-info text-center">
            <h4>Max Total Amount Bid</h4>
            <p>
              <strong>Product Name:</strong> {maxTotalAmountBid.productName}, {" "}
              <strong>Product ID:</strong> {maxTotalAmountBid.productId}, {" "}
              <strong>User Phone Number:</strong> {maxTotalAmountBid.userId}, {" "}
              <strong>Total Amount:</strong> LKR {maxTotalAmountBid.totalAmount}
            </p>
            <a href={`tel:${maxTotalAmountBid.userId}`} className="btn btn-primary">
              📞 Call Highest Bidder
            </a>
          </div>
        )}

        {/* Table for bids list */}
        <div className="table-responsive">
          <table className="table table-hover table-striped">
            <thead className="table-dark">
              <tr>
                <th>Product Name</th>
                <th>Product ID</th>
                <th>User Phone Number</th>
                <th>Bid Amount</th>
                <th>Quantity</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((bid) => (
                <tr key={bid.id}>
                  <td>{bid.productName}</td> {/* ✅ Display product name */}
                  <td>{bid.productId}</td>
                  <td>{bid.userId}</td>
                  <td>LKR {bid.bidAmount}</td>
                  <td>{bid.quantity}</td>
                  <td>LKR {bid.totalAmount}</td>
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








