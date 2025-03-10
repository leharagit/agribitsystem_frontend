import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./bid.scss";

interface Bid {
  id: string;
  productId: string;
  productName: string; // ✅ Display product name
  userId: string;
  phoneNumber: string; // ✅ Display phone number
  bidAmount: number;
  quantity: number;
  totalAmount: number;
}

const UserBids: React.FC = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Retrieve `userId` from localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const userId = currentUser?.userId || "";

  useEffect(() => {
    if (!userId) {
      setError("User not logged in. Please log in first.");
      setLoading(false);
      return;
    }

    const fetchBids = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/bids/user/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user-specific bids.");
        }
        const data: Bid[] = await response.json();
        setBids(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [userId]);

  const handleBuyNow = async (bid: Bid) => {
    alert(`Processing "Buy Now" for ${bid.productName} (LKR ${bid.totalAmount})`);
    
    // ✅ TODO: Replace with actual API call
    try {
      const response = await fetch(`http://localhost:8080/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: bid.userId,
          productId: bid.productId,
          productName: bid.productName,
          quantity: bid.quantity,
          totalAmount: bid.totalAmount,
        }),
      });

      if (response.ok) {
        alert("Purchase successful!");
      } else {
        throw new Error("Failed to process the purchase.");
      }
    } catch (error) {
      console.error("Buy Now error:", error);
      alert("Error processing purchase.");
    }
  };

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
          <h1>My Bids</h1>
        </div>

        {/* Table for user-specific bids */}
        <div className="table-responsive">
          <table className="table table-hover table-striped">
            <thead className="table-dark">
              <tr>
                <th>Product Name</th>
                <th>Product ID</th>
                <th>Phone Number</th>
                <th>Bid Amount</th>
                <th>Quantity</th>
                <th>Total Amount</th>
                <th>Action</th> {/* ✅ New "Buy Now" column */}
              </tr>
            </thead>
            <tbody>
              {bids.length > 0 ? (
                bids.map((bid) => (
                  <tr key={bid.id}>
                    <td>{bid.productName || "Unknown Product"}</td>
                    <td>{bid.productId}</td>
                    <td>{bid.phoneNumber || "N/A"}</td>
                    <td>LKR {bid.bidAmount}</td>
                    <td>{bid.quantity}</td>
                    <td>LKR {bid.totalAmount}</td>
                    <td>
                      <button
                        className="btn btn-success"
                        onClick={() => handleBuyNow(bid)}
                      >
                        Buy Now
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center">
                    No bids found for your account.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserBids;




