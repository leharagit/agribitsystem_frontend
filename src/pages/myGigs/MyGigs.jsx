import React from "react";
import { Link, useParams } from "react-router-dom";
import "./MyGigs.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

function MyGigs() {
  const queryClient = useQueryClient();
  const { productId } = useParams(); // Dynamically get productId from the route

  const { isLoading, error, data } = useQuery({
    queryKey: ["bids", productId],
    queryFn: () =>
      newRequest.get(`/bids/product/${productId}`).then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (id) => newRequest.delete(`/bids/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["bids", productId]);
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this bid?")) {
      mutation.mutate(id);
    }
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error)
    return (
      <div className="error">
        Error: {error.message || "Failed to load bids."}
      </div>
    );

  return (
    <div className="myGigs">
      <div className="container">
        <div className="title">
          <h1>Bids for Product</h1>
          <Link to="/add">
            <button>Add New Bid</button>
          </Link>
        </div>
        <table>
          <thead>
            <tr>
              <th>Bid ID</th>
              <th>User ID</th>
              <th>Bid Amount</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((bid) => (
              <tr key={bid.id}>
                <td>{bid.id}</td>
                <td>{bid.userId}</td>
                <td>{bid.bidAmount}</td>
                <td>{bid.quantity}</td>
                <td>
                  <img
                    className="delete"
                    src="./img/delete.png"
                    alt="Delete"
                    onClick={() => handleDelete(bid.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MyGigs;






