import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./GigDescription.scss";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import "bootstrap/dist/css/bootstrap.min.css";



interface Product {
  name: string;
  description: string;
  startBidPrice: number;
  quantity: number;
  quality: string;
  contentType: string;
  image: string;
}

interface Bid {
  productId: string;
  userId: string;
  bidAmount: number;
  quantity: number;
}

function GigDescription() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [bid, setBid] = useState<Bid>({
    productId: productId || "",
    userId: "",
    bidAmount: 0,
    quantity: 1,
  });
  const [bids, setBids] = useState<Bid[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(`http://localhost:8080/api/products/${productId}`);
        setProduct(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchBids = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/bids/product/${productId}`);
        setBids(response.data);
      } catch (err) {
        console.error("Error fetching bids:", err);
      }
    };

    fetchProduct();
    fetchBids();
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBid({ ...bid, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/bids", bid);
      if (response.status === 200 || response.status === 201) {
        alert("Bid created successfully!");
        navigate("/"); // Navigate to another page if required
      }
    } catch (err) {
      console.error("Error creating bid:", err);
      alert("Failed to create bid. Please try again.");
    }
  };

  if (isLoading) return <span>Loading...</span>;
  if (error) return <span>Error: {error}</span>;

  return (
    <div className="gig-description">
      {product ? (
        <>
          <div className="product-display">
            <img
              src={`data:${product.contentType};base64,${product.image}`}
              alt={product.name}
              className="product-image"
            />
            <div className="product-details">
              <h1 className="product-title">{product.name}</h1>
              <p className="product-description">{product.description}</p>
              <span className="product-price">Starting Price: ${product.startBidPrice}</span>
              <span className="product-quantity">Available Quantity: {product.quantity}</span>
              <span className="product-quality">Quality: {product.quality}</span>
            </div>
          </div>

          <div className="bid-section">
            <h2 className="section-title">Create a New Bid</h2>
            <form onSubmit={handleSubmit} className="bid-form">
              <div className="form-group">
                <label htmlFor="userId">User ID</label>
                <input
                  type="text"
                  name="userId"
                  id="userId"
                  placeholder="Enter User ID"
                  value={bid.userId}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="bidAmount">Bid Amount</label>
                <input
                  type="number"
                  name="bidAmount"
                  id="bidAmount"
                  placeholder="Enter Bid Amount"
                  value={bid.bidAmount}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="quantity">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  placeholder="Enter Quantity"
                  value={bid.quantity}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
              <button type="submit" className="submit-button">Submit Bid</button>
            </form>
          </div>

          <div className="bid-list">
            <h2 className="section-title">Existing Bids</h2>
            {bids.length > 0 ? (
              <ul>
                {bids.map((b) => (
                  <li key={b.productId} className="bid-item">
                    User: {b.userId}, Bid: ${b.bidAmount}, Quantity: {b.quantity}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No bids yet.</p>
            )}
          </div>
        </>
      ) : (
        <span>Product not found.</span>
      )}
    </div>
  );
}

export default GigDescription;
