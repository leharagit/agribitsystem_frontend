import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Gigs.scss";
import GigCard, { type GigCardProps } from "../../components/gigCard/GigCard";
import axios from "axios";

function Gigs() {
  const [sort, setSort] = useState("sales");
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<GigCardProps["item"][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState(""); 
  const itemsPerPage = 10;

  const minBidRef = useRef<HTMLInputElement>(null);
  const maxBidRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setCategory(params.get("category") || "");
    fetchData();
  }, [location.search, sort, currentPage, category]); 

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const minBidPrice = minBidRef.current?.value || "0";
      const maxBidPrice = maxBidRef.current?.value || "100000";

      const response = await axios.get(
        `http://localhost:8080/api/products?startBidPrice=${minBidPrice}&maxBidPrice=${maxBidPrice}&category=${category}&sort=${sort}&page=${currentPage}&limit=${itemsPerPage}`,
        {
          headers: {
            "Current-User-ID": currentUser.id || "",
          },
        }
      );
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchData();
  };

  return (
    <div className="gigs">
      <div className="container">
        <h1>Products {category ? `in ${category}` : ""}</h1>
        <p>Explore our collection of products available for bidding!</p>

        {/* Filters Section */}
        <div className="menu">
          <div className="left">
            <span>Min Bid Price</span>
            <input ref={minBidRef} type="number" placeholder="Enter Min Bid Price" />
            <span>Max Bid Price</span>
            <input ref={maxBidRef} type="number" placeholder="Enter Max Bid Price" />
          </div>

          {/* Category Filter Dropdown */}
          <div className="left">
            <span>Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="coconuts">Coconuts</option>
              <option value="fish">Fish</option>
              <option value="meat">Meat</option>
            </select>
          </div>

          <button className="apply-button" onClick={applyFilters}>Apply</button>
          

        </div>

        {/* Product Listings */}
        <div className="cards">
          {isLoading && <span>Loading...</span>}
          {error && <span className="error">Error: {error}</span>}
          {!isLoading && !error && data.length > 0 ? (
            data.map((product) => <GigCard key={product.productId} item={product} />)
          ) : (
            !isLoading && !error && <span>No products found.</span>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="pagination">
          <button
            className="btn btn-secondary"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </button>
          <span>Page {currentPage}</span>
          <button
            className="btn btn-secondary"
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Gigs;








