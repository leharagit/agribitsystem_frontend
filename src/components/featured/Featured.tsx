import React, { useState } from "react";
import "./Featured.scss";
import { useNavigate } from "react-router-dom";

const Featured: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [category, setCategory] = useState<string>(""); // ✅ Category state
  const navigate = useNavigate();

  const handleSubmit = () => {
    // ✅ Include both search term and category in the URL query
    const query = `search=${input}${category ? `&category=${category}` : ""}`;
    navigate(`/gigs?${query}`);
  };

  return (
    <div className="featured">
      <div className="container">
        <div className="left">
          <h1>
            Find the perfect <span>Product</span> at a Reasonable Price
          </h1>
          
          {/* ✅ Search Bar */}
          <div className="search">
            <div className="searchInput">
              <img src="./img/search.png" alt="Search" />
              <input
                type="text"
                placeholder='Try "Bid Now"'
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
          </div>

          {/* ✅ Category Dropdown */}
          <div className="categoryFilter">
            <select onChange={(e) => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              <option value="coconuts">Coconuts</option>
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="meat">Meat</option>
              <option value="fish">Fish</option>
            </select>
            <button onClick={handleSubmit}>Search</button>
          </div>

          {/* ✅ Popular Categories */}
          <div className="popular">
            <span>Popular:</span>
            <button onClick={() => navigate("/gigs?category=coconuts")}>Coconuts</button>
            <button onClick={() => navigate("/gigs?category=vegetables")}>Vegetables</button>
            <button onClick={() => navigate("/gigs?category=fruits")}>Fruits</button>
            <button onClick={() => navigate("/gigs?category=meat")}>Meat</button>
          </div>
        </div>

        <div className="right">
          <img src="./img/veg.png" alt="Vegetables" />
        </div>
      </div>
    </div>
  );
};

export default Featured;


