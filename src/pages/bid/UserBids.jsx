import { useQuery } from "@tanstack/react-query";
import React from "react";
import moment from "moment";
import newRequest from "../../utils/newRequest";
import "./bid.scss";

const UserBids = () => {
  // ✅ Get current user ID from localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const userId = currentUser?.userId || "";

  // ✅ Fetch the current user's bid amounts
  const { isLoading, error, data } = useQuery({
    queryKey: ["userBids", userId],
    queryFn: () =>
      newRequest.get(`/bids/user/${userId}`).then((res) => res.data),
    enabled: !!userId, // Prevent query if userId is not available
  });

  return (
    <div className="bids">
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error fetching bids. Please try again.</p>
      ) : (
        <div className="container">
          <div className="title">
            <h1>My Bids</h1>
          </div>
          {data.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Bid Amount</th>
                  <th>Quantity</th>
                  <th>Total Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.map((bid) => (
                  <tr key={bid.id}>
                    <td>{bid.productId}</td>
                    <td>LKR {bid.bidAmount}</td>
                    <td>{bid.quantity}</td>
                    <td>LKR {bid.totalAmount}</td>
                    <td>{moment(bid.createdAt).fromNow()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No bids found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserBids;
