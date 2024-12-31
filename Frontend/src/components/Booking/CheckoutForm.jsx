// import React, { useState } from 'react';
// import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
// import { useNavigate } from 'react-router-dom'; 
// import { BASE_URL } from '../../utils/config';
// // import "./checkoutForm.css"
// const CheckoutForm = ({ totalAmount, booking }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const navigate = useNavigate();
//   const [processing, setProcessing] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!stripe || !elements) {
//       alert('Stripe has not loaded yet.');
//       return;
//     }

//     const cardElement = elements.getElement(CardElement);
//     const { error, paymentMethod } = await stripe.createPaymentMethod({
//       type: 'card',
//       card: cardElement,
//     });

//     if (error) {
//       console.error(error.message);
//       alert(error.message);
//       return;
//     }

//     setProcessing(true);

//     try {
//       const response = await fetch(`${BASE_URL}/booking/payment-intent`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ amount: totalAmount*100  }),
//       });
      

//       const { clientSecret } = await response.json();

//       const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: paymentMethod.id,
//       });

//       if (confirmError) {
//         console.error(confirmError.message);
//         throw new Error(confirmError.message);
//       }


//       if (paymentIntent.status === 'succeeded') {
//         console.log("inside booking if")

//         await fetch(`${BASE_URL}/booking`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             ...booking,
//             paymentIntentId: paymentIntent.id,
//           }),
//         });
       
//         // ----------------------mail---------------------------------
//         const emailResponse = await fetch(`${BASE_URL}/booking/send-mail`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             ...booking,
//             totalAmount
          
//           }),
//         });
        

//         if (!emailResponse.ok) {
//           console.error('Failed to send confirmation email');
//         } else {
//           console.log('Confirmation email sent successfully');
//         }
//         // -------------------------------mail----------------------------------
//         alert('Booking confirmed!');
        
//         navigate('/thank-you');
//       }
//     } catch (error) {
//       console.error(error.message);
//       alert(error.message);
//     } finally {
//       setProcessing(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <CardElement />
//       <button type="submit" disabled={processing || !stripe}>
//         {processing ? 'Processing...' : 'Pay Now'}
//       </button>
//     </form>
//   );
// };
// export default CheckoutForm;
import React, { useState } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom'; 
import { BASE_URL } from '../../utils/config';
import "./checkoutForm.css"
const CheckoutForm = ({ totalAmount, booking }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      alert('Stripe has not loaded yet.');
      return;
    }

    const cardElement = elements.getElement(CardNumberElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.error(error.message);
      alert(error.message);
      return;
    }

    setProcessing(true);

    try {
      const response = await fetch(`${BASE_URL}/booking/payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: totalAmount*1  }),
      });
      

      const { clientSecret } = await response.json();

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (confirmError) {
        console.error(confirmError.message);
        throw new Error(confirmError.message);
      }


      if (paymentIntent.status === 'succeeded') {
        console.log("inside booking if")

        await fetch(`${BASE_URL}/booking`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...booking,
            paymentIntentId: paymentIntent.id,
          }),
        });
       
        // ----------------------mail---------------------------------
        const emailResponse = await fetch(`${BASE_URL}/booking/send-mail`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...booking,
            totalAmount
          
          }),
        });
        

        if (!emailResponse.ok) {
          console.error('Failed to send confirmation email');
        } else {
          console.log('Confirmation email sent successfully');
        }
        // -------------------------------mail----------------------------------
        alert('Booking confirmed!');
        
        navigate('/thank-you');
      }
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="card-number">Card Number</label>
        <CardNumberElement
          id="card-number"
          options={{
            style: {
              base: {
                color: '#424770',
                fontFamily: 'Arial, sans-serif',
                fontSize: '16px',
                '::placeholder': { color: '#aab7c4' },
              },
              invalid: { color: '#9e2146' },
            },
          }}
        />
      </div>

      <div className="form-group">
        <label htmlFor="card-expiry">Expiration Date</label>
        <CardExpiryElement
          id="card-expiry"
          options={{
            style: {
              base: {
                color: '#424770',
                fontFamily: 'Arial, sans-serif',
                fontSize: '16px',
                '::placeholder': { color: '#aab7c4' },
              },
              invalid: { color: '#9e2146' },
            },
          }}
        />
      </div>

      <div className="form-group">
        <label htmlFor="card-cvc">CVC</label>
        <CardCvcElement
          id="card-cvc"
          options={{
            style: {
              base: {
                color: '#424770',
                fontFamily: 'Arial, sans-serif',
                fontSize: '16px',
                '::placeholder': { color: '#aab7c4' },
              },
              invalid: { color: '#9e2146' },
            },
          }}
        />
      </div>

      <button type="submit" disabled={processing || !stripe} className="pay-now-button">
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};
export default CheckoutForm;