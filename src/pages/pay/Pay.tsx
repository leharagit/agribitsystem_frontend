import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom"; 
import "./Pay.scss";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// ✅ Load Stripe with your actual **Public Key**
const stripePromise = loadStripe("your-stripe-public-key");

const Pay: React.FC = () => {
  const { id } = useParams(); // ✅ Get bid ID
  const location = useLocation();
  const { bidId, productId, productName, totalAmount } = location.state || {};

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("card");

  useEffect(() => {
    if (!productId || !totalAmount) {
      setError("Invalid payment details. Please try again.");
      setLoading(false);
      return;
    }

    const fetchPaymentIntent = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/payments/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, totalAmount }),
        });

        if (!response.ok) {
          throw new Error("Failed to create payment intent.");
        }

        const intentData = await response.json();
        setClientSecret(intentData.clientSecret);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentIntent();
  }, [productId, totalAmount]);

  const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPaymentMethod(event.target.value);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="pay">
      <h2>Payment for {productName}</h2>
      <p>Total Amount: LKR {totalAmount}</p>

      {/* ✅ Payment Method Selection */}
      <div className="payment-options">
        <label>
          <input 
            type="radio" 
            value="card" 
            checked={selectedPaymentMethod === "card"} 
            onChange={handlePaymentMethodChange} 
          /> Card Payment (Stripe)
        </label>

        <label>
          <input 
            type="radio" 
            value="bank" 
            checked={selectedPaymentMethod === "bank"} 
            onChange={handlePaymentMethodChange} 
          /> Bank Transfer
        </label>

        <label>
          <input 
            type="radio" 
            value="cod" 
            checked={selectedPaymentMethod === "cod"} 
            onChange={handlePaymentMethodChange} 
          /> Cash on Delivery (COD)
        </label>
      </div>

      {/* ✅ Render Payment Option Based on Selection */}
      {selectedPaymentMethod === "card" && clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm clientSecret={clientSecret} />
        </Elements>
      )}

      {selectedPaymentMethod === "bank" && (
        <BankTransferInstructions />
      )}

      {selectedPaymentMethod === "cod" && (
        <CashOnDeliveryConfirmation />
      )}
    </div>
  );
};

export default Pay;

/* ✅ CheckoutForm for Card Payment */
interface CheckoutFormProps {
  clientSecret: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
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

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret || "", {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      setError(error.message || "Payment failed.");
    } else if (paymentIntent?.status === "succeeded") {
      setSuccess(true);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Enter Card Details</h3>
      <CardElement />
      <button type="submit" disabled={!stripe || loading} className="btn btn-primary mt-3">
        {loading ? "Processing..." : "Pay Now"}
      </button>
      {error && <p className="text-danger">{error}</p>}
      {success && <p className="text-success">Payment Successful!</p>}
    </form>
  );
};

/* ✅ Bank Transfer Instructions */
const BankTransferInstructions: React.FC = () => {
  return (
    <div className="bank-transfer">
      <h3>Bank Transfer Instructions</h3>
      <p>Please transfer the total amount to the following account:</p>
      <p><strong>Bank Name:</strong> ABC Bank</p>
      <p><strong>Account Number:</strong> 123456789</p>
      <p><strong>Branch:</strong> Colombo Main Branch</p>
      <p><strong>SWIFT Code:</strong> ABCD1234</p>
      <p>Once you have completed the transfer, please send the payment confirmation to <strong>payments@yourcompany.com</strong>.</p>
    </div>
  );
};

/* ✅ Cash on Delivery Confirmation */
const CashOnDeliveryConfirmation: React.FC = () => {
  return (
    <div className="cash-on-delivery">
      <h3>Cash on Delivery</h3>
      <p>You have chosen to pay in cash upon delivery. Our delivery partner will collect the payment when delivering your product.</p>
      <p>Thank you for your order!</p>
    </div>
  );
};

