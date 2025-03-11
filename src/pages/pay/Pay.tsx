import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import "./Pay.scss";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// ✅ Load Stripe with your actual **Public Key**
const stripePromise = loadStripe("your-stripe-public-key");

const Pay: React.FC = () => {
  const { id } = useParams(); // ✅ Get bid ID  
  const location = useLocation();
  const navigate = useNavigate(); // ✅ Initialize navigation
  const { bidId, productId, productName, totalAmount } = location.state || {};

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");

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
    const method = event.target.value;
    setSelectedPaymentMethod(method);

    if (method === "card") {
      // ✅ Redirect to `AddPayment` component when selecting Credit Card Payment
      navigate("/crad", {
        state: { productId, productName, totalAmount }
      });
    }
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
          /> Credit Card Payment (Stripe)
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
      {selectedPaymentMethod === "bank" && <BankTransferInstructions />}
      {selectedPaymentMethod === "cod" && <CashOnDeliveryConfirmation />}
    </div>
  );
};

export default Pay;

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
