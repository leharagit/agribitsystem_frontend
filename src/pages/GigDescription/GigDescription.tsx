import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./GigDescription.scss";

interface Product {
  name: string;
  description: string;
  startBidPrice: number;
  quantity: number;
  quality: string;
  contentType: string;
  image: string;
}

function GigDescription() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(`http://localhost:8080/api/products/${productId}`);
        setProduct(response.data);
      } catch (err) {
        setError((err instanceof Error && err.message) ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (isLoading) return <span>Loading...</span>;
  if (error) return <span>Error: {error}</span>;

  return (
    <div className="gig-description">
      {product ? (
        <>
          <h1>{product.name}</h1>
          <img
            src={`data:${product.contentType};base64,${product.image}`}
            alt={product.name}
            className="img-fluid"
            style={{ height: "280px", width: "40%" }}
          />
          <p>{product.description}</p>
          <span>Price: ${product.startBidPrice}</span>
          <span>Quantity: {product.quantity}</span>
          <span>Quality: {product.quality}</span>
        </>
      ) : (
        <span>Product not found.</span>
      )}
    </div>
  );
}

export default GigDescription;
