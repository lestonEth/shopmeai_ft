import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

// Modal component to display the CheckoutForm
const PaymentModal = ({ amount, onClose, show }) => {
    if (!show) return null;
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) {
            return; // Stripe.js has not yet loaded
        }

        setLoading(true);

        // Step 1: Create payment intent on the backend
        const response = await fetch("http://localhost:3001/create-payment-intent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount }), // Pass the amount (in cents)
        });

        const { clientSecret } = await response.json();

        // Step 2: Confirm payment using Stripe's client-side library
        const cardElement = elements.getElement(CardElement);
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardElement,
                billing_details: {
                    name: "ShopMeai", // You can change this to dynamic user data
                },
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else if (paymentIntent.status === "succeeded") {
            alert("Payment successful!");
            setLoading(false);
            onClose(); // Close modal on success
        }
    };

    // Styling options for the CardElement
    const cardElementOptions = {
        style: {
            base: {
                color: "white", // Text color inside the card input
                fontSize: "16px", // Font size of the card number and details
                fontFamily: "'Arial', sans-serif", // Font family for the text
                fontWeight: 400, // Font weight
                lineHeight: "24px", // Line height
                padding: "12px", // Padding inside the input
                borderRadius: "8px", // Border radius for rounded corners
            },

            //  base placeholder styles
            placeholder: {
                color: "white", // Placeholder text color
            },

            invalid: {
                color: "#f44336", // Color for invalid input (red)
                iconColor: "#f44336", // Icon color for invalid input (red)
            },
        },
    };

    return (
        <div className="fixed inset-0 bg-black flex justify-center items-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="bg-gray-600 p-8 rounded-lg max-w-lg w-full shadow-lg text-center">
                <h2 className="text-white text-2xl mb-4">Complete Payment</h2>
                <p className="text-white mb-4">Enter your card details to pay ${amount}</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 text-white">
                        {/* CardElement with Tailwind styles and custom options */}
                        <CardElement options={cardElementOptions} />
                    </div>
                    <button
                        type="submit"
                        disabled={!stripe || loading}
                        className="bg-green-500 text-white px-6 py-2 rounded-lg w-full hover:bg-green-600"
                    >
                        {loading ? "Processing..." : "Pay Now"}
                    </button>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    <button
                        type="button"
                        onClick={onClose} // Close the modal
                        className="mt-4 bg-gray-600 text-white px-6 py-2 rounded-lg w-full hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;
