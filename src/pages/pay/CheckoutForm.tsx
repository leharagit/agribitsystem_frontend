import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";

const CheckoutForm: React.FC<{ clientSecret: string }> = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe is not initialized. Please refresh the page.");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError("Card element not found.");
      setLoading(false);
      return;
    }

    // ✅ Confirm payment with Stripe
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      setError(error.message || "Payment failed.");
    } else if (paymentIntent?.status === "succeeded") {
      setSuccess(true);
      setTimeout(() => navigate("/success"), 2000); // ✅ Redirect after success
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <h3>Enter Card Details</h3>
      <CardElement className="card-element" />
      <button type="submit" disabled={!stripe || loading} className="btn btn-primary mt-3">
        {loading ? "Processing..." : "Pay Now"}
      </button>
      {error && <p className="text-danger">{error}</p>}
      {success && <p className="text-success">Payment Successful! Redirecting...</p>}
    </form>
  );
};

export default CheckoutForm;







