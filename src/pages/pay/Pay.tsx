import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // ✅ Import useLocation to read state
import "./Pay.scss";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../../components/checkoutForm/CheckoutForm";

// Load Stripe with your public key
const stripePromise = loadStripe("paste your public key");

interface PaymentDetails {
  transactionId: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
}

const Pay: React.FC = () => {
  const location = useLocation();
  const { productId, productName, totalAmount } = location.state || {}; // ✅ Read state from navigation

  const [clientSecret, setClientSecret] = useState<string>("");
  const [payment, setPayment] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId || !totalAmount) {
      setError("Invalid payment details. Please try again.");
      setLoading(false);
      return;
    }

    const fetchPaymentIntent = async () => {
      try {
        // Create a payment intent via your backend
        const intentResponse = await fetch(
          `http://localhost:8080/api/payments/create-payment-intent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ productId, totalAmount }),
          }
        );
        if (!intentResponse.ok) {
          throw new Error("Failed to create payment intent");
        }
        const intentData = await intentResponse.json();
        setClientSecret(intentData.clientSecret); // ✅ Set Stripe client secret
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentIntent();
  }, [productId, totalAmount]);

  const appearance = {
    theme: "stripe" as "stripe",
    variables: { colorPrimary: "#1dbf73", fontFamily: "Arial, sans-serif" },
  };

  const options = { clientSecret, appearance };

  if (loading) {
    return (
      <div className="pay d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pay d-flex justify-content-center align-items-center vh-100">
        <div className="alert alert-danger">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="pay">
      <div className="payment-details mb-4 text-center">
        <h2>Payment Details</h2>
        <p><strong>Product:</strong> {productName}</p>
        <p><strong>Total Amount:</strong> LKR {totalAmount}</p>
      </div>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};

export default Pay;


