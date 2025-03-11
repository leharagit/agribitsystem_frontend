import React, { useEffect, useRef, useState } from "react";
import "./Gigs.scss";
import GigCard, { type GigCardProps } from "../../components/gigCard/GigCard";
import axios from "axios";

function Gigs() {
  const [sort, setSort] = useState("sales");
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<GigCardProps["item"][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1); // ✅ Pagination state
  const itemsPerPage = 10; // ✅ Number of items per page

  // ✅ References for min and max bid price inputs
  const minBidRef = useRef<HTMLInputElement>(null);
  const maxBidRef = useRef<HTMLInputElement>(null);

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const minBidPrice = minBidRef.current?.value || "0";
      const maxBidPrice = maxBidRef.current?.value || "100000"; // Default max

      const response = await axios.get(
        `http://localhost:8080/api/products?startBidPrice=${minBidPrice}&maxBidPrice=${maxBidPrice}&sort=${sort}&page=${currentPage}&limit=${itemsPerPage}`,
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

  const reSort = (type: string) => {
    setSort(type);
    setOpen(false);
  };

  const applyFilters = () => {
    setCurrentPage(1); // ✅ Reset to first page on new filter
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [sort, currentPage]); // ✅ Refetch on page change

  return (
    <div className="gigs">
      <div className="container">
        <h1>Products</h1>
        <p>Explore our collection of products available for bidding!</p>

        {/* ✅ Min & Max Bid Price Filter */}
        <div className="menu">
          <div className="left">
            <span>Min Bid Price</span>
            <input ref={minBidRef} type="number" placeholder="Enter Min Bid Price" />
            <span>Max Bid Price</span>
            <input ref={maxBidRef} type="number" placeholder="Enter Max Bid Price" />
            <button onClick={applyFilters}>Apply</button>
          </div>
          <div className="right">
            <span className="sortBy">Sort by</span>
            <span className="sortType">
              {sort === "sales" ? "Best Selling" : "Newest"}
            </span>
            <img
              src="./img/down.png"
              alt="Toggle sort menu"
              onClick={() => setOpen(!open)}
              className="toggleSortMenu"
            />
            {open && (
              <div className="rightMenu">
                {sort !== "createdAt" && (
                  <span onClick={() => reSort("createdAt")}>Newest</span>
                )}
                {sort !== "sales" && (
                  <span onClick={() => reSort("sales")}>Best Selling</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ✅ Product Listings */}
        <div className="cards">
          {isLoading && <span>Loading...</span>}
          {error && <span className="error">Error: {error}</span>}
          {!isLoading && !error && data.length > 0 ? (
            data.map((product) => <GigCard key={product.productId} item={product} />)
          ) : (
            !isLoading && !error && <span>No products found.</span>
          )}
        </div>

        {/* ✅ Pagination Controls */}
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







