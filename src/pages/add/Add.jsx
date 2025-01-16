import React, { useState } from "react";
import "./Add.scss";
import { useNavigate } from "react-router-dom";

const Add = () => {
  const [product, setProduct] = useState({
    productId: "",
    name: "",
    category: "",
    description: "",
    quantity: 0,
    quality: "",
    location: "",
    startBidPrice: 0.0,
    buyNowPrice: 0.0,
    size: "",
    status: "",
    productQuantity: 0,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!product.productId.trim()) newErrors.productId = "Product ID is required.";
    if (!product.name.trim()) newErrors.name = "Product Name is required.";
    if (!product.category) newErrors.category = "Category is required.";
    if (!product.startBidPrice || product.startBidPrice <= 0)
      newErrors.startBidPrice = "Start Bid Price must be greater than 0.";
    if (!product.buyNowPrice || product.buyNowPrice <= 0)
      newErrors.buyNowPrice = "Buy Now Price must be greater than 0.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        alert("Product created successfully!");
        navigate("/gigs"); // Navigate to the product list or relevant page
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Failed to create product. Please try again.");
    }
  };

  return (
    <div className="add">
      <div className="container">
        <h1>Add New Product</h1>
        <form onSubmit={handleSubmit}>
          {[
            { label: "Product ID", name: "productId", type: "text", placeholder: "Unique Product ID" },
            { label: "Name", name: "name", type: "text", placeholder: "Product Name" },
            { label: "Description", name: "description", type: "textarea", placeholder: "Product Description" },
            { label: "Quantity", name: "quantity", type: "number", placeholder: "Available Quantity" },
            { label: "Quality", name: "quality", type: "text", placeholder: "Product Quality" },
            { label: "Location", name: "location", type: "text", placeholder: "Product Location" },
            { label: "Start Bid Price", name: "startBidPrice", type: "number", placeholder: "Start Bid Price" },
            { label: "Buy Now Price", name: "buyNowPrice", type: "number", placeholder: "Buy Now Price" },
            { label: "Size", name: "size", type: "text", placeholder: "Product Size or Dimensions" },
            { label: "Status", name: "status", type: "text", placeholder: "Status (e.g., Available, Sold)" },
            { label: "Stock Quantity", name: "productQuantity", type: "number", placeholder: "Stock Quantity" },
          ].map((field) => (
            <div className="form-group" key={field.name}>
              <label htmlFor={field.name}>{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  id={field.name}
                  placeholder={field.placeholder}
                  value={product[field.name]}
                  onChange={handleChange}
                  required
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  id={field.name}
                  placeholder={field.placeholder}
                  value={product[field.name]}
                  onChange={handleChange}
                  required
                />
              )}
              {errors[field.name] && <span className="error">{errors[field.name]}</span>}
            </div>
          ))}

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              name="category"
              id="category"
              value={product.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="coconuts">Coconuts</option>
              <option value="fish">Fish</option>
              <option value="meat">Meat</option>
            </select>
            {errors.category && <span className="error">{errors.category}</span>}
          </div>

          <button type="submit">Create Product</button>
        </form>
      </div>
    </div>
  );
};

export default Add;


