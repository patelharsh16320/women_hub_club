import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';

export default function StripeCheckoutForm({ onPaymentSuccess, disabled }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setProcessing(true);

    // If parent checkout says form is disabled (required fields missing), prevent submit
    if (disabled) {
      setError('Please fill name, email and address before proceeding with card payment');
      setProcessing(false);
      return;
    }
    if (!stripe || !elements) {
      setError('Stripe not loaded');
      setProcessing(false);
      return;
    }

    // Simulate payment in test mode
    setTimeout(() => {
      setProcessing(false);
      onPaymentSuccess({
        paymentMethod: 'stripe',
        paymentStatus: 'paid',
        paymentId: 'test_' + Math.random().toString(36).slice(2, 10)
      });
    }, 1200);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
      <CardElement options={{ hidePostalCode: true }} />
      {error && <div className="text-danger small mt-2">{error}</div>}
      <button
        type="submit"
        className="btn btn-dark w-100 mt-3"
        disabled={disabled || !stripe || !elements || processing}
      >
        {processing ? 'Processing...' : 'Pay with Stripe'}
      </button>
    </form>
  );
}