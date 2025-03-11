import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // ✅ Import useLocation
import axios from "axios";
import "./AddPayment.scss"; // Import styling

const AddPayment: React.FC = () => {
  const location = useLocation();
  const { totalAmount } = location.state || { totalAmount: "0.00" }; // ✅ Get totalAmount from Pay.tsx

  const [payment, setPayment] = useState({
    cardType: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cardHolder: "",
    email: "",
    amount: totalAmount, // ✅ Set total amount dynamically
    agreeTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setPayment({
      ...payment,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!payment.agreeTerms) {
      setError("You must agree to the terms and conditions.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/payments", payment);
      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        setPayment({
          ...payment,
          cardType: "",
          cardNumber: "",
          expiryMonth: "",
          expiryYear: "",
          cardHolder: "",
          email: "",
          agreeTerms: false,
        });
      }
    } catch (err) {
      setError("Failed to process payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-payment-container">
      <div className="payment-header">
        <h2>Payment Details</h2>
        <div className="card-logos">
          <img src="/img/visa.png" alt="Visa" />
          <img src="/img/master.png" alt="MasterCard" />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Card Type Dropdown */}
        <div className="form-group">
          <label>Card Type*</label>
          <select name="cardType" value={payment.cardType} onChange={handleChange} required>
            <option value="">--- Select Card Type ---</option>
            <option value="Visa">Visa</option>
            <option value="MasterCard">MasterCard</option>
          </select>
        </div>

        {/* Card Number */}
        <div className="form-group">
          <label>Card Number*</label>
          <input
            type="text"
            name="cardNumber"
            value={payment.cardNumber}
            onChange={handleChange}
            placeholder="Enter Card Number"
            maxLength={16}
            required
          />
        </div>

        {/* Expiry Date */}
        <div className="form-group expiry-date">
          <label>Expiry Date*</label>
          <select name="expiryMonth" value={payment.expiryMonth} onChange={handleChange} required>
            <option value="">--- Month ---</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>

          <select name="expiryYear" value={payment.expiryYear} onChange={handleChange} required>
            <option value="">--- Year ---</option>
            {[...Array(10)].map((_, i) => (
              <option key={i} value={2024 + i}>
                {2024 + i}
              </option>
            ))}
          </select>
        </div>

        {/* Card Holder */}
        <div className="form-group">
          <label>Card Holder*</label>
          <input
            type="text"
            name="cardHolder"
            value={payment.cardHolder}
            onChange={handleChange}
            placeholder="Enter Cardholder Name"
            required
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email*</label>
          <input
            type="email"
            name="email"
            value={payment.email}
            onChange={handleChange}
            placeholder="Enter Email"
            required
          />
        </div>

        {/* Amount */}
        <div className="form-group">
          <label>Amount to be charged to card:</label>
          <input type="text" name="amount" value={`LKR ${payment.amount}`} disabled />
        </div>

        {/* Terms and Conditions */}
        <div className="form-group terms">
          <input
            type="checkbox"
            name="agreeTerms"
            checked={payment.agreeTerms}
            onChange={handleChange}
            required
          />
          <label>I have read and agree to the terms and conditions.</label>
        </div>

        {/* Buttons */}
        <div className="form-buttons">
          <button type="submit" className="continue-btn" disabled={loading}>
            {loading ? "Processing..." : "Continue"}
          </button>
        </div>

        {/* Error and Success Messages */}
        {error && <p className="error">{error}</p>}
        {success && <p className="success">Payment processed successfully!</p>}
      </form>
    </div>
  );
};

export default AddPayment;

