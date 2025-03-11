import React, { useState, useEffect } from "react";
import "./Add.scss";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Add = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

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
    userId: "",
  });

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      const { userId } = JSON.parse(currentUser);
      setProduct((prev) => ({ ...prev, userId }));
    }

    if (productId) {
      axios
        .get(`http://localhost:8080/api/products/${productId}`)
        .then((response) => {
          setProduct(response.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("product", JSON.stringify(product));
    if (image) {
      formData.append("image", image);
    }

    try {
      const token = localStorage.getItem("currentUser")
        ? JSON.parse(localStorage.getItem("currentUser")).token
        : null;

      let response;
      if (productId) {
        response = await axios.put(`http://localhost:8080/api/products/${productId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        response = await axios.post("http://localhost:8080/api/products", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (response.status === 200) {
        alert(productId ? "Product updated successfully!" : "Product created successfully!");
        navigate("/gigs");
      }
    } catch {
      alert("Failed to save product. Please try again.");
    }
  };

  return loading ? (
    <p>Loading...</p>
  ) : (
    <div className="add">
      <div className="container">
        <h1>{productId ? "Edit Product" : "Add New Product"}</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Product Name" value={product.name} onChange={handleChange} required />
          <textarea name="description" placeholder="Product Description" value={product.description} onChange={handleChange} required />
          <input type="number" name="startBidPrice" placeholder="Start Bid Price" value={product.startBidPrice} onChange={handleChange} required />
          <input type="number" name="buyNowPrice" placeholder="Buy Now Price" value={product.buyNowPrice} onChange={handleChange} required />
          <select name="category" value={product.category} onChange={handleChange} required>
            <option value="">Select a category</option>
            <option value="vegetables">Vegetables</option>
            <option value="fruits">Fruits</option>
          </select>
          <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
          <button type="submit">{productId ? "Update Product" : "Create Product"}</button>
        </form>
      </div>
    </div>
  );
};

export default Add;

