import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./GigDescription.scss";
import 'bootstrap/dist/css/bootstrap.min.css';

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
  phoneNumber: string;
  bidAmount: number;
  quantity: number;
}

function GigDescription() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const navigate = useNavigate();

  // ✅ Get current userId from localStorage
  const userId = localStorage.getItem("userId") || "";

  const [bid, setBid] = useState<Bid>({
    productId: productId || "",
    userId: userId, // ✅ Automatically use logged-in user ID
    phoneNumber: "",
    bidAmount: 0,
    quantity: 1,
  });

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

    if (productId) {
      fetchProduct();
      fetchBids();
    }
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      if (!/^\d{0,10}$/.test(value)) {
        setPhoneError("Phone number must contain only numbers and be 10 digits long");
        return;
      } else if (!value.startsWith("0")) {
        setPhoneError("Phone number must start with 0");
        return;
      } else if (value.length < 10) {
        setPhoneError("Phone number must be exactly 10 digits");
        return;
      } else {
        setPhoneError(null);
      }
    }

    setBid(prevBid => ({
      ...prevBid,
      [name]: name === "bidAmount" || name === "quantity" ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ✅ Validation
    if (!bid.userId) {
      alert("User ID not found. Please log in again.");
      return;
    }

    if (!bid.phoneNumber || bid.phoneNumber.length !== 10 || !/^\d+$/.test(bid.phoneNumber)) {
      alert("Please enter a valid 10-digit phone number starting with 0");
      return;
    }

    if (bid.bidAmount <= 0) {
      alert("Bid amount must be greater than zero");
      return;
    }

    if (bid.quantity <= 0) {
      alert("Quantity must be at least 1");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/bids", {
        ...bid,
        productId: productId
      });

      if (response.status === 200 || response.status === 201) {
        alert("Bid created successfully!");
        const updatedBidsResponse = await axios.get(`http://localhost:8080/api/bids/product/${productId}`);
        setBids(updatedBidsResponse.data);

        setBid({
          productId: productId || "",
          userId: userId,
          phoneNumber: "",
          bidAmount: 0,
          quantity: 1,
        });
      }
    } catch (err) {
      console.error("Error creating bid:", err);
      alert("Failed to create bid. Please try again.");
    }
  };

  if (isLoading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

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
              <span className="product-price">Starting Price: LKR {product.startBidPrice}</span><br />
              <span className="product-quantity">Available Quantity: {product.quantity}</span><br />
              <span className="product-quality">Quality: {product.quality}</span>
            </div>
          </div>

          <div className="bid-section">
            <h2 className="section-title">Create a New Bid</h2>
            <form onSubmit={handleSubmit} className="bid-form">
              <div className="form-group">
                <label htmlFor="userId">User ID (Auto-filled)</label>
                <input
                  type="text"
                  name="userId"
                  id="userId"
                  value={bid.userId}
                  disabled
                />
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Enter Your Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  id="phoneNumber"
                  placeholder="07XXXXXXXX"
                  value={bid.phoneNumber}
                  onChange={handleChange}
                  pattern="0[0-9]{9}"
                  title="Phone number should start with 0 and be 10 digits long"
                  required
                />
                {phoneError && <p className="text-danger">{phoneError}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="bidAmount">Bid Amount (LKR)</label>
                <input
                  type="number"
                  name="bidAmount"
                  id="bidAmount"
                  placeholder="Enter Bid Amount"
                  value={bid.bidAmount || ''}
                  onChange={handleChange}
                  min={product.startBidPrice}
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
                  value={bid.quantity || ''}
                  onChange={handleChange}
                  min="1"
                  max={product.quantity}
                  required
                />
              </div>

              <button type="submit" className="submit-button">Submit Bid</button>
            </form>
          </div>
        </>
      ) : (
        <span>Product not found.</span>
      )}
    </div>
  );
}

export default GigDescription;


