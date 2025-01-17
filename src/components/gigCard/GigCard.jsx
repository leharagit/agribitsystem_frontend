import React from "react";
import "./GigCard.scss";
import { Link } from "react-router-dom";

function GigCard({ item }) {
  return (
    <Link to={`/description/${item.productId}`} className="gigCard">
      <div className="gigCard">
      <img
                  src={`data:${item.contentType};base64,${item.image}`}
                  alt={item.name}
                  className="img-fluid"
                  style={{ height: "280px", width: "100%" }}
                />
        <div className="info">
          <h2>Iteam:   {item.name}</h2>
          <h2>ProductId:   {item.productId}</h2>
          <h3>Min bid Price:   {item.startBidPrice}</h3>
          
          <span>Category:  {item.category}</span>
          <h2>{item.status}</h2>
          <h3>Quantity:   {item.quantity}</h3>
          <p>Description:  {item.description}</p>

        </div>
      </div>
    </Link>
  );
}

export default GigCard;

