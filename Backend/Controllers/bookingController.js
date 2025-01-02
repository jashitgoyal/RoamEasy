import Booking from "../Models/Booking.js";
import { sendBookingEmail } from "../Utils/sendEmail.js";
import { verifyToken } from "../Utils/verifyToken.js";
import Stripe from "stripe";
// Initialize Stripe
const stripe = new Stripe(
  "sk_test_51QOv8nJnUcBaqM6WAVOSICHN5Uu64V6I6LJeCJWM7gnTyrP8VBzSQliYdt0RtwmxaV1Rg2ehakUWFag6dmtTlOiq00OC3RcVGS"
);

// export const createBooking = async (req, res) => {
//   verifyToken(req, res, async () => {
//     const { amount, ...bookingDetails } = req.body;

//     try {
//       // Step 1: Create Stripe Payment Intent
//       const paymentIntent = await stripe.paymentIntents.create({
//         amount: Math.round(amount * 100), // Amount in cents
//         currency: 'usd',
//         payment_method_types: ['card'],
//       });

//       // Step 2: Respond with Payment Intent clientSecret
//       res.status(200).json({
//         success: true,
//         message: 'Payment intent created successfully!',
//         clientSecret: paymentIntent.client_secret,
//       });

//       // Step 3: Save the booking details locally
//       const newBooking = new Booking({ ...bookingDetails, userId: req.user.id });
//       await newBooking.save();
//     } catch (error) {
//       console.error('Error creating payment intent:', error);
//       res.status(500).json({ success: false, message: 'Internal server error!' });
//     }
//   });
// };

export const createBooking = async (req, res) => {
  // console.log("create function called");
  const { id } = req.params; // Get user ID from params
  const { amount, ...bookingDetails } = req.body;
  // console.log("booking details         ",bookingDetails);

  try {
    // Step 1: Create Stripe Payment Intent
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: Math.round(amount * 100), // Amount in cents
    //   currency: 'usd',
    //   payment_method_types: ['card'],
    // });

    // const res=await Booking.create({...bookingDetails})
    // console.log(res);

    // Step 2: Respond with Payment Intent clientSecret
    // res.status(200).json({
    //   success: true,
    //   message: 'Payment intent created successfully!',
    //   clientSecret: paymentIntent.client_secret,
    // });

    // Step 3: Save the booking details locally
    const newBooking = new Booking({ ...bookingDetails }); // Use ID from params
    await newBooking.save();
    res.status(200).json({
      message: "sucess",
      newBooking,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
};
export const sendBookingDetails = async (req, res) => {
  try {
    // console.log("sendbooking fun",req.body)
    console.log("heelooo in send bbokkkkking");
    const bookingDetails = req.body;
    console.log(bookingDetails);

    // if (!bookingDetails || !bookingDetails.userEmail) {
    //   return res.status(400).send('Missing required booking details or email');
    // }

    // Send email with the booking details
    await sendBookingEmail(bookingDetails.userEmail, bookingDetails);

    // Respond to the client
    res.status(200).send("Booking confirmed and email sent!");
  } catch (error) {
    console.error("Error processing booking or sending email:", error.message);
    res.status(500).send("Error processing booking or sending email");
  }
};
export const getBooking = async (req, res) => {
  verifyToken(req, res, async () => {
    const id = req.params.id;

    try {
      const booking = await Booking.findById(id);

      if (booking && booking.userId === req.user.id) {
        res
          .status(200)
          .json({ success: true, message: "Successful!", data: booking });
      } else {
        res.status(404).json({
          success: false,
          message: "Booking not found or unauthorized access!",
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error!" });
    }
  });
};

// Get all bookings for the authenticated user
export const getAllBooking = async (req, res) => {
  verifyToken(req, res, async () => {
    try {
      const bookings = await Booking.find({ userId: req.user.id });
      res
        .status(200)
        .json({ success: true, message: "Successful!", data: bookings });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Internal server error!" });
    }
  });
};

export const getstripeasync = async (req, res) => {
  let { amount } = req.body;
  amount = Math.round(amount * 100);
  console.log(amount);

  if (!amount) {
    return res.status(400).json({ error: "Amount is required" });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency: "usd", // Replace with your currency if different
      payment_method_types: ["card"],
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
};
